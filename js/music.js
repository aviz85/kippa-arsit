/* js/music.js — looping chiptune background themes for "כיפה ערסית".
   API:  GAME.music('hood' | 'forest' | 'granny')  ·  GAME.music('stop')
   WebAudio oscillators, subtle volume (~0.03), self-scheduling loop.
   Safe no-op if AudioContext is unavailable (never throws). Self-contained IIFE. */
(function(){
  'use strict';

  // ---- AudioContext (lazy, shared, resilient) ----------------------------
  var actx = null;
  function ac(){
    if(!actx){
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch(e){ actx = null; }
    }
    // browsers suspend the context until a user gesture; nudge it.
    if(actx && actx.state === 'suspended'){ try{ actx.resume(); }catch(e){} }
    return actx;
  }

  // ---- note name -> frequency -------------------------------------------
  var NOTE = { C:0, 'C#':1, D:2, 'D#':3, E:4, F:5, 'F#':6, G:7, 'G#':8, A:9, 'A#':10, B:11 };
  function hz(name){
    if(name == null || name === '-' ) return 0;           // rest
    var m = /^([A-G]#?)(\d)$/.exec(name);
    if(!m) return 0;
    var semis = NOTE[m[1]] + (parseInt(m[2],10) + 1) * 12; // MIDI number
    return 440 * Math.pow(2, (semis - 69) / 12);
  }

  // ---- volume constants (subtle) ----------------------------------------
  var LEAD_VOL = 0.030;
  var BASS_VOL = 0.026;

  // ---- one short note: oscillator + gain envelope -----------------------
  function note(freq, start, dur, type, vol){
    var a = actx; if(!a || !freq) return;
    var o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, start);
    // tiny attack so it doesn't click, then decay.
    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(vol, start + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, start + Math.max(0.05, dur * 0.95));
    o.connect(g); g.connect(a.destination);
    o.start(start);
    o.stop(start + dur + 0.02);
    voices.push(o);
    o.onended = function(){ var i = voices.indexOf(o); if(i >= 0) voices.splice(i,1); };
  }

  // ---- theme definitions -------------------------------------------------
  // Each theme: step duration (sec) + a lead line + a bass line (arrays of
  // note names, '-' = rest). Lines may differ in length; each loops within the
  // pattern by index modulo its own length.
  var THEMES = {
    // upbeat street groove — bouncy major, walking-ish bass
    hood: {
      step: 0.150, type: 'square', bassType: 'triangle',
      lead: ['E4','G4','A4','G4','E4','A4','B4','A4',
             'C5','B4','A4','G4','E4','D4','E4','-' ],
      bass: ['A2','-','E2','-','A2','-','C3','-' ]
    },
    // mellow forest — soft, slow, gentle major
    forest: {
      step: 0.260, type: 'triangle', bassType: 'sine',
      lead: ['C4','E4','G4','E4','A4','G4','E4','D4',
             'F4','E4','D4','C4','G3','C4','E4','-' ],
      bass: ['C2','-','G2','-','A2','-','F2','-' ]
    },
    // creepy granny — minor, dissonant, low and uneasy
    granny: {
      step: 0.230, type: 'sawtooth', bassType: 'square',
      lead: ['A3','-','C4','B3','A3','-','D#4','-',
             'A3','G#3','A3','-','F4','E4','-','-' ],
      bass: ['A1','A1','-','D#2','A1','-','F1','-' ]
    }
  };

  // ---- scheduler state ---------------------------------------------------
  var current = null;     // active theme key
  var theme   = null;     // active theme object
  var step    = 0;        // global step counter
  var nextTime = 0;       // when the next step should sound (audio clock)
  var timer   = null;     // setInterval handle
  var voices  = [];       // live oscillators (for hard stop)
  var LOOKAHEAD = 0.10;   // schedule notes this far ahead (sec)
  var TICK = 25;          // scheduler poll interval (ms)

  function schedule(){
    var a = actx; if(!a || !theme) return;
    while(nextTime < a.currentTime + LOOKAHEAD){
      var s = step;
      var lf = hz(theme.lead[s % theme.lead.length]);
      var bf = hz(theme.bass[s % theme.bass.length]);
      if(lf) note(lf, nextTime, theme.step, theme.type, LEAD_VOL);
      if(bf) note(bf, nextTime, theme.step * 1.1, theme.bassType, BASS_VOL);
      nextTime += theme.step;
      step++;
    }
  }

  function stopAll(){
    if(timer){ clearInterval(timer); timer = null; }
    var a = actx;
    for(var i = voices.length - 1; i >= 0; i--){
      try{ voices[i].stop(a ? a.currentTime : 0); }catch(e){}
    }
    voices.length = 0;
    current = null; theme = null; step = 0; nextTime = 0;
  }

  // ---- public API --------------------------------------------------------
  GAME.music = function(name){
    try {
      if(name === 'stop' || name == null || !THEMES[name]){
        stopAll();
        return;
      }
      if(name === current) return;   // already playing this theme
      stopAll();
      var a = ac();
      if(!a) return;                 // no audio available — silent no-op
      current  = name;
      theme    = THEMES[name];
      step     = 0;
      nextTime = a.currentTime + 0.06;
      schedule();
      timer = setInterval(function(){ try{ schedule(); }catch(e){} }, TICK);
    } catch(e){ /* never throw from music */ }
  };

})();
