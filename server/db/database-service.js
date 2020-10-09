const db = require('./database');

const executeQuery = async (query, data) => {

  try {

    const result = data === undefined ? 
    await db.execute(query) : 
    await db.execute(query, Array.isArray(data) ? data : [data])

    return result; 

  } catch (e) {
    console.log(e);
  }
}

module.exports = { 
  get: (query, data) => executeQuery(query, data).then(result => result[0][0]),
  getList: (query, data) => executeQuery(query, data).then(result => result[0]),
  update: (query, data) => executeQuery(query, data).then(result => result[0].changedRows > 0),
  insert: (query, data) => executeQuery(query, data).then(result => result[0].insertId), 
  delete: (query, data) => executeQuery(query, data).then(result[0].affectedRows > 0)
}