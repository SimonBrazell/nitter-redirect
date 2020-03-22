'use strict';

let toggleNitter = document.querySelector('#toggle-nitter');
let instance = document.querySelector('#instance');
let version = document.querySelector('#version');

window.browser = window.browser || window.chrome;

browser.storage.sync.get(['nitterDisabled', 'instance'], (result) => {
  toggleNitter.checked = !result.nitterDisabled;
  instance.value = result.instance || '';
});

version.textContent = browser.runtime.getManifest().version;

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this, args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

let instanceChange = debounce(() => {
  if (instance.checkValidity()) {
    browser.storage.sync.set({
      instance: instance.value ? new URL(instance.value).origin : ''
    });
  }
}, 500);
instance.addEventListener('input', instanceChange);

toggleNitter.addEventListener('change', (event) => {
  browser.storage.sync.set({ nitterDisabled: !event.target.checked });
});

instance.addEventListener('input', instanceChange);
