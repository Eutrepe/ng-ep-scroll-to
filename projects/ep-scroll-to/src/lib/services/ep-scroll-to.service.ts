import { SCROLL_TO_WINDOW } from './../tokens/window-token';
import { ScrollToConfig } from './../types/scroll-to-config';
import { SCROLL_TO_GLOBAL_CONFIG } from './../tokens/config-token';
import { Inject, Injectable, Optional } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
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


  constructor(
    @Inject(SCROLL_TO_WINDOW) private window: Window,
    @Inject(DOCUMENT) private document: Document,
    @Optional() @Inject(SCROLL_TO_GLOBAL_CONFIG) private globalConfig: ScrollToConfig,
  ) {
    if (!this.window) {
      this.window = this.document.defaultView;
    }
   }

   public scrollTo = (
    target: HTMLElement | number,
    config?: ScrollToConfig): void => {

      this.settings = { ...this.defaultConfig, ...this.globalConfig, ...config };

      if (this.settings.onStart && typeof this.settings.onStart === 'function') {
        this.settings.onStart();
      }
    }
}
