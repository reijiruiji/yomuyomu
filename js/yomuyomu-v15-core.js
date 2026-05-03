var GG = window.YOMUYOMU_V15_GG;
var GG_N = window.YOMUYOMU_V15_GG_N;
window.GG = GG;

var RD=new Date(2025,0,1),RRK=0,RBR=2,RC60=2;
var RKN=['先勝','友引','先負','仏滅','大安','赤口'];
var ICH={1:[1,6],2:[2,7],3:[0,3],4:[2,7],5:[4,9],6:[0,3],7:[1,6],8:[2,7],9:[0,3],10:[6,9],11:[2,7],12:[0,3]};
var TEN={'2025-03-14':1,'2025-05-29':1,'2025-08-11':1,'2025-12-25':1,'2026-03-09':1,'2026-05-24':1,'2026-10-05':1,'2026-12-20':1};
var DOW=['日','月','火','水','木','金','土'];
function ddiff(d){return Math.round((d-RD)/86400000);}
function dayI(date){
  var diff=ddiff(date),mon=date.getMonth()+1;
  var br=((RBR+diff)%12+12)%12,c60=((RC60+diff)%60+60)%60,rk=((RRK+diff)%6+6)%6;
  return{rk:rk,rky:RKN[rk],taian:rk===4,ich:(ICH[mon]||[]).indexOf(br)>=0,tora:br===2,tsuchi:c60===5,tensha:!!TEN[date.toISOString().split('T')[0]]};
}
function getMult(i){var m=1;if(i.taian)m*=2;if(i.ich)m*=2;if(i.tora)m*=1.5;if(i.tsuchi)m*=1.5;if(i.tensha)m*=3;return m;}
function banItems(i){var a=[];if(i.tensha)a.push({t:'天赦日 功徳×3',c:'tensha'});if(i.ich)a.push({t:'一粒万倍日 功徳×2',c:'ichiryu'});if(i.tsuchi)a.push({t:'己巳の日 功徳×1.5',c:'tsuchi'});if(i.tora)a.push({t:'寅の日 功徳×1.5',c:'tora'});return a;}
function dayBadges(i){var b=[];if(i.tensha)b.push({t:'天赦',bg:'#c2185b'});if(i.ich)b.push({t:'一粒',bg:'hsl(var(--h),65%,42%)'});if(i.tsuchi)b.push({t:'己巳',bg:'#0277bd'});if(i.tora)b.push({t:'寅',bg:'#e65100'});return b;}

var UK='yomy_v14',LBK='yomy_lb_v14';
var st={
  userName:'',daily:{},totalChants:0,sessionCount:0,
  tab:'chant',calView:'heat',calYear:new Date().getFullYear(),calMonth:new Date().getMonth(),
  hue:35,dark:false,sensitivity:8,fontPref:'kanji',dailyValue:5000,gIdx:0,gCounts:{},
  meritBank:0,
  gongyoUnlocked:{}
};
var actx=null,rhythmInt=null,rhythmBeat=0;
var gcAnimating=false,gcCurReal=0;
var readLineIdx=0,readLines=[];
var CARD_W=155, STEP=118;

function v15Root(){return document.querySelector('#screen-practice .yomy-v15-app');}

// ══════════════════════════════════════════════════════════
//  ユーティリティ
// ══════════════════════════════════════════════════════════
function dss(d){return d.toISOString().split('T')[0];}
function today(){return dss(new Date());}
function fmt(n){return Number(n).toLocaleString('ja-JP',{maximumFractionDigits:1});}
function lsG(k){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}}
function lsS(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}
  if(k===UK&&typeof StorageManager!=='undefined'){
    queueMicrotask(function(){syncStToStorageManager();});
  }
}
function syncStToStorageManager(){
  if(typeof StorageManager==='undefined')return;
  StorageManager.getUserData().then(function(u){
    u.v15=JSON.parse(JSON.stringify(st));
    u.name=st.userName||u.name||'ゲスト';
    return StorageManager.saveUserData(u);
  }).catch(function(){});
}
function hydrateStFromStorageManager(cb){
  if(typeof StorageManager==='undefined'){cb();return;}
  StorageManager.getUserData().then(function(u){
    if(u.v15&&typeof u.v15==='object'){Object.assign(st,u.v15);}
    else{
      st.daily={};st.totalChants=0;
      (u.sessions||[]).forEach(function(s){
        var d=(s.date||'').split('T')[0],c=s.count||0;
        st.daily[d]=(st.daily[d]||0)+c;st.totalChants+=c;
      });
      var td=today();st.sessionCount=st.daily[td]||0;
      var nm=u.name&&String(u.name).trim();
      if(nm&&nm!=='ゲスト')st.userName=nm;
    }
    if(!Number.isFinite(st.meritBank)||st.meritBank<0)st.meritBank=st.totalChants||0;
    if(!st.gongyoUnlocked||typeof st.gongyoUnlocked!=='object')st.gongyoUnlocked={};
    cb();
  }).catch(function(){cb();});
}

var BASE_GONGYO_UNLOCKED={zange:1,eko:1,h2:1,h16a:1,h16b:1};
function isGongyoUnlocked(id){
  if(BASE_GONGYO_UNLOCKED[id])return true;
  return !!(st.gongyoUnlocked&&st.gongyoUnlocked[id]);
}
function gongyoUnlockCost(id,idx){
  if(BASE_GONGYO_UNLOCKED[id])return 0;
  var base=40;
  var step=10;
  return base + Math.floor((idx||0)/3)*step;
}
function tryUnlockGongyo(id,idx){
  var cost=gongyoUnlockCost(id,idx);
  if(cost<=0){st.gongyoUnlocked[id]=true;lsS(UK,st);return true;}
  if(st.meritBank<cost){
    alert('功徳（使用枠）が足りません。\n必要: '+cost+' / 現在: '+st.meritBank+'\n（唱えると増えます）');
    return false;
  }
  if(!confirm('「'+(GG[idx]&&GG[idx].t?GG[idx].t:id)+'」を解放しますか？\n功徳 '+cost+' を使用します。'))return false;
  st.meritBank-=cost;
  if(st.meritBank<0)st.meritBank=0;
  st.gongyoUnlocked[id]=true;
  lsS(UK,st);
  updateChantUI();
  buildCarousel();
  return true;
}

