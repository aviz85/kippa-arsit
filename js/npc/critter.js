/* js/npc/critter.js — STUB sprite (workflow replaces) */
(function(){const C=GAME.C;
GAME.registerSprite('critter',{w:18,h:16,draw(ctx,x,y,frame,dir,s){s=s||1;
  GAME.ellipse(ctx,x,y,7*s,2*s,'rgba(0,0,0,.3)');
  ctx.fillStyle=C.tan; ctx.fillRect(x-7*s,y-10*s,14*s,10*s);
  ctx.fillStyle=C.skin; ctx.fillRect(x-5*s,y-16*s,10*s,9*s);
}});})();
