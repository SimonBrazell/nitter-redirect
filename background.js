'use strict';

const nitterDefault = 'https://nitter.net';

let instance;
let nitterDisabled;

chrome.storage.sync.get(
  ['nitterDisabled', 'instance'],
  (result) => {
    nitterDisabled = result.nitterDisabled;
    instance = result.instance || nitterDefault;
  }
);

chrome.storage.onChanged.addListener(function (changes) {
  if ('instance' in changes) {
    instance = changes.instance.newValue || nitterDefault;
  }
  if ('nitterDisabled' in changes) {
    nitterDisabled = changes.nitterDisabled.newValue;
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (!nitterDisabled) {
      return {
        redirectUrl:
          instance + details.url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1]
      };
    }
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