// ══════════════════════════════════════════════════════════
//  チュートリアル
// ══════════════════════════════════════════════════════════
var tutIdx=1;
function swTut(to){
  var cur=document.getElementById('t'+tutIdx);if(!cur)return;
  var nxt=document.getElementById('t'+to);
  if(nxt){nxt.classList.remove('hidden','gone');nxt.style.opacity='0';}
  cur.style.opacity='0';
  setTimeout(function(){
    cur.classList.add('hidden');cur.style.opacity='';tutIdx=to;
    if(nxt){setTimeout(function(){nxt.style.opacity='';nxt.style.transition='opacity .4s';},20);}
  },380);
}
function animTitle(){
  var chars='よむよむお題目'.split('');var w=document.getElementById('tutTitle');w.innerHTML='';
  chars.forEach(function(c,i){var s=document.createElement('span');s.className='tut-char';s.textContent=c;s.style.animationDelay=(i*.2)+'s';w.appendChild(s);});
  var total=chars.length*200+500;
  setTimeout(function(){var h=document.getElementById('t1hint');h.style.opacity='1';h.style.transition='opacity .5s';},total);
  setTimeout(function(){animWorries();},total+1600);
}
function animWorries(){
  swTut(2);
  setTimeout(function(){
    document.getElementById('w0').classList.add('show');
    setTimeout(function(){document.getElementById('w1').classList.add('show');},400);
    setTimeout(function(){document.getElementById('w2').classList.add('show');},850);
    setTimeout(function(){document.getElementById('w3').classList.add('show');},1300);
    setTimeout(function(){document.getElementById('wS').classList.add('show');},1800);
    setTimeout(function(){swTut(3);},3200);
  },450);
}
['t1','t2'].forEach(function(id){
  document.getElementById(id).addEventListener('click',function(){
    if(tutIdx===1)animWorries();else if(tutIdx===2)swTut(3);
  });
});
document.getElementById('tutNameBtn').addEventListener('click',function(){
  var n=document.getElementById('tutName').value.trim();if(!n){document.getElementById('tutName').focus();return;}
  st.userName=n;
  document.getElementById('tutInpWrap').classList.add('vanish');
  setTimeout(function(){document.getElementById('tutGreet').textContent=n+'さんとお呼びしますね。';swTut(4);},480);
});
document.getElementById('tutName').addEventListener('keydown',function(e){if(e.key==='Enter')document.getElementById('tutNameBtn').click();});
document.querySelectorAll('.font-opt').forEach(function(b){
  b.addEventListener('click',function(){
    document.querySelectorAll('.font-opt').forEach(function(x){x.classList.remove('sel');});
    b.classList.add('sel');st.fontPref=b.getAttribute('data-f');
  });
});
document.getElementById('btn-tut-after-font').addEventListener('click',function(){
  if(!document.querySelector('.font-opt.sel')){
    var fk=document.querySelector('.font-opt[data-f="kanji"]');
    if(fk){fk.classList.add('sel');st.fontPref='kanji';}
  }
  swTut(5);
});
document.getElementById('btn-tut-step5-next').addEventListener('click',function(){swTut(6);});
document.getElementById('btn-tut-step6-next').addEventListener('click',function(){swTut(7);});
document.getElementById('tut-add-home-done')?.addEventListener('change',function(){
  var b=document.getElementById('btn-tut-finish-all');
  if(!b)return;
  b.disabled=!this.checked;
  b.setAttribute('aria-disabled',String(!this.checked));
});
document.getElementById('btn-tut-finish-all').addEventListener('click',function(){
  st.tutorialCompleted=true;
  lsS(UK,st);
  for(var i=1;i<=7;i++){var s=document.getElementById('t'+i);if(s)s.classList.add('gone');}
  launchApp();
  syncStToStorageManager();
});

// ══════════════════════════════════════════════════════════
//  ヘルプシステム（軽量版・選択的ロード）
// ══════════════════════════════════════════════════════════
var HELP_CONTENT={
  'chant':{title:'お題目について',body:'「南無妙法蓮華経」の読誦回数をカウントします。\n音声認識またはタップで数えられます。'},
  'gongyou':{title:'勤行の操作方法',body:'← → ボタンまたはスワイプでお経を選びます。\nルーレット機能も使えます。'},
  'kichijitsu':{title:'吉日の功徳倍率',body:'天赦日 功徳×3\n一粒万倍日 功徳×2\n大安 功徳×2\n寅の日・己巳の日 功徳×1.5'}
};
function showHelp(key){
  var h=HELP_CONTENT[key]||{title:'ヘルプ',body:''};
  document.getElementById('helpTitle').textContent=h.title;
  document.getElementById('helpBody').innerHTML=h.body.replace(/\n/g,'<br>');
  document.getElementById('helpOverlay').classList.add('show');
}
document.getElementById('helpOverlay').addEventListener('click',function(e){if(e.target===this)this.classList.remove('show');});

// ══════════════════════════════════════════════════════════
//  チュートリアルウォークスルー（軽量版）
// ══════════════════════════════════════════════════════════
var TUT_STEPS=[
  {title:'お題目タブ',body:'ここで「南無妙法蓮華経」を読んだ回数をカウントします。'},
  {title:'勤行タブ',body:'法華経の各品を読めます。吉日には特別なバッジが表示され、功徳が倍増します。'},
  {title:'カレンダータブ',body:'日別の読誦記録を確認できます。'},
  {title:'はじまりました',body:'これからよろしくお願いいたします。🪷'}
];
var tutWalkStep=0;
function startTutWalk(){
  tutWalkStep=0;
  document.getElementById('tutWalkOverlay').style.display='block';
  showTutStep(0);
}
function showTutStep(idx){
  var step=TUT_STEPS[idx];
  document.getElementById('twTitle').textContent=step.title;
  document.getElementById('twBody').textContent=step.body;
  var nextBtn=document.getElementById('twNext');
  nextBtn.textContent=idx===TUT_STEPS.length-1?'始める ✨':'次へ →';
}
function nextTutStep(){
  tutWalkStep++;
  if(tutWalkStep>=TUT_STEPS.length){endTutWalk();return;}
  showTutStep(tutWalkStep);
}
function endTutWalk(){
  document.getElementById('tutWalkOverlay').style.display='none';
}

