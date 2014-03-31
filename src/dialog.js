define(function (require, exports, module) {

/**
 * 对话框
 * @module Dialog
 */

'use strict';

var $ = require('$'),
  Widget = require('widget'),
  // Handlebars = require('handlebars'),

  // 遮罩层
  Mask = require('./mask');

var dialogInTop;

/**
 * Dialog
 *
 * @class Dialog
 * @constructor
 */
var Dialog = Widget.extend({

  defaults: {
    // 对话框默认位置，
    // 可选值为`left|center|right|top|middle|bottom`的组合
    align: 'centermiddle',
    // 是否显示对话框
    autoShow: true,
    // 样式前缀
    classPrefix: 'ue-dialog',
    // 关闭
    close: '&times;',
    // 事件代理
    delegates: {
      'keydown': function (e) {
        (e.keyCode === 27) && this.hide();
      },
      'mousedown': 'focus',
      'click [data-role=close]': 'hide'
    },
    // 对话框显示隐藏时的动画效果
    effect: 'fade',
    // element: '<div class="ue-component"></div>',
    // 对话框ID
    // id: '',
    // 是否模拟为模态对话框，即显示遮罩层
    mask: false,
    offset: {
      // 对话框相对于原点位置的位移像素值
      x: 0,
      y: 0
    },
    // 原点位置
    orig: {},
    position: (!!window.ActiveXObject && !window.XMLHttpRequest) ? 'absolute' : 'fixed',
    // 对话框模板
    template: require('./dialog.handlebars'),
    width: 'auto',
    zIndex: 901
  },

  setup: function () {
    this.state(Dialog.STATE.INITIAL);

    // element
    this.element
      .attr({
        tabIndex: -1
      })
      .css({
        position: this.option('position'),
        zIndex: this.option('zIndex'),
        width: this.option('width')
      });

    // 初始化data，用于模板渲染
    this.data({
      classPrefix: this.option('classPrefix'),
      close: this.option('close'),
      content: this.option('content')
    });

    // 设置内容
    this.setContent();

    // 计算对齐
    this.setAlign();

    this.state(Dialog.STATE.READY);

    // 自动显示
    this.option('autoShow') && this.show();

    return this;
  },

  /**
   * 设置内容
   *
   * @method setContent
   * @param {Mixed} [content] 内容
   */
  setContent: function (content) {
    this.element.empty().append(content || this.option('template')(this.data()));

    return this;
  },

  /**
   * 设置zIndex
   *
   * @method setIndex
   * @param {Number} [index] zIndex
   */
  setIndex: function (index) {
    this.element.css({
      zIndex: index || this.option('zIndex')
    });

    return this;
  },

  /**
   * 设置遮罩层
   *
   * @method setMask
   * @private
   */
  setMask: function () {
    var dialog = this;
    if (this.option('mask')) {
      this.mask = new Mask({
        position: this.option('position'),
        delegates: {
          'keydown': function (e) {
            (e.keyCode === 27) && dialog.hide();
          }
        }
      });
    }
  },

  /**
   * 计算对齐关系
   *
   * @method setAlign
   * @private
   */
  setAlign: function () {
    // align
    var align = this.option('align'),
      orig = this.option('orig');

    $.each(['left', 'center', 'right'], function (i, n) {
      if (align.indexOf(n) !== -1) {
        orig.x = i / 2;
        return false;
      }
    });

    $.each(['top', 'middle', 'bottom'], function (i, n) {
      if (align.indexOf(n) !== -1) {
        orig.y = i / 2;
        return false;
      }
    });
  },

  /**
   * 设定位置（left 与 top）
   *
   * @method setPosition
   */
  setPosition: function () {
    var fixed = this.option('position') === 'fixed',
      orig = this.option('orig'),
      offset = this.option('offset'),
      left = ($(this.viewport).width() - this.element.outerWidth()) * orig.x +
        (fixed ? 0 : $(this.viewport).scrollLeft()) + offset.x,
      top = ($(this.viewport).height() - this.element.outerHeight()) * orig.y +
        (fixed ? 0 : $(this.viewport).scrollTop()) + offset.y;

    this.element.css({
        left: Math.max(left, 0),
        top: Math.max(top, 0)
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

    dialogInTop = this.setIndex(this.option('zIndex') + 1);
  },

  /**
   * 显示对话框
   *
   * @method show
   */
  show: function () {
    if (!this.rendered) {
      // 遮罩层，必须先于 render
      this.setMask();

      // 确保插入到DOM
      this.render();

      // 插入到文档流之后才能准确计算位置
      this.setPosition();
    }

    this.mask && this.mask.show();

    Dialog.EFFECT[this.option('effect')].show.call(this);

    this.state(Dialog.STATE.VISIBLE);
  },

  /**
   * 隐藏对话框
   *
   * @method hide
   */
  hide: function () {
    this.mask && this.mask.hide();

    Dialog.EFFECT[this.option('effect')].hide.call(this);

    this.state(Dialog.STATE.HIDDEN);
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

    return Dialog.superclass.destroy.apply(this);
  }

});

Dialog.STATE = {
  INITIAL: -1,
  READY: 0,
  VISIBLE: 1,
  HIDDEN: 2
};

Dialog.EFFECT = {

  none: {
    show: function (callback) {
      this.element.show(callback);
    },
    hide: function (callback) {
      this.element.hide(callback);
    }
  },

  // 对话框显示隐藏时的动画效果
  fade: {
    show: function (callback) {
      this.element.fadeIn(200, callback);
    },
    hide: function (callback) {
      this.element.fadeOut(200, callback);
    }
  }
};

module.exports = Dialog;

});
