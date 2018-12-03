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
var $goJs = go.GraphObject.make;  // for conciseness in defining templates
var lastStroked = null;  // this remembers the last highlit Shape

//基本設定
var myDiagram = $goJs(go.Diagram, "gojs",  // must name or refer to the DIV HTML element
    {
        // start everything in the middle of the viewport
        initialDocumentSpot: go.Spot.TopCenter,
        initialContentAlignment: go.Spot.Center,
        // have mouse wheel events zoom in and out instead of scroll up and down
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        // support double-click in background creating a new node
        "clickCreatingTool.archetypeNodeData": { text: "new node" },
        // enable undo & redo
        "undoManager.isEnabled": true
        , layout:
        $goJs(go.ForceDirectedLayout,  // automatically spread nodes apart
            { maxIterations: 250, defaultSpringLength: 40, defaultElectricalCharge: 130 })
        // $goJs(go.LayeredDigraphLayout)
    });

// 値の設定を分岐したい場合go.bindingを用いる
//Binding(設定したいプロパティ,値の入っているJsonのプロパティ名,データ加工関数)
// ex. new go.Binding("location", "loc", go.Point.parse)
function init() {

    // define the Node template
    myDiagram.nodeTemplate = detailTemplate;
    myDiagram.addDiagramListener("ViewportBoundsChanged", resizeTemplate);

    // unlike the normal selection Adornment, this one includes a Button
    myDiagram.nodeTemplate.selectionAdornmentTemplate =
        $goJs(go.Adornment, "Spot",
            $goJs(go.Panel, "Auto",
                $goJs(go.Shape, "RoundedRectangle", { fill: null, stroke: "red", strokeWidth: 3 }),
                $goJs(go.Placeholder)  // a Placeholder sizes itself to the selected Node
            )
        ); // end Adornment

    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate = linkTemplate;

    // read in the JSON data from the "mySavedModel" element
    load();
}
// Show the diagram's model in JSON format
function save() {
    document.getElementById("mySavedModel").value = myDiagram.model.toJson();
}
function load() {
    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);

}

// nodeTemplate START

//相関図の各shapeを設定
var detailTemplate = $goJs(go.Node, "Auto",
    // define the node's outer shape, which will surround the TextBlock
    //go.Shape 全体の形を設定
    $goJs(go.Shape,
        {
            parameter1: 20,  // the corner has a large radius
            stroke: $goJs(go.Brush, { color: "blue", }),
            strokeWidth: 2,
            name: "SHAPE",
            portId: "",  // this Shape is the Node's port, not the whole Node
            fromLinkable: false, fromLinkableSelfNode: false, fromLinkableDuplicates: true,
            toLinkable: false, toLinkableSelfNode: false, toLinkableDuplicates: true,
            cursor: "pointer",
            click: clickNode
        },
        new go.Binding("figure", "personality", bindingShapeFigure),
        new go.Binding("fill", "personality", bindingShapeFill)
    ),
    $goJs(go.Panel, "Table", { defaultAlignment: go.Spot.Left },
        $goJs(go.Picture,
            {
                row: 0, column: 0, rowSpan: 2,
                click: clickNode
            }, new go.Binding("source", "", bindingIcon)),
        $goJs(go.TextBlock,
            {
                font: "bold 20pt serif",
                editable: false  // editing the text automatically updates the model data
                , row: 0, column: 1,
                click: clickNode
            },
            new go.Binding("text", "name").makeTwoWay()),
        $goJs(go.TextBlock,
            {
                font: "20pt 游ゴシック体, 'Yu Gothic', YuGothic",
                editable: false  // editing the text automatically updates the model data
                , row: 1, column: 1,
                click: clickNode
            },
            new go.Binding("text", "detail").makeTwoWay())
    ),
    {
        contextMenu:     // define a context menu for each node
        $goJs(go.Adornment, "Vertical",  // that has one button
            $goJs("ContextMenuButton",
                $goJs(go.TextBlock, "Change Personal"),
                { click: changePersonal })
            // more ContextMenuButtons would go here
        )  // end Adornment
    }
);

//相関図の各shapeを設定
var simpleTemplate = $goJs(go.Node, "Auto",
    // define the node's outer shape, which will surround the TextBlock
    //go.Shape 全体の形を設定
    $goJs(go.Shape,
        {
            parameter1: 20,  // the corner has a large radius
            stroke: $goJs(go.Brush, { color: "blue", }),
            strokeWidth: 2,
            name: "SHAPE",
            portId: "",  // this Shape is the Node's port, not the whole Node
            fromLinkable: false, fromLinkableSelfNode: false, fromLinkableDuplicates: true,
            toLinkable: false, toLinkableSelfNode: false, toLinkableDuplicates: false,
            cursor: "pointer",
            click: clickNode
        },
        new go.Binding("figure", "personality", bindingShapeFigure),
        new go.Binding("fill", "personality", bindingShapeFill)
    ),
    $goJs(go.Picture, {
        click: clickNode
    },
        new go.Binding("source", "", bindingIcon)),
    {
        contextMenu:     // define a context menu for each node
        $goJs(go.Adornment, "Vertical",  // that has one button
            $goJs("ContextMenuButton",
                $goJs(go.TextBlock, "Change Personal"),
                { click: changePersonal })
            // more ContextMenuButtons would go here
        )  // end Adornment
    }
);
// nodeTemplate END

// linkTemplate

