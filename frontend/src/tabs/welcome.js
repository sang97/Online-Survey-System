import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
// import { Link as RRLink } from 'react-router-dom';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

const WelcomeTab = ({ classes }) => {
  return (
    <>
      <div className={classes.root}>
        <Typography align="center" variant="h5" gutterBottom>
          Welcome to Survey
        </Typography>

        {/* <Typography>
          Click on a tab. Users can click{' '}
          <RRLink to={'/register'}> register </RRLink> to register,{' '}
          <RRLink to={'/login'}> login </RRLink> to login,{' '}
          <RRLink to={'/profile'}> profile </RRLink> to see profile,{' '}
          <RRLink to={'/listusers'}> list users </RRLink> to see all the users
        </Typography> */}
      </div>
    </>
  );
};

export default withStyles(styles)(WelcomeTab);
