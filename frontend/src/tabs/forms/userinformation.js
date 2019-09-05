import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';

// import { Redirect } from 'react-router';

const styles = () => ({
  centered: {
    margin: '0 auto', // https://learnlayout.com/max-width.html
    maxWidth: 600
  },
  centerChildren: {
    justifyContent: 'center'
  }
});

/* Form used for register new users. */
const UserForm = ({ classes, onSubmit, isLoading, isError, message, user }) => {
  // we are using controlled components as per
  // https://reactjs.org/docs/forms.html#controlled-components
  // although instead of setState etc. as in class-based components
  // we are using the Hooks API

  let initialUser = user
    ? {
        username: user.username,
        password: '',
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }
    : {
        lastname: '',
        firstname: '',
        username: '',
        email: '',
        password: ''
      };

  // internal state that represents current state of the form
  const [values, setValues] = useState(initialUser);

  // a universal onChange handler that propagates user input to component state
  const handleChange = event => {
    let { name, value } = event.target; // name/value from input element that changed
    setValues({ ...values, [name]: value }); // update corresponding field in values object
  };

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <Card className={classes.centered}>
      <form onSubmit={event => handleSubmit(event)} autoComplete="off">
        <CardContent>
          <TextField
            type="text"
            name="username"
            label="Username"
            value={values.username}
            fullWidth
            margin="normal"
            onChange={event => handleChange(event)}
          />
          <TextField
            type="password"
            name="password"
            label="Password"
            fullWidth
            margin="normal"
            value={values.password}
            onChange={event => handleChange(event)}
          />
          <TextField
            type="text"
            name="firstname"
            label="First Name"
            fullWidth
            margin="normal"
            value={values.firstname}
            onChange={event => handleChange(event)}
          />
          <TextField
            type="text"
            name="lastname"
            label="Last Name"
            fullWidth
            margin="normal"
            value={values.lastname}
            onChange={event => handleChange(event)}
          />
          <TextField
            type="text"
            name="email"
            label="Email"
            fullWidth
            margin="normal"
            value={values.email}
            onChange={event => handleChange(event)}
          />
          {isLoading && <LinearProgress />}
          {message && (
            <Typography color={isError ? 'error' : 'primary'} variants="body1">
              {message}
            </Typography>
          )}
        </CardContent>
        <CardActions className={classes.centerChildren}>
          <Button type="submit">Submit!</Button>
          <Button href={'/'}>Cancel</Button>
        </CardActions>
      </form>
    </Card>
  );
};

UserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isError: PropTypes.bool,
  isLoading: PropTypes.bool,
  message: PropTypes.string
};

export default withStyles(styles)(UserForm);
