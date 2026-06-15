/* scene04_forest_edge.js — כניסה ליער (full scene) */
(function(){
  const C=GAME.C, F=GAME.STORY.flags;

  // local speaker wrapper for the woodcutter (grumpy, gray voice)
  if(!GAME.WOOD){
    GAME.WOOD = (t)=> GAME.speak('חוטב', t, GAME.C.tan);
  }

  // canon: the woodcutter gives the plank, so possession of 'plank' is the
  // single source of truth for "already helped". No off-spec flag needed.
  const helped = ()=> GAME.has('plank');

  // --- register inventory icons we may hand out here (items.js allows scene-registered items) ---
  if(!GAME.itemDef('cookie')){
    GAME.registerItem('cookie',{ name:'עוגיה', desc:'עוגיה מהסל. סוחטת לב של חוטבי עצים מרירים מאז 1812.',
      draw(g,x,y,s){ s=s||1;
        g.fillStyle=C.tan;   g.fillRect(x+2*s,y+3*s,12*s,11*s);   // body
        g.fillStyle=C.brown; g.fillRect(x+2*s,y+3*s,12*s,1*s);    // baked top
        g.fillStyle=C.dkGray;                                      // chocolate chips
        g.fillRect(x+4*s,y+6*s,2*s,2*s); g.fillRect(x+9*s,y+5*s,2*s,2*s);
        g.fillRect(x+6*s,y+10*s,2*s,2*s); g.fillRect(x+10*s,y+10*s,2*s,2*s);
      }});
  }
  if(!GAME.itemDef('plank')){
    GAME.registerItem('plank',{ name:'קרש', desc:'קרש עץ ארוך. פתרון של פאזל הרפתקה קלאסי שמחכה לחור מתאים.',
      draw(g,x,y,s){ s=s||1;
        g.fillStyle=C.brown; g.fillRect(x+1*s,y+5*s,14*s,6*s);    // plank body
        g.fillStyle=C.tan;   g.fillRect(x+1*s,y+6*s,14*s,1*s);    // highlight
        g.fillStyle=C.dkGray;                                      // wood-grain knots
        g.fillRect(x+4*s,y+7*s,1*s,2*s); g.fillRect(x+10*s,y+7*s,1*s,2*s);
        g.fillStyle=C.darkRed; g.fillRect(x+2*s,y+9*s,1*s,1*s); g.fillRect(x+13*s,y+6*s,1*s,1*s); // nails
      }});
  }

  GAME.registerScene({
    id:'forest_edge',
    name:'כניסה ליער',
    entry:{ x:40, y:178, dir:'right' },
    walkbox:[ {x:14,y:160,w:292,h:34} ],
    scale:{ near:1.0, far:0.72, horizon:150 },

    drawBackground(ctx){
      // sky
      GAME.gradV(ctx,0,0,320,96,C.cyan,C.blue);
      // distant tree-line silhouette (street giving way to forest)
      for(let i=0;i<320;i+=18){
        const h=10+((i*37)%14);
        GAME.poly(ctx,[[i,96],[i+9,96-h],[i+18,96]],C.darkGreen);
      }
      // ground: left = asphalt of the hood, right = forest dirt path
      GAME.rect(ctx,0,90,320,110,C.darkGreen);
      GAME.dither(ctx,0,90,320,40,C.darkGreen,C.moss);
      GAME.rect(ctx,0,150,150,50,C.dkGray);            // last bit of street
      GAME.dither(ctx,0,150,150,50,C.dkGray,C.gray);
      GAME.rect(ctx,120,150,200,50,C.brown);           // forest dirt
      GAME.dither(ctx,120,150,200,50,C.brown,C.tan);
      GAME.line(ctx,0,150,320,150,C.black);
      // a faded crosswalk on the last asphalt — the hood doesn't end politely
      for(let i=8;i<120;i+=18){ GAME.rect(ctx,i,182,9,5,C.ltGray); }
      // the curb where street meets forest
      GAME.rect(ctx,138,150,8,50,C.ltGray);
      GAME.box(ctx,138,150,8,50,C.black);

      // winding dirt path leading into the trees (toward fwd exit)
      GAME.poly(ctx,[[170,200],[210,200],[240,150],[222,150]],C.tan);
      GAME.poly(ctx,[[240,150],[222,150],[262,108],[250,108]],C.tan);
      // a couple of stepping stones along the path
      GAME.ellipse(ctx,196,188,5,3,C.gray);
      GAME.ellipse(ctx,224,166,4,2,C.ltGray);

      // --- big foreground trees ---
      function tree(bx,by,scale){
        const tw=14*scale, th=46*scale;
        GAME.rect(ctx,bx-tw/2,by-th,tw,th,C.brown);          // trunk
        GAME.box(ctx,bx-tw/2,by-th,tw,th,C.black);
        GAME.line(ctx,bx,by-th,bx,by-2,'#3a2410');           // bark line
        GAME.line(ctx,bx-tw/2+1,by-th*0.6,bx-1,by-th*0.55,'#3a2410'); // bark grain
        // canopy (layered blobs)
        GAME.ellipse(ctx,bx,by-th-8*scale, 22*scale,16*scale, C.darkGreen);
        GAME.ellipse(ctx,bx-12*scale,by-th-2*scale, 14*scale,11*scale, C.darkGreen);
        GAME.ellipse(ctx,bx+12*scale,by-th-2*scale, 14*scale,11*scale, C.darkGreen);
        GAME.ellipse(ctx,bx-4*scale,by-th-14*scale, 14*scale,10*scale, C.green); // highlight
        GAME.ellipse(ctx,bx+6*scale,by-th-6*scale, 6*scale,5*scale, C.green);    // dapple
      }
      tree(40,150,1.25);
      tree(300,150,1.35);
      tree(96,118,0.7);   // background tree

      // --- log pile (right of stump) ---
      const lx=246, ly=150;
      for(let r=0;r<3;r++){
        for(let c=0;c<3-r;c++){
          const cx=lx + c*13 + r*6, cy=ly-7 - r*11;
          GAME.ellipse(ctx,cx,cy,6,5,C.brown);
          GAME.box(ctx,cx-6,cy-5,12,10,C.black);
          GAME.ellipse(ctx,cx,cy,3,3,C.tan);     // log end rings
          GAME.ellipse(ctx,cx,cy,1,1,C.brown);
        }
      }

      // --- chopping stump (center, where woodcutter stands) ---
      GAME.rect(ctx,176,140,30,16,C.brown);
      GAME.box(ctx,176,140,30,16,C.black);
      GAME.rect(ctx,176,138,30,4,C.tan);            // top surface
      GAME.dither(ctx,176,138,30,4,C.tan,C.brown);
      GAME.ellipse(ctx,191,140,11,3,C.brown);       // rings on top
      GAME.ellipse(ctx,191,140,6,2,C.tan);
      GAME.ellipse(ctx,191,140,2,1,C.brown);        // core ring
      GAME.line(ctx,184,139,198,141,C.darkRed);     // a chop scar

      // --- the "יער" sign on a post ---
      GAME.rect(ctx,150,108,3,28,C.brown);          // post
      GAME.box(ctx,150,108,3,28,C.black);
      GAME.rect(ctx,138,98,30,14,C.tan);            // board
      GAME.box(ctx,138,98,30,14,C.black);
      GAME.line(ctx,138,98,168,112,C.brown);        // wood grain hint
      GAME.rect(ctx,142,103,22,2,C.brown);          // engraved "lettering" bar
      GAME.rect(ctx,144,107,14,1,C.brown);
      // a couple of fern bushes for foreground life
      GAME.ellipse(ctx,28,176,12,6,C.green);
      GAME.ellipse(ctx,28,174,7,3,C.darkGreen);
      GAME.ellipse(ctx,310,178,13,6,C.darkGreen);
      GAME.ellipse(ctx,310,176,8,3,C.green);
      GAME.ellipse(ctx,118,170,9,4,C.green);
      // tiny red mushroom by the path (a wink toward the next scene)
      GAME.rect(ctx,162,170,2,3,C.tan);
      GAME.ellipse(ctx,163,169,3,2,C.red);
      GAME.px(ctx,162,169,C.white); GAME.px(ctx,164,170,C.white);
    },

    hotspots:[
      // ---------------- the woodcutter NPC ----------------
      { id:'woodcutter', name:'חוטב העצים', rect:{x:172,y:104,w:40,h:52}, near:{x:170,y:172},
        keepDraw:true,
        draw(ctx){
          // stands just behind the stump, facing the player (left)
          GAME.drawSprite(ctx,'woodcutter',196,140,0,'left',1.0);
        },
        onLook(){
          if(helped()) GAME.say('חוטב עצים. נרגן, אבל מאז העוגיה — קצת פחות. רק קצת. עדיין נרגן, רק עם סוכר בדם.');
          else GAME.say('חוטב עצים נרגן עם גרזן. ערימת בולים מאחוריו, ועוד יותר זעף מקדימה. הפנים שלו אומרות "לא היום", והיום בדיוק התחיל.');
        },
        onTalk(){
          if(helped()){
            GAME.choice('לדבר עם החוטב:',[
              { label:'"תודה על הקרש."', action(){ GAME.WOOD('נו, די. לכי כבר. יום ארוך לפנייך, ילדה.'); } },
              { label:'"ספר לי על הזקנה."', action(){
                  GAME.WOOD('פעם היה פה שקט. אז הגיעה היא ובנתה בית בקצה היער. מאז... הציפורים עפות מסביב לבית שלה. לא מעליו. מסביב.');
                  GAME.onMsgDone(()=> GAME.WOOD('אם כבר לפחד — תפחדי מהזקנה. היא זאת שמסתובבת עם סכינים. והיא מחדדת אותן בערבים. לכיף.'));
                } },
              { label:'"איך עוברים את הנהר?"', action(){
                  GAME.WOOD('הגשר שבור, אגב. תצטרכי משהו לעבור. נגיד... משהו ארוך, שטוח, עשוי עץ. אני לא אומר מה. אבל קיבלת אחד כזה הרגע.');
                } },
            ]);
            return;
          }
          // grumpy first contact
          GAME.WOOD('נו? מה את רוצה? אני באמצע עבודה, ילדה.');
          GAME.onMsgDone(()=>{
            GAME.choice('לדבר עם החוטב:',[
              { label:'"מה שלומך, אחי?"', action(){
                  GAME.WOOD('עוף לי מהגזע. וזהירות עם הגרזן — הוא לא צעצוע, וגם אם היה, לא היית משחקת איתו.');
                } },
              { label:'"אפשר עזרה ביער?"', action(){
                  GAME.WOOD('עזרה? אני נראה לך מודיעין יער? לכי תמצאי לבד. יש שביל. השביל יודע יותר ממני.');
                  GAME.onMsgDone(()=> GAME.RED('מקסים. ממש איש שירות הלקוחות של היער. חמש כוכבים, מינוס חמש כוכבים.'));
                } },
              { label:'(להמשיך)', action(){ GAME.RED('אחי על הפנים. אבל סבבה, נמשיך. בנאדם פעם בטח חייך, ב-86\'.'); } },
            ]);
          });
        },
        onTake(){
          // grabbing AT the woodcutter / his axe -> death gag
          GAME.WOOD('אל הגרזן. נגעת — הלכת.');
          GAME.onMsgDone(()=> GAME.die('החוטב לא מתבדח לגבי הגרזן. סוף חד.'));
        },
        onUse(item){
          if(helped()){ GAME.WOOD('כבר קיבלתי, ילדה. קיבלת קרש. זהו, די. שני אנשים אמרו תודה והעולם נגמר.'); return; }
          if(item==='basket' || item==='cookie'){
            const serveCookie = ()=>{
              GAME.WOOD('...עוגיה. בשבילי? עברו שנים. מאז אשתי. היא אפתה. הוא לא אפה. אף אחד לא אפה.');
              GAME.onMsgDone(()=>{
                GAME.WOOD('טוב. את בסדר, ילדה. קחי קרש — ארוך וטוב. תעשי איתו משהו חכם, לא כמו רוב האנשים פה.');
                if(!GAME.has('plank')){ GAME.give('plank'); GAME.score(5,'plank'); }
                GAME.onMsgDone(()=>{
                  GAME.WOOD('והזאב? פרא תמים, ההוא. בחיים לא נגע באף אחד. בקושי נוגע בסלט. תשמרי מהזקנה — היא לא מה שנדמה.');
                });
              });
            };
            // sneak a cookie out of the basket (canon: basket counts as cookie)
            if(item==='basket' && GAME.has('basket') && !GAME.has('cookie')){
              GAME.give('cookie');
              GAME.RED('שלפתי לו עוגיה אחת מהסל. סבתא תסלח לי. אולי. סבתא לא נראית סלחנית, אבל אחר כך.');
              GAME.onMsgDone(serveCookie);
            } else {
              serveCookie();
            }
            return;
          }
          GAME.WOOD('מה אני אעשה עם זה? עוף לי. תביאי משהו אכיל, אולי. אני חוטב, לא אספן.');
        },
      },

      // ---------------- the chopping stump ----------------
      { id:'stump', name:'הגזע', rect:{x:176,y:138,w:30,h:18}, near:{x:176,y:172},
        onLook(){ GAME.say('גזע כריתה עם טבעות שנים וצלקת גרזן. כיסא של חוטב, לא יותר. ספרתי 40 טבעות; הוא ספר 40 שנות תסכול.'); },
        onUse(){ GAME.RED('שבתי על הגזע רגע. וואלה, מדיטציה ביער. הזאב היה גאה. החוטב פחות, אבל החוטב גאה רק בבולים שלו.'); GAME.score(1,'stumpsit'); },
        onTake(){ GAME.RED('לסחוב גזע שלם? אני ערסית, לא מלגזה.'); },
        onTalk(){ GAME.RED('דיברתי עם הגזע. הוא הקשיב יותר טוב מהחוטב. ולא קטע אותי באמצע.'); },
      },

      // ---------------- the axe (separate target = death) ----------------
      { id:'axe', name:'הגרזן', rect:{x:200,y:120,w:14,h:24}, near:{x:182,y:172},
        onLook(){ GAME.say('גרזן חד נעוץ בגזע. החוטב לא מוריד ממנו עין. הוא קורא לו בשם. לא נשאל איזה.'); },
        onTake(){
          GAME.WOOD('אל הגרזן! נגעת — הלכת.');
          GAME.onMsgDone(()=> GAME.die('תפסת את הגרזן. החוטב לא צחק. גם את כבר לא.'));
        },
        onUse(){ GAME.RED('לגעת בגרזן של החוטב? אני אוהבת את האצבעות שלי. כל העשר. תודה.'); },
      },

      // ---------------- log pile ----------------
      { id:'logs', name:'ערימת הבולים', rect:{x:240,y:118,w:60,h:38}, near:{x:250,y:172},
        onLook(){ GAME.RED('ערימת בולים מסודרת בול לבול. מישהו פה עם בעיות שצריך לטפל בהן. או חבר טוב, או טיפול. עדיף שניהם.'); },
        onTake(){
          if(helped()){ GAME.RED('יש לי כבר קרש. כמה עץ ערסית צריכה? אני לא בונה ספינה.'); return; }
          GAME.WOOD('אל תיגעי בעצים שלי. הם ספורים. ספרתי. פעמיים. בקול.');
          GAME.onMsgDone(()=> GAME.RED('סבבה אדוני, רגוע. ספרת בולים פעמיים בקול — כל הכבוד על ההובי המרתק.'));
        },
        onUse(){ GAME.RED('לא בא לי לערוך מחדש את הערימה שלו. הוא יספור שוב. בקול. ואני אצטרך להיות פה.'); },
      },

      // ---------------- the "יער" sign ----------------
      { id:'sign', name:'השלט', rect:{x:138,y:96,w:30,h:18}, near:{x:152,y:172},
        onLook(){ GAME.say('שלט: "יער". מתחת, בכתב יד: "כן, יער. מה ציפית, מרכז מסחרי?"'); GAME.score(1,'sign'); },
        onTake(){ GAME.RED('לתלוש שלט עירוני? אני ערסית עם ערכים. אספלט נגמר, ערכים לא.'); },
        onUse(){ GAME.RED('השלט בסדר איפה שהוא. גם ככה ברור שזה יער. הריח של עצים ושל "אין פה קליטה" די מסגיר.'); },
        onTalk(){ GAME.RED('"שלום שלט." השלט שתק. עקבי בעמדתו. כבוד.'); },
      },
    ],

    exits:[
      { id:'back', name:'חזרה לשכונה', rect:{x:0,y:96,w:22,h:62}, to:'hood',
        entry:{x:268,y:178,dir:'left'}, arrow:'left' },
      { id:'fwd', name:'עומק היער', rect:{x:296,y:96,w:24,h:62}, to:'deep_forest',
        entry:{x:40,y:178,dir:'right'}, arrow:'right' },
    ],

    onFirst(){
      GAME.say('היכן שהאספלט נגמר, היער מתחיל. ולא מתנצל.');
      GAME.onMsgDone(()=> GAME.RED('וואלה. עצים אמיתיים. אין פה אפילו קיוסק. אין קליטה. איך אנשים שורדים? אוסטרליה ביי, ציוויליזציה.'));
    },
    onEnter(){},
  });
})();
