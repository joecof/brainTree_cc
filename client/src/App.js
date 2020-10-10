import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios'
import { Grid } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles'
import Container from './Container'

const styles = theme => ({
  container: {
    width: 900,
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
      user: null,
      clientToken: '',
    }
  }

  componentDidMount() {

    if(!this.isSessionValid()) return;
    
    this.getUserSessionInfo()
    this.setAutoLogout(this.getRemainingSessionTime());
  }

  loginHandler = async (e, loginData) => {
    e.preventDefault();

    try {
      const {data, status} = await axios.post('/login', loginData);
      if(status !== 200) throw new Error('could not contact API on /login')
      if(data) this.setUserSession(data);      
      this.props.history.push('/dashboard')
  
    } catch (e) {
      console.log(e);
    }
  }

  logoutHandler = () => {
    this.endUserSession();
    this.props.history.push('/');
  }

  isSessionValid = () => sessionStorage.getItem('logged');

  getUserSessionInfo = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    this.setState({ 
      isAuth: true,
      user: user
    });
  }
  
  setUserSession = async (data) => {
    localStorage.setItem('user', JSON.stringify(data.customerInfo));
    localStorage.setItem('expiryDate', this.getExpiryDate().toISOString());
    sessionStorage.setItem('logged', true)
    this.setState({isAuth: true})
  }

  endUserSession = () => {
    this.setState({ isAuth: false })

    localStorage.removeItem('user');
    localStorage.removeItem('expiryDate');
    sessionStorage.removeItem('logged');
  }

  getRemainingSessionTime = () => new Date(localStorage.getItem('expiryDate')).getTime() - new Date().getTime();
  getExpiryDate = () => new Date(new Date().getTime() + 60 * 60 * 1000);
  setAutoLogout = (milliseconds) => setTimeout(() => {this.logoutHandler();}, milliseconds);

  getClientToken = async () => {
    try {

      const {data, status} = await axios.post('/generateToken', {user: this.state.user});
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
              user = {this.state.user}
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