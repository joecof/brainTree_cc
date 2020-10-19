import React, { Component } from 'react'
import axios from 'axios'
import { Grid, Button } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import RefundTable from './RefundTable'

const styles = theme => ({
  container: {
    width: '100%',
    marginTop: 20,
    marginBottom:20
  }
})

class Refund extends Component {

  constructor() {
    super();

    this.state = {
      transactions: []
    }
  }

  componentDidMount() {
    this.getTransactions();
  }

  getTransactions = async () => {
    const transactions = await axios.post('/getTransactions', {user: this.props.user});

    const sanitizedTransactions = transactions.data.transactions.map(item => {
      if(item.refundId) item.status = `${item.status}/refunded`
      if(item.refundedTransactionId) item.status = `${item.status} refund from ${item.refundedTransactionId}`
      return item;
    })

    this.setState({
      transactions: sanitizedTransactions
    })
  }
  

  handleRefund = async (transactionId) => {
    try {
      const response = await axios.post('/refund', {user: this.props.user, transactionId: transactionId})

      if(response.status !== 200) {
        throw new Error();
      }

      this.getTransactions();

    } catch (e) {
      console.log(e)
    }
  }

  handleVoid = async (transactionId) => {
    try {

      const response = await axios.post('/void', {user: this.props.user, transactionId: transactionId})

      if(response.status !== 200) {
        throw new Error();
      }

      this.getTransactions();

    } catch (e) {
      console.log(e)
    }
  }

  determineAction = (type, transactionId) => {
    switch(type) {
      case 'settled': 
        return <Button variant='contained' color='secondary' fullWidth onClick = {() => this.handleRefund(transactionId)}> Refund </Button>
      default: 
        return <Button variant='contained' color='primary' fullWidth onClick = {() => this.handleVoid(transactionId)}> Void </Button>;
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className = {classes.root}>
        <Grid container spacing = {0} className = {classes.container}>
          <Grid item xs = {12}>
            <RefundTable transactions = {this.state.transactions} determineAction = {this.determineAction}/>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true})(Refund);
