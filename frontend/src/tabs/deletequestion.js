import React from 'react';
import apiprefix from '../apiprefix';
import RequireAuthentication from '../authentication.js';
import toast from '../ui/Snackbar';

import useDataApi from '../apihook';
import { Typography, LinearProgress } from '@material-ui/core';
import { Redirect } from 'react-router';

const DeleteQuestionTab = props => {
  const { match, location } = props;
  const qid = match.params.qid;
  const { isOk, isLoading, isError, errorMessage } = useDataApi({
    method: 'DELETE',
    url: `${apiprefix}/question/${qid}`
  });

  if (isLoading) {
    return <LinearProgress />;
  }

  if (isError) {
    return <Typography color="error">{errorMessage}</Typography>;
  }

  if (isOk) {
    toast.success(`Question ${qid} was deleted from survey`);
  }

  const { from } = location.state;

  return <Redirect to={from} />;
};

export default RequireAuthentication(DeleteQuestionTab);
