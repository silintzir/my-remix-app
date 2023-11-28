/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

interface Window {
  ENV: Record<string, string>;
  html2pdf: any;
}

declare module "crack-json";
