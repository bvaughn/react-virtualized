const os = require('os');
const util = require('util');
const path = require('path');
const puppeteer = require('puppeteer');
const rimraf = require('rimraf');

const del = util.promisify(rimraf);

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function() {
  console.log('Teardown Puppeteer Environment.');
  await global.__BROWSER__.close();
  await del(DIR);
};
