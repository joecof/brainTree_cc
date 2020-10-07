import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import About from "../About/About";
import Home from "../Home/Home";
import TempProfile from "../Profile/Temps/TempProfile";
import DentalProfile from "../Profile/Office/DentalProfile";
import TermsAndConditions from "../Terms/TermsAndConditions";
import Pricing from "../Policy/Pricing";
import Privacy from "../Policy/Policy";
import VerifyEmailPage from "../VerifyEmail/VerifyEmailPage";
import AdminTable from "../Admin/AdminTable";
import MyAvailability from "../MyAvailability/MyAvailability";
import Unsubscribe from "../Unsubscribe/UnsubscribePage";
import BookNow from '../BookNow/BookNow'
import Records from '../Records/Records'
import OfficeSchedule from '../Schedule/Office/OfficeSchedule'
import TempSchedule from '../Schedule/Temps/TempSchedule'
import FindFitContainer from '../FindFit/FindFitContainer'
import Pending from '../Pending/Pending'
import JobPosting from "../JobPosting/JobPosting";
import Dashboard from '../Dashboard/Dashboard'
import WPLogin from '../Login/WP/WPLogin'
import WPSignUp from '../SignUp/WP/WPSignUp'

export default class Routes extends Component {
  
  render() {

    let routes = (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => (
            <WPLogin 
              {...props} 
              token = {this.props.token} 
              appLink = {this.props.appLink}
              loginHandler = {this.props.loginHandler} 
              logoutHandler = {this.props.logoutHandler}
              />
          )}
        />
        <Route
          path="/signup"
          exact
          render={(props) => (
            <WPSignUp 
              {...props} 
              appLink = {this.props.appLink}
              token={this.props.token} 
              appLink = {this.props.appLink}
              />
          )}
        />
        <Route
          path="/about"
          exact
          render={(props) => <About {...props} />}
        />
        <Route
          path="/termsAndConditions"
          exact
          render={(props) => <TermsAndConditions {...props} />}
        />
        <Route
          path="/pricing"
          exact
          render={(props) => <Pricing {...props} />}
        />
        <Route
          path="/privacy"
          exact
          render={(props) => <Privacy {...props} />}
        />
        <Route
          path="/verifyEmail/:token"
          exact
          render={(props) => <VerifyEmailPage {...props}/>}
        />
        <Route
          path="/unsubscribe"
          exact
          render={(props) => <Unsubscribe {...props} />}
        />
      </Switch>
    );

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
                      token={this.props.token}
                      isAuth={this.props.isAuth}
                      loadedUser = {this.props.loadedUser}
                      logoutHandler = {this.props.logoutHandler}
                      mobileView = {this.props.mobileView}
                    />)}
                  />
                <Route 
                  path={`${url}/post_job`} 
                  render={(props) => (
                    <BookNow
                      {...props}
                      token={this.props.token}
                      isAuth={this.props.isAuth}
                      office = {this.props.office}
                      loadedUser = {this.props.loadedUser}
                      mobileView = {this.props.mobileView}
                    />)}
                  />
                <Route 
                  path={`${url}/find_temp`} 
                  render={(props) => (
                    <FindFitContainer
                      {...props}
                      token={this.props.token}
                      isAuth={this.props.isAuth}
                      mobileView = {this.props.mobileView}
                    />)}
                  />
                <Route 
                  path={`${url}/office_schedule`} 
                  render={(props) => (
                    <OfficeSchedule
                      {...props}
                      token={this.props.token}
                      isAuth={this.props.isAuth}
                      loadedUser = {this.props.loadedUser}
                      mobileView = {this.props.mobileView}
                    />)}
                  />
                <Route 
                  path={`${url}/records`} 
                  render={(props) => (
                    <Records
                      {...props}
                      token={this.props.token}
                      loadedUser={this.props.loadedUser}
                      mobileView = {this.props.mobileView}
                    />)}
                  />
                <Route 
                  path={`${url}/office/account`} 
                  render={(props) => (
                    <DentalProfile
                      {...props}
                      token={this.props.token}
                      office={this.props.office}
                      loadedUser={this.props.loadedUser}
                    />)}
                  />
                <Route 
                  path={`${url}/temp/account`} 
                  render={(props) => (
                    <TempProfile
                      {...props}
                      token={this.props.token}
                      loadedUser={this.props.loadedUser}
                    />)}
                  />
                  <Route 
                  path={`${url}/pending`} 
                  render={(props) => (
                    <Pending
                      {...props}
                      token={this.props.token}
                      loadedUser={this.props.loadedUser}
                      mobileView = {this.props.mobileView}
                      temp = {this.props.temp}
                    />)}
                  />
                <Route 
                  path={`${url}/temp_schedule`} 
                  render={(props) => (
                    <TempSchedule
                      {...props}
                      token={this.props.token}
                      isAuth={this.props.isAuth}
                      loadedUser = {this.props.loadedUser}
                      mobileView = {this.props.mobileView}
                      temp = {this.props.temp}
                    />)}
                  />
                  <Route 
                    path={`${url}/job_postings`} 
                    render={(props) => (
                      <JobPosting
                        {...props}
                        token={this.props.token}
                        temp = {this.props.temp}
                        mobileView = {this.props.mobileView}
                      />)}
                  />
                  <Route 
                    path={`${url}/my_availability`} 
                    render={(props) => (
                      <MyAvailability
                        {...props}
                        token={this.props.token}

                      />)}
                  />
              </>
            )}
          />
          <Route
            path="/tempPayment"
            exact
            render={(props) => (<AdminTable {...props} token={this.props.token} />)}
          />
          <Route
            path="/users"
            exact
            render={(props) => <AdminTable {...props} token={this.props.token} />}
          />
          <Route
            path="/temps"
            exact
            render={(props) => <AdminTable {...props} token={this.props.token} />}
          />
          <Route
            path="/offices"
            exact
            render={(props) => <AdminTable {...props} token={this.props.token} />}
          />
          <Route
            path="/gigs"
            exact
            render={(props) => <AdminTable {...props} token={this.props.token} />}
          />
          <Route
            path="/bookings"
            exact
            render={(props) => <AdminTable {...props} token={this.props.token} />}
          />
          <Route
            path="/ratings"
            exact
            render={(props) => <AdminTable {...props} token={this.props.token} />}
          />
        </Switch>
      );
    }

    return <div>{routes}</div>;
  }
}