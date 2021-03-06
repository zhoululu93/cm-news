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
 * @classdesc FinplexRelation
 * @constructor
 */
var FinplexRelation = function () {
    this.nodesize = 80;
    this.typeColors = [
        "#B2DFDB", // 営職
        "#8C9EFF", // 法人
        "#EF5350", // 個人
        "#B2EBF2", // ?
        "#b5b9ce", // 法人疎遠
        "#c6b0af", // 個人疎遠
    ];
    this.relTypeNames = [
        "",       // 0
        "仕入先", // 1
        "販売先", // 2
        "株主",   // 3
        "出資先", // 4
    ];
    this.bussinessTypeColors =
        [
            {},
            { Color: "Red", C50: "#FFEBEE", C100: "#FFCDD2", C200: "#EF9A9A", C300: "#E57373", C400: "", name: "農業" },
            { Color: "Red", C50: "#FFEBEE", C100: "#FFCDD2", C200: "#EF9A9A", C300: "#E57373", C400: "", name: "林業" },
            { Color: "Pink", C50: "#FCE4EC", C100: "#F8BBD0", C200: "#F48FB1", C300: "#F06292", C400: "", name: "漁業（水産養殖業を除く）" },
            { Color: "Pink", C50: "#FCE4EC", C100: "#F8BBD0", C200: "#F48FB1", C300: "#F06292", C400: "", name: "水産養殖業" },
            { Color: "Purple", C50: "#F3E5F5", C100: "#E1BEE7", C200: "#CE93D8", C300: "#BA68C8", C400: "", name: "鉱業，採石業，砂利採取業" },
            { Color: "Deep Purple", C50: "#EDE7F6", C100: "#D1C4E9", C200: "#B39DDB", C300: "#9575CD", C400: "", name: "総合工事業" },
            { Color: "Deep Purple", C50: "#EDE7F6", C100: "#D1C4E9", C200: "#B39DDB", C300: "#9575CD", C400: "", name: "職別工事業(設備工事業を除く)" },
            { Color: "Deep Purple", C50: "#EDE7F6", C100: "#D1C4E9", C200: "#B39DDB", C300: "#9575CD", C400: "", name: "設備工事業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "食料品製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "飲料・たばこ・飼料製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "繊維工業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "木材・木製品製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "家具・装備品製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "パルプ・紙・紙加工品製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "印刷・同関連業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "化学工業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "石油製品・石炭製品製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "プラスチック製品製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "ゴム製品製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "なめし革・同製品・毛皮製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "窯業・土石製品製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "鉄鋼業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "非鉄金属製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "金属製品製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "はん用機械器具製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "生産用機械器具製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "業務用機械器具製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "電子部品・デバイス・電子回路製造" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "電気機械器具製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "情報通信機械器具製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "輸送用機械器具製造業" },
            { Color: "Indigo", C50: "#E8EAF6", C100: "#C5CAE9", C200: "#9FA8DA", C300: "#7986CB", C400: "", name: "その他の製造業" },
            { Color: "Blue", C50: "#E3F2FD", C100: "#BBDEFB", C200: "#90CAF9", C300: "#64B5F6", C400: "", name: "電気業" },
            { Color: "Blue", C50: "#E3F2FD", C100: "#BBDEFB", C200: "#90CAF9", C300: "#64B5F6", C400: "", name: "ガス業" },
            { Color: "Blue", C50: "#E3F2FD", C100: "#BBDEFB", C200: "#90CAF9", C300: "#64B5F6", C400: "", name: "熱供給業" },
            { Color: "Blue", C50: "#E3F2FD", C100: "#BBDEFB", C200: "#90CAF9", C300: "#64B5F6", C400: "", name: "水道業" },
            { Color: "Light Blue", C50: "#E1F5FE", C100: "#B3E5FC", C200: "#81D4FA", C300: "#4FC3F7", C400: "", name: "通信業" },
            { Color: "Light Blue", C50: "#E1F5FE", C100: "#B3E5FC", C200: "#81D4FA", C300: "#4FC3F7", C400: "", name: "放送業" },
            { Color: "Light Blue", C50: "#E1F5FE", C100: "#B3E5FC", C200: "#81D4FA", C300: "#4FC3F7", C400: "", name: "情報サービス業" },
            { Color: "Light Blue", C50: "#E1F5FE", C100: "#B3E5FC", C200: "#81D4FA", C300: "#4FC3F7", C400: "", name: "インターネット附随サービス業" },
            { Color: "Light Blue", C50: "#E1F5FE", C100: "#B3E5FC", C200: "#81D4FA", C300: "#4FC3F7", C400: "", name: "映像・音声・文字情報制作業" },
            { Color: "Cyan", C50: "#E0F7FA", C100: "#B2EBF2", C200: "#80DEEA", C300: "#4DD0E1", C400: "", name: "鉄道業" },
            { Color: "Cyan", C50: "#E0F7FA", C100: "#B2EBF2", C200: "#80DEEA", C300: "#4DD0E1", C400: "", name: "道路旅客運送業" },
            { Color: "Cyan", C50: "#E0F7FA", C100: "#B2EBF2", C200: "#80DEEA", C300: "#4DD0E1", C400: "", name: "道路貨物運送業" },
            { Color: "Cyan", C50: "#E0F7FA", C100: "#B2EBF2", C200: "#80DEEA", C300: "#4DD0E1", C400: "", name: "水運業" },
            { Color: "Cyan", C50: "#E0F7FA", C100: "#B2EBF2", C200: "#80DEEA", C300: "#4DD0E1", C400: "", name: "航空運輸業" },
            { Color: "Cyan", C50: "#E0F7FA", C100: "#B2EBF2", C200: "#80DEEA", C300: "#4DD0E1", C400: "", name: "倉庫業" },
            { Color: "Cyan", C50: "#E0F7FA", C100: "#B2EBF2", C200: "#80DEEA", C300: "#4DD0E1", C400: "", name: "運輸に附帯するサービス業" },
            { Color: "Cyan", C50: "#E0F7FA", C100: "#B2EBF2", C200: "#80DEEA", C300: "#4DD0E1", C400: "", name: "郵便業（信書便事業を含む）" },
            { Color: "Teal", C50: "#E0F2F1", C100: "#B2DFDB", C200: "#80CBC4", C300: "#4DB6AC", C400: "", name: "各種商品卸売業" },
            { Color: "Teal", C50: "#E0F2F1", C100: "#B2DFDB", C200: "#80CBC4", C300: "#4DB6AC", C400: "", name: "繊維・衣服等卸売業" },
            { Color: "Teal", C50: "#E0F2F1", C100: "#B2DFDB", C200: "#80CBC4", C300: "#4DB6AC", C400: "", name: "飲食料品卸売業" },
            { Color: "Teal", C50: "#E0F2F1", C100: "#B2DFDB", C200: "#80CBC4", C300: "#4DB6AC", C400: "", name: "建築材料，鉱物・金属材料等卸売業" },
            { Color: "Teal", C50: "#E0F2F1", C100: "#B2DFDB", C200: "#80CBC4", C300: "#4DB6AC", C400: "", name: "機械器具卸売業" },
            { Color: "Teal", C50: "#E0F2F1", C100: "#B2DFDB", C200: "#80CBC4", C300: "#4DB6AC", C400: "", name: "その他の卸売業" },
            { Color: "Teal", C50: "#E0F2F1", C100: "#B2DFDB", C200: "#80CBC4", C300: "#4DB6AC", C400: "", name: "各種商品小売業" },
            { Color: "Teal", C50: "#E0F2F1", C100: "#B2DFDB", C200: "#80CBC4", C300: "#4DB6AC", C400: "", name: "織物・衣服・身の回り品小売業" },
            { Color: "Teal", C50: "#E0F2F1", C100: "#B2DFDB", C200: "#80CBC4", C300: "#4DB6AC", C400: "", name: "飲食料品小売業" },
            { Color: "Teal", C50: "#E0F2F1", C100: "#B2DFDB", C200: "#80CBC4", C300: "#4DB6AC", C400: "", name: "機械器具小売業" },
            { Color: "Teal", C50: "#E0F2F1", C100: "#B2DFDB", C200: "#80CBC4", C300: "#4DB6AC", C400: "", name: "その他の小売業" },
            { Color: "Teal", C50: "#E0F2F1", C100: "#B2DFDB", C200: "#80CBC4", C300: "#4DB6AC", C400: "", name: "無店舗小売業" },
            { Color: "Green", C50: "#E8F5E9", C100: "#C8E6C9", C200: "#A5D6A7", C300: "#81C784", C400: "", name: "銀行業" },
            { Color: "Green", C50: "#E8F5E9", C100: "#C8E6C9", C200: "#A5D6A7", C300: "#81C784", C400: "", name: "協同組織金融業" },
            { Color: "Green", C50: "#E8F5E9", C100: "#C8E6C9", C200: "#A5D6A7", C300: "#81C784", C400: "", name: "貸金業等非預金信用機関" },
            { Color: "Green", C50: "#E8F5E9", C100: "#C8E6C9", C200: "#A5D6A7", C300: "#81C784", C400: "", name: "金融商品取引業，商品先物取引業" },
            { Color: "Green", C50: "#E8F5E9", C100: "#C8E6C9", C200: "#A5D6A7", C300: "#81C784", C400: "", name: "補助的金融業等" },
            { Color: "Green", C50: "#E8F5E9", C100: "#C8E6C9", C200: "#A5D6A7", C300: "#81C784", C400: "", name: "保険業" },
            { Color: "Light Green", C50: "#F1F8E9", C100: "#DCEDC8", C200: "#C5E1A5", C300: "#AED581", C400: "", name: "不動産取引業" },
            { Color: "Light Green", C50: "#F1F8E9", C100: "#DCEDC8", C200: "#C5E1A5", C300: "#AED581", C400: "", name: "不動産賃貸業・管理業" },
            { Color: "Light Green", C50: "#F1F8E9", C100: "#DCEDC8", C200: "#C5E1A5", C300: "#AED581", C400: "", name: "物品賃貸業" },
            { Color: "Lime", C50: "#F9FBE7", C100: "#F0F4C3", C200: "#E6EE9C", C300: "#DCE775", C400: "", name: "学術・開発研究機関" },
            { Color: "Lime", C50: "#F9FBE7", C100: "#F0F4C3", C200: "#E6EE9C", C300: "#DCE775", C400: "", name: "専門サービス業" },
            { Color: "Lime", C50: "#F9FBE7", C100: "#F0F4C3", C200: "#E6EE9C", C300: "#DCE775", C400: "", name: "広告業" },
            { Color: "Lime", C50: "#F9FBE7", C100: "#F0F4C3", C200: "#E6EE9C", C300: "#DCE775", C400: "", name: "技術サービス業" },
            { Color: "Yellow", C50: "#FFFDE7", C100: "#FFF9C4", C200: "#FFF59D", C300: "#FFF176", C400: "", name: "宿泊業" },
            { Color: "Yellow", C50: "#FFFDE7", C100: "#FFF9C4", C200: "#FFF59D", C300: "#FFF176", C400: "", name: "飲食店" },
            { Color: "Yellow", C50: "#FFFDE7", C100: "#FFF9C4", C200: "#FFF59D", C300: "#FFF176", C400: "", name: "持ち帰り・配達飲食サービス業" },
            { Color: "Amber", C50: "#FFF8E1", C100: "#FFECB3", C200: "#FFE082", C300: "#FFD54F", C400: "", name: "洗濯・理容・美容・浴場業" },
            { Color: "Amber", C50: "#FFF8E1", C100: "#FFECB3", C200: "#FFE082", C300: "#FFD54F", C400: "", name: "その他の生活関連サービス業" },
            { Color: "Amber", C50: "#FFF8E1", C100: "#FFECB3", C200: "#FFE082", C300: "#FFD54F", C400: "", name: "娯楽業" },
            { Color: "Orange", C50: "#FFF3E0", C100: "#FFE0B2", C200: "#FFCC80", C300: "#FFB74D", C400: "", name: "学校教育" },
            { Color: "Orange", C50: "#FFF3E0", C100: "#FFE0B2", C200: "#FFCC80", C300: "#FFB74D", C400: "", name: "その他の教育，学習支援業" },
            { Color: "Deep Orange", C50: "#FBE9E7", C100: "#FFCCBC", C200: "#FFAB91", C300: "#FF8A65", C400: "", name: "医療業" },
            { Color: "Deep Orange", C50: "#FBE9E7", C100: "#FFCCBC", C200: "#FFAB91", C300: "#FF8A65", C400: "", name: "保健衛生" },
            { Color: "Deep Orange", C50: "#FBE9E7", C100: "#FFCCBC", C200: "#FFAB91", C300: "#FF8A65", C400: "", name: "社会保険・社会福祉・介護事業" },
            { Color: "Brown", C50: "#EFEBE9", C100: "#D7CCC8", C200: "#BCAAA4", C300: "#A1887F", C400: "", name: "郵便局" },
            { Color: "Brown", C50: "#EFEBE9", C100: "#D7CCC8", C200: "#BCAAA4", C300: "#A1887F", C400: "", name: "協同組合" },
            { Color: "Grey", C50: "#FAFAFA", C100: "#F5F5F5", C200: "#EEEEEE", C300: "#E0E0E0", C400: "", name: "廃棄物処理業" },
            { Color: "Grey", C50: "#FAFAFA", C100: "#F5F5F5", C200: "#EEEEEE", C300: "#E0E0E0", C400: "", name: "自動車整備業" },
            { Color: "Grey", C50: "#FAFAFA", C100: "#F5F5F5", C200: "#EEEEEE", C300: "#E0E0E0", C400: "", name: "機械等修理業" },
            { Color: "Grey", C50: "#FAFAFA", C100: "#F5F5F5", C200: "#EEEEEE", C300: "#E0E0E0", C400: "", name: "職業紹介・労働者派遣業" },
            { Color: "Grey", C50: "#FAFAFA", C100: "#F5F5F5", C200: "#EEEEEE", C300: "#E0E0E0", C400: "", name: "その他の事業サービス業" },
            { Color: "Grey", C50: "#FAFAFA", C100: "#F5F5F5", C200: "#EEEEEE", C300: "#E0E0E0", C400: "", name: "政治・経済・文化団体" },
            { Color: "Grey", C50: "#FAFAFA", C100: "#F5F5F5", C200: "#EEEEEE", C300: "#E0E0E0", C400: "", name: "宗教" },
            { Color: "Grey", C50: "#FAFAFA", C100: "#F5F5F5", C200: "#EEEEEE", C300: "#E0E0E0", C400: "", name: "その他のサービス業" },
            { Color: "Grey", C50: "#FAFAFA", C100: "#F5F5F5", C200: "#EEEEEE", C300: "#E0E0E0", C400: "", name: "外国公務" },
            { Color: "Blue Grey", C50: "#ECEFF1", C100: "#CFD8DC", C200: "#B0BEC5", C300: "#90A4AE", C400: "", name: "国家公務" },
            { Color: "Blue Grey", C50: "#ECEFF1", C100: "#CFD8DC", C200: "#B0BEC5", C300: "#90A4AE", C400: "", name: "地方公務" },
            { Color: "Blue Grey", C50: "#ECEFF1", C100: "#CFD8DC", C200: "#B0BEC5", C300: "#90A4AE", C400: "", name: "分類不能の産業" },
        ];
};

