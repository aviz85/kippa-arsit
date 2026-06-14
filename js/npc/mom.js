/* js/npc/mom.js — NPC sprite 'mom': אמא הדואגת.
   Worried Israeli mom — apron, hair up in a bun, hands on hips.
   Convention (from sprites.js): draw(ctx,x,y,frame,dir,s) where x,y = feet
   bottom-center, negative ly = up, scaled by s. Top-left light, black outlines. */
(function(){
  const C = GAME.C;

  // rel rect: (lx,ly)=sprite-local from feet center, negative ly = up. Flips on 'left'.
  function rel(ctx, fx, fy, s, flip, lx, ly, w, h, color){
    const L = flip ? (-lx - w) : lx;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(fx + L*s), Math.round(fy + ly*s),
                 Math.max(1, Math.round(w*s)), Math.max(1, Math.round(h*s)));
  }

  GAME.registerSprite('mom', { w:20, h:36, draw(ctx, x, y, frame, dir, s){
    s = s || 1;
    const flip = dir === 'left';
    const fx = x, fy = y;
    const R = (lx,ly,w,h,col)=> rel(ctx, fx, fy, s, flip, lx, ly, w, h, col);
    const walk = (frame===1 || frame===3);

    // shadow
    GAME.ellipse(ctx, fx, fy, Math.max(2,9*s), Math.max(1,2*s), 'rgba(0,0,0,.32)');

    /* --- legs (under a long house-skirt, just feet show) --- */
    R(-6, -3, 4, 3, C.darkRed);   // left slipper
    R(2,  -3, 4, 3, C.darkRed);   // right slipper
    R(-6, -1, 4, 1, C.black);     // sole shade L
    R(2,  -1, 4, 1, C.black);     // sole shade R

    /* --- skirt / lower dress (long, modest, gentle A-line) --- */
    R(-8, -16, 16, 14, C.blue);
    R(-8, -16, 16, 2, C.cyan);          // top-left highlight band
    R(5,  -15, 3, 13, C.darkBlue);      // right-side shadow
    R(-8, -2, 16, 1, C.black);          // hem outline
    R(-8, -16, 1, 14, C.black);         // left edge outline
    R(7,  -16, 1, 14, C.black);         // right edge outline

    /* --- apron over the skirt (the worried-mom signature) --- */
    R(-5, -22, 10, 16, C.tan);          // apron bib + skirt
    R(-5, -22, 10, 1, C.white);         // apron top highlight
    R(-5, -6, 10, 1, C.brown);          // apron bottom shade
    R(-5, -22, 1, 16, C.brown);         // apron left edge
    R(4,  -22, 1, 16, C.brown);         // apron right edge
    R(-3, -14, 1, 6, C.brown);          // a fold
    R(1,  -14, 1, 6, C.brown);          // a fold
    R(-7, -20, 2, 2, C.tan);            // apron tie-strap L (waist)
    R(5,  -20, 2, 2, C.tan);            // apron tie-strap R

    /* --- torso / blouse (peeks above the apron bib) --- */
    R(-6, -27, 12, 6, C.red);
    R(-6, -27, 12, 1, C.pink);          // collar highlight
    R(-1, -27, 2, 6, C.darkRed);        // button placket
    R(-6, -27, 1, 6, C.black);          // outline L
    R(5,  -27, 1, 6, C.black);          // outline R

    /* --- ARMS: hands-on-hips (akimbo) — elbows out, hands at waist --- */
    // upper arm goes out to the elbow, forearm comes back in to the hip.
    R(-9, -26, 3, 3, C.red);            // L shoulder/upper arm out
    R(-10,-24, 2, 5, C.red);            // L upper arm (elbow out)
    R(-9, -20, 3, 2, C.red);            // L forearm back toward waist
    R(-7, -19, 2, 2, C.skin);           // L hand on hip
    R(6,  -26, 3, 3, C.red);            // R shoulder/upper arm out
    R(8,  -24, 2, 5, C.red);            // R upper arm (elbow out)
    R(6,  -20, 3, 2, C.red);            // R forearm back toward waist
    R(5,  -19, 2, 2, C.skin);           // R hand on hip
    // arm outlines (top-left light => outline the lower/right)
    R(-10,-24, 1, 5, C.darkRed);
    R(9,  -24, 1, 5, C.darkRed);

    /* --- neck + head --- */
    R(-2, -29, 4, 2, C.skin);           // neck
    R(-5, -37, 10, 8, C.skin);          // face
    R(-5, -37, 10, 1, C.tan);           // forehead highlight (top-left light)
    R(4,  -37, 1, 8, C.brown);          // face shadow right edge

    /* --- hair up in a bun --- */
    R(-6, -39, 12, 3, C.brown);         // hairline across top
    R(-6, -37, 1, 5, C.brown);          // hair side L
    R(5,  -37, 1, 5, C.brown);          // hair side R
    R(-6, -39, 12, 1, C.tan);           // hair top highlight
    R(-2, -42, 4, 3, C.brown);          // the BUN on top
    R(-2, -42, 1, 3, C.tan);            // bun highlight
    R(0,  -41, 1, 1, C.darkRed);        // hairpin glint

    /* --- worried face --- */
    if(dir === 'up'){
      R(-5, -35, 10, 3, C.brown);       // back of head when facing away
    } else {
      // anxious slanted brows (inner-up = concern)
      R(-4, -35, 3, 1, C.brown);        // L brow
      R(1,  -35, 3, 1, C.brown);        // R brow
      R(-4, -34, 1, 1, C.brown);        // brow inner pull L
      R(3,  -34, 1, 1, C.brown);        // brow inner pull R
      // eyes
      R(-3, -34, 2, 2, C.black);
      R(1,  -34, 2, 2, C.black);
      // small fretful mouth (slight downturn)
      R(-2, -31, 4, 1, C.darkRed);
      R(-2, -30, 1, 1, C.darkRed);
      R(1,  -30, 1, 1, C.darkRed);
      // a worry bead of sweat on the temple
      R(flip ? 4 : -5, -36, 1, 1, C.cyan);
    }

    /* subtle idle "sigh" — shoulders bob a touch while frame ticks */
    if(walk){ R(-6, -27, 12, 1, C.darkRed); } // shoulder shade flick
  }});

})();
