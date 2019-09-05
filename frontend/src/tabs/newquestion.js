import React from 'react';
import apiprefix from '../apiprefix';
import RequireAuthentication from '../authentication.js';
import useDataApi from '../apihook';
import { Link as RRLink } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  LinearProgress
} from '@material-ui/core';
import toast from '../ui/Snackbar';

import NewQuestionForm from './forms/newquestionform';

const NewQuestionTab = props => {
  const { currentUser } = props;
  const { data, isLoading, isOk, isError, errorMessage, request } = useDataApi(
    null,
    {}
  );
  let message = '';
  const question = data;
  if (isOk) {
    toast.success(`New question added to the survey`);
    message = (
      <RRLink to={`/question/${question.id}`}>
        Click to see question information.
      </RRLink>
    );
  }

  if (!currentUser.admin) {
    return <Typography color="error">needs admin permission</Typography>;
  }

  if (isLoading) return <LinearProgress />;

  if (isError) message = errorMessage;

  function addQuestion(question) {
    request({
      method: 'POST',
      url: `${apiprefix}/question`,
      data: question
    });
  }

  return (
    <Grid container>
      <Card>
        <CardHeader
          title={<Typography variant="h4">Add a new question</Typography>}
        />
        <CardContent>
          <NewQuestionForm
            question={{ question: '', description: '', type: 1, choices: [] }}
            onSubmit={v => addQuestion(v)}
            message={message}
          />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default RequireAuthentication(NewQuestionTab);
