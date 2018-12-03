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
FabricPowerStructure: {
    // FabricManager継承クラス
    // コンストラクタ
    FabricPowerStructure = function (canvasId, options) {
        var self = this;
        var _popUpWindow;

        var funcRemovePopUp = function () {
            if (self._popUpWindow) {
                self._popUpWindow.remove();
                self._popUpWindow = null;
            }
        };

        // 基底コンストラクタ呼び出し
        FabricManager.call(this, canvasId, {
            allowZoom: true,
            onMouseOver: function (e) {
                if (!e.target) return;
                e.target.onMouseOver && e.target.onMouseOver(e);
            },
            onMouseOut: function (e) {
                if (!e.target) return;
                e.target.onMouseOut && e.target.onMouseOut(e);
            },
            onMouseMove: function (e) {
                // キャンバスのイベント
            },
            onMouseWheel: function (e) {
                funcRemovePopUp();
            },
            onMouseDown: function (e) {},
            onDrop: function (e) {
                if (!e.target) return;
                e.target.onDrop && e.target.onDrop(e);
            },
            onDragStart: function (e) {
                if (!e.target) return;
                funcRemovePopUp();
                e.target.onDragStart && e.target.onDragStart(e);
            },
            onDragEnd: function (e) {
                if (!e.target) return;
                e.target.onDragEnd && e.target.onDragEnd(e);
            },
            onDragCancel: function (e) {
                if (!e.target) return;
                e.target.onDragCancel && e.target.onDragCancel(e);
            },
            onDragMove: function (e) {
                if (!e.target) return;
                e.target.onDragMove && e.target.onDragMove(e);
            },
            onObjectSelected: function (e) {
                if (!e.target) return;
                if (e.target.getRoot) {
                    self._changeSelectedRoot(e.target.getRoot());
                }
                e.target.onObjectSelected && e.target.onObjectSelected(e);

                // 外からも設定できるようにする
                options.onObjectSelected && options.onObjectSelected(e.target, e.target.getData());

                if (e.target.onPopUp) {
                    self._popUpWindow = e.target.onPopUp(e);
                }
            },
            onObjectDeSelected: function (e) {
                funcRemovePopUp();
                if (!e.target) return;

                // 外からも設定できるようにする
                options.onObjectDeSelected && options.onObjectDeSelected(e.target, e.target.getData());

                e.target.onObjectDeSelected && e.target.onObjectDeSelected(e);
            },
            onCanvasSelected: function (e) {},
            onCanvasDeSelected: function (e) {},
            onObjectMoving: function (e) {
                if (!e.target) return;
                e.target.onObjectMoving && e.target.onObjectMoving(e);
                e.target.onConnectableObjectMoving && e.target.onConnectableObjectMoving(e);
            },
            // return newMenu
            onContextMenuBeforeOpen: function (e) {
                if (!e.target) {
                    // canvasメニュー処理
                    return null;
                } else {
                    if (e.target.onContextMenuBeforeOpen) {
                        return e.target.onContextMenuBeforeOpen(e);
                    }
                    return null;
                }
            },
            onCanvasMoving: function (e) {
                funcRemovePopUp();
            },
            onDropFromOuter: function (e, ui) {
                var $draggable = ui.draggable;
                var target = self.canvas.findTarget(e);

                // 何か差し込みたい場合はオプションで対応
                options.onDropFromOuter && options.onDropFromOuter(e, ui, self, target);

                // 以下、内部的なツリー用の動作
                // hierarchy以外へのdropはNGとする
                if (!target || !target.isHierarchy) {
                    return;
                } else {
                    var newId = $draggable.data("id");
                    if (!newId) return;

                    var existedData = _.find(self.canvas.getObjects(), function (o) {
                        return o.id == newId;
                    });
                    if (existedData) {
                        alert("既に追加されたメンバです。");
                        return;
                    }

                    // 表示中root以外は許可しない
                    if (self.selectedRoot.getRoot().id != target.getRoot().id) return;

                    var newData = {
                        id: newId,
                        name: $draggable.data("last_name") + " " + $draggable.data("first_name"),
                        position: _.join([$draggable.data("deprt1"), $draggable.data("deprt2"), $draggable.data("title1")], "\n"),
                        sex: "m"
                    };
                    var newRect = self.addCard({
                        data: newData,
                        id: newData.id,
                        left: 0,
                        top: 0
                    });

                    // ターゲットに子供を追加
                    target.addChildRelation(newRect);

                    // 整列
                    self.reOrder({
                        targetRootIds: [target.getRoot().id],
                        isLockRoot: true
                    });
                }
            },
        });

        // 置き場を考える
        self.selectedRoot = null;
        self.rootNodes = [];
        self.cardWidth = 200;
        self.cardHeight = 120;
        self.treeLeftMargin = 700;
        self.rootLeftMargin = 200;
        self.treeTopMargin = 250;
        self.options = $.extend({}, self.options, options);

    };

    // 継承
    FabricPowerStructure.prototype = Object.create(FabricManager.prototype);

    // Jsonロード処理
    FabricPowerStructure.prototype.loadJson = function (json) {
        var self = this;

        var testData = {
            nodeInfo: {
                id: 100001,
                name: "宍戸 隆一",
                sex: "m",
                position: "金融システム事業本部\nデジタルビジネス事業部\nシニアマネージャー",
                color: "rgb(248,187,208)",
                darkColor: "rgb(173,20,87)",
                children: [{
                        id: 100003,
                        name: "奥田 琢馬",
                        sex: "m",
                        position: "金融システム事業本部\nデジタルビジネス事業部\nマネージャー",
                        color: "rgb(248,187,208)",
                        darkColor: "rgb(173,20,87)",
                        children: [{
                            id: 100008,
                            name: "朱 偉",
                            sex: "m",
                            position: "金融システム事業本部\nデジタルビジネス事業部",
                            memo: "",
                            color: "rgb(179,229,252)",
                            darkColor: "rgb(2,119,189)",
                            children: [{
                                id: 100009,
                                name: "袁 国テイ",
                                sex: "m",
                                position: "金融システム事業本部\nデジタルビジネス事業部",
                                color: "rgb(255,236,179)",
                                darkColor: "rgb(255,143,0)"
                            }, ]
                        }],
                    },
                    {
                        id: 100002,
                        name: "大浦 公靖",
                        sex: "m",
                        position: "金融システム事業本部\nデジタルビジネス事業部\nマネージャー",
                        color: "white",
                        darkColor: "rgb(66,66,66)"
                    },
                ],
            },
        };

        var testData2 = {
            nodeInfo: {
                id: 201,
                name: "自社 締太郎",
                sex: "m",
                position: "代表取締役社長",
                academicBackgroundId: 2,
                academicBackground: "東京大学 S51.",
                color: "rgb(248,187,208)",
                darkColor: "rgb(173,20,87)",
                children: [{
                        id: 202,
                        name: "田中 次郎",
                        sex: "m",
                        position: "営業部 執行役員",
                        academicBackgroundId: 2,
                        academicBackground: "東京大学 S53.",
                        color: "rgb(255,236,179)",
                        darkColor: "rgb(255,143,0)",
                        children: [{
                                id: 204,
                                name: "第一 栄太",
                                sex: "m",
                                position: "営業１部 部長",
                                academicBackground: "S59.",
                                color: "rgb(179,229,252)",
                                darkColor: "rgb(2,119,189)",
                                children: [{
                                        id: 206,
                                        name: "部下 太郎",
                                        sex: "m",
                                        position: "営業１部",
                                        academicBackground: "S59.",
                                        color: "rgb(179,229,252)",
                                        darkColor: "rgb(2,119,189)"
                                    },
                                    {
                                        id: 207,
                                        name: "自社 花子",
                                        sex: "s",
                                        position: "営業１部",
                                        academicBackground: "H04.",
                                        memo: "社長の娘",
                                        color: "rgb(179,229,252)",
                                        darkColor: "rgb(2,119,189)"
                                    },
                                ],
                            },
                            {
                                id: 205,
                                name: "第二 直太朗",
                                sex: "m",
                                position: "営業２部 部長",
                                academicBackground: "S58.",
                                color: "rgb(179,229,252)",
                                darkColor: "rgb(2,119,189)"
                            },
                        ],
                    },
                    {
                        id: 203,
                        name: "佐藤 八郎",
                        sex: "m",
                        position: "ｘｘ部 執行役員",
                        academicBackground: "",
                        color: "rgb(248,187,208)",
                        darkColor: "rgb(173,20,87)",
                    },
                ],
            },
        };

        var testLinkData = [{
                fromId: 100001,
                toId: 100008,
                text: "釣り仲間"
            },
            {
                fromId: 203,
                toId: 100001,
                text: "釣り仲間"
            },
            {
                fromId: 207,
                toId: 100009,
                text: "飲み仲間"
            },
        ];

        // カードを階層に沿って作成
        var root1 = self._makeCardHierarchyRecursive(testData.nodeInfo);
        var root2 = self._makeCardHierarchyRecursive(testData2.nodeInfo);
        self.rootNodes = [root1, root2];

        // 整列
        self.reOrder();

        // 関係性追加
        testLinkData.forEach(function (link, i) {
            var fromObject = self.findObjectById(link.fromId);
            var toObject = self.findObjectById(link.toId);
            self.addArrowConnector(fromObject, toObject, link.text);
        });

        // 選択中ルートノード設定
        self._changeSelectedRoot(root2);

        // 移動結果を再描画
        self.renderAllStack();
    };

    // 組織ツリー作成処理
    FabricPowerStructure.prototype._makeCardHierarchyRecursive = function (nodeInfo, parent) {
        var self = this;

        // ルートノードの場合
        if (!parent) {
            // pinchを作成し、pinchをルートノードとする
            var pinch = new FabricPowerStructure.Pinch(self, {});
            self.addCanvas(pinch);
            self._makeCardHierarchyRecursive(nodeInfo, pinch);
            return pinch;
        }

        var newCard = self.addCard({
            data: nodeInfo,
            id: nodeInfo.id,
            color: "white",
            left: nodeInfo.id * 40,
            top: nodeInfo.id * 200
        });

        if (parent) parent.addChildRelation(newCard);

        nodeInfo.children && nodeInfo.children.forEach(function (c, i) {
            self._makeCardHierarchyRecursive(c, newCard);
        });

        // ルート返却用
        return newCard;
    };

    // 整列
    FabricPowerStructure.prototype.reOrder = function (options) {
        var self = this;
        var op = $.extend({}, options);
        op.orderedRootCounter = 0;

        self.rootNodes.forEach(function (root, i) {

            if (op.targetRootIds && op.targetRootIds.indexOf(root.id) == -1) return true;
            op.orderedRootCounter += 1;

            // 各カードから見た子孫の最大カウントを設定
            self._setChildrenMaxCount(root);

            // 並べ替え再帰処理
            self._reOrderRecursive(root, 0, op);

            // コネクタ用イベント発火
            self._fireOnConnectableObjectMoving(root);

        });

        // 移動結果を再描画
        self.renderAllStack();
    };

    FabricPowerStructure.prototype._setChildrenMaxCount = function (object) {
        var self = this;

        if (object.children.length == 0) {
            object.childrenMaxCount = 0;
            return 1;
        } else {
            var childrenTotalCount = 0;
            object.children.forEach(function (child, index) {
                childrenTotalCount += self._setChildrenMaxCount(child);
            });

            if (childrenTotalCount < object.children.length) {
                object.childrenMaxCount = object.children.length;
                return object.children.length;
            } else {
                object.childrenMaxCount = childrenTotalCount;
                return childrenTotalCount;
            }
        }
    };

    FabricPowerStructure.prototype._reOrderRecursive = function (object, level, options) {

        var self = this;
        var objectWidthMargin = 75;
        var objectHeightMargin = 50;

        var objectWidth = object.width;
        var objectHeight = object.height;
        var treeLeftMargin = self.treeLeftMargin + self.rootLeftMargin * options.orderedRootCounter;

        // 対象オブジェクトが取りうる最大幅の定義
        // カードサイズ * 最大子孫数 + もろもろ
        var childMaxWidth = object.childrenMaxCount * (self.cardWidth + objectWidthMargin);

        // オブジェクトの高さ位置を設定
        // カード高さ * レベル
        var top = self.treeTopMargin + level * (self.cardHeight + objectHeightMargin);

        // rootTopのオフセット値が設定されている場合は加算
        if (options.rootTop) {
            top = options.rootBottom + objectHeightMargin + (level - 1) * (self.cardHeight + objectHeightMargin);
        }

        // Rootノード処理
        if (!object.parent) {
            // Rootの位置がロックされていなければデフォの位置を設定
            if (options.isLockRoot) {
                // ルート配下のtop算出時のオフセット用に値を設定
                options.rootTop = object.top;
                options.rootBottom = object.top + object.height;
            } else {
                // 子供の最大幅 / 2 + treeLeftMargin + 自身の中点
                var newLeft = ((childMaxWidth / 2) + treeLeftMargin) - (objectWidth / 2);
                object.setLeft(newLeft);

                // 高さを下にちょっと寄せる
                if (object.height < self.cardHeight) {
                    object.setTop(top + (self.cardHeight - object.height));
                } else {
                    object.setTop(top);
                }
            }
        } else {
            object.setTop(top);
        }

        // センター
        var center = object.left + (objectWidth / 2);

        // 左端
        var minLeft = center - (childMaxWidth / 2);

        // 利用済み幅の保持用
        var usedWidth = 0;

        // 子供の位置(left)を設定
        object.children.forEach(function (child, index) {

            // 子供が利用する幅の算出
            var childWidth;

            // 子供がさらに子孫を持っている場合は子孫の最大幅から算出
            if (0 < child.childrenMaxCount) {
                childWidth = childMaxWidth * (child.childrenMaxCount / object.childrenMaxCount);
            } else {
                // 孫を持たない場合は自分の分のみ幅を確保
                childWidth = self.cardWidth + objectWidthMargin;
            }

            // 子供のleftを設定 (左端+利用済み幅を開始地点とし、子供の幅の真ん中に設定)
            child.setLeft(minLeft + usedWidth + (childWidth / 2) - (self.cardWidth / 2));
            child.setCoords();

            // ObjectMovingをここで呼ぶと、親ノードと子ノードの両方でイベントが発火するため別メソッドで対応
            // child.onConnectableObjectMoving && child.onConnectableObjectMoving();
            self._reOrderRecursive(child, level + 1, options);
            usedWidth += childWidth;
        });

        object.setCoords();

        // ObjectMovingをここで呼ぶと、親ノードと子ノードの両方でイベントが発火するため別メソッドで対応
        // object.onConnectableObjectMoving && object.onConnectableObjectMoving();
    };

    FabricPowerStructure.prototype._fireOnConnectableObjectMoving = function (object) {
        // ノードの位置が全て定まっている事を前提とする

        var self = this;

        var funcFireEvent = function (object) {
            if (object.children) {
                object.onConnectableObjectMoving && object.onConnectableObjectMoving({
                    ignoreParent: true
                });
                object.children.forEach(function (c, i) {
                    funcFireEvent(c);
                });
            }
        };

        funcFireEvent(object);
        self.renderAllStack();
    };

    FabricPowerStructure.prototype._changeSelectedRoot = function (newRoot) {
        var self = this;
        if (self.selectedRoot && self.selectedRoot.id == newRoot.id) return;

        self.lockCanvas();

        var funcChangeOpacityRecursive = function (object, opacityValue) {
            if (object.objectType == "connector" && object.connectorType == "arrow") return;
            if (opacityValue == null) {
                if (object.originOpacity) {
                    object.set({
                        opacity: object.originOpacity
                    });
                    object.originOpacity = null;
                }
                // 表示するノードを最前面に持ってくる
                self.bringToFrontNoRenderCall(object);
            } else {
                if (!object.originOpacity) {
                    object.originOpacity = object.getOpacity();
                    object.set({
                        opacity: opacityValue
                    });
                }
            }
            if (object.children) {
                object.children.forEach(function (c, i) {
                    funcChangeOpacityRecursive(c, opacityValue);
                });
            }
            if (object.connectors) {
                object.connectors.forEach(function (c, i) {
                    funcChangeOpacityRecursive(c, opacityValue);
                });
            }
        };

        self.rootNodes.forEach(function (r, i) {
            if (r.id == newRoot.id) {
                funcChangeOpacityRecursive(r);
            } else {
                funcChangeOpacityRecursive(r, 0.2);
            }
        });

        // 強制的にarrowを最前面に持ってくる
        var arrowConnectors = _.filter(self.canvas.getObjects(), function (o) {
            return o.objectType == "connector" && o.connectorType == "arrow";
        });
        arrowConnectors.forEach(function (arrow, i) {
            self.bringToFrontNoRenderCall(arrow);
        });

        self.selectedRoot = newRoot;
        self.renderAllStack();
        self.unLockCanvas();
    };

    // カード追加処理
    // params = {data:{}, id:xxx, color:xxx, left:xxx, top:xxxx}
    FabricPowerStructure.prototype.addCard = function (params) {

        var self = this;
        var card = new FabricPowerStructure.Card(self, params);

        self.addCanvas(card);

        card.selectable = false;

        return card;
    };

    // 一旦カード限定
    FabricPowerStructure.prototype.addArrowConnector = function (fromCard, toCard, text) {
        var self = this;

        if (!fromCard || !toCard) return;
        if (fromCard.id == toCard.id) return;
        if (fromCard.objectType != "card" || toCard.objectType != "card") return;
        if (!text) return;

        // 矢印の接続先としてnameTextを設定
        var connector = new FabricPowerStructure.ArrowConnector(
            self,
            fromCard,
            toCard, {
                fromConnectTarget: fromCard.nameBaseRect,
                toConnectTarget: toCard.nameBaseRect,
                data: {
                    from: fromCard.getData(),
                    to: toCard.getData(),
                    text: text,
                },
            }
        );

        self._addConnector(connector);
        self.bringToFrontNoRenderCall(connector);
        self.renderAllStack();
    };

    // コネクタ追加処理
    FabricPowerStructure.prototype._addConnector = function (iConnector) {
        var self = this;

        if (!iConnector.id) iConnector.id = self.getNewId();

        iConnector.selectable = false;

        // groupの透明部分はイベント対象にしない
        iConnector.subTargetCheck = true;
        iConnector.perPixelTargetFind = true;

        // キャンバス描画
        self.addCanvas(iConnector);
        iConnector.sendToBack();

        // from, to それぞれにコネクタ情報を登録
        iConnector.fromConnectable.addConnect(iConnector);
        iConnector.toConnectable.addConnect(iConnector);
    };

    // コネクタ削除処理
    FabricPowerStructure.prototype._removeConnector = function (connector) {
        var self = this;

        // from, to それぞれからコネクタ情報を削除
        connector.fromConnectable && connector.fromConnectable.removeConnect(connector);
        connector.toConnectable && connector.toConnectable.removeConnect(connector);
        self.removeCanvas(connector);
    };

    // グループフィルター処理
    FabricPowerStructure.prototype.doGroupFilter = function (groupFilterType) {
        switch (groupFilterType) {
            case "academicBackground":

                // 自分の知っているCardを全部回してacademicBackgroundIdごとに色を変更するメソッドをキックする
                var colors = {};
                var groupColors = [
                    "rgba(255,235,238 ,0.8)",
                    "rgba(207,216,220 ,0.8)",
                    "rgba(255,248,225 ,0.8)",
                    "rgba(243,229,245 ,0.8)",
                    "rgba(255,204,188 ,0.8)",
                    "rgba(232,245,233 ,0.8)",
                ];

                this.canvas.getObjects().forEach(function (o, i) {
                    if (o.objectType != "card") return true;
                    var aId = o.getData().academicBackgroundId;
                    if (aId) {
                        if (!colors[aId]) {
                            colors[aId] = groupColors.pop();
                        }
                        o.applyGroupColor(colors[aId]);
                    } else {
                        // 元に戻す
                        o.applyGroupColor("");
                    }
                });

                break;
            default:
                // 元に戻す
                this.canvas.getObjects().forEach(function (o, i) {
                    if (o.objectType != "card") return true;
                    o.applyGroupColor("");
                });
                break;
        }
        this.renderAll();
    };
}

