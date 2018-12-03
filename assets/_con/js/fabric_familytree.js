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
FabricFamilyTree: {

    var persons = [];
    var links = [];
    var marriageTypes = [5, 6, 7, 8, 9];

    /**
     * コンストラクタ
     */
    FabricFamilyTree = function (canvasId) {
        this.canvas = new fabric.Canvas(canvasId);
    }

    /**
     * プロトタイプ略称
     */
    var _p = FabricFamilyTree.prototype;

    /**
     * ツリーを描画します。
     */
    _p.renderTree = function (data) {
        var ins = this;
        $.each(data.persons, function (index, personData) {
            ins.addPerson(personData);
        });

        ins.sortPersons();

        $.each(data.links, function (index, linkData) {
            ins.addLink(linkData);
        });
        console.log("persons count:" + persons.length);

    }

    /**
     * 人物を追加します。
     * （座標は0, 0）
     */
    _p.addPerson = function (personData) {
        var ins = this;
        var person = new FftPersonNode(personData);
        persons.push(person);
        ins.canvas.add(person.getRootFabric());

        return person;
    }

    /**
     * 人物情報を探します。
     */
    _p.getPerson = function (personalityId) {
        _.find(persons, ["personality_id", personalityId]);
    }

    /**
     * リンクを追加します。
     * （座標は0, 0）
     */
    _p.addLink = function (linkData) {
        var ins = this;
        var isMarried = $.inArray(linkData.relationTypeCode, marriageTypes);
        if (isMarried) {
            ins.addMaritalLink(linkData);
        } else {
            ins.addParentChildLink(linkData);
        }
    }

    /**
     * 婚姻関係リンクを追加します。
     */
    _p.addMaritalLink = function (linkData) {
        var ins = this;

        // 相関データが2つ存在するため、 from が 男性の場合のみ処理する
        var from = ins.getPerson(linkData.from);
        if (from.gender != "m") return;

        var to = ins.getPerson(linkData.to);

    }

    /**
     * 親子関係リンクを追加します。
     */
    _p.addParentChildLink = function (linkData) {

    }

    /**
     * 人物をソートします。
     */
    _p.sortPersons = function () {
        var ins = this;

    }
}

FftPersonNode: {
    moment.locale('ja');

    FftPersonNode = function (personData) {
        this.personalityId = personData.personality_id;
        this.firstName = personData.first_name;
        this.lastName = personData.last_name;
        this.gender = personData.gender
        this.birthday = moment(personData.birthday, "YYYYMMDD");
        this.deathday = personData.deathday ? moment(personData.deathday, "YYYYMMDD") : null;

        this.name = (this.lastName + ' ' + this.firstName).trim();
        this.age = this.calcAge(this.birthday, this.deathday);

        this.defaultWidth = 150;
        this.defaultHeight = 50;

        this.createFabrics();
    }

    /**
     * プロトタイプ略称
     */
    var _p = FftPersonNode.prototype;

    /**
     * デフォルト幅
     * 未設定の場合は150
     */
    _p.getDefaultWidth = function () {
        return this.defaultWidth;
    };
    _p.setDefaultWidth = function (defaultWidth) {
        this.defaultWidth = defaultWidth;
    };

    /**
     * デフォルト高
     * 未設定の場合は50
     */
    _p.getDefaultHeight = function () {
        return this.defaultHeight;
    };
    _p.setDefaultHeight = function (defaultHeight) {
        this.defaultHeight = defaultHeight;
    };

    /**
     * ルートとなるfabricオブジェクトを取得する
     */
    _p.getRootFabric = function () {
        var ins = this;
        return ins.rootFabric;
    }

    /**
     * 人物を表現するfabricオブジェクトを生成する
     */
    _p.createFabrics = function () {
        var ins = this;
        var fabrics = [];

        // 箱
        var box = new fabric.Rect({
            top: 0, // 左上系座標
            left: 0, // 左上系座標
            width: ins.getDefaultWidth(), // 幅
            height: ins.getDefaultHeight(), // 高さ
            fill: "#ffffff", // 塗りつぶし色
            stroke: _p.toGenderColor(ins.gender),　// 境界線色
            strokeWidth: 1, // 境界線太さ
            rx: 5, // カドマル
            ry: 5 // カドマル
        });
        fabrics.push(box);

        // 名前テキスト
        var nameMargin = 10;
        var nameFontSize = 18;
        var nameText = new fabric.Textbox(ins.name, {
            top: ins.getDefaultHeight() / 2 - nameFontSize / 2,
            left: nameMargin,
            width: ins.getDefaultWidth() - nameMargin * 2,
            height: ins.getDefaultHeight() - nameMargin * 2,
            textAlign: "left",
            fontFamily: "Meiryo",
            fontSize: nameFontSize,
            stroke: "#404040"
        });
        fabrics.push(nameText);

        // 年齢テキスト
        var ageStr = "(" + ins.age + ")";
        var ageMarginTop = 15;
        var ageMarginLeft = 10;
        var ageFontSize = 14;
        var ageText = new fabric.Textbox(ageStr, {
            top: ageMarginTop, // 左上系座標
            left: ageMarginLeft, // 左上系座標
            width: ins.getDefaultWidth() - ageMarginLeft * 2, // 幅　マージン計算をしている
            height: ins.getDefaultHeight() - ageMarginTop * 2, // 高さ　マージン計算をしている
            textAlign: "right",　// テキスト寄せ
            fontFamily: "Meiryo",
            fontSize: ageFontSize, // フォントサイズ
            stroke: "#404040" // 文字色
        });
        fabrics.push(ageText);


        if (ins.deathday) {
            // 死亡表示線    
            var deathLineSize = 20;
            var deathLine = new fabric.Line(
                [deathLineSize, 0, 0, deathLineSize]
                , {
                    stroke: "#404040",
                    strokeWidth: 3
                });
            fabrics.push(deathLine);
        }

        // グループ化
        var group = new fabric.Group(fabrics);
        // グループをルートオブジェクトに設定する
        ins.rootFabric = group;

    };

    /**
     * 誕生日と死亡日から年齢を計算する
     */
    _p.calcAge = function (birthday, deathday) {
        if (deathday) {
            return deathday.diff(birthday, 'years');
        } else {
            // moment()はnow
            return moment().diff(birthday, 'years');
        }
    };

    /**
     * 性別を性別色に変換する
     */
    _p.toGenderColor = function (gender) {
        switch (gender) {
            case "m":
                return "#448aff";
            case "f":
                return "#ff5252";
            default:
                return "#404040"
        }
    }

}

FftMaritalLink: {
    FftMaritalLink = function (linkData) {
        var line = new fabric.Line();

    }
}