var $finplex_relation = new FinplexRelation();

$(function () {
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (searchString, position) {
            position = position || 0;
            return this.substr(position, searchString.length) === searchString;
        };
    }
});

/**
 * パーツを描画します。
 * options {
 *      mode: 1,  1:deal(仕入先・販売先) 2:stock(株主・出資先)
 * }
 */
FinplexRelation.prototype.drawRel = function (rootElementId, options) {
    var $rootElement = $("#" + rootElementId);
    var relType1, relType2;
    switch (options.mode) {
        case 1: relType1 = 1; relType2 = 2;
            break;
        case 2: relType1 = 3; relType2 = 4;
            break;
    }

    $.when(
        // 利用テンプレート読み込み
        $finplex_core.lazyGetTemplate('rel', "relation_main")
    ).done(function () {
        // メインパーツ描画
        $rootElement.empty();
        $rootElement.append($.templates.rel_relation_main.render());

        var storage = localStorage;

        // 会社情報を取得
        var companyCode = localStorage.getItem('cr_company_code');
        // TODO:20170424現在のデモでは富士通決め打ち
        companyCode = '350329109';


        $.when(
            // 企業情報API.相関情報取得呼び出し 1 
            // /profiles/{companyCode}/relationList
            $finplex_relation._getRelationList($rootElement, companyCode, relType1, options),
            // 企業情報API.相関情報取得呼び出し 2 
            // /profiles/{companyCode}/relationList
            $finplex_relation._getRelationList($rootElement, companyCode, relType2, options)
        ).done(function () {

            var rel = $finplex_relation._loadStrageData(relType1, relType2);

            //$finplex_relation._drawGraph(rootElement, companyData, templateName, funcDone);
            $finplex_relation._drawGraph(rel, relType1, relType2);
        });

    });

}

