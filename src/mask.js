define(function (require, exports, module) {

/**
 * 对话框
 *
 * @module Dialog
 */

'use strict';

var $ = require('$'),
  Overlay = require('overlay');

/**
 * 遮罩层
 *
 * @class Mask
 * @constructor
 */
var Mask = Overlay.extend({

  defaults: {
    // autoShow: true,
    classPrefix: 'ue-mask',
    css: {
      position: (!!window.ActiveXObject && !window.XMLHttpRequest) ? 'absolute' : 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      background: '#000',
      opacity: 0.2
    }
  },

  setup: function () {
    var self = this,
      resize;

    // IE6
    if (!!window.ActiveXObject && !window.XMLHttpRequest) {
      $('<iframe src="about:blank" frameborder="0"></iframe>')
        .css({
          width: '100%',
          height: '100%',
          opacity: 0
        })
        .appendTo(self.element);
    }

    Mask.superclass.setup.apply(self);

    // 调整尺寸
    if (self.option('css/position') === 'absolute') {
      resize = function () {
        self.element
          // 先重置成100%，避免出现多余的滚动条
          .css({
            width: '100%',
            height: '100%'
          })
          .css({
            width: $(self.document).width(),
            height: $(self.document).height()
          });
      };

      resize();

      $(self.viewport).on('resize.' + self.uniqueId, resize);
    }
  },

  destroy: function () {
    var self = this;

    if (self.option('css/position') === 'absolute') {
      $(self.viewport).off('resize.' + self.uniqueId);
    }

    Mask.superclass.destroy.apply(self);
  }

});

module.exports = Mask;

});
