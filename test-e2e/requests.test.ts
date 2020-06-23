import 'mocha';
import assert from 'assert';
import { parseHttpArchiveText, compareEntries } from './har'
import fs from 'fs';
import path from 'path';

describe('compare har files against reference', () => {
  let files = fs.readdirSync(path.join(__dirname, 'staging'));
  files.forEach((harFile) => {
    it(harFile, () => {
      let stagingFilePath = path.join(__dirname, 'staging', harFile)
      let referenceFilePath = path.join(__dirname, 'reference', harFile)
      let res = compareEntries(
        parseHttpArchiveText(fs.readFileSync(stagingFilePath, 'utf8')),
        parseHttpArchiveText(fs.readFileSync(referenceFilePath, 'utf8'))
      );
      assert(res, `${harFile} is not equivalent to reference. Have the tests / analytics.js / test website changed?`);
    })
  })
})
