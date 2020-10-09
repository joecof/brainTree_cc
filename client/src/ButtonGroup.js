import React, { Component } from 'react'
import { Button, Grid } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom';


const styles = theme => ({
  button: {
    width: 200
  }
})

class ButtonGroup extends Component {

  constructor() {
    super();

    this.state = {
      clientToken: ''
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div> 
        <Grid container spacing = {0}>
          <Grid item xs = {6} align='left'>
            <Link to="/dashboard/pay">
              <Button variant = "outlined" className = {classes.button} onClick = {this.props.getClientToken}> PAY </Button>
            </Link>
          </Grid>
          <Grid item xs = {6} align='right'>
            <Link to="/refund">
              <Button variant = "outlined" className = {classes.button}> REFUND </Button>
            </Link>          
          </Grid>
        </Grid>           
      </div>
    )
  }
}



export default withStyles(styles, { withTheme: true})(ButtonGroup);
