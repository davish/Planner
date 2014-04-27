/*
    Credit to Prakash Chennupat on Stackoverflow:

    http://stackoverflow.com/users/2221245/prakash-chennupati
*/


var dragObj = new Object();
var dragHeight, dragTarget;
var aboveObj, belowObj;
var containers;
var isIE = (window.ActiveXObject) ? true : false;
var clsDrag;
var panelMenu = null;
var panelDisableDrag = false;
var menuParentObj;

var eventPanelDropped = null;
var eventPanelClosed = null;
var eventPanelSettings = null;
var eventPanelRolled = null;



function startDrag(e, obj) {
    if (!panelDisableDrag) {
        var divs = document.getElementsByTagName("div");
        var i;

        clearSelection();


        if (isIE) {
            obj.style.cssText = "filter:alpha();";
        }
        dragHeight = obj.offsetHeight - 2;
        obj.style.width = (obj.offsetWidth - 2) + "px";

        var objPos = absXY(obj);

        obj.style.left = (objPos.left + 2) + "px";
        obj.style.top = (objPos.top + 2) + "px";
        obj.style.position = "absolute";
        obj.style.marginLeft = "";
        obj.style.marginRight = "";
        obj.style.marginTop = "";
        obj.style.opacity = 0.75;
        if ((isIE) && (obj.filters) && (obj.filters.alpha)) {
            obj.filters.alpha.opacity = 75;
        }
        obj.style.cursor = "pointer";
        dragTarget = obj.parentNode;
        dragTarget.removeChild(obj);
        document.body.appendChild(obj);
        dragTarget.className = "dragContainerTarget";
        dragTarget.style.height = (dragHeight) + "px";

        aboveObj = dragTarget.previousSibling;
        while (aboveObj.nodeType != dragTarget.nodeType) {
            aboveObj = aboveObj.previousSibling;
        }

        belowObj = dragTarget.nextSibling;
        while (belowObj.nodeType != dragTarget.nodeType) {
            belowObj = belowObj.nextSibling;
        }

        dragTarget.parentNode.removeChild(aboveObj);
        dragTarget.parentNode.removeChild(belowObj);

        containers = new Array();

        subContainers = new Array();

        containers.push(dragTarget);
        for (i = 0; i < divs.length; i++) {
            if (divs[i].className.toLowerCase() == "dragcontainerunused") {
                containers.push(divs[i]);
            }
        }

        for (i = 0; i < divs.length; i++) {
            if (divs[i].className.toLowerCase() == "dragSubcontainerunused") {
                subContainers.push(divs[i]);
            }
        }


        dragStart(e, obj, true, true, null, onDrag, stopDrag);
    }
}

function onDrag() {
    var i;
    var dist = 9999999;
    var newdist;
    var halfWidth = dragObj.elNode.offsetWidth / 2;
    var newTarget;
    var objPos;

    for (i = 0; i < containers.length; i++) {
        objPos = absXY(containers[i]);
        newdist = Math.sqrt(Math.pow(dragObj.mouseX - (objPos.left + halfWidth), 2) + Math.pow(dragObj.mouseY - objPos.top, 2))
        if (newdist < dist) {
            dist = newdist;
            newTarget = containers[i];
        }
    }

    if (dragTarget != newTarget) {
        dragTarget.className = "dragContainerUnUsed";
        dragTarget.style.cssText = "";
        dragTarget = newTarget;
        dragTarget.className = "dragContainerTarget";
        dragTarget.style.height = (dragHeight) + "px";
    }


}

