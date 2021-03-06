import React from 'react'
import Routes from './Routes'

const Container = (props) => {

  return(
    <>
      <Routes 
        isAuth = {props.isAuth}
        user = {props.user}
        loginHandler = {props.loginHandler}
        logoutHandler = {props.logoutHandler}
        getClientToken = {props.getClientToken}
        clientToken = {props.clientToken}
        activateCheckoutLoader = {props.activateCheckoutLoader}
        deactivateCheckoutLoader = {props.deactivateCheckoutLoader}
        loaderStatus = {props.loaderStatus}
      />
    </>
  )
}

export default Container;