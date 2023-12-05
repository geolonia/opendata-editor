import { test, expect } from '@playwright/test';
import looksSame from 'looks-same';
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { fetch } from 'undici';
import { sleep } from './utils';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pageURL = '/?data=http://localhost:2923/opendata-editor/test.csv&debug=1';

test.beforeAll(async () => {
  await copyFile(join(__dirname, './fixtures/data.csv'), join(__dirname, '../web/public/test.csv'));
});

test('if table is properly displayed when data is given by URL', async ({ page }) => {
  await page.goto(pageURL);
  await page.waitForFunction(() => window.geoloniaDebug?.loaded === true);

  const cellValue = await page.locator('.rdg-row[aria-rowindex="2"] > .rdg-cell[aria-colindex="2"]').innerText();
  await sleep(500);

  expect(cellValue).toBe('東京駅');
});

test('if table is properly displayed when data is given by drag & drop', async ({ page }) => {
  await page.goto('/?debug=1');
  await page.waitForFunction(() => window.geoloniaDebug?.loaded === true);

  const res = await fetch('http://localhost:2923/opendata-editor/test.csv');
  const csv = await res.text();

  await page.locator('.uploader > div').dispatchEvent('drop', {
    dataTransfer: await page.evaluateHandle((data) => {
      const dt = new DataTransfer();
      const file = new File([ data ], 'data.csv', { type: 'text/csv' });
      dt.items.add(file);
      return dt;
    }, csv),
  });

  await sleep(500);

  const cellValue = await page.locator('.rdg-row[aria-rowindex="2"] > .rdg-cell[aria-colindex="2"]').innerText();
  await sleep(500);

  expect(cellValue).toBe('東京駅');
});

test('if map is zoomed to the selected pin when the user click the corresponding cell', async ({ page }) => {
  await page.goto(pageURL);
  await page.waitForFunction(() => window.geoloniaDebug?.loaded === true);

  await page.locator('.rdg-row[aria-rowindex="2"] > .rdg-cell[aria-colindex="1"]').click();

  expect(await page.evaluate(() => window.geoloniaDebug.mapZoom)).toBe(17);
});

test('if map is zoomed to the selected pin when the user right-click the corresponding cell', async ({ page }) => {
  await page.goto(pageURL);
  await page.waitForFunction(() => window.geoloniaDebug?.loaded === true);

  await page.locator('.rdg-row[aria-rowindex="2"] > .rdg-cell[aria-colindex="1"]').click({ button: 'right' });

  expect(await page.evaluate(() => window.geoloniaDebug.mapZoom)).toBe(17);
});

test('if map is zoomed to the selected pin when the user move the cell by arrow keys', async ({ page }) => {
  const imagePath1 = join(__dirname, '../tmp/e2e-map-1.png');
  const imagePath2 = join(__dirname, '../tmp/e2e-map-2.png');
  await mkdir(join(__dirname, '../tmp'), { recursive: true });

  await page.goto(pageURL);
  await page.waitForFunction(() => window.geoloniaDebug?.loaded === true);

  await page.locator('.rdg-row[aria-rowindex="2"] > .rdg-cell[aria-colindex="1"]').click();
  await page.locator('canvas.maplibregl-canvas').screenshot({ path: imagePath1 });

  await page.keyboard.down('ArrowDown');
  await page.locator('canvas.maplibregl-canvas').screenshot({ path: imagePath2 });

  const { equal: sameMapLocation } = await looksSame(imagePath1, imagePath2);

  expect(sameMapLocation).toBe(false);
});

test('if the row is added when データを追加 button is pressed', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(pageURL);
  await page.waitForFunction(() => window.geoloniaDebug?.loaded === true);

  await page.locator('*[data-e2e="button-add-data"]').click();
  await sleep(500);


  expect(await page.locator('.rdg-row').last().getByText('新規マップピン').isVisible()).toBe(true);
});

test('if the columns are not changed when データを追加 button is pressed', async ({ page }) => {
  await page.goto(pageURL);
  await page.waitForFunction(() => window.geoloniaDebug?.loaded === true);

  await page.locator('*[data-e2e="button-add-data"]').click();
  await sleep(500);

  const headerCells = await page.locator('.rdg-header-row > .rdg-cell').all();
  const headerTexts = await Promise.all(headerCells.map((headerCell) => headerCell.innerText()));

  expect(headerTexts).toStrictEqual([ 'number', 'name', 'latitude', 'longitude' ]);
});

