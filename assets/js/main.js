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
    var dot = chain.querySelector('.signal-dot');
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
