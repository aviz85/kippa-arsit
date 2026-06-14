/* js/npc/woodcutter.js — STUB sprite (workflow replaces) */
(function(){const C=GAME.C;
GAME.registerSprite('woodcutter',{w:18,h:36,draw(ctx,x,y,frame,dir,s){s=s||1;
  GAME.ellipse(ctx,x,y,7*s,2*s,'rgba(0,0,0,.3)');
  ctx.fillStyle=C.brown; ctx.fillRect(x-7*s,y-22*s,14*s,22*s);
  ctx.fillStyle=C.skin; ctx.fillRect(x-5*s,y-36*s,10*s,9*s);
}});})();
