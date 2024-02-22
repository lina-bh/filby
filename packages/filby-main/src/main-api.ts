import { ipcMain } from "electron";

import { runLoginFlow } from "./login-window";
import { readActivities, fetchActivities } from "./data-loading";
import { createICSData, writeICSData } from "./calendar-file";

export const registerIPCListeners = () => {
  ipcMain.handle("run-login", runLoginFlow);
  ipcMain.handle("fetch-activities", (_event, term) => fetchActivities(term));
  ipcMain.handle("create-calendar", (_event) => createICSData());
  ipcMain.handle("read-activities", (_event) => readActivities());
  ipcMain.handle("write-calendar", (_event) => writeICSData());
};
