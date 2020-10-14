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

  addPaymentMethod = async () => {
    
    try {
      const addedPaymentMethod = await axios.post('/addPaymentMethod', {
        transaction: await this.instance.requestPaymentMethod(),
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
      if(!savedPaymentMethod) throw new Error('could not contact API on /addPaymentmethod')

      const checkout = await axios.post('/checkout', {
        paymentMethodToken: savedPaymentMethod.data.paymentToken,
        user: this.props.user,
        amount: this.state.amount
      });

      if(checkout.status !== 200) throw new Error('could not contact API on /checkout')

      this.setState({
        save: false
      })

      this.props.activateCheckoutLoader();
       
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
                    vaultManager: true
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
