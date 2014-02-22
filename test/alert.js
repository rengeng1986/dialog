define(function (require, exports) {

  'use strict';

  var Alert = require('../src/alert');

  QUnit.start();

  module('Module Event');
  asyncTest('new Alert({})', function() {
    var dialog = new Alert({
      content: 'text string',
      on: {
        'submit': function () {
          idx1++;
          idx2++;
        },
        'close': function () {
          idx2++;
        }
      }
    }), idx1 = 0, idx2 = 0;
    dialog.dialog.find('[data-button-name="submit"]').trigger('click');
    setTimeout(function () {
      equal( idx1, 1, '' );
      equal( idx2, 2, '' );
      start();
    }, 1000);
  });

});