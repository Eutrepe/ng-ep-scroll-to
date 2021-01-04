import { ScrollToConfig } from './../types/scroll-to-config';
import { InjectionToken } from '@angular/core';

export const SCROLL_TO_GLOBAL_CONFIG = new InjectionToken<ScrollToConfig>(
  'SCROLL_TO_GLOBAL_CONFIG'
);
