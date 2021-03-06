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
 * @classdesc Finplex用Topicパーツ用クラス
 * @constructor
 */
var FinplexCompanyProfile = function () { };
var $finplex_company_profile = new FinplexCompanyProfile();

/**
 * 読み込み中アイテムタグ
 */
FinplexCompanyProfile.prototype.progressTag = [
    '<div class="area-content-label"><p>ローディング中...</p>',
    '<div class="preloader-wrapper active" >',
    '  <div class="spinner-layer spinner-blue">',
    '    <div class="circle-clipper left">',
    '      <div class="circle"></div>',
    '    </div><div class="gap-patch">',
    '      <div class="circle"></div>',
    '    </div><div class="circle-clipper right">',
    '      <div class="circle"></div>',
    '    </div>',
    '  </div>',
    ' ',
    '  <div class="spinner-layer spinner-red">',
    '    <div class="circle-clipper left">',
    '      <div class="circle"></div>',
    '    </div><div class="gap-patch">',
    '      <div class="circle"></div>',
    '    </div><div class="circle-clipper right">',
    '      <div class="circle"></div>',
    '    </div>',
    '  </div>',
    ' ',
    '  <div class="spinner-layer spinner-yellow">',
    '    <div class="circle-clipper left">',
    '      <div class="circle"></div>',
    '    </div><div class="gap-patch">',
    '      <div class="circle"></div>',
    '    </div><div class="circle-clipper right">',
    '      <div class="circle"></div>',
    '    </div>',
    '  </div>',
    ' ',
    '  <div class="spinner-layer spinner-green">',
    '    <div class="circle-clipper left">',
    '      <div class="circle"></div>',
    '    </div><div class="gap-patch">',
    '      <div class="circle"></div>',
    '    </div><div class="circle-clipper right">',
    '      <div class="circle"></div>',
    '    </div>',
    '  </div>',
    '</div>',
    '</div>'
].join("");

/**
 * パーツ描画処理
 * 
 * @param {String} rootElementId - 描画対象rootElementのId
 * @param {Object} searchCondition - パーツ用オプション設定
 */
FinplexCompanyProfile.prototype.drawPart = function (rootElementId, searchCondition) {

    var rootElement = $("." + rootElementId);

    $.when(
        // 利用テンプレート読込
        // 軽量なため、最初でロード済みにしておく
        $finplex_core.lazyGetTemplate("cr", "cr_list"),
        $finplex_core.lazyGetTemplate("cr", "cr_list_item")
    ).done(function () {

        // メインパーツ描画
        rootElement.empty();
        rootElement.append($.templates.cr_cr_list.render());
        // 検索結果親オブジェクト
        var crList = rootElement;
        // 検索結果一覧初期化
        var crListBody = rootElement.find(".cr_list_body");
        crListBody.empty();
        crListBody.append('<tr><td colspan="9">' + $finplex_company_profile.progressTag + '</td></tr>');
        // 検索条件保存
        var storage = localStorage;
        storage.setItem("cr_search_condition", JSON.stringify(searchCondition));

        // コンテンツ取得API呼び出し
        $finplex_company_profile._getList(searchCondition,
            function (data, textStatus, jqXHR) {
                // リストアイテム描画
                console.log(data);
                storage.setItem("cr_search_result", JSON.stringify(data));

                $finplex_company_profile.drawTable(crList, crListBody);
            },
            function (data, textStatus, jqXHR) {
                crList.empty();
                crList.append('<p class="area-content-label align-left">エラーが発生しました。<pre style="font-family:メイリオ;">' + JSON.stringify(data.responseJSON, null, '\t') + '</pre></p>');
            }
        );
    });
}

FinplexCompanyProfile.prototype.drawTable = function (crList, crListBody) {
    var data = JSON.parse(localStorage.getItem('cr_search_result'));
    if (!data) return;
    $finplex_company_profile._drawListItem(crList, crListBody, data);
    if (data.hitCount == 0) return;
    $("#companies_table").dataTable({
        "bFilter": false,
        "bInfo": false,
        "bLengthChange": false,
        "aoColumnDefs": [{
            "bSortable": false,
            "aTargets": [4]
        }],
        "aaSorting": [
            [0, "desc"]
        ],
        "bPaginate": false,
    });
}

