define(function (require, exports, module) {

/**
 * 弹窗
 * @module Dialog
 */

'use strict';

var $ = require('$'),
  Class = require('class'),
  Dialog = require('./dialog');

/**
 * Tips
 * @class Tips
 * @extends Dialog
 * @constructor
 */
var Tips = new Class(Dialog, {

    options: {
      timeout: 2,
      title: false,
      closeTrigger: false,
      on: {
        show: function () {
          setTimeout($.proxy(function () {
            this.close();
          }, this), this.opt.timeout * 1000);
        }
      }
    }

  });

return Tips;

});
