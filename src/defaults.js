define({
  // 对话框默认位置，可选值为`left|center|right|top|middle|bottom`的组合
  align: 'centermiddle',
  // 是否显示对话框
  visible: true,
  // 是否模拟为模态对话框
  blocker: false,
  // 按钮组
  buttons: {},
  // 关闭回调，在关闭生效前执行
  // callback: function () {},
  // 样式前缀
  classPrefix: 'ui-dialog',
  // 是否显示关闭按钮
  closeTrigger: true,
  // 关闭按钮回调函数，值为String时，自动寻找对应的button，参见`./confirm.js`
  closeHandler: function () { this.close(); },
  // 附加对话框的节点对象
  // container: '',
  // 对话框内容，支持HTML、DOM、JQ对象
  // content: '',
  // 上下文，默认为当前window，提供此接口用于跨window操作
  context: window,
  // 用于自定义样式
  clsHook: function (name) { return this.cls(name); },
  // 对话框显示隐藏时的动画效果
  effects: {
    show: function (element, speed, callback) {
      element.fadeIn(speed, callback);
    },
    hide: function (element, speed, callback) {
      element.fadeOut(speed, callback);
    }
  },
  // 对话框ID
  // id: '',
  // 显示loading
  loading: false,
  offset: {
    // 对话框相对于中间位置的位移
    x: 0,
    y: 0
  },
  on: {},
  // 原点位置
  orig: {},
  position: 'fixed',
  reverseButtons: false,
  // 动画速度（用于遮罩层与对话框）
  speed: 200,
  // 是否固定位置（窗口大小变化时会重新计算位置）
  sticky: false,
  // 对话框模板
  template: '<div class="{{classPrefix}}">' +
        '<a class="{{classPrefix}}-close" href="javascript:">&times;</a>' +
        '<div class="{{classPrefix}}-loading"></div>' +
        '<div class="{{classPrefix}}-head">' +
          '<div class="{{classPrefix}}-title"></div>' +
        '</div>' +
        '<div class="{{classPrefix}}-body"></div>' +
        '<div class="{{classPrefix}}-foot"></div>' +
      '</div>',
  title: '&nbsp;'
  // width: ''
});