FinplexCompanyProfile.prototype.drawItem = function (rootElementId, templateName, funcDone) {
    var rootElement = $("." + rootElementId);
    $.when(
        // 利用テンプレート読込
        // 軽量なため、最初でロード済みにしておく
        $finplex_core.lazyGetTemplate("cr", "cr_item1"),
        $finplex_core.lazyGetTemplate("cr", "cr_item2"),
        $finplex_core.lazyGetTemplate("cr", "cr_item3"),
        $finplex_core.lazyGetTemplate("cr", "cr_item4"),
        $finplex_core.lazyGetTemplate("cr", "cr_item5"),
        $finplex_core.lazyGetTemplate("cr", "cr_item6")
    ).done(function () {

        rootElement.empty();
        rootElement.append($finplex_company_profile.progressTag);

        var storage = localStorage;
        var today = new Date();
        // 会社情報をセット
        var companyCode = localStorage.getItem('cr_company_code');
        var companyData = JSON.parse(localStorage.getItem('cr_company_data'));
        var companyDataExpired = localStorage.getItem('cr_company_data_expired');
        var needData = false;

        if (!companyData) needData = true;
        if (companyDataExpired && companyDataExpired < today.getTime()) needData = true;
        if (needData) {
            // コンテンツ取得API呼び出し
            // /profiles/{companyCode}
            $finplex_company_profile._getProfile(companyCode,
                function (data, textStatus, jqXHR) {
                    companyData = data;
                    companyDataExpired = today.getTime() + 3600000;

                    // リストアイテム描画
                    console.log(companyData);
                    $finplex_company_profile._drawItem(rootElement, companyData, templateName, funcDone);

                    storage.setItem("cr_company_data", JSON.stringify(companyData));
                    storage.setItem("cr_company_data_expired", companyDataExpired);
                },
                function (data, textStatus, jqXHR) {
                    rootElement.empty();
                    rootElement.append('<p class="area-content-label">読み込みエラー</p>');

                    storage.setItem("cr_company_data", undefined);
                    storage.setItem("cr_company_data_expired", undefined);
                }
            );
        } else {
            // render companyData
            $finplex_company_profile._drawItem(rootElement, companyData, templateName, funcDone);
        }
    });

}

FinplexCompanyProfile.prototype.drawCommunicationContents = function (rootElementId, templateName, funcDone) {
    var rootElement = $("." + rootElementId);
    $.when(
        // 利用テンプレート読込
        $finplex_core.lazyGetTemplate("topic", "main"),
        $finplex_core.lazyGetTemplate("topic", "item"),
        $finplex_core.lazyGetTemplate("topic", "listItem")
    ).done(function () {

        // メインパーツ描画
        rootElement.append($.templates.topic_main.render());

        // 記事一覧初期化
        var areaContentId = "area-content";
        var areaContent = rootElement.find("#" + areaContentId);
        areaContent.empty();
        areaContent.append($finplex_topic.progressTag);

        var outputLimit = options.outputLimit ? options.outputLimit : 10;
        var hasPicture = options.hasPicture;

        // コンテンツ取得API呼び出し
        $finplex_company_profile._getContents(options.sellerCode, companyData, outputLimit, iptc,
            function (data, textStatus, jqXHR) {

                // リストアイテム描画
                console.log(data);
                $finplex_topic._drawListItem(rootElement, areaContent, data, options.searchMethod);

                // shuffle js
                var Shuffle = window.shuffle;
                var element = document.getElementById('area-content');
                var sizer = element.querySelector('.my-sizer-element');

                $finplex_topic.shuffle = new Shuffle(element, {
                    itemSelector: '.picture-item',
                    sizer: sizer // could also be a selector: '.my-sizer-element'
                });

            },
            function (data, textStatus, jqXHR) {
                areaContent.empty();
                areaContent.append('<p class="area-content-label">読み込みエラー</p>');
            }
        );
    });

}

/**
 * 話題一覧取得API呼び出し処理
 * 
 * @param {String} sellerCode - SellerCode
 * @param {String} keyword - 検索キーワード(カンマ区切り)
 * @param {int} outputLimit - 上限件数
 * @param {function} funcDone - 読込完了時コールバック
 * @param {function} funcFail - 読込エラー時コールバック
 */
FinplexCompanyProfile.prototype._getContents = function (sellerCode, keyword, outputLimit, iptc, funcDone, funcFail) {
    $finplex_core.doGet({
        commandUrl: $finplex_utils.formatString("communication-activation/v1/contents", $finplex_core.getApiVer()),
        options: {
            sellerCode: sellerCode,
            fields: "title,category,tag",
            keyword: keyword,
            outputLimit: outputLimit,
            iptc: iptc,
            photoScale: "none",
        },
        funcDone: funcDone,
        funcFail: funcFail,
    });
}

