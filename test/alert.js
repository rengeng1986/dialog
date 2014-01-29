define(function (require, exports) {

  'use strict';

  var Alert = require('../src/alert');

  QUnit.start();

  module('Module Alert');
  test('new Alert(text string)', function() {
    var dialog = new Alert('text string');
    equal( dialog.els.dialogBody.text(), 'text string', '' );
    dialog.close();
  });
  test('new Alert(html string)', function() {
    var dialog = new Alert('<i>text string</i>');
    equal( dialog.els.dialogBody.text(), 'text string', '' );
    equal( dialog.els.dialogBody.html(), '<i>text string</i>', '' );
    dialog.close();
  });

  module('Module Clear');
  asyncTest('new Alert(text string)', function() {
    var dialog = new Alert('text string');
    dialog.close();
    setTimeout(function () {
      equal( typeof dialog.els, 'undefined', '' );
      equal( typeof dialog.close, 'function', '' );
      start();
    }, 1000);
  });

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
    dialog.bts['submit'].trigger('click');
    setTimeout(function () {
      equal( idx1, 1, '' );
      equal( idx2, 2, '' );
      start();
    }, 1000);
  });

});