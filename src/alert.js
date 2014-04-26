define(function (require, exports, module) {

/**
 * 对话框
 *
 * @module Dialog
 */

'use strict';

var Dialog = require('./dialog');

/**
 * Alert
 * @class Alert
 * @extends Dialog
 * @constructor
 */
var Alert = Dialog.extend({

  defaults: {
    submit: '确定',
    mask: true,
    title: '提示框'
  },

  setup: function () {
    var self = this;

    // 初始化data，用于模板渲染
    self.data({
      title: self.option('title'),
      submit: self.option('submit')
    });

    self.initDelegates({
      'click [data-role=submit]': function (e) {
        e.preventDefault();
        this.fire('submit') !== false && this.hide();
      }
    });

    Alert.superclass.setup.apply(self);
  },

  hide: function () {
    Alert.superclass.hide.apply(this);
    // TODO: 目前直接调用 destroy，将导致直接跳过隐藏动画
    this.destroy();
  }

});

module.exports = Alert;

});
