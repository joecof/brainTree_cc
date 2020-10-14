const dbService = require('../db/database-service')
const {gateway} = require('../config/config')

const checkUserExistsInDB = async (user) => {
  const userInfo = await dbService.get('SELECT customerId FROM customers WHERE customerId=? AND name=? AND email=?', Object.values(user));
  if(!userInfo) throw new Error('customer does not exist in database');
  return userInfo;
}

/**
 * Generates a client token for the user. 
 * If the user is vaulted in braintree's API then cross-reference that ID, and use it to generate the clientToken(the customers information will be serialized into the token)
 * Else if the user is not vaulted in braintree's API, then generate an anonymous clientToken(no customer associated to token). 
 */
exports.generateToken = async (req, res, next) => {
  
  try {
    
    const {user} = req.body;   

    const userInfo = await checkUserExistsInDB(user)

    /**
     * generates a serialized client token w/ customer information 
     */
    const customer = await gateway.clientToken.generate({customerId: userInfo.customerId});

    if(!customer) throw new Error('could not generate client token from customer')

    /**
     * customer.success is true if customer was vualted in braintree api 
     */
    if(customer.success) {
      return res.status(200).send({
        clientToken: customer.clientToken, 
        msg: `generated token from ${JSON.stringify(user)}`});
    }

    /**
     * generates an anonymous clientToken
     */
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

    const userInfo = await checkUserExistsInDB(user)

    /**
     * creates a payment method for vaulted customer. If not succesful, then will default to creating a new vaulted customer w/ given payment method.
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

    if(!createdCustomerWithPaymentMethod.success) {
      throw new Error(JSON.stringify({
        msg: `could not vault and add payment method for new customer: ${userInfo.customerId}.`,
        reason: createdCustomerWithPaymentMethod.message
      }))
    }

    res.status(200).send({
      paymentToken: createdCustomerWithPaymentMethod.customer.paymentMethods[0].token,
      msg: `created new customer with payment method for customer: ${userInfo.customerId}`
    })  

  } catch(e) {
    res.status(401).send({success: false, message: e.message})    
    console.log(`error message: ${e.message}`);
  }
}

exports.getPaymentMethod = async (req, res, next) => {
  try {
    
  } catch(e) {

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

    const userInfo = await checkUserExistsInDB(user)

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

    if(!response.success) {
      throw new Error(JSON.stringify({
        msg: `transaction was unsuccessful for customer: ${userInfo.customerId}`,
        reason: response.message
      }))
    }

    console.log(config);

    res.status(200).send({
      success: response.success,
      msg: `transaction was successfully created for customer: ${userInfo.customerId}`
    })    

  } catch(e) {
    console.log(e);
    res.status(401).send(e.message);
  }
}

exports.getTransactions = async (req, res, next) => {

  const { user } = req.body;

  const userInfo = await checkUserExistsInDB(user)

  let transactions = [];

  const stream = gateway.transaction.search((search) => {
    search.customerId().is(String(userInfo.customerId));
  });

  stream.on("ready", () => {
    console.log(stream.searchResponse.length());
  });

  stream.on("data", (transaction) => {

    transactions.push({
      transactionId: transaction.id,
      amount: transaction.amount,
      customer: transaction.customer.id,
      status: transaction.status,
      creditCard: {
        cardType: transaction.creditCard.cardType,
        last4: transaction.creditCard.last4,
      }
    });
  });

  stream.on("end", () => {
    console.log('stream ended: no more data');

    res.status(200).send({
      transactions: transactions,
      msg: `transactions succesfully fetched for customer: ${userInfo.customerId}`
    })

  });
  
}