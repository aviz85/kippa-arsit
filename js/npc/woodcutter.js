/* js/npc/woodcutter.js — חוטב העצים (the grumpy woodcutter NPC)
   Burly lumberjack: thick beard, red/black flannel shirt, blue jeans, brown boots,
   an axe resting on his shoulder. Grumpy brow. Soft heart under the gruff.
   Drawn via GAME.drawSprite(ctx,'woodcutter',x,y,frame,dir,scale). x,y = feet center (bottom-center). */
(function(){
  const C = GAME.C;

  // rel(): draw a rect relative to feet (fx,fy); (0,0)=feet center, negative y = up. Scaled by s.
  function rel(ctx, fx, fy, s, lx, ly, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(fx + lx*s), Math.round(fy + ly*s),
                 Math.max(1,Math.round(w*s)), Math.max(1,Math.round(h*s)));
  }

  GAME.registerSprite('woodcutter', { w:22, h:40, draw(ctx,x,y,frame,dir,s){
    s = s || 1;
    dir = dir || 'down';
    const back = (dir==='up');
    const side = (dir==='left' || dir==='right');
    const flip = (dir==='left');
    const fx = x, fy = y;
    const R = (lx,ly,w,h,col)=> rel(ctx,fx,fy,s, flip? -lx-w : lx, ly, w, h, col);

    // walk cycle: 1 & 3 = mid-stride (heavy plod), 0 & 2 = contact/neutral.
    const f = ((frame|0)%4+4)%4;
    const stride = (f===1)? 1 : (f===3? -1 : 0);
    const bob = (f===1||f===3)? 1 : 0;
    const by = -bob;

    // flannel / lumberjack tones
    const FLAN  = C.red;        // base flannel red
    const FLAND = C.darkRed;    // flannel shade
    const PLAID = C.black;      // plaid grid lines
    const JEAN  = C.blue;       // jeans
    const JEAND = C.darkBlue;   // jeans shade
    const BOOT  = C.brown;
    const BOOTD = C.dkGray;     // boot sole
    const BEARD = C.brown;      // bushy brown beard
    const BEARDD= '#6b3f1d';    // beard shade

    // ---- soft shadow ellipse ----
    GAME.ellipse(ctx, fx, fy, Math.max(2,9*s), Math.max(1,2.5*s), 'rgba(0,0,0,.32)');

    // ===================== LEGS (blue jeans) =====================
    R(-6, -12, 5, 12, JEAN);     // left leg
    R(1,  -12, 5, 12, JEAN);     // right leg
    R(-6, -12, 1, 12, JEAND);    // left leg shade
    R(5,  -12, 1, 12, JEAND);    // right leg shade
    R(-1, -12, 2, 11, JEAND);    // inseam seam shade
    // stitched cuffs
    R(-6, -3, 5, 1, JEAND);
    R(1,  -3, 5, 1, JEAND);

    // ---- heavy boots ----
    const lLift = (stride<0)? 1 : 0;   // back foot lifts
    const rLift = (stride>0)? 1 : 0;
    R(-7, -2+lLift, 6, 2, BOOT);       // left boot
    R(1,  -2+rLift, 6, 2, BOOT);       // right boot
    R(-7, -1+lLift, 6, 1, BOOTD);      // sole L
    R(1,  -1+rLift, 6, 1, BOOTD);      // sole R

    // ===================== TORSO (red flannel, broad) =====================
    R(-9, -28+by, 18, 16, FLAN);
    R(-9, -28+by, 18, 2, FLAND);       // shoulder shade
    R(-9, -14+by, 18, 1, FLAND);       // hem shade
    R(-9, -28+by, 1, 16, FLAND);       // side shade L
    R(8,  -28+by, 1, 16, FLAND);       // side shade R
    // plaid grid — vertical lines
    R(-5, -28+by, 1, 16, PLAID);
    R(0,  -28+by, 1, 16, PLAID);
    R(4,  -28+by, 1, 16, PLAID);
    // plaid grid — horizontal lines
    R(-9, -24+by, 18, 1, PLAID);
    R(-9, -19+by, 18, 1, PLAID);

    if(!back){
      // open collar + buttoned placket
      R(-1, -28+by, 2, 14, FLAND);     // center button placket
      R(0,  -26+by, 1, 1, C.gold);     // button
      R(0,  -22+by, 1, 1, C.gold);     // button
      R(0,  -18+by, 1, 1, C.gold);     // button
    } else {
      // back yoke seam
      R(-9, -26+by, 18, 1, PLAID);
    }

    // ===================== ARMS (rolled flannel sleeves) =====================
    // one arm lifted to hold the axe handle on the shoulder; arms swing slightly when walking.
    const swing = (f===1)? 1 : (f===3? -1 : 0);
    // LEFT arm hangs/swings
    const lArmY = -27+by + (swing>0? 0 : 1);
    R(-11, lArmY, 3, 9, FLAN);         // left sleeve
    R(-11, lArmY, 1, 9, FLAND);        // sleeve shade
    R(-11, lArmY+3, 3, 1, PLAID);      // plaid cuff line
    R(-11, lArmY+8, 3, 3, C.skin);     // left forearm/hand (rolled cuff)
    R(-11, lArmY+8, 1, 3, '#d9a980');  // forearm shade

    // RIGHT arm raised, gripping the axe handle resting on shoulder
    const rArmY = -29+by;
    R(8, rArmY, 3, 7, FLAN);           // upper right sleeve
    R(8, rArmY, 1, 7, FLAND);
    R(8, rArmY+5, 3, 4, C.skin);       // forearm reaching up
    R(8, rArmY+5, 1, 4, '#d9a980');
    R(8, rArmY+8, 3, 2, C.skin);       // gripping fist

    // ===================== AXE on the shoulder =====================
    if(!back){
      // wooden handle running up over the right shoulder, diagonally back
      R(8,  -38+by, 2, 12, BOOT);      // handle (brown)
      R(8,  -38+by, 1, 12, BEARDD);    // handle shade
      // axe head at the top
      R(6,  -42+by, 6, 4, C.ltGray);   // metal head
      R(6,  -42+by, 6, 1, C.white);    // top glint
      R(11, -42+by, 2, 4, C.gray);     // blade edge bulge
      R(6,  -39+by, 6, 1, C.dkGray);   // head shade
      R(6,  -42+by, 1, 4, C.dkGray);   // back of head
    } else {
      // viewed from behind: axe head pokes over the far shoulder
      R(-12, -40+by, 6, 4, C.ltGray);
      R(-12, -40+by, 6, 1, C.white);
      R(-13, -40+by, 2, 4, C.gray);
      R(-7,  -40+by, 2, 11, BOOT);     // handle going down his back
    }

    // ===================== NECK + HEAD =====================
    R(-3, -31+by, 6, 3, C.skin);       // thick neck
    R(-3, -31+by, 6, 1, '#d9a980');    // neck shade

    if(back){
      // back of head: hair + cap, no face
      R(-6, -41+by, 12, 11, C.skin);   // head base (will be mostly covered)
      R(-6, -41+by, 12, 7, BEARDD);    // hair from behind
      R(-6, -42+by, 12, 4, C.dkGray);  // wool beanie back
      R(-6, -42+by, 12, 1, C.gray);    // beanie highlight
      // beard wraps slightly to the sides
      R(-7, -34+by, 2, 4, BEARD);  R(5,-34+by,2,4,BEARD);
      return;
    }

    // face base
    R(-6, -41+by, 12, 11, C.skin);
    R(-6, -41+by, 1, 8, '#e0b48f');    // cheek shade

    if(side){
      // ---- profile ----
      // big bushy beard covering lower face & jaw (facing forward)
      R(-2, -36+by, 8, 8, BEARD);
      R(-2, -36+by, 8, 1, BEARDD);
      R(4,  -34+by, 3, 5, BEARD);      // beard juts forward
      R(-2, -29+by, 8, 1, BEARDD);     // beard underside shade
      // nose nub on facing side
      R(5, -38+by, 2, 2, C.skin);
      R(6, -38+by, 1, 1, '#e0b48f');
      // grumpy brow (single, low & heavy)
      R(0, -39+by, 5, 2, BEARDD);
      // one squinting eye under the brow
      R(2, -38+by, 2, 1, C.black);
    } else {
      // ---- front face ----
      // grumpy heavy brows, angled down toward the nose
      R(-5, -39+by, 4, 2, BEARDD);     // left brow
      R(1,  -39+by, 4, 2, BEARDD);     // right brow
      R(-4, -38+by, 3, 1, BEARDD);     // brow inner droop L
      R(1,  -38+by, 3, 1, BEARDD);     // brow inner droop R
      // squinty grumpy eyes
      R(-4, -37+by, 2, 2, C.white);  R(2, -37+by, 2, 2, C.white);
      R(-3, -37+by, 1, 1, C.black);  R(2, -37+by, 1, 1, C.black); // pupils (close-set glare)
      // bulbous nose
      R(-1, -36+by, 3, 2, C.skin);
      R(-1, -35+by, 3, 1, '#d9a980');
      // ---- big bushy brown beard (covers mouth & jaw) ----
      R(-6, -34+by, 12, 6, BEARD);
      R(-6, -34+by, 12, 1, BEARDD);    // mustache shade line
      R(-5, -28+by, 10, 2, BEARD);     // beard hangs lower
      R(-5, -28+by, 10, 1, BEARDD);
      R(-2, -26+by, 4, 1, BEARDD);     // beard tip
      // mustache hint over the beard
      R(-3, -34+by, 6, 1, BEARDD);
    }

    // ===================== WOOL BEANIE / hat =====================
    if(side){
      R(-6, -44+by, 11, 4, C.dkGray);  // beanie crown
      R(-6, -41+by, 11, 1, C.gray);    // fold band
      R(-6, -44+by, 11, 1, C.gray);    // highlight
    } else {
      R(-6, -44+by, 12, 4, C.dkGray);  // crown
      R(-6, -41+by, 12, 2, C.gray);    // rolled fold band
      R(-6, -44+by, 12, 1, '#9a9a9a'); // top highlight
      R(-6, -40+by, 12, 1, C.dkGray);  // band bottom shade
    }
  }});

})();
