define(function (require, exports, module) {

/**
 * 对话框
 *
 * @module Dialog
 */

'use strict';

var $ = require('$'),
  Dialog = require('./dialog');

/**
 * Tips
 * @class Tips
 * @extends Dialog
 * @constructor
 */
module.exports = Dialog.extend({

  defaults: {
    timeout: 2,
    close: '',
    events: {
      // 设置主体内容前
      'after:show': function () {
        setTimeout($.proxy(function () {
          this.hide();
        }, this), this.option('timeout') * 1000);
      }
    }
  }

});

});
