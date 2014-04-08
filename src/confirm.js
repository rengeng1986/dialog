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
    cancel: '取消',
    // 事件代理
    delegates: {
      'click [data-role=submit]': function (e) {
        e.preventDefault();
        this.fire('submit') !== false && this.hide();
      },
      'click [data-role=cancel]': function (e) {
        e.preventDefault();
        this.fire('cancel') !== false && this.hide();
      }
    },
    events: {
      // 设置主体内容前
      'before:render': function () {
        this.data({
          title: this.option('title'),
          submit: this.option('submit'),
          cancel: this.option('cancel')
        });
      },
      'after:hide': 'destroy'
    },
    mask: true,
    title: '确认框'
  }

});

});
