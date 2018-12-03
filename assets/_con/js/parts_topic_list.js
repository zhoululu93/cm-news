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
        // topicのphotoがbase64で送信されてくるが、プレフィックスにimage=が含まれているため、いったん除外処理を記載。後に置き場を検討
        $.views.converters("base64Sanitizer2", $finplex_topic_list.base64Sanitizer2);
    }

    // topicのlernmodalを設定する
    var trigger2 = $("#modal_open_trigger2");
    var dismissible = trigger2.attr('data-dismissible') || true;
    var opacity = trigger2.attr('data-opacity') || 0.5;
    var in_duration = trigger2.attr('data-induration') || 300;
    var out_duration = trigger2.attr('data-outduration') || 300;

    trigger2.leanModal({
        dismissible: dismissible,
        opacity: opacity,
        in_duration: in_duration,
        out_duration: out_duration,
        closeButton: ".modal_close"
    });

});

/**
 * @classdesc Finplex用Topicパーツ用クラス
 * @constructor
 */
var FinplexTopicList = function () { };
var $finplex_topic_list = new FinplexTopicList();

FinplexTopicList.prototype.progressTag = [
    '<tr><td colspan="6">',
    '<div class="area-content-label"><p>リストローディング中...</p>',
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
    '</div>',
    '</td></tr>'
].join("");

