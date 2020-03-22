'use strict';

const nitterDefault = 'https://nitter.net';

let instance;
let nitterDisabled;

window.browser = window.browser || window.chrome;

browser.storage.sync.get(
  ['nitterDisabled', 'instance'],
  (result) => {
    nitterDisabled = result.nitterDisabled;
    instance = result.instance || nitterDefault;
  }
);

browser.storage.onChanged.addListener(function (changes) {
  if ('instance' in changes) {
    instance = changes.instance.newValue || nitterDefault;
  }
  if ('nitterDisabled' in changes) {
    nitterDisabled = changes.nitterDisabled.newValue;
  }
});

function redirectTwitter(url) {
  if (nitterDisabled) {
    return null;
  }
  if (url.host.split('.')[0] === 'pbs') {
    return `${instance}/pic/${encodeURIComponent(url.href)}`;
  } else if (url.host.split('.')[0] === 'video') {
    return `${instance}/gif/${encodeURIComponent(url.href)}`;
  } else {
    return `${instance}${url.pathname}${url.search}`;
  }
}

browser.webRequest.onBeforeRequest.addListener(
  details => {
    const url = new URL(details.url);
    let redirect;
    redirect = { redirectUrl: redirectTwitter(url) };
    if (redirect && redirect.redirectUrl) {
      console.info(
        'Redirecting', `"${url.href}"`, '=>', `"${redirect.redirectUrl}"`
      );
      console.info('Details', details);
    }
    return redirect;
  },
  {
    urls: [
      '*://twitter.com/*',
      '*://www.twitter.com/*',
      '*://mobile.twitter.com/*',
      '*://pbs.twimg.com/*',
      '*://video.twimg.com/*',
    ],
    types: [
      'main_frame',
      'sub_frame',
      'stylesheet',
      'script',
      'image',
      'object',
      'xmlhttprequest',
      'other'
    ]
  },
  ['blocking']
);
