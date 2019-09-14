const nitter = "https://nitter.net";

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    return {
      redirectUrl:
        nitter + details.url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1]
    };
  },
  {
    urls: [
      "*://twitter.com/*",
      "*://www.twitter.com/*",
      "*://mobile.twitter.com/*"
    ],
    types: [
      "main_frame",
      "sub_frame",
      "stylesheet",
      "script",
      "image",
      "object",
      "xmlhttprequest",
      "other"
    ]
  },
  ["blocking"]
);