// オブジェクト用インタフェース(基本セット)
FabricPowerStructure_IObject: {
    var FabricPowerStructure_IObject = {

        // 継承処理
        extend: function (manager, target, options) {

            // オブジェクトの共通プロパティ
            target.manager = manager;
            target.objectType = options.objectType;
            target.id = options.id ? options.id : manager.getNewId();
            target._data = options.data;
            target.isSelected = false;

            // オブジェクトの共通メソッド

            // dataセッター
            // MEMO:外部からonObjectDataChangedが設定されている場合はcall
            target.setData = function () {
                if (arguments.length == 1) {
                    target._data = arguments[0];
                    target.manager.options.onObjectDataChanged && target.manager.options.onObjectDataChanged(target, target._data);
                } else if (arguments.length == 2) {
                    target._data[arguments[0]] = arguments[1];
                    target.manager.options.onObjectDataChanged && target.manager.options.onObjectDataChanged(target, target._data);
                } else {
                    console.log("argumentsエラー");
                }
            };

            // dataゲッター
            target.getData = function () {
                if (!target._data) return null;
                if (arguments.length == 0) {
                    return target._data;
                } else if (arguments.length == 1) {
                    return target._data[key];
                } else {
                    console.log("argumetnsエラー");
                }
            };
        }
    };
}

