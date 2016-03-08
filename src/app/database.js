const dbModule = require('promise-mysql');
const dbConfig = {
  host: 'engr-cpanel-mysql.engr.illinois.edu',
  user: 'zliu80_backend',
  password: 'zliu80',
  database: 'zliu80_bacchanalia'
};

module.exports = dbModule.createConnection(dbConfig);
