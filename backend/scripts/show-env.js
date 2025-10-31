require('dotenv').config();
console.log('CWD:', process.cwd());
console.log('DB_HOST=', process.env.DB_HOST);
console.log('DB_USER=', process.env.DB_USER);
console.log('DB_PASSWORD set? ', Boolean(process.env.DB_PASSWORD));
console.log('DB_NAME=', process.env.DB_NAME);
