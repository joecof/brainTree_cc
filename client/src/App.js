import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios'
import { Grid } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles'
import Container from './Container'

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
      isAuth: false, 
      clientToken: '',
    }
  }

  componentDidMount() {

    if(!this.isSessionValid()){
      return;
    } 

    this.getUserSessionInfo()
    this.setAutoLogout(this.getRemainingSessionTime());
  }

  getUserSessionInfo = () => {
    this.setState({
      isAuth: true,
    });
  }

  isSessionValid = () => {
    return sessionStorage.getItem('logged')
  }

  setUserSession = async () => {
    localStorage.setItem('expiryDate', this.getExpiryDate().toISOString());
    sessionStorage.setItem('logged', true)
    this.setState({isAuth: true})
  }

  endUserSession = () => {

    this.setState({
      isAuth: false
    })
    
    localStorage.removeItem('expiryDate');
    sessionStorage.removeItem('logged');
  }

  getRemainingSessionTime = () => {
    const expiryDate = localStorage.getItem('expiryDate');
    const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();
    return remainingMilliseconds;
  }

  getExpiryDate = () => {
    const expiryDate = new Date(new Date().getTime() + 60 * 60 * 1000);
    return expiryDate;
  }

  setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  loginHandler = async (e, loginData) => {
    e.preventDefault();

    try {

      const {data, status} = await axios.post('/login', loginData);
      if(status !== 200) throw new Error('could not contact API on /login')
      if(data) this.setUserSession();
      this.props.history.push('/dashboard')
  
    } catch (e) {
      console.log(e);
    }
  }

  logoutHandler = () => {
    this.endUserSession();
    this.props.history.push('/');
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
          <Grid item xs = {12}>
            <Container
              isAuth = {this.state.isAuth}
              loginHandler = {this.loginHandler}
              logoutHandler = {this.logoutHandler}
              getClientToken = {this.getClientToken}
              clientToken = {this.state.clientToken}
            />
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true})(withRouter(App));