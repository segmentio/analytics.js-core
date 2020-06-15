process.title = "ajs-test-e2e-dev-server"

import * as express from 'express';
import * as path from 'path';
process.on('SIGTERM', () => {
    console.info('SIGTERM received. Exiting.');
    process.exit()
});

const app = express()
const port = 8000

app.use('/analytics.js/v1/', express.static(path.join(__dirname, 'static')))
app.use('/', express.static(path.join(__dirname, 'static')))

app.listen(port, () => console.log(`test-e2e dev server listening at http://localhost:${port}`))
