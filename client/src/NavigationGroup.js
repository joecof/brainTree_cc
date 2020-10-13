import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid} from '@material-ui/core'
import NavigationButton from './NavigationButton'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 50,
    width: '100%',
    margin: '0 auto'
  },
  headerContainer: {
    marginBottom: 25
  },
  header: {
    fontSize: 48
  },
  icon: {
    display: 'flex',
    '-webkit-box-align': 'center',
    alignItems: 'center',
    '-webkit-box-pack': 'center',
    justifyContent: 'center',
    backgroundColor: '#B4EEB4',
    height: 180,
    width: 180,
    borderRadius: '42% 58% 37% 63% / 55% 40% 60% 45%',
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 100,
    verticalAlign: 'middle',
    margin: 'auto',
  },
}));

export default function () {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing = {1}>
        <Grid item xs = {12}>
          <Grid container spacing = {3}>
            <Grid item xs = {12} ssm = {12} md = {6} >
              <NavigationButton 
                name = "Subscribe"
                color = "#96ceb4"
                link = "/dashboard/subscribe"
              />
            </Grid>
            <Grid item xs = {12} sm = {12} md = {6}>
              <NavigationButton
                name = "Checkout"
                color = "#ffeead"
                link = "/dashboard/checkout"
              />
            </Grid>
            <Grid item xs = {12} sm = {12} md = {6}>
              <NavigationButton
                name = "Add Payment Method"
                color = "#ff6f69"
                link = "/dashboard/paymentmethod"
              />
            </Grid>
            <Grid item xs = {12} sm = {12} md = {6}>
              <NavigationButton
                name = "Refund"
                color = "#ffcc5c"
                link = "/dashboard/refund"
              />
            </Grid>
            <Grid item xs = {12} sm = {12} md = {12}>
              <NavigationButton
                name = "Delete From Braintree"
                color = "#8b9dc3 "
                link = "/dashboard/delete"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
