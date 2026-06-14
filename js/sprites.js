/* sprites.js — character sprites. Player 'red' is canonical; NPCs added by scenes/agents.
   draw(ctx, x, y, frame, dir, scale): x,y = feet center (bottom-center). */
(function(){
  const C = GAME.C;

  // helper: draw a rect relative to feet (fx,fy), in sprite-local coords where
  // (0,0)=feet center, negative y = up. Scaled by s.
  function rel(ctx, fx, fy, s, lx, ly, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(fx + lx*s), Math.round(fy + ly*s),
                 Math.max(1,Math.round(w*s)), Math.max(1,Math.round(h*s)));
  }

  /* ---------------- RED — כיפה הארסית (player) ----------------------------
     A crisp Israeli street-kid "ארסית": red cap, sunglasses, gold chain,
     red zip jacket, black track pants w/ white stripes, white sneakers, attitude.
     dir: left|right|up|down. frame 0..3 = 2-step walk cycle. */
  GAME.registerSprite('red', { w:18, h:36, draw(ctx,x,y,frame,dir,s){
    s=s||1;
    dir = dir || 'down';
    const back = (dir==='up');
    const side = (dir==='left' || dir==='right');
    const flip = (dir==='left');
    const fx=x, fy=y;
    // R draws in feet-local coords; flip mirrors horizontally for facing left.
    const R=(lx,ly,w,h,col)=> rel(ctx,fx,fy,s, flip? -lx-w : lx, ly, w, h, col);

    // walk cycle: frames 1 & 3 are mid-stride, 0 & 2 are contact/neutral.
    const f = ((frame|0)%4+4)%4;
    const stride = (f===1)? 1 : (f===3? -1 : 0);   // which leg forward
    const bob = (f===1||f===3)? 1 : 0;             // vertical body bounce
    const by = -bob;                                // body lift offset (neg = up)

    // ---- soft shadow ellipse ----
    GAME.ellipse(ctx, fx, fy, Math.max(2,8*s), Math.max(1,2.5*s), 'rgba(0,0,0,.32)');

    // ===================== LEGS (black track pants) =====================
    // base both legs; stride pushes one foot fwd, lifts the other.
    const lLegFwd = (stride>0), rLegFwd = (stride<0);
    // left leg
    R(-5, -11, 4, 11, C.black);
    // right leg
    R(1,  -11, 4, 11, C.black);
    // white side stripes (Adidas-style)
    R(-6, -11, 1, 9, C.white);
    R(5,  -11, 1, 9, C.white);
    // shadow seam between legs
    R(-1, -11, 2, 10, '#0a0a0a');

    // ---- sneakers (white, raised when leg lifts) ----
    const lShoe = lLegFwd? -1 : 0;   // forward foot sits a touch forward/down
    const rShoe = rLegFwd? -1 : 0;
    const lLift = (stride<0)? 1 : 0; // back foot lifts off
    const rLift = (stride>0)? 1 : 0;
    R(-6, -2+lLift, 5, 2, C.white);            // left sneaker
    R(0,  -2+rLift, 5, 2, C.white);            // right sneaker
    R(-6, -1+lLift, 5, 1, C.ltGray);           // sole shade L
    R(0,  -1+rLift, 5, 1, C.ltGray);           // sole shade R

    // ===================== TORSO (red zip jacket) =======================
    R(-6, -23+by, 12, 12, C.red);
    R(-6, -23+by, 12, 2, C.darkRed);           // shoulder shade
    R(-6, -13+by, 12, 1, C.darkRed);           // hem shade
    if(!back){
      R(-1, -23+by, 2, 12, C.darkRed);         // center zip line
      R(-5, -21+by, 1, 8, '#a31f21');          // left panel seam
      R(4,  -21+by, 1, 8, '#a31f21');          // right panel seam
      // ---- gold chain ----
      R(-4, -22+by, 8, 1, C.gold);
      R(-1, -21+by, 2, 2, C.gold);             // pendant
      R(-1, -21+by, 1, 1, C.yellow);           // pendant glint
    } else {
      // back: collar + hood-ish detail
      R(-3, -23+by, 6, 2, C.darkRed);
      R(-1, -22+by, 2, 7, '#a31f21');          // spine seam
    }

    // ===================== ARMS =========================================
    // arms swing opposite to legs while walking.
    const swing = (f===1)? 1 : (f===3? -1 : 0);
    const lArmY = -22+by + (swing>0? 0 : 1);
    const rArmY = -22+by + (swing<0? 0 : 1);
    // sleeves (red), hands (skin)
    R(-8, lArmY, 2, 8, C.red);   R(-8, lArmY, 1, 8, C.darkRed);  // L sleeve + shade
    R(6,  rArmY, 2, 8, C.red);   R(7,  rArmY, 1, 8, C.darkRed);  // R sleeve + shade
    R(-8, lArmY+8, 2, 2, C.skin);                                // L hand
    R(6,  rArmY+8, 2, 2, C.skin);                                // R hand

    // ===================== NECK + HEAD ==================================
    R(-2, -25+by, 4, 2, C.skin);               // neck
    R(-2, -25+by, 4, 1, '#d9a980');            // neck shade
    R(-5, -33+by, 10, 9, C.skin);              // face/head base
    R(-5, -33+by, 1, 9, '#e0b48f');            // left cheek shade

    if(back){
      // back of head: hair fills, cap brim hidden
      R(-5, -33+by, 10, 6, C.black);
      R(-5, -27+by, 10, 1, '#1a1a1a');
    } else if(side){
      // ---- profile face ----
      // hair sideburn + nape
      R(flip? 3 : -5, -33+by, 2, 7, C.black);
      // nose nub on facing side
      R(flip? -6 : 4, -29+by, 2, 2, C.skin);
      R(flip? -6 : 5, -29+by, 1, 1, '#e0b48f');
      // one eye (covered by shades below); brow attitude
      R(-2, -30+by, 4, 1, C.black);            // brow
      // mouth: smug little line
      R(-2, -27+by, 3, 1, '#9c6b4a');
    } else {
      // ---- front face ----
      R(-5, -33+by, 2, 7, C.black); R(3,-33+by,2,7,C.black);  // sideburns
      // eyes + angled "attitude" brows (visible under-frame)
      R(-3, -29+by, 2, 2, C.black);  R(1, -29+by, 2, 2, C.black);
      R(-4, -30+by, 3, 1, C.black);  R(1, -30+by, 3, 1, C.black);
      // tiny nose + smug mouth
      R(-1, -28+by, 1, 1, '#d9a980');
      R(-2, -26+by, 4, 1, '#9c6b4a');
      R(2,  -26+by, 1, 1, '#9c6b4a');          // smirk uptick
    }

    // ===================== RED CAP / כיפה (snapback) =====================
    if(back){
      R(-6, -36+by, 12, 4, C.red);
      R(-6, -35+by, 12, 1, C.darkRed);
      R(-2, -32+by, 4, 1, C.white);            // snapback band
    } else if(side){
      // cap crown + forward brim on facing side
      R(-6, -36+by, 11, 3, C.red);
      R(-6, -35+by, 11, 1, C.darkRed);
      R(flip? -8 : 4, -34+by, 4, 1, C.darkRed);// brim sticks out front
      R(flip? -8 : 4, -34+by, 4, 1, C.darkRed);
    } else {
      R(-6, -36+by, 12, 3, C.red);             // crown
      R(-6, -34+by, 12, 1, C.darkRed);         // brim line
      R(-7, -34+by, 14, 1, C.darkRed);         // flat brim overhang
      R(-6, -36+by, 12, 1, '#e84548');         // top highlight
      R(-1, -36+by, 2, 3, C.white);            // little logo patch
    }

    // ===================== SUNGLASSES ===================================
    // worn down on the eyes when facing down/side; pushed up on cap when up.
    if(back){
      // resting on the back/top of cap
      R(-4, -35+by, 3, 1, C.black); R(1, -35+by, 3, 1, C.black);
    } else if(side){
      R(-2, -31+by, 4, 2, C.night);            // single lens (profile)
      R(-2, -31+by, 4, 1, C.steel);            // glare
    } else {
      R(-5, -31+by, 4, 2, C.night);            // L lens
      R(1,  -31+by, 4, 2, C.night);            // R lens
      R(-1, -31+by, 2, 1, C.black);            // bridge
      R(-5, -31+by, 4, 1, C.steel);            // L glare
      R(1,  -31+by, 4, 1, C.steel);            // R glare
    }
  }});

  /* ---------------- generic placeholder NPC ------------------------------- */
  GAME.registerSprite('placeholder', { w:16, h:32, draw(ctx,x,y,frame,dir,s){
    s=s||1; GAME.ellipse(ctx,x,y,6*s,2*s,'rgba(0,0,0,.3)');
    rel(ctx,x,y,s,-5,-22,10,22,C.purple);
    rel(ctx,x,y,s,-4,-30,8,8,C.skin);
  }});

})();
