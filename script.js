// ROUNDRECT POLYFILL
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}

// CUSTOM CURSOR
var cur = document.getElementById('cursor');
var ring = document.getElementById('cursorRing');

if (cur && ring) {
  var mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX;
    my = e.clientY;
  });

  (function cursorLoop() {
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(cursorLoop);
  })();

  document.querySelectorAll('a, button, .tl-ctrl-btn').forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      cur.style.transform = 'translate(-50%, -50%) scale(1.8)';
      ring.style.transform = 'translate(-50%, -50%) scale(1.4)';
      ring.style.borderColor = 'rgba(125, 212, 248, 0.7)';
    });
    el.addEventListener('mouseleave', function() {
      cur.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.borderColor = 'rgba(125, 212, 248, 0.3)';
    });
  });
}

// BACKGROUND NODE NETWORK
var cv = document.getElementById('nodeCanvas');
var cx = cv.getContext('2d');

function resizeMain() {
  cv.width = innerWidth;
  cv.height = innerHeight;
}
resizeMain();
addEventListener('resize', resizeMain);

var bgNodes = [];
for (var i = 0; i < 55; i++) {
  bgNodes.push({
    x: Math.random() * cv.width,
    y: Math.random() * cv.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    s: Math.random() * 2 + 1.5
  });
}

(function bgLoop() {
  cx.clearRect(0, 0, cv.width, cv.height);
  for (var i = 0; i < bgNodes.length; i++) {
    var n = bgNodes[i];
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < -20 || n.x > cv.width + 20 || n.y < -20 || n.y > cv.height + 20) {
      n.x = Math.random() * cv.width;
      n.y = Math.random() * cv.height;
    }
    cx.beginPath();
    cx.arc(n.x, n.y, n.s, 0, Math.PI * 2);
    cx.fillStyle = 'rgba(125, 212, 248, 0.35)';
    cx.fill();
  }
  for (var i = 0; i < bgNodes.length; i++) {
    for (var j = i + 1; j < bgNodes.length; j++) {
      var dx = bgNodes[i].x - bgNodes[j].x;
      var dy = bgNodes[i].y - bgNodes[j].y;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < 160) {
        cx.beginPath();
        cx.moveTo(bgNodes[i].x, bgNodes[i].y);
        cx.lineTo(bgNodes[j].x, bgNodes[j].y);
        cx.strokeStyle = 'rgba(125, 212, 248, ' + (1 - d / 160) * 0.08 + ')';
        cx.lineWidth = 0.5;
        cx.stroke();
      }
    }
  }
  requestAnimationFrame(bgLoop);
})();

// TIMELINE CLIPS
var TRACKS = [
  { id: 'tr-v3', clips: [{ l: '5%',  w: '30%', bg: '#3d7ab5', lbl: 'vfx_comp_v3'      }, { l: '52%', w: '22%', bg: '#3d7ab5', lbl: 'title_card'   }] },
  { id: 'tr-v2', clips: [{ l: '0%',  w: '55%', bg: '#3a6ea8', lbl: 'background_plate' }, { l: '60%', w: '35%', bg: '#3a6ea8', lbl: 'sky_replace'  }] },
  { id: 'tr-v1', clips: [{ l: '0%',  w: '100%',bg: '#2e5c8a', lbl: 'main_edit_sequence'                                                            }] },
  { id: 'tr-a1', clips: [{ l: '0%',  w: '80%', bg: '#3a6e5a', lbl: 'ambient_mix'      }, { l: '83%', w: '15%', bg: '#3a6e5a', lbl: 'sfx'          }] },
  { id: 'tr-a2', clips: [{ l: '10%', w: '60%', bg: '#336650', lbl: 'music_bed'                                                                     }] },
];

for (var i = 0; i < TRACKS.length; i++) {
  var tr = TRACKS[i];
  var trackEl = document.getElementById(tr.id);
  if (!trackEl) continue;
  for (var j = 0; j < tr.clips.length; j++) {
    var c = tr.clips[j];
    var clip = document.createElement('div');
    clip.className = 'tl-clip';
    clip.style.left = c.l;
    clip.style.width = c.w;
    clip.style.background = c.bg;
    clip.textContent = c.lbl;
    trackEl.appendChild(clip);
  }
}

// TIMELINE RULER
var rCv = document.getElementById('rulerCanvas');
var rCtx = rCv.getContext('2d');

