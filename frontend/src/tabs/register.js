import React from 'react';
import PropTypes from 'prop-types';
import UserForm from './forms/userinformation';
import { Typography } from '@material-ui/core';
import useDataApi from '../apihook';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router';
import apiprefix from '../apiprefix';

const styles = theme => ({
  centered: {
    margin: '0 auto',
    maxWidth: 600
  }
});

const RegisterTab = ({ classes, updateUser, location }) => {
  // an user message to be displayed, if any
  const { data, isOk, isError, isLoading, errorMessage, request } = useDataApi(
    null, // we do not want the hook to run a HTTP request initially
    {}, // initial empty state
    data => data.token //upon success, apply this function to extract token
  );

  // the data in both error/ok case may contain a message
  const message = isOk ? data.message : errorMessage;

  // callback when user clicks submit
  const registerUser = values => {
    // request just sets the "axiosConfig" state of the data api hook,
    // causing its effect hook to be re-run
    request({
      method: 'POST',
      url: `${apiprefix}/users`,
      data: values
    });
  };

  if (isOk) {
    console.log(`User successfully registered!`);
    /* this would be a good time to update our application's state of who
     * the current user is (perhaps by calling a passed-in updateUser function)
     * We probably will want to navigate away from the registration page:
     * e.g., like so: return <Redirect to={'/'}  />
     */
    let user = { authenticated: true, ...data.user };
    updateUser(user);
    const { from } = location.state || { from: { pathname: '/' } };
    return <Redirect to={from} />;
  }

  // the following code must work independent of which state we're in,
  // which means for all valid combinations of data/message/isOk/isError/isLoading
  // isLoading and isError are drilled down/passed on to the UserForm component
  // where error/status message and progress indicators are displayed
  return (
    <div className={classes.root}>
      <Typography align="center" variant="h5" gutterBottom>
        Register a new user
      </Typography>
      <UserForm
        onSubmit={registerUser}
        message={message}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

RegisterTab.propTypes = {
  updateUser: PropTypes.func.isRequired
};

export default withStyles(styles)(RegisterTab);
