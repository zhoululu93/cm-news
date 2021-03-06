/*!-----------------------------------------------------------------
  Name: neXessary - neXessary
  Version: 0.0.0
  Author: fujitsu
  Website: http://fujitsu.com
  Purchase: http://fujitsu.com
  Support: http://fujitsu.com
  License: You must have a valid license purchased only from ThemeForest (the above link) in order to legally use the theme for your project.
  Copyright 2018.
-------------------------------------------------------------------*/

/**
 * @classdesc Finplex用ユーティリティクラス
 * @constructor
 */
var FinplexUtils = function () { };
var $finplex_utils = new FinplexUtils();

$(function () {
    // jsRender用Converter登録
    if ($.views) {
        // topicのphotoがbase64で送信されてくるが、プレフィックスにimage=が含まれているため、いったん除外処理を記載。後に置き場を検討
        $.views.converters("toNumber", $finplex_utils.toNumber);
        $.views.converters("toCurrency", $finplex_utils.toCurrency);
        $.views.converters("toCheck", $finplex_utils.toCheck);
        $.views.converters("urlAutoLink", $finplex_utils.urlAutoLink);
    }
});

FinplexUtils.prototype.urlAutoLink = function (text) {
    return text.replace(/(http:) ?(\/\/[\x21-\x7e]+)/gi, "</br></br><a target='_blank' href='$1$2'>$1$2</a>")
        .replace(/(https:) ?(\/\/[\x21-\x7e]+)/gi, "</br></br><a target='_blank' href='$1$2'>$1$2</a>");
}

/**
 * 文字列フォーマット関数
 * 
 * @param {String} fmt - フォーマット {0}{1}...
 * @param {Object} a - 値  
 */
FinplexUtils.prototype.formatString = function (fmt, a) {
    var rep_fn = undefined;
    if (typeof a == "object") {
        rep_fn = function (m, k) { return a[k]; }
    }
    else {
        var args = arguments;
        rep_fn = function (m, k) { return args[parseInt(k) + 1]; }
    }
    return fmt.replace(/\{(\w+)\}/g, rep_fn);
}

FinplexUtils.prototype.toNumber = function (value) {
    return Number(value).toLocaleString();
}

FinplexUtils.prototype.toCurrency = function (value) {
    return Number(value).toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
}

FinplexUtils.prototype.toCheck = function (value) {
    if (value == 1) return '✔';
    return '';
}