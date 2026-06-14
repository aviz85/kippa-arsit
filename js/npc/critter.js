/* js/npc/critter.js — NPC sprite 'critter': a small cute forest rabbit (~16px tall).
   Appears in deep_forest as a shy bunny that hops/flees. Pure decoration/comedy.
   Convention (from sprites.js): draw(ctx,x,y,frame,dir,s) where x,y = feet
   bottom-center, negative ly = up, scaled by s. Top-left light, black 1px outlines. */
(function(){
  const C = GAME.C;

  // rel rect: (lx,ly)=sprite-local from feet center, negative ly = up. Flips on 'left'.
  function rel(ctx, fx, fy, s, flip, lx, ly, w, h, color){
    const L = flip ? (-lx - w) : lx;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(fx + L*s), Math.round(fy + ly*s),
                 Math.max(1, Math.round(w*s)), Math.max(1, Math.round(h*s)));
  }

  GAME.registerSprite('critter', { w:14, h:16, draw(ctx, x, y, frame, dir, s){
    s = s || 1;
    const flip = (dir === 'left');
    const fx = x, fy = y;
    const R = (lx,ly,w,h,col)=> rel(ctx, fx, fy, s, flip, lx, ly, w, h, col);

    // hop cycle: frames 1 & 3 lift the bunny off the ground a touch.
    const f = ((frame|0)%4+4)%4;
    const hop = (f===1 || f===3) ? 2 : 0;   // vertical lift while fleeing
    const by = -hop;                         // body offset (neg = up)

    // ---- soft shadow (stays on ground, shrinks on the up-beat) ----
    GAME.ellipse(ctx, fx, fy, Math.max(2, (hop?4:6)*s), Math.max(1, 2*s), 'rgba(0,0,0,.30)');

    // ===================== HIND FOOT (white) =====================
    // splayed back paw on the ground when landed, tucked when hopping.
    if(!hop){
      R(-4, -2, 6, 2, C.white);            // back foot pad
      R(-4, -1, 6, 1, C.ltGray);           // sole shade
    } else {
      R(-3, -3, 5, 2, C.white);            // tucked foot mid-hop
    }

    // ===================== TAIL (fluffy cotton ball) =====================
    R(4, -8+by, 3, 3, C.white);
    R(4, -8+by, 3, 1, C.ltGray);           // tiny shade

    // ===================== BODY (round, soft brown) =====================
    R(-4, -10+by, 9, 8, C.brown);          // body block
    R(-4, -10+by, 9, 1, C.tan);            // top-light highlight
    R(-4, -3+by, 9, 1, '#5a3a1a');         // belly shade
    R(4, -10+by, 1, 8, '#5a3a1a');         // right-side shade
    R(-4, -7+by, 7, 2, C.tan);             // pale belly fluff

    // ===================== HEAD (round, facing forward-left) =====================
    R(-7, -14+by, 7, 6, C.brown);          // head
    R(-7, -14+by, 7, 1, C.tan);            // top-light
    R(-7, -14+by, 1, 6, C.tan);            // cheek highlight (facing side)

    // ---- ears (the cute money shot — two long upright ears) ----
    R(-6, -20+by, 2, 7, C.brown);          // left ear
    R(-6, -20+by, 2, 1, C.tan);            // ear tip light
    R(-5, -19+by, 1, 5, C.pink);           // inner-ear pink
    R(-2, -20+by, 2, 7, C.brown);          // right ear
    R(-2, -20+by, 2, 1, C.tan);
    R(-1, -19+by, 1, 5, C.pink);           // inner-ear pink

    // ---- face: big eye, tiny pink nose, whiskers, mouth ----
    R(-6, -12+by, 2, 2, C.black);          // big shiny eye
    R(-6, -12+by, 1, 1, C.white);          // eye glint
    R(-7, -10+by, 1, 1, C.pink);           // little nose
    R(-9, -10+by, 2, 1, C.ltGray);         // whisker
    R(-9, -9+by, 2, 1, C.ltGray);          // whisker
    R(-7, -8+by, 2, 1, '#5a3a1a');         // tiny mouth line

    // ---- front paw resting under the chin (cute) when landed ----
    if(!hop){
      R(-5, -3+by, 3, 2, C.white);         // little front paw
    }
  }});

})();
