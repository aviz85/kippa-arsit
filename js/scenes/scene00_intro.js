/* scene00_intro.js — אינטרו (storybook cutscene → room_red) */
(function(){
  const C=GAME.C;

  GAME.registerScene({
    id:'intro',
    name:'',
    music:null,
    entry:{ x:160, y:198, dir:'right' },
    walkbox:[ {x:158,y:197,w:4,h:2} ],   // tiny: no real walking in the cutscene

    drawBackground(ctx){
      // ---- warm dawn sky ----
      GAME.gradV(ctx,0,0,320,118,C.orange,C.darkBlue);
      // rising sun glow on the right horizon
      GAME.ellipse(ctx,238,112,30,30,'#f0a23a');
      GAME.ellipse(ctx,238,112,22,22,C.orange);
      GAME.ellipse(ctx,238,112,13,13,C.yellow);
      // soft clouds
      GAME.ellipse(ctx,70,34,18,5,'#f6c98a');
      GAME.ellipse(ctx,96,38,12,4,'#f6c98a');
      GAME.ellipse(ctx,150,22,15,4,'#f6c98a');

      // ---- ground ----
      GAME.rect(ctx,0,114,320,86,C.darkGreen);
      GAME.dither(ctx,0,114,320,86,C.darkGreen,C.green);
      GAME.line(ctx,0,114,320,114,C.black);
      // path winding from foreground toward the woods
      GAME.poly(ctx,[[140,200],[178,200],[166,150],[150,118],[140,118],[132,150]],C.tan);
      GAME.dither(ctx,132,150,46,40,C.tan,C.brown);

      // ============ LEFT: dark green forest tree-line ============
      function tree(bx, h, w){
        // trunk
        GAME.rect(ctx,bx-2,114-h+ (h-14),4,16,C.brown);
        // canopy (stacked triangles)
        GAME.poly(ctx,[[bx-w,114-h+24],[bx+w,114-h+24],[bx,114-h]],C.darkGreen);
        GAME.poly(ctx,[[bx-w+3,114-h+34],[bx+w-3,114-h+34],[bx,114-h+12]],'#1f6b2e');
        // tiny highlight
        GAME.line(ctx,bx-1,114-h+4,bx-1,114-h+18,C.green);
      }
      tree(20,82,18);
      tree(48,98,22);
      tree(80,70,15);
      tree(104,88,19);
      // brushy understory between trees
      GAME.ellipse(ctx,34,112,16,7,'#1f6b2e');
      GAME.ellipse(ctx,92,112,18,7,'#1f6b2e');

      // ============ RIGHT: the hood — apartment block silhouettes ============
      // far block
      GAME.rect(ctx,250,52,40,62,C.dkGray);
      GAME.box(ctx,250,52,40,62,C.black);
      // near block
      GAME.rect(ctx,288,38,30,76,C.gray);
      GAME.box(ctx,288,38,30,76,C.black);
      // lit windows (waking up)
      const lights=[[256,62],[256,76],[270,68],[278,86],[294,50],[294,72],[306,60],[306,90]];
      for(const [wx,wy] of lights){ GAME.rect(ctx,wx,wy,4,5,C.black); GAME.px(ctx,wx+1,wy+1,C.yellow); GAME.px(ctx,wx+2,wy+2,C.gold); }
      // a lonely palm by the blocks
      GAME.rect(ctx,238,84,3,30,C.brown);
      GAME.ellipse(ctx,239,82,14,5,C.darkGreen);
      GAME.ellipse(ctx,233,80,9,3,C.green);
      GAME.ellipse(ctx,246,80,9,3,C.green);

      // ============ CENTER anchor: tiny red silhouette on the path ============
      // small walking-away figure to anchor the wide shot (static, atmospheric)
      GAME.drawSprite(ctx,'red',150,150,0,'up',0.6);

      // storybook vignette frame
      GAME.box(ctx,2,2,316,196,C.black);
      GAME.box(ctx,3,3,314,194,'#1a1a1a');
    },

    hotspots:[],
    exits:[],

    onFirst(){
      // storybook narration — auto-advances on click/space
      GAME.say('היה הייתה, פעם, אי-שם בשכונה שגובלת ביער — ילדה אחת. קוראים לה כיפה.');
      GAME.say('לא "כיפה אדומה" מהספרים. כיפה אֲרְסִית. מלכת הרחוב, שרשרת זהב, אֶנֶרְגְיוֹת.');
      GAME.say('אמא שלה ביקשה ממנה לקפוץ לסבתא עם סל חטיפים. בקטע, מה כבר יכול לקרות?');
      GAME.say('מה שכיפה לא יודעת: ביער חי זאב. זאב צמחוני, רגיש, שכולם פוחדים ממנו בטעות.');
      GAME.say('ומה שאף אחד לא יודע: סבתא המתוקה... היא לא בדיוק מה שנדמה. בכלל לא.');
      GAME.say('יאללה. הסיפור הכי מוכר בעולם — רק שהפעם, את הסוף את כותבת.');
      GAME.onMsgDone(()=>{
        GAME.RED('סבבה, בוא נזרום. ← היער, אני באה.');
        GAME.onMsgDone(()=> GAME.goto('room_red'));
      });
    },

    onEnter(){
      // safety: if somehow re-entered after the intro already played, skip straight in
      if(GAME.flag('introSeen')){ GAME.goto('room_red'); return; }
      GAME.setFlag('introSeen',true);
    },
  });
})();