/**
 * 決められたレンダリング条件をもとにGraphを描画します
 */
FinplexRelation.prototype._drawGraph = function (rel, relType1, relType2) {
    var graph = $finplex_relation._createGraph(rel, relType1, relType2);
    var idealLength = 180;
    this.layout = Viva.Graph.Layout.forceDirected(graph, {
        stableThreshold: 300.009, // default: 0.009 // 安定する閾値
        springLength: idealLength, // 40, default: 30 // バネの長さ
        springCoeff: 0.00055, // 0.00055, default: 0.0008 // バネ抵抗係数
        dragCoeff: 0.01, // 0.09, default: 0.02 // 空気抵抗係数
        gravity: -1, // -100 default: -1.2 // お互いの引っ張り強度

        springTransform: function (link, spring) {
            spring.length = (idealLength / link.data.connectionStrength);
        }
    });

    svgGraphics = Viva.Graph.View.svgGraphics();
    this.svgGraphics = svgGraphics

    svgGraphics.node($finplex_relation._drawNode).placeNode($finplex_relation._placeNode);
    svgGraphics.link($finplex_relation._createLink);

    //VivaGraphレンダリング条件
    var renderer = Viva.Graph.View.renderer(graph, {
        container: document.getElementById('dealgraph'),
        layout: this.layout,
        graphics: svgGraphics,
        prerender: 1200,
        renderLinks: true,
        interactive: 'node drag'
    });

    var svgRoot = svgGraphics.getSvgRoot();
    $finplex_relation._appendFilters(svgRoot);

    var commands = $finplex_relation._createCommands(svgRoot);
    svgRoot.append(commands);

    //VivaGraphレンダリング開始
    renderer.run(100);

    // ズームアウト調整
    for (var i = 0; i < 8; i++) {
        renderer.zoomOut();
    }
}

