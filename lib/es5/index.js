'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var clone_1 = createCommonjsModule(function (module) {
var clone = (function() {

function _instanceof(obj, type) {
  return type != null && obj instanceof type;
}

var nativeMap;
try {
  nativeMap = Map;
} catch(_) {
  // maybe a reference error because no `Map`. Give it a dummy value that no
  // value will ever be an instanceof.
  nativeMap = function() {};
}

var nativeSet;
try {
  nativeSet = Set;
} catch(_) {
  nativeSet = function() {};
}

var nativePromise;
try {
  nativePromise = Promise;
} catch(_) {
  nativePromise = function() {};
}

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
 * @param `includeNonEnumerable` - set to true if the non-enumerable properties
 *    should be cloned as well. Non-enumerable properties on the prototype
 *    chain will be ignored. (optional - false by default)
*/
function clone(parent, circular, depth, prototype, includeNonEnumerable) {
  if (typeof circular === 'object') {
    depth = circular.depth;
    prototype = circular.prototype;
    includeNonEnumerable = circular.includeNonEnumerable;
    circular = circular.circular;
  }
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined')
    circular = true;

  if (typeof depth == 'undefined')
    depth = Infinity;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      return null;

    if (depth === 0)
      return parent;

    var child;
    var proto;
    if (typeof parent != 'object') {
      return parent;
    }

    if (_instanceof(parent, nativeMap)) {
      child = new nativeMap();
    } else if (_instanceof(parent, nativeSet)) {
      child = new nativeSet();
    } else if (_instanceof(parent, nativePromise)) {
      child = new nativePromise(function (resolve, reject) {
        parent.then(function(value) {
          resolve(_clone(value, depth - 1));
        }, function(err) {
          reject(_clone(err, depth - 1));
        });
      });
    } else if (clone.__isArray(parent)) {
      child = [];
    } else if (clone.__isRegExp(parent)) {
      child = new RegExp(parent.source, __getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (clone.__isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      if (Buffer.allocUnsafe) {
        // Node.js >= 4.5.0
        child = Buffer.allocUnsafe(parent.length);
      } else {
        // Older Node.js versions
        child = new Buffer(parent.length);
      }
      parent.copy(child);
      return child;
    } else if (_instanceof(parent, Error)) {
      child = Object.create(parent);
    } else {
      if (typeof prototype == 'undefined') {
        proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
      }
      else {
        child = Object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    if (_instanceof(parent, nativeMap)) {
      parent.forEach(function(value, key) {
        var keyChild = _clone(key, depth - 1);
        var valueChild = _clone(value, depth - 1);
        child.set(keyChild, valueChild);
      });
    }
    if (_instanceof(parent, nativeSet)) {
      parent.forEach(function(value) {
        var entryChild = _clone(value, depth - 1);
        child.add(entryChild);
      });
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = Object.getOwnPropertyDescriptor(proto, i);
      }

      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(parent);
      for (var i = 0; i < symbols.length; i++) {
        // Don't need to worry about cloning a symbol because it is a primitive,
        // like a number or string.
        var symbol = symbols[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
        if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
          continue;
        }
        child[symbol] = _clone(parent[symbol], depth - 1);
        if (!descriptor.enumerable) {
          Object.defineProperty(child, symbol, {
            enumerable: false
          });
        }
      }
    }

    if (includeNonEnumerable) {
      var allPropertyNames = Object.getOwnPropertyNames(parent);
      for (var i = 0; i < allPropertyNames.length; i++) {
        var propertyName = allPropertyNames[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
        if (descriptor && descriptor.enumerable) {
          continue;
        }
        child[propertyName] = _clone(parent[propertyName], depth - 1);
        Object.defineProperty(child, propertyName, {
          enumerable: false
        });
      }
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function clonePrototype(parent) {
  if (parent === null)
    return null;

  var c = function () {};
  c.prototype = parent;
  return new c();
};

// private utility functions

function __objToStr(o) {
  return Object.prototype.toString.call(o);
}
clone.__objToStr = __objToStr;

function __isDate(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Date]';
}
clone.__isDate = __isDate;

function __isArray(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Array]';
}
clone.__isArray = __isArray;

function __isRegExp(o) {
  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
}
clone.__isRegExp = __isRegExp;

function __getRegExpFlags(re) {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
}
clone.__getRegExpFlags = __getRegExpFlags;

return clone;
})();

if ( module.exports) {
  module.exports = clone;
}
});

// eventToCellLocation(event)
// {row: 2, column: 3} ^-^
var eventToCellLocation = function (e) {
    var target;
    if (e.touches) {
        var touch = e.touches[0];
        target = document.elementFromPoint(touch.clientX, touch.clientY);
    }
    else {
        target = e.target;
        while (target.tagName !== 'TD') {
            target = target.parentNode;
        }
    }
    return {
        row: target.parentNode.rowIndex,
        column: target.cellIndex
    };
};
/**
 * 给元素添加事件监听并在卸载时清除监听
 */
var useEventListener = function (eventName, handler, element, option) {
    if (element === void 0) { element = window; }
    if (option === void 0) { option = false; }
    var savedHandler = React.useRef(handler);
    React.useEffect(function () {
        savedHandler.current = handler;
    }, [handler]);
    React.useEffect(function () {
        var isSupported = element && element.addEventListener;
        if (!isSupported)
            return;
        var eventListener = function (event) { return savedHandler.current(event); };
        element.addEventListener(eventName, eventListener, option);
        return function () {
            element.removeEventListener(eventName, eventListener, option);
        };
    }, [eventName, element, option]);
};

var DragSelect = function (props) {
    var _a = React.useState(false), selectionStarted = _a[0], setSelectionStarted = _a[1];
    var _b = React.useState(0), startRow = _b[0], setStartRow = _b[1];
    var _c = React.useState(0), startColumn = _c[0], setStartColumn = _c[1];
    var _d = React.useState(0), endRow = _d[0], setEndRow = _d[1];
    var _e = React.useState(0), endColumn = _e[0], setEndColumn = _e[1];
    var _f = React.useState(false), addMode = _f[0], setAddMode = _f[1];
    var value = props.value, onChange = props.onChange;
    // events
    var handleTouchEndWindow = function (e) {
        var isLeftClick = e.button === 0;
        var isTouch = e.type !== 'mousedown';
        if (selectionStarted && (isLeftClick || isTouch)) {
            var target = clone_1(value);
            var minRow = Math.min(startRow, endRow);
            var maxRow = Math.max(startRow, endRow);
            for (var row = minRow; row <= maxRow; row++) {
                var minColumn = Math.min(startColumn, endColumn);
                var maxColumn = Math.max(startColumn, endColumn);
                for (var column = minColumn; column <= maxColumn; column++) {
                    target[row][column] = addMode;
                }
            }
            setSelectionStarted(false);
            onChange(target);
        }
    };
    var handleTouchStartCell = function (e) {
        var isLeftClick = e.button === 0;
        var isTouch = e.type !== 'mousedown';
        if (!selectionStarted && (isLeftClick || isTouch)) {
            e.preventDefault();
            var _a = eventToCellLocation(e), row = _a.row, column = _a.column;
            setSelectionStarted(true);
            setStartRow(row);
            setStartColumn(column);
            setEndRow(row);
            setEndColumn(column);
            setAddMode(!value[row][column]);
        }
    };
    var handleTouchMoveCell = function (e) {
        if (selectionStarted) {
            e.preventDefault();
            var _a = eventToCellLocation(e), row = _a.row, column = _a.column;
            if (endRow !== row || endColumn !== column) {
                setEndRow(row);
                setEndColumn(column);
            }
        }
    };
    var isCellBeingSelected = function (row, column) {
        var minRow = Math.min(startRow, endRow);
        var maxRow = Math.max(startRow, endRow);
        var minColumn = Math.min(startColumn, endColumn);
        var maxColumn = Math.max(startColumn, endColumn);
        return selectionStarted && row >= minRow && row <= maxRow && column >= minColumn && column <= maxColumn;
    };
    // use-hooks
    useEventListener('mouseup', handleTouchEndWindow);
    useEventListener('touchend', handleTouchEndWindow);
    var renderRows = function () {
        return React__default.Children.map(props.children, function (tr, i) {
            return (React__default.createElement("tr", __assign({ key: i }, tr.props), React__default.Children.map(tr.props.children, function (cell, j) { return (React__default.createElement(Cell, __assign({ key: j + "_CELL", onTouchStart: handleTouchStartCell, onTouchMove: handleTouchMoveCell, selected: props.value[i][j] }, cell.props, { selecting: isCellBeingSelected(i, j) ? 1 : 0 }), cell.props.children)); })));
        });
    };
    return (React__default.createElement("table", { className: 'table-drag-select' },
        React__default.createElement("tbody", null, renderRows())));
};
// Cell Components
var Cell = function (props) {
    var tdRef = React.useRef();
    var _a = props.className, className = _a === void 0 ? '' : _a, disabled = props.disabled, selecting = props.selecting, selected = props.selected, onTouchStart = props.onTouchStart, onTouchMove = props.onTouchMove;
    if (disabled) {
        className += ' cell-disabled';
    }
    else {
        className += ' cell-enabled';
        if (selected) {
            className += ' cell-selected';
        }
        if (selecting) {
            className += ' cell-being-selected';
        }
    }
    var handleTouchStart = function (e) {
        if (!disabled) {
            onTouchStart(e);
        }
    };
    var handleTouchMove = function (e) {
        if (!disabled) {
            onTouchMove(e);
        }
    };
    // use-hooks
    useEventListener('touchstart', handleTouchStart, tdRef.current, {
        passive: false
    });
    useEventListener('touchend', handleTouchMove, tdRef.current, {
        passive: false
    });
    return (React__default.createElement("td", __assign({ ref: tdRef, className: className, onMouseDown: handleTouchStart, onMouseMove: handleTouchMove }, props), props.children || React__default.createElement("span", null, "\u00A0")));
};

module.exports = DragSelect;
//# sourceMappingURL=index.js.map
