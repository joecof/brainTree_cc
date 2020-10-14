import React, { Component } from 'react'
import axios from 'axios'
import { Grid } from '@material-ui/core/';
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

    this.setState({
      transactions: transactions.data.transactions
    })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className = {classes.root}>
        <Grid container spacing = {0} className = {classes.container}>
          <Grid item xs = {12}>
            <RefundTable transactions = {this.state.transactions}/>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true})(Refund);
