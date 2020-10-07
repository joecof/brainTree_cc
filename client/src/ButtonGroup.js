import React, { Component } from 'react'
import { Button, Grid } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  button: {
    width: 200
  }
})


class ButtonGroup extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div> 
        <Grid container spacing = {0}>
          <Grid item xs = {6}>
            <Button variant = "outlined" className = {classes.button}> PAY </Button>
          </Grid>
          <Grid item xs = {6}>
            <Button variant = "outlined" className = {classes.button}> REFUND </Button>
          </Grid>
        </Grid>           
      </div>
    )
  }
}



export default withStyles(styles, { withTheme: true})(ButtonGroup);