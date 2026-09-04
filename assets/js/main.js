// Neuro-Amea — shared interaction layer
(function(){
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.primary-nav');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // mobile: tap to expand dropdown groups instead of hover
  document.querySelectorAll('.has-dropdown > button.nav-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      if(window.innerWidth > 980) return;
      var parent = btn.closest('.has-dropdown');
      parent.classList.toggle('open');
      btn.setAttribute('aria-expanded', parent.classList.contains('open') ? 'true' : 'false');
    });
  });

  // close mobile nav on link click
  document.querySelectorAll('.primary-nav a').forEach(function(a){
    a.addEventListener('click', function(){
      if(nav) nav.classList.remove('open');
    });
  });

  // scroll reveal
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if(prefersReduced || !('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function(el){ io.observe(el); });
  }

  // signal-travel animation on "how it works" chain (home page)
  var chain = document.querySelector('[data-signal-chain]');
  if(chain && !prefersReduced){
    var dot = chain.querySelector('.signal-dot, .neo-flow-line i');
    if(dot){
      var steps = chain.querySelectorAll('.chain-step').length;
      var io2 = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            chain.classList.add('run');
            io2.disconnect();
          }
        });
      }, { threshold: 0.4 });
      io2.observe(chain);
    }
  }
})();

// restrained neo-tech pointer depth on desktop
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 981) return;
  document.querySelectorAll('.neo-product-shell,.neo-output-panel,.neo-system-glass').forEach(function(el){
    el.addEventListener('pointermove',function(e){
      var r=el.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      el.style.transform='perspective(1100px) rotateX('+(-y*1.6)+'deg) rotateY('+(x*1.6)+'deg)';
    });
    el.addEventListener('pointerleave',function(){el.style.transform='';});
  });
})();

// V2.4 — restrained Apple-like depth for the hero scene
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 981) return;
  var stage=document.querySelector('[data-v24-stage]');
  if(!stage) return;
  var scene=stage.querySelector('.v24-scene-card');
  var device=stage.querySelector('.v24-device');
  stage.addEventListener('pointermove',function(e){
    var r=stage.getBoundingClientRect();
    var x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    if(scene) scene.style.transform='perspective(1400px) rotateX('+(-y*.9)+'deg) rotateY('+(x*.9)+'deg)';
    if(device) device.style.transform='translate3d('+(x*7)+'px,'+(y*5)+'px,0) rotate(-2deg)';
  });
  stage.addEventListener('pointerleave',function(){if(scene) scene.style.transform='';if(device) device.style.transform='';});
})();

