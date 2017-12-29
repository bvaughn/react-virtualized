const os = require('os');
const util = require('util');
const fs = require('fs');
const path = require('path');
const makeDir = require('mkdirp');
const puppeteer = require('puppeteer');

const writeFile = util.promisify(fs.writeFile);

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function() {
  if (process.env.JEST !== 'ci') {
    console.log('Setup Puppeteer Environment.');
    const browser = await puppeteer.launch({});
    global.__BROWSER__ = browser;
    await makeDir(DIR);
    await writeFile(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
  }
};
