/* js/npc/granny_beast.js — STUB sprite (workflow replaces) */
(function(){const C=GAME.C;
GAME.registerSprite('granny_beast',{w:18,h:40,draw(ctx,x,y,frame,dir,s){s=s||1;
  GAME.ellipse(ctx,x,y,7*s,2*s,'rgba(0,0,0,.3)');
  ctx.fillStyle=C.darkRed; ctx.fillRect(x-7*s,y-24*s,14*s,24*s);
  ctx.fillStyle=C.skin; ctx.fillRect(x-5*s,y-40*s,10*s,9*s);
}});})();
