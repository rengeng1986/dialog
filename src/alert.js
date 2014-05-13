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
    mask: true,
    data: {
      submit: '<span class="btn btn-primary">确定</span>',
      title: '提示'
    }
  },

  setup: function () {
    var self = this;

    self.initDelegates({
      'click [data-role=submit]': function (e) {
        e.preventDefault();
        this.fire('submit') && this.hide();
      }
    });

    Alert.superclass.setup.apply(self);
  },

  hide: function () {
    Alert.superclass.hide.apply(this);
    // TODO: 目前直接调用 destroy，将导致直接跳过隐藏动画
    !this.option('trigger') && this.destroy();
  }

});

module.exports = Alert;

});
