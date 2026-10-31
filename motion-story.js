/* Motion 11.11.13 — local, progressive animation layer. */
(() => {
  if (!window.Motion) return;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  if (media.matches) return;
  const { animate, inView, stagger } = Motion;
  const one = s => document.querySelector(s);
  const all = s => [...document.querySelectorAll(s)];
  const controls = new Set();
  const cleanups = [];
  // Explicit transform keyframes avoid layout measurements (and scroll
  // restoration) when many independently animated sections share the page.
  const motionAnimate = (target, keyframes, options) => {
    const frames = { ...keyframes };
    const axes = ['x', 'y', 'rotate', 'scale'].filter(axis => axis in frames);
    if (axes.length) {
      const count = Math.max(...axes.map(axis => Array.isArray(frames[axis]) ? frames[axis].length : 1));
      const poses = Array.from({length:count}, (_,i) => axes.map(axis => {
        const value = Array.isArray(frames[axis]) ? frames[axis][Math.min(i,frames[axis].length-1)] : frames[axis];
        return axis==='x' ? `translateX(${value}px)` : axis==='y' ? `translateY(${value}px)` : axis==='rotate' ? `rotate(${value}deg)` : `scale(${value})`;
      }).join(' '));
      axes.forEach(axis => delete frames[axis]);
      frames.transform = count===1 ? poses[0] : poses;
    }
    return animate(target, frames, options);
  };
  const play = (...args) => {
    if (media.matches) return;
    const animation = motionAnimate(...args);
    controls.add(animation);
    animation.then(() => controls.delete(animation));
    return animation;
  };
  const watch = (...args) => cleanups.push(inView(...args));
  const parallax = [];
  const bindParallax = (element, target, from, to, hero = false) => {
    parallax.push({element,target,from,to,hero});
  };
  let scheduled = false;
  const updateParallax = () => {
    scheduled = false;
    if(media.matches) return;
    // Batch geometry reads before writes; never change the visitor's scroll.
    const positions = parallax.map(item => ({item,rect:item.target.getBoundingClientRect()}));
    positions.forEach(({item,rect}) => {
      if(rect.bottom < -100 || rect.top > innerHeight+100) return;
      const progress = Math.max(0,Math.min(1,item.hero ? -rect.top/rect.height : (innerHeight-rect.top)/(innerHeight+rect.height)));
      item.element.style.transform = `translateY(${item.from+(item.to-item.from)*progress}px)`;
    });
  };
  const requestParallax = () => { if(!scheduled){scheduled=true;requestAnimationFrame(updateParallax);} };
  window.addEventListener('scroll',requestParallax,{passive:true});
  window.addEventListener('resize',requestParallax,{passive:true});
  cleanups.push(() => {window.removeEventListener('scroll',requestParallax);window.removeEventListener('resize',requestParallax);});
  const ease = [0.16, 1, 0.3, 1];
  document.body.classList.add('motion-ready');

  // Staggered typography, with independently floating photographic cutouts.
  const revealHero = () => {
    play('.hero > .eyebrow, .birthday-script, .birthday-name, .hero .intro, .hero .start, .hero .small',
      { opacity: [0, 1], y: [38, 0] },
      { duration: 1.35, delay: stagger(.14, {startDelay:.18}), ease });
    play('.hero-cake', { opacity: [0, 1], scale: [.78, 1], y: [80, 0] },
      { duration: 1.9, delay: .3, ease });
    play('.hero-berries', { opacity: [.15, 1], scale: [1.13, 1] },
      { duration: 2.1, ease });
  };
  if(document.body.classList.contains('journey-waiting')){
    window.addEventListener('birthday-journey-start',revealHero,{once:true});
  }else revealHero();
  watch('.hero', () => {
    const loops = all('.float-object').map((fruit, i) => play(fruit,
      { y: [0, -18-i*3, 0], rotate: [0, i%2 ? -12 : 12, 0] },
      { duration: 5+i, repeat: Infinity, ease: 'easeInOut' }));
    const floatCake = play('.hero-cake-layer', { y: [0, -14, 0] }, { duration: 6, repeat: Infinity, ease: 'easeInOut' });
    return () => { loops.forEach(loop => loop?.stop()); floatCake?.stop(); };
  });
  all('.float-layer').forEach((fruit,i) => bindParallax(fruit,one('.hero'),0,-(50+i*35),true));

  // The photo turns into place while captions arrive in a separate rhythm.
  all('.memory').forEach((section, index) => {
    const photo = section.querySelector('.photo');
    const direction = index % 2 ? 1 : -1;
    watch(section, () => {
      let active = true;
      let sway;
      const entrance = play(photo, { opacity: [.2, 1], x: [direction * 28, 0], rotate: [direction * 9, direction*2], scale: [.91, 1] },
        { duration: 1.15, ease });
      entrance?.then(() => { if(active) sway = play(photo, { rotate: [direction*2, -direction, direction*2] }, {duration:8,repeat:Infinity,ease:'easeInOut'}); });
      play(section.querySelectorAll('.copy > *'), { opacity: [0, 1], y: [26, 0] },
        { duration: .8, delay: stagger(.12), ease });
      return () => { active=false; entrance?.stop(); sway?.stop(); };
    }, { amount: .18 });
    // Scroll motion uses its own wrapper, avoiding conflicts with the entrance.
    bindParallax(section.querySelector('.photo-wrap'),section,24,-24);
    const ornament = document.createElement('span');
    ornament.className = 'memory-spark';
    ornament.setAttribute('aria-hidden', 'true');
    const berry = document.createElement('img');
    berry.src = 'assets/raspberry.png';
    berry.alt = '';
    berry.loading = 'lazy';
    ornament.append(berry);
    section.append(ornament);
    watch(section, () => {
      const drift = play(ornament, { y: [0, -18, 0], rotate: [0, 30, 0], opacity: [.25, .8, .25] },
        { duration: 5 + index % 3, repeat: Infinity });
      return () => drift?.stop();
    });
    photo.addEventListener('pointerdown', () => play(photo, { scale: .97 }, { duration: .15 }));
    const release = () => play(photo, { scale: 1 }, { duration: .35, ease });
    photo.addEventListener('pointerup', release);
    photo.addEventListener('pointercancel', release);
    photo.addEventListener('pointerleave', release);
  });
  requestParallax();

  // The visible counter rolls whenever the active memory changes.
  const counter = one('#counter b');
  new MutationObserver(() => {
    play(counter, { y: [13, 0], opacity: [.1, 1] }, { duration: .4, ease });
    play('#counter', { scale: [1, 1.06, 1] }, { duration: .4 });
  }).observe(counter, { childList: true });

  watch('.journey-intro', () => play('.journey-intro > *',
    { opacity: [0, 1], y: [35, 0] }, { duration: 1, delay: stagger(.18), ease }));
  watch('.cake', () => {
    counter.textContent = '1';
    play('.finale-cake, .candles', { opacity: [0, 1], y: [35, 0], scale: [.8, 1] },
      { duration: .85, delay: stagger(.16), ease });
    play('.finale > h2', { opacity: [0, 1], y: [25, 0] }, { duration: 1, ease });
  }, { amount: .6 });

  const ring = document.createElement('div');
  ring.className = 'wish-ring';
  ring.setAttribute('aria-hidden', 'true');
  one('.cake').append(ring);
  new MutationObserver(() => {
    if (!one('.candles').classList.contains('out')) return;
    play(ring, { opacity: [.8, 0], scale: [.3, 3] }, { duration: 1.8, ease: 'easeOut' });
    all('.candle').forEach((candle, i) => {
      const smoke = document.createElement('span');
      smoke.className = 'candle-smoke';
      smoke.textContent = '〰';
      smoke.setAttribute('aria-hidden', 'true');
      candle.append(smoke);
      play(smoke, { opacity: [0, .65, 0], y: [0, -75], x: [0, i ? 22 : -22], scale: [.5, 1.7] },
        { duration: 2.5, delay: i * .12 });
    });
    play('#wish h2, #wish p, #wish a', { opacity: [0, 1], y: [40, 0] },
      { duration: 1.25, delay: stagger(.2), ease });
  }).observe(one('.candles'), { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(() => play('#count', { scale: [1.15, 1], opacity: [.4, 1] },
    { duration: .5, ease })).observe(one('#count'), { childList: true });
  new MutationObserver(() => {
    if (one('#lightbox').open) play('#lightbox', { opacity: [0, 1], scale: [.9, 1], y: [25, 0] },
      { duration: .45, ease });
  }).observe(one('#lightbox'), { attributes: true, attributeFilter: ['open'] });

  // Live preference changes stop Motion as well as the CSS effects.
  media.addEventListener('change', () => {
    if (!media.matches) return;
    cleanups.forEach(stop => stop());
    controls.forEach(animation => animation.stop());
    document.getAnimations().forEach(animation => animation.cancel());
    document.body.classList.remove('motion-ready');
    all('.hero *, .memory *, .finale *, #counter b, #lightbox').forEach(element => {
      element.style.removeProperty('transform');
      element.style.removeProperty('opacity');
    });
  });
})();

