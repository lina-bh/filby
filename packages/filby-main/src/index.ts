import { app } from "electron";
import { dirname } from "node:path";
import { makeMainWindow } from "./main-window";
import { registerIPCListeners } from "./main-api";
import { registerAppProtocol } from "./path";

export const main = async (path: string) => {
  await app.whenReady();

  registerIPCListeners();
  registerAppProtocol(dirname(path));

  await makeMainWindow("app://host/");
};

// module.exports = { main };
