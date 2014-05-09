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
    // classPrefix: 'ue-mask',
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
      baseElement = self.option('baseElement');

    if (baseElement) {
      self.baseElement = $(baseElement);
      self.setPosition = setPosition;
    } else {
      if (self.option('css/position') === 'absolute') {
        self.baseElement = $(self.document);
        self.setPosition = setPosition;

        $(self.viewport).on('resize.' + self.uniqueId, function () {
          self.setPosition();
        });
      }
    }

    // IE6
    if (!!window.ActiveXObject && !window.XMLHttpRequest) {
      $('<iframe src="about:blank"></iframe>')
        .css({
          width: '100%',
          height: '100%',
          opacity: 0
        })
        .appendTo(self.element);
    }

    Mask.superclass.setup.apply(self);
  },

  destroy: function () {
    $(this.viewport).off('resize.' + this.uniqueId);

    Mask.superclass.destroy.apply(this);
  }

});

/* jshint validthis:true */
function setPosition () {
  var self = this;

  self.element
    .css({
      width: 0,
      height: 0
    })
    .css({
      width: self.baseElement.outerWidth(),
      height: self.baseElement.outerHeight()
    });

  Mask.superclass.setPosition.apply(self);
}

module.exports = Mask;

});
