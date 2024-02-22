import { BrowserWindow } from "electron";
import wait from "./wait";
import { setUserAgent } from "./user-agent";
import { postToMain } from "./main-window";

const TIMETABLE_GRE_AC_UK = "https://timetable.gre.ac.uk/";

let loginWindow: BrowserWindow | null = null;

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

export const runLoginFlow = async (): Promise<boolean> => {
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

  let url = "";
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
      }),
  );
};
