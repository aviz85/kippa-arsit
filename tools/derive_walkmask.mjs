#!/usr/bin/env node
/* derive_walkmask.mjs — DETERMINISTIC walkable-mask derivation from painted plates (no API).
 * Region-grow from the floor at the bottom, bounded by a per-scene floor-ceiling (horizon) and a
 * floor color-model, then morphological cleanup. Outputs:
 *   - js/walkmasks.js   (compact 160x100 bit grids: GAME.WALKMASK[id] = {w,h,bits:base64})
 *   - /tmp/wmrev_<id>.png  (review overlay)
 * Per-scene knobs in CFG below (tol, floorTop, excludeColors) = the "hand-correction" dials.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const W=320, H=200, GW=160, GH=100;

// per-scene dials. floorTop = y above which nothing is walkable (back of floor; ~horizon).
// tol = local region-grow tolerance (Manhattan). exclude = colors to forbid (e.g., water).
const CFG = {
  room_red:    { tol:40, floorTop:150 },
  living_room: { tol:40, floorTop:150 },
  hood:        { tol:34, floorTop:120, exclude:[] },
  forest_edge: { tol:30, floorTop:140 },
  deep_forest: { tol:26, floorTop:140 },
  wolf_garden: { tol:30, floorTop:150 },
  river:       { tol:34, floorTop:150, exclude:[[60,120,170],[40,90,150],[90,150,190]] }, // water blues
  granny_ext:  { tol:34, floorTop:150 },
  granny_int:  { tol:40, floorTop:150 },
  finale:      { tol:40, floorTop:156 },
};

const idsArg = process.argv.slice(2).filter(a=>!a.startsWith('--'));
const ids = idsArg.length ? idsArg : Object.keys(CFG);
const dist=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2]);

async function readPlate(id){
  const {data}=await sharp(`assets/bg/${id}.png`).resize(W,H,{fit:'fill'}).removeAlpha().raw().toBuffer({resolveWithObject:true});
  return data;
}
function px(d,x,y){ const o=(y*W+x)*3; return [d[o],d[o+1],d[o+2]]; }

function floorModel(d){ // cluster bottom-5-rows colors into representatives
  const cols=[];
  for(let y=H-5;y<H;y++) for(let x=0;x<W;x+=2) cols.push(px(d,x,y));
  const cents=[];
  for(const c of cols){ let m=false; for(const k of cents){ if(dist(c,k)<26){m=true;break;} } if(!m && cents.length<24) cents.push(c); }
  return cents;
}
function nearModel(c,model){ let m=1e9; for(const k of model){ const e=dist(c,k); if(e<m)m=e; } return m; }

function dilate(mask,r){ const out=new Uint8Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){ if(!mask[y*W+x])continue;
    for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){ const nx=x+dx,ny=y+dy; if(nx>=0&&ny>=0&&nx<W&&ny<H) out[ny*W+nx]=1; } }
  return out; }
function erode(mask,r){ const out=new Uint8Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){ let ok=1;
    for(let dy=-r;dy<=r&&ok;dy++)for(let dx=-r;dx<=r;dx++){ const nx=x+dx,ny=y+dy; if(nx<0||ny<0||nx>=W||ny>=H||!mask[ny*W+nx]){ok=0;break;} }
    out[y*W+x]=ok; }
  return out; }

async function derive(id){
  const cfg=CFG[id]||{tol:36,floorTop:150};
  const d=await readPlate(id);
  const model=floorModel(d);
  const tol=cfg.tol, floorTop=cfg.floorTop, tolGlobal=110;
  const excl=cfg.exclude||[];
  const mask=new Uint8Array(W*H);
  const q=[];
  for(let x=0;x<W;x++){ const i=(H-1)*W+x; mask[i]=1; q.push(x); q.push(H-1); }
  while(q.length){ const y=q.pop(), x=q.pop(); const c=px(d,x,y);
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx,ny=y+dy;
      if(nx<0||ny<0||nx>=W||ny>=H) continue; const ni=ny*W+nx; if(mask[ni]) continue;
      if(ny<floorTop) continue;
      const nc=px(d,nx,ny);
      if(dist(c,nc)>=tol) continue;
      if(nearModel(nc,model)>tolGlobal) continue;
      let bad=false; for(const e of excl){ if(dist(nc,e)<60){bad=true;break;} } if(bad) continue;
      mask[ni]=1; q.push(nx); q.push(ny);
    } }
  // morphology: close (dilate->erode) to bridge gaps + smooth
  let m=dilate(mask,2); m=erode(m,2);
  // fill holes: background = not-m reachable from top edge; holes = not-m not reachable
  const bg=new Uint8Array(W*H); const s=[];
  for(let x=0;x<W;x++){ if(!m[x]){bg[x]=1;s.push(x);s.push(0);} }
  for(let y=0;y<H;y++){ if(!m[y*W]){bg[y*W]=1;s.push(0);s.push(y);} const r=y*W+W-1; if(!m[r]){bg[r]=1;s.push(W-1);s.push(y);} }
  while(s.length){ const y=s.pop(),x=s.pop(); for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx,ny=y+dy;
    if(nx<0||ny<0||nx>=W||ny>=H)continue; const ni=ny*W+nx; if(m[ni]||bg[ni])continue; bg[ni]=1; s.push(nx);s.push(ny); } }
  for(let i=0;i<W*H;i++) if(!m[i] && !bg[i]) m[i]=1; // interior holes -> walkable

  // downscale to GWxGH grid (cell walkable if >=50% of its source block is)
  const grid=new Uint8Array(GW*GH);
  const sx=W/GW, sy=H/GH;
  for(let gy=0;gy<GH;gy++)for(let gx=0;gx<GW;gx++){ let on=0,n=0;
    for(let yy=Math.floor(gy*sy);yy<Math.floor((gy+1)*sy);yy++)for(let xx=Math.floor(gx*sx);xx<Math.floor((gx+1)*sx);xx++){ n++; if(m[yy*W+xx])on++; }
    grid[gy*GW+gx]= on*2>=n ?1:0; }
  // pack bits -> base64
  const bytes=Buffer.alloc(Math.ceil(GW*GH/8));
  for(let i=0;i<GW*GH;i++) if(grid[i]) bytes[i>>3] |= (1<<(i&7));
  const cov=grid.reduce((a,b)=>a+b,0)/(GW*GH);

  // review overlay
  const out=Buffer.alloc(W*H*3);
  for(let i=0;i<W*H;i++){ const o=i*3; const gx=Math.floor((i%W)/sx), gy=Math.floor(Math.floor(i/W)/sy);
    const on=grid[gy*GW+gx];
    if(on){ out[o]=0;out[o+1]=230;out[o+2]=160; } else { out[o]=d[o]*0.45;out[o+1]=d[o+1]*0.45;out[o+2]=d[o+2]*0.45; } }
  await sharp(out,{raw:{width:W,height:H,channels:3}}).resize(W*3,H*3,{kernel:'nearest'}).png().toFile(`/tmp/wmrev_${id}.png`);
  return { id, bits: bytes.toString('base64'), cov:+(cov*100).toFixed(1) };
}

const results=[];
for(const id of ids){ if(!existsSync(`assets/bg/${id}.png`)){ console.log('skip',id); continue; } results.push(await derive(id)); }

// merge into js/walkmasks.js (preserve scenes not regenerated this run)
let existing={};
if(existsSync('js/walkmasks.js')){ try{ const t=readFileSync('js/walkmasks.js','utf8'); const m=t.match(/GAME\.WALKMASK\s*=\s*([\s\S]*?);\s*}\)/); if(m) existing=JSON.parse(m[1]); }catch{} }
for(const r of results) existing[r.id]={w:GW,h:GH,bits:r.bits};
const js=`/* js/walkmasks.js — AUTO-GENERATED by tools/derive_walkmask.mjs (deterministic floor masks). */
(function(){ GAME.WALKMASK = ${JSON.stringify(existing)};
  // decode base64 bit-grids into Uint8Array lookups
  GAME._walkGrid = {};
  for(const id in GAME.WALKMASK){ const m=GAME.WALKMASK[id]; const bin=atob(m.bits); const arr=new Uint8Array(m.w*m.h);
    for(let i=0;i<arr.length;i++) arr[i]=(bin.charCodeAt(i>>3)>>(i&7))&1; GAME._walkGrid[id]={w:m.w,h:m.h,a:arr}; }
})();`;
writeFileSync('js/walkmasks.js', js);
console.log('wrote js/walkmasks.js'); results.forEach(r=>console.log('  '+r.id+': coverage '+r.cov+'%'));