// ══════════════════════════════════════════════════════════
//  お布施（DANA）機能
// ══════════════════════════════════════════════════════════
function openDana(){document.getElementById('danaOverlay').classList.add('show');}
function closeDana(){document.getElementById('danaOverlay').classList.remove('show');}
document.getElementById('danaOverlay').addEventListener('click',function(e){if(e.target===this)closeDana();});
['D','W','M'].forEach(function(x){
  var b=document.getElementById('dfreq'+x);
  if(b)b.addEventListener('click',function(){st.danaFreq={D:'day',W:'week',M:'month'}[x];syncFreqBtns();lsS(UK,st);});
});
function syncFreqBtns(){
  ['D','W','M'].forEach(function(x){
    var b=document.getElementById('dfreq'+x);
    if(b)b.classList.toggle('on',st.danaFreq==={D:'day',W:'week',M:'month'}[x]);
  });
}
document.getElementById('danaSet').addEventListener('click',function(){
  var v=parseFloat(document.getElementById('danaIn').value);if(isNaN(v)||v<0)return;
  st.donation=v;document.getElementById('danaIn').value='';lsS(UK,st);closeDana();
});
if(!st.danaFreq)st.danaFreq='day';

// ══════════════════════════════════════════════════════════
//  初期化
// ══════════════════════════════════════════════════════════
function init(){
  hydrateStFromStorageManager(function(){
    var saved=lsG(UK);
    if(saved&&saved.userName){Object.assign(st,saved);normalizeV15Tab();}
    window.st = st;
    var ready=st.userName&&String(st.userName).trim().length>0;
    if(ready){
      for(var i=1;i<=7;i++){var s=document.getElementById('t'+i);if(s)s.classList.add('gone');}
      applyHue(st.hue);applyMode(st.dark);syncSliders();
      launchApp();
      syncStToStorageManager();
    }else{
      animTitle();
    }
  });
}
function normalizeV15Tab(){var ok={chant:1,gongyou:1,cal:1,awakening:1,stats:1,analysis:1,settings:1};if(!ok[st.tab])st.tab='chant';}
function syncAppHdrHint(){
  var ms=document.getElementById('menuSub');
  if(ms)ms.textContent='ヘッダーをタップでメニュー（テーマ・布施・名前）';
}

window.__yomyApplyProfileName=function(n){
  var v=n&&String(n).trim();if(!v)return;
  st.userName=v;lsS(UK,st);
  var mn=document.getElementById('menuName');if(mn)mn.textContent=v;
  updateChantUI();
};

function launchApp(){
  var app=v15Root();if(!app)return;
  normalizeV15Tab();
  app.style.display='block';app.classList.add('vis');
  document.getElementById('menuName').textContent=st.userName;
  syncAppHdrHint();
  buildCarousel();updateChantUI();renderBanner();actTab(st.tab||'chant');
}


// ══════════════════════════════════════════════════════════
//  テーマ
// ══════════════════════════════════════════════════════════
function applyHue(h){st.hue=h;var shell=document.querySelector('#screen-practice .yomy-v15-shell');if(shell)shell.style.setProperty('--h',h);document.documentElement.style.setProperty('--h',h);}
function applyMode(d){st.dark=d;document.querySelector('#screen-practice .yomy-v15-shell')?.classList.toggle('dark',d);document.getElementById('modeBtn').textContent=d?'☀️ ライト':'🌙 ダーク';}
function togDark(){applyMode(!st.dark);lsS(UK,st);}
function togMenu(){document.getElementById('mpanel').classList.toggle('open');document.getElementById('mover').classList.toggle('open');}
function changeName(){var v=document.getElementById('nameChange').value.trim();if(!v)return;st.userName=v;lsS(UK,st);document.getElementById('menuName').textContent=v;updateChantUI();togMenu();}
function resetAll(){if(!confirm('全データを削除しますか？'))return;localStorage.removeItem(UK);localStorage.removeItem(LBK);location.reload();}
function syncSliders(){
  document.getElementById('hueSlider').value=st.hue;
  document.getElementById('sensR').value=st.sensitivity;document.getElementById('sensV').textContent=st.sensitivity;
  document.getElementById('dvR').value=st.dailyValue;document.getElementById('dvV').textContent='¥'+Math.round(st.dailyValue/1000)+'k';
}
function syncSens(v){st.sensitivity=v;document.getElementById('sensR').value=v;document.getElementById('sensV').textContent=v;lsS(UK,st);}
document.getElementById('hueSlider').addEventListener('input',function(e){applyHue(+e.target.value);lsS(UK,st);if(st.tab==='cal')renderCal();});
document.getElementById('sensR').addEventListener('input',function(e){syncSens(+e.target.value);});
document.getElementById('dvR').addEventListener('input',function(e){st.dailyValue=+e.target.value;document.getElementById('dvV').textContent='¥'+Math.round(st.dailyValue/1000)+'k';updateChantUI();lsS(UK,st);});

