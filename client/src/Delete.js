import React, { Component } from 'react'
import axios from 'axios'

export default class Delete extends Component {

  constructor() {
    super();

    this.state = {
      msg: 'currently logged in as an anon customer'
    }
  }

  componentDidMount(){
    this.deleteBraintreeCustomer();
  }

  deleteBraintreeCustomer = async () => {
    
    try {
      const response = await axios.post('/customer/delete', this.props.user)

      if(response.status !== 200) {
        this.setState({msg: `could not delete braintree customer: ${JSON.stringify(this.props.user)}`})
        return;
      }

      this.setState({msg: `deleted braintree customer: ${JSON.stringify(this.props.user)}`})

      await this.props.getClientToken();

    } catch (e) {
      console.log(e);
    }
  } 
  
  render() {
    return (
      <div>
        <h2>{this.state.msg}</h2>
      </div>
    )
  }
}
