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
/*!-----------------------------------------------------------------
  Name: neXessary - neXessary
  Version: 0.0.0
  Author: fujitsu
  Website: http://fujitsu.com
  Purchase: http://fujitsu.com
  Support: http://fujitsu.com
  License: You must have a valid license purchased only from ThemeForest (the above link) in order to legally use the theme for your project.
  Copyright 2017.
-------------------------------------------------------------------*/
//const DATA_FORMAT = "data:image/png;base64,"
//const IMAGE_FORMAT = "image=";
const IMAGE_FORMAT = "data:image";

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
        out_duration: out_duration
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
var FinplexTopicMulti = function () { };
var $finplex_topic_multi = new FinplexTopicMulti();

/**
 * 
 */
FinplexTopicMulti.prototype.progressTag = [
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
FinplexTopicMulti.prototype.drawPart = function (rootElementId, options) {

    var rootElement = $(rootElementId);
    // var $topics = options.isCardDraw? $('#finplex_topics' + options.conditions[0]):rootElement;

    $.when(
        // 利用テンプレート読込
        // 軽量なため、最初でロード済みにしておく
        $finplex_core.lazyGetTemplate("topic", "topic_list"),
        $finplex_core.lazyGetTemplate("topic", "multi_main"),
        $finplex_core.lazyGetTemplate("topic", "multi_item"),
        $finplex_core.lazyGetTemplate("topic", "multi_listItem")
    ).done(function () {

        var $topics;
        var outputLimit = options.outputLimit ? options.outputLimit : 10;
        var hasPicture = options.hasPicture;

        // 検索結果一覧描画
        rootElement.prepend($.templates.topic_topic_list.render(options));
        conApp.initCards();

        $topics = $('#finplex_topics' + options.conditions[0].id);
        // 検索条件ごとのハコを描画
        $topics.empty();
        $topics.append($finplex_topic_multi.progressTag);

        // // コンテンツ取得API呼び出し
        // $finplex_topic_multi.shuffle = [];
        // $finplex_topic_multi._getContents(options,
        //     function (data, textStatus, jqXHR) {
        //         //console.log(data);

        //         for (var index = 1; index <= 5; index++) {
        //             var topicsId = "finplex_topics" + index;
        //             var $topics = $("#" + topicsId);
        //             var contents = data["contentList" + index];

        //             // リストアイテム描画
        //             //console.log(contents);
        //             if (!contents || contents.length == 0) {
        //                 $topics.empty(); // ローディング表示を消す
        //                 $topics.append('<p class="area-content-label">検索結果がありませんでした</p>');
        //             } else {
        //                 $finplex_topic_multi._drawListItem(rootElement, $topics, contents, options.searchMethod, hasPicture, index);
        //                 // shuffle js
        //                 var Shuffle = window.shuffle;
        //                 var element = document.getElementById(topicsId);
        //                 var sizer = element.querySelector('.my-sizer-element');

        //                 $finplex_topic_multi.shuffle = new Shuffle(element, {
        //                     itemSelector: '.picture-item',
        //                     sizer: sizer // could also be a selector: '.my-sizer-element'
        //                 });
        //             }
        //         }
        //     },
        //     function (data, textStatus, jqXHR) {
        //         for (var index = 1; index <= 5; index++) {
        //             var topicsId = "finplex_topics" + index;
        //             var $topics = $("#" + topicsId);
        //             $topics.empty(); // ローディング表示を消す
        //             $topics.append('<p class="area-content-label">読み込みエラー</p>');
        //         }
        //     }
        // );

        //var topicsId = "finplex_topics" + "1";
        //var $topics = $("#" + topicsId);
        //var $topics = rootElement;
        $topics.empty();
        $topics.append($finplex_topic_multi.progressTag);

        // コンテンツ取得API呼び出し
        //$finplex_topic_multi.shuffle = [];
        $finplex_topic_multi._getContents(options,
            function (data, textStatus, jqXHR) {
                if(options.isFirstSearch){
                }else{
                }

                var contents = [];

                //リストアイテムのマージ
                for (var index = 1; index <= 5; index++) {
                    //リストアイテムに対応するキーワードを保持。後の絞り込み処理に使用。
                    for(var i = 0;i < data["contentList" + index].length;i++){
                        data["contentList" + index][i].keyNum = index;
                    }
                    Array.prototype.push.apply(contents,data["contentList" + index]);
                }

                //リストアイテムのソート（日付降順）
                contents.sort(function(a,b){
                    if(a.date > b.date) return -1;
                    if(a.date < b.date) return 1;
                    return 0;
                });

                // リストアイテム描画
                //console.log(contents);
                if (!contents || contents.length == 0) {
                    $topics.empty(); // ローディング表示を消す
                    $topics.append('<p class="area-content-label">検索結果がありませんでした</p>');
                } else {

                    $finplex_topic_multi._drawListItem(rootElement, $topics, contents, options.searchMethod, hasPicture, index);
                    
                    var Shuffle = window.shuffle;
                    var element = $topics[0];

                    $finplex_topic_multi.shuffle = new Shuffle(element, {
                        itemSelector: '.picture-item'
                    });
                    //話題のワードの一覧を表示する
                    var $trendWordsArea = $('<div id="trendWordsArea" style="line-height:30px;">話題のワード<div>');
                    for(var i = 0;i<options.conditions.length;i++){
                        var $key = $('<div class="btn btn-small btn-rounded" style="margin-right:4px;padding-left:10px;padding-right:10px;">' +
                                    options.conditions[i].keyword +
                                    '</div>'
                                    );
                        
                        //話題のワード押下で、紐づいたリストアイテムだけを表示する
                        $key.attr('id','keyword' + (i + 1));
                        $key.click(function(){
                            if(0 == $('#trendWordsArea').find('.btn-inactive').length || $(this).hasClass('btn-inactive')){
                            
                                $('#trendWordsArea').find('.btn').removeClass('btn-inactive');
                                $('#trendWordsArea').find('.btn').not(this).addClass('btn-inactive');
                                // $('#results_content_box').find('figure').hide();
                                // $('#results_content_box').find('.' + $(this).attr('id')).show(200);
                                $('#keywordCancel').show();

                                $finplex_topic_multi.shuffle.filter($(this).attr('id'));
                            }
                            
                        });
                        
                        if(i == options.conditions.length - 1){
                            $key.css("margin-right","14px");
                        }

                        $trendWordsArea.append($key);
                    }
                    //絞り込み時に「すべて表示」ボタンを表示
                    var $keyCancel = $('<div id="keywordCancel" class="btn btn-small btn-rounded btn-important" style="padding-left:10px;padding-right:10px;">' +
                                        'すべて表示' +
                                        '</div>'
                                    );
                    $keyCancel.hide();
                    $keyCancel.click(function(){
                        $('#trendWordsArea').find('.btn').removeClass('btn-inactive');
                        //$('#results_content_box').find('figure').show(200);
                        $(this).hide();
                        
                        $finplex_topic_multi.shuffle.filter();
                    });
                    $trendWordsArea.append($keyCancel);

                    //話題表示欄最上部に話題のキーワードを表示
                    $topics.before($trendWordsArea);
                    
                    // $finplex_topic_multi.shuffle[index] = new Shuffle(element, {
                    //     itemSelector: '.picture-item'
                    // });
                }
            },
            function (data, textStatus, jqXHR) {
                //var topicsId = "finplex_topics" + "1";
                //var $topics = $("#" + topicsId);
                $topics.empty(); // ローディング表示を消す
                $topics.append('<p class="area-content-label">読み込みエラー</p>');
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
FinplexTopicMulti.prototype._resizeModalDialog = function (dialogSelector) {

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
FinplexTopicMulti.prototype._onListItemClicked = function (rootElement, listItemContent, item, searchMethod) {

    // overlayをにデータを書き出す
    var overlay = $('#modal_content_box');
    overlay.empty(); // 初期化
    overlay.append($finplex_topic_multi.progressTag);

    var modal_open_trigger = $("#modal_open_trigger");
    modal_open_trigger.trigger("click");

    // コンテンツ取得API呼び出し
    $finplex_topic_multi._getContent(item.contentCode, 'large',
        function (data) {
            console.log(data);
            // modalContent.empty();
            overlay.empty();
            if (data) {
              
                var itemContent = $($.templates.topic_multi_item.render(data));

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
FinplexTopicMulti.prototype._drawListItem = function (rootElement, targetElement, data, searchMethod, hasPicture, index, funcdone) {

    targetElement.empty();

    // コンテンツ描画
    if (data && 0 < data.length) {
        data.forEach(function (item) {
            
            // if(targetElement.find('.my-sizer-element').length < 1){
            //     targetElement.append($('<div class="my-sizer-element" style="width:22%;margin-left:0px;"></div>'));
            // }
            var listItemContent = $($.templates.topic_multi_listItem.render(item));

            // クリックハンドラ設定
            listItemContent.click(function () {
                $finplex_topic_multi._onListItemClicked(rootElement, listItemContent, item, searchMethod);
            });

            listItemContent.hide();
            targetElement.append(listItemContent);
            listItemContent.fadeIn();

            if (hasPicture) {

                $finplex_topic_multi._getContent(item.contentCode, 'middle',
                    function (data, textStatus, jqXHR) {
                        // 画像描画
                        // console.log(data);
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
                            //listItemContent.find(".topic_figure_photo").append('<div class="aspect__inner" style="background-repeat: no-repeat;background-position: center center;background-image: url(' + DATA_FORMAT + base64Sanitizer(photo) + ')">');
                            listItemContent.find(".topic_figure_photo").append('<div class="aspect__inner" style="background-repeat: no-repeat;background-position: center center;background-image: url(' + photo + ')">');
                        } else {
                            // spinnerを消去
                            listItemContent.find(".topic_figure_photo").remove();
                            // h2クラスを消去
                            listItemContent.removeClass('picture-item--h2');
                        }
                        
                        // 再shuffle
                        //if ($finplex_topic_multi.shuffle[index] && $finplex_topic_multi.shuffle[index].sort) $finplex_topic_multi.shuffle[index].sort();
                        if ($finplex_topic_multi.shuffle && $finplex_topic_multi.shuffle.sort) $finplex_topic_multi.shuffle.sort();
                        
                    },
                    function (data, textStatus, jqXHR) {
                        // spinnerを消去
                        listItemContent.find(".topic_figure_photo").remove();
                        // h2クラスを消去
                        listItemContent.removeClass('picture-item--h2');
                        // 再shuffle
                        //if ($finplex_topic_multi.shuffle[index] && $finplex_topic_multi.shuffle[index].sort) $finplex_topic_multi.shuffle[index].sort();
                        if ($finplex_topic_multi.shuffle && $finplex_topic_multi.shuffle.sort) $finplex_topic_multi.shuffle.sort();
                        
                    }
                );
            } else {
                // spinnerを消去
                listItemContent.find(".topic_figure_photo").remove();
                // h2クラスを消去
                listItemContent.removeClass('picture-item--h2');
                // 再shuffle
                // try {
                //     $finplex_topic_multi.shuffle.sort();
                // } catch (e) {

                // }
                if ($finplex_topic_multi.shuffle && $finplex_topic_multi.shuffle.sort) $finplex_topic_multi.shuffle.sort();                
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
FinplexTopicMulti.prototype._getContents = function (searchCondition, funcDone, funcFail) {
    $finplex_core.doPost({
        commandUrl: $finplex_utils.formatString("communication-activation/{0}/contents/actions/multiSearch", $finplex_core.getApiVer()),
        options: {
            sellerCode: searchCondition.sellerCode,
            outputLimit: searchCondition.outputLimit,
            keyword1: searchCondition.conditions[0] != null ? searchCondition.conditions[0].keyword:'',
            keyword2: searchCondition.conditions[1] != null ? searchCondition.conditions[1].keyword:'',
            keyword3: searchCondition.conditions[2] != null ? searchCondition.conditions[2].keyword:'',
            keyword4: searchCondition.conditions[3] != null ? searchCondition.conditions[3].keyword:'',
            keyword5: searchCondition.conditions[4] != null ? searchCondition.conditions[4].keyword:'',
            category1: searchCondition.conditions[0] != null ? searchCondition.conditions[0].category:'',
            category2: searchCondition.conditions[1] != null ? searchCondition.conditions[1].category:'',
            category3: searchCondition.conditions[2] != null ? searchCondition.conditions[2].category:'',
            category4: searchCondition.conditions[3] != null ? searchCondition.conditions[3].category:'',
            category5: searchCondition.conditions[4] != null ? searchCondition.conditions[4].category:'',
            fields: "title,category,tag",
            photoScale: "none",
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
FinplexTopicMulti.prototype._getContentsByBusinessTypeCode = function (sellerCode, businessTypeCode, outputLimit, funcDone, funcFail) {
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
FinplexTopicMulti.prototype._getContent = function (contentCode, photoScale, funcDone, funcFail) {
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
FinplexTopicMulti.prototype._resizeImage = function (value, callback) {
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