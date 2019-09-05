import React, { useState, useEffect } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PowerSettingNew from '@material-ui/icons/PowerSettingsNew';
import Input from '@material-ui/icons/Input';

import { Link as RRLink } from 'react-router-dom';
import { withRouter, Switch as RRSwitch } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';

const TabChooser = ({ children, classes, location, history, user }) => {
  useEffect(() => {
    history.listen(location => {
      selectTab(findCurrentTabBasedOnPath(location));
    });
  }, []);

  function findCurrentTabBasedOnPath(location) {
    const selectedTab = children.findIndex(
      tab => tab.props.path === location.pathname
    );
    return selectedTab === -1 ? 0 : selectedTab;
  }

  const [currentTab, selectTab] = useState(() =>
    findCurrentTabBasedOnPath(location)
  ); // currently selected tab by index

  let [drawerOpen, setDrawerOpen] = useState(false);

  let drawerContent = (
    <div className="classes.mainMenuList">
      <MenuList>
        {children
          .filter(tab => !tab.props.hideIf)
          .map(tab => (
            <MenuItem
              component={RRLink}
              key={tab.props.path}
              to={tab.props.path}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText inset={false} primary={tab.props.label} />
            </MenuItem>
          ))}
      </MenuList>
    </div>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.mainMenuButton}
            color="inherit"
            aria-label="Menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Tabs
            value={currentTab}
            onChange={(_event, value) => selectTab(value)}
          >
            {children
              .filter(tab => !tab.props.hideIf)
              .map((tab, i) => (
                <Tab
                  key={tab.props.label}
                  label={tab.props.label}
                  component={RRLink}
                  to={tab.props.path}
                />
              ))}
          </Tabs>
          <Typography align="right" color="inherit" style={{ flexGrow: 1 }} />
          {!user.authenticated ? (
            <Tooltip title={`Log in`}>
              <IconButton component={RRLink} to={`/login`} color="inherit">
                <Input />
              </IconButton>
            </Tooltip>
          ) : null}
          {user.authenticated ? (
            <Tooltip title={`Edit your Profile`}>
              <IconButton
                component={RRLink}
                to={`/profile/edit/${user.id}`}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          ) : null}
          {user.authenticated ? (
            <Tooltip title={`Log out`}>
              <IconButton component={RRLink} to={`/logout`} color="inherit">
                <PowerSettingNew />
              </IconButton>
            </Tooltip>
          ) : null}
        </Toolbar>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          {drawerContent}
        </Drawer>
      </AppBar>
      <RRSwitch>{children}</RRSwitch>
    </>
  );
};

const styles = theme => ({
  mainMenuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  mainMenuList: {
    width: 200
  }
});

export default withRouter(withStyles(styles)(TabChooser));
