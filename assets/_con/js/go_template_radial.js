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
var myDiagram =
    $goJs(go.Diagram, "gojs", // must be the ID or reference to div
        {
            // initialAutoScale: go.Diagram.Uniform,
            initialContentAlignment: go.Spot.Center,
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            padding: 10,
            isReadOnly: false,
            layout: $goJs(RadialLayout, {
                maxLayers: 4, layerThickness: 200,
                commitLayers: function () {
                    // optional: add circles in the background
                    // need to remove any old ones first
                    var diagram = this.diagram;
                    var gridlayer = diagram.findLayer("Grid");
                    var circles = new go.Set(go.Part);
                    gridlayer.parts.each(function (circle) {
                        if (circle.name === "CIRCLE") circles.add(circle);
                    });
                    circles.each(function (circle) {
                        diagram.remove(circle);
                    });
                    // add circles centered at the root
                    for (var lay = 1; lay <= this.maxLayers; lay++) {
                        var radius = lay * this.layerThickness;
                        var circle =
                            $goJs(go.Part,
                                { name: "CIRCLE", layerName: "Grid" },
                                { locationSpot: go.Spot.Center, location: this.root.location },
                                $goJs(go.Shape, "Circle",
                                    { width: radius * 2, height: radius * 2 },
                                    { fill: "rgba(200,200,200,0.2)", stroke: null }));
                        diagram.add(circle);
                    }
                }
            }),
            "animationManager.isEnabled": false
        });


