import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    minWidth: 210,
    minHeight: 220,
    maxHeight: 220,
    cursor: 'pointer',
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center'
  },
  link: {
    textDecoration: 'none',
    color: 'black'
  },
});

export default function OutlinedCard(props) {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (bool) => {
    setValue(bool);
  }

  return (
    <Link className = {classes.link} to= {props.link}>
      <Card 
        className={classes.root} 
        style = {{backgroundColor: props.color}}
        variant={value ? "elevation" : "outlined"} 
        elevation = {value ? 5 : 0} 
        onMouseEnter={() => {handleChange(true)}} 
        onMouseLeave={()=>{handleChange(false)}}>
          <CardContent>
            <Typography variant="h5" component="h2" align='center'> {props.name}  </Typography> 
          </CardContent>    
      </Card>
    </Link>
  );
}