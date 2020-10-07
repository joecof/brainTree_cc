import React, { Component } from 'react'
import DropIn from "braintree-web-drop-in-react";
import { Button, Grid } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    width: '100%'
  }
})


class BraintreeForm extends Component {
  render() {

    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing = {0} className={classes.container}>
          <Grid item xs = {12}>
            {
              this.props.clientToken ? 
                <DropIn
                  options={{ authorization: this.props.clientToken }}
                  onInstance={(instance) => (this.instance = instance)}
                />
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
