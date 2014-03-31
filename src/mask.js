define(function (require, exports, module) {

/**
 * 对话框
 *
 * @module Dialog
 */

'use strict';

var $ = require('$'),
  Widget = require('widget');

/**
 * 遮罩层
 *
 * @class Mask
 * @constructor
 */
var Mask = Widget.extend({

  defaults: {
    autoShow: true,
    element: '<div class="ue-component ue-mask"></div>',
    position: (!!window.ActiveXObject && !window.XMLHttpRequest) ? 'absolute' : 'fixed',
    zIndex: 901,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, .2)'
  },

  setup: function () {
    this.element
      .attr({
        // 使元素可获取焦点，进而可以绑定keydown
        tabIndex: -1
      })
      .css({
        position: this.option('position'),
        zIndex: this.option('zIndex'),
        left: this.option('left'),
        top: this.option('top'),
        width: this.option('width'),
        height: this.option('height'),
        background: this.option('background')
      });

    // IE6
    if (!!window.ActiveXObject && !window.XMLHttpRequest) {
      $('<iframe src="about:blank" frameborder="0"></iframe>')
        .css({
          width: '100%',
          height: '100%',
          opacity: 0
        })
        .appendTo(this.element);
    }

    this.option('autoShow') && this.show();
  },

  show: function () {
    if (!this.rendered) {
      this.render();

      // 调整尺寸
      if (this.option('position') === 'absolute') {
        var mask = this,
          resize = function () {
            mask.element
              // 先重置成100%，避免出现多余的滚动条
              .css({
                width: '100%',
                height: '100%'
              })
              .css({
                width: $(mask.document).width(),
                height: $(mask.document).height()
              });
          };

        resize();

        $(this.viewport).on('resize.p.' + this.uniqueId, resize);
      }
    }

    this.element.show();
  },

  hide: function () {
    this.element.hide();
  },

  destroy: function () {
    if (this.option('position') === 'absolute') {
      $(this.viewport).off('resize.p.' + this.uniqueId);
    }
    return Mask.superclass.destroy.apply(this);
  }

});

module.exports = Mask;

});
