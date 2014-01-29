define(function (require, exports, module) {

/**
 * 弹窗
 * @module Dialog
 */

'use strict';

var $ = require('$'),
  Class = require('class'),
  Dialog = require('./dialog');

/**
 * Tips
 * @class Tips
 * @extends Dialog
 * @constructor
 */
var Tips = new Class(Dialog, {

    arg: function () {
      var args = Array.prototype.slice.call(arguments, 0),
        arg0 = args.shift();

      if (typeof arg0 === 'string') {
        this.opt.content = arg0;
      } else if ($.isPlainObject(arg0)) {
        $.extend(true, this.opt, arg0);
      }

      if (args.length > 0) {
        if (typeof args[0] === 'number') {
          this.opt.timeout = args[0];
        } else if (typeof args[0] === 'function') {
          this.opt.callback = args[0];
        }

        if (args.length > 1) {
          if (typeof args[1] === 'function') {
            this.opt.callback = args[1];
          }
        }
      }

      return this;
    },

    options: {
      timeout: 2,
      title: false,
      closeTrigger: false,
      on: {
        show: function () {
          setTimeout($.proxy(function () {
            this.close();
          }, this), this.opt.timeout * 1000);
        }
      }
    }

  });

return Tips;

});
