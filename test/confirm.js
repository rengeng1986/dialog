define(function (require, exports) {

  'use strict';

  var Confirm = require('../src/confirm');

  QUnit.start();

  module('Module Button');
  asyncTest('new Confirm()', function() {
    var dialog = new Confirm({
      content: 'text string',
      callback: function () {
        return this.result === false;
      },
      on: {
        'submit': function () {
          idx1++;
          idx2++;
        },
        'cancel': function () {
          idx2++;
        },
        'close': function () {
          idx2++;
        }
      }
    }), idx1 = 0, idx2 = 0;
    dialog.dialog.find('[data-button-name="submit"]').trigger('click');
    setTimeout(function () {
      dialog.close();
      equal( idx1, 1, '' );
      equal( idx2, 1, '' );
      start();
    }, 1000);
  });
  asyncTest('new Confirm()', function() {
    var dialog = new Confirm({
      content: 'text string',
      callback: function () {
        return this.result === false;
      },
      on: {
        'submit': function () {
          idx1++;
          idx2++;
        },
        'cancel': function () {
          idx2++;
        },
        'close': function () {
          idx2++;
        }
      }
    }), idx1 = 0, idx2 = 0;
    dialog.dialog.find('[data-button-name="cancel"]').trigger('click');
    setTimeout(function () {
      dialog.close();
      equal( idx1, 0, '' );
      equal( idx2, 2, '' );
      start();
    }, 1000);
  });

});