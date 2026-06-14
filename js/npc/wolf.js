/* js/npc/wolf.js — הזאב הצמחוני (the vegetarian wolf NPC)
   Tall, gentle posture, soft grey fur, big sad friendly eyes, a little sprout/leaf motif.
   Drawn via GAME.drawSprite(ctx,'wolf',x,y,frame,dir,scale). x,y = feet center (bottom-center). */
(function(){
  const C = GAME.C;

  // rel(): draw a rect relative to feet (fx,fy); (0,0)=feet center, negative y = up. Scaled by s.
  function rel(ctx, fx, fy, s, lx, ly, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(fx + lx*s), Math.round(fy + ly*s),
                 Math.max(1,Math.round(w*s)), Math.max(1,Math.round(h*s)));
  }

  GAME.registerSprite('wolf', { w:22, h:44, draw(ctx,x,y,frame,dir,s){
    s = s || 1;
    const flip = (dir==='left');
    const fx = x, fy = y;
    const R = (lx,ly,w,h,col)=> rel(ctx,fx,fy,s, flip? -lx-w : lx, ly, w, h, col);
    // gentle idle sway / slow walk shuffle — never aggressive
    const walk = (frame===1||frame===3);
    const sway = (frame===2)? 1 : 0;          // tiny breathing bob when idle
    const step = walk? 1 : 0;

    // soft grey fur tones
    const FUR   = C.gray;
    const FURD  = C.dkGray;     // shade
    const FURL  = C.ltGray;     // highlight / muzzle / belly
    const NOSE  = C.dkGray;

    // shadow
    GAME.ellipse(ctx, fx, fy, Math.max(2,9*s), Math.max(1,2*s), 'rgba(0,0,0,.30)');

    // ---- legs (slim, soft, paws) — gentle stance ----
    R(-6, -12, 4, 12, FUR);
    R(2,  -12, 4, 12, FUR);
    R(-6, -12, 1, 12, FURD);  R(5,-12,1,12,FURD);          // leg shade
    R(-7, -2-(step?1:0), 5, 2, FURD);                       // paw L
    R(2,  -2-(walk?0:1), 5, 2, FURD);                       // paw R

    // ---- torso (tall, slightly slouched gentle posture) ----
    R(-7, -28+sway, 14, 17, FUR);
    R(-7, -28+sway, 14, 2, FURD);                           // shoulder shade
    R(-4, -24+sway, 8, 12, FURL);                           // soft belly/apron-vibe
    R(-7, -28+sway, 1, 17, FURD);  R(6,-28+sway,1,17,FURD); // side shade

    // a little leaf/sprout motif tucked on the chest (his veggie heart)
    R(-1, -22+sway, 2, 4, C.darkGreen);                     // stem
    R(-3, -22+sway, 2, 2, C.green);                         // leaf L
    R(1,  -23+sway, 2, 2, C.green);                         // leaf R

    // ---- arms (relaxed, hanging — open, non-threatening) ----
    const armY = (walk? -27 : -26) + sway;
    R(-9, armY, 2, 11, FUR);   R(7, armY, 2, 11, FUR);
    R(-9, armY+10, 3, 2, FURD); R(6, armY+10, 3, 2, FURD);  // soft paws/hands

    // ---- neck + head (big, kind) ----
    R(-3, -31+sway, 6, 3, FUR);                             // neck

    if(dir==='up'){
      // back of head + ears only
      R(-7, -41+sway, 14, 11, FUR);
      R(-7, -41+sway, 14, 2, FURD);
      // ears (up, soft, drooping inward — friendly)
      R(-8, -44+sway, 4, 4, FUR);  R(4,-44+sway,4,4,FUR);
      R(-8, -44+sway, 4, 1, FURD); R(4,-44+sway,4,1,FURD);
      return;
    }

    // head block
    R(-7, -42+sway, 14, 12, FUR);
    R(-7, -42+sway, 14, 2, FURD);                           // top shade

    // soft droopy ears (down-ish = gentle, not pricked/alert)
    R(-8, -44+sway, 4, 5, FUR);   R(4,-44+sway,4,5,FUR);
    R(-8, -44+sway, 1, 5, FURD);  R(7,-44+sway,1,5,FURD);
    R(-7, -40+sway, 2, 2, C.pink); R(5,-40+sway,2,2,C.pink); // inner-ear pink

    // long gentle muzzle (lighter fur), nose at the tip
    R(-3, -34+sway, 9, 6, FURL);                            // muzzle extends forward
    R(5,  -33+sway, 3, 4, FURL);                            // snout tip
    R(7,  -32+sway, 2, 2, NOSE);                            // soft nose

    // a tiny gentle smile (no fangs — he's a sweetheart)
    R(0, -29+sway, 6, 1, FURD);

    // big sad friendly eyes — large with shine, slightly downturned
    R(-4, -39+sway, 4, 4, C.white);                         // eye white (back eye)
    R(0,  -39+sway, 4, 4, C.white);                         // eye white (front eye)
    R(-3, -38+sway, 2, 3, C.brown);                         // iris L
    R(1,  -38+sway, 2, 3, C.brown);                         // iris R
    R(-3, -38+sway, 1, 1, C.black); R(1,-38+sway,1,1,C.black); // pupils
    R(-2, -38+sway, 1, 1, C.white); R(2,-38+sway,1,1,C.white); // catchlight (kind, wet eyes)
    // soft worried brows (slanted up-inward = sad/anxious vibe)
    R(-4, -40+sway, 2, 1, FURD);  R(2,-40+sway,2,1,FURD);

    // a faint cheek blush (hipster/gentle)
    R(2, -32+sway, 1, 1, C.pink);
  }});

})();
