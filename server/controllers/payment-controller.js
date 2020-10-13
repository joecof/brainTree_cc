const dbService = require('../db/database-service')
const {gateway} = require('../config/config')

exports.generateToken = async (req, res, next) => {
  
  try {
    
    const {user} = req.body;   

    const userInfo = await dbService.get('SELECT customerId FROM customers WHERE customerId=? AND name=? AND email=?', Object.values(user));

    const customer = await gateway.clientToken.generate({customerId: userInfo.customerId});

    if(!customer) throw new Error('could not generate client token from customer')

    if(customer.success) {
      return res.status(200).send({
        clientToken: customer.clientToken, 
        msg: `generated token from ${JSON.stringify(user)}`});
    }

    const anon = await gateway.clientToken.generate({});
    if(!anon) throw new Error('could not generate client token from anon');     

    res.status(200).send({
      clientToken: anon.clientToken, 
      msg: 'generated token from anon user'
    });
    
  } catch(e) {
    console.log(e);
    res.status(401).send(e.message);
  }
}

exports.addPaymentMethod = async (req, res, next) => {

  try { 

    const { transaction, user } = req.body;

    const userInfo = await dbService.get('SELECT customerId FROM customers WHERE customerId=? AND name=? AND email=?', Object.values(user));

    if(!userInfo) throw new Error('customer does not exist in database');

    const createdPaymentMethod = await gateway.paymentMethod.create({
      customerId: String(userInfo.customerId),
      paymentMethodNonce: transaction.nonce
    });

    if(createdPaymentMethod.success) {
      return res.status(200).send({
        paymentToken: createdPaymentMethod.paymentMethod.token, 
        msg: `created a new payment method for customer: ${userInfo.customerId}`
      })
    }

    const createdCustomerWithPaymentMethod = await gateway.customer.create({
      id: String(userInfo.customerId),
      paymentMethodNonce: transaction.nonce
    })

    res.status(200).send({
      paymentToken: createdCustomerWithPaymentMethod.customer.paymentMethods[0].token,
      msg: `created new customer with payment method`
    })  

  } catch(e) {
    res.status(401).send({success: false, message: e.message})    
    console.log(`error message: ${e.message}`);
  }
}

exports.checkout = async (req, res, next) => {
  try {

    const { transaction, amount } = req.body; 

    const config = {
      amount: amount,
      paymentMethodNonce: transaction.nonce,
      options: {
        submitForSettlement: true
      }
    }
  
    const response = await gateway.transaction.sale(config);

    if(!response) throw new Error('braintree transaction failed');

    res.status(200).send(response.success)    

  } catch(e) {
    console.log(e);
    res.status(401).send(e.message);
  }
}