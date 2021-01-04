import { InjectionToken } from '@angular/core';

export const SCROLL_TO_WINDOW = new InjectionToken<Window>('SCROLL_TO_WINDOW', {
  providedIn: 'root',
  factory: () => window,
});
