import { session, dialog } from "electron";
import * as fs from "node:fs/promises";
import range from "lodash/range";
import * as axios from "axios";
import { userAgent } from "./user-agent";
import { getMainWindow, postToMain } from "./main-window";
import { writeLog } from "./log";

interface Activity {
  name: string;
  room: string[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  day: number;
}

let loadedAktvs: Activity[] = [];

export const getActivities = () => loadedAktvs;

const loginCookiesHeaderValue = async () => {
  const sesh = session.fromPartition("login");
  const jar = sesh.cookies;
  const cookies = await jar.get({
    domain: "gre.ac.uk",
    path: "/",
  });
  const headerValue = cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return headerValue;
};

/**
 * @param {number} term
 */
const weeksInTerm = (term) => {
  if (term === 1) {
    return range(3, 14 + 1);
  }
  if (term === 2) {
    return range(19, 30 + 1);
  }
  if (term === 3) {
    return range(34, 45 + 1);
  }
  throw new Error("out of range");
};

const loadActivities = (rawData) => {
  loadedAktvs = rawData[0].activities;
  return loadedAktvs;
};

export const fetchActivities = async (term: number) => {
  const weeks = weeksInTerm(term).join(";");
  const resp = await axios.get(
    "https://timetable.gre.ac.uk/api/2023/timetable/my/student",
    {
      params: { weeks, days: "0;1;2;3;4;5;6" },
      headers: {
        Accept: "application/json, text/plain",
        Cookie: await loginCookiesHeaderValue(),
        "User-Agent": userAgent,
      },
    },
  );
  return loadActivities(resp.data);
};

export const readActivities = async () => {
  const ret = await dialog.showOpenDialog(getMainWindow(), {
    properties: ["openFile"],
  });
  if (ret.canceled) {
    throw new Error("user cancelled");
  }
  const path = ret.filePaths[0];
  const data = await fs.readFile(path, { encoding: "utf-8" });
  return loadActivities(JSON.parse(data));
};
