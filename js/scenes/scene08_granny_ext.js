/* scene08_granny_ext.js — בית סבתא (חוץ): creepy-cute cottage, gnome+key, dark window, locked door */
(function(){
  const C=GAME.C, F=GAME.STORY.flags;

  // Single source of truth for the unlock beat — reachable from the door's
  // onUse('key') AND from the 'in' exit's gateFail (when the player selected
  // the key and clicked the open-doorway shadow). Either path sets grannyDoorOpen.
  function unlockDoor(){
    if(GAME.flag('grannyDoorOpen')){ GAME.RED('כבר פתוחה. פשוט נכנסים, אחי.'); return; }
    GAME.walkTo(170,180,()=>{
      GAME.sfx('door');                 // 'door' is a real engine SFX ('unlock' is not)
      GAME.RED('המפתח נכנס. סיבוב אחד... קליק. דלת של אגדה, נעילה של בונקר.');
      GAME.setFlag('grannyDoorOpen',true);
      GAME.score(5,'dooropen');
      GAME.onMsgDone(()=>{ GAME.RED('פתוח. אחורה כבר אי אפשר באמת, נכון? יאללה, נכנסים.'); });
    });
  }

  GAME.registerScene({
    id:'granny_ext',
    name:'בית סבתא — חוץ',
    entry:{ x:36, y:180, dir:'right' },
    walkbox:[ {x:10,y:162,w:300,h:34} ],
    scale:{ near:1.0, far:0.78, horizon:150 },

    drawBackground(ctx){
      // overcast forest-edge sky — dimmer than the hood, a touch of dread
      GAME.gradV(ctx,0,0,320,96,C.cyan,C.blue);
      GAME.dither(ctx,0,70,320,30,C.blue,C.darkBlue);

      // dark tree line behind the cottage
      for(let i=0;i<7;i++){
        const tx=12+i*48, th=30+((i*7)%18);
        GAME.poly(ctx,[[tx,96],[tx+14,96-th],[tx+28,96]],C.darkGreen);
        GAME.rect(ctx,tx+12,90,4,8,C.brown);
      }
      GAME.line(ctx,0,96,320,96,C.black);

      // ground — mossy, slightly sick green
      GAME.rect(ctx,0,96,320,104,C.moss);
      GAME.dither(ctx,0,96,320,70,C.moss,C.darkGreen);
      GAME.rect(ctx,0,160,320,40,'#2c4420');
      GAME.dither(ctx,0,160,320,40,'#2c4420',C.moss);
      GAME.line(ctx,0,162,320,162,C.black);

      // stone path leading to the door
      for(let i=0;i<6;i++){
        const py=196-i*7, pw=40-i*5, pxc=160;
        GAME.ellipse(ctx,pxc,py,pw/2,3,C.ltGray);
        GAME.ellipse(ctx,pxc,py,pw/2-2,2,C.gray);
      }

      // ---- THE COTTAGE (creepy-cute, slightly crooked) ----
      // body
      GAME.rect(ctx,96,86,128,76,C.tan);
      GAME.dither(ctx,96,86,128,76,C.tan,C.brown);
      GAME.box(ctx,96,86,128,76,C.black);
      // timber beams (cute fachwerk, leaning)
      GAME.line(ctx,96,118,224,118,C.darkRed);
      GAME.line(ctx,120,86,124,162,C.darkRed);
      GAME.line(ctx,196,86,200,162,C.darkRed);

      // crooked roof — sags to the right
      GAME.poly(ctx,[[88,88],[160,44],[236,90]],C.darkRed);
      GAME.poly(ctx,[[88,88],[160,44],[160,50],[92,92]],'#6e1f1f');
      GAME.line(ctx,88,88,160,44,C.black);
      GAME.line(ctx,160,44,236,90,C.black);
      // roof shingle rows
      for(let r=0;r<3;r++){
        GAME.line(ctx,96+r*4,84-r*10,160,52-r*10,'#5a1a1a');
      }

      // crooked chimney (leans the wrong way) with a thin curl of smoke
      GAME.rect(ctx,126,42,12,22,C.dkGray);
      GAME.box(ctx,126,42,12,22,C.black);
      GAME.rect(ctx,124,40,16,4,C.gray);
      GAME.px(ctx,132,36,C.ltGray); GAME.px(ctx,134,31,C.ltGray);
      GAME.px(ctx,131,27,C.gray);   GAME.px(ctx,133,23,C.gray);

      // ---- DARK WINDOW (to the left of the door) ----
      GAME.rect(ctx,108,98,30,32,C.night);
      GAME.box(ctx,108,98,30,32,C.black);
      GAME.box(ctx,106,96,34,36,C.brown);          // frame
      GAME.line(ctx,123,98,123,130,C.black);        // mullion V
      GAME.line(ctx,108,114,138,114,C.black);       // mullion H
      // faint cold glints inside — a hint of metal (knives) you can't quite place
      GAME.px(ctx,114,104,C.ltGray); GAME.px(ctx,118,108,C.ltGray);
      GAME.px(ctx,128,103,C.gray);   GAME.px(ctx,131,118,C.ltGray);
      // two tiny dots like watching glass eyes (taxidermy)
      GAME.px(ctx,128,123,C.yellow); GAME.px(ctx,132,123,C.yellow);

      // ---- THE DOOR ---- (locked until grannyDoorOpen)
      const open=GAME.flag('grannyDoorOpen');
      GAME.rect(ctx,150,106,40,56,open? C.night : C.brown);
      GAME.box(ctx,148,104,44,60,C.black);
      GAME.rect(ctx,150,104,40,4,C.darkRed);        // lintel
      if(!open){
        GAME.rect(ctx,152,108,36,52,C.darkRed);
        GAME.line(ctx,170,108,170,160,'#5a1a1a');   // plank seam
        GAME.box(ctx,156,118,12,16,'#5a1a1a');      // upper panel
        GAME.box(ctx,172,118,12,16,'#5a1a1a');
        GAME.rect(ctx,154,134,4,4,C.gold);          // keyhole plate
        GAME.px(ctx,155,135,C.black);
      } else {
        // swung open — darkness inside spills onto the threshold/path (matches the
        // 'in' exit rect at y:163..176, so the clickable doorway lines up with the art)
        GAME.poly(ctx,[[152,162],[188,162],[184,176],[156,176]],'#0a1018');
        GAME.line(ctx,156,176,184,176,C.black);
        GAME.px(ctx,162,168,C.dkGray); GAME.px(ctx,178,170,C.dkGray); // faint floorboards inside
      }
      GAME.rect(ctx,184,132,3,5,C.gold);            // handle

      // ---- GARDEN GNOME (front-right of path) ----
      // body
      GAME.rect(ctx,206,140,14,18,C.blue);
      GAME.box(ctx,206,140,14,18,C.black);
      GAME.rect(ctx,206,140,14,4,C.darkBlue);       // belt area shade
      // hands
      GAME.rect(ctx,203,148,4,5,C.skin); GAME.rect(ctx,219,148,4,5,C.skin);
      // head + rosy face
      GAME.rect(ctx,208,131,10,9,C.skin);
      GAME.px(ctx,210,135,C.black); GAME.px(ctx,215,135,C.black);
      GAME.rect(ctx,209,137,8,3,C.white);           // white beard
      GAME.px(ctx,208,138,C.pink); GAME.px(ctx,216,138,C.pink);
      // tall red pointy hat
      GAME.poly(ctx,[[206,132],[213,118],[220,132]],C.red);
      GAME.poly(ctx,[[206,132],[213,118],[214,121],[209,132]],C.darkRed);
      GAME.line(ctx,206,132,213,118,C.black);
      GAME.line(ctx,213,118,220,132,C.black);
      // the gnome's stare is just a little too direct
      GAME.px(ctx,212,134,C.red);

      // ---- FLOWER BED (front-left) ----
      GAME.rect(ctx,28,150,70,14,C.brown);
      GAME.box(ctx,28,150,70,14,C.black);
      GAME.dither(ctx,30,152,66,10,C.brown,'#5a3a1f');
      const fc=[C.red,C.yellow,C.pink,C.white,C.purple,C.orange];
      for(let i=0;i<8;i++){
        const fx=34+i*8, fy=148-((i%3));
        GAME.line(ctx,fx,fy,fx,154,C.darkGreen);    // stem
        GAME.rect(ctx,fx-2,fy-3,4,4,fc[i%fc.length]);
        GAME.px(ctx,fx,fy-2,C.gold);                 // center
      }
      // tiny grim sign in the bed
      GAME.rect(ctx,86,146,10,7,C.tan); GAME.box(ctx,86,146,10,7,C.black);
      GAME.line(ctx,91,153,91,158,C.brown);

      // ---- MAILBOX (left, on a post) ----
      GAME.rect(ctx,12,128,4,32,C.brown);           // post
      GAME.box(ctx,12,128,4,32,C.black);
      GAME.rect(ctx,4,118,20,12,C.darkRed);
      GAME.box(ctx,4,118,20,12,C.black);
      GAME.poly(ctx,[[4,118],[14,112],[24,118]],'#6e1f1f'); // little lid
      GAME.rect(ctx,21,121,3,5,C.red);              // flag up
      GAME.rect(ctx,7,122,10,4,C.gray);             // name plate
    },

    hotspots:[
      // ---- GNOME → hides the KEY ----
      { id:'gnome', name:'גמד הגינה', rect:{x:200,y:116,w:26,h:44}, near:{x:206,y:182},
        onLook(){
          if(GAME.has('key')){ GAME.say('הגמד מחייך אלייך כאילו הוא יודע משהו שאת לא. כבר לקחת את המפתח.'); return; }
          GAME.say('גמד גינה עם חיוך רחב מדי, נטוי קדימה כאילו הוא עומד לספר לך סוד. גמדים לא אמורים להיות מאיימים. זה כן.');
        },
        onTake(){
          if(GAME.has('key')){ GAME.RED('כבר לקחתי את המפתח. את הגמד אני משאירה — שמרור אחד מספיק.'); return; }
          GAME.walkTo(206,182,()=>{
            GAME.sfx('pickup');
            GAME.RED('גמד גינה. מתחתיו... מפתח חלוד. וגם משהו שלא נסתכל עליו יותר מדי.');
            GAME.give('key'); GAME.score(5,'key');
            GAME.onMsgDone(()=>{ GAME.RED('מפתח חלוד מסבתא. מריח כמו "אל תיכנסי". אז ברור שניכנס.'); });
          });
        },
        onUse(item){
          if(item==='key'){ GAME.RED('כבר שלפתי את המפתח מתחתיו, אחי. נגמרו הקסמים של הגמד.'); return; }
          GAME.RED('לא משחקת עם הגמד. יש לו אנרגיות של עד מדינה.');
        },
        onTalk(){ GAME.RED('"אחי, מה אתה שומר פה?" הגמד שותק. גם זאת תשובה.'); },
      },

      // ---- DARK WINDOW → unease (knives/taxidermy) ----
      { id:'window', name:'החלון האפל', rect:{x:104,y:94,w:38,h:40}, near:{x:120,y:178},
        onLook(){
          GAME.say('דרך החלון: קיר מלא סכינים מבריקות, וחיה ממולאת שמסתכלת עלייך. "חמוד" זו לא המילה.');
          GAME.onMsgDone(()=>{
            GAME.RED('סבתא, יש לך עיצוב פנים של סדרת מתח. נושמת עמוק. ממשיכה.');
            GAME.setFlag(F.knowsGranny,true);
            GAME.score(3,'window_dread');
          });
        },
        onUse(item){
          if(item==='key'){ GAME.RED('מפתח לא נכנס לחלון, אחותי. ויש דלת מסודרת בדיוק לזה.'); return; }
          GAME.RED('לא נכנסת מהחלון. מה אני, פורצת? יש לי מפתח, יש לי כבוד עצמי.');
        },
        onTalk(){ GAME.RED('דופקת על הזכוכית. בפנים משהו זז. מצוין. נשארת בחוץ עוד שנייה.'); },
        onTake(){ GAME.RED('מה אקח, חלון? אני לא בקטע של שיפוצים היום.'); },
      },

      // ---- THE DOOR → USE key to open, then GATE in ----
      { id:'door', name:'הדלת', rect:{x:148,y:104,w:44,h:58}, near:{x:170,y:180},
        onLook(){
          if(GAME.flag('grannyDoorOpen')){ GAME.say('הדלת פתוחה. בפנים — חושך, וריח של דברים שעדיף לא לדעת.'); return; }
          GAME.say('דלת עץ כבדה, נעולה. חור מנעול חלוד מציץ אלייך. צריך מפתח.');
        },
        onUse(item){
          if(GAME.flag('grannyDoorOpen')){ GAME.RED('כבר פתוחה. פשוט נכנסים, אחי.'); return; }
          if(item==='key'){
            unlockDoor();
            return;
          }
          if(item){ GAME.RED('זה לא יפתח את הדלת, אחותי. צריך מפתח אמיתי.'); return; }
          GAME.RED('הדלת נעולה. תמצאי מפתח לפני שאת דופקת בכוח.');
        },
        onTake(){ GAME.RED('לסחוב דלת של פסיכופתית? אפילו לי יש גבולות.'); },
        onTalk(){ GAME.RED('"תני לי להיכנס." הדלת לא עונה. סבתא כן תענה — אבל קודם צריך מפתח.'); },
      },

      // ---- FLOWER BED → dark-cute gag ----
      { id:'flowerbed', name:'ערוגת הפרחים', rect:{x:28,y:144,w:70,h:20}, near:{x:60,y:182},
        onLook(){
          GAME.say('ערוגת פרחים מטופחת להפליא. שלט קטן: "כאן גדל אהוב/ה". בלי שם. נחמד? מפחיד? כן.');
        },
        onTake(){ GAME.RED('לקטוף פרחים מהערוגה הזאת? לא נראה לי שאני רוצה לדעת על מה הם צמחו.'); },
        onUse(){ GAME.RED('עוזבת את הפרחים בשקט. הם נראים מרוצים מדי, וזה מדאיג.'); },
        onTalk(){ GAME.RED('אומרת שלום לפרחים. הם לא עונים. בבית הזה זה דווקא חדשות טובות.'); },
      },

      // ---- MAILBOX → jokey name ----
      { id:'mailbox', name:'תיבת הדואר', rect:{x:2,y:110,w:24,h:22}, near:{x:30,y:182},
        onLook(){
          GAME.say('על תיבת הדואר: "ד.צ. אכזרית". חשבת שזה ראשי תיבות חמודים. זה לא.');
        },
        onTake(){ GAME.RED('דואר של סבתא? אני לא נוגעת. מי יודע מה היא מקבלת בדואר.'); },
        onUse(){ GAME.RED('פותחת רגע את התיבה... ריקה. חוץ מקטלוג של "כלי חיתוך מקצועיים". סוגרת.'); },
        onTalk(){ GAME.RED('מדברת לתיבת דואר. סימן שצריך לסיים את הסיפור הזה מהר.'); },
      },

      // ---- CHIMNEY → callback gag ----
      { id:'chimney', name:'הארובה', rect:{x:122,y:30,w:22,h:36}, near:{x:150,y:178},
        onLook(){
          GAME.RED('הארובה עקומה. הבית עקום. משהו פה עקום, ואני לא מדברת על אדריכלות.');
        },
        onTake(){ GAME.RED('לטפס לארובה כמו בסיפור? אני ארסית, לא ארובאית.'); },
        onUse(){ GAME.RED('לא נכנסת מהארובה. זה רעיון של אגדה, ואני בקטע יותר ריאליסטי.'); },
      },
    ],

    exits:[
      { id:'back', name:'חזרה לנהר', rect:{x:0,y:96,w:24,h:66}, to:'river',
        entry:{x:280,y:180,dir:'left'}, arrow:'left' },

      // The 'in' exit lives in the doorway-threshold strip at the FOOT of the door,
      // BELOW the door hotspot (door rect bottom = y:162). No overlap with the door
      // hotspot {y:104..162}, so locked-state 'use key' on the door always reaches
      // onUse('key'). Engine matches exits before hotspots, so keeping these zones
      // disjoint is what makes the unlock interaction reachable.
      { id:'in', name:'להיכנס הביתה', rect:{x:152,y:163,w:36,h:13}, to:'granny_int',
        entry:{x:160,y:180,dir:'down'}, arrow:'up',
        gate(){ return GAME.flag('grannyDoorOpen'); },
        gateFail(){
          // Safety net: if the player is standing on the threshold with the key
          // selected (verb=use), treat it as unlocking the door — so the key->door
          // intent can never get stuck on a pixel-perfect miss of the door hotspot.
          if(GAME.verb==='use' && GAME.selItem==='key'){
            GAME.selItem=null;
            unlockDoor();
            return;
          }
          GAME.RED('הדלת נעולה, אחותי. קודם מפתח — ויש גמד שיודע איפה הוא.');
        } },
    ],

    onFirst(){
      GAME.say('הבית של סבתא בקצה היער. חמוד מבחוץ. מצמרר מבפנים.');
      GAME.onMsgDone(()=>{
        GAME.RED('וואלה, בית מהאגדות. אם אגדות היו מסתיימות רע. בואי נמצא איך נכנסים.');
      });
    },
    onEnter(){},
  });
})();
