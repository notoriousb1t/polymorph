var polymorph = (function (exports) {
'use strict';

var _ = undefined;
var Z = 'Z';
var C = 'C';
var S = 'S';
var Q = 'Q';
var T = 'T';

function coalesce(current, fallback) {
    return current === _ ? fallback : current;
}

var quadraticRatio = 2.0 / 3;
function m(ctx) {
    var n = ctx.t;
    addSegment(ctx, n[1], n[2]);
}
function h(ctx) {
    addCurve(ctx, _, _, _, _, ctx.t[1], _);
}
function v(ctx) {
    addCurve(ctx, _, _, _, _, _, ctx.t[1]);
}
function l(ctx) {
    var n = ctx.t;
    addCurve(ctx, _, _, _, _, n[1], n[2]);
}
function z(ctx) {
    addCurve(ctx, _, _, _, _, ctx.p[0], ctx.p[1]);
}
function c(ctx) {
    var n = ctx.t;
    addCurve(ctx, n[1], n[2], n[3], n[4], n[5], n[6]);
    ctx.cx = n[1];
    ctx.cy = n[2];
}
function s(ctx) {
    var n = ctx.t;
    var isInitialCurve = ctx.lc !== S && ctx.lc !== C;
    var x1 = isInitialCurve ? _ : ctx.x * 2 - ctx.cx;
    var y1 = isInitialCurve ? _ : ctx.y * 2 - ctx.cy;
    addCurve(ctx, x1, y1, n[1], n[2], n[3], n[4]);
    ctx.cx = n[1];
    ctx.cy = n[2];
}
function q(ctx) {
    var n = ctx.t;
    var cx1 = n[1];
    var cy1 = n[2];
    var dx = n[3];
    var dy = n[4];
    addCurve(ctx, ctx.x + (cx1 - ctx.x) * quadraticRatio, ctx.y + (cy1 - ctx.y) * quadraticRatio, dx + (cx1 - dx) * quadraticRatio, dy + (cy1 - dy) * quadraticRatio, dx, dy);
    ctx.cx = cx1;
    ctx.cy = cy1;
}
function t(ctx) {
    var n = ctx.t;
    var dx = n[1];
    var dy = n[2];
    var x1, y1, x2, y2;
    if (ctx.lc === Q || ctx.lc === T) {
        var cx1 = ctx.x * 2 - ctx.cx;
        var cy1 = ctx.y * 2 - ctx.cy;
        x1 = ctx.x + (cx1 - ctx.x) * quadraticRatio;
        y1 = ctx.y + (cy1 - ctx.y) * quadraticRatio;
        x2 = dx + (cx1 - dx) * quadraticRatio;
        y2 = dy + (cy1 - dy) * quadraticRatio;
    }
    else {
        x1 = x2 = ctx.x;
        y1 = y2 = ctx.y;
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
    x1 = coalesce(x1, x);
    y1 = coalesce(y1, y);
    x2 = coalesce(x2, x);
    y2 = coalesce(y2, y);
    dx = coalesce(dx, x);
    dy = coalesce(dy, y);
    ctx.p.push(x1, y1, x2, y2, dx, dy);
    ctx.x = dx;
    ctx.y = dy;
    ctx.lc = ctx.c;
}
function parsePath(d) {
    var ctx = {
        x: 0,
        y: 0,
        lc: _,
        c: _,
        cx: _,
        cy: _,
        t: _,
        s: [],
        p: _
    };
    var segments = parseSegments(d);
    for (var i = 0; i < segments.length; i++) {
        var terms = segments[i];
        var commandLetter = terms[0];
        var command = commandLetter.toUpperCase();
        ctx.c = command;
        ctx.t = terms;
        var parser = parsers[ctx.c];
        if (!parser) {
            throw new Error(ctx.c + ' is not supported');
        }
        if (command !== Z && command !== commandLetter) {
            ensureAbsolute(ctx);
        }
        parser(ctx);
    }
    return ctx.s;
}
function ensureAbsolute(ctx) {
    if (ctx.c === 'V') {
        ctx.t[1] += ctx.y;
        return;
    }
    if (ctx.c === 'H') {
        ctx.t[1] += ctx.x;
        return;
    }
    for (var j = 1; j < ctx.t.length; j += 2) {
        ctx.t[j] += ctx.x;
        ctx.t[j + 1] += ctx.y;
    }
}
function parseSegments(d) {
    return d
        .replace(/[\^\s]*([mhvlzcsqta]|[-]?[\d]*[.]?[\d]+)[\$\s]*/gi, ' $1')
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

function renderPath(ns) {
    var parts = [];
    for (var i = 0; i < ns.length; i++) {
        var n = ns[i];
        parts.push('M', formatNumber(n[0]), formatNumber(n[1]), 'C');
        for (var f = 2; f < n.length; f++) {
            parts.push(formatNumber(n[f]));
        }
    }
    return parts.join(' ');
}
function formatNumber(n) {
    return (Math.round(n * 100) / 100).toString();
}

exports.parsePath = parsePath;
exports.renderPath = renderPath;

return exports;

}({}));
