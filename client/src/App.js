import React, { Component } from 'react';
import axios from 'axios'
import { Grid } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles'
import ButtonGroup from './ButtonGroup'
import Routes from './Routes'

const styles = theme => ({
  container: {
    width: 800,
    margin: '0 auto',
  },
  buttonContainer: {
    marginTop: 100,
    marginBottom:25
  },
  backArrow: {
    marginTop: 50
  },
})

class App extends Component {

  constructor() {
    super();

    this.state = {
      clientToken: '',
    }
  }

  componentDidMount() {
    this.getClientToken();
    
  }

  getClientToken = async () => {

    try {

      const {data, status} = await axios.get('/generateToken');

      if(status !== 200) return;
  
      this.setState({ clientToken: data })

    } catch(e) {
      console.log(e);
    }
  }

  render() {

    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing = {0} className = {classes.container}>
          <Grid item xs = {12} className = {classes.buttonContainer}>
            <ButtonGroup/>
          </Grid>
          <Grid item xs = {12}>
            <Routes
              clientToken = {this.state.clientToken}
            />
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true})(App);
