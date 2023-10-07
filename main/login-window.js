"use strict";
const { BrowserWindow } = require("electron");
const wait = require("./wait.js");
const { setUserAgent } = require("./user-agent.js");
const { postToMain } = require("./main-window.js");

const TIMETABLE_GRE_AC_UK = "https://timetable.gre.ac.uk/";

let loginWindow = null;

const makeLoginWindow = async () => {
  if (loginWindow && !loginWindow.isDestroyed()) {
    return;
  }

  const window = new BrowserWindow({
    // parent: mainWindow,
    width: 400,
    height: 700,
    resizable: false,
    webPreferences: { partition: "login" },
  });

  window.webContents.on("did-finish-load", async () => {
    const url = window.webContents.getURL();
    if (url === TIMETABLE_GRE_AC_UK) {
      await wait(1000);
      window.close();
      postToMain("cookies-loaded");
    }
  });

  window.webContents.once("did-finish-load", () => {
    setUserAgent(window.webContents.userAgent);
  });

  window.on("closed", () => {
    loginWindow = null;
  });

  await window.loadURL(TIMETABLE_GRE_AC_UK);
  loginWindow = window;
};

const runLoginFlow = async () => {
  const window = new BrowserWindow({
    // parent: mainWindow,
    width: 400,
    height: 700,
    resizable: false,
    webPreferences: { partition: "login" },
  });

  window.webContents.once("did-finish-load", () => {
    setUserAgent(window.webContents.userAgent);
  });

  let url;
  window.webContents.on("did-finish-load", async () => {
    url = window.webContents.getURL();
    if (url === TIMETABLE_GRE_AC_UK) {
      await wait(1000);
      window.close();
    }
  });

  return window.loadURL(TIMETABLE_GRE_AC_UK).then(
    () =>
      new Promise((r, x) => {
        window.on("closed", () => {
          r(url === TIMETABLE_GRE_AC_UK);
        });
      })
  );
};

module.exports = { makeLoginWindow, runLoginFlow };
