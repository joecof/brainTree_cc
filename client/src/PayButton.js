import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    color: 'white',
    fontSize: '1.2rem',
    borderRadius: 50,
    '&:hover': {
      backgroundColor: green[500],
      color: 'white'
    },
    height: 64,
    marginTop: 3
  },
  button: {
    backgroundColor: '#1C56AC',
    color: 'white',
    fontSize: '1.2rem',
    borderRadius: 50,
    '&:hover': {
      backgroundColor: '#4d4d4d',
      color: 'white'
    },
    height: 64,
    marginTop: 3
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  confirm: {
    position: 'relative',
    top: 3
  }
}));

export default function CircularIntegration(props) {

  const classes = useStyles();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: props.success,
    [classes.button]: !props.success,
  });

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Button
          variant="contained"
          className={buttonClassname}
          fullWidth
          disabled={props.isLoading}
          onClick={props.handleSubmitForm}
        >
          {props.success ? <div> {props.successText} <CheckRoundedIcon className = {classes.confirm}/> </div> : props.name}
        </Button>
        {props.isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    </div>
  );
}