// 削除可能インタフェース
FabricPowerStructure_IRemovable: {
    var FabricPowerStructure_IRemovable = {
        // 継承処理
        extend: function (target, options) {
            target.isRemovable = true;
            target.removeSelf = options.removeSelf;
        },
    };
}

// コネクタ可能オブジェクトインタフェース
FabricPowerStructure_IConnectable: {
    var FabricPowerStructure_IConnectable = {

        // 継承処理
        extend: function (target, options) {

            // インタフェースプロパティ
            target.connectors = [];
            target.isConnectable = true;

            // インタフェースメソッド

            // コネクト追加処理
            target.addConnect = function (iconnector) {
                target.connectors.push(iconnector);
                if (iconnector.isMultiple) target._reSettingMultipleNumber(iconnector.connectorType);
                target.onConnectableObjectMoving();
            };

            // コネクト削除処理
            target.removeConnect = function (iconnector) {
                target.connectors = _.reject(target.connectors, function (con) {
                    return con.id == iconnector.id;
                });
                if (iconnector.isMultiple) target._reSettingMultipleNumber(iconnector.connectorType);
                target.onConnectableObjectMoving();
            };

            // 接続可能オブジェクト移動時イベント
            target.onConnectableObjectMoving = function (options) {
                target.connectors.forEach(function (iconnector, i) {
                    if (!iconnector.doSetPosition) return true;

                    if (iconnector.toConnectable.id == this.id) {
                        // 親から自分へのコネクタ
                        // イベントの重複抑制用に親を無視、子を無視の制御を用意
                        if (!options || !options.ignoreParent) iconnector.doSetPosition();
                    } else {
                        // 自分から子へのコネクタ
                        // イベントの重複抑制用に親を無視、子を無視の制御を用意
                        if (!options || !options.ignoreChildren) iconnector.doSetPosition();
                    }
                });
            };

            // コネクタ連番再設定処理
            target._reSettingMultipleNumber = function (connectorType) {
                var targetConnectors =
                    _.filter(target.connectors,
                        function (con) {
                            return con.isMultiple && con.connectorType == connectorType;
                        });

                if (targetConnectors) {
                    var fromToNumbers = {};
                    targetConnectors.forEach(function (con, i) {
                        var key = con.fromConnectable.id + "___" + con.toConnectable.id;
                        if (!fromToNumbers[key]) {
                            fromToNumbers[key] = 1;
                        } else {
                            fromToNumbers[key] += 1;
                        }
                        var newNumber = fromToNumbers[key];
                        // numberは1スタート
                        con.multipleNumber = newNumber;
                    });
                }
            };
        },
    };
}

