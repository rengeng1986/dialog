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
var Confirm = Dialog.extend({

  defaults: {
    cancel: '取消',
    mask: true,
    submit: '确定',
    title: '确认框'
  },

  setup: function () {
    var self = this;

    // 初始化data，用于模板渲染
    self.data({
      title: self.option('title'),
      submit: self.option('submit'),
      cancel: self.option('cancel')
    });

    self.initDelegates({
      'click [data-role=submit]': function (e) {
        e.preventDefault();
        this.fire('submit') && this.hide();
      },
      'click [data-role=cancel]': function (e) {
        e.preventDefault();
        this.fire('cancel') && this.hide();
      }
    });

    Confirm.superclass.setup.apply(self);
  },

  hide: function () {
    Confirm.superclass.hide.apply(this);
    // TODO: 目前直接调用 destroy，将导致直接跳过隐藏动画
    !this.option('trigger') && this.destroy();
  }

});

module.exports = Confirm;

});