var linkTemplate = $goJs(go.Link,  // the whole link panel
    {
        curve: go.Link.Bezier, adjusting: go.Link.Stretch,
        reshapable: true, relinkableFrom: true, relinkableTo: true,
        toShortLength: 3, click: clickLink
    },
    new go.Binding("points").makeTwoWay(),
    new go.Binding("curviness"),
    $goJs(go.Shape,  // the link shape
        { strokeWidth: 3, name: "SHAPE" }),
    $goJs(go.Shape,  // the arrowhead
        { toArrow: "standard", stroke: null }),
    $goJs(go.Panel, "Auto",
        $goJs(go.Shape,  // the label background, which becomes transparent around the edges
            {
                fill: $goJs(go.Brush, "Radial",
                    { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                stroke: null
            }),
        $goJs(go.TextBlock, "transition",  // the label text
            {
                textAlign: "center",
                font: "9pt helvetica, arial, sans-serif",
                margin: 4,
                editable: true  // enable in-place editing
            },
            // editing the text automatically updates the model data
            new go.Binding("text").makeTwoWay())
    )
);

// linkTemplate END

//click

function clickLink(e, obj) {
    if (e === undefined) e = myDiagram.lastInput;
    var doc = e.documentPoint;
    if (obj !== null) {
        var node = obj.part;
        var shape = node.findObject("SHAPE");
        // if (lastStroked !== null && lastStroked !== shape) lastStroked.stroke = null;
        // lastStroked = shape;
        updateInfoBox(e.viewPoint, node.data);
    } else {
        document.getElementById("infoBoxHolder").innerHTML = "";
    }
}

//nodeクリック時
function clickNode(e, obj) {
    if (e === undefined) e = myDiagram.lastInput;
    var doc = e.documentPoint;
    if (obj !== null) {
        var node = obj.part;
        var shape = node.findObject("SHAPE");
        shape.stroke = "Red";
        if (lastStroked !== null && lastStroked !== shape) lastStroked.stroke = null;
        lastStroked = shape;
        updateInfoBox(e.viewPoint, node.data);
    } else {
        if (lastStroked !== null) lastStroked.stroke = null;
        lastStroked = null;
        document.getElementById("infoBoxHolder").innerHTML = "";
    }
}

function updateInfoBox(mousePt, data) {
    var box = document.getElementById("infoBoxHolder");
    box.innerHTML = "";
    var infobox = document.createElement("div");
    infobox.id = "infoBox";
    box.appendChild(infobox);
    Object.keys(data).forEach(function (key) {
        var child = document.createElement("div");
        child.textContent = key + ":" + data[key];
        infobox.appendChild(child);
    })
    box.style.left = mousePt.x + 0 + "px";
    box.style.top = mousePt.y + 0 + "px";
}

// Make sure the infoBox is momentarily hidden if the user tries to mouse over it
var infoBoxH = document.getElementById("infoBoxHolder");
infoBoxH.addEventListener("mousemove", function () {
    var box = document.getElementById("infoBoxHolder");
    box.style.left = parseInt(box.style.left) + "px";
    box.style.top = parseInt(box.style.top) + 30 + "px";
}, false);

var diagramDiv = document.getElementById("gojs");
// Make sure the infoBox is hidden when the mouse is not over the Diagram
diagramDiv.addEventListener("mouseout", function (e) {
    if (lastStroked !== null) lastStroked.stroke = null;
    lastStroked = null;

    var infoBox = document.getElementById("infoBox");
    var elem = document.elementFromPoint(e.clientX, e.clientY);
    if (elem !== null && (elem === infoBox || elem.parentNode === infoBox)) {
        var box = document.getElementById("infoBoxHolder");
        box.style.left = parseInt(box.style.left) + "px";
        box.style.top = parseInt(box.style.top) + 30 + "px";
    } else {
        var box = document.getElementById("infoBoxHolder");
        box.innerHTML = "";
    }
}, false);

//click End

//contextMenu start

function changePersonal(e, obj) {
    //処理を同期化
    myDiagram.startTransaction("change Personal");

    var contextmenu = obj.part;
    var nodedata = contextmenu.data;
    var newPersonality = "other"
    switch (nodedata.personality) {
        case "company": newPersonality = "person"; break;
        case "person": newPersonality = "other"; break;
        case "other": newPersonality = "company"; break;
    }
    myDiagram.model.setDataProperty(nodedata, "personality", newPersonality);
    myDiagram.commitTransaction("change Personal");
    save();
}

//contextMenu END

//binding functions start

function bindingIcon(data, node) {
    if (data.personality == "person") {
        return "assets/_con/images/ic_account_circle_black_24dp_2x.png";
    } else if (data.personality == "company") {
        return "assets/_con/images/ic_domain_black_24dp_2x.png";
    }
    return "assets/_con/images/ic_priority_high_black_24dp_2x.png";
}

// 細かいデフォルトの形は　https://gojs.net/latest/samples/shapes.html 参照
// カスタマイズしたい場合　https://gojs.net/latest/intro/geometry.html 参照
function bindingShapeFigure(personaity) {
    if (personaity == "person") {
        return "Ellipse";
    } else if (personaity == "company") {
        return "Rectangle";
    }
    return "RoundedRectangle";
}

function bindingShapeFill(personaity) {
    if (personaity == "person") {
        return "rgba(220,237,200 ,1)";
    } else if (personaity == "company") {
        return "rgba(215, 204, 200, 1)";
    }
    return "rgba(30, 30, 30, 0.4)";
}

//binding functions end

//layout start
function layout() {
    lay.layeringOption = go.LayeredDigraphLayout.LayerOptimalLinkLength;
}

function resizeTemplate() {
    if (myDiagram.scale < 0.9) {
        myDiagram.nodeTemplate = simpleTemplate;
    } else {
        myDiagram.nodeTemplate = detailTemplate;
    }
}