// ══════════════════════════════════════════════════════════
//  お題目カウント
// ══════════════════════════════════════════════════════════
function calcMerit(c,dv,m){return Math.round((Number(c)||0));}
function renderBanner(){
  var info=dayI(new Date()),items=banItems(info);
  var el=document.getElementById('todayBanner');
  if(!items.length){el.innerHTML='';el.style.display='none';}
  else{el.className='banner ban-'+items[0].c;el.innerHTML='✨ '+items.map(function(i){return i.t;}).join(' / ');el.style.display='flex';}
  var m=getMult(info),pill=document.getElementById('multPill');
  if(m>1){pill.style.display='block';pill.innerHTML='<div class="mult-pill">×'+m.toFixed(1)+' 吉日倍率適用中</div>';}
  else pill.style.display='none';
}
function updateChantUI(){
  var merit=calcMerit(st.totalChants,st.dailyValue,1);
  document.getElementById('sesNum').textContent=st.sessionCount;
  document.getElementById('cumul').textContent='累計: '+st.totalChants+'回';
  document.getElementById('meritV').textContent=fmt(merit);
  document.getElementById('dvDisp').textContent='¥'+fmt(st.dailyValue);
  document.getElementById('dvV').textContent='¥'+Math.round(st.dailyValue/1000)+'k';
  var hi=document.getElementById('hdrInfo');if(hi)hi.textContent=st.userName+' · 功徳（回） '+fmt(merit);
}
function trigFlash(){var c=document.getElementById('countCard');c.classList.add('flashing');setTimeout(function(){c.classList.remove('flashing');},500);try{navigator.vibrate&&navigator.vibrate([80]);}catch(e){}}
function spawnP(){['🌸','✨','🪷'].forEach(function(e){var p=document.createElement('div');p.className='particle';p.textContent=e;p.style.left=(20+Math.random()*60)+'%';p.style.top=(20+Math.random()*40)+'%';document.body.appendChild(p);setTimeout(function(){p.remove();},1200);});}
function addChants(n){
  if(n<=0)return;var t=today();
  st.daily[t]=(st.daily[t]||0)+n;st.totalChants+=n;st.sessionCount+=n;
  st.meritBank=(Number(st.meritBank)||0)+n;
  trigFlash();mokuS();rhythm(st.sessionCount);
  if(st.sessionCount%10===0){spawnP();accentS();}
  updateChantUI();lsS(UK,st);persistLb();
  if(st.tab==='cal')renderCal();
  var merit=Math.round(n);
  if(typeof StorageManager!=='undefined'){
    StorageManager.mergeSessionDay(t,{count:n,duration:0,merit:merit,count_chanting:n,count_gongyo:0,merit_chanting:merit,merit_gongyo:0});
  }
  if(typeof updateDashboard==='function')queueMicrotask(function(){updateDashboard();});
  if(typeof updateCharts==='function')queueMicrotask(function(){updateCharts();});
  if(typeof window.schedulePostPracticeReflection==='function')queueMicrotask(function(){window.schedulePostPracticeReflection();});
}
function persistLb(){
  var merit=calcMerit(st.totalChants,st.dailyValue,1);
  var lb=lsG(LBK)||[];var idx=lb.findIndex(function(e){return e.name===st.userName;});
  var entry={name:st.userName,merit:merit,chants:st.totalChants};
  if(idx>=0)lb[idx]=entry;else lb.push(entry);
  lb.sort(function(a,b){return b.merit-a.merit;});lsS(LBK,lb.slice(0,50));
}

// ══════════════════════════════════════════════════════════
//  音
// ══════════════════════════════════════════════════════════
function getAx(){if(!actx)try{actx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return actx;}
function mokuS(){var c=getAx();if(!c)return;if(c.state==='suspended')c.resume();var now=c.currentTime,o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=300;f.Q.value=8;o.type='sine';o.frequency.setValueAtTime(280,now);o.frequency.exponentialRampToValueAtTime(140,now+.12);o.connect(f);f.connect(g);g.connect(c.destination);g.gain.setValueAtTime(.45,now);g.gain.exponentialRampToValueAtTime(.001,now+.28);o.start(now);o.stop(now+.3);}
function accentS(){var c=getAx();if(!c)return;var now=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(520,now);o.frequency.exponentialRampToValueAtTime(380,now+.4);o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(.18,now);g.gain.exponentialRampToValueAtTime(.001,now+.5);o.start(now);o.stop(now+.5);}
// づん！用の重低音
function thumkS(freq,vol){
  var c=getAx();if(!c)return;if(c.state==='suspended')c.resume();
  var now=c.currentTime,f=freq||140,v=vol||0.75;
  var o=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();
  lp.type='lowpass';lp.frequency.value=520;lp.Q.value=4;
  o.type='sine';o.frequency.setValueAtTime(f,now);o.frequency.exponentialRampToValueAtTime(f*0.38,now+.22);
  o.connect(lp);lp.connect(g);g.connect(c.destination);
  g.gain.setValueAtTime(v,now);g.gain.exponentialRampToValueAtTime(.001,now+.55);
  o.start(now);o.stop(now+.6);
}
function rhythm(n){if(rhythmInt){clearInterval(rhythmInt);rhythmInt=null;}if(n<5)return;var bpm=n<15?50:n<30?70:n<50?90:120,pat=n<15?[1,0,0,0]:n<30?[1,0,1,0]:n<50?[1,0,1,1]:[1,1,1,1],ms=Math.round(60000/bpm/2);rhythmBeat=0;rhythmInt=setInterval(function(){if(pat[rhythmBeat%pat.length])mokuS();rhythmBeat++;},ms);}

// ══════════════════════════════════════════════════════════
//  太鼓の達人スタイル カルーセル（安定版）
// ══════════════════════════════════════════════════════════
var _gcSX=0,_gcSY=0,rouletteRunning=false;
var stageW=0; // キャッシュした幅

function buildCarousel(){
  var stage=document.getElementById('gcStage');
  stage.innerHTML='';
  // 幅を一度だけ計測してキャッシュ（ルーレット中に再計測しない）
  stageW=stage.offsetWidth||document.getElementById('gcWrap').offsetWidth||300;
  CARD_W=Math.min(Math.round(stageW*0.42),160);
  STEP=Math.round(CARD_W*0.76);

  GG.forEach(function(g,i){
    var card=document.createElement('div');
    card.className='gc-card2';
    card.id='gc'+i;
    card.dataset.idx=i;
    var hasText=g.lines&&g.lines.length>0;
    var unlocked=isGongyoUnlocked(g.id);
    var cost=gongyoUnlockCost(g.id,i);
    card.innerHTML=
      '<div class="gc-num">'+(i+1)+'/'+GG_N+'</div>'+
      '<div class="gc-title">'+g.t+'</div>'+
      '<div class="gc-sub">'+g.s+'</div>'+
      (unlocked && hasText?'<div class="gc-badge">📖 読める</div>':'')+
      (!unlocked?'<div class="gc-badge" style="background:rgba(0,0,0,.35);border:1px solid var(--bo)">🔒 未解放</div>':'')+
      '<div class="gc-desc">'+g.d+'</div>';
    if(!unlocked){
      card.innerHTML +=
        '<div class="gc-desc" style="margin-top:6px;color:var(--mu)">'+
        (cost<=0?'最初から使えます':'解放: 功徳 '+cost+' を使用（残り '+(st.meritBank||0)+'）')+
        '</div>'+
        '<button class="btn-s" type="button" style="margin-top:8px;width:100%;padding:8px" data-unlock="1">解放する</button>';
    }
    // カード幅を固定セット（CSSのwidthより優先）
    card.style.width=CARD_W+'px';
    card.addEventListener('click',function(){
      if(!isGongyoUnlocked(g.id)){
        tryUnlockGongyo(g.id,i);
        return;
      }
      var idx=parseInt(card.dataset.idx);
      if(idx===gcCurReal)return;
      var n=GG_N;
      var raw=idx-gcCurReal;while(raw>n/2)raw-=n;while(raw<-n/2)raw+=n;
      if(raw>0)for(var k=0;k<raw;k++)gcStep(1);
      else for(var k=0;k<-raw;k++)gcStep(-1);
    });
    card.querySelector('[data-unlock="1"]')?.addEventListener('click',function(ev){
      ev.stopPropagation();
      tryUnlockGongyo(g.id,i);
    });
    stage.appendChild(card);
  });

  // タッチスワイプ
  var wrap=document.getElementById('gcWrap');
  // 既存リスナーが重複しないよう、HTMLにdata-initを使う
  if(!wrap.dataset.init){
    wrap.dataset.init='1';
    wrap.addEventListener('touchstart',function(e){_gcSX=e.touches[0].clientX;_gcSY=e.touches[0].clientY;},{passive:true});
    wrap.addEventListener('touchend',function(e){
      var dx=e.changedTouches[0].clientX-_gcSX,dy=e.changedTouches[0].clientY-_gcSY;
      if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>30)gcStep(dx<0?1:-1);
    },{passive:true});
    var _mx=0;
    wrap.addEventListener('mousedown',function(e){_mx=e.clientX;});
    wrap.addEventListener('mouseup',function(e){var dx=e.clientX-_mx;if(Math.abs(dx)>30)gcStep(dx<0?1:-1);});
  }

  posCards(false);
}

