import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from './Dashboard'
import NavigationGroup from './NavigationGroup'
import Delete from './Delete'
import Login from './Login'
import BraintreeForm from './BraintreeForm'

export default class Routes extends Component {
  
  render() {

    let routes = (
      <Switch>
        <Route 
          path='/'
          exact
          render={() => (
            <Login
              loginHandler = {this.props.loginHandler}
            />
          )}
        />
      </Switch>
    )

    if (this.props.isAuth) {
      routes = (
        <Switch>
          <Route
            path="/dashboard"
            render={({ match: { url } }, props) => (
              <>
                <Route 
                  path={`${url}/`} 
                  render={(props) => (
                    <Dashboard
                      {...props}
                      clientToken = {this.props.clientToken}
                      getClientToken = {this.props.getClientToken}
                      logoutHandler = {this.props.logoutHandler}
                    />)}
                  />
                <Route 
                  path={`${url}/delete`} 
                  render={(props) => (
                    <Delete
                      {...props}
                      user = {this.props.user}
                      getClientToken = {this.props.getClientToken}
                    />)}
                  />
                <Route 
                  path={`${url}/menu`} 
                  render={(props) => (
                    <NavigationGroup
                      {...props}
                      clientToken = {this.props.clientToken}
                      getClientToken = {this.props.getClientToken}
                    />)}
                  />
                <Route 
                  path={`${url}/paymentmethod`} 
                  render={(props) => (
                    <BraintreeForm
                      {...props}
                      type='paymentMethod'
                      user = {this.props.user}
                      clientToken = {this.props.clientToken}
                      getClientToken = {this.props.getClientToken}
                    />)}
                  />
                <Route 
                  path={`${url}/checkout`} 
                  render={(props) => (
                    <BraintreeForm
                      {...props}
                      type='checkout'
                      user = {this.props.user}
                      clientToken = {this.props.clientToken}
                      getClientToken = {this.props.getClientToken}
                    />)}
                  />
              </>
            )}
          />
        </Switch>
      );
    }

    return <div>{routes}</div>;
  }
}