/**
 * Graphオブジェクトを生成します
 */
FinplexRelation.prototype._createGraph = function (rel, relType1, relType2) {
    var g = Viva.Graph.graph();
    g.Name = "企業取引相関図";

    var companyData = JSON.parse(localStorage.getItem('cr_company_data'));

    // 中心企業
    g.addNode(1,
        {
            ind: 1,
            name: "富士通", //name: companyData.outline.companyNameKanji,
            type: "3031",
            group: 0,
            importance: 1,
            nextBirth: 100
        });

    // relType1
    var relType1Type = (relType1 * 500).toString();
    var relType1Color = relType1Type.substr(0, 2);
    g.addNode(2,
        {
            ind: 2,
            name: $finplex_relation.relTypeNames[relType1],
            type: relType1Type,
            image: relType1 == 1 ? "track.svg" : "money.svg",
            group: relType1,
            importance: 1,
            nextBirth: 100
        });
    g.addLink(1, 2, { width: 4, color: $finplex_relation.bussinessTypeColors[relType1Color].C200, connectionStrength: 1 });

    // relType2
    var relType2Type = (relType2 * 1000).toString();
    var relType2Color = relType2Type.substr(0, 2);
    g.addNode(3,
        {
            ind: 3,
            name: $finplex_relation.relTypeNames[relType2],
            type: relType2Type,
            image: relType2 == 2 ? "cart.svg" : "money2.svg",
            group: relType2,
            importance: 1,
            nextBirth: 100
        });
    g.addLink(1, 3, { width: 4, color: $finplex_relation.bussinessTypeColors[relType2Color].C200, connectionStrength: 1 });

    $.each(rel, function (i, val) {
        g.addNode(i + 4, { ind: i + 4, name: val.companyNameKanji, type: val.businessTypeCode, group: val.businessTypeCode, importance: 1, nextBirth: 100 });
        var relType = (val.type + 1) % 2;
        var relColor = relType2Color;
        if (relType == 0) relColor = relType1Color;
        g.addLink(relType + 2, i + 4, { width: 4, color: $finplex_relation.bussinessTypeColors[relColor].C200, connectionStrength: 1 });
    });
    return g;
}

