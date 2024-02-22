import * as fs from "node:fs/promises";
import { Writable } from "node:stream";

let fp: fs.FileHandle;
let stream: Writable;

const openLog = async () => {
  fp = await fs.open("/dev/stderr", "a");
  stream = fp.createWriteStream();
};

export const writeLog = async (message: string) => {
  if (!stream) {
    await openLog();
  }
  return stream.write(message + "\n");
};
