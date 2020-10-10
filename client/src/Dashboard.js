import React, { Component } from 'react';
import BraintreeForm from './BraintreeForm'
import ButtonGroup from './ButtonGroup'
import Navbar from './Navbar'
import { Grid } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    width: '80%'
  },
  form: {
    marginTop: 50
  }
})

class Dashboard extends Component {
  render() {
    const {classes} = this.props;

    return (
      <div>
        <Grid container spacing = {0} className = {classes.container}>
          <Grid item xs = {12}>
            <Navbar logoutHandler = {this.props.logoutHandler} />
          </Grid>
          <Grid item xs = {12} className = {classes.form}>
            <ButtonGroup getClientToken = {this.props.getClientToken}/>
            <BraintreeForm clientToken = {this.props.clientToken} user = {this.props.user}/>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true})(Dashboard);