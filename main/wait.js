"use strict";
/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = wait;
