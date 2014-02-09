define(function (require, exports, module) {

/**
 * 弹窗
 * @module Dialog
 */

'use strict';

var Class = require('class'),
  Dialog = require('./dialog');

/**
 * Alert
 * @class Alert
 * @extends Dialog
 * @constructor
 */
var Alert = new Class(Dialog, {

    id: 'Alert',

    options: {
      blocker: true,
      closeHandler: 'submit',
      buttons: {
        submit: {
          title: '提交',
          callback: function () {
            this.close(this.opt.callback);
          }
        }
      }
    }

  });

return Alert;


});
