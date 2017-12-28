const os = require('os');
const util = require('util');
const fs = require('fs');
const path = require('path');
const makeDir = require('mkdirp');
const puppeteer = require('puppeteer');

const writeFile = util.promisify(fs.writeFile);

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function() {
  console.log('Setup Puppeteer Environment.');
  const browser = await puppeteer.launch({headless: true});
  global.__BROWSER__ = browser;
  await makeDir(DIR);
  await writeFile(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};
