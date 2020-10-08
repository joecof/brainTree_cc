import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import BraintreeForm from './BraintreeForm'

export default class Routes extends Component {
  
  render() {

    const routes = (
      <Switch>
        <Route
          path="/braintree"
          render={({ match: { url } }, props) => (
            <>
              <Route 
                path={`${url}/pay`} 
                render={() => (
                  <BraintreeForm
                    clientToken = {this.props.clientToken}
                  />)}
                />
              {/* <Route 
                path={`${url}/refund`} 
                render={(props) => (
                  <BookNow
                    {...props}
                    token={this.props.token}
                    isAuth={this.props.isAuth}
                    office = {this.props.office}
                    loadedUser = {this.props.loadedUser}
                    mobileView = {this.props.mobileView}
                  />)}
                /> */}
            </>
          )}
        />
      </Switch>
    );

    return <div>{routes}</div>;
  }
}