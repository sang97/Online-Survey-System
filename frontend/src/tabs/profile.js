import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import apiprefix from '../apiprefix';

import RequireAuthentication from '../authentication.js';
import useDataApi from '../apihook';

const styles = () => ({
  centered: {
    margin: '0 auto',
    maxWidth: 600
  },
  table: {
    minHeight: 200
  }
});

const ProfileTab = ({ classes, currentUser }) => {
  let { data } = useDataApi({
    method: 'GET',
    url: `${apiprefix}/users/${currentUser.id}`
  });

  return (
    <>
      <Typography align="center" variant="h5" gutterBottom>
        Current User Profile
      </Typography>
      <Paper className={classes.centered}>
        <Table className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell align="left">Id</TableCell>
              <TableCell align="left">{data.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Username</TableCell>
              <TableCell align="left">{data.username}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">First name</TableCell>
              <TableCell align="left">{data.firstname}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Last name</TableCell>
              <TableCell align="left">{data.lastname}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">{data.email}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

ProfileTab.propTypes = {
  currentUser: PropTypes.object.isRequired
};

export default withStyles(styles)(RequireAuthentication(ProfileTab));
