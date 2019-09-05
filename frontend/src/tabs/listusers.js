import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  LinearProgress,
  Typography,
  Toolbar,
  Tooltip,
  IconButton
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import useDataApi from '../apihook';
import RequireAuthentication from '../authentication.js';
import { parse } from 'querystring';
import NavigateNext from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import apiprefix from '../apiprefix';

const styles = theme => ({
  centered: {
    margin: '0 auto', // https://learnlayout.com/max-width.html
    maxWidth: 600
  },
  centerChildren: {
    justifyContent: 'center'
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

const ListUserTab = ({ classes, currentUser, location, history }) => {
  let [page, setPage] = useState(() => {
    const query = parse(location.search.substring(1));
    return Number(query.page) || 0;
  });

  let { data, isOk, isLoading, isError, errorMessage, request } = useDataApi(
    {
      method: 'GET',
      url: `${apiprefix}/users?page=${page}`
    },
    { users: [] }
  );

  useEffect(() => {
    const query = parse(location.search.substring(1));
    const page = Number(query.page) || 0;
    setPage(page);
    request({ method: 'GET', url: `${apiprefix}/users?page=${page}` });
  }, [location]);

  let users = isOk ? data.users : [];

  const gotoPage = page => {
    const pathname = history.location.pathname;
    history.push({
      pathname,
      search: `?page=${page}`
    });
    setPage(page);
  };
  let goBackOnePage = () => {
    if (page > 0) gotoPage(page - 1);
  };
  let goForwardOnePage = () => {
    gotoPage(page + 1);
  };


  if (isLoading) return <LinearProgress />;

  if (isError)
    return (
      <Typography color="error" variant="body1">
        {errorMessage}
      </Typography>
    );

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h5" gutterBottom>
        List currently registered users
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Id </TableCell>
              <TableCell align="left">Username </TableCell>
              <TableCell align="left">First Name </TableCell>
              <TableCell align="left">Last Name </TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell align="left">{user.id}</TableCell>
                <TableCell align="left">{user.username}</TableCell>
                <TableCell align="left">{user.firstname}</TableCell>
                <TableCell align="left">{user.lastname}</TableCell>
                <TableCell align="left">{user.email}</TableCell>
                <TableCell align="left">{user.admin ? '✔' : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Toolbar>
        <IconButton disabled={page < 1} onClick={goBackOnePage}>
          <Tooltip title={`Click here to go to previous page`}>
            <NavigateBefore color="primary" fontSize="large" />
          </Tooltip>
        </IconButton>
        <IconButton disabled={!data.has_more} onClick={goForwardOnePage}>
          <Tooltip title={`Click here to go to next page`}>
            <NavigateNext color="primary" fontSize="large" />
          </Tooltip>
        </IconButton>
      </Toolbar>
    </div>
  );
};

ListUserTab.propTypes = {
  currentUser: PropTypes.object.isRequired
};

export default withStyles(styles)(RequireAuthentication(ListUserTab));