function posCards(anim){
  var n=GG_N;
  var W=stageW; // キャッシュを使う（DOM読み取りなし）
  var CW=CARD_W;
  var centerX=W/2; // ステージ中央

  var cards=document.getElementById('gcStage').querySelectorAll('.gc-card2');
  var TRANS_MOVE='left '+( anim?'.32s':'0s')+' cubic-bezier(.4,0,.2,1)';
  var TRANS_SCALE='transform '+( anim?'.32s':'0s')+' cubic-bezier(.4,0,.2,1)';
  var TRANS_OPAC='opacity '+( anim?'.28s':'0s');

  cards.forEach(function(card,i){
    var raw=i-gcCurReal;
    while(raw>n/2)raw-=n;
    while(raw<-n/2)raw+=n;
    var dist=Math.abs(raw);
    var visible=dist<=2;

    var scale=dist===0?1:dist===1?0.82:0.65;
    var opacity=dist===0?1:dist===1?0.66:0.33;
    var cardCenterX=centerX+raw*STEP;
    var leftPx=cardCenterX-CW/2;

    card.style.transition=TRANS_MOVE+','+TRANS_SCALE+','+TRANS_OPAC+',border-color .15s,box-shadow .15s';
    card.style.left=leftPx+'px';
    // translateY(-50%) で常にステージ高さの50%に垂直中央
    card.style.transform='translateY(-50%) scale('+scale+')';
    card.style.opacity=visible?opacity:0;
    card.style.pointerEvents=visible?'all':'none';
    card.style.zIndex=10-dist;
    card.classList.toggle('active',i===gcCurReal);
    card.style.boxShadow=i===gcCurReal?'0 6px 24px var(--ag)':'none';
    card.style.borderColor=i===gcCurReal?'var(--boa)':'var(--bo)';
    // ステージの height は絶対に変更しない
  });
  updateGcUI();
}

function gcStep(dir){
  if(gcAnimating)return;gcAnimating=true;
  mokuS();
  gcCurReal=(gcCurReal+dir+GG_N)%GG_N;
  st.gIdx=gcCurReal;
  posCards(true);lsS(UK,st);
  setTimeout(function(){gcAnimating=false;},340);
}
function gotoIdx(ri){gcCurReal=ri;st.gIdx=ri;posCards(false);lsS(UK,st);}
function updateGcUI(){
  var g=GG[gcCurReal],cnt=st.gCounts[g.id]||0;
  document.getElementById('gcCounter').textContent=(gcCurReal+1)+' / '+GG_N;
  document.getElementById('gcProgress').textContent=cnt+'回 唱えました';
  var rb=document.getElementById('gcReadBtn');
  var hasText=g.lines&&g.lines.length>0;
  rb.style.opacity=hasText?'1':'0.45';
  rb.title=hasText?'経文を表示':'（テキスト準備中）';
}

