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

    if(!response.success) {
      res.status(401).send(response);
    }

    res.status(200).send(response.clientToken);

  } catch(e) {
    console.log(e);
  }
}
