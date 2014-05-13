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
    mask: true,
    data: {
      cancel: '<span class="btn btn-default">取消</span>',
      submit: '<span class="btn btn-primary">确定</span>',
      title: '确认'
    }
  },

  setup: function () {
    var self = this;

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