function stopDrag() {
    var containerObj;
    var cols = new Array();
    var c;
    var rows = new Array();
    var r;
    var id;
    var i, ic, ir;
    var fullResults;

    dragObj.elNode.style.cssText = "";
    dragTarget.style.cssText = "";
    dragTarget.className = "dragContainerUsed";

    dragTarget.parentNode.insertBefore(aboveObj, dragTarget);
    if (dragTarget.nextSibling) {
        dragTarget.parentNode.insertBefore(belowObj, dragTarget.nextSibling);
    } else {
        dragTarget.parentNode.appendChild(belowObj);
    }

    document.body.removeChild(dragObj.elNode);
    dragTarget.appendChild(dragObj.elNode);

    //calc position of drop to update database
    fullResults = new Array;
    containerObj = dragObj.elNode.parentNode.parentNode.parentNode;

    for (i = 0; i < containerObj.childNodes.length; i++) {
        if ((containerObj.childNodes[i].className + "").toLowerCase() == "dragcolumn") {
            cols.push(containerObj.childNodes[i]);
        }
    }

    for (ic = 0; ic < cols.length; ic++) {
        rows = new Array();

        for (i = 0; i < cols[ic].childNodes.length; i++) {
            if ((cols[ic].childNodes[i].className + "").toLowerCase() == "dragcontainerused") {
                rows.push(cols[ic].childNodes[i]);
            }
        }

        for (ir = 0; ir < rows.length; ir++) {
            fullResults.push(rows[ir].getElementsByTagName("input")[0].value.split("|")[0]);
            fullResults.push(ic);
            fullResults.push(ir);
        }
    }

    try {
        eventPanelDropped(fullResults.join("|"));
    } catch (e) { }
}

function clearSelection() {
    if (document.selection && document.selection.empty) {
        try {
            document.selection.empty();
        } catch (e) { }
    } else if (window.getSelection) {
        try {
            var sel = window.getSelection();
            if (sel && sel.removeAllRanges)
                sel.removeAllRanges();
        } catch (e) { }
    }
}

function absXY(obj) {
    var left = 0;
    var top = 0;
    if (obj.offsetParent) {
        left = obj.offsetLeft;
        top = obj.offsetTop;
        while (obj = obj.offsetParent) {
            left += obj.offsetLeft;
            top += obj.offsetTop;
        }
    }
    return { "top": top, "left": left };
}

function dragStart(event, obj, horizontal, vertical, objvalue, onsize, ondrop) {
    isSizing = true;

    if (dragObj.zIndex == undefined) {
        dragObj.zIndex = 1045;
    }

    dragObj.elNode = obj;

    // Save starting positions of cursor and element.
    dragObj.onsize = onsize;
    dragObj.ondrop = ondrop;
    dragObj.objvalue = objvalue;

    dragObj.horizontal = horizontal;
    dragObj.vertical = vertical;

    dragObj.cursorStartX = (isIE) ? (window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft) : (event.clientX + window.scrollX);
    dragObj.cursorStartY = (isIE) ? (window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop) : (event.clientY + window.scrollY);
    dragObj.elStartLeft = parseInt(dragObj.elNode.style.left, 10);
    dragObj.elStartTop = parseInt(dragObj.elNode.style.top, 10);

    if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
    if (isNaN(dragObj.elStartTop)) dragObj.elStartTop = 0;

    // Update element's z-index.
    dragObj.elNode.style.zIndex = ++dragObj.zIndex;

    // Capture mousemove and mouseup events on the page.
    if (isIE) {
        document.attachEvent("onmousemove", dragGo);
        document.attachEvent("onmouseup", dragStop);
        window.event.cancelBubble = true;
        window.event.returnValue = false;
    } else {
        document.addEventListener("mousemove", dragGo, true);
        document.addEventListener("mouseup", dragStop, true);
        event.preventDefault();
    }
}

function dragGo(event) {
    var x, y;

    // Get cursor position with respect to the page.
    if (isIE) {
        x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
    } else {
        x = event.clientX + window.scrollX;
        y = event.clientY + window.scrollY;
    }

    dragObj.mouseX = x;
    dragObj.mouseY = y;

    // Move drag element by the same amount the cursor has moved.
    if (dragObj.horizontal) dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
    if (dragObj.vertical) dragObj.elNode.style.top = (dragObj.elStartTop + y - dragObj.cursorStartY) + "px";

    if (isIE) {
        window.event.cancelBubble = true;
        window.event.returnValue = false;
    } else {
        event.preventDefault();
    }

    if (dragObj.onsize) dragObj.onsize();
}

function dragStop(event) {
    // Stop capturing mousemove and mouseup events.
    if (isIE) {
        document.detachEvent("onmousemove", dragGo);
        document.detachEvent("onmouseup", dragStop);
    } else {
        document.removeEventListener("mousemove", dragGo, true);
        document.removeEventListener("mouseup", dragStop, true);
    }

    isSizing = false;

    if (dragObj.ondrop) dragObj.ondrop();
}