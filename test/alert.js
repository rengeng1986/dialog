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

});