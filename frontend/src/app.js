import React, { useState } from 'react';
import history from './history';
import { Router, Route, Switch } from 'react-router-dom';

import TabChooser from './ui/TabChooser';
import WelcomeTab from './tabs/welcome';
import RegisterTab from './tabs/register';
import LoginTab from './tabs/login';
import ProfileTab from './tabs/profile';
import EditUserTab from './tabs/edituser';
import NotFoundTab from './tabs/notfound';
import ListQuestionTab from './tabs/listquestions';
import VoteTab from './tabs/vote';
import NewQuestionTab from './tabs/newquestion';
import ListUserTab from './tabs/listusers';
import DeleteQuestionTab from './tabs/deletequestion';
import EditQuestionTab from './tabs/editquestion';

const App = () => {
  let initialUser;
  if (localStorage.token) {
    let token = localStorage.token
      .split(/\./)
      .slice(0, 2)
      .map(x => JSON.parse(atob(x)));
    initialUser = token[1].user;
  } else {
    initialUser = {};
  }
  initialUser.authenticated = localStorage.token !== undefined;
  // eslint-disable-next-line
  let [currentUser, updateUser] = useState(initialUser);
  return (
    <Router history={history}>
      <Switch>
        <Route
          exact
          path="/logout"
          render={() => {
            localStorage.removeItem('token');
            window.location.href = `${process.env.PUBLIC_URL}/`;
          }}
        />
        <Route
          exact
          path="/login"
          render={props => (
            <LoginTab
              label="Login"
              updateUser={updateUser}
              currentUser={currentUser}
              {...props}
            />
          )}
        />

        <Route
          exact
          path="/register"
          render={props => (
            <RegisterTab label="Register" updateUser={updateUser} {...props} />
          )}
        />

        <Route
          exact
          path={'/question/:qid/delete'}
          label="Delete Question"
          hideIf={true}
          render={props => (
            <DeleteQuestionTab currentUser={currentUser} {...props} />
          )}
        />
        <Route>
          <TabChooser user={currentUser}>
            <Route exact path="/" label="Welcome" component={WelcomeTab} />
            <Route
              exact
              path="/profile"
              label="Profile"
              hideIf={!currentUser.authenticated}
              render={props => (
                <ProfileTab currentUser={currentUser} {...props} />
              )}
            />
            <Route
              path="/questions"
              label="Surveys"
              hideIf={!currentUser.authenticated}
              render={props => (
                <ListQuestionTab currentUser={currentUser} {...props} />
              )}
            />

            <Route
              exact
              path="/users"
              label="List users"
              hideIf={!currentUser.admin}
              render={props => (
                <ListUserTab currentUser={currentUser} {...props} />
              )}
            />
            <Route
              exact
              path={'/question/new'}
              label="New Question"
              hideIf={true}
              render={props => (
                <NewQuestionTab currentUser={currentUser} {...props} />
              )}
            />
            <Route
              exact
              path={'/question/:qid'}
              label="Question"
              hideIf={true}
              render={props => <VoteTab currentUser={currentUser} {...props} />}
            />
            <Route
              path={'/profile/edit/:id'}
              hideIf={true}
              render={props => (
                <EditUserTab
                  label="Edit User"
                  updateUser={updateUser}
                  currentUser={currentUser}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path={'/question/:qid/edit'}
              label="Edit Question"
              hideIf={true}
              render={props => (
                <EditQuestionTab currentUser={currentUser} {...props} />
              )}
            />
            <Route label="Not Found" hideIf={true} component={NotFoundTab} />
          </TabChooser>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
