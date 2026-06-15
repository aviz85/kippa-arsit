/* assets.js — asset manifest. Files that don't exist yet fall back to procedural art.
   As the asset-generation workflow lands PNGs, they light up automatically. */
(function(){
  const SCENES = ['intro','room_red','living_room','hood','forest_edge','deep_forest',
                  'wolf_garden','river','granny_ext','granny_int','finale'];
  // heights are LOGICAL px at scale 1.0; Red = the UNIT (64). NPCs sized relative to her.
  const SPRITES = {
    red:{h:64,dirs:['down','up','side'],frames:{down:3,up:3,side:3}},
    wolf:{h:86,dirs:['side']},          // tall, on hind legs
    granny:{h:58,dirs:['side']},        // hunched old lady
    granny_beast:{h:70,dirs:['side']},
    mom:{h:62,dirs:['side']},
    neighbor:{h:64,dirs:['side']},
    woodcutter:{h:72,dirs:['side']},
    critter:{h:24,dirs:['side']},       // small rabbit
  };
  const ITEMS = ['basket','cookie','seeds','plank','key','evidence'];
  const VERBS = ['walk','look','talk','take','use'];

  const list = {};
  SCENES.forEach(s => list['bg_'+s] = 'assets/bg/'+s+'.png');
  Object.entries(SPRITES).forEach(([id,m]) => m.dirs.forEach(d => {
    list['spr_'+id+'_'+d] = 'assets/spr/'+id+'_'+d+'.png';
    const nf = m.frames && m.frames[d];
    if (nf) for (let f=0; f<nf; f++) list['spr_'+id+'_'+d+'_'+f] = 'assets/spr/'+id+'_'+d+'_'+f+'.png';
  }));
  ITEMS.forEach(i => list['item_'+i] = 'assets/item/'+i+'.png');
  list['ui_title'] = 'assets/ui/title.png';
  list['ui_cursor'] = 'assets/ui/cursor.png';
  VERBS.forEach(v => list['ui_verb_'+v] = 'assets/ui/verb_'+v+'.png');

  // v3 foreground props (from js/layers.js) + any walk-cycle frames declared in sprite meta
  if (window.GAME && GAME.LAYERS) {
    Object.values(GAME.LAYERS).forEach(L => (L.props||[]).forEach(p => {
      if (p.img) list[p.img] = 'assets/prop/' + p.img.replace(/^prop_/, '') + '.png';
    }));
  }

  const meta = {};
  Object.entries(SPRITES).forEach(([id,m]) => meta[id] = {h:m.h, frames:m.frames});

  GAME.registerAssets(list, meta);
})();
