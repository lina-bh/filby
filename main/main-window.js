"use strict";
const { BrowserWindow } = require("electron");
const path = require("node:path");

/** @type {BrowserWindow | null} */
let mainWindow = null;

/**
 * @returns {Promise<BrowserWindow>}
 */
const makeMainWindow = async () => {
  mainWindow = new BrowserWindow({
    webPreferences: { preload: path.join(__dirname, "renderer-api.js") },
  });
  await mainWindow.loadFile(path.join(__dirname, "../index.html"));
};

const postToMain = (...args) => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    throw new Error("tried to send message to destroyed main window");
  }
  return mainWindow.webContents.send(...args);
};

module.exports = { makeMainWindow, postToMain };
