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

  /* ---------------- RED — כיפה הארסית (player) ---------------------------- */
  GAME.registerSprite('red', { w:18, h:34, draw(ctx,x,y,frame,dir,s){
    s=s||1;
    const flip = dir==='left';
    const fx=x, fy=y;
    const R=(lx,ly,w,h,col)=> rel(ctx,fx,fy,s, flip? -lx-w : lx, ly, w, h, col);
    const walk = (frame===1||frame===3);
    const lift = (frame===1)? 1 : (frame===3? -1 : 0);

    // shadow
    GAME.ellipse(ctx, fx, fy, Math.max(2,8*s), Math.max(1,2*s), 'rgba(0,0,0,.35)');

    // legs (track pants, white stripe)
    R(-5, -10, 4, 10, C.dkGray);
    R(1,  -10, 4, 10, C.dkGray);
    R(-5+(lift>0?0:0), -2+(lift>0?1:0), 4, 2, C.white); // sneaker L
    R(1,  -2-(lift<0?1:0), 4, 2, C.white);              // sneaker R
    R(-5, -10, 1, 8, C.white); R(4,-10,1,8,C.white);    // side stripes

    // torso (red zip jacket)
    R(-6, -22, 12, 12, C.red);
    R(-6, -22, 12, 2, C.darkRed);     // shoulders shade
    R(-1, -22, 2, 12, C.darkRed);     // zip line
    // gold chain
    R(-4, -22, 8, 1, C.gold);
    R(-1, -21, 2, 2, C.gold);

    // arms
    const armY = walk? -21 : -20;
    R(-8, armY, 2, 9, C.red);  R(6, armY, 2, 9, C.red);
    R(-8, armY+8, 2, 2, C.skin); R(6, armY+8, 2, 2, C.skin); // hands

    // neck + head
    R(-2, -24, 4, 2, C.skin);
    R(-5, -32, 10, 9, C.skin);        // face
    // hair sideburns
    R(-5, -32, 2, 6, C.black); R(3,-32,2,6,C.black);
    // eyes / brow (attitude)
    if(dir==='up'){ R(-5,-31,10,4,C.brown); }
    else {
      R(-3, -29, 2, 2, C.black);  R(1, -29, 2, 2, C.black);
      R(-4, -30, 3, 1, C.black);  R(1, -30, 3, 1, C.black); // angled brows
    }
    // red beanie / כיפה
    R(-6, -34, 12, 3, C.red);
    R(-6, -33, 12, 1, C.darkRed);
    R(-6, -32, 1, 1, C.darkRed); R(5,-32,1,1,C.darkRed);

    // sunglasses on cap (ars flex)
    R(-5, -33, 4, 1, C.black); R(1,-33,4,1,C.black);
  }});

  /* ---------------- generic placeholder NPC ------------------------------- */
  GAME.registerSprite('placeholder', { w:16, h:32, draw(ctx,x,y,frame,dir,s){
    s=s||1; GAME.ellipse(ctx,x,y,6*s,2*s,'rgba(0,0,0,.3)');
    rel(ctx,x,y,s,-5,-22,10,22,C.purple);
    rel(ctx,x,y,s,-4,-30,8,8,C.skin);
  }});

})();
