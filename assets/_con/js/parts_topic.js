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
const DATA_FORMAT = "data:image/png;base64,"
const IMAGE_FORMAT = "data:image";
// var reload = true;
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

var base64Sanitizer = function (value) {
    if (value.indexOf(IMAGE_FORMAT) != -1) {
        return value.slice(IMAGE_FORMAT.length);
    } else {
        return value;
    }
}

/**
 * @classdesc Finplex用Topicパーツ用クラス
 * @constructor
 */
var FinplexTopic = function () { };
var $finplex_topic = new FinplexTopic();

/**
 * 
 */
FinplexTopic.prototype.progressTag = [
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

// TODO:別パーツ作成の際に共通インタフェースとして定義し、継承関係を作成する
/**
 * パーツ描画処理
 * 
 * @param {String} rootElementId - 描画対象rootElementのId
 * @param {Object} options - パーツ用オプション設定
 */
FinplexTopic.prototype.drawPart = function (rootElementId, options) {

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
        areaContent.append($finplex_topic.progressTag);

        var outputLimit = options.outputLimit ? options.outputLimit : 10;
        var hasPicture = options.hasPicture;

        if (options.genre) {
            // キーワード検索
            rootElement.find("#topic_name").text($finplex_utils.formatString("話題({0})", options.genre.name));

            var keywords = options.genre.keywords.join(",");
            var iptcCode = options.genre.iptcCode;
            var reload = true;

            // コンテンツ取得API呼び出し
            $finplex_topic._getContents(options.sellerCode, keywords, iptcCode, outputLimit,
                function (data, textStatus, jqXHR) {

                    // リストアイテム描画
                    // console.log(data);
                    $finplex_topic._drawListItem(rootElement, areaContent, data, options.searchMethod, hasPicture);

                    // // shuffle js
                    // var Shuffle = window.shuffle;
                    var element = document.getElementById('area-content');
                    var sizer = element.querySelector('.my-sizer-element');

                    // $finplex_topic.shuffle = new Shuffle(element, {
                    //     itemSelector: '.picture-item',
                    //     sizer: sizer // could also be a selector: '.my-sizer-element'
                    // });

                },
                function (data, textStatus, jqXHR) {
                    // console.log(data)
                    // areaContent.empty();
                    // areaContent.append('<p class="area-content-label">読み込みエラー</p>');
                    if (reload) {

                        // コンテンツ取得API呼び出し
                        $finplex_topic._getContents(options.sellerCode, keywords, iptcCode, outputLimit,
                            function (data, textStatus, jqXHR) {

                                // リストアイテム描画
                                // console.log(data);
                                $finplex_topic._drawListItem(rootElement, areaContent, data, options.searchMethod, hasPicture);

                                // // shuffle js
                                // var Shuffle = window.shuffle;
                                var element = document.getElementById('area-content');
                                var sizer = element.querySelector('.my-sizer-element');

                                // $finplex_topic.shuffle = new Shuffle(element, {
                                //     itemSelector: '.picture-item',
                                //     sizer: sizer // could also be a selector: '.my-sizer-element'
                                // });

                            },
                            function (data, textStatus, jqXHR) {

                                areaContent.empty();
                                areaContent.append('<p class="area-content-label">読み込みエラー</p>');

                            }
                        );
                        reload = false
                    }
                }
            );
        } else {
            // IPTCコード検索
            // コンテンツ取得API呼び出し
            $finplex_topic._getContentsByBusinessTypeCode(options.sellerCode, options.businessTypeCode, outputLimit,
                function (data, textStatus, jqXHR) {

                    // リストアイテム描画
                    // console.log(data);
                    $finplex_topic._drawListItem(rootElement, areaContent, data, options.searchMethod, hasPicture);

                    // shuffle js
                    // var Shuffle = window.shuffle;
                    var element = document.getElementById('area-content');
                    var sizer = element.querySelector('.my-sizer-element');

                    // $finplex_topic.shuffle = new Shuffle(element, {
                    //     itemSelector: '.picture-item',
                    //     sizer: sizer // could also be a selector: '.my-sizer-element'
                    // });

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
FinplexTopic.prototype._resizeModalDialog = function (dialogSelector) {

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
FinplexTopic.prototype._onListItemClicked = function (rootElement, listItemContent, item, searchMethod) {
    // alert(item.contentCode);
    window.location.href = "detailNews.html" + "?contentCode=" + item.contentCode;
}

/**
 * 話題リストアイテム描画処理
 * 
 * @param {Selector} rootElement - ルートセレクタ
 * @param {String} targetElement - 描画対象セレクタ
 * @param {Object} data - リストに描画するTopicObject
 */
FinplexTopic.prototype._drawListItem = function (rootElement, targetElement, data, searchMethod, hasPicture, funcdone) {

    targetElement.empty();

    // コンテンツ描画
    if (data && 0 < data.length) {
        data.forEach(function (item) {
            // console.log("item:", item);
            item["comment1"]="Aさん：9月のNHKのクローズアップ現代で今の状況を放送していたが、「純国産」ということを前面に打ち出したのが、ケチのつきはじめだった・・・";
            item["comment2"]="Bさん：兎に角、2020年の就航開始を実現しないと何も始まらない。MRJ90が就航し、顧客の信頼を獲得出来ればMRJ70や夫々の長距離型等で次への展望も見えて来るかも知れない。"
            var listItemContent = $($.templates.topic_listItem.render(item));

            // クリックハンドラ設定
            // listItemContent.click(function () {
            //     $finplex_topic._onListItemClicked(rootElement, listItemContent, item, searchMethod);
            // });
            // $(".topic_figure_photo").click(function(){
            //     $finplex_topic._onListItemClicked(rootElement, listItemContent, item, searchMethod);
            // });
            // $(".topic_figure_title").click(function(){
            //     $finplex_topic._onListItemClicked(rootElement, listItemContent, item, searchMethod);
            // })
            // ニュースのイメージをクリックする
            listItemContent.find('.topic_figure_photo').click(function () {
                $finplex_topic._onListItemClicked(rootElement, listItemContent, item, searchMethod);
            });
            // ニュースのtitleをクリックする
            listItemContent.find('.topic_figure_title').click(function () {
                $finplex_topic._onListItemClicked(rootElement, listItemContent, item, searchMethod);
            });

            // ニュースのコメントをクリックする
            listItemContent.find('.mdi-communication-message').click(function () {
                $finplex_topic._onListItemClicked(rootElement, listItemContent, item, searchMethod);
            });
            listItemContent.find('.listItemShowCommt').click(function () {
                $finplex_topic._onListItemClicked(rootElement, listItemContent, item, searchMethod);
            });
            listItemContent.hide();
            targetElement.append(listItemContent);
            listItemContent.fadeIn();

            if (hasPicture) {

                $finplex_topic._getContent(item.contentCode, 'middle',
                    function (data, textStatus, jqXHR) {
                        // 画像描画
                        // console.log(data);
                        // 趣味に関連する話題を検索する結果　イメージの表示　修正20180711
                        // var photo;
                        // $.each(data.content, function (i, val) {
                        //     if (val.startsWith(IMAGE_FORMAT)) {
                        //         photo = val;
                        //         return false;
                        //     }
                        // });

                        // if (photo) {
                        //     // aspect__inner

                        //     listItemContent.find(".topic_figure_photo_image").remove();
                        //     listItemContent.find(".topic_figure_photo").append('<div class="aspect__inner" style="background-repeat: no-repeat;background-position: center center;background-image: url(' + DATA_FORMAT + base64Sanitizer(photo) + ')">');
                        // } else {
                        //     // spinnerを消去
                        //     listItemContent.find(".topic_figure_photo").remove();
                        //     // h2クラスを消去
                        //     listItemContent.removeClass('picture-item--h2');
                        // }

                        // 趣味に関連する話題を検索する結果　イメージの表示　修正20180711
                        var contentLen = data.content.length - 1;
                        // 趣味に関連する話題を検索する結果にイメージがある場合
                        if (data.content[contentLen].toString().substr(0, 10) == "data:image") {
                            listItemContent.find(".topic_figure_photo_image").remove();
                            listItemContent.find(".topic_figure_photo").append('<div class="aspect__inner" style="background-repeat: no-repeat;background-position: top center;background-image: url(' + data.content[contentLen] + ');background-size: 100% 100%;">');

                        } else {
                            listItemContent.find(".topic_figure_photo_image").remove();
                            listItemContent.find(".topic_figure_photo").append('<div class="aspect__inner" style="background-size: 100% 100%;background-repeat: no-repeat;background-position: top center;background-image: url(' + "./assets/_con/images/no_image.png" + ');background-size: 100% 100%;">');
                        }

                        // // 再shuffle
                        // $finplex_topic.shuffle.sort();
                    },
                    function (data, textStatus, jqXHR) {
                        // spinnerを消去
                        listItemContent.find(".topic_figure_photo").remove();
                        // h2クラスを消去
                        listItemContent.removeClass('picture-item--h2');
                        // // 再shuffle
                        // try {
                        //     $finplex_topic.shuffle.sort();
                        // } catch (e) {

                        // }
                    }
                );
            } else {
                // spinnerを消去
                listItemContent.find(".topic_figure_photo").remove();
                // h2クラスを消去
                listItemContent.removeClass('picture-item--h2');
                // // 再shuffle
                // try {
                //     $finplex_topic.shuffle.sort();
                // } catch (e) {

                // }
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
FinplexTopic.prototype._getContents = function (sellerCode, keyword, iptcCode, outputLimit, funcDone, funcFail) {
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
FinplexTopic.prototype._getContentsByBusinessTypeCode = function (sellerCode, businessTypeCode, outputLimit, funcDone, funcFail) {
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
FinplexTopic.prototype._getContent = function (contentCode, photoScale, funcDone, funcFail) {
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

/* 画像リサイズメソッド（作成中だが、使用しなくなった20170427）
FinplexTopic.prototype._resizeImage = function (value, callback) {
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