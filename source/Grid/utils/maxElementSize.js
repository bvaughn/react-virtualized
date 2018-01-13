// @flow

const DEFAULT_MAX_ELEMENT_SIZE = 1500000;

const isChrome = () => !!window.chrome && !!window.chrome.webstore;

const isFirefox = () => typeof window.InstallTrigger !== 'undefined';

const isSafari = () =>
  /constructor/i.test(window.HTMLElement) ||
  (p => p.toString() === '[object SafariRemoteNotification]')(
    !window['safari'] ||
      (typeof window.safari !== 'undefined' && window.safari.pushNotification),
  );

const isOpera = () =>
  (!!window.opr && !!window.opr.addons) ||
  !!window.opera ||
  navigator.userAgent.indexOf(' OPR/') >= 0;

const elementSizesPerBrowser = {
  chrome: 33554428,
  safari: 33554428,
  opera: 33554428,
  firefox: 17895696,
};

export const getMaxElementSize = (): number => {
  if (isChrome()) {
    return elementSizesPerBrowser.chrome;
  }
  if (isSafari()) {
    return elementSizesPerBrowser.safari;
  }
  if (isOpera()) {
    return elementSizesPerBrowser.opera;
  }
  if (isFirefox()) {
    return elementSizesPerBrowser.firefox;
  }
  return DEFAULT_MAX_ELEMENT_SIZE;
};
