/* items.js — inventory item icons (16x16 drawn at x,y). Agents append more here
   OR register from scenes. Each: GAME.registerItem(id,{name,desc,draw(ctx,x,y,s)}). */
(function(){
  const C=GAME.C;
  const R=(g,x,y,s,lx,ly,w,h,col)=>{ g.fillStyle=col; g.fillRect(x+lx*s,y+ly*s,Math.max(1,w*s),Math.max(1,h*s)); };

  // canonical example item — the basket
  GAME.registerItem('basket',{ name:'הסל', desc:'סל קש עם חטיפים. אמא ארזה לסבתא.',
    draw(g,x,y,s){ s=s||1;
      R(g,x,y,s, 2,6,12,8,C.tan);            // body
      R(g,x,y,s, 2,6,12,1,C.brown);
      R(g,x,y,s, 4,8,2,4,C.brown); R(g,x,y,s,8,8,2,4,C.brown); // weave
      R(g,x,y,s, 3,3,10,3,C.brown);          // handle base
      R(g,x,y,s, 4,1,1,4,C.brown); R(g,x,y,s,11,1,1,4,C.brown);
      R(g,x,y,s, 4,1,8,1,C.brown);
      R(g,x,y,s, 5,7,2,2,C.red); R(g,x,y,s,9,8,2,2,C.gold); // goodies peeking
    }});

  // עוגיה — a single cookie sneaked out of the basket (for the woodcutter)
  GAME.registerItem('cookie',{ name:'עוגיה', desc:'עוגיה אחת מהסל. החוטב לא יעמוד בפיתוי.',
    draw(g,x,y,s){ s=s||1;
      R(g,x,y,s, 4,4,8,8,C.tan);             // round-ish cookie body
      R(g,x,y,s, 3,5,1,6,C.tan); R(g,x,y,s,12,5,1,6,C.tan); // side bulge
      R(g,x,y,s, 5,3,6,1,C.tan); R(g,x,y,s,5,12,6,1,C.tan); // top/bottom bulge
      R(g,x,y,s, 4,11,8,1,C.brown);          // baked underside shade
      R(g,x,y,s, 6,6,1,1,C.darkRed); R(g,x,y,s,9,7,1,1,C.darkRed); // choc chips
      R(g,x,y,s, 7,9,1,1,C.darkRed); R(g,x,y,s,5,8,1,1,C.darkRed);
      R(g,x,y,s, 10,9,1,1,C.darkRed);
      R(g,x,y,s, 5,4,3,1,C.gold);            // top highlight
    }});

  // גרעינים — packet of black sunflower seeds (for the wolf)
  GAME.registerItem('seeds',{ name:'גרעינים', desc:'חבילת גרעינים שחורים מהקיוסק. הזאב ימות עליהם.',
    draw(g,x,y,s){ s=s||1;
      R(g,x,y,s, 3,2,10,12,C.red);           // packet body
      R(g,x,y,s, 3,2,10,2,C.darkRed);        // sealed top crimp
      R(g,x,y,s, 4,3,1,1,C.white); R(g,x,y,s,6,3,1,1,C.white); // crimp teeth
      R(g,x,y,s, 8,3,1,1,C.white); R(g,x,y,s,10,3,1,1,C.white);
      R(g,x,y,s, 5,6,6,6,C.white);           // label window
      // seeds shown in the window
      R(g,x,y,s, 6,7,1,2,C.black); R(g,x,y,s,8,7,1,2,C.black);
      R(g,x,y,s, 7,9,1,2,C.black); R(g,x,y,s,9,9,1,2,C.black);
      R(g,x,y,s, 6,7,1,1,C.gray);            // seed glint
      R(g,x,y,s, 3,2,1,12,C.darkRed);        // left edge shade
    }});

  // קרש — a long wooden plank (to bridge the river gap)
  GAME.registerItem('plank',{ name:'קרש', desc:'קרש עץ ארוך מהחוטב. בדיוק לרוחב הגשר השבור.',
    draw(g,x,y,s){ s=s||1;
      R(g,x,y,s, 1,5,14,5,C.tan);            // plank body (diagonal-ish, drawn flat)
      R(g,x,y,s, 1,5,14,1,C.gold);           // top edge highlight
      R(g,x,y,s, 1,9,14,1,C.brown);          // bottom edge shade
      R(g,x,y,s, 1,5,1,5,C.brown);           // left end grain
      R(g,x,y,s, 14,5,1,5,C.brown);          // right end grain
      R(g,x,y,s, 4,6,8,1,C.brown);           // wood grain line
      R(g,x,y,s, 6,7,1,1,C.dkGray); R(g,x,y,s,10,8,1,1,C.dkGray); // nail holes / knots
    }});

  // מפתח — a rusty key (granny's cottage door)
  GAME.registerItem('key',{ name:'מפתח', desc:'מפתח חלוד מתחת לגמד הגינה. פותח את בית סבתא.',
    draw(g,x,y,s){ s=s||1;
      R(g,x,y,s, 4,2,6,6,C.gold);            // bow (round head)
      R(g,x,y,s, 5,3,4,4,C.brown);           // hollow center
      R(g,x,y,s, 6,4,2,2,C.black);           // hole
      R(g,x,y,s, 6,8,2,6,C.gold);            // shaft
      R(g,x,y,s, 6,11,1,3,C.tan);            // shaft highlight
      R(g,x,y,s, 8,11,2,1,C.gold);           // bit tooth 1
      R(g,x,y,s, 8,13,3,1,C.gold);           // bit tooth 2
      R(g,x,y,s, 4,6,1,1,C.brown);           // rust speck
      R(g,x,y,s, 9,9,1,1,C.brown);           // rust speck
    }});

  // הוכחה — granny's creepy hit-list note (the evidence to expose her)
  GAME.registerItem('evidence',{ name:'הוכחה', desc:'פתק של סבתא: "1. הזאב 2. ?". מצמרר. זאת ההוכחה.',
    draw(g,x,y,s){ s=s||1;
      R(g,x,y,s, 3,2,10,12,C.white);         // paper
      R(g,x,y,s, 3,2,10,1,C.ltGray);         // top edge
      R(g,x,y,s, 3,2,1,12,C.ltGray);         // left edge crease
      R(g,x,y,s, 12,2,1,12,C.gray);          // right edge shade
      R(g,x,y,s, 5,4,5,1,C.black);           // line "1. הזאב"
      R(g,x,y,s, 5,6,6,1,C.black);
      R(g,x,y,s, 5,8,4,1,C.darkRed);         // line "2. ?" — ominous red
      R(g,x,y,s, 9,8,1,1,C.darkRed);         // the question mark dot
      R(g,x,y,s, 5,10,5,1,C.black);
      R(g,x,y,s, 5,12,3,1,C.black);
    }});

})();
