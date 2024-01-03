const fs = require('fs');
const generateCSV = require('./utils/csv-script');


async function generateAndInsertCSV(filepath, db) {
    const rowCount = 1000000;
    try {
        // Generate CSV Data
        const data = generateCSV(rowCount);

        // Write CSV data in a temporary file
        fs.writeFileSync(filepath, data);

        // Insert data into the table
        const connection = await db.getConnection();
        const loadQuery = `LOAD DATA LOCAL INFILE "${filepath}" INTO TABLE vmi FIELDS TERMINATED BY ',' LINES TERMINATED BY '\\n' IGNORE 1 LINES (uuid, name, email)`;
        
        await connection.query({
            sql: loadQuery, 
            infileStreamFactory: () => fs.createReadStream(filepath)
        });

        // delete the temporary file
        fs.unlinkSync(filepath);

        connection.release();
        console.log('CSV data generated and imported successfully');

    } catch (error) {
        console.log('Error while generating and importing CSV', error);
    }
}

module.exports = generateAndInsertCSV;