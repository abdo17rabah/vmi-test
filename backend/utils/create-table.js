const mysql = require('mysql2/promise');

async function createTable() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE,
        });

        await connection.execute(`CREATE TABLE IF NOT EXISTS ${process.env.DB_DATABASE} (id INT AUTO_INCREMENT PRIMARY KEY, uuid VARCHAR(36) NOT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL)`);
        console.log('Table created successfully.');

        await connection.end();
    } catch (error) {
        console.log('Error creating table', error);
    }
}

module.exports = createTable;

// Uncomment the line to execute the script when running the script directy
//createTable();