/* js/npc/granny.js — STUB sprite (workflow replaces) */
(function(){const C=GAME.C;
GAME.registerSprite('granny',{w:18,h:34,draw(ctx,x,y,frame,dir,s){s=s||1;
  GAME.ellipse(ctx,x,y,7*s,2*s,'rgba(0,0,0,.3)');
  ctx.fillStyle=C.red; ctx.fillRect(x-7*s,y-20*s,14*s,20*s);
  ctx.fillStyle=C.skin; ctx.fillRect(x-5*s,y-34*s,10*s,9*s);
}});})();
