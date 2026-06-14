/* scene01_room.js — החדר של כיפה (CANONICAL TEMPLATE — clone this shape) */
(function(){
  const C=GAME.C, F=GAME.STORY.flags;

  GAME.registerScene({
    id:'room_red',
    name:'החדר של כיפה',
    entry:{ x:150, y:178, dir:'left' },
    walkbox:[ {x:18,y:160,w:288,h:32} ],
    scale:{ near:1.0, far:0.85, horizon:158 },

    drawBackground(ctx){
      // walls
      GAME.rect(ctx,0,0,320,160,C.purple);
      GAME.dither(ctx,0,0,320,160,C.purple,'#7a3a96');
      // floor
      GAME.rect(ctx,0,158,320,42,C.brown);
      GAME.dither(ctx,0,158,320,42,C.brown,C.tan);
      GAME.line(ctx,0,160,320,160,C.black);
      // skirting
      GAME.rect(ctx,0,154,320,4,C.darkRed);

      // window (left) with night sky — it's morning-ish hood vibe
      GAME.box(ctx,28,40,70,60,C.black);
      GAME.gradV(ctx,30,42,66,56,C.cyan,C.blue);
      GAME.line(ctx,63,42,63,98,C.black); GAME.line(ctx,30,70,96,70,C.black);
      // building across the street
      GAME.rect(ctx,34,60,20,38,C.gray); GAME.rect(ctx,70,55,22,43,C.dkGray);
      GAME.px(ctx,40,66,C.yellow); GAME.px(ctx,46,72,C.yellow); GAME.px(ctx,78,64,C.yellow);

      // poster (rapper) on wall
      GAME.box(ctx,150,28,52,64,C.black);
      GAME.rect(ctx,151,29,50,62,C.dkGray);
      GAME.rect(ctx,160,40,32,30,C.skin);     // face
      GAME.rect(ctx,158,34,36,8,C.black);     // cap
      GAME.rect(ctx,164,60,24,6,C.gold);      // chain
      GAME.text && null;

      // mirror
      GAME.box(ctx,240,34,40,56,C.gold);
      GAME.rect(ctx,242,36,36,52,C.steel);
      GAME.dither(ctx,242,36,36,52,C.steel,C.ltGray);

      // door (exit right)
      GAME.rect(ctx,284,92,34,68,C.darkRed);
      GAME.box(ctx,284,92,34,68,C.black);
      GAME.rect(ctx,288,96,26,62,C.brown);
      GAME.box(ctx,290,104,22,24,C.darkRed);
      GAME.box(ctx,290,130,22,24,C.darkRed);
      GAME.rect(ctx,292,124,3,4,C.gold);   // handle
    },

    hotspots:[
      { id:'bed', name:'המיטה', rect:{x:18,y:120,w:86,h:42}, near:{x:60,y:172},
        draw(ctx){ const C=GAME.C;
          GAME.rect(ctx,18,138,86,22,C.brown); GAME.box(ctx,18,138,86,22,C.black);
          GAME.rect(ctx,20,128,82,12,C.pink);          // blanket
          GAME.dither(ctx,20,128,82,12,C.pink,C.red);
          GAME.rect(ctx,22,124,24,10,C.white);         // pillow
          GAME.rect(ctx,18,120,6,42,C.dkGray);         // headboard
        },
        onLook(){ GAME.say('מיטה לא מסודרת. על הכרית כתוב "באלאגן זה סטייל".'); },
        onTake(){ GAME.RED('מה אני אסחב מיטה? נראה לך?'); },
        onUse(){ GAME.RED('כבר ישנתי מספיק. סבבה.'); },
      },

      { id:'mirror', name:'המראה', rect:{x:240,y:34,w:40,h:56}, near:{x:255,y:170},
        onLook(){ GAME.RED('וואלה אחותי, את חתיכת לוֹּקְ. כיפה אדומה? כיפה אֲדִירָה.'); GAME.score(2,'mirror'); },
        onUse(){ GAME.RED('מסדרת את הכיפה. פצצה.'); },
        onTalk(){ GAME.RED('"מי הכי שווה ביער?" המראה לא עונה. עלבון.'); },
      },

      { id:'poster', name:'הפוסטר', rect:{x:150,y:28,w:52,h:64}, near:{x:175,y:170},
        onLook(){ GAME.say('הזמר האהוב על כיפה. חתום: "להישאר ערס — תודה."'); },
        onTake(){ GAME.RED('זה קדוש. לא נוגעים.'); },
      },

      { id:'window', name:'החלון', rect:{x:28,y:40,w:70,h:60}, near:{x:65,y:170},
        onLook(){ GAME.say('השכונה מתעוררת. מהיער הירוק נשמע... צ\'יל מוזר.'); },
        onUse(){ GAME.RED('לא קופצת מהחלון, אני לא בסרט.'); },
      },

      // the basket — the key item of this room
      { id:'basket_spot', name:'הסל', rect:{x:112,y:138,w:24,h:22}, near:{x:124,y:172}, keepDraw:true,
        draw(ctx){ if(GAME.has('basket')) return; // hide once taken
          GAME.itemDef('basket').draw(ctx,112,134,1.4); },
        onLook(){ if(GAME.has('basket')){ GAME.say('לקחת כבר את הסל.'); return; }
          GAME.say('הסל שאמא הכינה. בפנים חטיפים לסבתא.'); },
        onTake(){ if(GAME.has('basket')){ GAME.RED('יש לי כבר, אחי.'); return; }
          GAME.give('basket'); GAME.setFlag(F.gotBasket,true);
          GAME.RED('סל? סבבה. בוא נזרום ליער.'); GAME.score(5,'getbasket'); },
        onUse(){ GAME.RED('אני לוקחת אותו, לא משחקת איתו.'); },
      },
    ],

    exits:[
      { id:'door', name:'הדלת', rect:{x:286,y:96,w:30,h:64}, to:'living_room',
        entry:{x:60,y:178,dir:'right'}, arrow:'right' },
    ],

    onFirst(){
      GAME.say('1989. אי-שם בשכונה ליד היער.');
      GAME.onMsgDone(()=>{
        GAME.RED('בוקר. צריך לקחת את הסל ולזוז לסבתא. איזה כיף, נ#$%.');
      });
    },
    onEnter(){},
  });
})();
