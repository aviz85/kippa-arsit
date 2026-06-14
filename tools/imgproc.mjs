#!/usr/bin/env node
/* imgproc.mjs — deterministic processing + verification of generated assets.
 *
 * Subcommands (all print a JSON result line; exit !=0 on hard failure):
 *   bg      --in SRC --out OUT [--w 1280] [--h 800]
 *           cover-crop+resize SRC to EXACT WxH opaque PNG. Verifies opacity & non-blankness.
 *   sprite  --in SRC --out OUT --h <targetH> [--keycolor auto|#rrggbb] [--tol 130] [--maxw N]
 *           auto chroma-key the flat background, trim to tight content bbox, resize so HEIGHT==targetH,
 *           output transparent PNG (tight). Verifies alpha + tight bbox.
 *   icon    --in SRC --out OUT [--size 64] [--tol 130]
 *           chroma-key, trim, fit-contain centered into SIZExSIZE transparent PNG.
 *   sheet   --in SRC --outdir DIR --rows R --cols C --names a,b,c,... --h <targetH> [--tol 130]
 *           slice grid into R*C cells (row-major), process each as a sprite, save DIR/<name>.png.
 *   verify  --in FILE [--w W --h H] [--alpha 1|0]
 *           report dims, alpha presence, alpha coverage, content bbox tightness.
 *   inspect --in FILE   (dims + dominant palette)
 */
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const A = process.argv.slice(2);
const CMD = A[0];
const arg = (n, d = null) => { const i = A.indexOf(n); return i >= 0 && A[i + 1] ? A[i + 1] : d; };
const has = (n) => A.indexOf(n) >= 0;
const out = (o) => { console.log(JSON.stringify(o)); };
const die = (m) => { console.error('[imgproc] ' + m); process.exit(1); };
const ensureDir = (p) => { const d = dirname(p); if (d && !existsSync(d)) mkdirSync(d, { recursive: true }); };

async function rawRGBA(path) {
  const img = sharp(path).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
}
function px(data, w, ch, x, y) { const i = (y * w + x) * ch; return [data[i], data[i + 1], data[i + 2], data[i + 3]]; }

// detect flat background color = median-ish average of 4 corner patches
function detectKey(data, w, h, ch) {
  const patches = [[2, 2], [w - 3, 2], [2, h - 3], [w - 3, h - 3]];
  let r = 0, g = 0, b = 0, n = 0;
  for (const [cx, cy] of patches)
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const x = Math.min(w - 1, Math.max(0, cx + dx)), y = Math.min(h - 1, Math.max(0, cy + dy));
      const [pr, pg, pb] = px(data, w, ch, x, y); r += pr; g += pg; b += pb; n++;
    }
  return [r / n, g / n, b / n];
}
function dist(a, b) { return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2); }

function chromaKey(data, w, h, ch, key, tol, feather) {
  for (let i = 0; i < w * h; i++) {
    const o = i * ch;
    const d = dist([data[o], data[o + 1], data[o + 2]], key);
    if (d < tol) data[o + 3] = 0;
    else if (d < tol + feather) data[o + 3] = Math.round(255 * (d - tol) / feather);
  }
}
function contentBBox(data, w, h, ch, aThresh = 16) {
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (data[(y * w + x) * ch + 3] > aThresh) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
  }
  if (x1 < 0) return null;
  return { x0, y0, x1, y1, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}
function alphaCoverage(data, w, h, ch) {
  let n = 0; for (let i = 0; i < w * h; i++) if (data[i * ch + 3] > 16) n++;
  return n / (w * h);
}
// variance proxy for "not blank": stddev of luminance sampled
function lumStd(data, w, h, ch) {
  let s = 0, s2 = 0, n = 0;
  for (let i = 0; i < w * h; i += 7) { const o = i * ch; const l = 0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2]; s += l; s2 += l * l; n++; }
  const m = s / n; return Math.sqrt(s2 / n - m * m);
}

