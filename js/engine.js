/* ============================================================================
   כיפה ארסית — Sierra-style adventure engine (vanilla JS, no build)
   One cohesive engine implementing CONTRACT.md. Global: GAME
   ========================================================================== */
(function () {
  'use strict';

  const W = 320, H = 200;               // logical scene resolution
  const GAME = (window.GAME = {});

  /* ---- palette (EGA-ish, extended) ---------------------------------------- */
  GAME.C = {
    black:'#000000', white:'#ffffff', red:'#d63031', darkRed:'#7a1416',
    pink:'#ff7eb6', brown:'#7a4a21', tan:'#caa472', skin:'#f1c9a5',
    gold:'#ffd23f', yellow:'#fff05a', green:'#2ecc71', darkGreen:'#1e7a44',
    blue:'#3b6fdc', darkBlue:'#1f3a93', cyan:'#7fd3ff',
    gray:'#8a8d91', ltGray:'#c7ccd1', dkGray:'#4a4f55', purple:'#8e44ad',
    orange:'#e67e22', steel:'#5a6b7b', moss:'#3a5a2a', night:'#101a2c',
  };
  const C = GAME.C;

  /* ---- canvas buffer (hi-res render, logical coords preserved) ------------ */
  const RS = 4;                         // render scale: canvas is 1280x800, logic stays 320x200
  GAME.RS = RS;
  let cv, ctx;
  GAME._initCanvas = function (canvas) {
    cv = canvas; cv.width = W * RS; cv.height = H * RS;
    ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    GAME.ctx = ctx;
  };

  /* ---- asset system (images with procedural fallback) -------------------- */
  const assetImgs = {}, assetOK = {};
  GAME._spriteMeta = {};               // id -> {h: logicalHeight}
  GAME.registerAssets = (list, spriteMeta) => { GAME._assetList = list || {}; Object.assign(GAME._spriteMeta, spriteMeta || {}); };
  GAME.img = (key) => (assetOK[key] ? assetImgs[key] : null);
  GAME.loadAssets = (cb) => {
    const entries = Object.entries(GAME._assetList || {});
    let pending = entries.length; if (!pending) { cb && cb(0, 0); return; }
    let okN = 0;
    entries.forEach(([key, url]) => {
      const im = new Image();
      im.onload = () => { const good = im.naturalWidth > 0; assetOK[key] = good; if (good) { assetImgs[key] = im; okN++; } if (--pending === 0) cb && cb(okN, entries.length); };
      im.onerror = () => { assetOK[key] = false; if (--pending === 0) cb && cb(okN, entries.length); };
      im.src = url;
    });
  };

  /* ---- pixel-art drawing DSL ---------------------------------------------- */
  const P = (c) => (ctx.fillStyle = c);
  GAME.px   = (g,x,y,c)=>{ g.fillStyle=c; g.fillRect(x|0,y|0,1,1); };
  GAME.rect = (g,x,y,w,h,c)=>{ g.fillStyle=c; g.fillRect(x|0,y|0,w|0,h|0); };
  GAME.box  = (g,x,y,w,h,c)=>{ g.fillStyle=c;
    g.fillRect(x|0,y|0,w|0,1); g.fillRect(x|0,(y+h-1)|0,w|0,1);
    g.fillRect(x|0,y|0,1,h|0); g.fillRect((x+w-1)|0,y|0,1,h|0); };
  GAME.line = (g,x0,y0,x1,y1,c)=>{ g.fillStyle=c;
    x0|=0;y0|=0;x1|=0;y1|=0; let dx=Math.abs(x1-x0),dy=Math.abs(y1-y0);
    let sx=x0<x1?1:-1, sy=y0<y1?1:-1, e=dx-dy;
    for(;;){ g.fillRect(x0,y0,1,1); if(x0===x1&&y0===y1)break;
      let e2=2*e; if(e2>-dy){e-=dy;x0+=sx;} if(e2<dx){e+=dx;y0+=sy;} } };
  GAME.gradV = (g,x,y,w,h,c1,c2)=>{ // dithered vertical 2-color blend (top->bottom)
    for(let yy=0;yy<h;yy++){ const t=yy/(h-1||1);
      for(let xx=0;xx<w;xx++){ const checker=((xx+yy)&1)===0;
        g.fillStyle = bandColor(t, checker, c1, c2);
        g.fillRect(x+xx, y+yy, 1, 1);
      } } };
  function bandColor(t, checker, c1, c2){
    // 4-step ordered dither between c1(top) and c2(bottom)
    if (t < 0.25) return c1;
    if (t < 0.5)  return checker ? c1 : c2;
    if (t < 0.75) return checker ? c2 : c1;
    return c2;
  }
  GAME.dither = (g,x,y,w,h,a,b)=>{ for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){
    g.fillStyle=((xx+yy)&1)?a:b; g.fillRect(x+xx,y+yy,1,1);} };
  GAME.ellipse = (g,cx,cy,rx,ry,c)=>{ g.fillStyle=c;
    rx=Math.max(1,rx|0); ry=Math.max(1,ry|0);
    for(let yy=-ry;yy<=ry;yy++){ const w=Math.floor(rx*Math.sqrt(Math.max(0,1-(yy*yy)/(ry*ry))));
      g.fillRect((cx-w)|0,(cy+yy)|0, w*2+1, 1); } };
  GAME.poly = (g,pts,c)=>{ g.fillStyle=c; g.beginPath();
    g.moveTo(pts[0][0],pts[0][1]); for(let i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]);
    g.closePath(); g.fill(); };

  /* ---- state -------------------------------------------------------------- */
  GAME.state = {};
  const flags = {}, inv = [], scored = {};
  let scoreVal = 0;
  GAME.MAXSCORE = 100;
  GAME.flag = (n)=> flags[n];
  GAME.setFlag = (n,v=true)=>{ flags[n]=v; };
  GAME.has = (id)=> inv.indexOf(id)>=0;
  GAME.give = (id)=>{ if(!GAME.has(id)){ inv.push(id); GAME.sfx('pickup'); renderInventory(); } };
  GAME.take = (id)=>{ const i=inv.indexOf(id); if(i>=0){ inv.splice(i,1); if(GAME.selItem===id)GAME.selItem=null; renderInventory(); } };
  GAME.inventory = ()=> inv.slice();
  GAME.score = (pts, reason)=>{ if(reason && scored[reason]) return; if(reason) scored[reason]=true;
    scoreVal += pts; if(scoreVal>GAME.MAXSCORE) GAME.MAXSCORE=scoreVal; renderTop(); GAME.sfx('score'); };
  GAME.getScore = ()=> scoreVal;

  /* ---- scenes ------------------------------------------------------------- */
  const scenes = {};
  let cur = null, firstSeen = {};
  GAME.registerScene = (s)=>{ scenes[s.id]=s; };
  GAME.scene = ()=> cur;

  /* ---- player ------------------------------------------------------------- */
  const player = { x:160, y:175, dir:'right', frame:0, moving:false, path:null, onArrive:null, w:18, h:34 };
  GAME.playerAt = ()=> ({x:player.x, y:player.y});
  GAME.player = player;

  function sceneScaleAt(y){
    const s = cur && cur.scale;
    if(!s) return 1;
    const t = clamp((y - s.horizon)/(H - s.horizon), 0, 1);
    return s.far + (s.near - s.far)*t;
  }
  GAME.scaleAt = sceneScaleAt;

  function clamp(v,a,b){ return v<a?a:v>b?b:v; }

  /* feet position must stay inside a walkbox rect */
  function inWalkbox(x,y){
    if(!cur || !cur.walkbox) return true;
    for(const r of cur.walkbox){ if(x>=r.x && x<=r.x+r.w && y>=r.y && y<=r.y+r.h) return true; }
    return false;
  }
  function clampToWalkbox(x,y){
    if(!cur || !cur.walkbox || !cur.walkbox.length) return {x,y};
    let best=null, bd=1e9;
    for(const r of cur.walkbox){
      const cx=clamp(x,r.x,r.x+r.w), cy=clamp(y,r.y,r.y+r.h);
      const d=(cx-x)**2+(cy-y)**2; if(d<bd){bd=d;best={x:cx,y:cy};}
    }
    return best||{x,y};
  }

  GAME.walkTo = (x,y,cb)=>{
    const t = clampToWalkbox(x,y);
    player.path = {tx:t.x, ty:t.y};
    player.onArrive = cb||null;
    player.moving = true;
  };
  function stopWalk(run){ player.moving=false; player.path=null; const cb=player.onArrive; player.onArrive=null; if(run&&cb) cb(); }

  function updatePlayer(){
    if(!player.moving || !player.path){ player.frame=0; return; }
    const sp = 1.6 * (0.6 + 0.4*sceneScaleAt(player.y));
    let dx=player.path.tx-player.x, dy=player.path.ty-player.y;
    const dist=Math.hypot(dx,dy);
    if(dist<=sp){ player.x=player.path.tx; player.y=player.path.ty; stopWalk(true); return; }
    player.x += (dx/dist)*sp; player.y += (dy/dist)*sp;
    if(Math.abs(dx)>Math.abs(dy)) player.dir = dx<0?'left':'right';
    else player.dir = dy<0?'up':'down';
    player.frame += 0.25;
  }

  /* ---- sprites ------------------------------------------------------------ */
  const sprites = {};
  GAME.registerSprite = (id,def)=>{ sprites[id]=def; };
  GAME.drawSprite = (g,id,x,y,frame,dir,scale)=>{
    const sc = scale==null?1:scale; dir = dir||'right';
    const meta = GAME._spriteMeta[id];
    if(meta){
      const d = dir==='up'?'up':(dir==='down'?'down':'side');
      const img = GAME.img('spr_'+id+'_'+d) || GAME.img('spr_'+id+'_side') || GAME.img('spr_'+id+'_down');
      if(img){
        const dh = (meta.h||34)*sc, dw = dh*(img.naturalWidth/img.naturalHeight);
        GAME.ellipse(g,x,y,Math.max(2,dw*0.42),Math.max(1,2.4*sc),'rgba(0,0,0,.28)');
        const bob = (frame===1||frame===3)? -0.6*sc : 0;
        g.save();
        if(dir==='left'){ g.translate(x,0); g.scale(-1,1); g.translate(-x,0); }
        g.drawImage(img, x-dw/2, y-dh+bob, dw, dh);
        g.restore();
        return;
      }
    }
    const sp=sprites[id]; if(!sp){ GAME.rect(g,x-6,y-24,12,24,C.purple); return; }
    sp.draw(g,x,y,frame|0,dir,sc);
  };

  /* ---- items -------------------------------------------------------------- */
  const items = {};
  GAME.registerItem = (id,def)=>{
    const orig = def.draw;
    def.draw = function(g,x,y,s){ s=s||1;
      const img = GAME.img('item_'+id);
      if(img){ g.drawImage(img, x, y, 16*s, 16*s); return; }
      if(orig) orig.call(def,g,x,y,s);
    };
    items[id]=def;
  };
  GAME.itemDef = (id)=> items[id];
  GAME.selItem = null;

  /* ============================ UI / DOM ================================== */
  let elTop, elMsg, elChoices, elVerbs, elInv, elOverlay, elRoom, elScore;
  GAME._initUI = function(refs){
    elTop=refs.top; elMsg=refs.msg; elChoices=refs.choices; elVerbs=refs.verbs;
    elInv=refs.inv; elOverlay=refs.overlay; elRoom=refs.room; elScore=refs.score;
    buildVerbs(); renderTop(); renderInventory();
  };

  const VERBS = [
    {id:'walk', label:'ללכת',  glyph:'👟'},
    {id:'look', label:'להביט', glyph:'👁'},
    {id:'talk', label:'לדבר',  glyph:'💬'},
    {id:'take', label:'לקחת',  glyph:'✋'},
    {id:'use',  label:'להשתמש',glyph:'🔧'},
  ];
  GAME.verb = 'walk';
  function buildVerbs(){
    elVerbs.innerHTML='';
    VERBS.forEach(v=>{
      const b=document.createElement('button');
      b.className='verb'+(v.id===GAME.verb?' sel':''); b.dataset.v=v.id;
      b.innerHTML=`<span class="g">${v.glyph}</span><span class="l">${v.label}</span>`;
      b.onclick=()=>{ GAME.verb=v.id; GAME.selItem=null; refreshVerbs(); GAME.sfx('click'); };
      elVerbs.appendChild(b);
    });
  }
  function refreshVerbs(){
    [...elVerbs.children].forEach(b=> b.classList.toggle('sel', b.dataset.v===GAME.verb && !GAME.selItem));
    renderInventory();
    updateCursorLabel();
  }
  function renderTop(){
    if(elRoom) elRoom.textContent = cur? cur.name : '';
    if(elScore) elScore.textContent = `ניקוד ${scoreVal}/${GAME.MAXSCORE}`;
  }
  function renderInventory(){
    if(!elInv) return; elInv.innerHTML='';
    inv.forEach(id=>{
      const def=items[id]; const slot=document.createElement('button');
      slot.className='slot'+(GAME.selItem===id?' sel':'');
      slot.title=def?def.name:id;
      const c=document.createElement('canvas'); c.width=32;c.height=32;c.className='ico';
      const g=c.getContext('2d'); g.imageSmoothingEnabled=true;
      if(def&&def.draw){ try{def.draw(g,0,0,2);}catch(e){} } else { g.fillStyle=C.purple; g.fillRect(4,4,24,24); }
      slot.appendChild(c);
      slot.onclick=()=>{
        if(GAME.selItem===id){ GAME.selItem=null; }
        else { GAME.selItem=id; GAME.verb='use'; }
        refreshVerbs(); GAME.sfx('click');
      };
      elInv.appendChild(slot);
    });
    [...elVerbs.children].forEach(b=> b.classList.toggle('sel', b.dataset.v===GAME.verb && !GAME.selItem));
  }

  /* ---- message queue (narration + speech) -------------------------------- */
  let msgQueue=[], msgActive=false, msgCb=null;
  function pushMsg(html){ msgQueue.push(html); if(!msgActive) nextMsg(); }
  function nextMsg(){
    if(msgQueue.length===0){ msgActive=false; elMsg.classList.remove('show'); elMsg.innerHTML='';
      if(msgCb){ const c=msgCb; msgCb=null; c(); } return; }
    msgActive=true; elMsg.classList.add('show'); elMsg.innerHTML = msgQueue.shift();
  }
  GAME.say = (text)=>{ pushMsg(`<div class="narr">${esc(text)}</div>`); GAME.sfx('blip'); };
  GAME.speak = (who,text,color)=>{ const col=color||C.yellow;
    pushMsg(`<div class="speech"><b style="color:${col}">${esc(who)}:</b> ${esc(text)}</div>`); GAME.sfx('talk'); };
  GAME.onMsgDone = (cb)=>{ if(!msgActive && msgQueue.length===0){ cb(); } else { msgCb=cb; } };
  function advanceMsg(){ if(msgActive){ nextMsg(); return true; } return false; }

  /* ---- choices (dialogue menu) ------------------------------------------- */
  let choiceOpen=false;
  GAME.choice = (prompt, options)=>{
    choiceOpen=true; elChoices.classList.add('show');
    elChoices.innerHTML = (prompt?`<div class="cprompt">${esc(prompt)}</div>`:'') +
      `<div class="copts"></div>`;
    const wrap=elChoices.querySelector('.copts');
    options.forEach(o=>{
      const b=document.createElement('button'); b.className='copt'; b.textContent=o.label;
      b.onclick=()=>{ closeChoice(); GAME.sfx('click'); if(o.action) o.action(); };
      wrap.appendChild(b);
    });
  };
  function closeChoice(){ choiceOpen=false; elChoices.classList.remove('show'); elChoices.innerHTML=''; }
  GAME.closeChoice = closeChoice;

  /* ---- death / win / overlay --------------------------------------------- */
  let frozen=false;
  GAME.die = (text)=>{ frozen=true; GAME.sfx('death'); showOverlay('💀 מ-ת-ת!', text||'נגמר המשחק.', '#d63031',[
    {label:'לטעון מחדש (Restore)', action:()=>{ hideOverlay(); GAME.load(); }},
    {label:'להתחיל מחדש (Restart)', action:()=>{ hideOverlay(); GAME.restart(); }},
  ]); };
  GAME.win = (text)=>{ frozen=true; GAME.sfx('win'); showOverlay('★ ניצחת! ★', text||'כל הכבוד.', C.gold,[
    {label:'לשחק שוב', action:()=>{ hideOverlay(); GAME.restart(); }},
  ]); };
  function showOverlay(title, body, color, btns){
    elOverlay.className='overlay show';
    elOverlay.innerHTML=`<div class="ovbox"><div class="ovtitle" style="color:${color}">${esc(title)}</div>
      <div class="ovbody">${esc(body)}</div><div class="ovbtns"></div></div>`;
    const bw=elOverlay.querySelector('.ovbtns');
    btns.forEach(b=>{ const el=document.createElement('button'); el.className='ovbtn'; el.textContent=b.label;
      el.onclick=b.action; bw.appendChild(el); });
  }
  function hideOverlay(){ frozen=false; elOverlay.className='overlay'; elOverlay.innerHTML=''; }
  GAME.hideOverlay=hideOverlay;

  /* ---- save / load -------------------------------------------------------- */
  const SAVEKEY='kippa_arsit_save';
  GAME.save = ()=>{ try{ localStorage.setItem(SAVEKEY, JSON.stringify({
    flags, inv, scored, scoreVal, firstSeen, scene:cur&&cur.id,
    px:player.x, py:player.y, dir:player.dir, state:GAME.state })); GAME.say('נשמר.'); }catch(e){} };
  GAME.load = ()=>{ try{ const raw=localStorage.getItem(SAVEKEY); if(!raw){ GAME.restart(); return; }
    const d=JSON.parse(raw);
    Object.keys(flags).forEach(k=>delete flags[k]); Object.assign(flags,d.flags||{});
    inv.length=0; (d.inv||[]).forEach(i=>inv.push(i));
    Object.keys(scored).forEach(k=>delete scored[k]); Object.assign(scored,d.scored||{});
    scoreVal=d.scoreVal||0; Object.assign(firstSeen,d.firstSeen||{}); GAME.state=d.state||{};
    player.x=d.px||160; player.y=d.py||175; player.dir=d.dir||'right';
    frozen=false; renderInventory();
    enterScene(d.scene||'room_red', null, true);
  }catch(e){ GAME.restart(); } };
  GAME.restart = ()=>{ Object.keys(flags).forEach(k=>delete flags[k]);
    inv.length=0; Object.keys(scored).forEach(k=>delete scored[k]); scoreVal=0;
    GAME.state={}; firstSeen={}; GAME.selItem=null; frozen=false; renderInventory();
    enterScene(GAME._startScene||'room_red', null, true); };

  /* ---- scene transitions -------------------------------------------------- */
  function enterScene(id, entry, force){
    const s=scenes[id]; if(!s){ console.error('no scene',id); GAME.say('(החדר '+id+' עוד לא נבנה)'); return; }
    cur=s; msgQueue=[]; msgActive=false; closeChoice();
    const e = entry || s.entry || {x:160,y:175,dir:'right'};
    player.x=e.x; player.y=e.y; player.dir=e.dir||'right'; player.moving=false; player.path=null;
    renderTop();
    if(!firstSeen[id]){ firstSeen[id]=true; if(s.onFirst) try{s.onFirst();}catch(err){console.error(err);} }
    if(s.onEnter) try{s.onEnter();}catch(err){console.error(err);}
    GAME.sfx('door');
  }
  GAME.goto = (id, entry)=>{ // fade transition
    if(transitioning) return; transitioning=true; fadeAlpha=0; fadeDir=1; pendingScene={id,entry};
  };
  let transitioning=false, fadeAlpha=0, fadeDir=1, pendingScene=null;

  /* ============================ INPUT ===================================== */
  function logicalFromEvent(ev){
    const r=cv.getBoundingClientRect();
    const x=( (ev.clientX-r.left)/r.width )*W;
    const y=( (ev.clientY-r.top )/r.height)*H;
    return {x, y};
  }
  function hotspotAt(x,y){
    if(!cur) return null;
    for(const ex of (cur.exits||[])){ const r=ex.rect; if(x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h) return {kind:'exit',obj:ex}; }
    for(const h of (cur.hotspots||[])){ const r=h.rect; if(x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h) return {kind:'hot',obj:h}; }
    return null;
  }
  function nearPoint(h){
    if(h.near) return h.near;
    // default: stand just below the hotspot center, clamped to walkbox
    return clampToWalkbox(h.rect.x+h.rect.w/2, Math.min(H-12, h.rect.y+h.rect.h+6));
  }

  function applyVerb(hit, x, y){
    if(!hit){ // empty space: walk there (any verb) if floor
      GAME.walkTo(x,y); return;
    }
    const o=hit.obj;
    if(hit.kind==='exit'){
      const n = o.entry? clampToWalkbox(o.rect.x+o.rect.w/2, H-14) : nearPoint(o);
      GAME.walkTo(n.x, n.y, ()=>{
        if(typeof o.gate==='function' && !o.gate()){
          GAME.sfx('error'); if(o.gateFail) try{o.gateFail();}catch(e){}
          else GAME.say('אי אפשר לעבור כאן עכשיו.');
          return;
        }
        GAME.goto(o.to, o.entry);
      });
      return;
    }
    const h=o;
    const fire=(fn,arg)=>{ if(fn) { try{fn.call(h,arg);}catch(e){console.error(e);} } else defaultVerbMsg(); };
    switch(GAME.verb){
      case 'look': // look can be remote
        if(h.onLook) fire(h.onLook); else GAME.say(`${aOf(h.name)}. כלום מיוחד.`);
        break;
      case 'talk': {
        const n=nearPoint(h); GAME.walkTo(n.x,n.y, ()=> h.onTalk? fire(h.onTalk) : GAME.say('אין עם מי לדבר פה.'));
        break; }
      case 'take': {
        const n=nearPoint(h); GAME.walkTo(n.x,n.y, ()=> h.onTake? fire(h.onTake) : (GAME.sfx('error'),GAME.say('זה לא נלקח.')));
        break; }
      case 'use': {
        const it=GAME.selItem; const n=nearPoint(h);
        GAME.walkTo(n.x,n.y, ()=> { if(h.onUse) fire(h.onUse, it); else { GAME.sfx('error'); GAME.say('זה לא עובד ככה.'); } GAME.selItem=null; refreshVerbs(); });
        break; }
      case 'walk':
      default: {
        const n=nearPoint(h); GAME.walkTo(n.x,n.y);
        break; }
    }
  }
  function defaultVerbMsg(){ GAME.sfx('error'); GAME.say('לא קורה כלום.'); }
  function aOf(name){ return name||'זה'; }

  function onClick(ev){
    if(frozen || choiceOpen) return;
    if(advanceMsg()) return;            // dismiss current message first
    const {x,y}=logicalFromEvent(ev);
    if(y<0||y>H) return;
    applyVerb(hotspotAt(x,y), x, y);
  }

  // hover label
  let hoverName='';
  function onMove(ev){
    if(frozen) return;
    const {x,y}=logicalFromEvent(ev);
    const hit=hotspotAt(x,y);
    hoverName = hit? hit.obj.name : '';
    updateCursorLabel();
  }
  let elCursor=null;
  GAME._setCursorEl=(el)=>{elCursor=el;};
  function updateCursorLabel(){
    if(!elCursor) return;
    const verbL = (VERBS.find(v=>v.id===GAME.verb)||{}).label||'';
    const it = GAME.selItem? (items[GAME.selItem]?.name||'') : '';
    let s = it? `${it} על` : verbL;
    elCursor.textContent = hoverName? `${s} ${hoverName}` : (GAME.verb==='walk'? 'ללכת' : s);
  }

  function onKey(ev){
    if(ev.key===' '||ev.key==='Enter'){ if(advanceMsg()) ev.preventDefault(); }
    if(ev.key==='Tab'){ ev.preventDefault(); const i=VERBS.findIndex(v=>v.id===GAME.verb);
      GAME.verb=VERBS[(i+1)%VERBS.length].id; GAME.selItem=null; refreshVerbs(); }
    // verb hotkeys
    const map={l:'look',t:'talk',k:'take',u:'use',w:'walk'};
    if(map[ev.key]){ GAME.verb=map[ev.key]; GAME.selItem=null; refreshVerbs(); }
    if(ev.key==='F5'){ ev.preventDefault(); GAME.save(); }
    if(ev.key==='F7'){ ev.preventDefault(); GAME.load(); }
  }

  /* ============================ SFX ======================================= */
  let actx=null;
  function ac(){ if(!actx){ try{actx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){} } return actx; }
  function tone(freq,dur,type='square',vol=0.06,when=0){
    const a=ac(); if(!a) return; const t=a.currentTime+when;
    const o=a.createOscillator(), g=a.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t+dur);
  }
  const SFX={
    click:()=>tone(660,0.04,'square',0.04),
    blip:()=>tone(440,0.05,'triangle',0.03),
    talk:()=>{tone(520,0.05,'square',0.03);tone(620,0.04,'square',0.03,0.05);},
    pickup:()=>{tone(700,0.06,'square',0.05);tone(1040,0.08,'square',0.05,0.06);},
    score:()=>{tone(880,0.06,'square',0.05);tone(1320,0.1,'square',0.05,0.07);},
    error:()=>tone(140,0.12,'sawtooth',0.05),
    door:()=>{tone(200,0.08,'sine',0.04);tone(150,0.1,'sine',0.04,0.08);},
    walk:()=>tone(120,0.03,'square',0.02),
    death:()=>{[330,294,247,196].forEach((f,i)=>tone(f,0.2,'square',0.06,i*0.18));},
    win:()=>{[523,659,784,1047].forEach((f,i)=>tone(f,0.18,'square',0.06,i*0.14));},
  };
  GAME.sfx=(n)=>{ try{ if(SFX[n]) SFX[n](); }catch(e){} };

  /* ============================ RENDER LOOP =============================== */
  function drawPlayer(){
    const sc=sceneScaleAt(player.y);
    GAME.drawSprite(ctx,'red',player.x,player.y, Math.floor(player.frame)%4, player.dir, sc);
  }
  function render(){
    ctx.setTransform(RS,0,0,RS,0,0);        // hi-res; all drawing uses logical 320x200 coords
    ctx.fillStyle=C.black; ctx.fillRect(0,0,W,H);
    if(cur){
      const bg = GAME.img('bg_'+cur.id);
      if(bg) ctx.drawImage(bg, 0,0, W, H);
      else { try{ cur.drawBackground(ctx); }catch(e){ console.error('bg',e); } }
      drawPlayer();
      for(const h of (cur.hotspots||[])){ if(h.draw){ try{h.draw.call(h,ctx);}catch(e){} } }
      for(const ex of (cur.exits||[])){ if(ex.arrow) drawArrow(ex); }
    }
    if(transitioning) drawFade();
  }
  function drawArrow(ex){
    const r=ex.rect, cx=r.x+r.w/2, cy=r.y+r.h/2;
    ctx.globalAlpha=0.5+0.3*Math.sin(Date.now()/300);
    GAME.rect(ctx,cx-4,cy-1,8,2,C.white);
    if(ex.arrow==='right'){ GAME.poly(ctx,[[cx+4,cy-4],[cx+9,cy],[cx+4,cy+4]],C.white); }
    else if(ex.arrow==='left'){ GAME.poly(ctx,[[cx-4,cy-4],[cx-9,cy],[cx-4,cy+4]],C.white); }
    else if(ex.arrow==='up'){ GAME.poly(ctx,[[cx-4,cy-4],[cx,cy-9],[cx+4,cy-4]],C.white); }
    else if(ex.arrow==='down'){ GAME.poly(ctx,[[cx-4,cy+4],[cx,cy+9],[cx+4,cy+4]],C.white); }
    ctx.globalAlpha=1;
  }
  function drawFade(){
    ctx.globalAlpha=fadeAlpha; ctx.fillStyle=C.black; ctx.fillRect(0,0,W,H); ctx.globalAlpha=1;
  }
  function step(){
    if(!frozen){
      updatePlayer();
      if(transitioning){
        fadeAlpha += 0.08*fadeDir;
        if(fadeDir>0 && fadeAlpha>=1){ // midpoint: swap scene
          enterScene(pendingScene.id, pendingScene.entry, true); fadeDir=-1;
        } else if(fadeDir<0 && fadeAlpha<=0){ fadeAlpha=0; transitioning=false; pendingScene=null; }
      }
    }
    render();
    requestAnimationFrame(step);
  }

  /* ---- helpers ------------------------------------------------------------ */
  function esc(s){ return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  /* ============================ BOOT ====================================== */
  GAME.start = function(startScene){
    GAME._startScene = startScene;
    cv.addEventListener('click', onClick);
    cv.addEventListener('mousemove', onMove);
    window.addEventListener('keydown', onKey);
    enterScene(startScene, null, true);
    requestAnimationFrame(step);
  };

  GAME.W=W; GAME.H=H;
})();
