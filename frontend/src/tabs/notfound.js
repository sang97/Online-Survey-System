import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Link as RRLink } from 'react-router-dom';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

const NotFoundTab = ({ classes }) => {
  return (
    <>
      <div className={classes.root}>
        <Typography align="center" variant="h5" gutterBottom>
          Page Not Found
        </Typography>

        <Typography>
          Sorry but I could not find this location. Click{' '}
          <RRLink to={'/'}> here </RRLink> to go back home page.
        </Typography>
      </div>
    </>
  );
};

export default withStyles(styles)(NotFoundTab);
