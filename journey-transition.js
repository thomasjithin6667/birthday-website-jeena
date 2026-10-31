(() => {
  const body=document.body;
  const hero=document.querySelector('.hero');
  const button=hero.querySelector('.start');
  const firstMemory=document.querySelector('#memory-37');
  const story=[...document.querySelectorAll('.journey-intro,#memories,.finale')];
  body.classList.add('hero-held');
  story.forEach(section=>section.inert=true);
  button.href='#memory-37';
  let travelling=false;
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  button.addEventListener('click',async event=>{
    event.preventDefault();
    if(travelling)return;
    if(!body.classList.contains('hero-held')){
      firstMemory.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
      return;
    }
    travelling=true;
    button.setAttribute('aria-disabled','true');
    body.classList.add('time-travelling');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const transition=document.createElement('div');
    transition.className='time-portal';
    transition.setAttribute('aria-hidden','true');
    transition.innerHTML='<div class="portal-photos"></div><p>Let’s turn back time.</p>';
    const photos=[...document.querySelectorAll('.memory .photo img')].slice(0,3);
    photos.reverse().forEach((source,index)=>{
      const image=document.createElement('img');
      image.src=source.src;image.alt='';
      image.style.setProperty('--tilt',`${(index-1)*12}deg`);
      transition.querySelector('.portal-photos').append(image);
    });
    body.append(transition);
    const animations=[];
    try{
      animations.push(hero.animate(reduced?[{opacity:1},{opacity:0}]:[
        {opacity:1,transform:'scale(1)',filter:'blur(0px)'},
        {opacity:0,transform:'scale(.88) translateY(-45px)',filter:'blur(12px)'}
      ],{duration:reduced?150:800,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'}));
      if(!reduced){
        animations.push(transition.animate([{opacity:0},{opacity:1}],{duration:450,fill:'both'}));
        [...transition.querySelectorAll('img')].forEach((image,index)=>{
          const tilt=(index-1)*12;
          animations.push(image.animate([
            {opacity:0,transform:`translate3d(${(index-1)*180}px,170px,-450px) rotate(${tilt*3}deg) scale(.5)`},
            {opacity:1,transform:`translate3d(${(index-1)*24}px,0,0) rotate(${tilt}deg) scale(1)`,offset:.5},
            {opacity:0,transform:`translate3d(${(index-1)*50}px,-40px,450px) rotate(${tilt*.3}deg) scale(1.35)`}
          ],{duration:1450,delay:index*90,easing:'cubic-bezier(.22,.61,.36,1)',fill:'both'}));
        });
        animations.push(transition.querySelector('p').animate([
          {opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-15px)'}
        ],{duration:1450,fill:'both'}));
      }
      await wait(reduced?150:1050);
      body.classList.remove('hero-held');
      story.forEach(section=>section.inert=false);
      firstMemory.scrollIntoView({behavior:'instant',block:'start'});
      if(!reduced){
        animations.push(transition.animate([{opacity:1},{opacity:0}],{duration:650,fill:'forwards'}));
        await wait(650);
      }
      const heading=firstMemory.querySelector('h2');
      heading.tabIndex=-1;heading.focus({preventScroll:true});
      history.replaceState(null,'',location.pathname+location.search+'#memory-37');
    }finally{
      animations.forEach(animation=>animation.cancel());
      transition.remove();
      body.classList.remove('time-travelling','hero-held');
      story.forEach(section=>section.inert=false);
      button.removeAttribute('aria-disabled');
      travelling=false;
    }
  });
})();

