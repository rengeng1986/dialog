define(function (require, exports) {

  'use strict';

  var Prompt = require('../src/prompt');

  QUnit.start();

  module('Module Prompt');
  test('new Prompt()', function() {
    var dialog = new Prompt('your name:');
    dialog.els.dialogBody.find('input').val('Tom');
    dialog.bts.submit.trigger('click');
    equal( dialog.result, 'Tom', '' );
    dialog.close();
  });

});