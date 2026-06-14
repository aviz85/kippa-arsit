/* scene00_intro.js — STUB intro (workflow replaces with storybook cutscene) */
(function(){const C=GAME.C;
GAME.registerScene({ id:'intro', name:'', entry:{x:160,y:185,dir:'right'},
  walkbox:[{x:0,y:198,w:320,h:2}],
  drawBackground(ctx){ GAME.gradV(ctx,0,0,320,200,C.night,C.darkBlue); },
  hotspots:[], exits:[],
  onEnter(){ GAME.goto('room_red'); },
});})();
