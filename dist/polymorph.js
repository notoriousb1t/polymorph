var polymorph = (function (exports) {
'use strict';

var _ = undefined;

function coalesce(current, fallback) {
    return current === _ ? fallback : current;
}

var parsers = {
    M: function (ctx) {
        var n = ctx.t;
        addSegment(ctx, n[1], n[2]);
    },
    H: function (ctx) {
        addCurve(ctx, _, _, _, _, ctx.t[1], _);
    },
    V: function (ctx) {
        addCurve(ctx, _, _, _, _, _, ctx.t[1]);
    },
    L: function (ctx) {
        var n = ctx.t;
        addCurve(ctx, _, _, _, _, n[1], n[2]);
    },
    Z: function (ctx) {
        addCurve(ctx, _, _, _, _, ctx.p[0], ctx.p[1]);
    },
    C: function (ctx) {
        var n = ctx.t;
        addCurve(ctx, n[1], n[2], n[3], n[4], n[5], n[6]);
    },
    S: function (ctx) {
        var n = ctx.t;
        var isLastCurve = ctx.lc === 'S' || ctx.lc === 'C';
        addCurve(ctx, isLastCurve ? 0 : n[1], isLastCurve ? 0 : n[2], n[1], n[2], n[3], n[4]);
    },
    Q: function (ctx) {
        var n = ctx.t;
        addCurve(ctx, n[1], n[2], n[1], n[2], n[3], n[4]);
    }
};
function addSegment(ctx, x, y) {
    ctx.x = x;
    ctx.y = y;
    var p = [x, y];
    ctx.s.push(p);
    ctx.p = p;
}
function addCurve(ctx, x1, y1, x2, y2, dx, dy) {
    var defaultX = ctx.r ? 0 : ctx.x;
    var defaultY = ctx.r ? 0 : ctx.y;
    x1 = coalesce(x1, defaultX);
    y1 = coalesce(y1, defaultY);
    x2 = coalesce(x2, defaultX);
    y2 = coalesce(y2, defaultY);
    dx = coalesce(dx, defaultX);
    dy = coalesce(dy, defaultY);
    if (ctx.r) {
        x1 += ctx.x;
        y1 += ctx.y;
        x2 += ctx.x;
        y2 += ctx.y;
        dx += ctx.x;
        dy += ctx.y;
    }
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
        r: _,
        t: _,
        s: [],
        p: _
    };
    var segments = parseSegments(d);
    for (var i = 0; i < segments.length; i++) {
        var terms = segments[i];
        var commandLetter = terms[0];
        ctx.c = commandLetter.toUpperCase();
        ctx.r = ctx.c !== 'Z' && commandLetter !== ctx.c;
        ctx.t = terms;
        var parser = parsers[ctx.c];
        if (!parser) {
            throw new Error(ctx.c + ' is not supported');
        }
        parser(ctx);
    }
    return ctx.s;
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
function parseCommand(s, i) {
    return i === 0 ? s : +s;
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
