import React from 'react'
import Routes from './Routes'

const Container = (props) => {

  return(
    <>
      <Routes 
        isAuth = {props.isAuth}
        loginHandler = {props.loginHandler}
        logoutHandler = {props.logoutHandler}
        getClientToken = {props.getClientToken}
        clientToken = {props.clientToken}
      />
    </>
  )
}

export default Container;