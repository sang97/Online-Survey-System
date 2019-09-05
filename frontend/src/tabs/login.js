import React from 'react';
import PropTypes from 'prop-types';
import LoginForm from './forms/loginform';
import { Typography } from '@material-ui/core/';
import useDataApi from '../apihook';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import apiprefix from '../apiprefix';

const styles = theme => ({
  centered: {
    margin: '0 auto',
    maxWidth: 600
  }
});

const LoginTab = ({ classes, updateUser, currentUser, location }) => {
  const { data, isOk, isError, isLoading, errorMessage, request } = useDataApi(
    null, // we do not want the hook to run a HTTP request initially
    {}, // initial empty state
    data => data.token //upon success, apply this function to extract token
  );

  // the data in both error/ok case may contain a message
  const message = isOk ? data.message : errorMessage;

  // callback when user clicks submit
  const loginUser = values => {
    request({
      // request just sets the "axiosConfig" state of the data api hook,
      // causing its effect hook to be re-run
      method: 'POST',
      url: `${apiprefix}/login`,
      data: values
    });
  };

  const isAuthenticated = currentUser.authenticated;
  if (isAuthenticated) {
    const { from } = location.state || { from: { pathname: '/' } };
    console.log(`already authenticated, redirecting to ${from.pathname}`);
    return <Redirect to={from} />;
  }

  if (isOk) {
    console.log(`User successfully log-in`);
    let user = { authenticated: true, ...data.user };
    updateUser(user);
    const { from } = location.state || { from: { pathname: '/' } };
    return <Redirect to={from} />;
  }

  return (
    <>
      <div className={classes.root}>
        <Typography align="center" variant="h4">
          Please log in
        </Typography>
        <LoginForm
          onSubmit={loginUser}
          message={message}
          isLoading={isLoading}
          isError={isError}
          updateUser={updateUser}
          currentUser={currentUser}
        />
        <Typography align="center" gutterBottom>
          Do not have an account? <Link to={'/register'}> Sign up</Link> for
          one.
        </Typography>
      </div>
    </>
  );
};

LoginTab.propTypes = {
  updateUser: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginTab);
