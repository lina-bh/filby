/// <reference types="astro/client" />

import type { ElectronAPI } from "filby-main/dist/renderer-api";
declare global {
  const electronAPI: ElectronAPI;

  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
