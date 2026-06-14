/* items.js — inventory item icons (16x16 drawn at x,y). Agents append more here
   OR register from scenes. Each: GAME.registerItem(id,{name,desc,draw(ctx,x,y,s)}). */
(function(){
  const C=GAME.C;
  const R=(g,x,y,s,lx,ly,w,h,col)=>{ g.fillStyle=col; g.fillRect(x+lx*s,y+ly*s,Math.max(1,w*s),Math.max(1,h*s)); };

  // canonical example item — the basket
  GAME.registerItem('basket',{ name:'הסל', desc:'סל קש. בפנים: עוגיות חשיש... אֶה, סבתא-קוקיז.',
    draw(g,x,y,s){ s=s||1;
      R(g,x,y,s, 2,6,12,8,C.tan);            // body
      R(g,x,y,s, 2,6,12,1,C.brown);
      R(g,x,y,s, 4,8,2,4,C.brown); R(g,x,y,s,8,8,2,4,C.brown); // weave
      R(g,x,y,s, 3,3,10,3,C.brown);          // handle base
      R(g,x,y,s, 4,1,1,4,C.brown); R(g,x,y,s,11,1,1,4,C.brown);
      R(g,x,y,s, 4,1,8,1,C.brown);
      R(g,x,y,s, 5,7,2,2,C.red); R(g,x,y,s,9,8,2,2,C.gold); // goodies peeking
    }});

})();
