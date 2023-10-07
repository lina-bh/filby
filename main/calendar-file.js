"use strict";
/** @typedef (import("./index.d.ts").Activity) */
const ics = require("ics");
const rrule = require("rrule");
const dataLoading = require("./data-loading.js");
const { writeLog } = require("./log.js");
const { dialog } = require("electron");

let icsData = "";

/**
 * @param {string} dateString
 * @returns {number[]}
 */
const activityExtractDate = (dateString) =>
  dateString.split("-").map((part) => parseInt(part, 10));

/**
 * @param {string} timeString
 * @returns {number[]}
 */
const activityExtractTime = (timeString) =>
  timeString.split(":").map((part) => parseInt(part, 10));

/**
 * @param {number} day
 */
const activityWeekday = (day) => {
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

const createICSData = () => {
  const { error, value } = ics.createEvents(
    dataLoading.loadedAktvs.map(
      /**
       * @returns {ics.EventAttributes}
       */
      (aktv) => {
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
          start: startDate.concat(startTime),
          end: startDate.concat(endTime),
          recurrenceRule: rule.toString(),
        };
      }
    )
  );
  if (error) {
    throw new Error(JSON.stringify(error));
  }
  icsData = value;
  return value;
};

module.exports = { createICSData };
