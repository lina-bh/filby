import { $ } from "./renderer-common.js";

/** @type {HTMLTextAreaElement} */
const icalBox = $("#ical-box");
const transformBtn = $("#transform-btn");
const saveBtn = $("#save-btn");
transformBtn.addEventListener("click", async () => {
  const cal = await electronAPI.transform();
  transformBtn.disabled = true;
  icalBox.value = cal;
  saveBtn.disabled = false;
});
