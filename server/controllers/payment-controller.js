const dbService = require('../db/database-service')
const {gateway} = require('../config/config')
const stream = require('stream');
const readable = require('stream').Readable;

/**
 * Generates a client token for the user. 
 * If the user is vaulted in braintree's API then cross-reference that ID and use it to generate the clientToken(the customers information will be serialized into the token)
 * Else if the user is not vaulted in braintree's API, then generate an anonymous clientToken. 
 */
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

/**
 * Creates a payment method for a user. 
 * If user is not vaulted as a customer in braintree's API, then add that user as a new customer with the given payment method. 
 * Else if the user is already vaulted as a customer, then create/append a new payment method to that customers information. 
 */
exports.addPaymentMethod = async (req, res, next) => {

  try { 

    const { transaction, user } = req.body;

    //checks if user exists in db
    const userInfo = await dbService.get('SELECT customerId FROM customers WHERE customerId=? AND name=? AND email=?', Object.values(user));
    if(!userInfo) throw new Error('customer does not exist in database');

    /**
     * creates a payment method for vaulted customer. If not succesfully will default to creating a new vaulted customer w/ given payment method.
     */
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

    /**
     * creates a new vualted customer w/ given payment method. 
     */
    const createdCustomerWithPaymentMethod = await gateway.customer.create({
      id: String(userInfo.customerId),
      paymentMethodNonce: transaction.nonce
    })

    if(!createdCustomerWithPaymentMethod.success) throw new Error(`could not vault and add payment method for new customer: ${userInfo.customerId}.`)

    res.status(200).send({
      paymentToken: createdCustomerWithPaymentMethod.customer.paymentMethods[0].token,
      msg: `created new customer with payment method for customer: ${userInfo.customerId}`
    })  

  } catch(e) {
    res.status(401).send({success: false, message: e.message})    
    console.log(`error message: ${e.message}`);
  }
}

/**
 * Creates a transaction w/ braintree. 
 * If transaction is defined then the transaction is coming anonymously. 
 * Else if the transaction is not defined, then the transaction is coming from a vaulted customer, and paymentMethodToken is used to process the transaction. 
 */
exports.checkout = async (req, res, next) => {
  try {

    const { transaction, amount, paymentMethodToken, user } = req.body; 

    const userInfo = await dbService.get('SELECT customerId FROM customers WHERE customerId=? AND name=? AND email=?', Object.values(user));

    if(!userInfo) throw new Error('user does not exist in database');

    const config = {
      amount: amount,
      options: {
        submitForSettlement: true
      }
    }

    if(!transaction) {
      config.paymentMethodToken = paymentMethodToken;
    } else {
      config.paymentMethodNonce = transaction.nonce
    }
  
    const response = await gateway.transaction.sale(config);

    if(!response.success) throw new Error('transaction was unsuccessful')

    res.status(200).send({
      success: response.success,
      msg: `transaction was successfully created`
    })    

  } catch(e) {
    console.log(e);
    res.status(401).send(e.message);
  }
}

exports.getTransactions = async (req, res, next) => {

  let transactions = [];

  const stream = gateway.transaction.search((search) => {
    search.customerId().is("11");
  });

  stream.on("ready", () => {
    console.log(stream.searchResponse.length());
  });

  stream.on("data", (transaction) => {
    console.log(transaction);
    transactions.push(transaction);
  });

  stream.on("end", () => {
    for (let i = transactions.length - 1; i >= 0; i--) {
      console.log(transactions[i]);
    };
  });

  console.log(transactions);
  
  res.status(200).send('found')
}