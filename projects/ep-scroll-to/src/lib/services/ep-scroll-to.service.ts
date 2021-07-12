import { SCROLL_TO_WINDOW } from './../tokens/window-token';
import { ScrollToConfig } from './../types/scroll-to-config';
import { SCROLL_TO_GLOBAL_CONFIG } from './../tokens/config-token';
import { Inject, Injectable, Optional } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Easings } from '../utilities/easings';

@Injectable({
  providedIn: 'root',
})
export class EpScrollToService {
  private defaultConfig: ScrollToConfig = {
    duration: 1000,
    offset: 0,
    easing: 'easeInOutQuad',
    onStart: null,
    onEnd: null,
    onBreak: null,
  };

  private settings: ScrollToConfig = null;
  private raf: number;
  private easings = Easings;
  private start: number;
  private startTime: number;
  private isMoved = false;
  private isFinished = false;

  constructor(
    @Inject(SCROLL_TO_WINDOW) private window: Window,
    @Inject(DOCUMENT) private document: Document,
    @Optional() @Inject(SCROLL_TO_GLOBAL_CONFIG) private globalConfig: ScrollToConfig
  ) {
    if (!this.window) {
      this.window = this.document.defaultView;
    }
  }

  private clearRaf = () => {
    if (!this.isFinished && this.settings.onBreak && typeof this.settings.onBreak === 'function') {
      this.settings.onBreak();
    }

    this.window.cancelAnimationFrame(this.raf);
    this.window.removeEventListener('resize', this.clearRaf, false);
    this.window.removeEventListener('mousewheel', this.clearRaf, false);
    this.window.removeEventListener('DOMMouseScroll', this.clearRaf, false);
    this.isMoved = false;
  };

  public scrollTo = (target: HTMLElement | number, config?: ScrollToConfig): void => {
    this.isFinished = false;
    this.settings = { ...this.defaultConfig, ...this.globalConfig, ...config };

    if (this.settings.onStart && typeof this.settings.onStart === 'function') {
      this.settings.onStart();
    }

    if (this.isMoved) {
      this.clearRaf();
    }

    this.window.addEventListener('resize', this.clearRaf, false);
    this.window.addEventListener('mousewheel', this.clearRaf, false);
    this.window.addEventListener('DOMMouseScroll', this.clearRaf, false);

    this.start = this.window.pageYOffset;
    this.startTime = this.window.performance.now();

    const documentHeight = Math.max(
      this.document.body.scrollHeight,
      this.document.body.offsetHeight,
      this.document.documentElement.clientHeight,
      this.document.documentElement.scrollHeight,
      this.document.documentElement.offsetHeight
    );

    const windowHeight =
      this.window.innerHeight ||
      this.document.documentElement.clientHeight ||
      this.document.getElementsByTagName('body')[0].clientHeight;

    const destinationOffset: number = (typeof target === 'number' ? target : target.offsetTop) + this.settings.offset;
    const destinationOffsetToScroll: number = Math.round(
      documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset
    );

    this.scroll(this.settings.duration, this.settings.easing, destinationOffsetToScroll, this.settings.onEnd);
  };

  private scroll = (duration: number, easing: string, destinationOffsetToScroll: number, onEnd: () => void): void => {
    const now: number = this.window.performance.now();
    const time: number = Math.min(1, (now - this.startTime) / this.settings.duration);
    const timeFunction: number = this.easings[this.settings.easing](time);
    this.isMoved = true;

    this.window.scroll(0, Math.ceil(timeFunction * (destinationOffsetToScroll - this.start) + this.start));

    if (
      this.window.pageYOffset === destinationOffsetToScroll ||
      Math.abs(this.window.pageYOffset - destinationOffsetToScroll) <= 1 ||
      (this.window.pageYOffset <= 0 && destinationOffsetToScroll < 0)
    ) {
      this.isFinished = true;
      if (this.isMoved && this.settings.onEnd && typeof this.settings.onEnd === 'function') {
        // const arg = this.settings.onEndParams ? this.settings.onEndParams : [];
        this.settings.onEnd();
      }
      this.isMoved = false;
      this.clearRaf();
      return;
    }

    this.raf = this.window.requestAnimationFrame(() => {
      this.scroll(duration, easing, destinationOffsetToScroll, onEnd);
    });
  };
}
