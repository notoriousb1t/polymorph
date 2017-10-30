var polymorph = (function (exports) {
'use strict';

function isString(obj) {
    return typeof obj === 'string';
}

var selectorRegex = /^([#|\.]|path)/i;
function getPath(selector) {
    if (isString(selector)) {
        if (!selectorRegex.test(selector)) {
            return selector;
        }
        selector = document.querySelector(selector);
    }
    return selector.getAttribute('d');
}

var _ = undefined;
var V = 'V';
var H = 'H';
var Z = 'Z';
var M = 'M';
var C = 'C';
var S = 'S';
var Q = 'Q';
var T = 'T';
var INSERT = 'insert';
var PRESERVE = 'preserve';
var CLOCKWISE = 'clockwise';

var math = Math;
var abs = math.abs;
var min = math.min;
var max = math.max;
var floor = math.floor;
var round = math.round;
var sqrt = math.sqrt;
var quadraticRatio = 2.0 / 3;
var EPSILON = Math.pow(2, -52);

function renderPath(ns) {
    if (isString(ns)) {
        return ns;
    }
    var parts = [];
    for (var i = 0; i < ns.length; i++) {
        var n = ns[i];
        parts.push(M, formatNumber(n[0]), formatNumber(n[1]), C);
        for (var f = 2; f < n.length; f++) {
            parts.push(formatNumber(n[f]));
        }
    }
    return parts.join(' ');
}
function formatNumber(n) {
    return (floor(n * 100) / 100).toString();
}

function raiseError() {
    throw new Error(Array.prototype.join.call(arguments, ' '));
}

var userAgent = typeof window !== 'undefined' && window.navigator.userAgent;
var isEdge = /(MSIE |Trident\/|Edge\/)/i.test(userAgent);

var arrayConstructor = isEdge ? Array : Float32Array;
function createNumberArray(n) {
    return new arrayConstructor(n);
}

function reversePoints(s) {
    var d = createNumberArray(s.length);
    var slen = s.length;
    d[0] = s[slen - 2];
    d[1] = s[slen - 1];
    var k = 1;
    for (var i = s.length - 3; i > -1; i -= 6) {
        d[++k] = s[i - 1];
        d[++k] = s[i];
        d[++k] = s[i - 3];
        d[++k] = s[i - 2];
        d[++k] = s[i - 5];
        d[++k] = s[i - 4];
    }
    return d;
}

function fillObject(dest, src) {
    for (var key in src) {
        if (!dest.hasOwnProperty(key)) {
            dest[key] = src[key];
        }
    }
    return dest;
}

function fillSegments(larger, smaller) {
    var largeLen = larger.length;
    var smallLen = smaller.length;
    if (largeLen < smallLen) {
        return fillSegments(smaller, larger);
    }
    smaller.length = largeLen;
    for (var i = smallLen; i < largeLen; i++) {
        var l = larger[i];
        var d = createNumberArray(l.d.length);
        for (var k = 0; k < l.d.length; k += 2) {
            d[k] = l.ox;
            d[k + 1] = l.oy;
        }
        smaller[i] = fillObject({ d: d }, l);
    }
}

function rotatePoints(ns, count) {
    var len = ns.length;
    var rightLen = len - count;
    var buffer = Array(count);
    var i;
    for (i = 0; i < count; i++) {
        buffer[i] = ns[i];
    }
    for (i = count; i < len; i++) {
        ns[i - count] = ns[i];
    }
    for (i = 0; i < count; i++) {
        ns[rightLen + i] = buffer[i];
    }
}

function distance(x1, y1, x2, y2) {
    return sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function normalizePoints(x, y, ns) {
    var len = ns.length;
    if (ns[len - 2] !== ns[0] || ns[len - 1] !== ns[1]) {
        return;
    }
    var buffer = ns.slice(2);
    len = buffer.length;
    var index, minAmount;
    for (var i = 0; i < len; i += 6) {
        var next = distance(x, y, buffer[i], buffer[i + 1]);
        if (minAmount === _ || next < minAmount) {
            minAmount = next;
            index = i;
        }
    }
    rotatePoints(buffer, index);
    ns[0] = buffer[len - 2];
    ns[1] = buffer[len - 1];
    for (var i = 0; i < buffer.length; i++) {
        ns[i + 2] = buffer[i];
    }
}

function fillPoints(matrix, addPoints) {
    var ilen = matrix[0].length;
    for (var i = 0; i < ilen; i++) {
        var left = matrix[0][i];
        var right = matrix[1][i];
        var totalLength = max(left.length + addPoints, right.length + addPoints);
        matrix[0][i] = fillSubpath(left, totalLength);
        matrix[1][i] = fillSubpath(right, totalLength);
    }
}
function fillSubpath(ns, totalLength) {
    var result = createNumberArray(totalLength);
    var slen = ns.length;
    var totalNeeded = totalLength - slen;
    var ratio = totalNeeded / slen;
    var remaining = totalNeeded;
    result[0] = ns[0];
    result[1] = ns[1];
    var k = 1, j = 1;
    while (j < totalLength - 1) {
        result[j + 1] = ns[k + 1];
        result[j + 2] = ns[k + 2];
        result[j + 3] = ns[k + 3];
        result[j + 4] = ns[k + 4];
        var dx = result[j + 5] = ns[k + 5];
        var dy = result[j + 6] = ns[k + 6];
        j += 6;
        k += 6;
        if (remaining) {
            var total = round(ratio);
            if (k === slen - 1) {
                total = totalLength - j;
            }
            for (var i = 0; i < total && remaining > 0; i++) {
                result[j + 1] = result[j + 3] = result[j + 5] = dx;
                result[j + 2] = result[j + 4] = result[j + 6] = dy;
                j += 6;
                remaining -= 6;
            }
        }
    }
    return result;
}

function ctns(a, b1, b2) {
    return (a >= b1 && a <= b2) || (a >= b2 && a <= b1);
}
function intersects(x1, y1, x2, y2, x3, y3, x4, y4) {
    var d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (d === 0) {
        return false;
    }
    var x = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4) / d;
    var y = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4) / d;
    return ctns(x, x1, x2) && ctns(y, y1, y2) && ctns(x, x3, x4) && ctns(y, y3, y4);
}

function sizeDesc(a, b) {
    return b.p - a.p;
}
function normalizePaths(left, right, options) {
    var leftPath = left.data.slice().sort(sizeDesc);
    var rightPath = right.data.slice().sort(sizeDesc);
    if (leftPath.length !== rightPath.length) {
        if (options.fillStrategy === INSERT) {
            fillSegments(leftPath, rightPath);
        }
        else {
            raiseError('fillStrategy:preserve requires equal lengths');
        }
    }
    var matrix = [leftPath.map(toPoints), rightPath.map(toPoints)];
    if (options.wind !== PRESERVE) {
        var goClockwise = options.wind === CLOCKWISE;
        for (var i = 0; i < leftPath.length; i++) {
            if (isClockwise(leftPath[i]) === goClockwise) {
                leftPath[i].d = reversePoints(leftPath[i].d);
            }
            if (isClockwise(rightPath[i]) === goClockwise) {
                rightPath[i].d = reversePoints(rightPath[i].d);
            }
        }
    }
    if (!!options.align) {
        for (var i = 0; i < leftPath.length; i++) {
            var ls = leftPath[i];
            normalizePoints(ls.x, ls.y, matrix[0][i]);
            var rs = rightPath[i];
            normalizePoints(rs.x, rs.y, matrix[1][i]);
        }
    }
    if (options.fillStrategy === INSERT) {
        fillPoints(matrix, options.addPoints * 6);
    }
    return matrix;
}
function toPoints(p) {
    return p.d;
}
function isClockwise(path) {
    var pts = path.d;
    var n = pts.length;
    var x4 = path.x + path.w;
    var y4 = path.y + path.h;
    var isUpper = path.ox - path.x > 0;
    var x1 = pts[n - 2];
    var y1 = pts[n - 1];
    for (var i = 0; i < n; i += 6) {
        var x2 = pts[i];
        var y2 = pts[i + 1];
        if (intersects(x1, y1, x2, y2, path.x, path.y, x4, y4)) {
            var forward = x2 - x1 > 0;
            return (forward && isUpper) || (!forward && !isUpper);
        }
    }
    return false;
}

var defaultOptions = {
    addPoints: 5,
    align: true,
    fillStrategy: 'insert',
    wind: 'clockwise'
};
function interpolatePath(paths, options) {
    options = fillObject(options, defaultOptions);
    if (!paths || paths.length < 2) {
        raiseError('invalid arguments');
    }
    var hlen = paths.length - 1;
    var items = Array(hlen);
    for (var h = 0; h < hlen; h++) {
        items[h] = getPathInterpolator(paths[h], paths[h + 1], options);
    }
    return function (offset) {
        var d = hlen * offset;
        var flr = min(floor(d), hlen - 1);
        return renderPath(items[flr]((d - flr) / (flr + 1)));
    };
}
function getPathInterpolator(left, right, options) {
    var matrix = normalizePaths(left, right, options);
    var n = matrix[0].length;
    return function (offset) {
        if (abs(offset - 0) < EPSILON) {
            return left.path;
        }
        if (abs(offset - 1) < EPSILON) {
            return right.path;
        }
        var results = Array(n);
        for (var h = 0; h < n; h++) {
            results[h] = mixPoints(matrix[0][h], matrix[1][h], offset);
        }
        return results;
    };
}
function mixPoints(a, b, o) {
    var alen = a.length;
    var results = createNumberArray(alen);
    for (var i = 0; i < alen; i++) {
        results[i] = a[i] + (b[i] - a[i]) * o;
    }
    return results;
}

function coalesce(current, fallback) {
    return current === _ ? fallback : current;
}

var argLengths = { M: 2, H: 1, V: 1, L: 2, Z: 0, C: 6, S: 4, Q: 4, T: 2 };
function m(ctx) {
    var n = ctx.t;
    addSegment(ctx, n[0], n[1]);
}
function h(ctx) {
    addCurve(ctx, _, _, _, _, ctx.t[0], _);
}
function v(ctx) {
    addCurve(ctx, _, _, _, _, _, ctx.t[0]);
}
function l(ctx) {
    var n = ctx.t;
    addCurve(ctx, _, _, _, _, n[0], n[1]);
}
function z(ctx) {
    addCurve(ctx, _, _, _, _, ctx.p[0], ctx.p[1]);
}
function c(ctx) {
    var n = ctx.t;
    addCurve(ctx, n[0], n[1], n[2], n[3], n[4], n[5]);
    ctx.cx = n[2];
    ctx.cy = n[3];
}
function s(ctx) {
    var n = ctx.t;
    var isInitialCurve = ctx.lc !== S && ctx.lc !== C;
    var x1 = isInitialCurve ? _ : ctx.x * 2 - ctx.cx;
    var y1 = isInitialCurve ? _ : ctx.y * 2 - ctx.cy;
    addCurve(ctx, x1, y1, n[0], n[1], n[2], n[3]);
    ctx.cx = n[0];
    ctx.cy = n[1];
}
function q(ctx) {
    var n = ctx.t;
    var cx1 = n[0];
    var cy1 = n[1];
    var dx = n[2];
    var dy = n[3];
    var x = ctx.x;
    var y = ctx.y;
    addCurve(ctx, x + (cx1 - x) * quadraticRatio, y + (cy1 - y) * quadraticRatio, dx + (cx1 - dx) * quadraticRatio, dy + (cy1 - dy) * quadraticRatio, dx, dy);
    ctx.cx = cx1;
    ctx.cy = cy1;
}
function t(ctx) {
    var n = ctx.t;
    var dx = n[0];
    var dy = n[1];
    var x = ctx.x;
    var y = ctx.y;
    var x1, y1, x2, y2;
    if (ctx.lc === Q || ctx.lc === T) {
        var cx1 = x * 2 - ctx.cx;
        var cy1 = y * 2 - ctx.cy;
        x1 = x + (cx1 - x) * quadraticRatio;
        y1 = y + (cy1 - y) * quadraticRatio;
        x2 = dx + (cx1 - dx) * quadraticRatio;
        y2 = dy + (cy1 - dy) * quadraticRatio;
    }
    else {
        x1 = x2 = x;
        y1 = y2 = y;
    }
    addCurve(ctx, x1, y1, x2, y2, dx, dy);
    ctx.cx = x2;
    ctx.cy = y2;
}
var parsers = {
    M: m,
    H: h,
    V: v,
    L: l,
    Z: z,
    C: c,
    S: s,
    Q: q,
    T: t
};
function addSegment(ctx, x, y) {
    ctx.x = x;
    ctx.y = y;
    var p = [x, y];
    ctx.s.push(p);
    ctx.p = p;
}
function addCurve(ctx, x1, y1, x2, y2, dx, dy) {
    var x = ctx.x;
    var y = ctx.y;
    ctx.x = coalesce(dx, x);
    ctx.y = coalesce(dy, y);
    ctx.p.push(coalesce(x1, x), (y1 = coalesce(y1, y)), (x2 = coalesce(x2, x)), (y2 = coalesce(y2, y)), ctx.x, ctx.y);
    ctx.lc = ctx.c;
}
function convertToAbsolute(ctx) {
    if (ctx.c === V) {
        ctx.t[0] += ctx.y;
    }
    else if (ctx.c === H) {
        ctx.t[0] += ctx.x;
    }
    else {
        for (var j = 0; j < ctx.t.length; j += 2) {
            ctx.t[j] += ctx.x;
            ctx.t[j + 1] += ctx.y;
        }
    }
}
function parseSegments(d) {
    return d
        .replace(/[\^\s]?([mhvlzcsqta]|\-?\d*\.?\d+)[,\$\s]?/gi, ' $1')
        .replace(/([mhvlzcsqta])/gi, ' $1')
        .trim()
        .split('  ')
        .map(parseSegment);
}
function parseSegment(s2) {
    return s2.split(' ').map(parseCommand);
}
function parseCommand(str, i) {
    return i === 0 ? str : +str;
}
function parsePoints(d) {
    var ctx = {
        x: 0,
        y: 0,
        s: []
    };
    var segments = parseSegments(d);
    for (var i = 0; i < segments.length; i++) {
        var terms = segments[i];
        var commandLetter = terms[0];
        var command = commandLetter.toUpperCase();
        var isRelative = command !== Z && command !== commandLetter;
        ctx.c = command;
        var parser = parsers[command];
        var maxLength = argLengths[command];
        if (!parser) {
            raiseError(ctx.c, ' is not supported');
        }
        var t2 = terms;
        var k = 1;
        do {
            ctx.t = t2.length === 1 ? t2 : t2.slice(k, k + maxLength);
            if (isRelative) {
                convertToAbsolute(ctx);
            }
            parser(ctx);
            k += maxLength;
        } while (k < t2.length);
    }
    return ctx.s;
}

function perimeterPoints(pts) {
    var n = pts.length;
    var x2 = pts[n - 2];
    var y2 = pts[n - 1];
    var p = 0;
    for (var i = 0; i < n; i += 6) {
        p += distance(pts[i], pts[i + 1], x2, y2);
        x2 = pts[i];
        y2 = pts[i + 1];
    }
    return floor(p);
}

function createPathSegmentArray(points) {
    var xmin = points[0];
    var ymin = points[1];
    var ymax = ymin;
    var xmax = xmin;
    for (var i = 2; i < points.length; i += 6) {
        var x = points[i + 4];
        var y = points[i + 5];
        xmin = min(xmin, x);
        xmax = max(xmax, x);
        ymin = min(ymin, y);
        ymax = max(ymax, y);
    }
    var width = xmax - xmin;
    var height = ymax - ymin;
    return {
        d: points,
        x: xmin,
        y: ymin,
        ox: width / 2 + xmin,
        oy: height / 2 + ymin,
        w: width,
        h: height,
        p: perimeterPoints(points)
    };
}
function parsePath(d) {
    return {
        path: d,
        data: parsePoints(d).map(createPathSegmentArray)
    };
}

function parse(d) {
    return parsePath(getPath(d));
}

function interpolate(paths, options) {
    return interpolatePath(paths.map(parse), options || {});
}

exports.getPath = getPath;
exports.interpolate = interpolate;

return exports;

}({}));
