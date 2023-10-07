"use strict";
const { ipcMain } = require("electron");

const { makeLoginWindow, runLoginFlow } = require("./login-window.js");
const { readActivities, fetchActivities } = require("./data-loading.js");
const { createICSData } = require("./calendar-file.js");

const registerIPCListeners = () => {
  ipcMain.handle("run-login", runLoginFlow);
  ipcMain.handle("fetch-activities", (_event, term) => fetchActivities(term));
  ipcMain.handle("create-calendar", (_event) => createICSData());
  ipcMain.handle("read-activities", (_event) => readActivities());
  ipcMain.handle("write-calendar", (_event) => {});
};

module.exports = { registerIPCListeners };
