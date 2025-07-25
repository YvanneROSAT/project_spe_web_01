export interface Page {
  html: string;
  onLoad?: () => void | Promise<void>;
  onDestroy?: () => void | Promise<void>;
}
