/* scene08_granny_ext.js — STUB (workflow will replace with full scene) */
(function(){const C=GAME.C;
GAME.registerScene({
  id:'granny_ext', name:'בית סבתא — חוץ',
  entry:{x:40,y:178,dir:'right'},
  walkbox:[{x:10,y:158,w:300,h:36}],
  scale:{near:1.0,far:0.8,horizon:150},
  drawBackground(ctx){
    GAME.gradV(ctx,0,0,320,100,C.cyan,C.blue);
    GAME.rect(ctx,0,100,320,100,C.steel);
    GAME.dither(ctx,0,100,320,60,C.steel,C.black);
    GAME.line(ctx,0,158,320,158,C.black);
  },
  hotspots:[
    {id:'sign',name:'שלט',rect:{x:140,y:110,w:40,h:30},
      onLook(){GAME.say('(החדר "בית סבתא — חוץ" עדיין בבנייה — בקרוב).');}}
  ],
  exits:[
    {id:'back',name:'אחורה',rect:{x:0,y:90,w:24,h:70},to:'river',entry:{x:40,y:178,dir:'right'},arrow:'left'},
    {id:'in',name:'להיכנס',rect:{x:150,y:60,w:60,h:30},to:'granny_int',entry:{x:160,y:178,dir:'down'},arrow:'up'}
  ],
  onEnter(){},
});})();
