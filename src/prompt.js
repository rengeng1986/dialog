define(function (require, exports, module) {

/**
 * 弹窗
 * @module Dialog
 */

'use strict';

var Class = require('class'),
  Dialog = require('./dialog');

/**
 * Prompt
 * @class Prompt
 * @extends Dialog
 * @constructor
 */
var Prompt = new Class(Dialog, {

    id: 'Prompt',

    content: function () {
      var pWrap = $('<div/>', this.context.document),
        tWrap = $('<div class="' + this.cls.propmtTitle + '"/>', this.context.document)
            .text(this.opt.content).appendTo(pWrap),
        cWrap = $('<div class="' + this.cls.propmtContent + '"/>', this.context.document)
            .appendTo(pWrap);

      this.els.textInput = $('<input type="text" class="' + this.cls.propmtInput + '"/>', this.context.document)
        .attr({
          tabIndex: -1
        })
        .on('keydown', $.proxy(function (e) {
          if (e.keyCode === 9) {
            e.preventDefault();
          } else if (e.keyCode === 13) {
            this.buttons.submit.trigger('click');
          }
        }, this))
        .val(this.opt.defaultValue)
        .appendTo(cWrap);

      this.opt.content = pWrap.children();

      this.els.dialogBody.empty().append(this.opt.content);

      pWrap.remove();
      pWrap = null;

      return this;
    },

    options: {
      defaultValue: '',
      blocker: true,
      classes: {
        'propmtTitle':    'ui-prompt-title',
        'propmtContent':  'ui-prompt-content',
        'propmtInput':    'ui-prompt-input'
      },
      on: {
        focus: function () {
          this.els.textInput.focus();
        }
      },
      closeHandler: 'cancel',
      buttons: {
        submit: ['确定', function () {
          this.result = this.els.textInput.val();
          this.close();
        }],
        cancel: ['取消', function () {
          this.result = null;
          this.close();
        }]
      }
    }

  });

return Prompt;

});
