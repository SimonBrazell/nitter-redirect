"use strict";

const nitterDefault = "https://nitter.net";

let nitterDisabled;
let instance;

window.browser = window.browser || window.chrome;

function redirectTwitter(url) {
  if (url.host.split(".")[0] === "pbs") {
    return `${instance}/pic/${encodeURIComponent(url.href)}`;
  } else if (url.host.split(".")[0] === "video") {
    return `${instance}/gif/${encodeURIComponent(url.href)}`;
  } else if (url.pathname.includes("tweets")) {
    return `${instance}${url.pathname.replace("/tweets", "")}${url.search}`;
  } else {
    return `${instance}${url.pathname}${url.search}`;
  }
}

browser.storage.sync.get(["nitterDisabled", "instance"], (result) => {
  nitterDisabled = result.nitterDisabled;
  instance = result.instance || nitterDefault;
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      if (registration.scope === "https://twitter.com/") {
        registration.unregister();
        console.log("Unregistered Twitter SW", registration);
      }
    }
  });
  const url = new URL(window.location);
  if (!nitterDisabled && url.host !== instance) {
    const redirect = redirectTwitter(url);
    console.info("Redirecting", `"${url.href}"`, "=>", `"${redirect}"`);
    window.location = redirect;
  }
});