// ══════════════════════════════════════════════════════════
//  読経オーバーレイ
// ══════════════════════════════════════════════════════════
function openReading(){
  var g=GG[gcCurReal];
  if(!isGongyoUnlocked(g.id)){
    tryUnlockGongyo(g.id,gcCurReal);
    return;
  }
  if(!g.lines||!g.lines.length){
    alert('📖 このお経のテキストは現在準備中です。\n「+1 唱えた」ボタンで回数を記録してください。');
    return;
  }
  readLines=g.lines;readLineIdx=0;
  document.getElementById('readTitle').textContent=g.t;

  var W=window.innerWidth;
  var fp=st.fontPref||'kanji';

  // ページHTML
  var pHTML='';
  readLines.forEach(function(l){
    var kanji=(l[0]||'').replace(/\n/g,'<br>');
    var yomi =(l[1]||'').replace(/\n/g,'<br>');
    var roma =(l[2]||'').replace(/\n/g,'<br>');
    var imi  =(l[3]||'').replace(/\n/g,'<br>');
    var main=fp==='kanji'?kanji:fp==='hira'?yomi:roma;
    var sub =fp==='kanji'?yomi:fp==='hira'?kanji:kanji;
    var sub2=fp==='kanji'?roma:fp==='hira'?roma:yomi;
    pHTML+='<div class="read-page" style="width:'+W+'px;min-width:'+W+'px">';
    if(main)pHTML+='<div class="rk">'+main+'</div>';
    if(sub&&sub!==main)pHTML+='<div class="rh">'+sub+'</div>';
    if(sub2&&sub2!==main&&sub2!==sub)pHTML+='<div class="rr">'+sub2+'</div>';
    if(imi)pHTML+='<div class="rm2">'+imi+'</div>';
    pHTML+='</div>';
  });
  document.getElementById('readPages').innerHTML=pHTML;
  document.getElementById('readPages').style.display='flex';
  document.getElementById('readPages').style.transition='transform .35s cubic-bezier(.4,0,.2,1)';

  // ドット
  var dots=document.getElementById('pageDots');
  dots.innerHTML=readLines.map(function(_,i){return '<div class="page-dot'+(i===0?' on':'')+'"></div>';}).join('');

  // ナビ
  document.getElementById('readNav').innerHTML=
    '<button class="btn-big" onclick="readPrev()" style="margin-bottom:0">← 前の節</button>'+
    '<button class="btn-big" onclick="readNext()" style="margin-bottom:0">次の節 →</button>';

  // スワイプ
  var body=document.getElementById('readBody');var _bsx=0,_bsy=0;
  body.addEventListener('touchstart',function(e){_bsx=e.touches[0].clientX;_bsy=e.touches[0].clientY;},{passive:true});
  body.addEventListener('touchend',function(e){
    var dx=e.changedTouches[0].clientX-_bsx,dy=e.changedTouches[0].clientY-_bsy;
    if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>35){if(dx<0)readNext();else readPrev();}
  },{passive:true});

  gotoPage(0);
  document.getElementById('readingOverlay').classList.add('show');
}

function gotoPage(idx){
  if(idx<0)idx=0;if(idx>=readLines.length)idx=readLines.length-1;
  readLineIdx=idx;
  var pages=document.getElementById('readPages');
  if(pages)pages.style.transform='translateX('+(-(idx*window.innerWidth))+'px)';
  document.getElementById('readProg').style.width=((idx+1)/readLines.length*100)+'%';
  document.getElementById('readPgn').textContent=(idx+1)+'/'+readLines.length;
  document.querySelectorAll('.page-dot').forEach(function(d,i){d.classList.toggle('on',i===idx);});
}
function readNext(){
  if(readLineIdx>=readLines.length-1){
    closeReading();
    var g=GG[gcCurReal];st.gCounts[g.id]=(st.gCounts[g.id]||0)+1;
    addChants(1);lsS(UK,st);updateGcUI();
    spawnP();accentS();
    setTimeout(function(){alert('🪷 読経完了！功徳 +1 が加算されました。\n南無妙法蓮華経');},200);
    return;
  }
  gotoPage(readLineIdx+1);
}
function readPrev(){gotoPage(readLineIdx-1);}
function closeReading(){document.getElementById('readingOverlay').classList.remove('show');}

// ══════════════════════════════════════════════════════════
//  ヒント
// ══════════════════════════════════════════════════════════
var HINTS={
  chant:{icon:'🥁',title:'お題目（唱える回数）',body:
    '<p><b>「南無妙法蓮華経」と唱えた後、「カウント」ボタンを押しましょう</p>'+
    '<p><b>「カウント」ボタンを押すと太鼓が鳴ります。</b></p>'+
    '<ul><li>LET`S お題目！</li>'+
    '<li>リズミカルにお題目を唱えましょう</li>'+
    '<li>合いの手をいれるように カウントをしましょう</li></ul>'+
    '<p><b>もしかしたら…？</b>太鼓の音を変えられる方法があるというウワサが…？</p>'+
    '<div class="info-formula">お題目１回につき功徳は１増えます。毎日１００回を目指しましょう</div>'},
  gongyou:{icon:'📖',title:'勤行（お経）',body:
    '<p><b>はじめての方へ：</b>まずは「方便品第二」「如来壽量品第十六」「懺悔文」「廻向文」だけ入っています。</p>'+
    '<p><b>アンロック：</b>唱えた回数（功徳）を使って、読めるお経を増やせます。</p>'+
    '<p><b>操作：</b>左右スワイプ or 矢印でお経を選びます。カードをタップすると移動します。</p>'+
    '<p><b>📖 読める：</b>「読む」ボタンで表示。最後まで読むと +1 が記録されます。</p>'+
    '<p><b>基本順序：</b>三宝礼 → 懺悔文 → 開経偈 → 方便品第二 → 壽量品第十六 → 廻向文</p>'+
    '<p>🎰 ルーレットでランダム選択もできます。</p>'},
  cal:{icon:'📅',title:'読経カレンダーの見方',body:
    '<p>ヒートマップ：過去16週の記録を色の濃さで確認。<br>月カレンダー：六曜・吉日バッジ付きで1日ごとの記録を表示。</p>'+
    '<ul><li>🔴 天赦日：功徳×3（最強の吉日）</li>'+
    '<li>🟢 一粒万倍日：功徳×2</li>'+
    '<li>🔵 己巳の日：功徳×1.5</li>'+
    '<li>🟠 寅の日：功徳×1.5</li></ul>'+
    '<p>複数重なると掛け算で増幅します。</p>'},
  rank:{icon:'🏆',title:'功徳ランキングについて',body:
    '<p>この端末のローカルランキングです。功徳スコアが多い順に並びます。</p>'+
    '<div class="info-formula">功徳 = 累計回数 × (１日の価値 ÷ 1000) × 吉日倍率</div>'+
    '<p>１日の価値はハンバーガーメニューで設定。吉日に唱えることで功徳が増幅します。継続が最大の功徳です。🌸</p>'}
};
function showHint(tab){
  var h=HINTS[tab];if(!h)return;
  document.getElementById('hintIcon').textContent=h.icon;
  document.getElementById('hintTitle').textContent=h.title;
  document.getElementById('hintBody').innerHTML=h.body;
  document.getElementById('hintOverlay').classList.add('show');
}

