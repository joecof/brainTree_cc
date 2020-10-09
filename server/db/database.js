const dbconfig = require('./config.json');

function connection() {

  try {
    const mysql = require('mysql2')
    const pool = mysql.createPool(dbconfig);

    const promisePool = pool.promise();
    return promisePool; 

  } catch(e) {
    console.log(`Could not connect - ${e}`)
  }
}

const pool = connection();

module.exports = {
  connection: async () => pool.getConnection(),
  execute: (...params) => pool.execute(...params)
}

