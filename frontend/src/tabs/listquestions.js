import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  LinearProgress,
  Typography,
  Toolbar,
  Tooltip,
  Icon,
  Link,
  IconButton
} from '@material-ui/core';
import useDataApi from '../apihook';
import RequireAuthentication from '../authentication.js';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import apiprefix from '../apiprefix';

import { Link as RRLink } from 'react-router-dom';
import { parse } from 'querystring';
import NavigateNext from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

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
  },
  icon: {
    margin: theme.spacing.unit * 2
  },
  fab: {
    margin: theme.spacing.unit
  }
});

const ListQuestionTab = ({ classes, location, history }) => {
  let [page, setPage] = useState(() => {
    const query = parse(location.search.substring(1));
    return Number(query.page) || 0;
  });

  let { data, isLoading, isOk, isError, errorMessage, request } = useDataApi(
    {
      method: 'GET',
      url: `${apiprefix}/question?page=${page}`
    },
    { questions: [] }
  );

  useEffect(() => {
    const query = parse(location.search.substring(1));
    const page = Number(query.page) || 0;
    setPage(page);
    request({
      method: 'GET',
      url: `${apiprefix}/question?page=${page}`
    });
  }, [location]);

  const questions = isOk ? data.questions : [];

  const gotoPage = page => {
    const pathname = history.location.pathname;
    history.push({
      pathname,
      search: `?page=${page}`
    });
    setPage(page);
  };

  let goBackOnePage = () => {
    if (page > 0) gotoPage(page - 1);
  };
  let goForwardOnePage = () => {
    gotoPage(page + 1);
  };

  if (isLoading) return <LinearProgress />;

  if (isError)
    return (
      <Typography color="error" variant="body1">
        {errorMessage}
      </Typography>
    );

  return (
    <div className={classes.root}>
      <Paper className={classes.centerd}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Question</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {questions.map(question => (
              <TableRow key={question.id}>
                <TableCell component="th" scope="row" align="left">
                  <Typography variant="title" gutterBottom>
                    {question.id}. {question.question}
                  </Typography>
                  <br />
                  <Typography variant="subheading" gutterBottom>
                    {question.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Link component={RRLink} to={`/question/${question.id}`}>
                    <Tooltip
                      title={`Click here to vote for question ${question.id}`}
                    >
                      <Icon
                        className={classes.icon}
                        color="primary"
                        fontSize="large"
                      >
                        where_to_vote
                      </Icon>
                    </Tooltip>
                  </Link>

                  <Link component={RRLink} to={`/question/${question.id}/edit`}>
                    <Tooltip title={`Click here to edit this question`}>
                      <Icon
                        className={classes.icon}
                        color="primary"
                        fontSize="large"
                      >
                        edit
                      </Icon>
                    </Tooltip>
                  </Link>

                  <Link
                    component={RRLink}
                    to={{
                      pathname: `/question/${question.id}/delete`,
                      state: {
                        from: history.location
                      }
                    }}
                  >
                    <Tooltip
                      title={`Click here to delete question ${question.id}`}
                    >
                      <Icon
                        className={classes.icon}
                        color="primary"
                        fontSize="large"
                      >
                        delete
                      </Icon>
                    </Tooltip>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Toolbar>
        <IconButton disabled={page < 1} onClick={goBackOnePage}>
          <Tooltip title={`Click here to go to previous page`}>
            <NavigateBefore color="primary" fontSize="large" />
          </Tooltip>
        </IconButton>
        <IconButton disabled={!data.has_more} onClick={goForwardOnePage}>
          <Tooltip title={`Click here to go to next page`}>
            <NavigateNext color="primary" fontSize="large" />
          </Tooltip>
        </IconButton>
        <Typography color="inherit" style={{ flexGrow: 1 }} />
        <Link component={RRLink} to={`/question/new`}>
          <Tooltip title={`Click here to add question`}>
            <Fab color="primary" aria-label="Add" className={classes.fab}>
              <AddIcon />
            </Fab>
          </Tooltip>
        </Link>
      </Toolbar>
    </div>
  );
};

ListQuestionTab.propTypes = {
  currentUser: PropTypes.object.isRequired
};

export default withStyles(styles)(RequireAuthentication(ListQuestionTab));