// V2.8 — restrained neural network field (decorative, not clinical data)
(function(){
  var field=document.querySelector('[data-neural-field]');
  if(!field) return;
  var canvas=field.querySelector('.neural-field-canvas');
  if(!canvas || !canvas.getContext) return;
  var ctx=canvas.getContext('2d');
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var particles=[], raf=0, w=0, h=0, dpr=1;
  var pointer={x:.5,y:.5,active:false};
  var seed=19;
  function rand(){ seed=(seed*9301+49297)%233280; return seed/233280; }
  function insideBrain(x,y){
    // Two overlapping lobes create a subtle brain-like silhouette without pretending to be anatomy.
    var nx=x/w, ny=y/h;
    var l=((nx-.43)/.34)**2+((ny-.5)/.39)**2 < 1;
    var r=((nx-.57)/.34)**2+((ny-.5)/.39)**2 < 1;
    var notch = ny<.18 && Math.abs(nx-.5)<.05;
    var taper = ny>.79 && Math.abs(nx-.5)>.24;
    return (l||r) && !notch && !taper;
  }
  function build(){
    particles=[]; seed=19;
    var count=w<500?48:w<800?72:104;
    var tries=0;
    while(particles.length<count && tries<count*80){
      tries++;
      var x=w*(.08+rand()*.84), y=h*(.08+rand()*.84);
      if(!insideBrain(x,y)) continue;
      particles.push({x:x,y:y,bx:x,by:y,vx:(rand()-.5)*.055,vy:(rand()-.5)*.055,r:1.1+rand()*1.8,p:rand()*6.28});
    }
  }
  function resize(){
    var r=field.getBoundingClientRect();
    w=Math.max(1,r.width);h=Math.max(1,r.height);dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);build(); if(reduced) draw(0,true);
  }
  function draw(t,staticOnly){
    ctx.clearRect(0,0,w,h);
    var tt=t*.00022;
    for(var i=0;i<particles.length;i++){
      var p=particles[i];
      if(!staticOnly){
        var driftX=Math.sin(tt*1.15+p.p)*2.4, driftY=Math.cos(tt*.9+p.p*1.2)*2.1;
        var tx=p.bx+driftX, ty=p.by+driftY;
        if(pointer.active){
          var px=pointer.x*w, py=pointer.y*h, dx=px-p.x, dy=py-p.y, dd=Math.sqrt(dx*dx+dy*dy)||1;
          if(dd<180){ var f=(1-dd/180)*4.4; tx-=dx/dd*f; ty-=dy/dd*f; }
        }
        p.x+=(tx-p.x)*.018+p.vx; p.y+=(ty-p.y)*.018+p.vy;
      }
    }
    var maxDist=w<500?74:92;
    for(var a=0;a<particles.length;a++){
      for(var b=a+1;b<particles.length;b++){
        var p1=particles[a],p2=particles[b],dx=p1.x-p2.x,dy=p1.y-p2.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<maxDist){
          var alpha=(1-dist/maxDist)*.19;
          ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.strokeStyle='rgba(132,184,255,'+alpha.toFixed(3)+')';ctx.lineWidth=.7;ctx.stroke();
        }
      }
    }
    for(var j=0;j<particles.length;j++){
      var q=particles[j], pulse=staticOnly?1:(.76+.24*Math.sin(tt*4+q.p));
      var g=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,8+q.r*2);g.addColorStop(0,'rgba(218,235,255,'+(0.82*pulse)+')');g.addColorStop(.22,'rgba(112,174,255,'+(0.42*pulse)+')');g.addColorStop(1,'rgba(86,144,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,8+q.r*2,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(223,238,255,'+(0.72*pulse)+')';ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,Math.PI*2);ctx.fill();
    }
    if(!staticOnly) raf=requestAnimationFrame(draw);
  }
  field.addEventListener('pointermove',function(e){var r=field.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width;pointer.y=(e.clientY-r.top)/r.height;pointer.active=true;});
  field.addEventListener('pointerleave',function(){pointer.active=false;});
  if('ResizeObserver' in window){new ResizeObserver(resize).observe(field);}else{window.addEventListener('resize',resize);}
  resize(); if(!reduced) raf=requestAnimationFrame(draw);
  document.addEventListener('visibilitychange',function(){if(document.hidden){cancelAnimationFrame(raf);}else if(!reduced){raf=requestAnimationFrame(draw);}});
})();


