import { $ } from "./renderer-common.js";

/** @type {HTMLButtonElement} */
const loginBtn = $("#wizard-main__login-button");

const nextBtn = $("#wizard-footer__next-btn");
nextBtn.addEventListener("click", () => {
  location.href = "./step2.html";
});

const exfiltratedMessage = $("#wizard-main__cookies-loaded");
// window.electronAPI.hookCookiesLoaded(() => {
//   console.log("it is done.");
//   loginBtn.disabled = true;
//   exfiltratedMessage.style.visibility = "visible";
//   nextBtn.disabled = false;
// });

loginBtn.addEventListener("click", async (event) => {
  event.target.disabled = true;
  try {
    const res = await electronAPI.runLogin();
    if (res) {
      loginBtn.disabled = true;
      exfiltratedMessage.style.visibility = "visible";
      nextBtn.disabled = false;
      return;
    }
  } catch (error) {
    event.target.disabled = false;
    throw error;
  }
});
