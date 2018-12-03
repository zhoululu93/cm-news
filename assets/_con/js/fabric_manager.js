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
// コンストラクタ
FabricManager = function (canvasId, options) {

    var cId = canvasId;
    if (!cId.match(/#/)) cId = "#" + cId;

    // draggableバインド
    $(cId).droppable({
        drop: function (e, ui) {
            options.onDropFromOuter && options.onDropFromOuter(e, ui);
        }
    });

    // 右クリックメニューバインド
    $(document).contextmenu({
        delegate: ".upper-canvas",
        menu: [],
        beforeOpen: function (event, ui) {
            var args = {};
            args.event = event;
            args.ui = ui;
            args.target = instance.canvas.findTarget(event.originalEvent);

            if (options.onContextMenuBeforeOpen) {
                var newMenu = options.onContextMenuBeforeOpen(args);
                if (newMenu) {
                    $(document).contextmenu("replaceMenu", newMenu);
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
    });

    var instance = this;
    var funcDragCancel = function (i, e, o) {
        if (i.draggingObject) {
            // イベント発火オブジェクト(e.target)にドラッグ中オブジェクトを設定
            e.target = i.draggingObject;
            i.draggingObject = null;
            o.onDragCancel && o.onDragCancel(e);
        }
        i.draggingObject = null;
        i.isDragging = false;
    };
    var funcDragEnd = function (i, e, o) {
        if (i.draggingObject) {
            // イベント発火オブジェクト(e.target)にドラッグ中オブジェクトを設定
            e.target = i.draggingObject;
            i.draggingObject = null;
            o.onDragEnd && o.onDragEnd(e);
        }
        i.draggingObject = null;
        i.isDragging = false;
    };
    var funcClearlastSelectionForDragStart = function (i, e, o) {
        i._lastSelectionForDragStart = null;
        i._prevDragEvent = null;
    };
    var funcSetlastSelectionForDragStart = function (i, e, o) {
        i._lastSelectionForDragStart = e.target;
        // ターゲットがいない場合はキャンバスをドラッグ開始対象オブジェクトとして設定
        if (!e.target) i._lastSelectionForDragStart = i.canvas;
        i._prevDragEvent = e;
    };
    var funcSelectionChange = function (i, e, o) {

        // 選択オブジェクト変更処理
        var newSelection = e.target;

        // DeSelectedイベント発火判定
        if (i.selectedTarget) {
            // 新しいオブジェクトがない、またはIDが異なる場合に発火
            if (!newSelection || newSelection.id != i.selectedTarget.id) {
                if (o.onObjectDeSelected) {
                    // イベントをコピーし、ターゲットを差し替える
                    var clonedEvent = $.extend(true, {}, e);
                    clonedEvent.target = i.selectedTarget;
                    i.selectedTarget.isSelected = false;
                    o.onObjectDeSelected(clonedEvent);
                }
            }
        }

        // Selectedイベント発火判定
        if (newSelection) {
            // 選択中オブジェクトがない、またはIDが異なる場合に発火
            if (!i.selectedTarget || i.selectedTarget.id != newSelection.id) {
                if (o.onObjectSelected) {
                    newSelection.isSelected = true;
                    o.onObjectSelected(e);
                }
            }
        }

        // canvas用イベント
        if (i.selectedTarget && !newSelection) o.onCanvasSelected && o.onCanvasSelected(e);
        if (!i.selectedTarget && newSelection) o.onCanvasDeSelected && o.onCanvasDeSelected(e);

        // 最後にインスタンスの変数を差し替え
        i.selectedTarget = newSelection;
    };
    var funcDoRenderAll = function (i) {
        if (0 < i.renderAllRequiredCounter) {
            i.canvas.renderAll();
        }
        i.renderAllRequiredCounter = 0;
    };

    // 基底プロパティ
    instance.canvas = new fabric.Canvas(canvasId);

    instance.canvas.id = cId;
    instance.mouseOverTarget = null;
    // drag開始対象オブジェクト canvas含む
    instance._lastSelectionForDragStart = null;
    instance._prevDragEvent = null;
    instance.selectedTarget = null;
    instance._idCounter = -1;
    // drag中オブジェクト canvasは対象外
    instance.isDragging = false;
    instance.draggingObject = null;
    instance._isLockedCanvas = false;

    // キャンバス初期設定
    instance.canvas.selection = false;
    instance.canvas.setZoom(0.5);

    // renderAllの軽量化用
    instance.renderAllRequiredCounter = 0;

    // イベントハンドラ設定
    instance.canvas.on('object:moving', function (e) {
        if (instance._isLockedCanvas) {
            funcDoRenderAll(instance);
            return;
        }

        if (!e.target) {
            funcDoRenderAll(instance);
            return;
        }
        options.onObjectMoving && options.onObjectMoving(e);

        funcDoRenderAll(instance);
    });

    instance.canvas.on('mouse:over', function (e) {
        if (instance._isLockedCanvas) {
            funcDoRenderAll(instance);
            return;
        }

        // 外からcanvasに入ってきた場合
        if (!e.target) {
            // ドラッグキャンセル処理
            funcDragCancel(instance, e, options);

            // 選択オブジェクトの解除
            funcClearlastSelectionForDragStart(instance, e, options);
        }

        // ドロップ用ターゲット設定
        instance.mouseOverTarget = e.target;

        if (options.onMouseOver) {
            options.onMouseOver(e);
        }

        funcDoRenderAll(instance);
    });

    instance.canvas.on('mouse:out', function (e) {
        if (instance._isLockedCanvas) {
            funcDoRenderAll(instance);
            return;
        }

        // canvasを抜けた場合
        if (!e.target) {
            // ドラッグキャンセル処理
            funcDragCancel(instance, e, options);

            // 選択オブジェクトの解除
            funcClearlastSelectionForDragStart(instance, e, options);
        }

        // ドロップ用ターゲット解除
        instance.mouseOverTarget = null;

        if (options.onMouseOut) {
            options.onMouseOut(e);
        }

        funcDoRenderAll(instance);
    });

    instance.canvas.on('mouse:down', function (e) {
        if (instance._isLockedCanvas) {
            funcDoRenderAll(instance);
            return;
        }

        // 標準のマウスアップイベント
        if (options.onMouseDown) {
            options.onMouseDown(e);
        }

        funcClearlastSelectionForDragStart(instance, e, options);

        // 左クリック時のターゲットをドラッグ選択オブジェクトとする
        if (e.button == 1) {
            funcSetlastSelectionForDragStart(instance, e, options);
        }

        // 選択オブジェクト変更時、ロック時のイベントをどうするか検証
        if (!instance._isLockedCanvas) {
            funcSelectionChange(instance, e, options);
        }

        funcDoRenderAll(instance);
    });

    instance.canvas.on('mouse:up', function (e) {
        if (instance._isLockedCanvas) {
            funcDoRenderAll(instance);
            return;
        }

        // 標準のマウスアップイベント
        if (options.onMouseUp) {
            options.onMouseUp(e);
        }

        var p = instance.canvas.getPointer(e.e);

        // ドラッグ中対応
        if (instance.draggingObject) {
            // canvas外の場合は無条件にドラッグをキャンセル扱いとする
            // 非表示領域もcanvas外扱いとする. nodeNameでいったん対応
            if (p.x < 0 || p.y < 0 || e.e.target.nodeName != "CANVAS") {
                // ドラッグキャンセル処理
                funcDragCancel(instance, e, options);
            } else {

                // Drag中オブジェクトとDrop対象オブジェクトの退避
                var fromObject = instance.draggingObject;
                var toObject = e.target;

                // canvas内の場合
                // ドラッグエンド処理
                funcDragEnd(instance, e, options);

                // mouse:up時にfromとtoで異なるidの場合はdrop扱いとする
                // idを持たないオブジェクトへのドロップは無効
                if (fromObject && toObject && fromObject.id && toObject.id && fromObject.id != toObject.id) {
                    e.fromObject = fromObject;
                    e.toObject = toObject;
                    // 注意:e.targetはdrop先が本来の仕様。現状はdrag中オブジェクト。
                    options.onDrop(e);

                    // 一旦mouseOverTargetを解除
                    instance.mouseOverTarget = null;
                }
            }
        }

        funcDoRenderAll(instance);
    });

    instance.canvas.on('mouse:wheel', function (e) {
        if (instance._isLockedCanvas) {
            funcDoRenderAll(instance);
            return;
        }

        options.onMouseWheel && options.onMouseWheel(e);
        if (options.allowZoom) {
            instance._isLockedCanvas = true;
            if (e.e.deltaY < 0) {
                var newZoomValue = instance.canvas.getZoom() + 0.1;
                if (newZoomValue <= 1.0) instance.canvas.setZoom(newZoomValue);
                e.e.preventDefault();
            } else if (0 < e.e.deltaY) {
                var newZoomValue = instance.canvas.getZoom() - 0.1;
                if (0.5 <= newZoomValue) instance.canvas.setZoom(newZoomValue);

                e.e.preventDefault();
            }
            instance._isLockedCanvas = false;
        }

        funcDoRenderAll(instance);
    });

    instance.canvas.on('mouse:move', function (e, x) {
        if (instance._isLockedCanvas) {
            funcDoRenderAll(instance);
            return;
        }

        var p = instance.canvas.getPointer(e.e);
        if (p.x < 0 || p.y < 0 || e.e.target.nodeName != "CANVAS") {
            // ドラッグキャンセル処理
            funcDragCancel(instance, e, options);
            funcDoRenderAll(instance);
            return;
        }

        options.onMouseMove && options.onMouseMove(e);

        // 押下中ボタンによる振り分け
        if (e.e.buttons == 0 && instance.draggingObject) {
            // ドラッグエンド処理
            funcDragEnd(instance, e, options);
        } else if (e.e.buttons == 1) {
            // ドラッグ中のマウスムーブイベント発火
            if (instance.draggingObject) {
                e.target = instance.draggingObject;
                var movementX = e.e.clientX - instance._prevDragEvent.e.clientX;
                var movementY = e.e.clientY - instance._prevDragEvent.e.clientY;
                e.myMovementX = movementX;
                e.myMovementY = movementY;
                options.onDragMove && options.onDragMove(e);
                instance._prevDragEvent = e;
            } else {
                // ドラッグ開始イベント判定 
                // mouseOverTargetが存在し、かつlastSelectionForDragStartが同一の場合にドラッグ開始扱いとする
                if (instance.mouseOverTarget &&
                    instance._lastSelectionForDragStart &&
                    instance.mouseOverTarget.id == instance._lastSelectionForDragStart.id) {
                    // ドラッグ中オブジェクトの設定
                    instance.draggingObject = instance.mouseOverTarget;
                    e.target = instance.mouseOverTarget;
                    instance.isDragging = true;
                    options.onDragStart && options.onDragStart(e);
                }

                // キャンバスでのドラッグ時はキャンバスをずらす
                if (instance._lastSelectionForDragStart && instance._lastSelectionForDragStart.id == instance.canvas.id) {
                    if (instance._prevDragEvent) {
                        // MEMO:カーソルは現状未変更
                        var movementX = e.e.clientX - instance._prevDragEvent.e.clientX;
                        var movementY = e.e.clientY - instance._prevDragEvent.e.clientY;
                        var delta = new fabric.Point(movementX, movementY);
                        e.myMovementX = movementX;
                        e.myMovementY = movementY;
                        instance.canvas.relativePan(delta);
                        options.onCanvasMoving && options.onCanvasMoving(e);
                    }
                    instance._prevDragEvent = e;
                }
            }
        } else {
            // ドラッグキャンセル処理
            funcDragCancel(instance, e, options);
        }

        funcDoRenderAll(instance);
    });

    instance.canvas.on('object:selected', function (e) {
        // 現状では意図した挙動をひょうげんできないため廃止
        // mouse:downを用いて疑似的に objectSelected, objectDeSelectedを表現している。
        funcDoRenderAll(instance);
    });
};

// Dispose処理
FabricManager.prototype.dispose = function () {
    this.canvas.dispose();
}

// キャンバスへの追加処理
FabricManager.prototype.addCanvas = function (object) {

    // 一旦すべてのオブジェクトで回転とサイズ変更をOFFとする
    object.lockRotation = true;
    object.lockScalingX = true;
    object.lockScalingY = true;

    this.canvas.add(object);
    object.setCoords();
    this.canvas.renderAll();
}

// 削除処理
FabricManager.prototype.removeCanvas = function (object) {
    this.canvas.remove(object);
    this.canvas.renderAll();
}

FabricManager.prototype.removeById = function (id) {
    var target = this.findObjectById(id);
    this.remove(target);
}

FabricManager.prototype.findObjectById = function (id) {
    var target = _.find(this.canvas.getObjects(), function (o) {
        return o.id == id;
    });
    return target;
}

FabricManager.prototype.getNewId = function () {
    this._idCounter -= 1;
    return this._idCounter;
}

FabricManager.prototype.lockCanvas = function () {
    this._isLockedCanvas = true;
}

FabricManager.prototype.unLockCanvas = function () {
    this.renderAll();
    this._isLockedCanvas = false;
}

FabricManager.prototype.renderAll = function () {
    this.renderAllRequiredCounter = 0;
    this.canvas.renderAll();
}

// renderAll重複対応用
FabricManager.prototype.renderAllStack = function () {
    this.renderAllRequiredCounter += 1;
}

FabricManager.prototype.bringToFrontNoRenderCall = function (object) {
    fabric.util.removeFromArray(this.canvas.getObjects(), object);
    this.canvas.getObjects().push(object);
}