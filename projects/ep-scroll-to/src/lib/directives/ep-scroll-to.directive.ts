import { SCROLL_TO_GLOBAL_CONFIG } from './../tokens/config-token';
import { ScrollToConfig } from './../types/scroll-to-config';
import { EpScrollToService } from './../services/ep-scroll-to.service';
import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, HostListener, Inject, Input, OnInit, Optional } from '@angular/core';

/** @dynamic */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ep-st]'
})
export class EpScrollToDirective implements OnInit {
  @Input('ep-st') epScrollToTarget: ElementRef | string | number = 100;
  @Input() epStEasing: string;
  @Input() epStDuration: number;
  @Input() epStOffset: number;
  @Input() epStOnStartScrolling: (...args: any[] | null) => void
  // @Input() epStOnStartScrollingParams: Array<any> = null;
  @Input() epStOnEndScrolling: (...args: any[] | null) => void;
  // @Input() epStOnEndScrollingParams: Array<any> = null;
  @Input() epStOnBreakScrolling: (...args: any[] | null) => void;
  // @Input() epStOnBreakScrollingParams: Array<any> = null;


  private settings: ScrollToConfig = null;
  private defaultConfig: ScrollToConfig = {
    duration: 1000,
    offset: 0,
    easing: 'easeInOutQuad',
    onStart: null,
    onEnd: null,
    onBreak: null,
  };


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private epScrollToService: EpScrollToService,
    @Optional() @Inject(SCROLL_TO_GLOBAL_CONFIG) private globalConfig: ScrollToConfig
  ) { }

  @HostListener('click', ['$event']) onClick = (e) => {
    e.preventDefault();

    let target: number | HTMLElement = null;

    if (typeof(this.epScrollToTarget) === 'object' && this.epScrollToTarget.nativeElement) {
      target = this.epScrollToTarget.nativeElement as HTMLElement;
    } else if (typeof(this.epScrollToTarget) === 'string') {
      target = this.document.querySelector(this.epScrollToTarget as string) as HTMLElement;
    } else if (typeof(this.epScrollToTarget) === 'number') {
      target = this.epScrollToTarget
    } else {
      return false;
    }

    this.epScrollToService.scrollTo(
      target,
      {
        duration: this.settings.duration,
        offset: this.settings.offset,
        easing: this.settings.easing,
        onStart: this.settings.onStart,
        onEnd: this.settings.onEnd,
        onBreak: this.settings.onBreak,
      }
    );
  }

  ngOnInit(): void {
    this.settings = { ...this.defaultConfig, ...this.globalConfig, ...{
      duration: this.epStDuration,
      offset: this.epStOffset,
      easing: this.epStEasing,
      onStart: this.epStOnStartScrolling,
      onEnd: this.epStOnEndScrolling,
      onBreak: this.epStOnBreakScrolling,
    } };
  }
}
