define(function (require, exports) {

  'use strict';

  var Dialog = require('../src/dialog');

  QUnit.start();

  module('Module Dialog');
  test('new Dialog(text string)', function() {
    var dialog = new Dialog('text string');
    equal( dialog.els.dialogBody.text(), 'text string', '' );
    dialog.close();
  });
  test('new Dialog(html string)', function() {
    var dialog = new Dialog('<i>text string</i>');
    equal( dialog.els.dialogBody.text(), 'text string', '' );
    equal( dialog.els.dialogBody.html(), '<i>text string</i>', '' );
    dialog.close();
  });

});