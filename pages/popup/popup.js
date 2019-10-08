'use strict';

let toggleNitter = document.querySelector('#toggleNitter');
let instance = document.querySelector('#instance');

chrome.storage.sync.get(['nitterDisabled', 'instance'], (result) => {
  toggleNitter.checked = !result.nitterDisabled;
  instance.value = result.instance || '';
});

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
  chrome.storage.sync.set({ instance: instance.value });
}, 500);

toggleNitter.addEventListener('change', (event) => {
  chrome.storage.sync.set({ nitterDisabled: !event.target.checked });
});

instance.addEventListener('input', instanceChange);
