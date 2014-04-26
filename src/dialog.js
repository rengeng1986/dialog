define(function (require, exports, module) {

/**
 * 对话框
 * @module Dialog
 */

'use strict';

var Overlay = require('overlay'),

  // 遮罩层
  Mask = require('./mask');

// 当前位于顶层的 dialog
var dialogInTop;

/**
 * Dialog
 *
 * @class Dialog
 * @constructor
 */
var Dialog = Overlay.extend({

  defaults: {
    baseXY: {
      x: 0.5,
      y: 0.5
    },
    // 样式前缀
    classPrefix: 'ue-dialog',
    // 关闭
    close: '&times;',
    css: {
      position: (!!window.ActiveXObject && !window.XMLHttpRequest) ? 'absolute' : 'fixed'
    },
    // 事件代理
    delegates: {
      'keydown': function (e) {
        (e.keyCode === 27) && this.hide();
      },
      'mousedown': 'focus',
      'click [data-role=close]': 'close'
    },
    // 是否模拟为模态对话框，即显示遮罩层
    mask: false,
    selfXY: {
      x: 0.5,
      y: 0.5
    },
    // 对话框模板
    template: require('./dialog.handlebars'),
    // 对话框触发点
    trigger: null
  },

  setup: function () {
    var self = this;

    // 初始化data，用于模板渲染
    self.data({
      // classPrefix: self.option('classPrefix'),
      close: self.option('close'),
      content: self.option('content')
    });

    Dialog.superclass.setup.apply(self);
  },

  /**
   * 设置zIndex
   *
   * @method setIndex
   * @param {Number} [index] zIndex
   */
  setIndex: function (index) {
    this.element.css({
      zIndex: index || this.option('css/zIndex')
    });

    return this;
  },

  /**
   * 设置焦点
   *
   * @method focus
   */
  focus: function () {
    dialogInTop && dialogInTop.setIndex();

    dialogInTop = this.setIndex(this.option('css/zIndex') + 1);

    this.element.focus();

    return this;
  },

  /**
   * 点击关闭按钮
   *
   * @method close
   */
  close: function () {
    this.fire('close') !== false && this.hide();

    return this;
  },

  /**
   * 显示对话框
   *
   * @method show
   */
  show: function () {
    this.mask && this.mask.show();

    Dialog.superclass.show.apply(this);

    return this;
  },

  /**
   * 隐藏对话框
   *
   * @method hide
   */
  hide: function () {
    this.mask && this.mask.hide();

    Dialog.superclass.hide.apply(this);

    return this;
  },

  render: function () {
    var self = this;

    Dialog.superclass.render.apply(self);

    // 遮罩层
    if (self.option('mask') && !self.mask) {
      self.mask = new Mask({
        baseElement: self.option('baseElement'),
        container: self.element,
        css: {
          position: self.option('css/position')
        },
        delegates: {
          'keydown': function (e) {
            (e.keyCode === 27) && self.hide();
          }
        },
        effect: self.option('effect'),
        insert: function () {
          this.container.before(this.element);
        }
      });
    }

    return self;
  },

  /**
   * 销毁
   *
   * @method destroy
   */
  destroy: function () {
    // 先销毁遮罩层
    this.mask && this.mask.destroy();

    dialogInTop === this && (dialogInTop = null);

    Dialog.superclass.destroy.apply(this);
  }

});

// Dialog.STATE = {
//   INITIAL: -1,
//   READY: 0,
//   VISIBLE: 1,
//   HIDDEN: 2
// };

module.exports = Dialog;

});
