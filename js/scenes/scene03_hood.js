/* scene03_hood.js — השכונה (sunny EGA hood street) */
(function(){
  const C=GAME.C;
  // קיוסקאי voice — חברמן, cyan so it pops against the warm street
  const KIOSK=(t)=> GAME.speak('קיוסקאי', t, C.cyan);

  GAME.registerScene({
    id:'hood',
    name:'השכונה',
    entry:{ x:40, y:178, dir:'right' },
    walkbox:[ {x:8,y:160,w:304,h:34} ],
    scale:{ near:1.0, far:0.82, horizon:150 },

    drawBackground(ctx){
      // --- sky ---
      GAME.gradV(ctx,0,0,320,96,C.cyan,C.blue);
      // little EGA sun, top-left
      GAME.ellipse(ctx,40,24,11,11,C.yellow);
      GAME.ellipse(ctx,40,24,8,8,C.gold);

      // --- skyline: apartment blocks (back row) ---
      // left tower
      GAME.rect(ctx,4,40,52,56,C.ltGray);  GAME.box(ctx,4,40,52,56,C.black);
      GAME.dither(ctx,4,40,52,8,C.ltGray,C.gray);   // roof shade
      // middle slab
      GAME.rect(ctx,70,30,70,66,C.tan);    GAME.box(ctx,70,30,70,66,C.black);
      GAME.rect(ctx,70,30,70,6,C.brown);
      // right tower
      GAME.rect(ctx,152,46,46,50,C.gray);  GAME.box(ctx,152,46,46,50,C.black);
      // far-right slab (behind the forest exit)
      GAME.rect(ctx,234,38,64,58,C.ltGray); GAME.box(ctx,234,38,64,58,C.black);
      GAME.rect(ctx,234,38,64,6,C.gray);

      // windows grid — chunky EGA squares
      const win=(bx,by,bw,bh,cols,rows,col)=>{
        const gw=4,gh=5, mx=4,my=5;
        for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
          const x=bx+mx+c*(gw+3), y=by+my+r*(gh+3);
          if(x+gw>bx+bw-2||y+gh>by+bh-2) continue;
          GAME.rect(ctx,x,y,gw,gh, col);
        }
      };
      win(4,40,52,56,4,4,C.darkBlue);
      win(70,30,70,66,6,5,C.darkBlue);
      win(152,46,46,50,3,4,C.darkBlue);
      win(234,38,64,58,5,4,C.darkBlue);
      // a couple lit windows (warm)
      GAME.rect(ctx,80,40,4,5,C.gold); GAME.rect(ctx,110,53,4,5,C.gold);
      GAME.rect(ctx,12,48,4,5,C.yellow); GAME.rect(ctx,246,46,4,5,C.gold);
      // rooftop laundry line on middle slab (hood texture)
      GAME.line(ctx,74,32,136,34,C.dkGray);
      GAME.rect(ctx,88,32,5,7,C.pink); GAME.rect(ctx,100,33,5,6,C.white); GAME.rect(ctx,114,33,4,6,C.red);

      // --- ground / asphalt ---
      GAME.rect(ctx,0,96,320,104,C.dkGray);
      GAME.dither(ctx,0,96,320,30,C.dkGray,C.gray);   // far pavement haze
      GAME.line(ctx,0,96,320,96,C.black);
      // sidewalk curb
      GAME.rect(ctx,0,150,320,4,C.ltGray);
      GAME.line(ctx,0,150,320,150,C.black);
      GAME.rect(ctx,0,154,320,46,C.gray);
      GAME.dither(ctx,0,154,320,46,C.gray,C.dkGray);
      // dashed road line on the asphalt strip
      for(let x=12;x<300;x+=30){ GAME.rect(ctx,x,128,12,2,C.yellow); }

      // --- palm tree (right-center, lonely on the asphalt) ---
      const px=210;
      GAME.rect(ctx,px-2,108,4,46,C.brown);
      GAME.box(ctx,px-2,108,4,46,C.black);
      // trunk segment rings
      for(let i=0;i<5;i++) GAME.line(ctx,px-2,116+i*8,px+2,116+i*8,C.dkGray);
      // fronds
      GAME.poly(ctx,[[px,98],[px-22,104],[px-2,106]],C.darkGreen);
      GAME.poly(ctx,[[px,98],[px+22,104],[px+2,106]],C.darkGreen);
      GAME.poly(ctx,[[px,96],[px-12,86],[px+2,104]],C.green);
      GAME.poly(ctx,[[px,96],[px+12,86],[px-2,104]],C.green);
      GAME.poly(ctx,[[px,98],[px-2,82],[px+4,104]],C.green);
      // coconuts
      GAME.ellipse(ctx,px-3,108,2,2,C.brown); GAME.ellipse(ctx,px+3,108,2,2,C.brown);

      // --- graffiti on the left tower base ---
      // sprayed heart "ד. + כיפה"
      GAME.poly(ctx,[[14,128],[22,122],[30,128],[22,138]],C.red);
      GAME.poly(ctx,[[22,122],[18,118],[14,122],[14,128],[22,132]],C.red);
      GAME.poly(ctx,[[22,122],[26,118],[30,122],[30,128],[22,132]],C.red);
      // tag scribble + an arrow that points at nothing (← per RTL)
      GAME.rect(ctx,40,124,42,12,C.purple);
      GAME.dither(ctx,40,124,42,12,C.purple,C.pink);
      GAME.line(ctx,44,140,70,140,C.white);
      GAME.line(ctx,44,140,49,136,C.white); GAME.line(ctx,44,140,49,144,C.white); // ← arrowhead

      // --- KIOSK stall (right side, under the right slab) ---
      // counter body
      GAME.rect(ctx,248,116,58,38,C.brown);  GAME.box(ctx,248,116,58,38,C.black);
      // striped awning
      for(let i=0;i<6;i++){
        GAME.rect(ctx,246+i*10,108,10,9, (i%2)? C.red : C.white);
      }
      GAME.line(ctx,246,108,306,108,C.black);
      GAME.line(ctx,246,117,306,117,C.black);
      // counter top + service shelf
      GAME.rect(ctx,248,128,58,4,C.tan);
      // a fridge/cooler & snack shelves inside
      GAME.rect(ctx,252,134,16,18,C.ltGray); GAME.box(ctx,252,134,16,18,C.black);
      GAME.rect(ctx,254,137,3,4,C.cyan);     // bottle
      GAME.rect(ctx,259,137,3,4,C.green);
      // snack rack (במבה/ביסלי vibes)
      GAME.rect(ctx,274,134,28,18,C.gold);  GAME.box(ctx,274,134,28,18,C.black);
      GAME.rect(ctx,276,136,5,6,C.orange); GAME.rect(ctx,283,136,5,6,C.yellow);
      GAME.rect(ctx,290,136,5,6,C.red); GAME.rect(ctx,276,144,5,6,C.green);
      GAME.rect(ctx,283,144,5,6,C.orange); GAME.rect(ctx,290,144,5,6,C.cyan);
      // seeds sack on the counter
      GAME.ellipse(ctx,300,126,6,5,C.dkGray); GAME.rect(ctx,297,122,6,4,C.black);

      // --- parked scooter (center-left, on the sidewalk) ---
      const sx=118, sy=146;
      // wheels
      GAME.ellipse(ctx,sx,sy,7,7,C.black);  GAME.ellipse(ctx,sx,sy,4,4,C.dkGray);
      GAME.ellipse(ctx,sx+34,sy,7,7,C.black); GAME.ellipse(ctx,sx+34,sy,4,4,C.dkGray);
      // body / floorboard
      GAME.poly(ctx,[[sx,sy-3],[sx+8,sy-14],[sx+24,sy-14],[sx+34,sy-3]],C.red);
      GAME.box(ctx,sx+6,sy-16,20,14,C.black);
      GAME.rect(ctx,sx+8,sy-15,16,4,C.darkRed); // seat shade
      GAME.rect(ctx,sx+10,sy-20,4,6,C.black);   // seat back
      // handlebar / steering column
      GAME.line(ctx,sx+8,sy-14,sx+2,sy-26,C.dkGray);
      GAME.rect(ctx,sx-4,sy-28,12,3,C.black);   // handlebar
      GAME.rect(ctx,sx,sy-26,6,5,C.yellow);     // headlight
      // kickstand
      GAME.line(ctx,sx+18,sy+2,sx+22,sy+6,C.dkGray);
    },

    hotspots:[
      // ----- the neighbor / kiosk counter (TALK = seeds quest) -----
      { id:'kiosk', name:'הקיוסק', rect:{x:246,y:104,w:60,h:50}, near:{x:262,y:172},
        draw(ctx){}, // counter painted in bg
        onLook(){
          GAME.say('בקיוסק: במבה, ביסלי, ושלט "אין אשראי, אין רֵסטוֹר, אין רחמים." רוח של פוליס קווסט.');
        },
        onTalk(){ talkNeighbor(); },
        onTake(){ GAME.RED('לקנות, לא לסחוב את הדוכן, אחי. יש גבול.'); },
        onUse(item){
          if(item==='basket'){ GAME.RED('הסל הזה לסבתא, לא לקיוסק. רגע אחד של נאמנות.'); return; }
          GAME.RED('זה לא נכנס לקיוסק. דבר איתו, הוא חברמן.');
        },
      },

      // ----- the neighbor as a body you can also click directly -----
      { id:'neighbor', name:'השכן הקיוסקאי', rect:{x:278,y:120,w:24,h:36}, near:{x:268,y:172},
        keepDraw:true,
        // --- NPC: neighbor standing at the kiosk (must render over painted bg) ---
        draw(ctx){ GAME.drawSprite(ctx,'neighbor',286,150, 0, 'left', 0.92); },
        onLook(){ GAME.say('הקיוסקאי. מכיר את כל השכונה, חצי היער, ואת כל סוגי הגרעינים שקיימים.'); },
        onTalk(){ talkNeighbor(); },
        onUse(item){
          if(item==='basket'){ GAME.RED('הסל לסבתא. הקיוסקאי שורד גם בלי עוגיות שלי.'); return; }
          KIOSK('אחותי, רוצה משהו? תכל\'ס פשוט תבקשי. קח.');
        },
      },

      // ----- graffiti -----
      { id:'graffiti', name:'הגרפיטי', rect:{x:12,y:116,w:74,h:26}, near:{x:48,y:172},
        onLook(){
          GAME.say('בתוך לב מרוסס: "ד. + כיפה". סבתא ד.? לא, לא נחשוב על זה עכשיו.');
          GAME.onMsgDone(()=> GAME.say('ולידו: "אוסטרליה ביי" וחץ ← שמצביע ישר על הקיר. הכיוון ברור, התקציב פחות.'));
          GAME.score(2,'graffiti');
        },
        onTalk(){ GAME.RED('מדברת עם קיר. סימן שצריך פחות יער, יותר שינה.'); },
        onUse(){ GAME.RED('להוסיף עוד טאג? לא היום. הקיר מלא רגשות כמו שהוא.'); },
        onTake(){ GAME.RED('זה אמנות רחוב, אחי. אמנות לא לוקחים, מעריצים.'); },
      },

      // ----- scooter -----
      { id:'scooter', name:'הקטנוע', rect:{x:110,y:118,w:54,h:36}, near:{x:128,y:172},
        onLook(){ GAME.RED('קטנוע. אין מפתח, אין קסדה, אין ביטוח. כלומר — מושלם. אבל לא היום.'); },
        onTake(){ GAME.RED('לגנוב קטנוע בשכונה שלי? אני ארסית עם ערכים, אחי.'); },
        onUse(){ GAME.RED('בלי מפתח זה סתם פסל מודרני על שני גלגלים. יאללה, ברגל.'); },
        onTalk(){ GAME.RED('"שלום קטנוע, שמרת עליי מקום?" הוא שותק. גם הוא מהשכונה.'); },
      },

      // ----- palm tree -----
      { id:'palm', name:'הדקל', rect:{x:188,y:82,w:44,h:74}, near:{x:200,y:172},
        onLook(){ GAME.say('דקל בודד באמצע אספלט. שורד יותר טוב מרוב מערכות היחסים פה.'); },
        onTake(){ GAME.RED('לסחוב דקל? אין לי מקום בסל, יש שם עוגיות.'); },
        onUse(){ GAME.RED('לא מטפסת על דקל בבגדים האלה. סטייל לפני הרפתקה.'); },
      },
    ],

    exits:[
      { id:'back', name:'הביתה', rect:{x:0,y:96,w:22,h:58}, to:'living_room',
        entry:{x:170,y:178,dir:'left'}, arrow:'left',
        onLook(){ GAME.RED('הבית מאחורה. אוסטרליה ביי, סלון.'); } },
      { id:'fwd', name:'אל היער', rect:{x:298,y:96,w:22,h:58}, to:'forest_edge',
        entry:{x:40,y:178,dir:'right'}, arrow:'right',
        onLook(){ GAME.say('היער ← מסוף הרחוב. הירוק קורא, ונשמע משם צ\'יל קצת מוזר.'); } },
    ],

    onFirst(){
      GAME.say('השכונה מתעוררת. אספלט חם, ריח של קפה שחור וגרעינים קלויים.');
      GAME.onMsgDone(()=>{ GAME.RED('סבבה. עוד תחנה לפני היער — הקיוסק. תכל\'ס בא לי גרעינים.'); });
    },
    onEnter(){},
  });

  // ----- shared neighbor conversation (TALK from counter or body) -----
  function talkNeighbor(){
    if(GAME.has('seeds')){
      KIOSK('עוד גרעינים, אחותי? נגמרו לך כבר? תקני בדרך חזרה, ביזנס זה ביזנס.');
      GAME.onMsgDone(()=> GAME.RED('יש לי, יש לי. תודה אחי.'));
      return;
    }
    KIOSK('אחותי! מה נשמע? קח, על מה את בקטע — שתייה, חטיף, גרעינים?');
    GAME.onMsgDone(()=>{
      GAME.choice('מה עונים לקיוסקאי?', [
        { label:'"גרעינים. הכי טריים שיש."', action: haggleSeeds },
        { label:'"מה השכונה מספרת?"', action: gossip },
        { label:'"כלום, רק עברתי לומר שלום."', action: ()=>{
            KIOSK('שלום-שלום. תחזרי כשבא לך משהו, תמיד פתוח.');
        }},
      ]);
    });
  }

  function haggleSeeds(){
    KIOSK('גרעינים? יש שחורים, יש לבנים, יש מלוחים שלוקחים לך שנתיים מהחיים.');
    GAME.onMsgDone(()=>{
      KIOSK('כמה? עזבי "כמה". בשבילך — מחיר חבר. כמעט מתנה.');
      GAME.onMsgDone(()=>{
        GAME.RED('אחי, "כמעט מתנה" זה עדיין כסף. ובדיוק אזלתי במזומן.');
        GAME.onMsgDone(()=>{
          KIOSK('נו טוב, נו טוב. את שוברת אותי, אחותי. יודע מה? על חשבון הבית.');
          GAME.onMsgDone(()=>{
            KIOSK('קח, מתנה, סע בשלום. רק תחזרי לקנות עוד, טוב?');
            // hand over the seeds — the scene's core reward
            if(!GAME.has('seeds')){
              GAME.give('seeds');           // give() plays the 'pickup' sfx internally
              GAME.score(5,'seeds');
            }
            GAME.onMsgDone(()=>{
              GAME.RED('פצצה. גרעינים שחורים. מישהו ביער הולך להיות מאוד מאושר.');
            });
          });
        });
      });
    });
  }

  function gossip(){
    KIOSK('שמעי, השכונה מדברת. הזקנה ביער? לא הייתי הולך לשם לבד.');
    GAME.onMsgDone(()=>{
      KIOSK('תיזהרי בדרך, אחותי. היער יפה אבל יש בו... טיפוסים.');
      GAME.onMsgDone(()=>{
        GAME.RED('זקנה מפחידה ביער. סבבה, רושמת. יאללה, בכל זאת בא לי גרעינים — ');
        GAME.onMsgDone(()=> haggleSeeds());
      });
    });
  }
})();
