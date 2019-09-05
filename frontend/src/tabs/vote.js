import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import apiprefix from '../apiprefix';

import RequireAuthentication from '../authentication.js';
import useDataApi from '../apihook';
import { Typography, LinearProgress } from '@material-ui/core';

import SingleQuestionForm from './forms/singlequestionform';

const VoteTab = props => {
  const { currentUser, match, theme } = props;
  const qid = match.params.qid;
  let { data, isLoading, isError, errorMessage } = useDataApi({
    method: 'GET',
    url: `${apiprefix}/question/${qid}`
  });

  console.log(data);

  let {
    data: userVote,
    isLoading: isLoadingUserVote,
    isError: isErrorUserVote,
    // eslint-disable-next-line
    errorMessage: errorMessageUserVote,
    request: requestUserVote
  } = useDataApi(
    {
      method: 'GET',
      url: `${apiprefix}/question/${qid}/vote?user=${currentUser.id}`
    },
    { userVote: [] }
  );

  let {
    data: votes,
    isLoading: isLoadingVotes,
    // eslint-disable-next-line
    isError: isErrorVotes,
    // eslint-disable-next-line
    errorMessage: errorMessageVotes,
    request: requestVotes
  } = useDataApi(
    {
      method: 'GET',
      url: `${apiprefix}/question/${qid}/vote`
    },
    { totals: [] }
  );

  let [voting, setVoting] = useState(false);
  async function voteQuestion({ vote }) {
    //console.log(`will vote for question ${qid} with choice ${vote}`);
    try {
      setVoting(true);
      await axios({
        url: `${apiprefix}/question/${qid}/vote`,
        method: 'POST',
        data: {
          choice: vote
        }
      });
      setVoting(false);
    } catch (err) {
      // toast error
    }
    requestVotes(
      {
        method: 'GET',
        url: `${apiprefix}/question/${qid}/vote`
      },
      { totals: [] }
    );

    requestUserVote(
      {
        method: 'GET',
        url: `${apiprefix}/question/${qid}/vote?user=${currentUser.id}`
      },
      { userVote: [] }
    );
  }

  if (isLoading || isLoadingUserVote || isLoadingVotes || voting)
    return <LinearProgress />;

  if (isError)
    return (
      <Typography color="error" variant="body1">
        {errorMessage}
      </Typography>
    );

  return (
    <>
      <SingleQuestionForm
        values={{ vote: String(userVote.votes) }}
        onSubmit={voteQuestion}
        question={data}
        votes={votes}
        userVote={userVote}
        isErrorUserVote={isErrorUserVote}
        currentUser={currentUser}
        theme={theme}
      />
    </>
  );
};

VoteTab.protoTypes = {
  currentUser: PropTypes.object.isRequired
};

export default RequireAuthentication(VoteTab);