function drawRuler() {
  var w = rCv.parentElement.offsetWidth;
  rCv.width = w;
  rCv.height = 22;
  var total = 60, px = w / total;
  for (var s = 0; s <= total; s++) {
    var x = s * px;
    var maj = s % 5 === 0;
    rCtx.fillStyle = maj ? 'rgba(138,158,160,0.85)' : 'rgba(75,95,96,0.5)';
    rCtx.fillRect(x, 22 - (maj ? 10 : 5), 1, maj ? 10 : 5);
    if (maj) {
      rCtx.fillStyle = 'rgba(138,158,160,0.7)';
      rCtx.font = '500 8px JetBrains Mono, monospace';
      rCtx.textAlign = 'center';
      var m = String(Math.floor(s / 60)).padStart(2, '0');
      var sc = String(s % 60).padStart(2, '0');
      rCtx.fillText(m + ':' + sc, x, 10);
    }
  }
}
setTimeout(drawRuler, 100);
addEventListener('resize', drawRuler);

// TIMECODE COUNTER
var tcFrame = 0;
var tcEl = document.getElementById('timecode');
setInterval(function() {
  tcFrame = (tcFrame + 1) % (60 * 24 * 10);
  var h = 0;
  var m = Math.floor(tcFrame / 1440) % 60;
  var s = Math.floor(tcFrame / 24) % 60;
  var f = tcFrame % 24;
  tcEl.textContent =
    String(h).padStart(2, '0') + ':' +
    String(m).padStart(2, '0') + ':' +
    String(s).padStart(2, '0') + ':' +
    String(f).padStart(2, '0');
}, Math.round(1000 / 24));

// MINI NODE COMPOSITOR
var mc = document.getElementById('miniCanvas');
var mc2 = mc.getContext('2d');

function resizeMini() {
  mc.width = mc.offsetWidth;
  mc.height = mc.offsetHeight;
}
setTimeout(resizeMini, 120);
addEventListener('resize', resizeMini);

var mNodes = [
  { x: 0.10, y: 0.45, lbl: 'INPUT',  w: 68, h: 26, type: 'std',  hdr: '#2a6080' },
  { x: 0.32, y: 0.20, lbl: 'COLOR',  w: 68, h: 26, type: 'std',  hdr: '#2a5e3a' },
  { x: 0.32, y: 0.72, lbl: 'BLUR',   w: 68, h: 26, type: 'std',  hdr: '#503080' },
  { x: 0.58, y: 0.45, lbl: 'MERGE',  w: 68, h: 26, type: 'std',  hdr: '#804020' },
  { x: 0.86, y: 0.45, lbl: 'OUTPUT', w: 76, h: 56, type: 'nuke', hdr: '#b85200' },
];

var mEdges = [[0,1],[0,2],[1,3],[2,3],[3,4]];
var t = 0;

function bez(a, b, c, d, t) {
  var m = 1 - t;
  return m*m*m*a + 3*m*m*t*b + 3*m*t*t*c + t*t*t*d;
}

