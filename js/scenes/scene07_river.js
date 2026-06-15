/* scene07_river.js — הנהר והגשר (full scene) */
(function(){
  const C=GAME.C, F=GAME.STORY.flags;

  GAME.registerScene({
    id:'river',
    name:'הנהר והגשר',
    entry:{ x:38, y:185, dir:'right' },
    walkbox:[ {x:10,y:160,w:300,h:34} ],   // fallback
    // walk ONLY on the near sand bank + the bridge planks + the far bank (never in the water)
    walkpoly:[ [10,198],[10,160],[60,155],[96,157],[150,142],[205,139],[216,151],[162,158],[112,165],[92,168],[126,183],[315,185],[315,198] ],
    scale:{ near:1.0, far:0.82, horizon:150 },

    drawBackground(ctx){
      // sky
      GAME.gradV(ctx,0,0,320,92,C.cyan,C.blue);
      // far forest treeline on the far bank
      for(let i=0;i<10;i++){
        const tx=8+i*34, th=18+((i*7)%14);
        GAME.poly(ctx,[[tx,86],[tx+13,86-th],[tx+26,86]],C.darkGreen);
        GAME.poly(ctx,[[tx+4,80],[tx+13,80-th+6],[tx+22,80]],C.green);
      }
      GAME.line(ctx,0,86,320,86,C.black);

      // far bank (top strip of land beyond the water) with a path
      GAME.rect(ctx,0,86,320,18,C.green);
      GAME.dither(ctx,0,86,320,18,C.green,C.darkGreen);
      // dirt path winding away on the far bank toward granny's
      GAME.rect(ctx,150,88,30,16,C.tan);
      GAME.dither(ctx,150,88,30,16,C.tan,C.brown);
      GAME.line(ctx,165,88,172,104,C.brown);

      // the river (mid band) — flowing water, dark blue with dither + glints
      GAME.rect(ctx,0,104,320,52,C.blue);
      GAME.dither(ctx,0,104,320,52,C.blue,C.darkBlue);
      GAME.dither(ctx,0,128,320,28,C.darkBlue,C.black);
      // surface glints / ripples
      for(let i=0;i<22;i++){
        const gx=(i*53+11)%316, gy=108+((i*17)%40);
        GAME.line(ctx,gx,gy,gx+5,gy,C.cyan);
      }
      GAME.line(ctx,0,104,320,104,C.black); // far waterline

      // near bank (the ground the player stands on)
      GAME.rect(ctx,0,156,320,44,C.brown);
      GAME.dither(ctx,0,156,320,44,C.brown,C.tan);
      GAME.line(ctx,0,156,320,156,C.black); // near waterline

      // scattered stones along the near bank
      const stones=[[24,168],[70,176],[300,166],[268,182],[120,184]];
      stones.forEach(([sx,sy])=>{
        GAME.ellipse(ctx,sx,sy,5,3,C.gray);
        GAME.ellipse(ctx,sx-1,sy-1,3,2,C.ltGray);
        GAME.px(ctx,sx,sy,C.dkGray);
      });

      // reeds on the near-right bank
      for(let i=0;i<7;i++){
        const rx=200+i*7, rh=14+((i*5)%10);
        GAME.line(ctx,rx,158,rx-1,158-rh,C.darkGreen);
        GAME.line(ctx,rx+1,158,rx,158-rh+2,C.green);
        GAME.px(ctx,rx-1,158-rh,C.brown); // seed head
      }

      // ---- the broken wooden bridge spanning the water (gap mid-span) ----
      // near support post
      GAME.rect(ctx,86,104,5,54,C.darkRed);
      GAME.box(ctx,86,104,5,54,C.black);
      // far support post — driven down into the water like the near one
      GAME.rect(ctx,232,98,5,30,C.darkRed);
      GAME.box(ctx,232,98,5,30,C.black);

      // left (near) span of the deck — intact
      GAME.rect(ctx,72,112,58,8,C.brown);
      GAME.box(ctx,72,112,58,8,C.black);
      for(let i=0;i<6;i++) GAME.line(ctx,80+i*9,112,80+i*9,119,C.darkRed); // planks
      // left railing
      GAME.line(ctx,72,112,72,100,C.darkRed); GAME.line(ctx,130,112,130,100,C.darkRed);
      GAME.line(ctx,72,100,130,100,C.brown);

      // right (far) span of the deck — intact
      GAME.rect(ctx,190,108,58,8,C.brown);
      GAME.box(ctx,190,108,58,8,C.black);
      for(let i=0;i<6;i++) GAME.line(ctx,198+i*9,108,198+i*9,115,C.darkRed);
      // right railing
      GAME.line(ctx,190,108,190,96,C.darkRed); GAME.line(ctx,248,108,248,96,C.darkRed);
      GAME.line(ctx,190,96,248,96,C.brown);

      // THE GAP between x=130 and x=190 — either yawning hole or a fresh plank
      if(GAME.flag(F.bridgeFixed)){
        // a clean new plank bridging the gap
        GAME.rect(ctx,128,110,64,7,C.tan);
        GAME.box(ctx,128,110,64,7,C.black);
        GAME.line(ctx,128,113,192,113,C.brown);
        GAME.px(ctx,134,112,C.gold); GAME.px(ctx,186,114,C.gold); // little nails glint
      } else {
        // broken jagged ends hanging over the water
        GAME.poly(ctx,[[130,112],[138,112],[132,120],[130,118]],C.darkRed);
        GAME.poly(ctx,[[190,108],[182,108],[188,116],[190,114]],C.darkRed);
        GAME.line(ctx,130,112,138,120,C.black);
        GAME.line(ctx,190,108,182,116,C.black);
        // a couple of broken slats falling into the water
        GAME.line(ctx,150,122,160,128,C.brown);
        GAME.line(ctx,168,126,176,131,C.brown);
      }
    },

    hotspots:[
      // broken bridge — the core puzzle
      { id:'bridge', name:'הגשר השבור', rect:{x:72,y:96,w:176,h:30}, near:{x:128,y:170},
        onLook(){
          if(GAME.flag(F.bridgeFixed)){
            GAME.say('הגשר תוקן. הנדסה ברמה של כיתה ב\', אבל עובד.'); return;
          }
          GAME.say('גשר עם חור באמצע. מי שתכנן אותו תכנן גם את החיים שלי, כנראה.');
        },
        onTake(){ GAME.RED('לסחוב גשר? אפילו אני לא בקטע הזה, אחי.'); },
        onTalk(){ GAME.RED('"גשר, נשבר לך הלב?" — שתיקה. גם לו על הפנים, מסתבר.'); },
        onUse(item){
          if(GAME.flag(F.bridgeFixed)){ GAME.RED('כבר תיקנתי, אחותי. סבבה.'); return; }
          if(item==='plank'){
            GAME.RED('קרש על חור. זה כל הפאזל? אחי, פתרתי משחקי הרפתקה בשביל זה.');
            GAME.onMsgDone(()=>{
              GAME.take('plank');
              GAME.setFlag(F.bridgeFixed,true);
              GAME.sfx('pickup');
              GAME.score(10,'bridge');
              GAME.sfx('score');
              GAME.say('הגשר תוקן. הנדסה ברמה של כיתה ב\', אבל עובד.');
            });
            return;
          }
          if(item){ GAME.RED('זה לא יסגור את החור. צריך משהו ארוך ושטוח. נגיד... קרש.'); return; }
          GAME.RED('צריך משהו לשים על החור. ביד ריקה זה לא יקרה.');
        },
      },

      // water — death if you try to cross/swim without the bridge
      { id:'water', name:'הנהר', rect:{x:0,y:104,w:320,h:50}, near:{x:160,y:168},
        onLook(){
          GAME.say('המים עמוקים והזרם חזק. נראה רטוב. נראה סופי.');
          if(!GAME.flag(F.bridgeFixed)) GAME.onMsgDone(()=>{ GAME.RED('רגע טוב לשמור משחק. אם היה לי כפתור כזה בחיים.'); });
        },
        onTake(){ GAME.RED('לקחת מים בידיים? את היד אני יכולה להרטיב, מים לא לוקחים.'); },
        onTalk(){ GAME.RED('דיברתי לנהר. הנהר זרם הלאה. סיפור היחסים שלי בקיצור.'); },
        onUse(item){
          if(GAME.flag(F.bridgeFixed)){
            GAME.RED('יש גשר עכשיו, למה שאשחה? אני ארסית, לא טמבלית.'); return;
          }
          GAME.RED('זרם? סבבה, אני שחיינית.');
          GAME.onMsgDone(()=>{
            GAME.die('הזרם סחף אותך... סוף עצוב. ולא, לא היית שחיינית.');
          });
        },
      },

      // reeds — flavor + the canon "flute not bridge" gag
      { id:'reeds', name:'הקנים', rect:{x:198,y:144,w:56,h:18}, near:{x:226,y:170},
        onLook(){ GAME.say('קנים. מתאים לחליל, לא מתאים לגשר. ניסיון יפה, מחשבה שגויה.'); },
        onTake(){ GAME.RED('קן בודד? לא יחזיק אפילו חתול. עזבי.'); },
        onUse(item){
          if(item==='plank'){ GAME.RED('הקרש הולך על הגשר, לא בין הקנים. שכל, כיפה.'); return; }
          GAME.RED('קנים. יפה לטבע, חסר תועלת לי כרגע.');
        },
      },

      // stones — small bank flavor
      { id:'stones', name:'האבנים', rect:{x:14,y:160,w:62,h:24}, near:{x:50,y:172},
        onLook(){ GAME.say('אבני נהר חלקות. אחת מהן שטוחה בול לקפיצה על מים. בפעם אחרת.'); },
        onTake(){ GAME.RED('אבן? נחמדה. אבל אני לא אוספת אבנים, אני אוספת ניצחונות.'); },
        onUse(item){ GAME.RED('אבן בנהר לא תבנה לי גשר. ניסיתי לחשוב, נכשלתי.'); },
      },
    ],

    exits:[
      { id:'back', name:'חזרה ליער', rect:{x:0,y:96,w:22,h:64}, to:'deep_forest',
        entry:{x:280,y:178,dir:'left'}, arrow:'left' },

      // exit by crossing the bridge UP to the far bank
      { id:'fwd', name:'לבית סבתא', rect:{x:204,y:84,w:92,h:30}, to:'granny_ext',
        entry:{x:40,y:178,dir:'right'}, arrow:'up', near:{x:242,y:112},
        gate(){ return GAME.flag(F.bridgeFixed); },
        gateFail(){ GAME.say('הגשר שבור, אין מעבר. צריך משהו לסגור את הפער.'); },
      },
    ],

    onFirst(){
      GAME.say('הנהר חוצה את היער כמו פסיק באמצע משפט. ומולו — גשר שבור.');
    },
    onEnter(){},
  });
})();
