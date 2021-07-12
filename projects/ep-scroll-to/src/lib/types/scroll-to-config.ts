export type ScrollToConfig = {
  duration?: number;
  offset?: number;
  easing?: string;
  onEnd?: (...args: any[] | null) => void;
  onStart?: (...args: any[] | null) => void;
  onBreak?: (...args: any[] | null) => void;
};
