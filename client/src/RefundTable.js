import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress} from '@material-ui/core';

const styles = () => ({
  loader: {
    marginTop: 100
  }
})

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

class RefundTable extends Component {

  render() {

    const { classes } = this.props;

    return(

      this.props.transactions.length  <= 0 ?
      <Grid container spacing = {0}>
        <Grid item xs = {12} align = 'center'>
          <CircularProgress className = {classes.loader}/>
        </Grid>
      </Grid>
      :
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell>transactionId</StyledTableCell>
              <StyledTableCell align="right">status</StyledTableCell>
              <StyledTableCell align="right">customerId</StyledTableCell>
              <StyledTableCell align="right">cardType</StyledTableCell>
              <StyledTableCell align="right">last4</StyledTableCell>
              <StyledTableCell align="right">amount</StyledTableCell>
              <StyledTableCell align="right">action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {
            this.props.transactions.map((row) => {
              return (
              <StyledTableRow key={row.transactionId}>
                <StyledTableCell component="th" scope="row">
                  {row.transactionId}
                </StyledTableCell>
                <StyledTableCell align="right">{row.status}</StyledTableCell>
                <StyledTableCell align="right">{row.customer}</StyledTableCell>
                <StyledTableCell align="right">{row.creditCard.cardType}</StyledTableCell>
                <StyledTableCell align="right">{row.creditCard.last4}</StyledTableCell>
                <StyledTableCell align="right">{row.amount}</StyledTableCell>
                <StyledTableCell align="right"><Button color='secondary' variant='contained'>Refund</Button></StyledTableCell>
              </StyledTableRow>)
            })
          }
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default withStyles(styles, { withTheme: true})(RefundTable);