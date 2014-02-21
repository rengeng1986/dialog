define(function (require, exports, module) {

/**
 * 对话框
 * @module Dialog
 */

'use strict';

var $ = require('$'),
  Util = require('util'),
  Locker = require('locker'),
  Class = require('class'),
  Tempine = require('tempine'),

  // 全局默认参数
  defaults = require('./defaults');

var

  // 初始z-index值
  zIndex = 1000,

  // 存储对话框实例
  locker = new Locker();

/**
 * Dialog
 * @class Dialog
 * @constructor
 */
var Dialog = new Class({

  id: '',

  /**
   * 构造函数
   * @method __construct
   * @param {Object} options 参数
   */
  __construct: function (options) {

    this.extend({
      bts: {},
      opt: $.extend(true, {}, defaults, this.options, options),
      visible: false
    });

    // 事件订阅
    if ($.isPlainObject(this.opt.on)) {
      this.on(this.opt.on);
    }

    // 用于跨框架调用的场景
    this.ctx = this.opt.context;
    this.doc = this.ctx.document;

    this.init();
  },

  /**
   * 获取内部元素className
   * @method getClassName
   * @private
   */
  getClassName: function (name) {
    return this.opt.classPrefix + '-' + name;
  },

  /**
   * 生成dialog前的准备工作：清理、定位
   * @method init
   */
  init: function () {
    var instance, dialog;

    this.guid = this.opt.id || this.id;

    // 清理同一ID实例
    this.guid && (instance = locker.get(this.guid)) && instance.clear();

    // 存放当前实例
    locker.set(this.guid || (this.guid = Util.nuid()), this);

    // dialog elements
    dialog = $(new Tempine(this.opt.template).render({
          classPrefix: this.opt.classPrefix
        }), this.doc)
        .attr({
          tabIndex: -1
        })
        .css({
          position: this.opt.position,
          zIndex: (this.opt.zIndex = ++zIndex),
          visibility: 'hidden'
        })
        .on('mousedown', $.proxy(this.focus, this));

    this.extend({
      dialog:         dialog,
      dialogLoading:  dialog.find('.' + this.getClassName('loading')),
      dialogHead:     dialog.find('.' + this.getClassName('head')),
      dialogBody:     dialog.find('.' + this.getClassName('body')),
      dialogFoot:     dialog.find('.' + this.getClassName('foot')),
      dialogTitle:    dialog.find('.' + this.getClassName('title')),
      dialogClose:    dialog.find('.' + this.getClassName('close'))
    });

    // header
    this.dialogHead
      .on('mousedown.a.' + this.guid, $.proxy(function (e) {
        this.dialog.addClass(this.getClassName('active'));

        $(this.doc)
        .on('mouseup.a.' + this.guid, $.proxy(function () {
          $(this.doc).off('mouseup.a.' + this.guid);
          if (this.dialog) {
            this.dialog.removeClass(this.getClassName('active'));
          }
        }, this));
      }, this));

    // close trigger
    if (this.opt.closeTrigger) {
      this.dialogClose
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

      this.dialog
        .on('keydown.' + this.guid, $.proxy(function (e) {
          // escape
          if (e.keyCode === 27) {
            this.dialogClose.trigger('click');
          }
        }, this));
    } else {
      this.dialogClose.hide();
    }

    // loading, title, buttons, content
    this
      .loading(this.opt.loading)
      .title(this.opt.title)
      .buttons(this.opt.buttons)
      .content(this.opt.content);

    dialog.appendTo(this.opt.container || this.doc.body);

    // align
    var align = this.opt.align,
      orig = this.opt.orig;

    $.each(['left', 'center', 'right'], $.proxy(function (i, n) {
      if (align.indexOf(n) !== -1) {
        orig.x = i / 2;
        return false;
      }
    }, this));

    $.each(['top', 'middle', 'bottom'], $.proxy(function (i, n) {
      if (align.indexOf(n) !== -1) {
        orig.y = i / 2;
        return false;
      }
    }, this));

    // width
    if (this.opt.width) {
      this.dialog.css({
        width: this.opt.width
      });
    }

    this.locate();

    this.dialog.css({
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
   * @param {boolean} blocker 显示或隐藏遮罩
   * @method blocker
   */
  blocker: function (blocker) {
    var css,
      dialog,
      dialogBlocker;

    if (blocker) {

      css = {
        display: 'none',
        position: this.opt.position,
        zIndex: this.opt.zIndex
      };

      dialog = this.dialog;

      if (css.position === 'absolute') {
        css.width = this.doc.body.scrollWidth;
        css.height = this.doc.body.scrollHeight;
      }

      dialogBlocker = $('<div class="' + this.getClassName('blocker') + '"/>', this.doc)
        .css(css)
        .attr({
          tabIndex: -1
        })
        .on('mousedown', $.proxy(function () {
          var dialog = this.dialog,
            queue = dialog.queue,
            mleft, anims, executor;
          // shake
          if (typeof queue === 'undefined' || queue().length === 0) {
            mleft = parseInt(dialog.css('marginLeft'), 10) || 0;
            anims = [
                [-10, 50],
                [10, 100],
                [-10, 50],
                [10, 100],
                [0, 50]
              ];
            executor = function () {
              var anim = anims.shift();
              if (anim) {
                dialog.animate({
                  marginLeft: mleft + anim[0]
                }, anim[1]);
                setTimeout(executor, anim[1]);
              }
            };
            executor();
          }
        }, this));

      if (this.opt.closeTrigger) {

        dialogBlocker
          .on('keydown.' + this.guid, $.proxy(function (e) {
            // escape
            if (e.keyCode === 27) {
              this.dialogClose.trigger('click');
            }
          }, this));
      }

      this.dialogBlocker = dialogBlocker.prependTo(this.opt.container || this.doc.body);

    } else {
      this.dialogBlocker && this.dialogBlocker.hide();
    }

    return this;
  },

  /**
   * 生成按钮
   * @example
   * ```
   * this.buttons({
   *   // `＜a class="ui-dialog-button ui-dialog-button-submit"...＞Submit＜/a＞`
   *   'submit': {
   *     title: 'Submit',
   *     callback: function () {
   *       this.result = 1;
   *       this.close();
   *     },
   *     // 隐藏按钮
   *     visible: false
   *   },
   *   // `＜a class="ui-dialog-button ui-dialog-button-cancel"...＞Cancel＜/a＞`
   *   'cancel': {
   *     title: 'Cancel',
   *     callback: function () {
   *       this.result = 0;
   *       this.close();
   *     }
   *   },
   *   // `＜a class="ui-dialog-button ui-dialog-button-ignore"...＞Ignore＜/a＞`
   *   'ignore': {
   *     title: 'Ignore',
   *     callback: function () {
   *       this.result = -1;
   *       this.close();
   *     }
   *   }
   * });
   * ```
   * @method buttons
   * @param {Object} buttons 按钮组
   */
  buttons: function (buttons) {
    var buttonClassPrefix;
    if (buttons) {
      buttonClassPrefix = this.getClassName('button');
      $.each(buttons, $.proxy(function (name, params) {
        var btn = $('<a class="' +
            buttonClassPrefix + ' ' +
            buttonClassPrefix + '-' +
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
            btn[this.opt.reverseButtons ? 'prependTo' : 'appendTo'](this.dialogFoot);
      }, this));

    }

    return this;
  },

  /**
   * 显示加载中遮罩层
   * @param {Boolean} [show] 是否显示（默认为`TRUE`）
   * @method loading
   */
  loading: function (show) {
    this.dialogLoading.toggle(show !== false);

    return this;
  },

  /**
   * 清理当前实例
   * @param {Function} [callback] 回调函数
   * @method clear
   */
  clear: function (callback) {
    if (!this.dialog) {
      return;
    }

    // clear bindings
    $([this.ctx, this.doc, this.doc.body,
      this.dialog, this.dialogHead])
        .off('.' + this.guid);

    var clear = function () {
      if (this.dialog) {
        this.dialog.remove();

        if (this.dialogBlocker) {
          this.dialogBlocker.remove();
        }
      }

      locker.remove(this.guid);

      if (typeof callback === 'function') {
        callback.call(this);
      }
    };

    if (typeof callback === 'function') {
      this.hide($.proxy(clear, this));
    } else {
      clear.call(this);
    }
  },

  /**
   * 关闭窗体
   * 首先执行全局回调函数`opt.callback`，如返回值为`false`，则终止执行
   * @param {Function} [callback] 全局回调函数
   * @method close
   */
  close: function (callback) {
    if (!this.dialog) {
      return;
    }

    if (typeof callback === 'function') {
      // 执行全局回调函数，如返回值为`false`，则终止执行
      if (callback.call(this) === false) {
        return;
      }
    }

    this.clear(function () {
      if (!this.dialog) {
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
   * @param {Mixture} content 内容
   */
  content: function (content) {
    this.dialogBody.empty().append(content);

    return this;
  },

  /**
   * 设置焦点，并移动到最顶层
   * @method focus
   */
  focus: function () {
    if (!this.dialog) {
      return;
    }

    if (this.opt.zIndex < zIndex) {
      this.opt.zIndex = ++zIndex;
      this.dialog.css({
        zIndex: zIndex
      });
    }

    // this.dialog.focus();

    this.fire('focus');
  },

  /**
   * 隐藏窗体
   * @method hide
   * @param {Function} [callback] 回调函数
   */
  hide: function (callback) {
    if (!this.dialog) {
      return;
    }

    if (this.dialogBlocker) {
      this.dialogBlocker.fadeOut(this.opt.speed);
    }

    this.opt.effects.hide.call(this, this.dialog, this.opt.speed, callback);
    this.visible = false;

    this.fire('hide');
  },

  /**
   * 设定窗体位置
   * @method locate
   * @private
   */
  locate: function () {
    var locate = $.proxy(function () {

      var dialog = this.dialog,

        left = ($(this.ctx).width() - dialog.width()) *
            this.opt.orig.x +
            (this.opt.position === 'fixed' ? 0 : $(this.ctx).scrollLeft()) +
            this.opt.offset.x,
        top = ($(this.ctx).height() - dialog.height()) *
            this.opt.orig.y +
            (this.opt.position === 'fixed' ? 0 : $(this.ctx).scrollTop()) +
            this.opt.offset.y;

      dialog.animate({
          left: Math.max(left, 0),
          top: Math.max(top, 0)
        }, 50);

    }, this);

    locate();

    // 固定位置
    if (this.opt.sticky) {

      $(this.ctx)
        .off('.l.' + this.guid)
        .on('resize.l.' + this.guid + ' scroll.l.' + this.guid, locate);

    } else {

      locate = null;

    }

    return this;
  },

  /**
   * 显示窗体
   * @method show
   */
  show: function () {
    if (!this.dialog) {
      return;
    }

    if (this.dialogBlocker) {
      this.dialogBlocker.fadeIn(this.opt.speed);
    }

    this.visible = true;
    this.opt.effects.show.call(this, this.dialog, this.opt.speed);

    this.fire('show');

    this.focus();
  },

  /**
   * 设置标题
   * @method title
   * @param {Mixture} title 标题
   */
  title: function (title) {

    if (title === false) {
      this.dialog.addClass(this.getClassName('notitle'));
      this.dialogTitle.hide().empty();
    } else {
      this.dialog.removeClass(this.getClassName('notitle'));
      this.dialogTitle.html(title).show();
    }

    return this;
  }

});

return Dialog;

});
