define(function (require, exports) {

  'use strict';

  var Confirm = require('../src/confirm');

  QUnit.start();

  module('Module Confirm');
  test('new Confirm(text string)', function() {
    var dialog = new Confirm('text string');
    equal( dialog.els.dialogBody.text(), 'text string', '' );
    dialog.close();
  });
  test('new Confirm(html string)', function() {
    var dialog = new Confirm('<i>text string</i>');
    equal( dialog.els.dialogBody.text(), 'text string', '' );
    equal( dialog.els.dialogBody.html(), '<i>text string</i>', '' );
    dialog.close();
  });

  module('Module Button');
  asyncTest('new Confirm(text string)', function() {
    var dialog = new Confirm('text string');
    dialog.close();
    setTimeout(function () {
      equal( typeof dialog.els, 'undefined', '' );
      equal( typeof dialog.close, 'function', '' );
      start();
    }, 1000);
  });

});