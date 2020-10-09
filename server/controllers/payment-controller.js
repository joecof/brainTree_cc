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
    const response = await gateway.clientToken.generate();

    if(!response) throw new Error('could not generate client token')

    res.status(200).send(response.clientToken);

  } catch(e) {
    console.log(e);
    res.status(401).send(e.message);
  }
}

exports.customerCheckout = async (req, res, next) => {

  try { 

    const { transaction } = req.body;

    const customer = {
      id: "11",
      name: 'joe',
      email: 'joe.fong@monark.com',
    }

    // const response = await gateway.customer.create(customer);

    // console.log(response);

    await gateway.customer.find("11").then(result => console.log(result)).catch(e => console.log(e));
    // const customers = await dbService.get('SELECT * FROM customers');

    // console.log(customers);

    // const {name, email} = req.body;
    // const customer = {
    //   name: 
    // }

    // gateway.customer.create()
    

  } catch(e) {

    console.log(e);

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