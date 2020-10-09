import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles'
import {AppBar, Toolbar, Typography, Button} from '@material-ui/core/';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
})

class Navbar extends Component {

  render() {
    const {classes} = this.props;
    return(
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Payment
            </Typography>
            <Button color="inherit" onClick = {this.props.logoutHandler}>Logout</Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true})(Navbar);