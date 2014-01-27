define(function (require, exports) {

  'use strict';

  var Tips = require('../src/tips');

  QUnit.start();

  module('Module Tips');
  asyncTest('new Tips()', function() {
    var dialog = new Tips('hello world.');
    setTimeout(function () {
      equal( typeof dialog.els, 'undefined', '' );
      start();
    }, 3000);
    equal( typeof dialog.els, 'object', '' );
  });

});