// 値の設定を分岐したい場合go.bindingを用いる
//Binding(設定したいプロパティ,値の入っているJsonのプロパティ名,データ加工関数)
// ex. new go.Binding("location", "loc", go.Point.parse)
function init() {

    // define the Node template
    myDiagram.nodeTemplate = detailTemplate;

    myDiagram.nodeTemplateMap.add("Root", rootNodeTemplate);

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

// shows when hovering over a node
var commonToolTip =
    $goJs(go.Adornment, "Auto",
        { isShadowed: true },
        $goJs(go.Shape, { fill: "#FFFFCC" }),
        $goJs(go.Panel, "Vertical",
            { margin: 3 },
            $goJs(go.TextBlock,  // bound to Adornment because of call to Binding.ofObject
                new go.Binding("text", "", makeToolTip).ofObject())
        )  // end Vertical Panel
    );  // end Adornment

function makeToolTip(node) {
    var detailDatas = [];
    var viewString;

    //本来は会社用、人用に表示を切り替え
    Object.keys(node.data).forEach(function (key) {
        var detailData = key + " : " + node.data[key];
        detailDatas.push(detailData);
    });
    detailDatas.forEach(function (data, index, array) {
        if (index != 0) {
            viewString = viewString + "\n";
        }
        viewString = viewString + data;
    });
    return viewString;
}

var rootNodeTemplate = $goJs(go.Node, "Auto",
    {
        locationSpot: go.Spot.Center,
        selectionAdorned: false,
        toolTip: commonToolTip,
        contextMenu:     // define a context menu for each node
        $goJs(go.Adornment, "Vertical",  // that has one button
            $goJs("ContextMenuButton",
                $goJs(go.TextBlock, "Change Personal"),
                { click: changePersonal })
            // more ContextMenuButtons would go here
        )  // end Adornment
    },
    $goJs(go.Shape,
        {
            parameter1: 20,  // the corner has a large radius
            stroke: $goJs(go.Brush, { color: "blue", }),
            // stroke: null,
            strokeWidth: 2,
            name: "SHAPE",
            portId: "",  // this Shape is the Node's port, not the whole Node
            fromLinkable: false, fromLinkableSelfNode: false, fromLinkableDuplicates: true,
            toLinkable: false, toLinkableSelfNode: false, toLinkableDuplicates: true,
            cursor: "pointer",
            // fill: null
        },
        new go.Binding("figure", "personality", bindingShapeFigure)
        , new go.Binding("fill", "personality", bindingShapeFill)
    ),
    $goJs(go.Panel, "Table", { defaultAlignment: go.Spot.Left },
        $goJs(go.Picture,
            {
                row: 0, alignment: go.Spot.Center
            }, new go.Binding("source", "", bindingIcon)),
        $goJs(go.TextBlock,
            {
                font: "bold 20rem serif",
                name: "VIEWBLOCK",
                editable: false  // editing the text automatically updates the model data
                , row: 1, alignment: go.Spot.Center
            },
            new go.Binding("text", "name").makeTwoWay())
    )
)

// nodeTemplate START

var detailTemplate = $goJs(go.Node, "Auto", {
    locationSpot: go.Spot.Center,
    locationObjectName: "SHAPE",
    click: clickNode,
    toolTip: commonToolTip  // Node.location is the center of the Shape
},
    // define the node's outer shape, which will surround the TextBlock
    //go.Shape 全体の形を設定
    $goJs(go.Shape,
        {
            parameter1: 20,  // the corner has a large radius
            stroke: $goJs(go.Brush, { color: "blue", }),
            // stroke: null,
            strokeWidth: 2,
            name: "SHAPE",
            portId: "",  // this Shape is the Node's port, not the whole Node
            fromLinkable: false, fromLinkableSelfNode: false, fromLinkableDuplicates: true,
            toLinkable: false, toLinkableSelfNode: false, toLinkableDuplicates: true,
            cursor: "pointer",
            // fill: null
        },
        new go.Binding("figure", "personality", bindingShapeFigure)
        , new go.Binding("fill", "personality", bindingShapeFill)
    ),
    $goJs(go.Panel, "Table", { defaultAlignment: go.Spot.Left },
        $goJs(go.Picture,
            {
                row: 0, alignment: go.Spot.Center
            }, new go.Binding("source", "", bindingIcon)),
        $goJs(go.TextBlock,
            {
                font: "bold 20rem serif",
                name: "VIEWBLOCK",
                editable: false  // editing the text automatically updates the model data
                , row: 1, alignment: go.Spot.Center
            },
            new go.Binding("text", "name", function (name) {
                if (name.length > 9) {
                    return name.substr(0, 7) + "...";
                } else {
                    return name;
                }
            }).makeTwoWay())
    ),
    {
        contextMenu:     // define a context menu for each node
        $goJs(go.Adornment, "Vertical",  // that has one button
            $goJs("ContextMenuButton",
                $goJs(go.TextBlock, "属性変更", { font: "20　游ゴシック体, 'Yu Gothic', YuGothic" }),
                { click: changePersonal }),
            $goJs("ContextMenuButton",
                $goJs(go.TextBlock, "関係者追加", { font: "20rem　游ゴシック体, 'Yu Gothic', YuGothic" }),
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
        { toArrow: "standard", stroke: null })
);

// linkTemplate END

//click

function clickLink(e, obj) {
    if (e === undefined) e = myDiagram.lastInput;
    var doc = e.documentPoint;
    if (obj !== null) {
        var node = obj.part;
        var shape = node.findObject("SHAPE");
        updateInfoBox(e.viewPoint, node.data);
    } else {
        document.getElementById("infoBoxHolder").innerHTML = "";
    }
}

//nodeクリック時
// function clickNode(e, obj) {
//     if (e === undefined) e = myDiagram.lastInput;
//     var doc = e.documentPoint;
//     if (obj !== null) {
//         var node = obj.part;
//         var shape = node.findObject("SHAPE");
//         updateInfoBox(e.viewPoint, node.data);
//     } else {
//         document.getElementById("infoBoxHolder").innerHTML = "";
//     }
// }


//中心変更
function clickNode(e, obj) {
    var diagram = obj.diagram;
    if (diagram === null) return;
    // all other nodes should be visible and use the default category
    diagram.nodes.each(function (n) {
        n.visible = true;
        if (n !== obj) n.category = "";
    })
    // make this Node the root
    obj.category = "Root";
    // tell the RadialLayout what the root node should be
    diagram.layout.root = obj;
    diagram.layoutDiagram(true);
    save();
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
