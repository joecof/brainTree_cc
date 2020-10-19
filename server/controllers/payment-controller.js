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

    if(!customer) 
      throw new Error('could not generate client token from customer')

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

    if(!anon) 
      throw new Error('could not generate client token from anon');     

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
     * always will set the last given payment method as default
     */
    const createdPaymentMethod = await gateway.paymentMethod.create({
      customerId: String(userInfo.customerId),
      paymentMethodNonce: transaction.nonce,
      options: {
        makeDefault: true
      }
    });

    if(createdPaymentMethod.success) {
      return res.status(200).send({
        paymentToken: createdPaymentMethod.paymentMethod.token, 
        creditCardVerificationStatus: createdPaymentMethod.creditCard.verification.status,
        msg: `created a new payment method for customer: ${userInfo.customerId}`,
      })
    }

    /**
     * default action, creates a new vualted customer w/ given payment method. 
     */
    const createdCustomerWithPaymentMethod = await gateway.customer.create({
      id: String(userInfo.customerId),
      paymentMethodNonce: transaction.nonce,
    })

    if(!createdCustomerWithPaymentMethod.success && createdCustomerWithPaymentMethod.customer.paymentMethods[0].verification.status !== 'verified') {
      throw new Error(JSON.stringify({
        msg: `could not vault and add payment method for new customer: ${userInfo.customerId}.`,
        reason: createdCustomerWithPaymentMethod.message
      }))
    }

    res.status(200).send({
      paymentToken: createdCustomerWithPaymentMethod.customer.paymentMethods[0].token,
      creditCardVerificationStatus: createdCustomerWithPaymentMethod.customer.paymentMethods[0].verification.status,
      msg: `created new customer with payment method for customer: ${userInfo.customerId}`
    })  

  } catch(e) {
    
    res.status(401).send({success: false, message: e.message})    
    console.log(`error message: ${e.message}`);
  }
}

/**
 * Creates a transaction w/ braintree. 
 * If transaction (nonce) is defined then the transaction is coming anonymously. 
 * Else if the transaction is not defined, then the transaction is coming from a vaulted customer, and paymentMethodToken is used to process the transaction. 
 */
exports.checkout = async (req, res, next) => {
  try {

    const { transaction, amount, paymentMethodToken, user } = req.body; 

    const userInfo = await checkUserExistsInDB(user)
    
    const config = {
      amount: amount,
      deviceData: transaction.deviceData,
      options: {
        submitForSettlement: true
      }
    }
    /**
     * if transaction is not defined then the transaction request is coming from a payment method.
     * else if transaction is defined, then the transaction is manually inputted and coming from a one-time nonce token 
     */
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

    res.status(200).send({
      success: response.success,
      msg: `transaction was successfully created for customer: ${userInfo.customerId}`
    })    

  } catch(e) {
    console.log(e);
    res.status(401).send(e.message);
  }
}

/**
 * Identical to checkout. 
 * Provides another endpoint for sepcifically 3ds checkout testing. 
 */
exports.threeDsCheckout = async (req, res, next) => {
  try {

    const { transaction, amount, paymentMethodToken, user } = req.body; 

    const userInfo = await checkUserExistsInDB(user);

    const config = {
      amount: amount,
      deviceData: transaction.deviceData,
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

    res.status(200).send({
      success: response.success,
      msg: `transaction was successfully created for customer: ${userInfo.customerId}`,
      threeDSecureInfo: response.transaction.threeDSecureInfo
    })    

  } catch(e) {
    console.log(e);
  }
}

/**
 * Gets all transactions for current user from Braintree.
 * This function may be deprecated later since transaction information will be stored in DB instead. 
 * As long as we do a check to ensure the transaction data matches our DB then we can refer to our DB instead (faster, reliable)
 */
exports.getTransactions = async (req, res, next) => {

  const { user } = req.body;

  const userInfo = await checkUserExistsInDB(user)

  const transactions = [];

  const stream = gateway.transaction.search((search) => {
    search.customerId().is(String(userInfo.customerId));
  });

  stream.on("data", (transaction) => {
    
    transactions.push({
      transactionId: transaction.id,
      amount: transaction.amount,
      customer: transaction.customer.id,
      status: transaction.status,
      refundId: transaction.refundId,
      refundIds: transaction.refundIds,
      refundedTransactionId: transaction.refundedTransactionId,
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
      transactionsLength: transactions.length,
      msg: `transactions succesfully fetched for customer: ${userInfo.customerId}`
    })

  });
}

/**
 * Refunds a transaction 
 */
exports.refund = async (req, res, next) => {

  try {

    const { user, transactionId } = req.body;  
    const userInfo = await checkUserExistsInDB(user);

    const response = await gateway.transaction.refund(String(transactionId)); 

    if(!response.success) {
      throw new Error(JSON.stringify({
        msg: `refund was unsuccessful for customer: ${userInfo.customerId} and transaction: ${transactionId}`,
        reason: response.message
      }))
    }
    
    res.status(200).send({
      success: response.success,
      msg: `refund was succesful for customer: ${userInfo.customerId} and transaction: ${transactionId}`
    })

  } catch (e) {
    console.log(e);
    res.status(401).send(e.message);
  }
}

/**
 * Voids a transaction 
 */
exports.void = async (req, res, next) => {

  try {
    const { user, transactionId } = req.body; 
    const userInfo = await checkUserExistsInDB(user);

    const response = await gateway.transaction.void(String(transactionId));

    if(!response.success) {
      throw new Error(JSON.stringify({
        msg: `void was unsuccessful for customer: ${userInfo.customerId} and transaction: ${transactionId}`,
        reason: response.message
      }))
    }

    res.status(200).send({
      success: response.success,
      msg: `void was succesful for customer: ${userInfo.customerId} and transaction: ${transactionId}`
    })

  } catch(e) {
    console.log(e);
    res.status(401).send(e.message);
  }
}