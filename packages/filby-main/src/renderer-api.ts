import { ipcRenderer, contextBridge, IpcRendererEvent } from "electron";
import type { runLoginFlow } from "./login-window";
import type { fetchActivities, readActivities } from "./data-loading";
import type { createICSData, writeICSData } from "./calendar-file";

type Callback = (event: IpcRendererEvent, ...args: any) => void;

const registerCallback = (key: string, callback: Callback) => {
  if (ipcRenderer.listenerCount(key) !== 0) {
    ipcRenderer.removeAllListeners(key);
  }
  ipcRenderer.on(key, callback);
};

const electronAPI = {
  runLogin: (): ReturnType<typeof runLoginFlow> =>
    ipcRenderer.invoke("run-login"),
  fetchActivities: (term: number): ReturnType<typeof fetchActivities> =>
    ipcRenderer.invoke("fetch-activities", term),
  readActivities: (): ReturnType<typeof readActivities> =>
    ipcRenderer.invoke("read-activities"),
  transform: (): Promise<ReturnType<typeof createICSData>> =>
    ipcRenderer.invoke("create-calendar"),
  writeCalendar: (): ReturnType<typeof writeICSData> =>
    ipcRenderer.invoke("write-calendar"),
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);

export type ElectronAPI = typeof electronAPI;
