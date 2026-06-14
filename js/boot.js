/* boot.js — wire DOM to engine and start */
(function(){
  const $=(id)=>document.getElementById(id);
  GAME._initCanvas($('screen'));
  GAME._initUI({
    top:$('topbar'), msg:$('msg'), choices:$('choices'), verbs:$('verbs'),
    inv:$('inv'), overlay:$('overlay'), room:$('room'), score:$('score'),
  });
  GAME._setCursorEl($('cursorlabel'));

  $('startbtn').addEventListener('click', ()=>{
    $('boot').style.display='none';
    GAME.sfx('door');
    GAME.start('room_red');     // first scene
  });
  // allow Enter on boot
  window.addEventListener('keydown',(e)=>{
    if($('boot').style.display!=='none' && (e.key==='Enter'||e.key===' ')){ $('startbtn').click(); }
  });
})();
