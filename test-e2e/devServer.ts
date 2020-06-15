process.title = "ajs-test-e2e-dev-server"  // set a process title so that we can call pkill to stop the server using the title

import * as express from 'express';
import * as path from 'path';

// handle SIGTERM so that the process returns exit code zero
process.on('SIGTERM', () => {
    console.info('SIGTERM received. Exiting.');
    process.exit()
});

const app = express()
const port = 8000

// the tests loads tests from localhost:8000/analytics.js/v1/<write-key>/analytics.js
app.use('/analytics.js/v1/:writeKey/', express.static(path.join(__dirname, 'static')))
app.use('/', express.static(path.join(__dirname, 'static')))

app.listen(port, () => console.log(`test-e2e dev server listening at http://localhost:${port}`))
