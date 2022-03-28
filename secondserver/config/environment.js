const username = process.env.DB_USERNAME || '';
const password = process.env.DB_PASSWORD || '';
const host = process.env.HOSTNAME || 'localhost';
const port = process.env.DB_PORT || '27017';
const database = process.env.DB_NAME || 'Test';
const params = process.env.DB_PARAMS || '';
const secret = process.env.SECRET || 'MyLittleSecret';

let uri = 'mongodb://';
if(username && password) {
    uri += `${username}:${password}@`;
}

uri += `${host}:${port}/${database}${params}`;

module.exports = {
    mongodb: {uri},
    secret,
};