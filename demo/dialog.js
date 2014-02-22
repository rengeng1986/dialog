define(function (require, exports) {

  'use strict';

  var Dialog = require('../src/dialog');

  // with blocker, loading, and callback
  // callback executed when buttons clicked
  // if callback return `false`,
  // `close` event will be prevented
  new Dialog({
      content: 'will show loading',
      blocker: true,
      // loading: true,
      callback: function () {
        return this.result === false;
      },
      closeHandler: 'cancel',
      buttons: {
        submit: {
          title: 'Submit',
          callback: function () {
            this.result = true;
            this.close(this.opt.callback);
          },
          visible: true
        },
        cancel: {
          title: 'Cancel',
          callback: function () {
            this.result = false;
            this.close(this.opt.callback);
          },
          visible: true
        }
      },
      sticky: true
    });

  new Dialog({
      content: 'text string',
      align: 'topleft'
    });

  new Dialog({
      content: '<i>html string</i>',
      align: 'topleft',
      offset: {
        x: 50,
        y: 10
      }
    });

});