/**
 * コマンドボタンを描画します。
 * @param vivaGraph Viva.Graph.graph()
 */
FinplexRelation.prototype._createCommands = function (svgRoot) {

    // コマンド群のgを定義。
    var commands = Viva.Graph.svg('g')
        .attr('transform', 'translate(20, 20)');　// 位置は x20 y20

    // 企業コマンド
    var companyDataComands =
        $finplex_relation._createDataCommands({
            baseIcon: "ic_domain_white_24px.svg",
            baseName: "企業",
            baseColor: "#689f38",
            functionAdd: $finplex_relation._addCustomer,
            funcitonUpdate: $finplex_relation._updateCustomer,
            functionDelete: $finplex_relation._deleteCustomer,
            offset: 0
        });
    commands.append(companyDataComands);

    // 顧客コマンド
    var customerDataComands =
        $finplex_relation._createDataCommands({
            baseIcon: "ic_person_white_24px.svg",
            baseName: "顧客",
            baseColor: "#f57c00",
            functionAdd: $finplex_relation._addCustomer,
            funcitonUpdate: $finplex_relation._updateCustomer,
            functionDelete: $finplex_relation._deleteCustomer,
            offset: 1
        });
    commands.append(customerDataComands);

    // 関係コマンド
    var relationDataComands =
        $finplex_relation._createDataCommands({
            baseIcon: "ic_import_export_white_24px.svg",
            baseName: "関連",
            baseColor: "#1976d2",
            add: $finplex_relation._addCustomer,
            update: $finplex_relation._updateCustomer,
            delete: $finplex_relation._deleteCustomer,
            offset: 2
        });
    commands.append(relationDataComands);

    return commands;
}

FinplexRelation.prototype._createDataCommands = function (options) {
    var paddingSize = 20;
    var marginSize = 80
    var iconSize = 20;
    var childButtonOffsetY = 30;

    // 全体を収容するg
    var base = Viva.Graph.svg('g')
        .attr('transform', 'translate(' + (paddingSize + marginSize * options.offset) + ', ' + paddingSize + ')');　// 位置は x:offsetSize y:offsetSize

    // add button
    var addButton = $finplex_relation._createCommandButton({
        iconSize: iconSize,
        text: '追加',
        color: '#00796b',
        image: 'ic_add_white_24px.svg',
        opacity: 0,
        onClick: options.add
    });
    base.append(addButton);

    // update button
    var updateButton = $finplex_relation._createCommandButton({
        iconSize: iconSize,
        text: '更新',
        color: '#00796b',
        image: 'ic_update_white_24px.svg',
        opacity: 0,
        onClick: options.update
    });
    base.append(updateButton);

    // delete button
    var deleteButton = $finplex_relation._createCommandButton({
        iconSize: iconSize,
        text: '削除',
        color: '#00796b',
        image: 'ic_delete_white_24px.svg',
        opacity: 0,
        onClick: options.delete
    });
    base.append(deleteButton);

    // base button
    var baseButton = $finplex_relation._createCommandButton({
        iconSize: iconSize,
        text: options.baseName,
        color: options.baseColor,
        image: options.baseIcon,
        opacity: 1,
        onClick: function (e) {
            // タッチorクリック
            // 子コマンド表示状態を切り替える
            var isClosed = (baseButton.attr("cy") == addButton.attr("cy"));
            if (isClosed) {
                //addButton
                addButton.attr("cy", baseButton.attr("cy") + childButtonOffsetY * 1);
                addButton.attr("opacity", 1);

                updateButton.attr("cy", baseButton.attr("cy") + childButtonOffsetY * 2);
                updateButton.attr("opacity", 1);

                deleteButton.attr("cy", baseButton.attr("cy") + childButtonOffsetY * 3);
                deleteButton.attr("opacity", 1);
            } else {
                addButton.attr("cy", baseButton.attr("cy"));
                addButton.attr("opacity", 0);

                updateButton.attr("cy", baseButton.attr("cy"));
                updateButton.attr("opacity", 0);

                deleteButton.attr("cy", baseButton.attr("cy"));
                deleteButton.attr("opacity", 0);
            }
        }
    });
    base.append(baseButton);

    return base;
}

/**
 * コマンドボタンのg定義を作成します。
 */
