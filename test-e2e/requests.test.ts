import 'mocha';
import assert from 'assert';
import { preprocessHarEntries } from './har'
import fs from 'fs';
import path from 'path';

describe('compare har files against reference', () => {
  let files = fs.readdirSync(path.join(__dirname, 'staging'));
  files.forEach((harFile) => {
    it(harFile, () => {
      let stagingFilePath = path.join(__dirname, 'staging', harFile)
      let referenceFilePath = path.join(__dirname, 'reference', harFile)
      let a = preprocessHarEntries(fs.readFileSync(stagingFilePath, 'utf8'))
      let b = preprocessHarEntries(fs.readFileSync(referenceFilePath, 'utf8'))
      assert.deepEqual(a, b, `${harFile} is not equivalent to reference. Have the tests / analytics.js / test website changed?`);
    })
  })
})
