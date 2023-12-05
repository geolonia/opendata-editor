export type OpenDataEditorConfig = {
  /** Path to favicon. Favicon is not set by default. */
  favicon?: string;
  /** Organization name. This will be shown in the browser's title bar. */
  orgName?: string;
  /** Set true to deny crawling by search engines such as Google and Bing. */
  noIndex?: boolean;
  /** Path to output directory for the generated files. By default, `join(__dirname, 'dist')`. */
  outDir?: string;
};
