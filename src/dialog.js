define(function (require, exports, module) {

/**
 * 对话框
 * @module Dialog
 */

'use strict';

// 此判断有过度设计之嫌疑，注释掉先
// if (document.compatMode === 'BackCompat') {
//   throw new Error('The dialog widget is NOT campitable with the backcompat mode.');
// }

var $ = require('$'),
  Util = require('util'),
  Locker = require('locker'),
  Class = require('class'),
  Tempine = require('tempine');


var initIndex = 20000,

  instLocker = new Locker(),

  // 默认参数列表
  defaults = {
    // 对话框默认位置，可选值为`left|center|right|top|middle|bottom`的组合
    align: 'centermiddle',
    // 是否显示对话框
    visible: true,
    // 是否模拟为模态窗口
    blocker: false,
    // 按钮组
    buttons: {},
    // 关闭回调，在关闭生效前执行
    // callback: function () {},
    // 对话框元素样式
    classes: {
      // 遮罩层
      'blocker':          'ui-blocker',
      'blockerIn':        'ui-blocker-in',

      // 对话框元素
      'dialog':           'ui-dialog',
      'dialogHead':       'ui-dialog-hd',
      'dialogBody':       'ui-dialog-bd',
      'dialogFoot':       'ui-dialog-ft',
      'dialogBtn':        'ui-dialog-btn',
      'dialogClose':      'ui-dialog-close',
      'dialogActive':     'ui-dialog-active',
      'dialogTitle':      'ui-dialog-title',
      'dialogTitless':    'ui-dialog-titless'
    },
    // 是否显示关闭按钮
    closeTrigger: true,
    // 关闭按钮回调函数，值为String时，自动寻找对应的button，参见`./confirm.js`
    closeHandler: function () { this.close(); },
    // 附加对话框的节点对象
    // container: '',
    // 对话框内容，支持HTML、DOM、JQ对象
    // content: '',
    // 上下文，默认为当前window
    context: window,
    // 对话框显示隐藏时的动画效果
    effects: {
      show: function (element, speed, callback) {
        element.fadeIn(speed, callback);
      },
      hide: function (element, speed, callback) {
        element.fadeOut(speed, callback);
      }
    },
    // 对话框
    // id: '',
    offset: {
      // 对话框相对于中间位置的位移
      x: 0,
      y: 0
    },
    on: {},
    position: 'fixed',
    reverseButtons: false,
    // 动画速度（用于遮罩层与对话框）
    speed: 200,
    // 是否固定位置（窗口大小变化时会重新计算位置）
    sticky: false,
    // 对话框模板
    template: '<div class="{{dialog}}">' +
        // '<div class="{{dialogIn}}">' +
            '<div class="{{dialogHead}}">' +
              '<a class="{{dialogClose}}" href="javascript:">&times;</a>' +
              '<div class="{{dialogTitle}}"></div>' +
            '</div>' +
            '<div class="{{dialogBody}}"></div>' +
            '<div class="{{dialogFoot}}"></div>' +
        // '</div>' +
        '</div>',
    title: '&nbsp;'
    // width: ''
  };

/**
 * Dialog
 * @class Dialog
 * @constructor
 */
var Dialog = new Class({
  /* options: {}, */

  id: '',

  /**
   * 构造函数
   * @method __construct
   * @param {mixture} options 参数
   */
  __construct: function (options) {

    this.extend({
      bts: {},
      els: {},
      guid: '',
      visible: false
    });

    this.opt = $.extend(true, {}, defaults, this.options);

    this.arg.apply(this, arguments);

    // 事件订阅
    if ($.isPlainObject(this.opt.on)) {
      this.on(this.opt.on);
    }

    this.ctx = this.opt.context;
    this.doc = this.ctx.document;

    this.cls = this.opt.classes;

    this.init();
  },

  /**
   * 解析函数参数
   * @method arg
   * @private
   */
  arg: function () {
    var args = Array.prototype.slice.call(arguments, 0),
      arg0 = args.shift();

    if (typeof arg0 === 'string') {
      this.opt.content = arg0;
    } else if ($.isPlainObject(arg0)) {
      $.extend(true, this.opt, arg0);
    }

    if (args.length === 1 && typeof args[0] === 'function') {
      this.opt.callback = args[0];
    }

    return this;
  },

  /**
   * 生成dialog前的准备工作：清理、定位
   * @method init
   */
  init: function () {
    var inst, dialog;

    this.guid = this.opt.id || this.id;

    // 如果在仓库中找到同一ID的实例，则先进行清理
    if (this.guid && (inst = instLocker.get(this.guid))) {
      inst.clear();
    }

    // 确保唯一ID
    this.guid = this.guid || Util.nuid();
    instLocker.set(this.guid, this);

    // dialog elements
    dialog = $(new Tempine(this.opt.template).render(this.cls), this.doc)
        .attr({
          tabIndex: -1
        })
        .css({
          position: this.opt.position,
          zIndex: ++initIndex,
          visibility: 'hidden'
        })
        .on('mousedown', $.proxy(this.focus, this));

    $.extend(this.els, {
      dialog:         dialog,
      dialogHead:     dialog.find('.' + this.cls.dialogHead),
      dialogBody:     dialog.find('.' + this.cls.dialogBody),
      dialogFoot:     dialog.find('.' + this.cls.dialogFoot),
      dialogTitle:    dialog.find('.' + this.cls.dialogTitle),
      dialogClose:    dialog.find('.' + this.cls.dialogClose)
    });

    // header
    this.els.dialogHead
      .on('mousedown.a.' + this.guid, $.proxy(function (e) {
        this.els.dialog.addClass(this.cls.dialogActive);

        $(this.doc)
        .on('mouseup.a.' + this.guid, $.proxy(function () {
          $(this.doc).off('mouseup.a.' + this.guid);
          if (this.els.dialog) {
            this.els.dialog.removeClass(this.cls.dialogActive);
          }
        }, this));
      }, this));

    // close trigger
    if (this.opt.closeTrigger) {
      this.els.dialogClose
        .attr({
          hideFocus: true
        })
        .on('mousedown', function (e) {
          e.stopPropagation();
        })
        .on('click', $.proxy(function () {
          var closeHandler = this.opt.closeHandler;
          // 重置result，避免重复执行
          delete this.result;
          if (typeof closeHandler === 'function') {
            closeHandler.call(this);
          } else if (typeof closeHandler === 'string') {
            this.fire(closeHandler);
          }
        }, this));

      this.els.dialog
        .on('keydown.' + this.guid, $.proxy(function (e) {
          // escape
          if (e.keyCode === 27) {
            this.els.dialogClose.trigger('click');
          }
        }, this));
    } else {
      this.els.dialogClose.hide();
    }

    this.title(this.opt.title)
      .buttons(this.opt.buttons)
      .content(this.opt.content);

    // 按钮事件订阅（不能先于按钮初始化）
    // this.on(this.cbs);

    dialog.appendTo(this.opt.container || this.doc.body);

    // align
    $.each(['left', 'center', 'right'], $.proxy(function (i, n) {
      if (this.opt.align.indexOf(n) !== -1) {
        this.origX = i / 2;
        return false;
      }
    }, this));

    $.each(['top', 'middle', 'bottom'], $.proxy(function (i, n) {
      if (this.opt.align.indexOf(n) !== -1) {
        this.origY = i / 2;
        return false;
      }
    }, this));

    if (this.opt.width) {
      this.els.dialog.css({
        width: this.opt.width
      });
    }

    this.locate();

    this.els.dialog.css({
      visibility: 'visible',
      display: 'none'
    });

    // blocker
    this.blocker(this.opt.blocker);

    // 发送事件通知
    this.fire('ready');

    if (this.opt.visible) {
      this.show();
    }

    return this;
  },

  /**
   * 生成遮罩层，模拟模态窗口
   * @param {boolean} blocker 是否显示遮罩
   * @method blocker
   */
  blocker: function (blocker) {
    var css,
      dialog,
      dialogBlocker;

    if (blocker) {

      css = {
        display: 'none'
      };

      dialog = this.els.dialog;

      if (css.position === 'absolute') {
        css.width = this.doc.body.scrollWidth;
        css.height = this.doc.body.scrollHeight;
      }

      dialogBlocker = $('<div class="' + this.cls.blocker + '"/>', this.doc)
        .css(css)
        .attr({
          tabIndex: -1
        })
        .on('mousedown', $.proxy(function () {
          var css, dur;
          if (this.els.dialog.queue().length === 0) {
            css = [{'margin-left': '-=10'},
              {'margin-left': '+=20'},
              {'margin-left': '-=20'}];
            dur = [50, 100, 50];
            // shake
            this.els.dialog
              .animate(css[0], dur[0])
              .animate(css[1], dur[1])
              .animate(css[2], dur[2])
              .animate(css[1], dur[1])
              .animate(css[0], dur[0]);
          }
        }, this))
        .append('<div class="' + this.cls.blockerIn + '"/>');

      if (this.opt.closeTrigger) {

        dialogBlocker
          .on('keydown.' + this.guid, $.proxy(function (e) {
            // escape
            if (e.keyCode === 27) {
              this.els.dialogClose.trigger('click');
            }
          }, this));
      }

      this.els.dialogBlocker = dialogBlocker.prependTo(this.opt.container || this.doc.body);

    } else {
      this.els.dialogBlocker && this.els.dialogBlocker.hide();
    }

    return this;
  },

  /**
   * 生成按钮
   * @example
   * ```
   * this.buttons({
   *   // `＜a class="ui-dialog-btn ui-dialog-btn-submit" ...＞Submit＜/a＞`
   *   'submit': {
   *     title: 'Submit',
   *     callback: function () {
   *       this.result = 1;
   *       this.close();
   *     }
   *   },
   *   // `＜a class="ui-dialog-btn ui-dialog-btn-cancel" ...＞Cancel＜/a＞`
   *   'cancel': {
   *     title: 'Cancel',
   *     callback: function () {
   *       this.result = 0;
   *       this.close();
   *     }
   *   },
   *   // `＜a class="ui-dialog-btn ui-dialog-btn-ignore" ...＞Ignore＜/a＞`
   *   'ignore': {
   *     title: 'Ignore',
   *     callback: function () {
   *       this.result = -1;
   *       this.close();
   *     }
   *   }
   * });
   * ```
   * @param {Object} buttons 按钮组
   * @method buttons
   */
  buttons: function (buttons) {
    if (buttons && !$.isEmptyObject(buttons)) {
      $.each(buttons, $.proxy(function (name, params) {
        var btn = $('<a class="' +
            this.cls.dialogBtn + ' ' +
            this.cls.dialogBtn + '-' +
            name.toLowerCase() + '" href="javascript:"/>', this.doc)
          .text(params.title || name)
          .on('click', $.proxy(function () {
            this.fire(name);
          }, this));

        if (typeof params.callback === 'function') {
          this.on(name, $.proxy(params.callback, this));
        }

        if (params.visible === false) {
          btn.hide();
        }

        this.bts[name] =
            btn[this.opt.reverseButtons ? 'prependTo' : 'appendTo'](this.els.dialogFoot);
      }, this));

    }

    return this;
  },

  /**
   * 显示按钮的”加载中“
   * @param {String} name 按钮名称
   * @param {String} [text] 显示的字符
   * @method showLoading
   */
  showLoading: function (name, text) {
    var btn = this.bts[name || 'submit'];
    if (btn) {
      btn.data('toggle-loading', btn.text())
        .prop('disabled', true)
        .text(text || '加载中');
    }
  },

  /**
   * 复位”加载中“的按钮
   * @param {String} name 按钮名称
   * @method hideLoading
   */
  hideLoading: function (name) {
    var btn = this.bts[name || 'submit'];
    if (btn) {
      btn.text(btn.data('toggle-loading'))
        .prop('disabled', false);
    }
  },

  /**
   * 显示按钮
   * @method showButton
   */
  showButton: function (name) {
    var n = arguments.length,
      btn;
    if (n) {
      for (; n >= 0; n--) {
        btn = this.bts[arguments[n]];
        if (btn) {
          btn.show();
        }
      }
    } else {
      this.bts.each(function () {
        $(this).show();
      });
    }
  },

  /**
   * 隐藏按钮
   * @method hideButton
   */
  hideButton: function () {
    var n = arguments.length,
      btn;
    if (n) {
      for (; n >= 0; n--) {
        btn = this.bts[arguments[n]];
        if (btn) {
          btn.hide();
        }
      }
    } else {
      this.bts.each(function () {
        $(this).hide();
      });
    }
  },

  /**
   * 清理当前实例
   * @param {Function} [callback] 回调函数
   * @method clear
   */
  clear: function (callback) {
    var f;

    if (!this.els) {
      return;
    }

    // clear bindings
    $([this.ctx, this.doc, this.doc.body,
      this.els.dialog, this.els.dialogHead])
        .off('.' + this.guid);

    f = function () {
      if (this.els) {
        this.els.dialog.remove();

        if (this.els.dialogBlocker) {
          this.els.dialogBlocker.remove();
        }
      }

      instLocker.remove(this.guid);

      if (typeof callback === 'function') {
        callback.call(this);
      }
    };

    if (typeof callback === 'function') {
      this.hide($.proxy(f, this));
    } else {
      f.call(this);
    }
  },

  /**
   * 关闭窗体
   * 首先执行全局回调函数`opt.callback`，如返回值为`false`，则终止执行
   * @method close
   */
  close: function (force) {
    if (!this.els) {
      return;
    }

    if (typeof this.opt.callback === 'function') {
      // 执行全局回调函数，如返回值为`false`，则终止执行
      if (this.opt.callback.call(this) === false) {
        return;
      }
    }

    this.clear(function () {
      if (!this.els) {
        return;
      }

      this.fire('close');

      var key;
      for (key in this) {
        if (this.hasOwnProperty(key)) {
          delete this[key];
        }
      }

    });
  },

  /**
   * 设置内容
   * @method content
   * @param {mixed} content 内容
   */
  content: function (content) {
    this.els.dialogBody.empty().append(content);

    return this;
  },

  /**
   * 在dialogBody内的元素里查找
   * @method find
   * @param {String} selector 选择符
   */
  find: function (selector) {
    return this.els.dialogBody.find(selector);
  },

  /**
   * 设置焦点，并移动到最顶层
   * @method focus
   */
  focus: function () {
    if (!this.els) {
      return;
    }

    if (this.opt.zIndex < initIndex) {
      this.opt.zIndex = ++initIndex;
      this.els.dialog.css({
        zIndex: initIndex
      });
    }

    // this.els.dialog.focus();

    this.fire('focus');
  },

  /**
   * 隐藏窗体
   * @param {Function} [callback] 回调函数
   * @method hide
   */
  hide: function (callback) {
    if (!this.els) {
      return;
    }

    this.opt.effects.hide.call(this, this.els.dialog, this.opt.speed, callback);
    this.visible = false;

    this.fire('hide');
  },

  /**
   * 设定窗体位置
   * @method locate
   */
  locate: function () {
    var rs = $.proxy(function () {

      var left = ($(this.ctx).width() - this.els.dialog.outerWidth(true)) *
            this.origX +
            (this.opt.position === 'fixed' ? 0 : $(this.ctx).scrollLeft()) +
            this.opt.offset.x,
        top = ($(this.ctx).height() - this.els.dialog.outerHeight(true)) *
            this.origY +
            (this.opt.position === 'fixed' ? 0 : $(this.ctx).scrollTop()) +
            this.opt.offset.y;

      this.els.dialog.stop().animate({
          left: Math.max(left, 0),
          top: Math.max(top, 0)
        }, 50);

    }, this);

    rs();

    // 固定位置
    if (this.opt.sticky) {

      $(this.ctx)
        .off('.l.' + this.guid)
        .on('resize.l.' + this.guid + ' scroll.l.' + this.guid, rs);

    } else {

      rs = null;

    }

    return this;
  },

  /**
   * 显示窗体
   * @method show
   */
  show: function () {
    if (!this.els) {
      return;
    }

    if (this.els.dialogBlocker) {
      this.els.dialogBlocker.fadeIn(this.opt.speed);
    }

    this.visible = true;
    this.opt.effects.show.call(this, this.els.dialog, this.opt.speed);

    this.fire('show');

    this.focus();
  },

  /**
   * 设置标题
   * @param {mixture} title 标题
   * @method title
   */
  title: function (title) {

    if (title === false) {
      this.els.dialog.addClass(this.cls.dialogTitless);
      this.els.dialogTitle.hide().empty();
    } else {
      this.els.dialog.removeClass(this.cls.dialogTitless);
      this.els.dialogTitle.html(title).show();
    }

    return this;
  }

});

// $.extend(Dialog, {

//   /**
//    * 设置默认参数
//    * @method setOptions
//    * @static
//    */
//   setOptions: function (obj) {
//     $.extend(true, defaults, obj);

//     return Dialog;
//   },

//   /**
//    * 根据id显示Dialog，若id未指定，则显示全部
//    * @method show
//    * @param {String} id Dialog的GUID
//    * @static
//    */
//   show: function (id) {
//     var obj = instLocker.get(id);
//     if (!obj) {
//       return;
//     }
//     if (obj instanceof Dialog) {
//       obj.show && obj.show();
//     } else {
//       $.each(obj, function (key, obj) {
//         obj && (obj instanceof Dialog) && obj.show && obj.show();
//       });
//     }
//   },

//   /**
//    * 根据id隐藏Dialog，若id未指定，则隐藏全部
//    * @method hide
//    * @param {String} id Dialog的GUID
//    * @static
//    */
//   hide: function (id) {
//     var obj = instLocker.get(id);
//     if (!obj) {
//       return;
//     }
//     if (obj instanceof Dialog) {
//       obj.hide && obj.hide();
//     } else {
//       $.each(obj, function (key, obj) {
//         obj && (obj instanceof Dialog) && obj.hide && obj.hide();
//       });
//     }
//   },

//   /**
//    * 根据id关闭Dialog，若id未指定，则关闭全部
//    * @method close
//    * @param {String} id Dialog的GUID
//    * @static
//    */
//   close: function (id) {
//     var obj = instLocker.get(id);
//     if (!obj) {
//       return;
//     }
//     if (obj instanceof Dialog) {
//       obj.close && obj.close();
//     } else {
//       $.each(obj, function (key, obj) {
//         obj && (obj instanceof Dialog) && obj.close && obj.close();
//       });
//     }
//   }

// });

return Dialog;

});
