/*
based off https://github.com/sindresorhus/electron-serve

MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import type { Response } from "./response-type";
import { protocol } from "electron";
import { stat, readFile } from "node:fs/promises";
import { join, extname } from "node:path";

const HOST = "host";

const getPath = async (path: string): Promise<string | null> => {
  try {
    const result = await stat(path);

    if (result.isFile()) {
      return path;
    }

    if (result.isDirectory()) {
      return getPath(join(path, "index.html"));
    }
  } catch (_) {}
  return null;
};

const TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
};

export const registerAppProtocol = (dir) => {
  protocol.handle("app", async (req) => {
    const url = new URL(req.url);
    if (url.hostname !== HOST) {
      return new Response(null, { status: 400 });
    }
    const filePath = join(dir, decodeURIComponent(url.pathname));
    const resolvedPath = await getPath(filePath);
    if (!resolvedPath) {
      return new Response(null, { status: 404 });
    }
    const ext = extname(resolvedPath);
    let type = TYPES[ext];
    if (!type) {
      return new Response(null, { status: 404 });
    }
    const body = await readFile(resolvedPath);
    return new Response(body, {
      status: 200,
      headers: { "Content-Type": type },
    });
  });
};
