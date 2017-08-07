/* eslint no-console: 0 */
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const buffer = fs.readFileSync('./data.json');
const companySlogans = JSON.parse(buffer);
const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.json(companySlogans);
});

console.log(`Starting server on port 3000`);
app.listen(3000);