async function keyTrimResize(srcPath, targetH, keyArg, tol, feather, maxw) {
  let { data, w, h, ch } = await rawRGBA(srcPath);
  const key = (!keyArg || keyArg === 'auto') ? detectKey(data, w, h, ch)
    : [parseInt(keyArg.slice(1, 3), 16), parseInt(keyArg.slice(3, 5), 16), parseInt(keyArg.slice(5, 7), 16)];
  chromaKey(data, w, h, ch, key, tol, feather);
  const bb = contentBBox(data, w, h, ch);
  if (!bb) die('no content after chroma-key (key=' + key.map(Math.round) + ')');
  // crop raw to bbox
  const crop = Buffer.alloc(bb.w * bb.h * ch);
  for (let y = 0; y < bb.h; y++) data.copy(crop, (y * bb.w) * ch, ((bb.y0 + y) * w + bb.x0) * ch, ((bb.y0 + y) * w + bb.x0 + bb.w) * ch);
  let pipe = sharp(crop, { raw: { width: bb.w, height: bb.h, channels: ch } });
  if (targetH) {
    const scale = targetH / bb.h;
    let nw = Math.max(1, Math.round(bb.w * scale));
    if (maxw && nw > maxw) nw = maxw;
    pipe = pipe.resize(nw, targetH, { fit: 'fill', kernel: 'lanczos3' });
  }
  return { pipe, key, srcBox: bb };
}

