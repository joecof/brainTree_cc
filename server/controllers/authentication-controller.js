const dbService = require('../db/database-service')

exports.login = async (req, res, next) => {
  
  try {

    const {email, password} = req.body
    const customerInfo = await dbService.get('SELECT email, password FROM customers WHERE email=? AND password=?', [email, password]);

    if(!customerInfo) {
      throw new Error('could not find this customer');
    } 

    res.status(200).send({success: true})

  } catch(e) {
    console.log(e);
    res.status(401).send(e.message);
  }
}