FinplexRelation.prototype._createCommandButton = function (options) {
    // ボタンのサイズ
    var buttonSize = options.iconSize;
    // ボタンのg定義
    var button = Viva.Graph.svg('g');
    // ボタンのマル
    var circle = Viva.Graph.svg('circle')
        .attr('cx', buttonSize)
        .attr('cy', buttonSize)
        .attr('r', buttonSize)
        .attr('opacity', options.opacity)
        .attr('filter', 'url(#drop-shadow)')
        .attr("fill", options.color);
    // ボタンのアイコン
    var icon = Viva.Graph.svg('image')
        .attr('x', buttonSize * 0.25)
        .attr('y', buttonSize * 0.25)
        .attr('width', buttonSize * 1.5)
        .attr('height', buttonSize * 1.5)
        .attr('opacity', options.opacity)
        .link('./assets/_con/images/' + options.image);
    // ボタンの押下時イベントハンドラ
    $(button).select('circle').on('touchstart click', options.onClick);
    // ボタンgに重ねる
    button.append(circle);
    button.append(icon);
    return button;
}


/**
 * ノードを描画します。
 */
FinplexRelation.prototype._drawNode = function (node) {
    var nodesize = $finplex_relation.nodesize;
    var typeColors = $finplex_relation.typeColors;
    var layout = $finplex_relation.layout;

    var groupId = node.data.group;
    var typeId = node.data.type;
    var imageName = node.data.image;
    var importance = node.data.importance;

    var ui = Viva.Graph.svg('g');

    var selectCheck = Viva.Graph.svg('g');
    var selectBox = Viva.Graph.svg('rect')
        .attr('x', nodesize * 0.8)
        .attr('y', -12)
        .attr('width', nodesize * 0.3)
        .attr('height', nodesize * 0.3)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('stroke', "#808080")
        .attr('stroke-width', '1px')
        .attr('fill', "#FFF");

    var selectIcon = Viva.Graph.svg('image')
        .attr('x', nodesize * 0.8 + 2)
        .attr('y', -20)
        .attr('width', 30)
        .attr('height', 30)
        .attr('visibility', 'hidden')
        .link('./assets/_con/images/check.svg');

    $(selectCheck).select('rect').hover(function () {
        $(this).children('rect')
            .attr('fill', '#AACCFF');
    }, function () {
        $(this).children('rect')
            .attr('fill', "#FFF");
    });
    $(selectCheck).select('rect').on('touchstart click',
        function (e) {
            // タッチorクリック
            // チェック状態を反転する
            var currentVisible = $(this).children('image').attr('visibility');
            var visibility = currentVisible == 'hidden' ? 'visible' : 'hidden';
            $(this).children('image').attr('visibility', visibility);
        }
    );

    selectCheck.append(selectBox);
    selectCheck.append(selectIcon);

    var pinButton = Viva.Graph.svg('g');

    var pinIcon = Viva.Graph.svg('image')
        .attr('x', -10)
        .attr('y', -10)
        .attr('width', 20)
        .attr('height', 20)
        .attr('transform', 'rotate(45)')
        .link('./assets/_con/images/pin.svg');

    var pinCircle = Viva.Graph.svg('circle')
        .attr('r', 15)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('stroke', "#808080")
        .attr('stroke-width', '1px')
        .attr('fill', "#FFF");

    $(pinButton).select('circle').hover(function () {
        $(this).children('circle')
            .attr('fill', '#AACCFF');
    }, function () {
        $(this).children('circle')
            .attr('fill', "#FFF");
    });
    $(pinButton).on('touchstart click',
        function (e) {
            // タッチorクリック
            // ピン状態を反転する
            var currentPinned = layout.isNodePinned(node);
            layout.pinNode(node, !currentPinned);
            var rotate = currentPinned ? 45 : 0;
            $(this).find('image').attr('transform', 'rotate(' + rotate + ')');
        }
    );

    pinButton.append(pinCircle);
    pinButton.append(pinIcon);

    var nextBirth = Viva.Graph.svg('g');
    var nextBirthCircleR = (nodesize * 0.15);
    var nextBirthCirclePosX = (nodesize * 0.925);
    var nextBirthCirclePosY = (nodesize * 0.825);
    var nextBirthFont = 13;
    var nextBirthFontWeight = 500;
    var nextBirthFill = "#FF6464";
    if (node.data.nextBirth <= 20) {
        nextBirthCircleR = (nodesize * 0.20);
        nextBirthFont = 20;
        nextBirthFill = "#EE3232";
        nextBirthFontWeight = 900;
    }

    var nextBirthCircle = Viva.Graph.svg('circle')
        .attr('cx', nextBirthCirclePosX)
        .attr('cy', nextBirthCirclePosY)
        .attr('r', nextBirthCircleR)
        .attr("fill", nextBirthFill)
        .attr("stroke", "#EEE")
        .attr("stroke-width", "4px");

    var nextBirthText = Viva.Graph.svg('text')
        .attr('x', nodesize * 0.925)
        .attr('y', nodesize * 0.9)
        .attr('text-anchor', 'middle')
        .attr('font-size', nextBirthFont)
        .attr('font-weight', nextBirthFontWeight)
        .attr('fill', '#FFF')
        .text(node.data.nextBirth);

    nextBirth.append(nextBirthCircle);
    nextBirth.append(nextBirthText);

    var icon = Viva.Graph.svg('g');
    var iconCircleR = (nodesize * 0.4) * importance;
    var iconCirclePos = (nodesize * 0.5);

    var colorCode = node.data.type.substr(0, 2);

    var iconCircle = Viva.Graph.svg('circle')
        .attr('cx', iconCirclePos)
        .attr('cy', iconCirclePos)
        .attr('r', iconCircleR)
        .attr("fill", $finplex_relation.bussinessTypeColors[colorCode].C200);
    //        .attr("fill", typeColors[typeId ? typeId - 1 : 5]);

    var iconImageSize = (nodesize * 0.6) * importance;
    var iconImagePos = (nodesize * 0.5) - (iconImageSize * 0.5);
    var iconImage;
    if (!imageName) {
        var iconText = node.data.name;
        // アイコンは企業名の一文字目　カッコつき商号は削除
        iconText = iconText.replace(/（.*）/, '').charAt(0);
        iconImage = Viva.Graph.svg('text')
            .attr('x', nodesize * 0.5)
            .attr('y', nodesize * 0.65)
            .attr('text-anchor', 'middle')
            .attr('font-size', 36)
            .attr('fill', '#404040')
            .attr('font-weight', 800)
            .attr('stroke', '#404040')
            .attr('stroke-width', '0.5px')
            .text(iconText);
    } else {
        iconImage = Viva.Graph.svg('image')
            .attr('x', iconImagePos)
            .attr('y', iconImagePos)
            .attr('width', iconImageSize)
            .attr('height', iconImageSize)
            .link('./assets/_con/images/' + imageName);
    }

    icon.append(iconCircle);
    icon.append(iconImage);

    var name = Viva.Graph.svg('g');
    var nameText = Viva.Graph.svg('text')
        .attr('x', nodesize * 0.4)
        .attr('y', nodesize * 1.2)
        .attr('text-anchor', 'middle')
        .attr('font-size', 22)
        .attr('fill', '#404040')
        .attr('font-weight', 800)
        .attr('stroke', '#404040')
        .attr('stroke-width', '0.5px')
        .text(node.data.name);

    var nameLabel = Viva.Graph.svg('image')
        .attr('x', nodesize * 0.4)
        .attr('y', nodesize * 1.2)
        .attr('width', '10%')
        .attr('height', '10%')
        .link('./img/label.png');

    // name.append(nameLabel);

    var uiCommand = Viva.Graph.svg('g');
    uiCommand.append(pinButton);
    uiCommand.append(selectCheck);

    uiCommand.attr('visibility', 'hidden');

    name.append(nameText);

    var personal = Viva.Graph.svg('g');
    personal.append(icon);
    personal.append(name);
    personal.on('click', function () {
        var currentVisible = uiCommand.attr('visibility');
        var visibility = currentVisible == 'hidden' ? 'visible' : 'hidden';
        uiCommand.attr('visibility', visibility);
        return false;
    });
    personal.on('touchstart', function (e) {
        var currentVisible = uiCommand.attr('visibility');
        var visibility = currentVisible == 'hidden' ? 'visible' : 'hidden';
        uiCommand.attr('visibility', visibility);
    });

    ui.append(personal);
    ui.append(uiCommand);

    // 中心ノード設定(2)
    if (node.id == 1) {
        layout.pinNode(node, !layout.isNodePinned(node));
        layout.setNodePosition(node.id, 0, 0);
    }
    if (node.id == 2) {
        layout.pinNode(node, !layout.isNodePinned(node));
        layout.setNodePosition(node.id, -100, 200);
    }
    if (node.id == 3) {
        layout.pinNode(node, !layout.isNodePinned(node));
        layout.setNodePosition(node.id, 200, -100);
    }

    return ui;

}

