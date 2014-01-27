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
      var pWrap = $('<div/>', this.doc),
        tWrap = $('<div class="' + this.cls.propmtTitle + '"/>', this.doc)
            .text(this.opt.content).appendTo(pWrap),
        cWrap = $('<div class="' + this.cls.propmtContent + '"/>', this.doc)
            .appendTo(pWrap);

      this.els.textInput = $('<input type="text" class="' + this.cls.propmtInput + '"/>', this.doc)
        .attr({
          tabIndex: -1
        })
        .on('keydown', $.proxy(function (e) {
          if (e.keyCode === 9) {
            e.preventDefault();
          } else if (e.keyCode === 13) {
            this.bts.submit.trigger('click');
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
        submit: {
          title: '确定',
          callback: function () {
            this.result = this.els.textInput.val();
            this.close();
          }
        },
        cancel: {
          title: '取消',
          callback: function () {
            this.result = null;
            this.close();
          }
        }
      }
    }

  });

return Prompt;

});
