import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles'
import {AppBar, Toolbar, Typography, Button, Grid} from '@material-ui/core/';
import { Link } from "react-router-dom";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  link: {
    textDecoration: 'none',
    color: 'white'
  }
})

class Navbar extends Component {

  render() {
    const {classes} = this.props;
    return(
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Grid container spacing = {0}>
              <Grid item xs = {11} align = 'left'>
                <Link className = {classes.link} to="/dashboard/menu"> <Typography variant="h6" className={classes.title}>  Braintree  </Typography> </Link>
              </Grid>
              <Grid item xs = {1} align = 'right'>
                <Button color="inherit" onClick = {this.props.logoutHandler}>Logout</Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true})(Navbar);