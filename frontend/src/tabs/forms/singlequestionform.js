import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Typography, Grid, Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { Field, withFormik, Form } from 'formik';
import BarChart from '../../ui/BarChart';

import Radio from '@material-ui/core/Radio';

import { Link as RRLink } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { withStyles } from '@material-ui/core/styles';
// eslint-disable-next-line
import { MuiFormikRadioGroup } from '../../mui2formik';

const styles = theme => ({
  centered: {
    margin: '0 auto', // https://learnlayout.com/max-width.html
    maxWidth: 1200
  },
  centerChildren: {
    justifyContent: 'center'
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  textField: {
    width: '100%',
    marginBottom: 16
  }
});

const SignleQuestionForm = props => {
  const { classes, question, votes, isErrorUserVote } = props;
  const { totals } = votes;

  console.log(question);
  let descriptions = {};
  let chartData = question.choices.map(({ id }, idx) => {
    const count = totals.filter(v => v.choice === id);
    return {
      color: idx,
      x: id,
      y: count.length > 0 ? count[0].count : 0
    };
  });

  question.choices.forEach(
    ({ id, description }) => (descriptions[id] = description)
  );
  let leftsideBox = useRef(null);
  let leftHeight = 600;
  if (leftsideBox.current) {
    leftHeight = leftsideBox.current.getBoundingClientRect().height;
  }

  return (
    <div className={classes.root}>
      <Card className={classes.centered}>
        <Form autoComplete="off">
          <CardContent>
            <Typography align="left" variant="h5" gutterBottom>
              {question.question}
            </Typography>
            <Typography align="left" gutterBottom>
              {question.description}
            </Typography>
            <Field component={MuiFormikRadioGroup} name="vote">
              {question.choices.map((c, i) => (
                <FormControlLabel
                  key={c.id}
                  value={String(c.id)}
                  control={<Radio />}
                  label={c.description}
                />
              ))}
            </Field>
            {/* <DisplayFormikState {...props} /> */}
          </CardContent>
          <CardActions className={classes.centerChildren}>
            <Button type="submit" color="inherit">
              Vote
            </Button>
            <Button component={RRLink} to={'/'}>
              Cancel
            </Button>
          </CardActions>
        </Form>
      </Card>
      <Grid item xs={12} sm={8} className={classes.centered}>
        <Paper style={{ height: leftHeight }}>
          {!isErrorUserVote && (
            <BarChart data={chartData} axisCategory2Label={descriptions} />
          )}
          {isErrorUserVote && (
            <Typography align="left" gutterBottom color="error">
              You have to vote first in order to see the vote result
            </Typography>
          )}{' '}
        </Paper>
      </Grid>
    </div>
  );
};

SignleQuestionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isError: PropTypes.bool,
  isLoading: PropTypes.bool,
  message: PropTypes.string
};

export default withStyles(styles)(
  withFormik({
    isInitialValid: true,
    enableReinitialize: true,
    mapPropsToValues: ({ values }) => ({ ...values }),

    validate: values => {
      const errors = {};

      if (!values.vote) {
        errors.name = 'Required';
      }

      return errors;
    },

    handleSubmit: (values, { setSubmitting, props }) => {
      props.onSubmit(values);
      setSubmitting(false);
    },
    displayName: 'ChoicesForm'
  })(SignleQuestionForm)
);
