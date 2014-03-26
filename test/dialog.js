define(function (require, exports) {

  'use strict';

  var Dialog = require('../src/dialog');

  QUnit.start();

  module('Module Dialog');
  test('text string', function() {
    var dialog = new Dialog({
      content: 'text string'
    });
    equal( dialog.dialogBody.text(), 'text string', '' );
    dialog.close();
  });
  test('html string', function() {
    var dialog = new Dialog({
      content: '<i>html string</i>'
    });
    equal( dialog.dialogBody.text(), 'html string', '' );
    equal( dialog.dialogBody.html(), '<i>html string</i>', '' );
    dialog.close();
  });
  asyncTest('loading', function() {
    var dialog = new Dialog({
      content: 'will show loading'
    });
    setTimeout(function () {
    dialog.loading();
      ok( dialog.dialogLoading.is(':visible'), '' );
      dialog.close();
      start();
    }, 500);
  });
  asyncTest('loading', function() {
    var dialog = new Dialog({
      content: 'will show loading',
      loading: true
    });
    setTimeout(function () {
      ok( dialog.dialogLoading.is(':visible'), '' );
      dialog.close();
      start();
    }, 500);
  });
  test('loading', function() {
    var dialog = new Dialog({
      content: 'will show loading',
      loading: true
    });
    dialog.loading(false);
    ok( dialog.dialogLoading.is(':hidden'), '' );
    dialog.close();
  });
  test('buttons', function() {
    var dialog = new Dialog({
      content: 'i have buttons',
      buttons: {
        submit: {
          title: 'Submit',
          callback: function () {},
          visible: true
        },
        cancel: {
          title: 'Cancel',
          callback: function () {},
          visible: true
        }
      }
    });
    equal( dialog.dialog.find('.ui-dialog-button-submit').text(), 'Submit', '' );
    equal( dialog.dialog.find('.ui-dialog-button-cancel').text(), 'Cancel', '' );
    dialog.close();
  });

  module('Module Clear');
  asyncTest('dialog.close', function() {
    var dialog = new Dialog('text string');
    dialog.close();
    setTimeout(function () {
      equal( typeof dialog.dialog, 'undefined', '' );
      equal( typeof dialog.close, 'function', '' );
      start();
    }, 1000);
  });

});