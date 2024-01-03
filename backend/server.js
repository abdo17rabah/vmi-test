const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const mysql = require('mysql2/promise');

const generateAndInsertCSV = require('./csv-generator');
const createTable = require('./utils/create-table');

const app = express();
const port = 3000;

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    flags: ['+LOCAL_FILES']

});

app.use(express.json());

app.post('/import-csv', async (req, res) => {
    const tempCsvPath = './file.csv';

    // Create table if it doesn't exist
    await createTable();

    // Generate CSV data and import it into the the table
    await generateAndInsertCSV(tempCsvPath, db);

    res.status(200).json({ sucess: true, message: 'CSV data generated & imported successfully'})
});

app.get('/test', (req, res) => {
    res.json({ sucess: true });
});

app.listen(port, ()=> {
    console.log(`Server up & running at http://localhost:${port}/test`);
});