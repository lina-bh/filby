import { writeFile } from "node:fs/promises";
import { dialog } from "electron";
import * as ics from "ics";
import * as rrule from "rrule";
import { getActivities } from "./data-loading";
import { getMainWindow } from "./main-window";

let icsData = "";

const activityExtractDate = (dateString: string): number[] =>
  dateString.split("-").map((part) => parseInt(part, 10));

const activityExtractTime = (timeString: string): number[] =>
  timeString.split(":").map((part) => parseInt(part, 10));

const activityWeekday = (day: number) => {
  const RRule = rrule.RRule;
  const weekday = [
    RRule.MO,
    RRule.TU,
    RRule.WE,
    RRule.TH,
    RRule.FR,
    RRule.SA,
    RRule.SU,
  ][day];
  if (weekday === undefined) {
    throw new Error("out of range");
  }
  return weekday;
};

const activityToEvent = (aktv): ics.EventAttributes => {
  const startDate = activityExtractDate(aktv.startDate);
  const endDate = activityExtractDate(aktv.endDate);
  const startTime = activityExtractTime(aktv.startTime);
  const endTime = activityExtractTime(aktv.endTime);
  const rule = new rrule.RRule({
    freq: rrule.RRule.WEEKLY,
    interval: 1,
    byweekday: [activityWeekday(aktv.day)],
    until: rrule.datetime(endDate[0], endDate[1], endDate[2]),
    tzid: "Europe/London",
  });
  return {
    title: aktv.name,
    location: aktv.room[0],
    start: [
      startDate[0],
      startDate[1],
      startDate[2],
      startTime[0],
      startTime[1],
    ],
    end: [startDate[0], startDate[1], startDate[2], endTime[0], endTime[1]],
    recurrenceRule: rule.toString().slice(6),
  };
};

export const createICSData = () => {
  const { error, value } = ics.createEvents(
    getActivities().map(activityToEvent),
  );
  if (error) {
    throw new Error(JSON.stringify(error));
  }
  if (!value) {
    throw new Error("ics.createEvents returned undefined");
  }
  icsData = value;
  return value;
};

export const writeICSData = async () => {
  const ret = await dialog.showSaveDialog(getMainWindow(), {
    properties: ["createDirectory"],
    filters: [
      {
        name: "iCalendar file",
        extensions: [".ics"],
      },
    ],
  });
  if (ret.canceled || !ret.filePath) {
    return false;
  }
  await writeFile(ret.filePath, icsData, { encoding: "utf-8" });
  return true;
};
