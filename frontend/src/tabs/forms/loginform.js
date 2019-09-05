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

const styles = () => ({
  centered: {
    margin: '0 auto', // https://learnlayout.com/max-width.html
    maxWidth: 600
  },
  centerChildren: {
    justifyContent: 'center'
  }
});

/* Form used for login users. */
const LoginForm = ({
  classes,
  onSubmit,
  isLoading,
  isError,
  message,
  updateUser
}) => {
  // we are using controlled components as per
  // https://reactjs.org/docs/forms.html#controlled-components
  // although instead of setState etc. as in class-based components
  // we are using the Hooks API

  // internal state that represents current state of the form
  const [values, setValues] = useState({
    username: '',
    password: ''
  });

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

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  message: PropTypes.string
};

export default withStyles(styles)(LoginForm);
