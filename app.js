const $=s=>document.querySelector(s);
const chapters=[{file:'our stary night cieling.jpg',title:'Our own sky full of stars.',text:'In the new house, the three of us slept together beneath a ceiling of glowing stars. We laughed. We fought. We stayed up. A whole universe, in one room.'},{file:'tv upstairs.jpg',title:'One more movie?',text:'The old television upstairs. Hindi movies late into the night. The three of us, together. Those ordinary nights became the things we would remember forever.'},{file:'play badmition.jpg',title:'Until the light ran out.',text:'Evenings meant badminton with the family. One more rally, one more game, one more excuse to stay outside together.'},{file:'kochu muri.jpg',title:'A small room. A whole world.',tag:'KOCHUMURI · 2007',text:'Pillow castles in our little kochumuri. Jeenama, our teacher, turning a black shelf into a board. Such a small room, with enough space for all our imagination.'},{file:'old house.jpg',title:'The house that held our laughter.',tag:'OUR OLD HOME · 2005',text:'The mango trees. The guava. The ambazham. Our old traditional house held so much more than rooms: it held our childhood, our laughter, and the joy of growing up together.'}];
const photos=[38,...Array.from({length:32},(_,i)=>32-i)].filter(n=>n!==31).map(n=>({file:n+'.jpg',original:n}));
const sketchSlots=new Map([[15,chapters[0]],[13,chapters[1]],[11,chapters[2]],[9,chapters[3]],[7,chapters[4]]]);
const items=Array.from({length:37},(_,i)=>sketchSlots.get(37-i)||photos.shift());
[items[37-17],items[37-16]]=[items[37-16],items[37-17]];
const sidewaysPhotos=new Set([9,10,17]);
const titles=['All this love, all these years.','A moment worth keeping.','The years look beautiful on you.','A little piece of our story.','Love, tucked into a photograph.','Some things stay with us.'];
items.forEach((m,i)=>{const count=37-i;let section=document.createElement('section');section.className='memory'+(!m.original?' sketch':'');section.dataset.count=count;section.id='memory-'+count;const {title,text,caption}=window.birthdayMemories[count];section.innerHTML=`<div class="photo-wrap"><button class="photo" aria-label="Enlarge memory ${count}"><span class="photo-orientation${sidewaysPhotos.has(m.original)?' sideways':''}"><img src="assets/${encodeURIComponent(m.file)}" alt="${m.title?'Family sketch: '+title:'Family memory, photograph '+m.original}" loading="lazy" decoding="async"></span><span class="caption">${caption}</span></button></div><div class="copy"><div class="memory-num">${String(count).padStart(2,'0')}</div><span class="tag">${m.tag||'37 YEARS · 37 MEMORIES'}</span><h2>${title}</h2><p>${text}</p></div>`;$('#memories').append(section);section.querySelector('button').onclick=()=>{const d=$('#lightbox');d.querySelector('img').src='assets/'+encodeURIComponent(m.file);d.querySelector('img').alt=section.querySelector('img').alt;d.querySelector('p').textContent=title;d.showModal()};});
$('#lightbox button').onclick=()=>$('#lightbox').close();$('#lightbox').onclick=e=>{if(e.target===$('#lightbox'))$('#lightbox').close()};
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');$('#counter b').textContent=e.target.dataset.count;}}),{threshold:.25});document.querySelectorAll('.memory').forEach(s=>observer.observe(s));window.addEventListener('scroll',()=>{$('#progress').style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+'%'},{passive:true});
const backgroundMusic=$('#audio');
backgroundMusic.volume=.4;
let musicNeedsGesture=true;
let musicPausedByUser=false;
$('#sound').onclick=()=>$('#music').hidden=!$('#music').hidden;
$('#closeMusic').onclick=()=>$('#music').hidden=true;
function stopMusicUnlockListeners(){
  document.removeEventListener('pointerdown',unlockBirthdayMusic);
  document.removeEventListener('keydown',unlockBirthdayMusic);
}
async function startBirthdayMusic(){
  try{
    await backgroundMusic.play();
    musicNeedsGesture=false;
    stopMusicUnlockListeners();
  }catch(error){
    if(error.name==='NotAllowedError'){
      $('#musicStatus').textContent='Tap Music, then Play music to start your birthday soundtrack.';
    }else if(error.name!=='AbortError'){
      $('#musicStatus').textContent='Music could not load. Tap Play music to try again.';
    }
  }
}
function unlockBirthdayMusic(event){
  if(event.type==='keydown'&&['Shift','Control','Alt','Meta','Escape'].includes(event.key))return;
  if(musicNeedsGesture&&!musicPausedByUser)startBirthdayMusic();
}
backgroundMusic.addEventListener('play',()=>{
  musicNeedsGesture=false;
  stopMusicUnlockListeners();
  $('#musicStatus').textContent='Playing A Sky Full of Stars · Coldplay';
  $('#sound span').textContent='Sound on';
  $('#pause').textContent='Pause music';
});
backgroundMusic.addEventListener('pause',()=>{
  $('#sound span').textContent='Paused';
  $('#pause').textContent='Play music';
  $('#musicStatus').textContent='Music paused. Tap Play music whenever you’re ready.';
});
backgroundMusic.addEventListener('error',()=>{
  $('#musicStatus').textContent='Music could not load. Refresh the page to try again.';
  $('#sound span').textContent='Music';
});
$('#pause').onclick=()=>{
  if(backgroundMusic.paused){musicPausedByUser=false;startBirthdayMusic()}
  else{musicPausedByUser=true;backgroundMusic.pause()}
};
const welcome=$('#journeyWelcome');
let journeyStarted=false;
welcome.showModal();
welcome.addEventListener('cancel',event=>event.preventDefault());
$('#startJourney').onclick=async()=>{
  if(journeyStarted)return;
  journeyStarted=true;
  $('#startJourney').disabled=true;
  // Call play directly in the button gesture, before waiting for animation.
  startBirthdayMusic();
  window.scrollTo({top:0,behavior:'instant'});
  document.body.classList.add('journey-starting');
  window.dispatchEvent(new Event('birthday-journey-start'));
  const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?150:850;
  await new Promise(resolve=>setTimeout(resolve,duration));
  welcome.close();
  document.body.classList.remove('journey-waiting','journey-starting');
  const heading=document.querySelector('.hero h1');
  heading.tabIndex=-1;
  heading.focus({preventScroll:true});
};
let finished=false,busy=false;function celebrate(){if(finished)return;finished=true;document.querySelector('.candles').classList.add('out');$('#count').textContent='Your wish is on its way. ♡';$('#blow').hidden=true;$('#mic').hidden=true;$('#wish').hidden=false;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){for(let i=0;i<90;i++){let s=document.createElement('i');s.className='confetti';s.style.left=Math.random()*100+'vw';s.style.background=['#dabb85','#e9b1ac','#f5ecdc','#91b4aa'][i%4];s.style.animationDelay=Math.random()*1.5+'s';document.body.append(s);setTimeout(()=>s.remove(),6000)}}$('#wish').scrollIntoView({behavior:'smooth',block:'center'});}
const countdownOverlay=document.createElement('dialog');
countdownOverlay.id='birthdayCountdown';
countdownOverlay.setAttribute('aria-label','Birthday candle countdown');
countdownOverlay.innerHTML='<div class="countdown-stage"><p class="countdown-label">CLOSE YOUR EYES. MAKE A WISH.</p><div class="countdown-depth"><span class="countdown-number" role="status" aria-live="assertive" aria-atomic="true"></span></div><p class="countdown-hint">A little wish. A whole lot of love.</p></div>';
document.body.append(countdownOverlay);
async function showBirthdayCountdown(){
  const number=countdownOverlay.querySelector('.countdown-number');
  let cancelled=false,animation;
  const cancel=()=>{cancelled=true};
  countdownOverlay.addEventListener('cancel',cancel);
  countdownOverlay.addEventListener('close',cancel);
  document.body.classList.add('countdown-active');
  $('#blow').disabled=true;
  $('#mic').disabled=true;
  $('#count').textContent='Make a wish. The countdown is starting…';
  try{
    countdownOverlay.showModal();
    for(const value of ['5','4','3','2','1','Blow!']){
      if(cancelled)return false;
      number.textContent=value;
      number.classList.toggle('countdown-word',value==='Blow!');
      const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
      animation=number.animate(reducedMotion ? [
        {opacity:0},{opacity:1,offset:.2},{opacity:1,offset:.85},{opacity:0}
      ] : [
        {opacity:0,transform:'translateZ(-650px) rotateX(18deg) scale(.5)'},
        {opacity:1,transform:'translateZ(110px) rotateX(0deg) scale(1)',offset:.35},
        {opacity:1,transform:'translateZ(190px) rotateX(-3deg) scale(1.06)',offset:.72},
        {opacity:0,transform:'translateZ(380px) rotateX(-8deg) scale(1.3)'}
      ],{duration:900,easing:'cubic-bezier(.2,.65,.3,1)',fill:'both'});
      await new Promise(resolve=>setTimeout(resolve,1000));
      animation.cancel();
    }
    return !cancelled;
  }finally{
    animation?.cancel();
    countdownOverlay.removeEventListener('cancel',cancel);
    countdownOverlay.removeEventListener('close',cancel);
    if(countdownOverlay.open)countdownOverlay.close();
    document.body.classList.remove('countdown-active');
    $('#blow').disabled=false;
    $('#mic').disabled=false;
    if(cancelled)$('#count').textContent='When you’re ready, make your wish.';
  }
}
$('#blow').onclick=async()=>{
  if(busy||finished)return;
  busy=true;
  try{if(await showBirthdayCountdown())celebrate()}finally{busy=false}
};
$('#mic').onclick=async()=>{
  if(finished||busy)return;
  busy=true;
  let stream,ctx;
  try{
    stream=await navigator.mediaDevices.getUserMedia({audio:true});
    ctx=new AudioContext();await ctx.resume();
    if(!await showBirthdayCountdown())return;
    const analyser=ctx.createAnalyser();analyser.fftSize=1024;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const data=new Uint8Array(analyser.fftSize);
    $('#count').textContent='Blow gently toward your phone!';
    const end=Date.now()+12000;let hits=0;
    await new Promise(resolve=>{
      const timer=setInterval(()=>{
        analyser.getByteTimeDomainData(data);
        const volume=Math.sqrt(data.reduce((sum,x)=>sum+(x-128)**2,0)/data.length);
        hits=volume>15?hits+1:0;
        if(hits>3||Date.now()>end||finished){
          clearInterval(timer);
          if(hits>3)celebrate();
          else if(!finished)$('#count').textContent='Try again, or tap the button to blow out the candles.';
          resolve();
        }
      },100);
    });
  }catch{
    $('#count').textContent='Microphone unavailable. Tap the candle button to make your wish.';
  }finally{
    stream?.getTracks().forEach(track=>track.stop());
    if(ctx&&ctx.state!=='closed')await ctx.close();
    busy=false;
  }
};
const canvas=$('#stars'),c=canvas.getContext('2d');let stars=[];function resize(){const d=Math.min(devicePixelRatio,2);canvas.width=innerWidth*d;canvas.height=innerHeight*d;c.setTransform(d,0,0,d,0,0);stars=Array.from({length:85},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.3+.3,p:Math.random()*6}));}resize();window.addEventListener('resize',resize);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.dataset.theme==='rose';function draw(t){c.clearRect(0,0,innerWidth,innerHeight);for(const s of stars){c.globalAlpha=.2+(Math.sin(t/1800+s.p)+1)*.25;c.fillStyle='#e5d8b5';c.beginPath();c.arc(s.x,s.y,s.r,0,7);c.fill()}if(!reduced)requestAnimationFrame(draw)}draw(0);







