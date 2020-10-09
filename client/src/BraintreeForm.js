import React, { Component } from 'react';
import axios from 'axios';
import DropIn from "braintree-web-drop-in-react";
import { Button, Grid } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    width: '100%'
  }
})

class BraintreeForm extends Component {

  constructor() {
    super();

    this.instance = null; 

    this.state = {
      amount: 1, 
    }
  }

  handlePayment = async () => {

    try {
      const transaction = await this.instance.requestPaymentMethod();

      const data = {
        amount: this.state.amount,
        transaction: transaction, 
      }

      const response = await axios.post('/checkout', data); 
      if(response.status !== 200) throw new Error('could not contact API on /checkout')

    } catch(e) {
      console.log(e);
    }
  }

  handleCustomerPayment = async () => {
    try {

      const transaction = await this.instance.requestPaymentMethod();
      const data = {
        amount: this.state.amount,
        transaction: transaction
      }

      const response = await axios.post('/customerCheckout', data); 
      if(response.status !== 200) throw new Error('could not contact API on /customerCheckout')

    } catch(e) {
      console.log(e);
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing = {0} className={classes.container}>
          <Grid item xs = {12}>
            {
              this.props.clientToken ? 
                <>
                  <DropIn
                    options={{authorization: this.props.clientToken}}
                    onInstance={(instance) => (this.instance = instance)}
                  />
                  {/* <Button variant = "contained" color="primary" fullWidth onClick = {this.handlePayment}>Submit</Button> */}
                  <Button variant = "contained" color="primary" fullWidth onClick = {this.handleCustomerPayment}>Submit</Button>
                </>
                :
                null
            }
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true})(BraintreeForm);
