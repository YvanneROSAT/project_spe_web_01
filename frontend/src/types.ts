export interface Route {
  html: string;
  onLoad?: () => void | Promise<void>;
  onDestroy?: () => void | Promise<void>;
}
