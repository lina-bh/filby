const fs = require("node:fs/promises");

let fp;
/** @type {fs.WriteStream} */
let stream;

const openLog = async () => {
  fp = await fs.open("/dev/stderr", "a");
  stream = fp.createWriteStream();
};

/**
 * @param {string} message
 */
const writeLog = async (message) => {
  if (!stream) {
    await openLog();
  }
  return stream.write(message + "\n");
};

module.exports = { writeLog };
