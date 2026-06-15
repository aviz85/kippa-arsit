#!/usr/bin/env node
/* render_scene.mjs — headless preview compositor that MIRRORS the engine's depth+scale math,
 * so prop proportions can be calibrated without a browser.
 * Usage: node tools/render_scene.mjs <sceneId> [--out preview.png]
 * Reads docs/layers/<id>.json for {depth, props[]} (props use units OR legacy scale).
 * Composites: plate + back props + (front props & the character at FRONT and MID positions, depth-sorted) + shadows.
 */
import sharp from 'sharp';
import { readFileSync, existsSync } from 'fs';

const id = process.argv[2];
const arg = (n,d=null)=>{ const i=process.argv.indexOf(n); return i>=0&&process.argv[i+1]?process.argv[i+1]:d; };
const OUT = arg('--out', `/tmp/preview_${id}.png`);
if(!id){ console.error('usage: render_scene <sceneId>'); process.exit(1); }

const UNIT=64, RS=4, W=320, H=200;
const spec = JSON.parse(readFileSync(`docs/layers/${id}.json`,'utf8'));
const d = spec.depth||{horizon:150,nearScale:1.1,farScale:0.75};
const horizon=d.horizon, near=d.nearScale, far=d.farScale;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const scaleAt=(y)=> far + (near-far)*clamp((y-horizon)/(H-horizon),0,1);

// character sprite for preview (front pose) + its logical height (red = UNIT)
const charImg = existsSync('assets/spr/red_down_0.png')?'assets/spr/red_down.png':'assets/spr/red_down.png';
const CHAR_H = UNIT;

async function sizedBuf(path, hLogical){
  const m = await sharp(path).metadata();
  const dh = Math.max(1, Math.round(hLogical*RS));
  const dw = Math.max(1, Math.round(dh*(m.width/m.height)));
  const buf = await sharp(path).resize(dw,dh,{fit:'fill',kernel:'lanczos3'}).png().toBuffer();
  return {buf, dw, dh};
}
function shadowSVG(wDev,hDev){
  const rx=Math.max(3,wDev*0.34), ry=Math.max(2,hDev*0.06);
  const W2=Math.ceil(rx*2)+4, H2=Math.ceil(ry*2)+4;
  const svg=`<svg width="${W2}" height="${H2}"><ellipse cx="${W2/2}" cy="${H2/2}" rx="${rx}" ry="${ry}" fill="black" fill-opacity="0.22"/></svg>`;
  return {buf:Buffer.from(svg), W2, H2};
}

(async()=>{
  const layers=[]; // {top-level composites}
  const props = spec.props||[];
  // resolve a drawable for each prop
  const drawables=[]; // {baseline, kind, ...}
  for(const p of props){
    const path = `assets/prop/${id}_${p.name}.png`;
    if(!existsSync(path)) continue;
    const base=p.baseline!=null?p.baseline:H;
    const hLog = (p.units!=null? p.units*UNIT : (p.scale!=null? p.scale*H : 40))*scaleAt(base);
    drawables.push({baseline:base, x:p.x, hLog, path, layer:p.layer, name:p.name});
  }
  // characters at FRONT (near) and MID for scale reference
  const charPositions=[{x:W*0.42,y:H-6,tag:'front'},{x:W*0.6,y:horizon+(H-horizon)*0.45,tag:'mid'}];
  for(const cp of charPositions){ drawables.push({baseline:cp.y, x:cp.x, hLog:CHAR_H*scaleAt(cp.y), path:charImg, isChar:true}); }

  // composite list in order: back props first, then depth-sorted (front props + chars) by baseline
  const CW=W*RS, CH=H*RS;
  const comps=[];
  // crop an input buffer to the visible canvas window so oversized props (e.g. occluder
  // trees that legitimately extend above/beside the frame) don't blow up sharp's compositor.
  async function addCropped(buf, w, h, left, top){
    let sx=0, sy=0, sw=w, sh=h, dl=left, dt=top;
    if(dl<0){ sx=-dl; sw+=dl; dl=0; }
    if(dt<0){ sy=-dt; sh+=dt; dt=0; }
    if(dl+sw>CW) sw=CW-dl;
    if(dt+sh>CH) sh=CH-dt;
    if(sw<=0||sh<=0) return; // fully off-canvas
    const out = (sx===0&&sy===0&&sw===w&&sh===h)? buf
      : await sharp(buf).extract({left:Math.round(sx),top:Math.round(sy),width:Math.round(sw),height:Math.round(sh)}).png().toBuffer();
    comps.push({input:out, left:Math.round(dl), top:Math.round(dt)});
  }
  async function place(dd){
    const {buf,dw,dh}=await sizedBuf(dd.path, dd.hLog);
    // shadow
    const sh=shadowSVG(dw,dh);
    await addCropped(sh.buf, sh.W2, sh.H2, Math.round(dd.x*RS - sh.W2/2), Math.round(dd.baseline*RS - sh.H2/2));
    await addCropped(buf, dw, dh, Math.round(dd.x*RS - dw/2), Math.round(dd.baseline*RS - dh));
  }
  for(const dd of drawables.filter(x=>x.layer==='back')) await place(dd);
  const sorted=drawables.filter(x=>x.layer!=='back').sort((a,b)=>a.baseline-b.baseline);
  for(const dd of sorted) await place(dd);

  const plate = existsSync(`assets/bg/${id}.png`)?`assets/bg/${id}.png`:null;
  let base = plate? sharp(plate).resize(W*RS,H*RS,{fit:'fill'}) : sharp({create:{width:W*RS,height:H*RS,channels:3,background:'#222'}});
  const png = await base.composite(comps).png().toFile(OUT);
  console.log(JSON.stringify({ok:true, id, out:OUT, props:drawables.filter(x=>!x.isChar).length,
    scaleNear:+scaleAt(H-6).toFixed(2), scaleFar:+scaleAt(horizon+5).toFixed(2)}));
})().catch(e=>{ console.error('render err', e.message); process.exit(1); });
