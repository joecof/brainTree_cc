const {gateway} = require('../config/config')

exports.delete = async (req, res, next) => {

  try {

    const { customerId } = req.body;

    const response = await gateway.customer.delete(String(customerId))

    if(!response) throw new Error('could not delete customer');

    res.status(200).send({success: true})

  } catch(e) {
    console.log(e);
    res.status(401).send(e.message);
  } 
}