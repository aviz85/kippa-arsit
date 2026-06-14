/* js/npc/granny_beast.js — סבתא, צורת הפסיכופתית (finale reveal form).
   Same little old lady — but menacing: wild eyes, butcher knife raised high,
   shawl askew, sinister grin. Mirrors the rel()-from-feet convention in sprites.js.
   Drawn by the finale scene via GAME.drawSprite(ctx,'granny_beast',x,y,frame,dir,scale). */
(function(){
  const C = GAME.C;

  // rect relative to feet center (fx,fy); (0,0)=feet, negative y = up. scaled by s.
  function rel(ctx, fx, fy, s, lx, ly, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(fx + lx*s), Math.round(fy + ly*s),
                 Math.max(1,Math.round(w*s)), Math.max(1,Math.round(h*s)));
  }

  GAME.registerSprite('granny_beast', { w:22, h:44, draw(ctx,x,y,frame,dir,s){
    s = s||1;
    const flip = dir==='left';
    const fx=x, fy=y;
    // R: respects facing flip (knife arm should face the player)
    const R=(lx,ly,w,h,col)=> rel(ctx,fx,fy,s, flip? -lx-w : lx, ly, w, h, col);
    // unflipped helper for symmetric face features
    const A=(lx,ly,w,h,col)=> rel(ctx,fx,fy,s, lx, ly, w, h, col);

    // menacing tremble: knife jitters between frames
    const j = (frame===1||frame===3) ? 1 : 0;

    // shadow — wider, she's lunging
    GAME.ellipse(ctx, fx, fy, Math.max(3,9*s), Math.max(1,2*s), 'rgba(0,0,0,.4)');

    // ---- legs / hunched stance (orthopedic shoes, dark stockings) ----
    A(-5,-9, 4,9, C.dkGray);  A(1,-9, 4,9, C.dkGray);   // stockinged legs
    A(-6,-2, 5,2, C.black);   A(1,-2, 5,2, C.black);    // heavy black shoes

    // ---- dress (long, dark, hunched-forward silhouette) ----
    A(-7,-26, 14,17, C.darkBlue);                 // dress body
    GAME.dither(ctx, Math.round(fx-7*s), Math.round(fy-26*s),
                Math.max(1,Math.round(14*s)), Math.max(1,Math.round(17*s)),
                C.darkBlue, C.night || C.black);  // grimy texture
    A(-7,-26, 14,2, C.black);                     // collar shade
    A(-8,-11, 16,3, C.darkBlue);                  // hem flaring (lunge)

    // ---- shawl, ASKEW — slipping off one shoulder, blood-menace darkRed ----
    R(-8,-27, 9,6, C.darkRed);                    // shawl bunched on near shoulder
    R(-9,-25, 4,5, C.darkRed);                    // fallen flap hanging
    R(1,-27, 6,3, C.darkRed);                     // far shoulder, slipping down
    R(-8,-27, 9,1, C.red);                        // frayed highlight edge

    // ---- arms ----
    // raising arm (knife) — up and forward toward player
    R(5,-30, 3,8, C.skin);                        // upper raising arm
    R(7,-37, 3,8, C.skin);                        // forearm thrust upward
    R(7,-38, 4,2, C.skin);                        // gnarled hand / grip
    // other arm — clawing forward
    R(-9,-23, 3,7, C.skin);                       // grasping arm
    R(-11,-18, 3,3, C.skin);                      // hand
    R(-12,-18, 1,2, C.ltGray); R(-11,-18,1,2,C.ltGray); // claw-y fingers

    // ---- BUTCHER KNIFE, raised high (the hero prop) ----
    R(8, -38-j, 1,4, C.brown);                    // handle in fist
    R(8, -52-j, 4,14, C.steel || C.gray);         // big blade
    R(8, -52-j, 1,14, C.ltGray);                  // blade glint edge
    R(8, -52-j, 4,1,  C.white);                   // tip shine
    R(7, -39-j, 1,2,  C.dkGray);                  // bolster under blade

    // ---- neck + head (same little granny face, now wrong) ----
    A(-2,-28, 4,2, C.skin);                       // neck
    A(-5,-37, 10,9, C.skin);                      // face

    // wild white hair — bun loosened, frizzed out
    A(-6,-39, 12,3, C.white);                     // hair cap
    A(-7,-38, 2,4, C.white); A(5,-38,2,4,C.white);// frizz at sides (askew)
    A(-7,-40, 2,2, C.ltGray); A(5,-40,2,2,C.ltGray);
    A(-1,-41, 3,2, C.white);                      // tufts sticking up
    A(0,-39, 2,2, C.gray);                        // skewed bun

    // round granny spectacles — one lens cracked/glinting
    A(-4,-34, 3,3, C.black);  A(1,-34, 3,3, C.black);  // frames
    A(-2,-34, 1,3, C.black);                           // bridge
    A(-3,-33, 1,1, C.white);                           // glint
    A(2,-33, 1,1, C.red);                              // sinister red catchlight

    // ---- WILD EYES — wide, staring, manic ----
    A(-3,-33, 2,2, C.white); A(1,-33, 2,2, C.white);   // wide whites
    A(-3,-33, 1,1, C.black); A(2,-33, 1,1, C.black);   // tiny darting pupils (manic)
    // raised, sharp brows (too high)
    A(-4,-35, 3,1, C.dkGray); A(1,-35, 3,1, C.dkGray);

    // ---- SINISTER GRIN — wide, toothy ----
    A(-3,-30, 6,1, C.black);                           // mouth line
    A(-3,-30, 6,2, C.darkRed);                         // grinning open mouth
    A(-3,-30, 1,1, C.white); A(-1,-30,1,1,C.white);    // bared teeth
    A(1,-30, 1,1, C.white);  A(2,-30,1,1,C.white);
    A(-4,-30, 1,1, C.black); A(3,-30,1,1,C.black);     // upturned corners (grin)

    // wart / hag detail for the "off" feel
    A(2,-31, 1,1, C.brown);
  }});
})();
