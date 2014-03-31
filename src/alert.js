define(function (require, exports, module) {

/**
 * 对话框
 *
 * @module Dialog
 */

'use strict';

var Dialog = require('./dialog');

/**
 * Confirm
 * @class Confirm
 * @extends Dialog
 * @constructor
 */
module.exports = Dialog.extend({

  defaults: {
    submit: '确定',
    // 事件代理
    delegates: {
      'click [data-role=submit]': function (e) {
        e.preventDefault();
        this.fire('submit') !== false && this.hide();
      }
    },
    events: {
      // 设置主体内容前
      'before:setContent': function () {
        this.data({
          title: this.option('title'),
          submit: this.option('submit')
        });
      },
      'after:hide': 'destroy'
    },
    mask: true,
    title: '提示框'
  }

});

});
