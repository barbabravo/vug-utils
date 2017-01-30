var components = require('vug-components');
var _ = require('lodash');

var utils = {

  init: function() {
    document.writeln('<style>.g-page-transition-transition {-webkit-opacity: 1 !important; -moz-opacity: 1 !important; -o-opacity: 1 !important; -ms-opacity: 1 !important; opacity: 1 !important; -webkit-transform: initial !important; -moz-transform: initial !important; -o-transform: initial !important; -ms-transform: initial !important; transform: initial !important; } .g-page-transition-enter {transition: all .5s ease !important; -webkit-opacity: 0; -moz-opacity: 0; -o-opacity: 0; -ms-opacity: 0; opacity: 0; -webkit-transform: translate(50px); -moz-transform: translate(50px); -o-transform: translate(50px); -ms-transform: translate(50px); transform: translate(50px); }<\/style');
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

  setCookie: function(name, value){
    var exp = new Date();
    exp.setTime(exp.getTime + 8*60*60*1000);
    document.cookie = name + '=' + escape(value) + ";expires=" + exp.toGMTString();
  },

  getCookie: function(name){
    var arr , reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
    if(arr = document.cookie.match(reg)){
      return unescape(arr[2])
    }else{
      return null;
    }
  },
  
  delCookie(name){ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
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
  _loading_count:0,
  showLoading: function(flag) {
    var self = this;
    if (!self._$loading) {
      self._$loading = $(
        "<div style='position:fixed;display:flex;display: -webkit-flex; align-items:center;justify-content:center;z-index:9999;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.1)'><img class='loading-img loadingRotate' src='data:image/gif;base64,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'></div>"
      ).appendTo('body');
    }
    self._loading_count++;
    self._$loading.fadeIn();
    return this;
  },
  hideLoading: function() {
    var self = this;
    self._loading_count--;
    if (self._$loading && self._loading_count<1) {
      self._$loading.fadeOut();
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
      type: "POST",
      dataType: 'json',
      async: true,
      // minResponseTime: 3000,
      cache: false,
      transition:'body',
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
            window.location.href = '//erp.2b6.me/cas/login.html?callback=' + encodeURIComponent(window.location.href);
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
          option.testData = testData;
          if(!option.untimed){
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
          }else{
            return self._doAjax(option);
          }
        }
      })(api);
      this.API[api].url = api_list[api].url;
    }
  },
  extend: function(api_list, debug) {
    //扩展API，可DEBUG
    if (typeof api_list !== 'object') {
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
  formatDate: function(timestamp, format, default_value){
    /* format : yyyy-MM-dd-HH-mm-ss */
    var timestamp = timestamp || 0, default_value = default_value || '', ret;

    var covertNumberToTwoDigit = function(number) {
      return number.toString().replace(/^(\d)$/, '0$1');
    }
    if(!timestamp || timestamp == '0') {
      ret = default_value;
    }else{
      if(timestamp.toString().length == 10){
        timestamp = timestamp * 1000;
      }
      var date = new Date(timestamp),
      full_year = date.getFullYear() || '0000',
      month = covertNumberToTwoDigit(date.getMonth() + 1) || '00',
      day = covertNumberToTwoDigit(date.getDate()) || '00',
      hour = covertNumberToTwoDigit(date.getHours()) || '00',
      minute = covertNumberToTwoDigit(date.getMinutes()) || '00',
      second = covertNumberToTwoDigit(date.getSeconds()) || '00';
      ret = format.replace(/yyyy/, full_year).replace(/MM/, month).replace(
        /dd/, day).replace(/HH/, hour).replace(/mm/, minute).replace(
          /ss/,
          second);
    }
    return ret;
  }
}


module.exports = utils;