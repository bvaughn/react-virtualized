// @flow

const DEFAULT_MAX_ELEMENT_SIZE = 1500000;
const CHROME_MAX_ELEMENT_SIZE = 1.67771e7;

const isBrowser = () => typeof window !== 'undefined';

const isChrome = () => !!window.chrome && !!window.chrome.webstore;

export const getMaxElementSize = (): number => {
  if (isBrowser()) {
    if (isChrome()) {
      return CHROME_MAX_ELEMENT_SIZE;
    }
  }
  return DEFAULT_MAX_ELEMENT_SIZE;
};