test('if the viewport is scrolled to the added row when データを追加 button is pressed', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(pageURL);
  await page.waitForFunction(() => window.geoloniaDebug?.loaded === true);

  await page.locator('*[data-e2e="button-add-data"]').click();
  await sleep(500);

  const newRowInViewport = await page.evaluate(async () => {
    const visibleRatio: number = await new Promise((resolve) => {
      const observer = new IntersectionObserver((entries) => {
        resolve(entries[0].intersectionRatio);
        observer.disconnect();
      });

      const rows = document.getElementsByClassName('rdg-row');
      const newColumn = rows[rows.length - 1].getElementsByClassName('rdg-cell')[0];
      if (newColumn) {
        observer.observe(newColumn);
      } else {
        throw new Error('row not found');
      }

      // Firefox doesn't call IntersectionObserver callback unless
      // there are rafs.
      requestAnimationFrame(() => {});
    });

    return visibleRatio > 0;
  });
  expect(newRowInViewport).toBe(true);
});

test('if one of the cells in the added row is selected when データを追加 button is pressed', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(pageURL);
  await page.waitForFunction(() => window.geoloniaDebug?.loaded === true);

  await page.locator('*[data-e2e="button-add-data"]').click();
  await sleep(500);

  const selectedColumnInLastRow = await page.evaluate(async () => {
    const rows = document.getElementsByClassName('rdg-row');
    const selectedColumnInLastRow = rows[rows.length - 1].querySelector('.rdg-cell[aria-selected="true"]');
    return Boolean(selectedColumnInLastRow);
  });
  expect(selectedColumnInLastRow).toBe(true);
});

test('if new line is inserted above by the context menu', async ({ page }) => {
  await page.goto(pageURL);
  await page.waitForFunction(() => window.geoloniaDebug?.loaded === true);

  await page.locator('.rdg-row[aria-rowindex="3"] > .rdg-cell[aria-colindex="1"]').click({ button: 'right' });
  await sleep(500);
  await page.locator('*[data-e2e="insert-above"]').click();
  const aboveLineName = await page.locator('.rdg-row[aria-rowindex="3"] > .rdg-cell[aria-colindex="2"]').innerText();
  expect(aboveLineName).toBe('新規マップピン');
});

test('if new line is inserted below by the context menu', async ({ page }) => {
  await page.goto(pageURL);
  await page.waitForFunction(() => window.geoloniaDebug?.loaded === true);

  await page.locator('.rdg-row[aria-rowindex="4"] > .rdg-cell[aria-colindex="1"]').click({ button: 'right' });
  await sleep(500);
  await page.locator('*[data-e2e="insert-below"]').click();
  const belowLineName = await page.locator('.rdg-row[aria-rowindex="5"] > .rdg-cell[aria-colindex="2"]').innerText();
  expect(belowLineName).toBe('新規マップピン');
});

test('if a line is deleted by the context menu', async ({ page }) => {
  await page.goto(pageURL);
  await page.waitForFunction(() => window.geoloniaDebug?.loaded === true);

  const line2 = page.locator('.rdg-row[aria-rowindex="3"] > .rdg-cell[aria-colindex="1"]');
  const line2Name = await line2.innerText();
  await line2.click({ button: 'right' });
  await sleep(500);

  await page.locator('*[data-e2e="delete"]').click();
  expect(await page.locator('.rdg-row[aria-rowindex="3"] > .rdg-cell[aria-colindex="2"]').innerText()).not.toBe(line2Name);
});

test('if downloaded CSV is valid', async ({ page }) => {
  await page.goto(pageURL);
  await page.waitForFunction(() => window.geoloniaDebug?.loaded === true);

  // insert new line
  await page.locator('.rdg-row[aria-rowindex="3"] > .rdg-cell[aria-colindex="1"]').click({ button: 'right' });
  await sleep(500);
  await page.locator('*[data-e2e="insert-above"]').click();

  const downloadPromise = page.waitForEvent('download');
  await page.locator('*[data-e2e="download"]').click();
  const download = await downloadPromise;

  const downloadPath = await download.path();
  if (!downloadPath) {
    throw new Error('Failed to download CSV from OpenDataEditor');
  }

  const downloadedCsv = await readFile(downloadPath, 'utf-8');

  const res = await fetch('http://localhost:2923/opendata-editor/test.csv');
  const originalCsv = await res.text();

  const originalCsvLines = originalCsv.split('\n');
  originalCsvLines.splice(2, 0, ',"新規マップピン","35.6958305258118","139.792949814254"');
  const expectedCsv = originalCsvLines.join('\r\n');

  expect(`${downloadedCsv}${'\r\n'}`).toBe(expectedCsv);
});
