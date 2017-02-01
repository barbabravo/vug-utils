var utils = {

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
  getSearch: function(name) {
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