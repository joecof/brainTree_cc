import React, { Component } from 'react';
import DropIn from "braintree-web-drop-in-react";
import { Grid, Button } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios';

const styles = theme => ({
  container: {
    width: '100%',
    marginTop: 20
  }
})

class BraintreeForm extends Component {

  constructor() {
    super();

    this.instance = null;

    this.state = {
      amount: 1, 
      save: false,
    }
  }

  componentDidMount() {
    this.props.getClientToken();
    this.instance = null;
  }

  handleChange = (event) => {
    this.setState({ ...this.state, [event.target.name]: event.target.checked });
  };

  addPaymentMethod = async (config) => {
    
    try {

      config = config ? config : {}; 
      
      const addedPaymentMethod = await axios.post('/addPaymentMethod', {
        transaction: await this.instance.requestPaymentMethod(config),
        user: this.props.user
      }); 

      if(addedPaymentMethod.status !== 200) throw new Error('could not contact API on /paymentmethod')

      return addedPaymentMethod;

    } catch(e) {
      console.log(e);
    }
  }

  checkout = async () => {

    try {

      if(!this.state.save) {

        const transaction =  await this.instance.requestPaymentMethod();

        const checkout = await axios.post('/checkout', {
          transaction:  transaction,
          user: this.props.user,
          amount: this.state.amount
        });

        if(checkout.status !== 200) throw new Error('could not contact API on /checkout')
        return;
      }

      const savedPaymentMethod = await this.addPaymentMethod();
      
      const checkout = await axios.post('/checkout', {
        paymentMethodToken: savedPaymentMethod.data.paymentToken,
        user: this.props.user,
        amount: this.state.amount
      });

      if(checkout.status !== 200) throw new Error('could not contact API on /checkout')

      this.setState({
        save: false
      })
       
    } catch(e) {
      console.log(e);
    }
  }

  threeDsCheckout = async () => {
    try {

      var threeDSecureParameters = {
        amount: this.state.amount,
        email: 'test@example.com',
        /**
         * Everything below is unnecessary to pass 3ds authentication during testing.
         * It will be necessary once in production to pass the 3ds look up validation 
         */
        billingAddress: {
          givenName: 'Jill', // ASCII-printable characters required, else will throw a validation error
          surname: 'Doe', // ASCII-printable characters required, else will throw a validation error
          phoneNumber: '8101234567',
          streetAddress: '555 Smith St.',
          extendedAddress: '#5',
          locality: 'Oakland',
          region: 'CA',
          postalCode: '12345',
          countryCodeAlpha2: 'US'
        },
        additionalInformation: {
          workPhoneNumber: '8101234567',
          shippingGivenName: 'Jill',
          shippingSurname: 'Doe',
          shippingPhone: '8101234567',
          shippingAddress: {
            streetAddress: '555 Smith St.',
            extendedAddress: '#5',
            locality: 'Oakland',
            region: 'CA',
            postalCode: '12345',
            countryCodeAlpha2: 'US'
          }
        },
      };

      if(!this.state.save) {

        const transaction =  await this.instance.requestPaymentMethod({
          threeDSecure: threeDSecureParameters
        });
        
        const checkout = await axios.post('/3dsCheckout', {
          transaction:  transaction,
          user: this.props.user,
          amount: this.state.amount
        });

        if(checkout.status !== 200) throw new Error('could not contact API on /checkout')
        return;
      }

      const savedPaymentMethod = await this.addPaymentMethod({
        threeDSecure: threeDSecureParameters
      });
      
      const checkout = await axios.post('/3dsCheckout', {
        paymentMethodToken: savedPaymentMethod.data.paymentToken,
        user: this.props.user,
        amount: this.state.amount
      });

      if(checkout.status !== 200) throw new Error('could not contact API on /checkout')

      this.setState({ save: false })

    } catch(e) {
      console.log(e);
    }
  }

  determineAction = (type) => {

    switch(type) {
      case 'paymentMethod': 
        return <Button variant='contained' color='primary' fullWidth onClick = {this.addPaymentMethod}> Add Payment Method</Button>
      case 'checkout': 
        return (
        <> 
          <FormControlLabel
            control={<Checkbox  name="save" onChange={this.handleChange}/>}
            label="Save Payment Method" /> 
          <Button variant='contained' color='primary' fullWidth onClick = {this.checkout}> Checkout </Button>
        </> )
      case '3ds': 
      return (
        <> 
          <FormControlLabel
            control={<Checkbox  name="save" onChange={this.handleChange}/>}
            label="Save Payment Method" /> 
          <Button variant='contained' color='primary' fullWidth onClick = {this.threeDsCheckout}> 3DS Checkout </Button>
        </> )
      default: 
        return;
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing = {0} className={classes.container}>
          <Grid item xs = {12}>
            {
              this.props.clientToken && 
              <>
                <DropIn
                  key={this.props.type}
                  options={{
                    authorization: this.props.clientToken,
                    vaultManager: true,
                    threeDSecure: this.props.type === '3ds',
                    dataCollector: {
                      client: this.instance,
                    },
                    paypal: {
                      flow: 'vault',
                      amount: this.state.amount,
                      currency: 'CAD'
                    }
                  }}
                  onInstance={(instance) => (this.instance = instance)}
                />
                {this.determineAction(this.props.type)}
              </>
            }
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true})(BraintreeForm);