// コネクタインタフェース
FabricPowerStructure_IConnector: {
    var FabricPowerStructure_IConnector = {

        // 継承処理
        extend: function (target, options) {

            // インタフェースプロパティ
            target.isConnector = true;
            target.fromConnectable = options.fromConnectable;
            target.toConnectable = options.toConnectable;
            target.isMultiple = options.isMultiple ? options.isMultiple : false;
            target.multipleNumber = null;
            target.connectorType = options.connectorType;

            // インタフェースメソッド

            // 要実装：コネクター位置設定処理
            target.doSetPosition = options.doSetPosition;

            // コネクタポジション算出処理
            target.calcConnectPosition = function (fromObject, toObject, options) {
                var self = this;
                var fromTranslateValues = fabric.util.qrDecompose(fromObject.calcTransformMatrix());
                var fromCenterX = fromTranslateValues.translateX;
                var fromCenterY = fromTranslateValues.translateY;
                var fromLeft = fromCenterX - (fromObject.width / 2);
                var fromTop = fromCenterY - (fromObject.height / 2);
                var fromBottom = fromTop + fromObject.height;
                var fromRight = fromLeft + fromObject.width;

                var toTranslateValues = fabric.util.qrDecompose(toObject.calcTransformMatrix());
                var toCenterX = toTranslateValues.translateX;
                var toCenterY = toTranslateValues.translateY;
                var toLeft = toCenterX - (toObject.width / 2);
                var toTop = toCenterY - (toObject.height / 2);
                var toBottom = toTop + toObject.height;
                var toRight = toLeft + toObject.width;

                // fromとtoのCenter位置から、接続位置を算出する
                var diffX = 0;
                var diffY = 0;

                if (fromCenterX < toCenterX) {
                    diffX = toLeft - fromRight;
                } else if (toCenterX < fromCenterX) {
                    diffX = fromLeft - toRight;
                } else {
                    diffX = 0;
                }

                if (fromCenterY < toCenterY) {
                    diffY = toTop - fromBottom;
                } else if (toCenterY < fromCenterY) {
                    diffY = fromTop - toBottom;
                } else {
                    diffY = 0;
                }

                var retValue = {
                    fromX: 0,
                    fromY: 0,
                    toX: 0,
                    toY: 0,
                    centerX: 0,
                    centerY: 0
                };

                // 縦幅のほうが大きい場合
                if (diffX < diffY || (options && options.forceDirection == "vertical")) {
                    retValue.fromX = fromCenterX;
                    retValue.toX = toCenterX;

                    // fromが上でtoが下
                    if (fromCenterY < toCenterY) {
                        retValue.fromY = fromBottom;
                        retValue.toY = toTop;
                    } else {
                        retValue.fromY = fromTop;
                        retValue.toY = toBottom;
                    }
                } else {
                    // 横幅のほうが大きい場合 or 同じ
                    retValue.fromY = fromCenterY;
                    retValue.toY = toCenterY;

                    // fromが左でtoが右
                    if (fromCenterX < toCenterX) {
                        retValue.fromX = fromRight;
                        retValue.toX = toLeft;
                    } else {
                        retValue.fromX = fromLeft;
                        retValue.toX = toRight;
                    }
                }

                // centerX位置の設定
                if (retValue.fromX < retValue.toX) {
                    retValue.centerX = retValue.fromX + (retValue.toX - retValue.fromX) / 2;
                } else if (retValue.toX < retValue.fromX) {
                    retValue.centerX = retValue.toX + (retValue.fromX - retValue.toX) / 2;
                } else {
                    retValue.centerX = retValue.fromX;
                }
                // centerY位置の設定
                if (retValue.fromY < retValue.toY) {
                    retValue.centerY = retValue.fromY + (retValue.toY - retValue.fromY) / 2;
                } else if (retValue.toY < retValue.fromY) {
                    retValue.centerY = retValue.toY + (retValue.fromY - retValue.toY) / 2;
                } else {
                    retValue.centerY = retValue.fromY;
                }

                return retValue;
            };

        },
    };
}

// ドラッガブルインタフェース(Ghost)
FabricPowerStructure_IDraggable: {
    var FabricPowerStructure_IDraggable = {
        // 継承処理
        extend: function (target, options) {

            // インタフェースプロパティ
            target.isDraggable = true;
            target.ghost = null;

            // インタフェースメソッド
            target.createGhost = options.createGhost;

            // DragStartイベントハンドラ
            target.onDragStart = function (e) {
                var self = this;
                // ドラッグ時のダミー表示処理
                if (!self.ghost) {
                    if (options.createGhost) {
                        self.ghost = self.createGhost();
                    } else {
                        self.ghost = fabric.util.object.clone(self);
                        self.ghost.set({
                            opacity: 0.3
                        });
                    }

                    var p = self.manager.canvas.getPointer(e.e);
                    self.ghost.set({
                        left: p.x - (self.ghost.width / 2),
                        top: p.y - (self.ghost.height / 2)
                    });
                    self.ghost.evented = false;
                    self.ghost.selectable = false;
                    self.ghost.isGhost = true;
                    self.ghost.objectCaching = false;

                    self.manager.addCanvas(self.ghost);
                    self.manager.canvas.bringToFront(self.ghost);
                }
            };

            // ドラッグキャンセルイベントハンドラ
            target.onDragCancel = function (e) {
                var self = this;
                if (self.ghost) {
                    self.manager.removeCanvas(self.ghost);
                    self.ghost = null;
                }

                if (options.onDragCancel) options.onDragCancel(e);
            };

            // ドラッグ移動時イベントハンドラ
            target.onDragMove = function (e) {
                var self = this;
                var p = self.manager.canvas.getPointer(e.e);
                if (self.ghost) {
                    self.ghost.set({
                        left: p.x - (self.ghost.width / 2),
                        top: p.y - (self.ghost.height / 2)
                    });
                    self.manager.renderAllStack();
                }
            };

            // ドラッグ終了時イベントハンドラ
            target.onDragEnd = function (e) {
                var self = this;
                if (self.ghost) {
                    self.manager.removeCanvas(self.ghost);
                    self.ghost = null;
                }

                if (options.onDragEnd) options.onDragEnd(e);
            };

            // 要実装：ドロップ時イベントハンドラ
            target.onDrop = options.onDrop;
        },
    };
}

