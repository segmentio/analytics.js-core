process.title = "ajs-test-e2e-dev-server"

import express from 'express';
import path from 'path';

const app = express()
const port = 8000

app.use('/analytics.js/v1/local', express.static(path.join(__dirname, 'static')))
app.use('/', express.static(path.join(__dirname, 'static')))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))