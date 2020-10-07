const braintree = require("braintree");

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