// V2.9 — neural field integrated directly into the first screen
(function(){
  var canvas=document.querySelector('[data-hero-neural]');
  var hero=document.querySelector('.v24-hero');
  if(!canvas||!hero||!canvas.getContext) return;
  var ctx=canvas.getContext('2d');
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pts=[],w=0,h=0,dpr=1,raf=0,seed=37,pointer={x:.72,y:.48,on:false};
  function rnd(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
  function brainMask(x,y){
    var nx=x/w,ny=y/h;
    // keep the visual mass on the product side of the hero
    var cx=w<980?.52:.72;
    var dx=(nx-cx), dy=(ny-.48);
    var a=(dx/.24)*(dx/.24)+(dy/.31)*(dy/.31)<1;
    var b=((nx-(cx+.10))/.19)**2+((ny-.49)/.27)**2<1;
    var c=((nx-(cx-.10))/.19)**2+((ny-.46)/.28)**2<1;
    var topNotch=ny<.26 && Math.abs(nx-cx)<.025;
    return (a||b||c)&&!topNotch;
  }
  function rebuild(){
    pts=[];seed=37;
    var target=w<560?44:w<980?72:118,tries=0;
    while(pts.length<target&&tries<target*100){
      tries++;var x=rnd()*w,y=.14*h+rnd()*.72*h;if(!brainMask(x,y))continue;
      pts.push({x:x,y:y,bx:x,by:y,p:rnd()*6.283,r:0.85+rnd()*1.45});
    }
  }
  function resize(){
    var r=hero.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);rebuild();if(reduced)draw(0,true);
  }
  function draw(t,once){
    ctx.clearRect(0,0,w,h);var tt=t*.00018;
    for(var i=0;i<pts.length;i++){var p=pts[i];if(!once){
      var tx=p.bx+Math.sin(tt*1.15+p.p)*3.2,ty=p.by+Math.cos(tt*.92+p.p*1.31)*2.7;
      if(pointer.on){var px=pointer.x*w,py=pointer.y*h,dx=p.x-px,dy=p.y-py,d=Math.hypot(dx,dy)||1;if(d<210){var f=(1-d/210)*5.5;tx+=dx/d*f;ty+=dy/d*f}}
      p.x+=(tx-p.x)*.025;p.y+=(ty-p.y)*.025;
    }}
    var md=w<560?78:w<980?102:118;
    for(var a=0;a<pts.length;a++)for(var b=a+1;b<pts.length;b++){var A=pts[a],B=pts[b],d=Math.hypot(A.x-B.x,A.y-B.y);if(d<md){var alpha=(1-d/md)*.16;ctx.strokeStyle='rgba(115,173,255,'+alpha+')';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke()}}
    for(var k=0;k<pts.length;k++){var q=pts[k],pulse=once?1:.72+.28*Math.sin(tt*4.2+q.p);
      var g=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,11);g.addColorStop(0,'rgba(226,240,255,'+(.64*pulse)+')');g.addColorStop(.25,'rgba(93,156,255,'+(.28*pulse)+')');g.addColorStop(1,'rgba(93,156,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,11,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(229,241,255,'+(.72*pulse)+')';ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,Math.PI*2);ctx.fill();
    }
    if(!once)raf=requestAnimationFrame(draw);
  }
  hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width;pointer.y=(e.clientY-r.top)/r.height;pointer.on=true});
  hero.addEventListener('pointerleave',function(){pointer.on=false});
  if('ResizeObserver'in window)new ResizeObserver(resize).observe(hero);else addEventListener('resize',resize);
  resize();if(!reduced)raf=requestAnimationFrame(draw);
  document.addEventListener('visibilitychange',function(){if(document.hidden)cancelAnimationFrame(raf);else if(!reduced)raf=requestAnimationFrame(draw)});
})();

