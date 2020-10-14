import React, { Component } from 'react';
import Navbar from './Navbar'
import { Grid } from '@material-ui/core/';
import CheckoutLoader from './CheckoutLoader'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    width: '100%',
  },
})

class Dashboard extends Component {

  render() {
    const {classes} = this.props;

    return (
      <div>
        <Grid container spacing = {0} className = {classes.container}>
          <Grid item xs = {12}> <Navbar logoutHandler = {this.props.logoutHandler}/> </Grid>
            <CheckoutLoader/>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true})(Dashboard);