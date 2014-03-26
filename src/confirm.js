define(function (require, exports, module) {

/**
 * 弹窗
 * @module Dialog
 */

'use strict';

var Class = require('class'),
  Dialog = require('./dialog');

/**
 * Confirm
 * @class Confirm
 * @extends Dialog
 * @constructor
 */
var Confirm = new Class(Dialog, {

    id: 'Confirm',

    options: {
      blocker: true,
      closeHandler: 'cancel',
      buttons: {
        submit: {
          title: '确定',
          callback: function () {
            this.result = true;
            this.close(this.opt.callback);
          }
        },
        cancel: {
          title: '取消',
          callback: function () {
            this.result = false;
            this.close(this.opt.callback);
          }
        }
      }
    }

  });

return Confirm;


});
