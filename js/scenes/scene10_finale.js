/* scene10_finale.js — העימות (the bedroom showdown — final scene) */
(function(){
  const C=GAME.C, F=GAME.STORY.flags;

  // local animation/script clock (persists per scene instance via GAME.state)
  function S(){ GAME.state.finale = GAME.state.finale || { t:0, resolved:false, wolfIn:false }; return GAME.state.finale; }

  // the one true win test — used everywhere so the GAME_SPEC condition can't be bypassed
  function isArmed(){ return !!(GAME.flag(F.wolfFriend) && GAME.has('evidence')); }

  GAME.registerScene({
    id:'finale',
    name:'העימות',
    music:null,
    entry:{ x:60, y:182, dir:'right' },
    walkbox:[ {x:14,y:164,w:292,h:30} ],
    scale:{ near:1.0, far:0.85, horizon:160 },

    drawBackground(ctx){
      const st=S();

      // --- night wall: deep, dim cottage interior at midnight ---
      GAME.rect(ctx,0,0,320,164,C.night);
      GAME.dither(ctx,0,0,320,164,C.night,C.black);

      // crooked timber beams on the wall
      GAME.line(ctx,0,30,320,26,C.black);
      GAME.line(ctx,0,31,320,27,C.dkGray);
      GAME.line(ctx,56,0,52,164,C.black);
      GAME.line(ctx,212,0,218,164,C.black);

      // --- moon through the window (left) — cold moonlight ---
      GAME.box(ctx,24,18,64,70,C.black);
      GAME.rect(ctx,26,20,60,66,C.darkBlue);
      GAME.gradV(ctx,26,20,60,40,C.blue,C.darkBlue);   // night sky in the pane
      GAME.line(ctx,56,20,56,86,C.black);              // mullion vert
      GAME.line(ctx,26,52,86,52,C.black);              // mullion horiz
      GAME.ellipse(ctx,44,38,9,9,C.ltGray);            // moon
      GAME.ellipse(ctx,44,38,8,8,C.white);
      GAME.px(ctx,47,35,C.ltGray); GAME.px(ctx,41,41,C.ltGray); GAME.px(ctx,46,42,C.ltGray); // craters
      GAME.px(ctx,32,28,C.white); GAME.px(ctx,78,30,C.white); GAME.px(ctx,70,68,C.white);     // stars
      GAME.px(ctx,35,66,C.cyan);  GAME.px(ctx,80,46,C.cyan);                                  // faint stars

      // a shaft of moonlight falling across the floor (dithered cold light, palette-only)
      GAME.poly(ctx,[[26,86],[86,86],[150,164],[60,164]], C.darkBlue);
      GAME.line(ctx,86,86,150,164,C.blue);             // bright edge of the shaft
      GAME.line(ctx,26,86,60,164,C.blue);

      // --- the wolf's silhouette at the window / door (right) ---
      // pre-rescue: a worried shadow waiting outside; post-rescue: he's burst in.
      if(!st.wolfIn){
        // tall door, right side, ajar — moon-rim around a wolfish silhouette
        GAME.rect(ctx,250,40,56,124,C.black);
        GAME.box(ctx,250,40,56,124,C.dkGray);
        GAME.rect(ctx,256,46,44,118,C.darkBlue);
        // silhouette: ears + head + shoulders peeking, edge-lit
        GAME.poly(ctx,[[270,72],[266,58],[274,68]], C.black);  // ear L
        GAME.poly(ctx,[[286,72],[290,58],[282,68]], C.black);  // ear R
        GAME.ellipse(ctx,278,84,12,11,C.black);                // head
        GAME.rect(ctx,266,94,24,40,C.black);                   // shoulders
        // cold rim-light on the silhouette (palette cyan, no rgba)
        GAME.line(ctx,266,73,272,60,C.cyan);
        GAME.line(ctx,290,73,284,60,C.cyan);
        GAME.px(ctx,272,82,C.cyan);
        GAME.px(ctx,284,82,C.cyan);
      }

      // --- the bed (center) — where "granny" lies, then rises ---
      // bed frame
      GAME.rect(ctx,108,118,108,46,C.brown); GAME.box(ctx,108,118,108,46,C.black);
      GAME.rect(ctx,108,112,8,52,C.dkGray);                 // footboard post L
      GAME.rect(ctx,208,112,8,52,C.dkGray);                 // headboard post R
      // blanket
      GAME.rect(ctx,112,124,100,18,C.darkRed);
      GAME.dither(ctx,112,124,100,18,C.darkRed,C.black);
      GAME.rect(ctx,170,120,40,12,C.white);                 // pillow
      GAME.dither(ctx,170,120,40,12,C.white,C.ltGray);

      // --- mounted knives on the wall behind the bed (the collection lives here) ---
      GAME.rect(ctx,128,40,6,22,C.ltGray); GAME.box(ctx,128,40,6,22,C.black); // blade 1
      GAME.line(ctx,131,42,131,60,C.white);                                    // edge glint
      GAME.rect(ctx,127,62,8,6,C.brown);                                       // handle 1
      GAME.rect(ctx,150,44,6,18,C.ltGray); GAME.box(ctx,150,44,6,18,C.black); // blade 2
      GAME.line(ctx,153,46,153,60,C.white);
      GAME.rect(ctx,149,62,8,5,C.brown);                                       // handle 2
      GAME.line(ctx,124,72,162,72,C.black);                                    // shelf line

      // --- floor ---
      GAME.rect(ctx,0,162,320,38,C.brown);
      GAME.dither(ctx,0,162,320,38,C.brown,C.dkGray);
      GAME.line(ctx,0,164,320,164,C.black);

      // a thin dark-red glint of moonlight on the floorboards near the bed (dread)
      GAME.line(ctx,150,170,200,170,C.darkRed);
      GAME.px(ctx,176,170,C.red);
    },

    hotspots:[
      // GRANNY in / rising from the bed — the centerpiece, drawn over the bed
      { id:'granny', name:'סבתא', rect:{x:120,y:84,w:80,h:60}, near:{x:150,y:178},
        draw(ctx){
          const st=S();
          // She rises out of the covers as the script advances (t grows in onEnter chain).
          // t: 0 = lying, 1 = sitting up, 2 = up with the knife revealed.
          const phase = st.t;
          const cx=160;
          if(phase<=0){
            // a lumpy shape under the blanket + a sweet little head on the pillow
            GAME.ellipse(ctx,150,128,22,8,C.darkRed);
            GAME.rect(ctx,182,118,16,12,C.skin);            // head peeking
            GAME.rect(ctx,180,114,20,5,C.ltGray);           // white hair / cap
            GAME.px(ctx,186,123,C.black); GAME.px(ctx,193,123,C.black); // tiny eyes
          } else {
            // granny sitting up: torso rising from the blanket
            const lift = phase>=2 ? 0 : 4;                  // settles fully upright at phase 2
            const baseY = 120+lift;
            GAME.drawSprite(ctx,'granny',cx,baseY+24,0,'left',1.0);
            // a thin, hungry smile + wide eyes (override the stub's calm face area)
            GAME.line(ctx,cx-4,baseY-9,cx+4,baseY-9,C.darkRed);
            GAME.px(ctx,cx-3,baseY-13,C.black); GAME.px(ctx,cx+2,baseY-13,C.black);
            GAME.px(ctx,cx-3,baseY-12,C.red);   GAME.px(ctx,cx+2,baseY-12,C.red); // moon-glint in the eyes

            if(phase>=2){
              // THE BUTCHER KNIFE — big, raised, catching the moonlight
              const kx=cx+12, ky=baseY-6;
              GAME.rect(ctx,kx,ky-2,4,6,C.brown);          // fist/handle base
              GAME.line(ctx,kx+1,ky-2,kx+1,ky-26,C.dkGray);// spine
              GAME.poly(ctx,[[kx+1,ky-2],[kx+1,ky-26],[kx+8,ky-22],[kx+6,ky-2]], C.ltGray); // blade
              GAME.line(ctx,kx+1,ky-26,kx+8,ky-22,C.white);// glint edge
              GAME.px(ctx,kx+6,ky-18,C.white);
              GAME.px(ctx,kx+4,ky-10,C.cyan);              // cold reflected moonlight
            }
          }
        },
        onLook(){
          const st=S();
          if(st.t>=2) GAME.say('זו לא הסבתא מהתמונות. זאת סבתא עם סכין קצבים. הירח מאיר לה את החיוך, וזה ממש לא עוזר לחיוך.');
          else GAME.say('סבתא שוכבת במיטה, חיוך מתוק מדי. משהו פה על הפנים — ורק כיפה עוד לא קלטה. רגע, היא כן קלטה.');
        },
        onTalk(){ runShowdown(); },
        onTake(){ GAME.RED('לא נוגעים בסבתא, אחי. בטח לא בסבתא הזאת, היא נוגעת בחזרה.'); },
        onUse(item){
          if(item==='evidence'){ runShowdown(); return; }
          GAME.RED('לא הרגע ולא הדבר הזה, אחותי. יש פה רק כלי אחד שיעזור — והוא לא ביד שלי.'); },
      },

      // the window — Sierra "jump out the window" death gag (pre-resolution only)
      { id:'window', name:'החלון', rect:{x:24,y:18,w:64,h:70}, near:{x:60,y:178},
        onLook(){ GAME.say('דרך החלון: ירח קר, יער שחור, וצללית של חבר אחד טוב שמחכה לאות. אוסטרליה ביי זה לא, אבל קרוב.'); },
        onUse(){ jumpWindow(); },
        onTalk(){ GAME.RED('הירח לא יענה לי. גם הוא קצת מתוח מהסיטואציה, מבין אותו.'); },
      },

      // the mounted knife on the wall (flavor)
      { id:'wallknife', name:'הסכין על הקיר', rect:{x:122,y:40,w:42,h:30}, near:{x:140,y:178},
        onLook(){ GAME.say('עוד סכינים על הקיר, ממוינות לפי גודל. "אוסף", היא קראה לזה. מרשים ומפחיד, בעיקר מפחיד.'); },
        onTake(){ GAME.RED('לקחת סכין מהקיר של פסיכופתית? ככה בדיוק מתחילים סרטים שנגמרים רע. ואני בקטע של סוף טוב.'); },
      },
    ],

    exits:[
      // back to granny_int — ONLY before the showdown resolves
      { id:'back', name:'חזרה', rect:{x:0,y:80,w:22,h:84}, to:'granny_int',
        entry:{x:200,y:178,dir:'left'}, arrow:'left',
        gate(){ return !S().resolved; },
        gateFail(){ GAME.RED('אין לאן לברוח עכשיו, אחותי. זה הרגע. או היא, או אנחנו.'); },
      },
    ],

    onFirst(){ GAME.state.finale = { t:0, resolved:false, wolfIn:false }; },

    onEnter(){
      const st=S();
      st.resolved=false; st.wolfIn=false; st.t=0;

      // Scripted opening via the message queue, chained with onMsgDone.
      // The render loop redraws drawBackground + hotspot.draw every frame, so changing
      // st.t / st.wolfIn is reflected automatically — no manual repaint needed.
      GAME.sfx('death'); // a low ominous sting on arrival
      GAME.say('חצות. אור ירח. החדר קופא, וגם כיפה — קצת.');
      GAME.onMsgDone(()=>{
        st.t=1;
        GAME.GRANNY('מי זאת? הבובה שלי, את זאת? בואי, בואי קרוב לסבתא.');
        GAME.onMsgDone(()=>{
          st.t=1;
          GAME.GRANNY('מה כיפה גדולה... כמה בשר. ישבתי כל-כך הרבה זמן בשביל הרגע הזה.');
          GAME.onMsgDone(()=>{
            st.t=2;
            GAME.sfx('blip');
            GAME.RED('ואיזה סכין גדולה יש לך, סבתא!');
            GAME.onMsgDone(()=>{
              GAME.GRANNY('כדי לפרק אותך יפה-יפה, אהובה. אל תיקחי את זה אישית.');
              GAME.onMsgDone(()=> openVerdict());
            });
          });
        });
      });
    },
  });

  // ---- the choice the whole game has been building toward --------------------
  function openVerdict(){
    if(S().resolved) return;
    GAME.choice('רגע. מה עושים?', [
      // both options route through resolve(), which re-detects armed status itself,
      // so an armed player can NEVER lose here regardless of which line she picks.
      { label:'לשלוף את הפתק ולקרוא לזאב', action:()=> resolve() },
      { label:'להאשים אותה ישר בפנים',    action:()=> resolve(true) },
    ]);
  }

  // ---- the resolution: win if armed (per GAME_SPEC), otherwise Sierra death --
  function runShowdown(){
    if(S().resolved) return;
    openVerdict();
  }

  // recklessAccuse only flavors the LOSE path's lead-in; the WIN/LOSE decision
  // is driven solely by isArmed() so the GAME_SPEC condition is always honored.
  function resolve(recklessAccuse){
    const st=S();
    if(st.resolved) return;
    st.resolved=true;

    if(isArmed()){
      // WIN PATH — evidence + befriended wolf. Works for BOTH choices (incl. the
      // reckless in-her-face accusation): an armed accusation is still a win.
      if(recklessAccuse) GAME.RED('בלי משחקים, סבתא. אני יודעת בדיוק מה את — ויש לי את זה כתוב.');
      else               GAME.RED('פתק ביד, חבר בדלת. את גמרת, סבתא. הזאב הצמחוני בא להציל ארסית. מי היה מאמין.');
      GAME.onMsgDone(()=>{
        GAME.say('כיפה מנפנפת בפתק: "1. הזאב 2. ?" — ההוכחה ישר על הפנים של הזקנה.');
        GAME.onMsgDone(()=>{
          st.wolfIn=true; GAME.sfx('door');
          GAME.WOLF('סליחה שאני מאחר! חיפשתי חניה ליער. סבתא — זה נגמר.');
          GAME.onMsgDone(()=>{
            GAME.GRANNY('אז זה נכון. גילית. חבל, בובה — חיבבתי אותך. באמת.');
            GAME.onMsgDone(()=>{
              GAME.say('הזאב חוסם את הדלת בגוף רך וגדול. הסכין נופלת. הסבתא מתקפלת.');
              GAME.onMsgDone(()=>{
                GAME.setFlag(F.grannyBeaten,true);
                GAME.setFlag(F.knowsGranny,true);
                GAME.sfx('win'); GAME.score(20,'win');
                GAME.win('כיפה והזאב הצמחוני הצילו את היום. הסבתא נלקחה לטיפול. גמרת ב-100/100! יאללה ביי, סבתא.');
              });
            });
          });
        });
      });
      return;
    }

    // LOSE PATH — missing the wolf, the evidence, or both.
    if(recklessAccuse){
      GAME.RED('תקשיבי לי טוב, סבתא — אני רואה בדיוק מה את.');
      GAME.onMsgDone(()=> grannyKills());
      return;
    }
    // tried to "show the note" without actually having it / without the wolf
    GAME.RED('אני שולפת את ההוכחה... רגע. אין לי הוכחה. ואין חבר בדלת. אוי.');
    GAME.onMsgDone(()=> grannyKills());
  }

  function grannyKills(){
    GAME.GRANNY('בלי החבר הקטן שלך, ובלי שום הוכחה... את רק בשר על שתי רגליים, בובה.');
    GAME.onMsgDone(()=>{
      GAME.sfx('death');
      GAME.die('בלי חבר ובלי הוכחות, מול סכין... סוף ארור. תשמרי בנקודה אחרת בפעם הבאה.');
    });
  }

  // ---- death gag: jumping out the bedroom window ----------------------------
  function jumpWindow(){
    if(S().resolved) return;
    GAME.RED('לא קופצת מהחלון. אני ארסית, לא טמבלית.');
    GAME.onMsgDone(()=>{
      GAME.choice('בכל זאת לקפוץ?', [
        { label:'לא, השתגעתי? נישאר', action:()=> GAME.RED('בדיוק. רגע טוב לשמור משחק, אם היה לי כפתור כזה בחיים.') },
        { label:'יאללה, קפיצה דרמטית', action:()=>{ GAME.sfx('death');
          GAME.die('קפצת מהחלון כמו בסרט. החיים הם לא סרט. סוף קליל-קשה.'); } },
      ]);
    });
  }

})();
