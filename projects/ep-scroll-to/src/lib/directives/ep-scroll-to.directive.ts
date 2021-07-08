import { SCROLL_TO_GLOBAL_CONFIG } from './../tokens/config-token';
import { ScrollToConfig } from './../types/scroll-to-config';
import { EpScrollToService } from './../services/ep-scroll-to.service';
import { DOCUMENT } from '@angular/common';
import { Directive, HostListener, Inject, Input, Optional, Renderer2 } from '@angular/core';

/** @dynamic */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ep-st]',
})
export class EpScrollToDirective {
  @Input('ep-st') epScrollToTarget: string | number = 100;
  @Input() epStEasing: string;
  @Input() epStDuration: number;
  @Input() epStOffset: number;
  @Input() epStOnStartScrolling: (...args: any[] | null) => void;
  // @Input() epStOnStartScrollingParams: Array<any> = null;
  @Input() epStOnEndScrolling: (...args: any[] | null) => void;
  // @Input() epStOnEndScrollingParams: Array<any> = null;
  @Input() epStOnBreakScrolling: (...args: any[] | null) => void;
  // @Input() epStOnBreakScrollingParams: Array<any> = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private epScrollToService: EpScrollToService,
    @Optional() @Inject(SCROLL_TO_GLOBAL_CONFIG) private globalConfig: ScrollToConfig,
    private renderer: Renderer2
  ) {}

  @HostListener('click', ['$event']) onClick = e => {
    e.preventDefault();

    let target: number | HTMLElement = null;

    if (typeof this.epScrollToTarget === 'string') {
      target = this.renderer.selectRootElement(this.epScrollToTarget);
    } else if (typeof this.epScrollToTarget === 'number') {
      target = this.epScrollToTarget;
    } else {
      return false;
    }

    const directiveConfig: ScrollToConfig = {};

    if (this.epStDuration) {
      directiveConfig.duration = this.epStDuration;
    }
    if (this.epStOffset) {
      directiveConfig.offset = this.epStOffset;
    }
    if (this.epStEasing) {
      directiveConfig.easing = this.epStEasing;
    }
    if (this.epStOnStartScrolling) {
      directiveConfig.onStart = this.epStOnStartScrolling;
    }
    if (this.epStOnEndScrolling) {
      directiveConfig.onEnd = this.epStOnEndScrolling;
    }
    if (this.epStOnBreakScrolling) {
      directiveConfig.onBreak = this.epStOnBreakScrolling;
    }

    this.epScrollToService.scrollTo(target, directiveConfig);
  };
}
