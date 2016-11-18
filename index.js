var components = require('qbs-components');
var _ = require('lodash');

var utils = {

  init: function() {
    document.writeln('<style>.g-page-transition-transition {-webkit-opacity: 1 !important; -moz-opacity: 1 !important; -o-opacity: 1 !important; -ms-opacity: 1 !important; opacity: 1 !important; -webkit-transform: initial !important; -moz-transform: initial !important; -o-transform: initial !important; -ms-transform: initial !important; transform: initial !important; } .g-page-transition-enter {transition: all .5s ease !important; -webkit-opacity: 0; -moz-opacity: 0; -o-opacity: 0; -ms-opacity: 0; opacity: 0; -webkit-transform: translate(50px); -moz-transform: translate(50px); -o-transform: translate(50px); -ms-transform: translate(50px); transform: translate(50px); } @keyframes loadingRotate {0% {transform: rotate(0deg); } 60% {transform: rotate(360deg); } 99.9% {transform: rotate(360deg); } 100% {transform: rotate(0deg); } } @-moz-keyframes loadingRotate {0% {-moz-transform: rotate(0deg); } 60% {-moz-transform: rotate(360deg); } 99.9% {-moz-transform: rotate(360deg); } 100% {transform: rotate(0deg); } } @-webkit-keyframes loadingRotate {0% {-webkit-transform: rotate(0deg); } 60% {-webkit-transform: rotate(360deg); } 99.9% {-webkit-transform: rotate(360deg); } 100% {-webkit-transform: rotate(0deg); } } .qui-popup {background: rgba(0, 0, 0, .4); background-image: initial !important; } .loading {transition: all .5s ease; opacity: 0; position: fixed; z-index: 1299; left: 0; top: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, .4); } .loading.loading-wrapper {position: absolute; left: 50%; top: 50%; margin-left: -40px; margin-top: -40px; padding: 10px; background: #FFF; border-radius: 10px; } .loading.loading-img {width: 40px; height: 40px; animation: loadingRotate 1s infinite; -webkit-animation: loadingRotate 1s infinite; -moz-animation: loadingRotate 1s infinite; }<\/style');
  },

  // 加载JS
  loadJS: function(src) {
    document.writeln('<script src="' + src + '"><\/script>');
  },

  // 加载 CSS
  loadCSS: function(src) {
    document.writeln('<link rel="stylesheet" href="' + src + '" \/>');
  },

  // 查询地址栏参数
  queryUrl: function(name) {
    if (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURIComponent(r[2]);
      return null;
    } else {
      var param = {};
      location.search.substr(1).split('&').map(function(aParam) {
        var tmp = aParam.split('=');
        param[tmp[0]] = decodeURIComponent(tmp[1]);
      })
      return param;
    }
  },

  tip: function(options) {
    return new Promise(function(resolve, reject){
      resolve = resolve || function() {};
      reject = reject || function() {};
      if (typeof options == 'string' || typeof options == 'number') {
        components.qTip({
          text: options
        });
      } else {
        components.qTip(options);
      }
      setTimeout(function() {
        resolve();
      }, options.time || 1000)
    })
  },

  alert: function(text, onOk) {
    onOk = onOk || function() {};
    return new Promise(function(resolve, reject){
      resolve = resolve || function() {};
      reject = reject || function() {};
      components.qAlert(text, resolve);
    })
  },

  confirm: function(text, onOk, onCancel) {
    onOk = onOk || function() {};
    onCancel = onCancel || function() {};
    components.qConfirm(text, onOk, onCancel);
  },


  encodeUTF8: function(str) {
    var temp = "",
      rs = "";
    for (var i = 0, len = str.length; i < len; i++) {
      temp = str.charCodeAt(i).toString(16);
      rs += "\\u" + new Array(5 - temp.length).join("0") + temp;
    }
    return rs;
  },

  decodeUTF8: function(str) {
    return str.replace(/(\\u)(\w{4}|\w{2})/gi, function($0, $1, $2) {
      return String.fromCharCode(parseInt($2, 16));
    });
  },


  openMenu: function(url) {
    setTimeout(function() {
      $('#js_user_menu').find('a[href="${url}"]').parents('.panel-collapse').collapse();
    }, 10);
  },

  getSearch: function(name) {
    return utils.queryUrl(name);
  },
  getMultiSearch: function(param_name) {
    var url = location.search.replace(/^\?/, ''),
      params = url.split('&'),
      param, ret = [];
    param = params.filter(function(aParam) {
      return aParam.split('=')[0] == param_name;
    })
    console.log(param);
    if (param.length > 0) {
      param.map(function(aParam) {
        ret.push(aParam.split('=')[1]);
      })
    }
    return ret;
  },

  getHashView: function() {
    return window.location.hash.replace('#', '');
  },

  API: {},
  _$loading: null,
  showLoading: function() {
    var self = this;
    if (!self._$loading) {
      self._$loading = $(
        "<div class='loading'><div class='loading-wrapper'><img class='loading-img loadingRotate' src='data:image/gif;base64,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'></div></div>"
      ).appendTo('body');
    }
    self._$loading.removeClass('hidden').animate({
      opacity: 1
    }, 100);
    return this;
  },
  hideLoading: function() {
    var self = this;
    if (self._$loading) {
      self._$loading.animate({
        opacity: 0
      }, 100, function() {
        self._$loading.addClass('hidden');
      })
    }
    return this;
  },
  serialize: function(form) {
    var data = {},
      form_data = $(form).serializeArray();
    $.each(form_data, function() {
      if (data[this.name] !== undefined) {
        if (!data[this.name].push) {
          data[this.name] = [data[this.name]];
        }
        data[this.name].push(this.value || '');
      } else {
        data[this.name] = this.value || '';
      }
    });
    return data;
  },

  _doAjax: function(aOption) {
    var self = this;
    var _startDate, _duringTime, dataProcess;

    aOption = _.assign({}, {
      type: "GET",
      dataType: 'json',
      async: true,
      minResponseTime: 300,
      cache: false,
      // transition:false,
      onError: function(json) {
        self.tip({
          type: 'error',
          text: '发生错误，错误:' + (json.__server_error__ == true ? '服务器发生错误' : json.data.msg)
        });
      }
    }, aOption)

    _startDate = aOption.minResponseTime ? new Date() : null;

    dataProcess = function(aJSON) {
      if (aJSON.error_code == 0) {
        if (typeof(aJSON.data) == 'undefined') {
          aJSON.data = aOption.__defaultData__;
        }
        if (aOption.transition != false) {
          self.hideLoading();
        }
        aOption.onCallSuccessBefore && aOption.onCallSuccessBefore(
          aJSON);
        aOption.onSuccess && aOption.onSuccess(aJSON);
        aOption.onCallSuccessAfter && aOption.onCallSuccessAfter(
          aJSON);
      } else {
        //当且仅当302登陆过期时，强制刷回登陆页
        if (aJSON.error_code == '302') {
          utils.tip('登陆已过期，将转向登陆页', 'error').then(function() {
            window.location.href = 'http://erp.2b6.me/cas/login?service=' + window.location.host;
          })
        } else {
          if (aOption.transition != false) {
            self.hideLoading();
          }
          aOption.onError && aOption.onError(aJSON);
        }
      }
    };

    if (aOption.testData) {
      if (typeof(aOption.testData.data) == 'undefined') {
        aOption.testData.data = aOption.__defaultData__;
      }
      if (aOption.async === false) {
        dataProcess(aOption.testData);
      } else {
        setTimeout(function() {
          dataProcess(aOption.testData);
        }, (aOption.minResponseTime || 200));
      }
      return;
    }

    var _opt = _.assign(aOption, {
      success: function(aJSON) {
        if (typeof aJSON == 'string') {
          try {
            aJSON = JSON.parse(aJSON);
          } catch (e) {
            console.log('parse strong to object error');
          }
        }
        if (_startDate) {
          _duringTime = new Date() - _startDate;
          setTimeout(function() {
            dataProcess.call(null, aJSON);
          }, (_duringTime > aOption.minResponseTime ? 0 :
            aOption.minResponseTime - _duringTime));
        } else {
          dataProcess.call(null, aJSON);
        }
        _startDate = _duringTime = null;
      },
      error: function(aXhr, aInfo) {
        if (aOption.transition != false) {
          self.hideLoading();
        }
        aOption.onError && aOption.onError({
          "error_code": -1,
          "__server_error__": true,
          "__server_status__": _ajax.statusText,
          "result": "error",
          "data": {
            "msg": aInfo || {}
          }
        });
      }
    })
    var _ajax = $.ajax(_opt);
    return _ajax;
  },
  _generateApiFun: function(api_list, debug) {
    var self = this,
      _timer = {};
    for (var api in api_list) {
      this.API[api] = (function(api) {
        return function(option) {
          var api_url = api_list[api].url,
            testData = api_list[api].testData;
          option = option || {};
          option.url = api_url;
          if (debug === true) {
            option.testData = testData;
          }
          if (!_timer[api]) {
            if (option.transition != false) {
              self.showLoading();
            }
            _timer[api] = setTimeout(function() {
              _timer[api] = null;
            }, 200);
          } else {
            self.tip({
              type: 'warning',
              text: '稍等一会哦，请求已经在发送中~'
            });
          }
          return self._doAjax(option);
        }
      })(api);
      this.API[api].url = api_list[api].url;
    }
  },
  extend: function(api_list, debug) {
    //扩展API，可DEBUG
    var debug = typeof debug == 'undefined' ? this.debug : debug;
    if (typeof api_list !== 'object') {
      debug = !!api_list;
      api_list = {};
    }
    this._generateApiFun($.extend(true, {}, api_list), debug);
    return this;
  },
  _promise: function(fun) {
    return new Promise(function(resolve, reject) {
      fun && fun(resolve, reject);
    })
  },
}


module.exports = utils;