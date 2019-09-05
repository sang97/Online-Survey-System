// A module that allows notistack's snackbars to be used without
// requiring to be connected to a rendered component.
// Use like this:
//
// import toastr from '.../thisdirectory/Snackbar.js'
//
// (the name 'toastr' can be freely chosen; this module provides a default export
// ...
// toastr.success('Ok');    // green box
//  or
// toastr.error('An error occurred...:. ...')
//
// See also
// https://github.com/iamhosseindhv/notistack/issues/30
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/demos/snackbars/CustomizedSnackbars.js
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/demos/snackbars/ConsecutiveSnackbars.js
//
// @author godmar
//
import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider, useSnackbar } from 'notistack';

// add a <div> child to body under which to mount the snackbars
const mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);

export default {
  success: function(msg) {
    this.toast(msg, 'success');
  },
  warning: function(msg) {
    this.toast(msg, 'warning');
  },
  info: function(msg) {
    this.toast(msg, 'info');
  },
  error: function(msg) {
    this.toast(msg, 'error');
  },
  toast: function(msg, variant = 'default') {
    const ShowSnackbar = ({ message }) => {
      const { enqueueSnackbar } = useSnackbar();
      enqueueSnackbar(message, { variant });
      return null;
    };
    ReactDOM.render(
      // see https://github.com/iamhosseindhv/notistack#snackbarprovider
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <ShowSnackbar message={msg} variant={variant} />
      </SnackbarProvider>,
      mountPoint
    );
  }
};
