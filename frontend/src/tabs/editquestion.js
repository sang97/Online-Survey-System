import React from 'react';
import apiprefix from '../apiprefix';
import RequireAuthentication from '../authentication.js';
import useDataApi from '../apihook';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography
} from '@material-ui/core';
import toast from '../ui/Snackbar';
import axios from 'axios';
import NewQuestionForm from './forms/newquestionform';

const EditQuestionTab = props => {
  const { match, currentUser } = props;
  const qid = match.params.qid;

  const { data: qvalues, isOk, isError } = useDataApi({
    method: 'GET',
    url: `${apiprefix}/question/${qid}`
  });

  if (!currentUser.admin) {
    return <Typography color="error">needs admin permission</Typography>;
  }

  if (isOk) {
    qvalues.choices = qvalues.choices.map(c => c.description);
  }

  async function editQuestion(question) {
    try {
      await axios({
        url: `${apiprefix}/question/${qid}`,
        method: 'PUT',
        data: {
          ...question
        }
      });
      toast.success(`Question Edited`);
    } catch (err) {}
  }

  return (
    <Grid container>
      <Card>
        <CardHeader
          title={<Typography variant="h4">Edit a question</Typography>}
        />
        <CardContent>
          <NewQuestionForm
            question={qvalues}
            onSubmit={v => editQuestion(v)}
            isError={isError}
          />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default RequireAuthentication(EditQuestionTab);
