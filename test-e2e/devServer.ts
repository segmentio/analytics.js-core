process.title = 'ajs-test-e2e-dev-server'; // set a process title so that we can call pkill to stop the server using the title

import * as express from 'express';
import * as path from 'path';
import * as config from './config';
import fetch from 'node-fetch';
import * as fs from 'fs';

// handle SIGTERM so that the process returns exit code zero
process.on('SIGTERM', () => {
  console.info('SIGTERM received. Exiting.');
  process.exit();
});

const app = express();
const port = config.local.devServerPort;

// download analytics.js to ./static directory if it is not already there
(async () => {
  const ajsPath = path.join(__dirname, 'static', 'analytics.js');
  if (fs.existsSync(ajsPath)) {
    console.log(`Found analytics.js locally at ${ajsPath}`);
    return;
  }
  console.log(`analytics.js not found. Downloading ajs to ${ajsPath}`);
  const resp = await fetch(
    `https://${config.local.originCDN}/analytics.js/v1/${
      config.local.testWriteKey
    }/analytics.js`
  );
  if (!resp.ok) {
    console.log(
      `Failed downloading analytics.js: ${resp.status} ${resp.statusText}`
    );
    process.exit(1);
  }
  fs.writeFileSync(ajsPath, await resp.text());
  if (fs.existsSync(ajsPath)) {
    console.log(`Downloaded analytics.js to ${ajsPath}`);
  }
})();

app.use(function(req, res, next) {
  // add 'unsafe-eval' if you want to test scripts that calls eval()
  res.setHeader("Content-Security-Policy", "script-src 'nonce-someNonce' 'unsafe-eval' 'strict-dynamic'");
  return next();
});

// the tests loads tests from localhost:8000/analytics.js/v1/<write-key>/analytics.js
app.use(
  '/analytics.js/v1/:writeKey/',
  express.static(path.join(__dirname, 'static'))
);
app.use('/', express.static(path.join(__dirname, 'static')));

app.listen(port, () =>
  console.log(`test-e2e dev server listening at http://localhost:${port}`)
);