/**
 * ノードの位置を決定します。
 */
FinplexRelation.prototype._placeNode = function (nodeUI, pos) {
    var nodesize = $finplex_relation.nodesize;

    nodeUI.attr("transform",
        'translate(' +
        (pos.x - (nodesize / 2)) + ',' + (pos.y - (nodesize / 2)) +
        ')');
}

/**
 * ノードの相関を生成します。
 */
FinplexRelation.prototype._createLink = function (link) {
    var line = Viva.Graph.svg('line')
        .attr('stroke-width', link.data.width);
    if (link.data.connectionStrength < 0.8) {
        line.attr('stroke', '#EF5350')
            .attr('stroke-dasharray', '5, 5');
    } else {
        line.attr('stroke', link.data.color);
    }
    return line;
}

/**
 * ノード描画時の描画フィルタを適用します。
 */
FinplexRelation.prototype._appendFilters = function (svgRoot) {

    var dropShadow = $finplex_relation._newDropShadow();
    svgRoot.append(dropShadow);

    var dropShadow2 = $finplex_relation._newDropShadow2();
    svgRoot.append(dropShadow2);

}

/**
 * DropShadowフィルタを生成します。
 */
FinplexRelation.prototype._newDropShadow = function () {
    var dropShadow = Viva.Graph.svg('filter')
        .attr('id', 'drop-shadow')
        .attr('width', '150%')
        .attr('height', '150%');

    // 図形の影をSourceAlphaで取得、ぼかす
    dropShadow.append(
        Viva.Graph.svg('feGaussianBlur')
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", "2")
            .attr("result", "blur")
    );

    dropShadow.append(
        Viva.Graph.svg('feOffset')
            .attr("in", "blur")
            .attr("dx", "1")
            .attr("dy", "3")
            .attr("result", "offsetBlur")
    );

    dropShadow.append(
        Viva.Graph.svg('feBlend')
            .attr("in", "SourceGraphic")
            .attr("in2", "offsetBlur")
            .attr("mode", "normal")
    );
    return dropShadow;
}

