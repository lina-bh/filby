"use strict";
let userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.55";

const setUserAgent = (ua) => (userAgent = ua);

module.exports = {
  get userAgent() {
    return userAgent;
  },
  setUserAgent,
};
