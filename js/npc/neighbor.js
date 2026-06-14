/* js/npc/neighbor.js — השכן/הקיוסקאי: hood kiosk shopkeeper.
   Tank top (גופייה), backwards cap, a friendly bit of belly, big easy grin,
   gold chain, hairy arms, sandals. Warm street-corner vibe.
   Convention (see js/sprites.js): x,y = feet bottom-center; rel() offsets up = -y; scaled by s. */
(function(){
  const C = GAME.C;

  // rel: paint a rect relative to feet (fx,fy). (0,0)=feet center, -y = up. Scaled by s.
  function rel(ctx, fx, fy, s, lx, ly, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(fx + lx*s), Math.round(fy + ly*s),
                 Math.max(1, Math.round(w*s)), Math.max(1, Math.round(h*s)));
  }

  GAME.registerSprite('neighbor', { w:22, h:36, draw(ctx, x, y, frame, dir, s){
    s = s || 1;
    dir = dir || 'down';
    const back = (dir === 'up');
    const side = (dir === 'left' || dir === 'right');
    const flip = (dir === 'left');
    const fx = x, fy = y;
    // R(): mirror-aware rect placement so dir flips the whole figure
    const R = (lx, ly, w, h, col)=> rel(ctx, fx, fy, s, flip ? -lx-w : lx, ly, w, h, col);

    // mostly a standing kiosk guy; a gentle idle/walk bob keeps him alive
    const f = ((frame|0)%4+4)%4;
    const bob = (f===1||f===3) ? 1 : 0;
    const by = -bob;
    // legs shift a touch when "walking" frames hit
    const stride = (f===1) ? 1 : (f===3 ? -1 : 0);

    // ---- soft shadow ellipse (wide — he's a solid guy) ----
    GAME.ellipse(ctx, fx, fy, Math.max(2, 9*s), Math.max(1, 2.5*s), 'rgba(0,0,0,.32)');

    // ===================== LEGS (cargo/khaki shorts + hairy shins) ==========
    R(-6, -8, 5, 8, C.skin);                 // left shin
    R(1,  -8, 5, 8, C.skin);                 // right shin
    R(-6, -7, 1, 6, C.tan);                  // left shin shade
    R(5,  -7, 1, 6, C.tan);                  // right shin shade
    // leg hair flecks
    R(-4, -6, 1, 1, C.brown); R(3, -5, 1, 1, C.brown);
    R(-3, -3, 1, 1, C.brown); R(2, -7, 1, 1, C.brown);

    // ---- shorts (baggy khaki, hang low over the thighs) ----
    R(-7, -15, 14, 8, C.tan);                // shorts body
    R(-7, -15, 14, 1, C.brown);             // waist seam
    R(-7, -8,  14, 1, C.brown);             // hem shade
    R(-1, -14, 2, 6, C.brown);              // center fly seam
    R(-6, -13, 3, 2, C.brown);              // cargo pocket L
    R(3,  -13, 3, 2, C.brown);              // cargo pocket R

    // ---- sandals (kiosk-guy classic) over bare feet ----
    const lShoe = (stride>0) ? 1 : 0;
    const rShoe = (stride<0) ? 1 : 0;
    R(-7, -1-lShoe, 6, 1, C.darkRed);        // left sandal sole
    R(0,  -1-rShoe, 6, 1, C.darkRed);        // right sandal sole
    R(-6, -2-lShoe, 4, 1, C.brown);          // left strap
    R(1,  -2-rShoe, 4, 1, C.brown);          // right strap

    // ===================== BELLY + TANK TOP (גופייה) =======================
    // a friendly belly bulges past the tank top; tank is a classic white wife-beater
    R(-8, -27+by, 16, 12, C.skin);           // torso/belly base (skin under tank)
    R(-8, -19+by, 16, 4, C.tan);             // lower belly shade where it rounds out
    R(-7, -27+by, 14, 9, C.white);           // tank top fabric (stops above the belly)
    R(-7, -27+by, 14, 1, C.ltGray);          // tank top top edge highlight
    R(-7, -19+by, 14, 1, C.gray);            // tank hem shade
    if(!back){
      // tank straps + neckline
      R(-6, -28+by, 2, 2, C.white);          // left strap
      R(4,  -28+by, 2, 2, C.white);          // right strap
      R(-3, -27+by, 6, 2, C.skin);           // chest skin in the neckline
      // a little chest hair peeking (friendly, not crude)
      R(-1, -26+by, 1, 1, C.brown);
      // belly button
      R(0, -18+by, 1, 1, C.tan);
      // ---- gold chain on the chest ----
      R(-3, -26+by, 6, 1, C.gold);
      R(0,  -25+by, 1, 2, C.gold);           // pendant
      R(0,  -25+by, 1, 1, C.yellow);         // glint
      // faded stain on the tank (he's been frying things) — character detail
      R(2, -22+by, 2, 2, C.tan);
    } else {
      // back of the tank: shoulder blades + chain clasp
      R(-6, -27+by, 12, 8, C.white);
      R(-6, -27+by, 12, 1, C.ltGray);
      R(-1, -26+by, 2, 1, C.gold);           // chain clasp
      R(-1, -25+by, 2, 6, C.gray);           // spine shade
    }

    // ===================== ARMS (bare, beefy, hairy, friendly) =============
    const swing = (f===1) ? 1 : (f===3 ? -1 : 0);
    const lArmY = -26+by + (swing>0 ? 0 : 1);
    const rArmY = -26+by + (swing<0 ? 0 : 1);
    // upper arms (skin), with a tan shade for roundness
    R(-10, lArmY, 3, 7, C.skin);  R(-10, lArmY, 1, 7, C.tan);
    R(7,   rArmY, 3, 7, C.skin);  R(9,   rArmY, 1, 7, C.tan);
    // forearm hair flecks
    R(-9, lArmY+3, 1, 1, C.brown); R(8, rArmY+4, 1, 1, C.brown);
    R(-9, lArmY+5, 1, 1, C.brown); R(8, rArmY+2, 1, 1, C.brown);
    // hands (skin)
    R(-10, lArmY+7, 3, 2, C.skin);
    R(7,   rArmY+7, 3, 2, C.skin);
    R(-10, lArmY+8, 3, 1, C.tan);
    R(7,   rArmY+8, 3, 1, C.tan);

    // ===================== NECK + HEAD (round, jolly) ======================
    R(-3, -30+by, 6, 3, C.skin);             // thick neck
    R(-3, -29+by, 6, 1, C.tan);              // neck shade
    R(-3, -28+by, 6, 1, C.tan);              // double-chin hint (jolly)

    R(-5, -39+by, 11, 9, C.skin);            // round face
    R(-5, -39+by, 11, 1, C.tan);             // forehead shade
    R(-6, -36+by, 1, 4, C.skin); R(5, -36+by, 1, 4, C.skin); // ears

    if(back){
      // back of head + nape under the cap
      R(-5, -36+by, 11, 4, C.brown);         // hair/nape
      R(-5, -33+by, 11, 1, '#5a3818');
    } else if(side){
      // ---- profile ----
      R(flip? 4 : -5, -38+by, 2, 6, C.brown);   // sideburn/nape
      R(flip? -6 : 4, -35+by, 2, 2, C.skin);    // nose nub
      R(flip? -6 : 5, -35+by, 1, 1, C.tan);
      // mustache (he has a hood-uncle mustache)
      R(-3, -33+by, 5, 1, C.brown);
      // one eye + warm crinkle
      R(-1, -35+by, 2, 2, C.black);
      // big grin in profile
      R(-3, -32+by, 4, 1, C.darkRed);
    } else {
      // ---- front face: big friendly grin ----
      R(-5, -39+by, 2, 4, C.brown); R(4, -39+by, 2, 4, C.brown); // sideburns
      // warm round eyes
      R(-3, -35+by, 2, 2, C.black);  R(2, -35+by, 2, 2, C.black);
      R(-3, -35+by, 1, 1, C.white);  R(2, -35+by, 1, 1, C.white); // catch-lights (friendly)
      // soft brows (relaxed, raised — welcoming)
      R(-4, -37+by, 3, 1, C.brown);  R(2, -37+by, 3, 1, C.brown);
      // chunky nose
      R(-1, -34+by, 2, 2, C.skin);   R(-1, -33+by, 2, 1, C.tan);
      // ---- mustache + big toothy grin ----
      R(-4, -32+by, 9, 1, C.brown);          // mustache across the lip
      R(-4, -31+by, 9, 2, C.darkRed);        // open smile
      R(-3, -31+by, 7, 1, C.white);          // teeth
      // rosy, cheerful cheeks
      R(-5, -33+by, 1, 1, C.pink);  R(4, -33+by, 1, 1, C.pink);
      // a little stubble shadow on the jaw
      R(-4, -31+by, 1, 1, C.tan);   R(4, -31+by, 1, 1, C.tan);
    }

    // ===================== CAP (backwards snapback — kiosk style) ===========
    if(back){
      // brim sticks OUT the back when worn backwards and seen from behind
      R(-6, -43+by, 12, 4, C.blue);          // crown
      R(-6, -42+by, 12, 1, C.darkBlue);
      R(-7, -39+by, 14, 1, C.darkBlue);      // flat brim overhang (back)
      R(-2, -41+by, 4, 1, C.white);          // snapback band/logo
    } else if(side){
      R(-6, -43+by, 11, 4, C.blue);          // crown
      R(-6, -42+by, 11, 1, C.darkBlue);
      // worn backwards → brim points to the BACK of the head in profile
      R(flip? 4 : -7, -41+by, 3, 1, C.darkBlue);
      R(-5, -40+by, 2, 1, C.white);          // adjuster band peeking
    } else {
      // front view, cap worn backwards → snapback band shows on the forehead
      R(-6, -42+by, 12, 3, C.blue);          // crown
      R(-6, -42+by, 12, 1, C.cyan);          // top highlight
      R(-6, -40+by, 12, 1, C.darkBlue);      // band base
      R(-2, -40+by, 4, 1, C.white);          // plastic snapback strap
      R(-1, -40+by, 2, 1, C.dkGray);         // strap holes
      R(-6, -40+by, 12, 1, C.darkBlue);
    }
  }});
})();