/**
 * DropShadow2フィルタを生成します。
 */
FinplexRelation.prototype._newDropShadow2 = function () {
    var dropShadow = Viva.Graph.svg('filter')
        .attr('id', 'drop-shadow2')
        .attr('width', '150%')
        .attr('height', '150%');

    // 図形の影をSourceAlphaで取得、ぼかす
    dropShadow.append(
        Viva.Graph.svg('feGaussianBlur')
            .attr("in", "SourceAlpha")
            .attr("stdDeviatoin", "1.7")
            .attr("result", "blur")
    );

    dropShadow.append(
        Viva.Graph.svg('feOffset')
            .attr("in", "blur")
            .attr("dx", "0")
            .attr("dy", "3")
            .attr("result", "offsetBlur")
    );

    dropShadow.append(
        Viva.Graph.svg('feFlood')
            .attr("flood-color", "#404040")
            .attr("flood-opacity", "0.5")
            .attr("result", "offsetColor")
    );

    dropShadow.append(
        Viva.Graph.svg('feComposite')
            .attr("in", "offsetColor")
            .attr("in2", "offsetBlur")
            .attr("operator", "in")
            .attr("result", "offsetBlur")
    );
    return dropShadow;
}

/**
 * 企業情報取得API呼び出し処理
 * 
 * @param {String} companyCode - companyCode
 */
FinplexRelation.prototype._getRelationList = function (rootElement, companyCode, relationType, options) {
    var today = new Date();
    var storage = localStorage;

    var companyRelName = $finplex_utils.formatString('cr_company_rel_{0}', relationType);
    var companyRelExpiredName = $finplex_utils.formatString('cr_company_rel_{0}_expired', relationType);

    var companyRel;
    localStorage.removeItem(companyRelName);
    if (localStorage.getItem(companyRelName)) {
        companyRel = JSON.parse(localStorage.getItem(companyRelName));
    }
    var companyRelExpired = localStorage.getItem(companyRelExpiredName);

    if (!companyRel) needRel = true;
    if (companyRelExpiredName && companyRelExpiredName < today.getTime()) needData = true;

    if (!needRel) return;

    var commandUrl = $finplex_utils.formatString("company-profile/{0}/profiles/{1}/relationList?relationType={2}", $finplex_core.getApiVer(), companyCode, relationType);
    options.scoreFilter.forEach(function (value) {
        if (value) commandUrl += "&scoreFilterRange=" + value;
    }, this);
    options.profitFilter.forEach(function (value) {
        if (value) commandUrl += "&profitFilterRange=" + value;
    }, this);
    options.salesAmmountFilter.forEach(function (value) {
        if (value) commandUrl += "&salesAmountFilterRange=" + value;
    }, this);
    options.locationFilter.forEach(function (value) {
        if (value) commandUrl += "&locationFilterRange=" + value;
    }, this);
    options.businessTypeFilter.forEach(function (value) {
        if (value) commandUrl += "&businessTypeFilterRange=" + value;
    }, this);
    options.lisingFilter.forEach(function (value) {
        if (value) commandUrl += "&listingFilterRange=" + value;
    }, this);

    return $finplex_core.doGet({
        absoluteUrl: true,
        //commandUrl: $finplex_utils.formatString("http://13.78.88.185:8080/h-cr-outer/v1/profiles/{0}/relationList?relationType={1}", companyCode, relationType),
        commandUrl: $finplex_utils.formatString("https://demo.finplex.global.fujitsu.com/h-cr-inner/profiles/{0}/relationList?relationType={1}", companyCode, relationType),
        //commandUrl: commandUrl,
        funcDone: function (data, textStatus, jqXHR) {
            var relExpired = today.getTime() + 3600000;
            storage.setItem(companyRelName, JSON.stringify(data));
            storage.setItem(companyRelExpiredName, relExpired);
            // console.log(data);
        },
        funcFail: function (data, textStatus, jqXHR) {
            rootElement.empty();
            rootElement.append('<p class="area-content-label">読み込みエラー</p>');

            storage.removeItem(companyRelName);
            storage.removeItem(companyRelExpiredName);
        },
    });
}

FinplexRelation.prototype._loadStrageData = function (relType1, relType2) {
    var rel = [];
    $finplex_relation._loadStrageRelData(rel, relType1);
    $finplex_relation._loadStrageRelData(rel, relType2);
    return rel;
}

FinplexRelation.prototype._loadStrageRelData = function (rel, relType) {
    // relation
    var companyRelName = $finplex_utils.formatString('cr_company_rel_{0}', relType);
    $.each(JSON.parse(localStorage.getItem(companyRelName)), function (i, val) {
        val.type = relType;
        rel.push(val);
    });
}
