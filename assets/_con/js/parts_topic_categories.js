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
        $.views.converters("base64Sanitizer", base64Sanitizer);
    }

    // topicのlernmodalを設定する
    var trigger = $("#modal_open_trigger");
    var dismissible = trigger.attr('data-dismissible') || true;
    var opacity = trigger.attr('data-opacity') || 0.5;
    var in_duration = trigger.attr('data-induration') || 300;
    var out_duration = trigger.attr('data-outduration') || 300;

    trigger.leanModal({
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
var FinplexTopicCategories = function () {
    this.iptcCategories = null;
};

var $finplex_topic_categories = new FinplexTopicCategories();

/**
 * 
 */
FinplexTopicCategories.prototype.progressTag = [
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
 * IPTCカテゴリ情報を取得します。
 * 
 * @param {function(Array)} done 
 */
FinplexTopicCategories.prototype.getIptcCategories = function (done) {
    var $i = this;
    if (!$i.iptcCategories) {
        $.when($i.loadIptcCategories()).done(done);
    } else { done($i.iptcCategories); }
};

FinplexTopicCategories.prototype.loadIptcCategories = function () {
    const file = "./data/iptccategories.json";
    var $i = this;
    var returnValue;
    $.getJSON(file, function (jsonData) {
        returnValue = jsonData.filter(function (index, elem) { return elem.default }).sort($i.sortCategories);
    });
    return returnValue;
}

/**
 * カテゴリをソートするための判定function
 * jsrenderで利用する
 */
FinplexTopicCategories.prototype.sortCategories = function (arg0, arg1) {
    return $finplex_core.intCompare(arg0.sortNumber, arg1.sortNumber);
}

/**
 * パーツ描画処理
 * 
 * @param {String} rootElementId - 描画対象rootElementのId
 * @param {Object} options - パーツ用オプション設定
 */
FinplexTopicCategories.prototype.drawPart = function (rootElementId, options) {

    var rootElement = $("#" + rootElementId);

    $.when(
        // 利用テンプレート読込
        // 軽量なため、最初でロード済みにしておく
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
        areaContent.append($finplex_topic_categories.progressTag);

        var outputLimit = options.outputLimit ? options.outputLimit : 10;
        var hasPicture = options.hasPicture;

        if (options.genre) {
            // キーワード検索
            rootElement.find("#topic_name").text($finplex_utils.formatString("話題({0})", options.genre.name));

            var keywords = options.genre.keywords.join(",");
            var iptcCode = options.genre.iptcCode;

            // コンテンツ取得API呼び出し
            $finplex_topic_categories._getContents(options.sellerCode, keywords, iptcCode, outputLimit,
                function (data, textStatus, jqXHR) {

                    // リストアイテム描画
                    console.log(data);
                    $finplex_topic_categories._drawListItem(rootElement, areaContent, data, options.searchMethod, hasPicture);

                    // shuffle js
                    var Shuffle = window.shuffle;
                    var element = document.getElementById('area-content');
                    var sizer = element.querySelector('.my-sizer-element');

                    $finplex_topic_categories.shuffle = new Shuffle(element, {
                        itemSelector: '.picture-item',
                        sizer: sizer // could also be a selector: '.my-sizer-element'
                    });

                },
                function (data, textStatus, jqXHR) {
                    areaContent.empty();
                    areaContent.append('<p class="area-content-label">読み込みエラー</p>');
                }
            );
        } else {
            // IPTCコード検索
            // コンテンツ取得API呼び出し
            $finplex_topic_categories._getContentsByBusinessTypeCode(options.sellerCode, options.businessTypeCode, outputLimit,
                function (data, textStatus, jqXHR) {

                    // リストアイテム描画
                    console.log(data);
                    $finplex_topic_categories._drawListItem(rootElement, areaContent, data, options.searchMethod, hasPicture);

                    // shuffle js
                    var Shuffle = window.shuffle;
                    var element = document.getElementById('area-content');
                    var sizer = element.querySelector('.my-sizer-element');

                    $finplex_topic_categories.shuffle = new Shuffle(element, {
                        itemSelector: '.picture-item',
                        sizer: sizer // could also be a selector: '.my-sizer-element'
                    });

                },
                function (data, textStatus, jqXHR) {
                    areaContent.empty();
                    areaContent.append('<p class="area-content-label">読み込みエラー</p>');
                }
            );

        }

    });
}

// TODO:モーダル処理共通化にあわせて移動を検討
/**
 * モーダルダイアログ表示位置調整処理
 * 
 * @param {Selector} dialogSelector - モーダルダイアログセレクタ
 */
FinplexTopicCategories.prototype._resizeModalDialog = function (dialogSelector) {

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
FinplexTopicCategories.prototype._onListItemClicked = function (rootElement, listItemContent, item, searchMethod) {

    // overlayをにデータを書き出す
    var overlay = $('#modal_content_box');
    overlay.empty(); // 初期化
    overlay.append($finplex_topic_categories.progressTag);

    var modal_open_trigger = $("#modal_open_trigger");
    modal_open_trigger.trigger("click");

    // コンテンツ取得API呼び出し
    $finplex_topic_categories._getContent(item.contentCode, 'large',
        function (data) {
            console.log(data);
            // modalContent.empty();
            overlay.empty();
            if (data) {
                var itemContent = $($.templates.topic_item.render(data));

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
FinplexTopicCategories.prototype._drawListItem = function (rootElement, targetElement, data, searchMethod, hasPicture, funcdone) {

    targetElement.empty();

    // コンテンツ描画
    if (data && 0 < data.length) {
        data.forEach(function (item) {
            var listItemContent = $($.templates.topic_listItem.render(item));

            // クリックハンドラ設定
            listItemContent.click(function () {
                $finplex_topic_categories._onListItemClicked(rootElement, listItemContent, item, searchMethod);
            });

            listItemContent.hide();
            targetElement.append(listItemContent);
            listItemContent.fadeIn();

            if (hasPicture) {

                $finplex_topic_categories._getContent(item.contentCode, 'middle',
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

                        if (photo) {
                            // aspect__inner

                            listItemContent.find(".topic_figure_photo_image").remove();
                            listItemContent.find(".topic_figure_photo").append('<div class="aspect__inner" style="background-repeat: no-repeat;background-position: center center;background-image: url(' + DATA_FORMAT + base64Sanitizer(photo) + ')">');
                        } else {
                            // spinnerを消去
                            listItemContent.find(".topic_figure_photo").remove();
                            // h2クラスを消去
                            listItemContent.removeClass('picture-item--h2');
                        }
                        // 再shuffle
                        $finplex_topic_categories.shuffle.sort();
                    },
                    function (data, textStatus, jqXHR) {
                        // spinnerを消去
                        listItemContent.find(".topic_figure_photo").remove();
                        // h2クラスを消去
                        listItemContent.removeClass('picture-item--h2');
                        // 再shuffle
                        try {
                            $finplex_topic_categories.shuffle.sort();
                        } catch (e) {

                        }
                    }
                );
            } else {
                // spinnerを消去
                listItemContent.find(".topic_figure_photo").remove();
                // h2クラスを消去
                listItemContent.removeClass('picture-item--h2');
                // 再shuffle
                try {
                    $finplex_topic_categories.shuffle.sort();
                } catch (e) {

                }
            }


        });
    } else {
        rootElement.append($('<p class="area-content-label">検索結果がありませんでした<p>'));
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
FinplexTopicCategories.prototype._getContents = function (sellerCode, keyword, iptcCode, outputLimit, funcDone, funcFail) {
    $finplex_core.doGet({
        commandUrl: $finplex_utils.formatString("communication-activation/{0}/contents", $finplex_core.getApiVer()),
        options: {
            sellerCode: sellerCode,
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
 * 話題一覧取得API呼び出し処理
 * 
 * @param {String} sellerCode - SellerCode
 * @param {String} keyword - 検索キーワード(カンマ区切り)
 * @param {int} outputLimit - 上限件数
 * @param {function} funcDone - 読込完了時コールバック
 * @param {function} funcFail - 読込エラー時コールバック
 */
FinplexTopicCategories.prototype._getContentsByBusinessTypeCode = function (sellerCode, businessTypeCode, outputLimit, funcDone, funcFail) {
    $finplex_core.doGet({
        //absoluteUrl: true,
        //commandUrl: $finplex_utils.formatString("http://13.78.88.185:8080/h-cr-outer/v1/communicationContents"),
        commandUrl: $finplex_utils.formatString("company-profile/{0}/communicationContents", $finplex_core.getApiVer()),
        options: {
            sellerCode: sellerCode,
            fields: "title,category,tag",
            businessTypeCode: businessTypeCode,
            outputLimit: outputLimit,
            photoScale: "none",
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
FinplexTopicCategories.prototype._getContent = function (contentCode, photoScale, funcDone, funcFail) {
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

FinplexTopicCategories.prototype.base64Sanitizer = function (value) {
    const DATA_FORMAT = "data:image/png;base64,"
    const IMAGE_FORMAT = "image";

    if (value.indexOf(IMAGE_FORMAT) != -1) {
        return value.slice(IMAGE_FORMAT.length);
    } else {
        return value;
    }
}


/* 画像リサイズメソッド（作成中だが、使用しなくなった20170427）
FinplexTopicCategories.prototype._resizeImage = function (value, callback) {
    if (!value) {
        callback(null);
        return;
    }
    var base64image = DATA_FORMAT + base64Sanitizer(value);

    const MIN_WIDTH = 372;
    const MIN_HEIGHT = 196;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = function (event) {
        var dstWidth, dstHeight;
        dstWidth = MIN_WIDTH;
        dstHeight = MIN_HEIGHT;

        if (this.width > this.height) {
            // 横長の画像
            cvsWidth = MIN_WIDTH;
            cvsHeight = MIN_HEIGHT;
        } else {
            // 縦長の画像
            cvsWidth = MIN_WIDTH;
            cvsHeight = MIN_HEIGHT;
        }

        canvas.width = cvsWidth;
        canvas.height = cvsHeight;

        var sourceX = (dstWidth - cvsWidth) / 2;
        var sourceY = (dstHeight - cvsHeight) / 2;

        ctx.drawImage(this, sourceX, sourceY, cvsWidth, cvsHeight, 0, 0, dstWidth, dstHeight);
        var newBase64Image = canvas.toDataURL();
        newBase64Image = newBase64Image.replace(DATA_FORMAT, IMAGE_FORMAT)
        callback(newBase64Image);
    };
    image.src = base64image;
}
*/