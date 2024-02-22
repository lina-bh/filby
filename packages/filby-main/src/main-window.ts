import { BrowserWindow } from "electron";
import * as path from "node:path";

let mainWindow: BrowserWindow | null = null;

export const makeMainWindow = async (url) => {
  mainWindow = new BrowserWindow({
    webPreferences: { preload: path.join(__dirname, "renderer-api.js") },
  });
  await mainWindow.loadURL(url);
};

export const postToMain = (key: string, ...args: unknown[]) => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    throw new Error("tried to send message to destroyed main window");
  }
  return mainWindow.webContents.send.apply(null, [key, ...args]);
};

export const getMainWindow = () => mainWindow!;