FinplexTopicList.prototype.progressTag2 = [
    '<div class="area-content-label"><p class="area-content-label">ローディング中...</p>',
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

// TODO:別パーツ作成の際に共通インタフェースとして定義し、継承関係を作成する
/**
 * パーツ描画処理
 * 
 * @param {String} rootElementId - 描画対象rootElementのId
 * @param {Object} options - パーツ用オプション設定
 */
FinplexTopicList.prototype.drawPart = function (rootElementId, options) {

    var rootElement = $("#" + rootElementId);

    $.when(
        // 利用テンプレート読込
        // 軽量なため、最初でロード済みにしておく
        $finplex_core.lazyGetTemplate("topic_list", "main_list"),
        $finplex_core.lazyGetTemplate("topic_list", "item_list"),
        $finplex_core.lazyGetTemplate("topic_list", "listItem_list")
    ).done(function () {

        // メインパーツ描画
        rootElement.append($.templates.topic_list_main_list.render());

        // タイトル設定
        rootElement.find("#topic_name").text($finplex_utils.formatString("話題({0})", options.genre.name));

        // 記事一覧初期化
        var areaContentId = "area-content";
        var areaContent = rootElement.find("#" + areaContentId);
        areaContent.empty();
        areaContent.append($finplex_topic_list.progressTag);

        var keywords = options.genre.keywords.join(",");
        var iptcCode = options.genre.iptcCode;
        var outputLimit = options.outputLimit ? options.outputLimit : 10;
        var hasPicture = options.hasPicture;

        // コンテンツ取得API呼び出し
        $finplex_topic_list._getContents(options.sellerCode, keywords, iptcCode, outputLimit,
            function (data, textStatus, jqXHR) {
                // リストアイテム描画
                // console.log(data);

                //dataTable
                $finplex_topic_list._drawListItem(rootElement, areaContent, data, options.searchMethod, hasPicture);
                $("#topic_table").dataTable({
                    "bFilter": false,
                    "bInfo": false,
                    "bLengthChange": false,
                    "aoColumnDefs": [
                        { "bSortable": false, "aTargets": [4] }
                    ],
                    "aaSorting": [[0, "desc"]],
                    "bPaginate": false,
                });
            },
            function (data, textStatus, jqXHR) {
                areaContent.empty();
                areaContent.append('<tr><td colspan="6"><p class="area-content-label">読み込みエラー</p></td></tr>');
            }
        );
    });
}

// TODO:モーダル処理共通化にあわせて移動を検討
/**
 * モーダルダイアログ表示位置調整処理
 * 
 * @param {Selector} dialogSelector - モーダルダイアログセレクタ
 */
FinplexTopicList.prototype._resizeModalDialog = function (dialogSelector) {

    // TOPウィンドウの横幅、高さを取得
    var w = $(window.top).width();
    var h = $(window.top).height();

    // モーダルコンテンツの表示位置を取得
    var x = (w - dialogSelector.outerWidth(true)) / 2;
    var y = (h - dialogSelector.outerHeight(true)) / 2;

    // モーダルコンテンツの表示位置を設定
    dialogSelector.css({ 'left': x + 'px', 'top': y + 'px' });

}

/**
 * 話題リストアイテムクリック時イベントハンドラ
 * 
 * @param {Selector} rootElement - ルートセレクタ
 * @param {Selector} listItemContent - リストアイテムのセレクタ
 * @param {Object} item - リストに利用されているTopicObject
 * @param {method} searchMethod - 検索メソッド
 */
FinplexTopicList.prototype._onListItemClicked = function (rootElement, listItemContent, item, searchMethod) {

    // overlayをにデータを書き出す
    var overlay = $('#modal_content_box');
    overlay.empty(); // 初期化
    overlay.append($finplex_topic_list.progressTag2);

    var modal_open_trigger = $("#modal_open_trigger2");
    modal_open_trigger.trigger("click");

    // コンテンツ取得API呼び出し
    $finplex_topic_list._getContent(item.contentCode, 'large',
        function (data) {
            console.log(data);
            // modalContent.empty();
            overlay.empty();
            if (data) {
                var itemContent = $($.templates.topic_list_item_list.render(data));

                // タグアイテムクリック時イベント
                itemContent.find(".topic-tag").click(function () {
                    searchMethod($(this)[0].innerText);
                });

                itemContent.hide();
                // modalContent.append(itemContent);
                overlay.append(itemContent);
                itemContent.fadeIn('fast');
            } else {
                overlay.append($('<p class="area-content-label">検索結果がありませんでした<p>'));
            }
        },
        function (data, textStatus, jqXHR) {
            overlay.empty();
            overlay.append('<p class="area-content-label">読み込みエラー</p>');
        }
    );

}

/**
 * 話題リストアイテム描画処理
 * 
 * @param {Selector} rootElement - ルートセレクタ
 * @param {String} targetElement - 描画対象セレクタ
 * @param {Object} data - リストに描画するTopicObject
 */
FinplexTopicList.prototype._drawListItem = function (rootElement, targetElement, data, searchMethod, hasPicture) {

    targetElement.empty();

    // コンテンツ描画
    if (data && 0 < data.length) {
        data.forEach(function (item) {
            var listItemContent = $($.templates.topic_list_listItem_list.render(item));

            // クリックハンドラ設定
            listItemContent.click(function () {
                $finplex_topic_list._onListItemClicked(rootElement, listItemContent, item, searchMethod);
            });

            listItemContent.hide();
            targetElement.append(listItemContent);
            listItemContent.fadeIn();

            if (hasPicture) {
                $finplex_topic_list._getContent(item.contentCode, 'middle',
                    function (data, textStatus, jqXHR) {
                        // 画像描画
                        console.log(data);
                        var photo;
                        $.each(data.content, function (i, val) {
                            if (val.startsWith(IMAGE_FORMAT)) {
                                photo = val;
                                return false;
                            }
                        });

                        var $photo_cell = listItemContent.find(".photo_cell");
                        $photo_cell.empty();
                        if (photo) {
                            $photo_cell.append('<img class="small_image" src="' + DATA_FORMAT + base64Sanitizer(photo) + '" />');
                        }
                    },
                    function (data, textStatus, jqXHR) {
                        var $photo_cell = listItemContent.find(".photo_cell");
                        $photo_cell.empty();
                    });
            } else {
                var $photo_cell = listItemContent.find(".photo_cell");
                $photo_cell.empty();
            }
        });

    } else {
        targetElement.append($('<tr><td colspan="6"><p class="area-content-label">検索結果がありませんでした<p></td></tr>'));
    }
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
FinplexTopicList.prototype._getContents = function (sellerCode, keyword, iptcCode, outputLimit, funcDone, funcFail) {
    $finplex_core.doGet({
        commandUrl: $finplex_utils.formatString("communication-activation/{0}/contents", $finplex_core.getApiVer()),
        options: {
            sellerCode: sellerCode,
            // fields: "title,summary,category,tag",
            fields: "title,category,tag",
            keyword: keyword,
            outputLimit: outputLimit,
            photoScale: "none",
            iptcCode: iptcCode
        },
        funcDone: funcDone,
        funcFail: funcFail,
    });
}

/**
 * 話題取得API呼び出し処理
 * 
 * @param {String} contentCode - ContentCode
 * @param {String} photoScale - 画像サイズ 'middle', 'large'
 * @param {function} funcDone - 読込完了時コールバック
 * @param {function} funcFail - 読込エラー時コールバック
 */
FinplexTopicList.prototype._getContent = function (contentCode, photoScale, funcDone, funcFail) {
    return $finplex_core.doGet({
        commandUrl: $finplex_utils.formatString("communication-activation/{0}/contents/{1}", $finplex_core.getApiVer(), contentCode),
        options: {
            fields: "title,content,category,tag",
            photoScale: photoScale
        },
        funcDone: funcDone,
        funcFail: funcFail,
    });
}

FinplexTopicList.prototype.base64Sanitizer = function (value) {
    const DATA_FORMAT2 = "data:image/png;base64,"
    const IMAGE_FORMAT2 = "data:image";

    if (value.indexOf(IMAGE_FORMAT2) != -1) {
        return value.slice(IMAGE_FORMAT2.length);
    } else {
        return value;
    }
}