(function miniLoop() {
  if (!mc.width) { requestAnimationFrame(miniLoop); return; }
  t += 0.012;
  mc2.clearRect(0, 0, mc.width, mc.height);

  // Draw edges
  for (var e = 0; e < mEdges.length; e++) {
    var na = mNodes[mEdges[e][0]], nb = mNodes[mEdges[e][1]];
    var x1 = na.x * mc.width, y1 = na.y * mc.height;
    var x2 = nb.x * mc.width, y2 = nb.y * mc.height;
    var cpx = (x1 + x2) / 2;
    mc2.beginPath();
    mc2.moveTo(x1, y1);
    mc2.bezierCurveTo(cpx, y1, cpx, y2, x2, y2);
    mc2.strokeStyle = 'rgba(125, 212, 248, 0.65)';
    mc2.lineWidth = 1.5;
    mc2.stroke();
    var pt = (t * 0.28 + e * 0.2) % 1;
    var px = bez(x1, cpx, cpx, x2, pt);
    var py = bez(y1, y1, y2, y2, pt);
    mc2.beginPath();
    mc2.arc(px, py, 3, 0, Math.PI * 2);
    mc2.fillStyle = 'rgba(200, 240, 255, 1)';
    mc2.fill();
  }

  // Draw nodes
  for (var ni = 0; ni < mNodes.length; ni++) {
    var n = mNodes[ni];
    var x = n.x * mc.width, y = n.y * mc.height, w = n.w, h = n.h;
    mc2.save();

    if (n.type === 'nuke') {
      var r = 4, hH = 16;
      mc2.shadowColor = 'rgba(184, 82, 0, 0.7)';
      mc2.shadowBlur = 18;
      mc2.beginPath();
      mc2.moveTo(x - w/2 + r, y - h/2);
      mc2.arcTo(x + w/2, y - h/2, x + w/2, y + h/2, r);
      mc2.arcTo(x + w/2, y + h/2, x - w/2, y + h/2, r);
      mc2.arcTo(x - w/2, y + h/2, x - w/2, y - h/2, r);
      mc2.arcTo(x - w/2, y - h/2, x + w/2, y - h/2, r);
      mc2.closePath();
      mc2.fillStyle = '#1a1a1a';
      mc2.fill();
      mc2.shadowBlur = 0;

      mc2.beginPath();
      mc2.moveTo(x - w/2 + r, y - h/2);
      mc2.arcTo(x + w/2, y - h/2, x + w/2, y - h/2 + hH, r);
      mc2.lineTo(x + w/2, y - h/2 + hH);
      mc2.lineTo(x - w/2, y - h/2 + hH);
      mc2.arcTo(x - w/2, y - h/2, x + w/2, y - h/2, r);
      mc2.closePath();
      mc2.fillStyle = n.hdr;
      mc2.fill();

      mc2.beginPath();
      mc2.moveTo(x - w/2 + r, y - h/2);
      mc2.arcTo(x + w/2, y - h/2, x + w/2, y + h/2, r);
      mc2.arcTo(x + w/2, y + h/2, x - w/2, y + h/2, r);
      mc2.arcTo(x - w/2, y + h/2, x - w/2, y - h/2, r);
      mc2.arcTo(x - w/2, y - h/2, x + w/2, y - h/2, r);
      mc2.closePath();
      mc2.strokeStyle = 'rgba(220, 110, 20, 1)';
      mc2.lineWidth = 1.5;
      mc2.stroke();

      mc2.fillStyle = '#fff';
      mc2.font = '700 8px JetBrains Mono, monospace';
      mc2.textAlign = 'center';
      mc2.textBaseline = 'middle';
      mc2.fillText(n.lbl, x, y - h/2 + hH/2);

      var tY = y - h/2 + hH + 2, tH = h - hH - 4, tX = x - w/2 + 4, tW = w - 8;
      mc2.fillStyle = 'rgba(255, 255, 255, 0.07)';
      mc2.fillRect(tX, tY, tW, tH);
      mc2.fillStyle = 'rgba(220, 110, 20, 0.85)';
      for (var b = 0; b < 8; b++) {
        var bh = (Math.sin(b * 0.9 + t * 2) * 0.4 + 0.5) * tH * 0.8;
        mc2.fillRect(tX + b * (tW / 8) + 1, tY + tH - bh, tW / 8 - 2, bh);
      }

      mc2.fillStyle = 'rgba(160, 230, 255, 1)';
      mc2.beginPath();
      mc2.moveTo(x - 4, y - h/2 - 5);
      mc2.lineTo(x + 4, y - h/2 - 5);
      mc2.lineTo(x, y - h/2);
      mc2.closePath();
      mc2.fill();

      mc2.fillStyle = 'rgba(220, 110, 20, 1)';
      mc2.beginPath();
      mc2.moveTo(x - 5, y + h/2);
      mc2.lineTo(x + 5, y + h/2);
      mc2.lineTo(x, y + h/2 + 7);
      mc2.closePath();
      mc2.fill();

    } else {
      var r = 3, hH = 10;
      mc2.beginPath();
      mc2.roundRect(x - w/2, y - h/2, w, h, r);
      mc2.fillStyle = '#141818';
      mc2.fill();

      mc2.beginPath();
      mc2.moveTo(x - w/2 + r, y - h/2);
      mc2.arcTo(x + w/2, y - h/2, x + w/2, y - h/2 + hH, r);
      mc2.lineTo(x + w/2, y - h/2 + hH);
      mc2.lineTo(x - w/2, y - h/2 + hH);
      mc2.arcTo(x - w/2, y - h/2, x + w/2, y - h/2, r);
      mc2.closePath();
      mc2.fillStyle = n.hdr;
      mc2.fill();

      mc2.beginPath();
      mc2.roundRect(x - w/2, y - h/2, w, h, r);
      mc2.strokeStyle = n.hdr;
      mc2.globalAlpha = 0.93;
      mc2.lineWidth = 1.2;
      mc2.stroke();
      mc2.globalAlpha = 1;

      mc2.fillStyle = 'rgba(230, 238, 238, 1)';
      mc2.font = '600 8px JetBrains Mono, monospace';
      mc2.textAlign = 'center';
      mc2.textBaseline = 'middle';
      mc2.fillText(n.lbl, x, y + 3);

      mc2.fillStyle = 'rgba(125, 212, 248, 0.9)';
      mc2.beginPath();
      mc2.arc(x, y - h/2, 3, 0, Math.PI * 2);
      mc2.fill();
      mc2.beginPath();
      mc2.arc(x, y + h/2, 3, 0, Math.PI * 2);
      mc2.fill();
    }

    mc2.restore();
  }
  requestAnimationFrame(miniLoop);
})();

// SCROLL REVEAL
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(function(el) {
  observer.observe(el);
});