// ══════════════════════════════════════════════════════════
//  カレンダー
// ══════════════════════════════════════════════════════════
function hClr(cnt,mx){var h=st.hue;if(!cnt)return{bg:'transparent',bd:'hsl('+h+',22%,'+(st.dark?'18':'84')+'%)'};var r=cnt/mx,L=st.dark?(20+r*45):(75-r*48),S=25+r*50;return{bg:'hsl('+h+','+S+'%,'+L+'%)',bd:'hsl('+h+','+(S+8)+'%,'+(L-8)+'%)'};}
function buildHeatmap(){
  var con=document.getElementById('heatmap');
  var sd=new Date();sd.setDate(sd.getDate()-16*7+1);while(sd.getDay()!==0)sd.setDate(sd.getDate()-1);
  var vals=Object.values(st.daily).filter(function(v){return v>0;});var mx=vals.length?Math.max.apply(null,vals):1;
  var h=st.hue;function lg(id,s,dl,dl2){var e=document.getElementById(id);if(e)e.style.background='hsl('+h+','+s+'%,'+(st.dark?dl:dl2)+'%)';}
  lg('lg1',30,55,72);lg('lg2',78,28,36);con.innerHTML='';var cur=new Date(sd);
  for(var w=0;w<16;w++){var col=document.createElement('div');col.className='hc';for(var day=0;day<7;day++){var ds2=dss(cur),cnt=st.daily[ds2]||0,cl=hClr(cnt,mx),cell=document.createElement('div');cell.className='hcell';cell.style.background=cl.bg;cell.style.borderColor=cl.bd;cell.title=ds2+' '+cnt+'回';col.appendChild(cell);cur.setDate(cur.getDate()+1);}con.appendChild(col);}
}
function buildRecent(){
  var el=document.getElementById('recList');
  var entries=Object.entries(st.daily).sort(function(a,b){return b[0].localeCompare(a[0]);}).slice(0,14);
  if(!entries.length){el.innerHTML='<p style="font-size:12px;color:var(--di)">まだ記録がありません</p>';return;}
  el.innerHTML=entries.map(function(e){return '<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--bo);font-size:12px"><span style="color:var(--mu)">'+e[0]+'</span><span>'+e[1]+'回 <span style="color:var(--a);font-size:10px">功徳 '+fmt(calcMerit(e[1],st.dailyValue,1))+'</span></span></div>';}).join('');
}
function buildMonthly(){
  var y=st.calYear,m=st.calMonth,todDs=today();
  document.getElementById('calTitle').textContent=y+'年 '+(m+1)+'月';
  var grid=document.getElementById('calGrid');grid.innerHTML='';
  DOW.forEach(function(d,i){var el=document.createElement('div');el.className='cdow';if(i===0)el.style.color='rgba(211,47,47,.8)';if(i===6)el.style.color='rgba(21,101,192,.8)';el.textContent=d;grid.appendChild(el);});
  var firstDay=new Date(y,m,1).getDay(),daysIn=new Date(y,m+1,0).getDate();
  for(var i=0;i<firstDay;i++){var em=document.createElement('div');em.className='cday cem';grid.appendChild(em);}
  for(var d=1;d<=daysIn;d++){
    var date=new Date(y,m,d),ds2=dss(date),dow=date.getDay(),info=dayI(date),cnt=st.daily[ds2]||0,bdg=dayBadges(info);
    var cls='cday';if(dow===0)cls+=' csun';if(dow===6)cls+=' csat';if(ds2===todDs)cls+=' today';
    var cell=document.createElement('div');cell.className=cls;
    if(cnt>0){var op=Math.min(0.12+cnt/60*.5,.65),L=st.dark?45:55;cell.style.background='hsla('+st.hue+',55%,'+L+'%,'+op.toFixed(2)+')';cell.style.borderColor='hsla('+st.hue+',60%,'+L+'%,.4)';}
    cell.innerHTML='<div class="cdn">'+d+'</div><div class="crk'+(info.taian?' ta':'')+'">'+info.rky+'</div><div class="cbs">'+bdg.map(function(b){return '<span class="cb" style="background:'+b.bg+'">'+b.t+'</span>';}).join('')+'</div>';
    (function(ds3,c){cell.addEventListener('click',function(){if(!c&&ds3!==todDs)return;document.getElementById('popDate').textContent=ds3;document.getElementById('popCount').textContent=c;document.getElementById('dayPop').classList.add('show');});
    })(ds2,cnt);
    grid.appendChild(cell);
  }
}
function renderCal(){
  var h=st.calView==='heat';
  document.getElementById('vHeat').style.display=h?'block':'none';
  document.getElementById('vMon').style.display=h?'none':'block';
  document.getElementById('btnHeat').classList.toggle('on',h);
  document.getElementById('btnMon').classList.toggle('on',!h);
  if(h){buildHeatmap();buildRecent();}else buildMonthly();
}

