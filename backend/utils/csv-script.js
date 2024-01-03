const uuid = require('uuid');
const { faker } = require('@faker-js/faker');

const generateCSV = (rowCount) => {
    const header = 'uuid,name,email\n';
    let content = header;

    for(let i=0; i<rowCount; i++) {
        const row = `${uuid.v4()},${faker.person.fullName()},${faker.internet.email()}\n`;
        content += row;
    }
    return content;
};

module.exports = generateCSV;