import { $ } from "./renderer-common.js";

const termForm = $("#term-form");
const termFormSubmit = $("#term-form__submit");
const dataLoadedMsg = $("#wizard-main__data-loaded-msg");
const nextBtn = $("#wizard-footer__next-btn");
nextBtn.addEventListener("click", () => {
  location.href = "step3.html";
});
termForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  termFormSubmit.disabled = true;
  const formData = new FormData(event.target);
  const term = parseInt(formData.get("term"), 10);
  try {
    await electronAPI.fetchActivities(term);
    dataLoadedMsg.style.visibility = "visible";
    nextBtn.disabled = false;
  } catch (error) {
    termFormSubmit.disabled = false;
    throw error;
  }
});

$("#wizard-footer__load-btn").addEventListener("click", async () => {
  await window.electronAPI.readActivities();
  termFormSubmit.disabled = true;
  dataLoadedMsg.style.visibility = "visible";
  nextBtn.disabled = false;
});
