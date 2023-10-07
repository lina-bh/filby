"use strict";
const { app, ...electron } = require("electron");

const { makeMainWindow } = require("./main-window.js");
const { writeLog } = require("./log.js");
const { registerIPCListeners } = require("./main-api.js");

const main = async () => {
  await app.whenReady();
  app.setName("Filby");

  registerIPCListeners();

  await makeMainWindow();
};

module.exports = { main };
