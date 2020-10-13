import React, { Component } from 'react';
import DropIn from "braintree-web-drop-in-react";
import { Grid, Button } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
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
    }
  }

  componentDidMount() {
    this.instance = null;
    this.props.getClientToken();
  }

  addPaymentMethod = async () => {
    
    try {

      const transaction = await this.instance.requestPaymentMethod();

      const data = {
        transaction: transaction,
        user: this.props.user
      }

      const response = await axios.post('/addPaymentMethod', data); 

      if(response.status !== 200) throw new Error('could not contact API on /paymentmethod')

    } catch(e) {
      console.log(e);
    }
  }

  checkout = async () => {

    try {

      const transaction = await this.instance.requestPaymentMethod();

      const data = {
        transaction: transaction,
        user: this.props.user,
        amount: this.state.amount
      }

      const response = await axios.post('/checkout', data);

      if(response.status !== 200) throw new Error('could not contact API on /checkout')
       
    } catch(e) {
      console.log(e);
    }

  }

  determineAction = (type) => {

    switch(type) {
      case 'paymentMethod': 
        return <Button variant='contained' color='primary' fullWidth onClick = {this.addPaymentMethod}> Add Payment Method</Button>
      case 'checkout': 
        return <Button variant='contained' color='primary' fullWidth onClick = {this.checkout}> Checkout </Button>
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
              this.props.clientToken ? 
                <>
                  <DropIn
                    options={{
                      authorization: this.props.clientToken,
                      vaultManager: true
                    }}
                    onInstance={(instance) => (this.instance = instance)}
                  />
                  {this.determineAction(this.props.type)}
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