/* V3.1 — fast-moving brain-shaped neuron field */
(() => {
  const canvas=document.getElementById('v31BrainCanvas');
  if(!canvas || canvas.dataset.ready==='1') return;
  canvas.dataset.ready='1';
  const ctx=canvas.getContext('2d');
  if(!ctx) return;

  const reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W=1,H=1,DPR=1,pts=[];

  function inBrain(nx,ny){
    const l=((nx-.39)/.32)**2+((ny-.46)/.30)**2<1;
    const r=((nx-.64)/.31)**2+((ny-.46)/.29)**2<1;
    const c=((nx-.66)/.20)**2+((ny-.68)/.16)**2<1;
    return (l||r||c) && nx>.07 && nx<.94 && ny>.12 && ny<.84;
  }

  function seed(){
    pts=[];
    const count=W<500?82:W<900?130:185;
    let tries=0;
    while(pts.length<count && tries<9000){
      tries++;
      const nx=.05+Math.random()*.90, ny=.07+Math.random()*.80;
      if(!inBrain(nx,ny)) continue;
      pts.push({
        x:nx*W,y:ny*H,ox:nx*W,oy:ny*H,
        vx:(Math.random()-.5)*1.0,
        vy:(Math.random()-.5)*.86,
        r:.8+Math.random()*1.8,
        ph:Math.random()*Math.PI*2
      });
    }
  }

  function resize(){
    const r=canvas.getBoundingClientRect();
    DPR=Math.min(window.devicePixelRatio||1,2);
    W=Math.max(1,r.width);H=Math.max(1,r.height);
    canvas.width=Math.round(W*DPR);
    canvas.height=Math.round(H*DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
    seed();
  }

  function draw(t){
    ctx.clearRect(0,0,W,H);
    const maxD=Math.min(92,Math.max(64,W*.10));

    if(!reduce){
      for(const p of pts){
        p.x+=p.vx+Math.sin(t*.0031+p.ph)*.21;
        p.y+=p.vy+Math.cos(t*.0025+p.ph)*.18;
        if(Math.abs(p.x-p.ox)>38) p.vx*=-1;
        if(Math.abs(p.y-p.oy)>32) p.vy*=-1;
      }
    }

    // translucent brain body made from soft local clouds
    const bg=ctx.createRadialGradient(W*.55,H*.49,20,W*.55,H*.49,W*.40);
    bg.addColorStop(0,'rgba(73,140,255,.075)');
    bg.addColorStop(.55,'rgba(73,140,255,.035)');
    bg.addColorStop(1,'rgba(73,140,255,0)');
    ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(W*.53,H*.49,W*.40,H*.34,0,0,Math.PI*2);ctx.fill();

    for(let i=0;i<pts.length;i++){
      const a=pts[i];
      for(let j=i+1;j<pts.length;j++){
        const b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<maxD){
          ctx.strokeStyle=`rgba(86,158,255,${(1-d/maxD)*.24})`;
          ctx.lineWidth=.72;
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
        }
      }
    }

    for(const p of pts){
      const pulse=.48+.52*Math.sin(t*.0065+p.ph);
      const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,13);
      g.addColorStop(0,`rgba(237,249,255,${.95*pulse})`);
      g.addColorStop(.2,`rgba(80,169,255,${.64*pulse})`);
      g.addColorStop(1,'rgba(80,169,255,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,13,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=`rgba(84,165,255,${.96*pulse})`;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    }

    if(!reduce && pts.length>12){
      for(let k=0;k<10;k++){
        const a=pts[(k*19+Math.floor(t/240))%pts.length];
        let b=null,nd=1e9;
        for(const q of pts){
          if(q===a) continue;
          const d=Math.hypot(q.x-a.x,q.y-a.y);
          if(d<nd && d<105){nd=d;b=q}
        }
        if(!b) continue;
        const f=((t*.00195)+k*.103)%1;
        const x=a.x+(b.x-a.x)*f, y=a.y+(b.y-a.y)*f;
        const g=ctx.createRadialGradient(x,y,0,x,y,18);
        g.addColorStop(0,'rgba(245,253,255,1)');
        g.addColorStop(.18,'rgba(79,178,255,.98)');
        g.addColorStop(1,'rgba(79,178,255,0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,18,0,Math.PI*2);ctx.fill();
      }
    }

    if(!reduce) requestAnimationFrame(draw);
  }

  window.addEventListener('resize',resize,{passive:true});
  resize();
  draw(performance.now());
})();

/* V4 restrained reveal motion */
(() => {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els=[...document.querySelectorAll('.internal-v2 main section > .wrap, .internal-v2 main section > [class*="wrap"]')];
  if(!els.length || !('IntersectionObserver' in window)) return;
  els.forEach(el=>el.classList.add('v4-reveal'));
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('v4-in');io.unobserve(e.target)}
    });
  },{threshold:.08});
  els.forEach(el=>io.observe(el));
})();


/* V4.6 robust mobile navigation state */
(() => {
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.primary-nav');
  if(!toggle||!nav) return;
  const close=()=>{
    nav.classList.remove('open');
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open menu');
  };
  toggle.addEventListener('click',()=>{
    const willOpen=!document.body.classList.contains('nav-open');
    document.body.classList.toggle('nav-open',willOpen);
    nav.classList.toggle('open',willOpen);
    toggle.setAttribute('aria-expanded',willOpen?'true':'false');
    toggle.setAttribute('aria-label',willOpen?'Close menu':'Open menu');
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    if(innerWidth<=980) close();
  }));
  window.addEventListener('resize',()=>{ if(innerWidth>980) close(); });
})();
