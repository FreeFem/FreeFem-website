const fs = require('fs-extra');
const gutil = require('gulp-util');
const puppeteer = require('puppeteer');

function delay(timeout) {
  return new Promise(function(resolve) {
    setTimeout(resolve, timeout);
  })
};

function getDirPath(name) {
  return `./screenshots/${name}`;
};

function getFileName(index) {
  return `${index + 1}.jpg`;
};

function getUrl(name) {
  return `http://127.0.0.1:8001/${name}.html`;
};

async function makeScreenshotsByName(name, selector) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({
    width: 1536,
    height: 30000, // Fix after https://github.com/GoogleChrome/puppeteer/issues/959 is closed
    deviceScaleFactor: 2
  });

  const url = getUrl(name);

  await page.goto(url, { timeout: 90000 });

  const dirPath = getDirPath(name);

  await fs.ensureDirSync(dirPath);

  await delay(3000);

  const blocks = await page.$$(selector);

  for (var index = 0; index < blocks.length; index++) {
    const path = `${dirPath}/${getFileName(index)}`;

    await blocks[index].screenshot({
      path: path,
      type: 'jpeg',
      quality: 100,
    });

    gutil.log(`Saved screenshot for '${gutil.colors.cyan(name)}' to '${gutil.colors.magenta(path)}'`);
  }

  await browser.close();
};

const MAX_CONCURRENT_BROWSERS_COUNT = 6;

async function makeScreenshots(description) {
  if (description.length > MAX_CONCURRENT_BROWSERS_COUNT) {
    await makeScreenshots(description.slice(0, MAX_CONCURRENT_BROWSERS_COUNT));
    await makeScreenshots(description.slice(MAX_CONCURRENT_BROWSERS_COUNT));
  } else {
    await Promise.all(description.map(([name, selector]) => makeScreenshotsByName(name, selector)));
  }
};

module.exports = {
  makeScreenshots,
};