/**
 * 企業リストアイテムクリック時イベントハンドラ
 * 
 * @param {Selector} rootElement - ルートセレクタ
 * @param {Selector} listItemContent - リストアイテムのセレクタ
 * @param {Object} item - リストに利用されているTopicObject
 * @param {method} searchMethod - 検索メソッド
 */
FinplexCompanyProfile.prototype._onListItemClicked = function (rootElement, listItemContent, item, searchMethod) {

    var company_code = listItemContent.find(".cr_list_link").attr('company_code');
    var storage = localStorage;
    storage.setItem("cr_company_code", company_code);
    storage.removeItem("cr_company_data");
    storage.removeItem("cr_company_data_expired");
}

/**
 * 企業リストアイテム描画処理
 * 
 * @param {Selector} rootElement - ルートセレクタ
 * @param {String} targetElement - 描画対象セレクタ
 * @param {Object} data - リストに描画するTopicObject
 */
FinplexCompanyProfile.prototype._drawListItem = function (rootElement, targetElement, data) {

    targetElement.empty();
    var companyList = data.companyList;
    // コンテンツ描画
    if (companyList && 0 < companyList.length) {
        companyList.forEach(function (company) {
            var listItemContent = $($.templates.cr_cr_list_item.render(company));

            // クリックハンドラ設定
            listItemContent.find(".cr_list_link").click(function () {
                $finplex_company_profile._onListItemClicked(rootElement, listItemContent, company);
            });

            listItemContent.hide();
            targetElement.append(listItemContent);
            listItemContent.fadeIn();
        });
    } else {
        targetElement.append($('<tr><td colspan="9"><p class="area-content-label">検索結果がありませんでした</p></td></tr>'));
    }
}

/**
 * 企業アイテム描画処理
 * 
 * @param {Selector} rootElement - ルートセレクタ
 * @param {Object} data - リストに描画するTopicObject
 */
FinplexCompanyProfile.prototype._drawItem = function (rootElement, data, templateName, funcDone) {
    rootElement.empty();
    // コンテンツ描画
    if (data) {
        var listItemContent = $($.templates["cr_" + templateName].render(data));
        listItemContent.hide();
        rootElement.append(listItemContent);
        listItemContent.fadeIn(funcDone);
    } else {
        rootElement.append($('<p class="area-content-label">検索結果がありませんでした<p>'));
    }
}

/**
 * 企業一覧取得API呼び出し処理
 * 
 * @param {String} sellerCode - SellerCode
 * @param {Object} searchCondition - 検索条件
 * @param {function} funcDone - 読込完了時コールバック
 * @param {function} funcFail - 読込エラー時コールバック
 */
FinplexCompanyProfile.prototype._getList = function (searchCondition, funcDone, funcFail) {

    /* デバッグ用URLを絶対指定しているので後で修正する */
    $finplex_core.doGet({
        absoluteUrl: true,
        //commandUrl: "http://13.78.88.185:8080/h-cr-outer/v1/profiles/list/",
        commandUrl: "https://demo.finplex.global.fujitsu.com/h-cr-inner/profiles/list/",
        //commandUrl: $finplex_utils.formatString("company-profile/{0}/profiles/list/", $finplex_core.getApiVer()),
        options: searchCondition,
        funcDone: funcDone,
        funcFail: funcFail,
    });
}

/**
 * 企業情報取得API呼び出し処理
 * 
 * @param {String} companyCode - companyCode
 * @param {function} funcDone - 読込完了時コールバック
 * @param {function} funcFail - 読込エラー時コールバック
 */
FinplexCompanyProfile.prototype._getProfile = function (companyCode, funcDone, funcFail) {

    /* デバッグ用URLを絶対指定しているので後で修正する */
    return $finplex_core.doGet({
        absoluteUrl: true,
        //commandUrl: $finplex_utils.formatString("http://13.78.88.185:8080/h-cr-outer/v1/profiles/{0}", companyCode),
        commandUrl: $finplex_utils.formatString("https://demo.finplex.global.fujitsu.com/h-cr-inner/profiles/{0}", companyCode),
        //commandUrl: $finplex_utils.formatString("company-profile/{0}/profiles/{1}", $finplex_core.getApiVer(), companyCode),
        funcDone: funcDone,
        funcFail: funcFail,
    });
}