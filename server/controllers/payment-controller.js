const braintree = require("braintree");
const dbService = require('../db/database-service')

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

exports.generateToken = async (req, res, next) => {
  
  try {
    
    const {user} = req.body;

    const userInfo = await dbService.get('SELECT customerId FROM customers WHERE customerId=? AND name=? AND email=?', Object.values(user));

    const customer = await gateway.customer.find(String(userInfo.customerId));

    const response = !customer ? await gateway.clientToken.generate({}) : await gateway.clientToken.generate({customerId: userInfo.customerId})

    if(!response) throw new Error('could not generate client token')

    res.status(200).send(response.clientToken);

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

    const customer = {
      id: userInfo.customerId,
      firstName: userInfo.name,
      email: userInfo.email,
      paymentMethodNonce: transaction.nonce
    }

    const response = await gateway.customer.create(customer);

    if(!response.success) throw new Error(response.message)

    res.status(200).send({success: response.success, paymentToken:  response.customer.paymentMethods[0].token})    

  } catch(e) {
    res.status(401).send({success: false, message: e.message})    
    console.log(e.message);
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