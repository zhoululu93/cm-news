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
$(function () {
    // jsRender用Converter登録
    if ($.views) {
        $.views.settings.allowCode(true);

        // 指定文字数で文字列をカットし、...を追加する
        $.views.helpers("trimLength", function (value, maxLength) {
            if (maxLength && value.length > maxLength) {
                return value.substring(0, maxLength) + "...";
            }
            return value;
        });
        // 20文字の記事コードを日付に変換する
        $.views.helpers("topicCodeToDate", function (value) {
            var dateValue = "-";
            if (value.length != 20) {
                if (value.length != 8) return dateValue;
                dateValue = value;
            } else {
                var dateValue = value.substr(4, 8);
            }
            dateValue = $finplex_core.insertStr(dateValue, 6, "/");
            dateValue = $finplex_core.insertStr(dateValue, 4, "/");
            return dateValue;
        });
        // 年月日に変換する
        $.views.helpers("toDateYYYYMMDD", function (value) {
            var formatData=""
            if(value.indexOf("T")>0){
                formatData= value.split("T")[0];
            }
            return formatData;
        });
    }
});

/**
 * @classdesc Finplex用コアクラス
 * @constructor
 */
var FinplexCore = function () {
    //this.ApiUrlRoot = "https://api-dev.finplex.global.fujitsu.com:10443/nexessary/";
    //this.ApiUrlRoot = "https://scutum-t-apimng.jp-east-1.paas.cloud.global.fujitsu.com/nexessary/";

    this.ApiUrlRoot = "https://api.finplex.global.fujitsu.com/nexessary/";
    this.ApiVer = "poc-v1";

    // 富士通開発用
    //this.ApiKey = "yxK3nShB67RsidYovBZPfkneZs0cgkcK"; 

    // ニッセイPoC
    //this.ApiKey = "vIWuALFeG1s1ZvzIGQGQhfQRli7tQlPz"; 

    // POC環境用apikey
    this.ApiKey = "E9nshqqumYoF7yG6QYetsX0EJgJGMor0";

    // ※話題、企業情報のみ
    //this.ApiKey = "BMryM2IZbaL4uxdqpop9fOn08ozaA42F";

};
var $finplex_core = new FinplexCore();

/**
 * APIバージョンを取得します。
 */
FinplexCore.prototype.getApiVer = function () {
    return this.ApiVer;
}

/**
 * テンプレート遅延読込処理
 *
 * @param {String} partName - finplexパーツ名称
 * @param {String} templateName - テンプレート名称
 */
FinplexCore.prototype.lazyGetTemplate = function (partName, templateName) {
    var deferred = $.Deferred();
    var newName = $finplex_utils.formatString('{0}_{1}', partName, templateName);
    if ($.templates[newName]) {
        deferred.resolve();
    } else {
        // テンプレートを読み込んでいない場合は配置ルールに沿った箇所からテンプレートを読み込む
        var filePath = $finplex_utils.formatString('templates/{0}.tmpl.html', templateName);
        $.get({
            url: filePath,
            cache: false
        }).done(function (template) {
            // jsRenderにテンプレート登録を実施
            $.templates(newName, template);
            if ($.templates[newName]) {
                deferred.resolve();
            } else {
                console.log("Script: " + newName + " failed to load");
                deferred.reject();
            }
        })
            .fail(function (data, textStatus, errorThrown) { console.log(data); });
    }
    return deferred.promise();
}

/**
 * finplexパーツ描画処理
 * 
 * @param {Object} arg - 描画オプション partName, targetElementId, options *optionsはそのままパーツへ引き渡し
 */
FinplexCore.prototype.drawPart = function (arg) {

    if (!arg) {
        console.log("arg error");
        return;
    }

    // finplexパーツ用インスタンス名を生成
    var scriptObjectName = $finplex_utils.formatString('$finplex_{0}', arg.partName);

    // finplexパーツ用jsが読込済みか判定
    if (!window[scriptObjectName]) {

        // jsを読み込んでいない場合は配置ルールに沿った箇所からjsを読み込む
        var scriptUrl = $finplex_utils.formatString('parts/{0}/js/parts_{1}.js', arg.partName, arg.partName);
        scriptUrl = $finplex_utils.formatString('assets/_con/js/parts_{1}.js', arg.partName, arg.partName);
        $.getScript(scriptUrl).done(function () {
            // 共通インタフェースのdrawPart実行
            window[scriptObjectName].drawPart(arg.targetElementId, arg.options);
        }).fail(function (data, textStatus, errorThrown) { console.log(data); });

    } else {
        // 共通インタフェースのdrawPart実行
        window[scriptObjectName].drawPart(arg.targetElementId, arg.options);
    }
}

/**
 * Get用共通処理
 * 
 * @param {Object} arg - 取得オプション commandUrl, absoluteUrl, options, funcDone
 * @return {XMLHttpRequest} Get利用のXMLHttpRequestオブジェクト
 */
FinplexCore.prototype.doGet = function (arg) {

    console.log(arg);

    var url;

    // 絶対パス利用判定
    if (arg.absoluteUrl) {
        url = arg.commandUrl;
    } else {
        // 相対パスの場合は環境設定のルートパスとコマンドパスを結合し、apikeyも自動付与
        url = this.ApiUrlRoot + arg.commandUrl;
        url += (url.indexOf("?") == -1 ? "?" : "&") + "apikey=" + this.ApiKey;
    }

    if (!arg["options"]) arg["options"] = [];

    // GET呼び出し
    return $.ajax({
        method: "GET",
        url: url,
        cache: false,
        data: arg.options,
    }).done(arg.funcDone).fail(
        function (data, textStatus, errorThrown) {
            // console.log(data);
            if (arg.funcFail) {
                arg.funcFail(data, textStatus, errorThrown);
            }
        }
    );
}

FinplexCore.prototype.insertStr = function (str, index, insert) {
    return str.slice(0, index) + insert + str.slice(index, str.length);
}

/**
 * intを比較
 */
FinplexCore.prototype.intCompare = function (arg0, arg1) {
    if (arg0 < arg1) return -1;
    return arg0 > arg1 ? 1 : 0;
}