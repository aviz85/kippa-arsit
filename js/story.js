/* story.js — shared narrative constants & helpers used across scenes.
   The full puzzle/flag graph lives here so scene agents reference ONE source of truth. */
(function(){
  GAME.STORY = {
    // colors for each speaker (used with GAME.speak)
    voice: {
      red:    GAME.C.pink,    // כיפה הערסית
      mom:    GAME.C.orange,  // אמא
      wolf:   GAME.C.green,   // הזאב הצמחוני
      granny: GAME.C.red,     // הסבתא הפסיכופטית
      narr:   GAME.C.white,
    },
    // canonical flag names (single source of truth)
    flags: {
      hasMission:   'hasMission',   // mom gave the quest
      gotBasket:    'gotBasket',
      wolfFriend:   'wolfFriend',   // befriended the vegetarian wolf
      gaveSeeds:    'gaveSeeds',    // gave wolf sunflower seeds
      bridgeFixed:  'bridgeFixed',
      knowsGranny:  'grannyTruth',  // learned granny is a psychopath
      hasKnifeProof:'knifeProof',   // evidence of granny's true nature
      grannyBeaten: 'grannyBeaten',
    },
  };
  // convenience speak wrappers
  GAME.RED    = (t)=> GAME.speak('כיפה',  t, GAME.STORY.voice.red);
  GAME.MOM    = (t)=> GAME.speak('אמא',   t, GAME.STORY.voice.mom);
  GAME.WOLF   = (t)=> GAME.speak('הזאב',  t, GAME.STORY.voice.wolf);
  GAME.GRANNY = (t)=> GAME.speak('סבתא',  t, GAME.STORY.voice.granny);
})();
