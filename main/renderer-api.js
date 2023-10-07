"use strict";
const { ipcRenderer, ...electron } = require("electron");

const registerCallback = (key, callback) => {
  if (ipcRenderer.listenerCount(key) !== 0) {
    ipcRenderer.removeAllListeners(key);
  }
  ipcRenderer.on(key, callback);
};

electron.contextBridge.exposeInMainWorld("electronAPI", {
  runLogin: () => ipcRenderer.invoke("run-login"),
  hookCookiesLoaded: (callback) => registerCallback("cookies-loaded", callback),
  fetchActivities: (term) => ipcRenderer.invoke("fetch-activities", term),
  readActivities: () => ipcRenderer.invoke("read-activities"),
  transform: () => ipcRenderer.invoke("create-calendar"),
});
