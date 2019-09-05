import React from 'react';
import { Link as RRLink } from 'react-router-dom';
import { Field, withFormik, Form } from 'formik';
import { MuiFormikTextField } from '../../mui2formik';
import MultiEntryField from './MultiEntryField';
import { Typography, LinearProgress, Toolbar, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

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

const NewQuestionForm = props => {
  const { classes, setFieldValue, values, isLoading, message, isError } = props;

  return (
    <div className={classes.root}>
      <Form autoComplete="off" className={classes.centered}>
        <Field
          component={MuiFormikTextField}
          name="question"
          fullWidth
          label={'Question'}
        />
        <Field
          component={MuiFormikTextField}
          name="description"
          label={'Description'}
          fullWidth
          multiline
          rows={10}
        />
        <MultiEntryField
          name="choices"
          value={values.choices}
          onChange={v => setFieldValue('choices', v)}
          entryLabel={idx => `#${idx + 1}`}
          addButtonLabel="Add a new choice"
          newEntryDefault=""
        />
        {isLoading && <LinearProgress />}
        <Toolbar className={classes.centerChildren}>
          <Button type="submit" color="inherit">
            Save
          </Button>
          <Button component={RRLink} to={'/questions'}>
            Cancel
          </Button>
        </Toolbar>
        {!isError && (
          <Typography align="center" variant="body1" gutterBottom>
            {message}
          </Typography>
        )}
      </Form>
    </div>
  );
};

export default withStyles(styles)(
  withFormik({
    mapPropsToValues: ({ question }) => ({ ...question }),
    validate: values => {
      const errors = {};
      return errors;
    },
    enableReinitialize: true,
    handleSubmit: (values, { setSubmitting, props }) => {
      props.onSubmit(values);
      setSubmitting(false);
    },
    displayName: 'NewQuestionForm'
  })(NewQuestionForm)
);
