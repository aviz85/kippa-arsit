/* js/npc/granny.js — סבתא: sweet-old-lady sprite (grey bun, glasses, shawl)
   with a faint unsettling glint in the eye. Bed-side / sitting-up pose.
   Convention (see js/sprites.js): x,y = feet bottom-center; rel() offsets up = -y; scaled by s. */
(function(){
  const C = GAME.C;

  // rel: paint a rect relative to feet (fx,fy). (0,0)=feet center, -y = up. Scaled by s.
  function rel(ctx, fx, fy, s, lx, ly, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(fx + lx*s), Math.round(fy + ly*s),
                 Math.max(1, Math.round(w*s)), Math.max(1, Math.round(h*s)));
  }

  GAME.registerSprite('granny', { w:20, h:36, draw(ctx, x, y, frame, dir, s){
    s = s || 1;
    const flip = dir === 'left';
    const fx = x, fy = y;
    // R(): mirror-aware rect placement so dir flips the whole figure
    const R = (lx, ly, w, h, col)=> rel(ctx, fx, fy, s, flip ? -lx-w : lx, ly, w, h, col);

    // shadow on the floor
    GAME.ellipse(ctx, fx, fy, Math.max(2, 8*s), Math.max(1, 2*s), 'rgba(0,0,0,.32)');

    // ---- slippers / feet (peeking from under the long nightgown) ----
    R(-6, -3, 5, 3, C.pink);  R(1, -3, 5, 3, C.pink);
    R(-6, -2, 5, 1, C.darkRed); R(1, -2, 5, 1, C.darkRed);

    // ---- long nightgown / dress (modest, grandmotherly) ----
    R(-8, -22, 16, 20, C.ltGray);          // skirt body, flares to the floor
    R(-7, -24, 14, 4, C.white);            // bodice top, lighter
    R(-8, -22, 16, 1, C.dkGray);           // waist seam shade
    // soft floral dabs on the gown
    R(-5, -16, 1, 1, C.pink);  R(3, -13, 1, 1, C.pink);
    R(-1, -18, 1, 1, C.red);   R(5, -19, 1, 1, C.pink);
    R(-6, -9,  1, 1, C.red);   R(2, -7,  1, 1, C.pink);

    // ---- knitted shawl over the shoulders ----
    R(-9, -30, 18, 7, C.purple);           // shawl drape
    R(-9, -30, 18, 1, '#7a3a96');          // shawl highlight edge
    R(-9, -24, 3, 4, C.purple);  R(6, -24, 3, 4, C.purple); // shawl points hanging
    // shawl knit texture (subtle dither dots)
    R(-7, -28, 1, 1, '#7a3a96'); R(-2, -27, 1, 1, '#7a3a96');
    R(3, -28, 1, 1, '#7a3a96');  R(6, -26, 1, 1, '#7a3a96');

    // ---- hands folded sweetly in the lap (skin, frail) ----
    R(-5, -23, 4, 3, C.skin);  R(1, -23, 4, 3, C.skin);
    R(-5, -23, 4, 1, C.tan);   R(1, -23, 4, 1, C.tan); // knuckle shade

    // ---- neck ----
    R(-2, -32, 4, 2, C.skin);

    // ---- head (round, kindly face) ----
    R(-5, -41, 10, 9, C.skin);             // face
    R(-5, -41, 10, 1, C.tan);              // forehead shade under hairline
    R(-6, -38, 1, 4, C.skin);  R(5, -38, 1, 4, C.skin); // ears

    // ---- grey hair + bun ----
    R(-6, -42, 12, 3, C.ltGray);           // hairline cap
    R(-6, -42, 12, 1, C.white);            // top highlight
    R(-6, -40, 1, 3, C.ltGray);  R(5, -40, 1, 3, C.ltGray); // side wisps
    R(-2, -45, 4, 4, C.ltGray);            // the bun on top
    R(-2, -45, 4, 1, C.white);
    R(-1, -44, 2, 2, C.gray);              // bun shadow knot

    // ---- rosy cheeks (sweet) ----
    R(-4, -35, 2, 1, C.pink);  R(2, -35, 2, 1, C.pink);

    // ---- glasses (round spectacles on the nose) ----
    R(-4, -38, 3, 3, C.gold);              // left rim
    R(1,  -38, 3, 3, C.gold);              // right rim
    R(-1, -37, 2, 1, C.gold);              // bridge
    R(-3, -37, 1, 1, C.white);  R(2, -37, 1, 1, C.white); // lens glints
    // ---- eyes behind the glasses ----
    R(-3, -37, 1, 1, C.black);  R(2, -37, 1, 1, C.black);

    // ---- the faint unsettling glint: one tiny cold spark, slightly off-kilter ----
    // flickers with the walk/idle frame so it reads as a momentary gleam, not a fixed dot
    if (frame === 0 || frame === 2){
      R(2, -38, 1, 1, C.cyan);             // cold pinpoint catch-light in the right lens
    } else {
      R(-3, -38, 1, 1, C.cyan);            // shifts to the other lens — subtly wrong
    }
    // a hair-thin downturn at one mouth corner undercuts the kindly smile
    R(-2, -34, 4, 1, C.darkRed);           // mouth (gentle)
    R(1,  -33, 1, 1, C.brown);             // one corner pulled — the tell
  }});
})();