(async () => {
  if (CMD === 'bg') {
    const inp = arg('--in'), o = arg('--out'); if (!inp || !o) die('bg needs --in --out');
    const W = +arg('--w', '1280'), H = +arg('--h', '800');
    ensureDir(o);
    await sharp(inp).resize(W, H, { fit: 'cover', position: 'centre', kernel: 'lanczos3' }).removeAlpha().png({ quality: 95 }).toFile(o);
    const { data, w, h, ch } = await rawRGBA(o);
    const std = lumStd(data, w, h, ch);
    const okDims = (w === W && h === H);
    const okContent = std > 12;
    out({ ok: okDims && okContent, cmd: 'bg', out: o, w, h, expect: [W, H], lumStd: +std.toFixed(1), blank: !okContent });
    if (!(okDims && okContent)) process.exit(2);

  } else if (CMD === 'sprite') {
    const inp = arg('--in'), o = arg('--out'); if (!inp || !o) die('sprite needs --in --out');
    const targetH = +arg('--h', '0') || null;
    ensureDir(o);
    const { pipe, key, srcBox } = await keyTrimResize(inp, targetH, arg('--keycolor', 'auto'), +arg('--tol', '130'), +arg('--feather', '40'), +arg('--maxw', '0') || null);
    await pipe.png().toFile(o);
    const { data, w, h, ch } = await rawRGBA(o);
    const cov = alphaCoverage(data, w, h, ch);
    const bb = contentBBox(data, w, h, ch);
    const tight = bb && bb.w >= w - 2 && bb.h >= h - 2;
    out({ ok: cov > 0.05 && cov < 0.98 && tight, cmd: 'sprite', out: o, w, h, alphaCoverage: +cov.toFixed(3), tight, key: key.map(Math.round) });
    if (!(cov > 0.05 && cov < 0.98)) process.exit(2);

  } else if (CMD === 'icon') {
    const inp = arg('--in'), o = arg('--out'); if (!inp || !o) die('icon needs --in --out');
    const S = +arg('--size', '64'); ensureDir(o);
    const { pipe } = await keyTrimResize(inp, null, arg('--keycolor', 'auto'), +arg('--tol', '130'), +arg('--feather', '40'), null);
    const trimmed = await pipe.png().toBuffer();
    const m = await sharp(trimmed).metadata();
    const scale = Math.min((S - 4) / m.width, (S - 4) / m.height);
    const rw = Math.max(1, Math.round(m.width * scale)), rh = Math.max(1, Math.round(m.height * scale));
    const resized = await sharp(trimmed).resize(rw, rh, { fit: 'fill', kernel: 'lanczos3' }).png().toBuffer();
    await sharp({ create: { width: S, height: S, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: resized, gravity: 'centre' }]).png().toFile(o);
    const { data, w, h, ch } = await rawRGBA(o);
    const cov = alphaCoverage(data, w, h, ch);
    out({ ok: w === S && h === S && cov > 0.05, cmd: 'icon', out: o, w, h, alphaCoverage: +cov.toFixed(3) });

  } else if (CMD === 'sheet') {
    const inp = arg('--in'), dir = arg('--outdir'); if (!inp || !dir) die('sheet needs --in --outdir');
    const rows = +arg('--rows'), cols = +arg('--cols');
    const names = (arg('--names', '') || '').split(',').map(s => s.trim()).filter(Boolean);
    const targetH = +arg('--h', '0') || null;
    const tol = +arg('--tol', '130');
    if (!rows || !cols) die('sheet needs --rows --cols');
    const meta = await sharp(inp).metadata();
    const cw = Math.floor(meta.width / cols), chh = Math.floor(meta.height / rows);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const results = [];
    let idx = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const name = names[idx] || `cell_${r}_${c}`;
      idx++;
      const cellBuf = await sharp(inp).extract({ left: c * cw, top: r * chh, width: cw, height: chh }).png().toBuffer();
      // process cell as sprite
      const tmp = `${dir}/.cell_tmp.png`; await sharp(cellBuf).toFile(tmp);
      try {
        const { pipe } = await keyTrimResize(tmp, targetH, 'auto', tol, 40, null);
        const o = `${dir}/${name}.png`; await pipe.png().toFile(o);
        const { data, w, h, ch } = await rawRGBA(o);
        const cov = alphaCoverage(data, w, h, ch);
        results.push({ name, out: o, w, h, alphaCoverage: +cov.toFixed(3), ok: cov > 0.03 && cov < 0.99 });
      } catch (e) { results.push({ name, ok: false, err: String(e.message).slice(0, 80) }); }
    }
    out({ ok: results.every(r => r.ok), cmd: 'sheet', cells: results });

  } else if (CMD === 'verify') {
    const inp = arg('--in'); if (!inp) die('verify needs --in');
    const { data, w, h, ch } = await rawRGBA(inp);
    const cov = alphaCoverage(data, w, h, ch);
    const bb = contentBBox(data, w, h, ch);
    const std = lumStd(data, w, h, ch);
    const wantW = arg('--w') ? +arg('--w') : null, wantH = arg('--h') ? +arg('--h') : null;
    const wantAlpha = has('--alpha') ? arg('--alpha') === '1' : null;
    const hasAlpha = cov < 0.999;
    let ok = true;
    if (wantW && w !== wantW) ok = false;
    if (wantH && h !== wantH) ok = false;
    if (wantAlpha === true && !hasAlpha) ok = false;
    if (wantAlpha === false && hasAlpha) ok = false;
    if (std < 6) ok = false;
    out({ ok, cmd: 'verify', in: inp, w, h, alphaCoverage: +cov.toFixed(3), hasAlpha, lumStd: +std.toFixed(1), bbox: bb, want: { w: wantW, h: wantH, alpha: wantAlpha } });
    if (!ok) process.exit(2);

  } else if (CMD === 'inspect') {
    const inp = arg('--in'); if (!inp) die('inspect needs --in');
    const m = await sharp(inp).metadata();
    const { dominant } = await sharp(inp).stats();
    out({ cmd: 'inspect', in: inp, w: m.width, h: m.height, channels: m.channels, hasAlpha: m.hasAlpha, dominant });

  } else {
    die('unknown cmd: ' + CMD + ' (use bg|sprite|icon|sheet|verify|inspect)');
  }
})().catch(e => die(String(e?.stack || e)));