// ══════════════════════════════════════════════════════════
//  ランキング（ローカル）
// ══════════════════════════════════════════════════════════
function buildLb(){
  var lb=lsG(LBK)||[],el=document.getElementById('lbList'),med=['🥇','🥈','🥉'];
  if(!el)return;
  if(!lb.length){el.innerHTML='<p style="font-size:12px;color:var(--di)">データなし</p>';return;}
  el.innerHTML=lb.map(function(e,i){var isMe=e.name===st.userName;return '<div class="re'+(isMe?' me':'')+'"><span style="min-width:22px;font-size:'+(i<3?'16':'11')+'px;color:'+(i<3?'var(--a)':'var(--di)')+'">'+( med[i]||i+1)+'</span><span style="flex:1">'+e.name+(isMe?' 👈':'')+'</span><div style="text-align:right"><div class="rm3">'+fmt(e.merit)+'</div><div style="font-size:10px;color:var(--di)">'+e.chants+'回</div></div></div>';}).join('');
  var info=dayI(new Date()),merit=calcMerit(st.totalChants,st.dailyValue,getMult(info));
  var myM=document.getElementById('myM'),myC=document.getElementById('myC');
  if(myM)myM.textContent=fmt(merit);
  if(myC)myC.textContent=st.totalChants;
}

// ══════════════════════════════════════════════════════════
//  タブ
// ══════════════════════════════════════════════════════════
function actTab(t){
  if(t==='rank')t='chant';
  var root=v15Root();if(!root)return;
  root.querySelectorAll('.tab').forEach(function(b){b.classList.remove('on');});
  root.querySelectorAll('.tc').forEach(function(c){c.classList.remove('on');});
  var btn=root.querySelector('[data-t="'+t+'"]');if(btn)btn.classList.add('on');
  var tc=document.getElementById('tc-'+t);if(tc)tc.classList.add('on');
  st.tab=t;lsS(UK,st);
}
(function bindV15Tabs(){
  var root=v15Root();if(!root)return;
  root.querySelectorAll('.tab').forEach(function(btn){
    btn.addEventListener('click',function(){
      var t=btn.getAttribute('data-t');actTab(t);
      if(t==='chant'){updateChantUI();renderBanner();}
      if(t==='gongyou'){buildCarousel();}
      if(t==='cal')renderCal();
      if(t==='stats'&&typeof updateCharts==='function')queueMicrotask(function(){updateCharts();});
    });
  });
})();

document.getElementById('appHdBar')?.addEventListener('keydown',function(ev){
  if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();togMenu();}
});

// ══════════════════════════════════════════════════════════
//  イベントリスナー
// ══════════════════════════════════════════════════════════
document.getElementById('manBtn').addEventListener('click',function(){addChants(1);});
document.getElementById('gcPrev').addEventListener('click',function(){gcStep(-1);});
document.getElementById('gcNext').addEventListener('click',function(){gcStep(1);});
document.getElementById('gcReadBtn').addEventListener('click',openReading);
document.getElementById('gcCount').addEventListener('click',function(){var g=GG[gcCurReal];st.gCounts[g.id]=(st.gCounts[g.id]||0)+1;addChants(1);lsS(UK,st);updateGcUI();});
document.getElementById('gcReset').addEventListener('click',function(){var g=GG[gcCurReal];st.gCounts[g.id]=0;lsS(UK,st);document.getElementById('gcProgress').textContent='0回';});
// ═══════════════════════════════════════════════════════
//  ルーレット機能（シンプル版）
// ═══════════════════════════════════════════════════════
function startRoulette(){
  if(st.isRoulette) return; // 実行中なら何もしない
  st.isRoulette = true;
  
  var btn = document.getElementById('rouletteBtn');
  btn.disabled = true;
  
  var duration = 2500; // 2.5秒間回る
  var startTime = Date.now();
  
  var timer = setInterval(function(){
    var elapsed = Date.now() - startTime;
    // 0から項目の数（GG.length）の間でランダムに選ぶ
    var randIdx = Math.floor(Math.random() * GG.length);
    st.gIdx = randIdx;
    gcCurReal = randIdx;
    buildCarousel(); // 表示を更新
    
    if(elapsed >= duration){
      clearInterval(timer);
      st.isRoulette = false;
      btn.disabled = false;
      lsS(UK,st);
    }
  }, 100); // 0.1秒ごとに項目を切り替え
}

document.getElementById('rouletteBtn').addEventListener('click',function(){
  startRoulette();
});
document.getElementById('btnHeat').addEventListener('click',function(){st.calView='heat';renderCal();});
document.getElementById('btnMon').addEventListener('click',function(){st.calView='monthly';renderCal();});
document.getElementById('calPrev').addEventListener('click',function(){st.calMonth--;if(st.calMonth<0){st.calMonth=11;st.calYear--;}buildMonthly();});
document.getElementById('calNext').addEventListener('click',function(){st.calMonth++;if(st.calMonth>11){st.calMonth=0;st.calYear++;}buildMonthly();});
document.getElementById('refLb')?.addEventListener('click',buildLb);
document.getElementById('hintOverlay').addEventListener('click',function(e){if(e.target===this)this.classList.remove('show');});
document.getElementById('dayPop').addEventListener('click',function(e){if(e.target===this)this.classList.remove('show');});
window.addEventListener('resize',function(){if(st.tab==='gongyou')buildCarousel();});

// ══════════════════════════════════════════════════════════
//  START
// ══════════════════════════════════════════════════════════
init();

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btn-yomy-walkthrough')?.addEventListener('click',function(){startTutWalk();});
  document.getElementById('btn-yomy-reset-tutorial')?.addEventListener('click',function(){
    if(!confirm('チュートリアルを最初からやり直しますか？\n（お題目・勤行タブの記録もリセットされます）'))return;
    localStorage.removeItem(UK);
    localStorage.removeItem(LBK);
    if(typeof StorageManager!=='undefined'){
      StorageManager.getUserData().then(function(u){delete u.v15;return StorageManager.saveUserData(u);}).finally(function(){location.reload();});
    }else location.reload();
  });
});