// ポップアップインタフェース
FabricPowerStructure_IPopUppable: {
    var FabricPowerStructure_IPopUppable = {
        // 継承処理
        extend: function (target, options) {

            // インタフェースプロパティ
            target.isPopUppable = true;

            // インタフェースメソッド

            // ポップアップ時イベントハンドラ
            target.onPopUp = function (e) {
                var self = this;

                var p = self.manager.canvas.getPointer(e.e);
                var targetRight = e.target.width + e.target.left;
                var clientX = e.e.clientX + (targetRight - p.x) * self.manager.canvas.getZoom();
                var clientY = e.e.clientY - (p.y - e.target.top) * self.manager.canvas.getZoom();

                // 少し離す
                clientX += 5;

                var popUpBase = $("<div />");
                popUpBase.css("position", "fixed");
                popUpBase.css("left", clientX + "px");
                popUpBase.css("top", clientY + "px");

                var popUp = this.createPopUpInner(e);
                popUpBase.append(popUp);

                var appendTargetId = self.manager.canvas.id;
                if (!appendTargetId.match(/#/)) appendTargetId = "#" + appendTargetId;

                // 追加場所はいったん保留
                $(appendTargetId).parent().append(popUpBase);

                // objectSelectedで表示するように変更したため、hoveroutでの自身の削除は一旦コメントアウト
                /*
                popUpBase.hover(
                    function (e) { },
                    function (e) { popUpBase.remove(); }
                );
                */

                return popUp;
            };

            // 要実装：ポップアップ内部パネル作成処理
            target.createPopUpInner = options.createPopUpInner;
        },
    };
}

// ヒエラルキーインタフェース
FabricPowerStructure_IHierarchy: {
    var FabricPowerStructure_IHierarchy = {

        // 継承処理
        extend: function (target, options) {

            // IConnectableを継承
            FabricPowerStructure_IConnectable.extend(target);

            // インタフェースプロパティ
            target.children = [];
            target.parent = null;
            target.childrenConnectorType = options.childrenConnectorType ? options.childrenConnectorType : "key";
            target.isHierarchy = true;

            // インタフェースメソッド

            // 子供リレーション追加処理
            target.addChildRelation = function (child) {

                // すでにある場合は何もしない
                if (_.find(target.children, function (c) {
                        return c.id == child.id;
                    })) return;

                // 子供に追加
                target.children.push(child);

                // 子供の親を自分に設定
                child.parent = target;

                var connector = null;

                // 独自のコネクタ作成処理があればそれを利用する
                if (options.createConnector) {
                    connector = options.createConnector(target, child);
                } else {
                    connector = new FabricPowerStructure.KeyConnector(
                        target.manager,
                        target,
                        child, {}
                    );
                }

                target.manager._addConnector(connector);
            };

            // 子供リレーション削除処理
            target.removeChildRelation = function (child) {

                var childId = child.id;

                // 自身の子供一覧から削除
                target.children = _.reject(target.children, function (c) {
                    return c.id == childId;
                });

                // 子供の親を解除
                child.parent = null;

                // 鍵線紐づけ情報削除
                var removingConnector = _.find(target.connectors, function (con) {
                    return con.objectType == "connector" && con.connectorType == target.childrenConnectorType && con.fromConnectable.id == target.id && con.toConnectable.id == childId;
                });
                removingConnector && target.manager._removeConnector(removingConnector);
            };

            // ルート取得処理
            target.getRoot = function () {
                var funcFindRoot = function (node) {
                    if (node.parent) {
                        return funcFindRoot(node.parent);
                    }
                    return node;
                };
                var rootNode = funcFindRoot(target);
                return rootNode;
            };

        },
    };
}

// 単純コネクタ
FabricPowerStructure_SimpleConnector: {
    FabricPowerStructure.SimpleConnector = fabric.util.createClass(fabric.Group, {
        // コンストラクタ
        initialize: function (manager, fromConnectable, toConnectable, options) {

            // 基底クラスコンストラクタ呼び出し
            this.callSuper('initialize', this._createPartObjects(manager, options));
            this.objectCaching = false;

            // オブジェクトインタフェース継承
            FabricPowerStructure_IObject.extend(
                manager,
                this, {
                    id: options.id,
                    objectType: "connector",
                    data: options.data,
                }
            );

            // 固有項目

            // IConnectorインターフェース継承
            FabricPowerStructure_IConnector.extend(
                this, {
                    connectorType: "simple",
                    isMultiple: true,
                    fromConnectable: fromConnectable,
                    toConnectable: toConnectable,
                    doSetPosition: function () {

                        // setPositionの際に、fromConnectableInnerまたはtoConnectableInnerが設定されている場合は、そちらを接点とする
                        var fromTarget = options.fromConnectTarget ? options.fromConnectTarget : fromConnectable;
                        var toTarget = options.toConnectTarget ? options.toConnectTarget : toConnectable;
                        var connectPosition = this.calcConnectPosition(fromTarget, toTarget);

                        // group化をすると、groupのcenter位置が子オブジェクトの0となるため、減算して更新する
                        var groupTranslateValues = fabric.util.qrDecompose(this.calcTransformMatrix());
                        var groupCenterX = groupTranslateValues.translateX;
                        var groupCenterY = groupTranslateValues.translateY;

                        this.line.set({
                            x1: connectPosition.fromX - groupCenterX,
                            y1: connectPosition.fromY - groupCenterY,
                            x2: connectPosition.toX - groupCenterX,
                            y2: connectPosition.toY - groupCenterY
                        });

                        this.addWithUpdate();
                    },
                }
            );
        },
        _createPartObjects: function (manager, options) {
            var color = "rgb(144,144,144)";

            // Connectorを構成するオブジェクト群の定義
            var line = new fabric.Line([0, 0, 0, 0], {
                stroke: color,
                strokeWidth: 1,
                objectCaching: false,
            });

            // 簡単に触れるようにする
            this.line = line;

            return [line];
        },
        onMouseOver: function (e) {},
        onMouseOut: function (e) {},
    });
}

// 矢印コネクタ
FabricPowerStructure_ArrowConnector: {
    FabricPowerStructure.ArrowConnector = fabric.util.createClass(fabric.Group, {
        lineColor: "rgba(159,168,218 ,0.8)",
        textColor: "rgba(1, 87, 155, 0.8)",
        fontSize: 15,
        textBackgroundColor: "rgba(250,250,250 ,0.5)",
        selectedTextBackgroundColor: "rgba(179,229,252 ,0.8)",
        highlightFontSize: 25,

        // コンストラクタ
        initialize: function (manager, fromConnectable, toConnectable, options) {
            var self = this;

            // 基底クラスコンストラクタ呼び出し
            this.callSuper('initialize', this._createPartObjects(manager, options));
            this.objectCaching = false;

            // オブジェクトインタフェース継承
            FabricPowerStructure_IObject.extend(
                manager,
                this, {
                    id: options.id,
                    objectType: "connector",
                    data: options.data,
                }
            );

            // 固有項目
            this.evented = true;

            // IConnectorインターフェース継承
            FabricPowerStructure_IConnector.extend(
                this, {
                    connectorType: "arrow",
                    isMultiple: true,
                    fromConnectable: fromConnectable,
                    toConnectable: toConnectable,
                    doSetPosition: function () {

                        // setPositionの際に、fromConnectableInnerまたはtoConnectableInnerが設定されている場合は、そちらを接点とする
                        var fromTarget = options.fromConnectTarget ? options.fromConnectTarget : fromConnectable;
                        var toTarget = options.toConnectTarget ? options.toConnectTarget : toConnectable;
                        var connectPosition = this.calcConnectPosition(fromTarget, toTarget);

                        // group化をすると、groupのcenter位置が子オブジェクトの0となるため、減算して更新する
                        var groupTranslateValues = fabric.util.qrDecompose(this.calcTransformMatrix());
                        var groupCenterX = groupTranslateValues.translateX;
                        var groupCenterY = groupTranslateValues.translateY;

                        this.arrowCircle.set({
                            left: connectPosition.fromX - groupCenterX,
                            top: connectPosition.fromY - groupCenterY,
                        });

                        // 二点のθを算出
                        var radian = Math.atan2(connectPosition.toY - connectPosition.fromY, connectPosition.toX - connectPosition.fromX);

                        // M x y
                        this.arrowLine.path[0][1] = connectPosition.fromX;
                        this.arrowLine.path[0][2] = connectPosition.fromY;

                        // 二点に垂直に距離rで配置する
                        var r = self.multipleNumber * 50;
                        var pointForRadian = radian + (90 * (180 / Math.PI));

                        // Q px py x y
                        this.arrowLine.path[1][1] = connectPosition.centerX + r * Math.cos(pointForRadian); // rcosθ
                        this.arrowLine.path[1][2] = connectPosition.centerY + r * Math.sin(pointForRadian); // rsinθ
                        this.arrowLine.path[1][3] = connectPosition.toX;
                        this.arrowLine.path[1][4] = connectPosition.toY;

                        var arrowAngle = self.getDiffQB(1,
                            this.arrowLine.path[0][1],
                            this.arrowLine.path[0][2],
                            this.arrowLine.path[1][1],
                            this.arrowLine.path[1][2],
                            this.arrowLine.path[1][3],
                            this.arrowLine.path[1][4]);

                        var angle = (arrowAngle * 180 / Math.PI) + 90;
                        this.arrowTriangle.set({
                            left: connectPosition.toX - groupCenterX,
                            top: connectPosition.toY - groupCenterY,
                            angle: angle,
                        });
                        var QBcenterPoint = self.getPointQB(0.5,
                            this.arrowLine.path[0][1],
                            this.arrowLine.path[0][2],
                            this.arrowLine.path[1][1],
                            this.arrowLine.path[1][2],
                            this.arrowLine.path[1][3],
                            this.arrowLine.path[1][4]);

                        // console.log(QBcenterPoint);

                        this.arrowText.set({
                            left: QBcenterPoint.x - groupCenterX,
                            top: QBcenterPoint.y - groupCenterY,
                            //left: connectPosition.centerX + r * Math.cos(pointForRadian),
                            //top: connectPosition.centerY + r * Math.sin(pointForRadian),
                        });

                        // グループ領域再計算
                        this.addWithUpdate();
                    },
                }
            );

            // IRemovableを継承
            FabricPowerStructure_IRemovable.extend(this, {
                removeSelf: function () {
                    self.manager.lockCanvas();
                    self.set("stroke", "red");
                    self.animate("opacity", 0, {
                        duration: 500,
                        onChange: self.manager.canvas.renderAll.bind(self.manager.canvas),
                        onComplete: function () {
                            self.manager._removeConnector(self);
                            self.manager.unLockCanvas();
                        },
                    });
                },
            });

        },
        _createPartObjects: function (manager, options) {

            // Connectorを構成するオブジェクト群の定義
            var arrowTriangle = new fabric.Triangle({
                fill: this.lineColor,
                width: 20,
                height: 20,
                left: 0,
                top: 0,
                originX: "center",
                originY: "center",
                objectCaching: false,
            });

            var arrowLine = new fabric.Path(
                'M 65 0 Q 100 100 200 0', {
                    fill: '',
                    stroke: this.lineColor,
                    strokeWidth: 4,
                    objectCaching: false
                }
            );

            var arrowCircle = new fabric.Circle({
                fill: this.lineColor,
                radius: 8,
                originX: "center",
                originY: "center",
                objectCaching: false,
            });

            var arrowText = new fabric.Text(
                options.data.text ? options.data.text : "", {
                    fontSize: 15,
                    fontFamily: "Meiryo",
                    originX: "center",
                    originY: "center",
                    fill: this.textColor,
                    backgroundColor: this.textBackgroundColor,
                    objectCaching: false,
                });

            // 簡単に触れるようにする
            this.arrowTriangle = arrowTriangle;
            this.arrowLine = arrowLine;
            this.arrowCircle = arrowCircle;
            this.arrowText = arrowText;

            return [arrowTriangle, arrowLine, arrowCircle, arrowText];
        },
        //ベジェ曲線上地点座標表示
        // t →曲線上の終点までの割合(0 <= t <= 1)
        getPointQB: function (t, fromX, fromY, qbX, qbY, toX, toY) {
            var tp = 1 - t;
            var x = t * t * toX + 2 * t * tp * qbX + tp * tp * fromX;
            var y = t * t * toY + 2 * t * tp * qbY + tp * tp * fromY;
            return {
                x: x,
                y: y
            };
        },
        //ベジェ曲線上地点の角度
        // t →曲線上の終点までの割合(0 <= t <= 1)
        getDiffQB: function (t, fromX, fromY, qbX, qbY, toX, toY) {
            var tp = 1 - t;
            var dx = 2 * (t * (toX - qbX) + tp * (qbX - fromX));
            var dy = 2 * (t * (toY - qbY) + tp * (qbY - fromY));
            return Math.atan2(dy, dx);
        },
        onMouseOver: function (e) {
            var self = this;

            self.arrowLine.set({
                stroke: "rgba(46,125,50, 0.5)"
            });
            self.arrowCircle.set({
                fill: "rgba(46,125,50, 0.5)"
            });
            self.arrowTriangle.set({
                fill: "rgba(46,125,50, 0.5)"
            });
            self.arrowText.set({
                fill: "rgba(46,125,50, 1.0)",
                fontSize: self.highlightFontSize,
            });

            // 自身がイベント発火者の場合は接続先の色も変更する
            if (e && e.target.id == self.id) {
                self.fromConnectable.onMouseOver && self.fromConnectable.onMouseOver();
                self.toConnectable.onMouseOver && self.toConnectable.onMouseOver();
            }

            self.manager.renderAllStack();
        },
        onMouseOut: function (e) {
            var self = this;

            self.arrowLine.set({
                stroke: self.lineColor
            });
            self.arrowCircle.set({
                fill: this.lineColor
            });
            self.arrowTriangle.set({
                fill: this.lineColor
            });
            self.arrowText.set({
                fill: self.textColor,
                fontSize: self.isSelected ? self.highlightFontSize : self.fontSize,
            });

            // 自身がイベント発火者の場合は接続先の色も変更する
            if (e && e.target.id == self.id) {
                self.fromConnectable.onMouseOut && self.fromConnectable.onMouseOut();
                self.toConnectable.onMouseOut && self.toConnectable.onMouseOut();
            }

            self.manager.renderAllStack();
        },
        onObjectSelected: function (e) {
            var self = this;
            self.arrowText.set({
                backgroundColor: self.selectedTextBackgroundColor,
                fontSize: self.highlightFontSize,
            });
            self.arrowText.hasBorders = true;
            self.manager.bringToFrontNoRenderCall(self);
            self.manager.renderAllStack();
        },
        onObjectDeSelected: function (e) {
            var self = this;

            self.arrowText.set({
                backgroundColor: self.textBackgroundColor,
                fontSize: self.fontSize,
            });
            self.manager.renderAllStack();
        },
    });
}

// 鍵線コネクタ
FabricPowerStructure_KeyConnector: {
    FabricPowerStructure.KeyConnector = fabric.util.createClass(fabric.Group, {
        // コンストラクタ
        initialize: function (manager, fromConnectable, toConnectable, options) {

            // 基底クラスコンストラクタ呼び出し
            this.callSuper('initialize', this._createPartObjects(manager, options));
            this.objectCaching = false;

            // オブジェクトインタフェース継承
            FabricPowerStructure_IObject.extend(
                manager,
                this, {
                    id: options.id,
                    objectType: "connector",
                    data: options.data,
                }
            );

            // 固有項目
            this.evented = false;

            // IConnectorインターフェース継承
            FabricPowerStructure_IConnector.extend(
                this, {
                    connectorType: "key",
                    isMultiple: false,
                    fromConnectable: fromConnectable,
                    toConnectable: toConnectable,
                    doSetPosition: function () {

                        // setPositionの際に、fromConnectableInnerまたはtoConnectableInnerが設定されている場合は、そちらを接点とする
                        var fromTarget = options.fromConnectTarget ? options.fromConnectTarget : fromConnectable;
                        var toTarget = options.toConnectTarget ? options.toConnectTarget : toConnectable;
                        var connectPosition = this.calcConnectPosition(fromTarget, toTarget, {
                            forceDirection: "vertical"
                        });

                        // group化をすると、groupのcenter位置が子オブジェクトの0となるため、減算して更新する
                        var groupTranslateValues = fabric.util.qrDecompose(this.calcTransformMatrix());
                        var groupCenterX = groupTranslateValues.translateX;
                        var groupCenterY = groupTranslateValues.translateY;

                        this.point1.set({
                            left: connectPosition.fromX - groupCenterX,
                            top: connectPosition.centerY - groupCenterY
                        });
                        this.point2.set({
                            left: connectPosition.toX - groupCenterX,
                            top: connectPosition.centerY - groupCenterY
                        });
                        this.lineFrom.set({
                            x1: connectPosition.fromX - groupCenterX,
                            y1: connectPosition.fromY - groupCenterY,
                            x2: connectPosition.fromX - groupCenterX,
                            y2: connectPosition.centerY - groupCenterY
                        });
                        this.lineHorizontal.set({
                            x1: connectPosition.fromX - groupCenterX,
                            y1: connectPosition.centerY - groupCenterY,
                            x2: connectPosition.toX - groupCenterX,
                            y2: connectPosition.centerY - groupCenterY
                        });
                        this.lineTo.set({
                            x1: connectPosition.toX - groupCenterX,
                            y1: connectPosition.centerY - groupCenterY,
                            x2: connectPosition.toX - groupCenterX,
                            y2: connectPosition.toY - groupCenterY
                        });

                        // グループ領域再計算
                        this.addWithUpdate();
                    },
                }
            );
        },
        _createPartObjects: function (manager, options) {
            var color = "rgb(144,144,144)";

            // Connectorを構成するオブジェクト群の定義
            var point1 = new fabric.Circle({
                fill: color,
                radius: 0,
                left: 0,
                top: 0,
                originX: "center",
                originY: "center",
                objectCaching: false,
            });

            var point2 = new fabric.Circle({
                fill: color,
                radius: 0,
                left: 0,
                top: 0,
                originX: "center",
                originY: "center",
                objectCaching: false,
            });

            var lineFrom = new fabric.Line([0, 0, 0, 0], {
                stroke: color,
                strokeWidth: 1,
                objectCaching: false,
            });

            var lineHorizontal = new fabric.Line([0, 0, 0, 0], {
                stroke: color,
                strokeWidth: 1,
                objectCaching: false,
            });

            var lineTo = new fabric.Line([0, 0, 0, 0], {
                stroke: color,
                strokeWidth: 1,
                objectCaching: false,
            });

            // 簡単に触れるようにする
            this.lineFrom = lineFrom;
            this.point1 = point1;
            this.lineHorizontal = lineHorizontal;
            this.point2 = point2;
            this.lineTo = lineTo;

            return [lineFrom, point1, lineHorizontal, point2, lineTo];
        },
        // 以下、イベントハンドラ
        onContextMenuBeforeOpen: function (e) {
            var self = this;
            return [];
        },
        onMouseOver: function (e) {},
        onMouseOut: function (e) {},
    });
}

// つまみ
FabricPowerStructure_Pinch: {
    FabricPowerStructure.Pinch = fabric.util.createClass(fabric.Group, {
        borderColor: "rgb(192, 192, 192)",
        borderWidth: 1,
        baseColor: "white",
        // コンストラクタ
        initialize: function (manager, options) {
            var self = this;

            // 基底クラスコンストラクタ呼び出し
            this.callSuper('initialize', this._createPartObjects(manager, options));
            this.objectCaching = false;

            // オブジェクトインタフェース継承
            FabricPowerStructure_IObject.extend(
                manager,
                this, {
                    id: options.id,
                    objectType: "pinch",
                    data: options.data,
                }
            );

            // IHierarchyインターフェース継承
            FabricPowerStructure_IHierarchy.extend(this, {});

            // IDraggableインターフェース継承
            FabricPowerStructure_IDraggable.extend(this, {
                createGhost: function () {
                    var ghost = fabric.util.object.clone(self);
                    ghost.set({
                        stroke: "red",
                    });
                    return ghost;
                },
                onDragCancel: function (e) {
                    // 何故かghostの影響を受けるのでもとに戻す
                    self.set({
                        stroke: self.borderColor,
                    });
                },
                onDragEnd: function (e) {
                    var p = self.manager.canvas.getPointer(e.e);
                    self.set({
                        left: p.x - self.width / 2,
                        top: p.y - self.height / 2,
                    });
                    self.manager.reOrder({
                        targetRootIds: [self.getRoot().id],
                        isLockRoot: true
                    });

                    // 何故かghostの影響を受けるのでもとに戻す
                    self.set({
                        stroke: self.borderColor,
                    });

                    self.manager.renderAllStack();
                },
            });

            // 固有項目
            this.selectable = false;

        },
        _createPartObjects: function (manager, options) {
            var self = this;

            var pinchBaseCircle = new fabric.Circle({
                fill: this.baseColor,
                stroke: this.borderColor,
                strokeWidth: this.borderWidth,
                radius: 32,
                /*
                originX: "center",
                originY: "center",
                */
                objectCaching: false,
            });

            // 簡単に触れるようにする
            this.pinchBaseCircle = pinchBaseCircle;

            return [pinchBaseCircle];
        },
    });
}

// カードオブジェクト
FabricPowerStructure_Card: {
    FabricPowerStructure.Card = fabric.util.createClass(fabric.Group, {
        borderColor: "rgb(192, 192, 192)",
        borderWidth: 1,
        textColor: "rgb(64, 64, 64)",
        cardBaseRectColor: "white",
        cardBaseRectSelectedColor: "rgba(235,250,254 ,1)",
        mouseOverBorderColor: "green",
        mouseOVerOpacityOffset: 0.5,
        groupColor: "",
        // コンストラクタ
        initialize: function (manager, options) {
            var self = this;

            // 基底クラスコンストラクタ呼び出し
            this.callSuper('initialize', this._createPartObjects(manager, options));
            this.objectCaching = false;

            // オブジェクトインタフェース継承
            FabricPowerStructure_IObject.extend(
                manager,
                this, {
                    id: options.id,
                    objectType: "card",
                    data: options.data,
                }
            );

            // 固有項目

            // IRemovableを継承
            FabricPowerStructure_IRemovable.extend(this, {
                removeSelf: function () {

                    // 一旦子供も軒並み削除扱いとする
                    var funcDeleteRecursive = function (target, promiseArray) {
                        // 末端まで再帰的に降りる
                        target.children && target.children.forEach(function (c, i) {
                            funcDeleteRecursive(c, promiseArray);
                        });

                        // 以下、末端到着時処理

                        // リレーション削除
                        target.connectors && target.connectors.forEach(function (con, i) {
                            self.manager._removeConnector(con);
                        });

                        // 親のremoveChildRelation実施
                        target.parent && target.parent.removeChildRelation(target);

                        // アニメーションでカードをフェードアウト
                        var d = new $.Deferred;
                        target.set({
                            opacity: 1
                        });
                        target.cardBaseRect.set({
                            "stroke": "red"
                        });
                        target.animate("opacity", 0, {
                            duration: 750,
                            onChange: self.manager.canvas.renderAll.bind(self.manager.canvas),
                            onComplete: function () {
                                // カードをキャンバスから削除
                                self.manager.removeCanvas(target);
                                d.resolve();
                            },
                        });

                        promiseArray.push(d.promise());
                    };

                    // 再描画用にrootのidを取得しておく
                    var rootId = self.getRoot().id;

                    self.manager.lockCanvas();

                    var promiseArray = [];
                    funcDeleteRecursive(self, promiseArray);

                    $.when.apply($, promiseArray).then(function () {
                        self.manager.reOrder({
                            targetRootIds: [rootId],
                            isLockRoot: true
                        });
                        self.manager.unLockCanvas();
                    });
                },
            });

            // IHierarchyインターフェース継承
            FabricPowerStructure_IHierarchy.extend(this, options);

            // IDraggableインターフェース継承
            FabricPowerStructure_IDraggable.extend(this, {
                onDrop: function (e) {
                    // MEMO:selfとfromObjectは同一

                    // 自身に親がいない場合は移動不可
                    if (!self.parent) {
                        alert("rootは移動できません");
                        return;
                    }

                    // 自身へのドロップは不可
                    if (self.id == e.toObject.id) return;

                    // 親に変化がない場合は何もしない
                    if (self.parent.id == e.toObject.id) return;

                    // ドロップ先がhierarchy以外は一旦無視
                    if (!e.toObject.isHierarchy) return;

                    // 子孫のノードの場合は移動不可
                    var funcHasSameChildRecurcive = function (node, searchId) {
                        if (node.children) {
                            var hasChild = _.find(node.children, function (c) {
                                return c.id == searchId || funcHasSameChildRecurcive(c, searchId)
                            });
                            if (hasChild) return true;
                        }
                        return false;
                    };
                    if (funcHasSameChildRecurcive(self, e.toObject.id)) {
                        alert("自身の下のノードには移動できません");
                        return;
                    }

                    // 別ツリーへの移動は不可
                    if (e.fromObject.getRoot().id != e.toObject.getRoot().id) return;

                    // 自分の親から自分を外す
                    self.parent.removeChildRelation(self);

                    // toの子供に自分を追加する
                    e.toObject.addChildRelation(self);

                    // 再描画
                    self.manager.reOrder({
                        targetRootIds: [self.getRoot().id],
                        isLockRoot: true
                    });

                    // エフェクトで移ったノードを強調する
                    var funcDoEffect = function (target) {
                        if (!target.cardBaseRect) return;

                        var d = new $.Deferred;
                        target.cardBaseRect.setStroke("orange");
                        target.cardBaseRect.setStrokeWidth(6);
                        target.cardBaseRect.animate("strokeWidth", self.borderWidth, {
                            duration: 500,
                            onChange: self.manager.canvas.renderAll.bind(self.manager.canvas),
                            onComplete: function () {
                                target.cardBaseRect.setStroke(self.borderColor);
                                target.cardBaseRect.setStrokeWidth(self.borderWidth);
                                self.manager.renderAllStack();
                                d.resolve();
                            },
                        });
                        return d.promise();
                    };

                    $.when(
                        self.manager.lockCanvas(),
                        funcDoEffect(self),
                        funcDoEffect(e.toObject)
                    ).done(function () {
                        self.manager.unLockCanvas();
                    });
                },
            });

        },
        _createPartObjects: function (manager, options) {
            var self = this;

            // Fabricの組み立て
            var cardBaseRect = new fabric.Rect({
                left: options.left,
                top: options.top,
                fill: this.cardBaseRectColor,
                stroke: this.borderColor,
                strokeWidth: this.borderWidth,
                rx: 5,
                ry: 5,
                width: manager.cardWidth,
                height: manager.cardHeight,
                objectCaching: false,
            });
            cardBaseRect.setShadow({
                color: "rgba(0,0,0,0.25)",
                blur: 5,
                offsetX: 0,
                offsetY: 5,
            });

            var nameBaseRect = new fabric.Rect({
                left: options.left + 8,
                top: options.top + 8,
                fill: options.data.color ? options.data.color : "white",
                stroke: options.data.darkColor ? options.data.darkColor : "rgb(66,66,66)",
                strokeWidth: 1,
                rx: 5,
                ry: 5,
                width: manager.cardWidth * 75 / 100,
                height: 35,
                objectCaching: false,
            });
            var nameText = new fabric.Text(
                options.data.name, {
                    left: options.left + 15,
                    top: options.top + 15,
                    fontSize: 20,
                    //fontWeight: 400,
                    fontFamily: "Meiryo",
                    fill: this.textColor,
                    //padding: 15,
                    //width: manager.cardWidth * 80 / 100,
                    objectCaching: false,
                }
            );
            var otherTextSummary = "";
            if (options.data.position) otherTextSummary += options.data.position;
            if (options.data.academicBackground) otherTextSummary += "\n" + options.data.academicBackground;
            if (options.data.memo) otherTextSummary += "\n" + options.data.memo;
            var otherText = new fabric.Text(
                otherTextSummary, {
                    left: options.left + 5,
                    top: options.top + nameText.height + 25,
                    fontSize: 16,
                    //fontWeight: 400,
                    fontFamily: "Meiryo",
                    fill: this.textColor,
                    objectCaching: false,
                }
            );

            // キーマン アイコンタグの生成と設定
            var keyManIconElement = $("<img/>", {
                'src': 'assets/_con/images/ic_vpn_key_yellow_24dp_2x.png'
            });
            var keyManIcon = new fabric.Image(keyManIconElement[0], {
                left: options.left + cardBaseRect.width - 35,
                top: options.top + 5,
                width: 24,
                height: 24,
                objectCaching: false,
            });
            if (!options.data.isKeyMan) keyManIcon.opacity = 0;

            // 決裁者 アイコンタグの生成と設定
            var decisionMakerElement = $("<img/>", {
                'src': 'assets/_con/images/ic_person_gray_24dp_2x.png'
            });
            var decisionMakerIcon = new fabric.Image(decisionMakerElement[0], {
                left: options.left + cardBaseRect.width - 35,
                top: options.top + keyManIcon.height + 5,
                width: 24,
                height: 24,
                objectCaching: false,
            });
            if (!options.data.isDecisionMaker) decisionMakerIcon.opacity = 0;

            // 簡単に触れるようにする
            this.cardBaseRect = cardBaseRect;
            this.nameBaseRect = nameBaseRect;
            this.nameText = nameText;
            this.otherText = otherText;
            this.keyManIcon = keyManIcon;
            this.decisionMakerIcon = decisionMakerIcon;

            return [cardBaseRect, nameBaseRect, nameText, otherText, keyManIcon, decisionMakerIcon];
        },
        applyGroupColor: function (groupColor) {
            var self = this;
            self.groupColor = groupColor || self.cardBaseRectColor;
            self.cardBaseRect.set({
                fill: self.isSelected ? self.cardBaseRectSelectedColor : self.groupColor,
            });
            self.manager.renderAllStack();
        },
        changeKeyMan: function () {
            var self = this;
            self.getData().isKeyMan = !self.getData().isKeyMan;
            if (self.keyManIcon) {
                if (self.getData().isKeyMan) {
                    self.keyManIcon.set({
                        opacity: 1
                    });
                } else {
                    self.keyManIcon.set({
                        opacity: 0
                    });
                }
            }
            self.manager.renderAll();
        },
        changeDecisionMaker: function () {
            var self = this;
            self.getData().isDecisionMaker = !self.getData().isDecisionMaker;
            if (self.decisionMakerIcon) {
                if (self.getData().isDecisionMaker) {
                    self.decisionMakerIcon.set({
                        opacity: 1
                    });
                } else {
                    self.decisionMakerIcon.set({
                        opacity: 0
                    });
                }
            }
            self.manager.renderAll();
        },
        // 以下、イベントハンドラ
        onMouseOver: function (e) {
            var self = this;

            // 自身がイベント発火者 かつ rootの所属が異なる場合はイベントキャンセル
            if (e && e.target.id == self.id && self.manager.selectedRoot.id != self.getRoot().id) return;

            self.cardBaseRect.set("stroke", self.mouseOverBorderColor);

            // 自身がイベント発火者の場合はコネクタの色も変更する
            if (e && e.target.id == self.id) {
                self.connectors.forEach(function (con, i) {
                    con.onMouseOver();
                });
            }

            // 自身がイベント発火者じゃない、かつ透過状態(selectedRootに所属してない)の場合は透過を少し上げる
            if (self.opacity != 1 && (!e || e.target.id != self.id)) {
                self.set({
                    opacity: self.opacity + self.mouseOVerOpacityOffset,
                });
            }

            self.manager.renderAllStack();
        },
        onMouseOut: function (e) {
            var self = this;

            // 自身がイベント発火者 かつ rootの所属が異なる場合はイベントキャンセル
            if (e && e.target.id == self.id && self.manager.selectedRoot.id != self.getRoot().id) return;

            self.cardBaseRect.setStroke(self.borderColor);

            // 自身がイベント発火者の場合はコネクタの色も変更する
            if (e && e.target.id == self.id) {
                self.connectors.forEach(function (con, i) {
                    con.onMouseOut();
                });
            }

            // 自身がイベント発火者じゃない、かつ透過状態(selectedRootに所属してない)の場合のonMouseOver対応を解除
            if (self.opacity != 1 && (!e || e.target.id != self.id)) {
                self.set({
                    opacity: self.opacity - self.mouseOVerOpacityOffset,
                });
            }

            self.manager.renderAllStack();
        },
        onObjectSelected: function (e) {
            var self = this;
            self.cardBaseRect.set({
                fill: self.cardBaseRectSelectedColor
            });

            // select時もコネクタのmouseOverを発火させる
            if (e && e.target.id == self.id) {
                self.connectors.forEach(function (con, i) {
                    con.onMouseOver();
                });
            }

            self.manager.renderAllStack();
        },
        onObjectDeSelected: function (e) {
            var self = this;
            self.cardBaseRect.set({
                fill: self.groupColor ? self.groupColor : self.cardBaseRectColor
            });
            self.manager.renderAllStack();
        },
    });
}