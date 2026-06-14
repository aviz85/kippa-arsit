/* scene07_river.js — STUB (workflow will replace with full scene) */
(function(){const C=GAME.C;
GAME.registerScene({
  id:'river', name:'הנהר והגשר',
  entry:{x:40,y:178,dir:'right'},
  walkbox:[{x:10,y:158,w:300,h:36}],
  scale:{near:1.0,far:0.8,horizon:150},
  drawBackground(ctx){
    GAME.gradV(ctx,0,0,320,100,C.cyan,C.blue);
    GAME.rect(ctx,0,100,320,100,C.darkBlue);
    GAME.dither(ctx,0,100,320,60,C.darkBlue,C.black);
    GAME.line(ctx,0,158,320,158,C.black);
  },
  hotspots:[
    {id:'sign',name:'שלט',rect:{x:140,y:110,w:40,h:30},
      onLook(){GAME.say('(החדר "הנהר והגשר" עדיין בבנייה — בקרוב).');}}
  ],
  exits:[
    {id:'back',name:'אחורה',rect:{x:0,y:90,w:24,h:70},to:'deep_forest',entry:{x:40,y:178,dir:'right'},arrow:'left'},
    {id:'fwd',name:'לבית סבתא',rect:{x:296,y:90,w:24,h:70},to:'granny_ext',entry:{x:300,y:178,dir:'left'},arrow:'right'}
  ],
  onEnter(){},
});})();
