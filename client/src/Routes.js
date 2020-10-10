import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from './Dashboard'
import Login from './Login'

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
                      user = {this.props.user}
                      clientToken = {this.props.clientToken}
                      getClientToken = {this.props.getClientToken}
                      logoutHandler = {this.props.logoutHandler}
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