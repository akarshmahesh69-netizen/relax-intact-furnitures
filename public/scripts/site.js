(function(){
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function(){
    links.style.top = Math.round(document.querySelector('.site-header').getBoundingClientRect().bottom) + 'px';
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Enquire buttons prefill the requirement select and scroll to contact
  document.querySelectorAll('[data-req]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var val = btn.getAttribute('data-req');
      var select = document.getElementById('fRequirement');
      var options = Array.prototype.slice.call(select.options).map(function(o){ return o.value; });
      select.value = options.indexOf(val) > -1 ? val : '';
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
      var nameField = document.getElementById('fName');
      setTimeout(function(){ nameField.focus(); }, 500);
    });
  });

  // Hero product orbit (GSAP): six products, one featured in the centre.
  // Desktop: hover/select swaps a satellite with the centre along curved paths.
  // Mobile: swipe/tap conveyor with the featured product and up to three previews.
  // Wrapped in try/catch: an error here (e.g. an unusual mobile browser edge case) must not
  // abort the rest of this <script> tag, which would silently kill the scroll-spy, reveal
  // animation, and the separate chair/seal/back-to-top script block further down the page.
  (function(){ try {
    var stage = document.getElementById('orbit');
    if(!stage) return;
    var g = window.gsap;
    var hasTL = !!(g && g.timeline);
    var NS = 'http://www.w3.org/2000/svg';
    var svg = stage.querySelector('.orbit-lines');
    var railG = svg.querySelector('.rails');
    var linkG = svg.querySelector('.links');
    var live = document.getElementById('orbitLive');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var mqMobile = window.matchMedia('(max-width: 900px)');
    var mode = mqMobile.matches ? 'swipe' : 'orbit';

    function enquire(req){
      var select = document.getElementById('fRequirement');
      var options = Array.prototype.slice.call(select.options).map(function(o){ return o.value; });
      select.value = options.indexOf(req) > -1 ? req : '';
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(function(){ document.getElementById('fName').focus(); }, 500);
    }

    // Minimal fallback so the layout still works if GSAP fails to load.
    function set(el, v){
      if(g){ g.set(el, v); return; }
      var t = el._v = Object.assign(el._v || {}, v);
      el.style.transform = 'translate(' + (t.xPercent || 0) + '%,' + (t.yPercent || 0) + '%) translate(' + (t.x || 0) + 'px,' + (t.y || 0) + 'px) scale(' + (t.scale == null ? 1 : t.scale) + ')';
      if(t.autoAlpha != null){ el.style.opacity = t.autoAlpha; el.style.visibility = t.autoAlpha > 0 ? 'inherit' : 'hidden'; }
      if(t.zIndex != null) el.style.zIndex = t.zIndex;
    }

    var items = Array.prototype.slice.call(stage.querySelectorAll('.orbit-item')).map(function(el, i){
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('class', 'link');
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('class', 'node');
      dot.setAttribute('r', '2.6');
      linkG.appendChild(path);
      linkG.appendChild(dot);
      return {
        i: i, el: el, slot: i, path: path, dot: dot,
        body: el.querySelector('.oi-body'),
        label: el.querySelector('.oi-label'),
        cur: { x: 0, y: 0, s: 1, o: 1, link: 0 },
        p: { v: 0 },
        name: el.getAttribute('data-name'),
        desc: el.getAttribute('data-desc'),
        chips: el.getAttribute('data-chips').split('|'),
        req: el.getAttribute('data-product-req')
      };
    });
    var N = items.length;
    var W = 0, H = 0, itemW = 0, cx = 0, cy = 0, slots = [];
    var busy = false, queued = null, tl = null, feat = 0, hoverT = 0;
    // Hover guard: layout changes under a resting cursor fire synthetic enter events, so a swap
    // needs real pointer movement and must not re-trigger from the spot of the previous swap.
    var lastPt = null, swapPt = null, armed = false;

    items.forEach(function(it){
      set(it.body, { xPercent: -50, yPercent: -50 });
      set(it.label, { xPercent: -50 });
    });

    function layout(){
      W = stage.clientWidth; H = stage.clientHeight;
      var rx = 0, ry = 0;
      if(mode === 'orbit'){
        itemW = Math.min(W * 0.46, H * 0.52);
        cx = W * 0.5; rx = W * 0.385;
        var ang = [-54, 18, 90, 162, 234], dep = [0.35, 0.6, 1, 0.6, 0.35];
        // fit the ring so the top products start at the stage top and the bottom label ends at the stage bottom
        var halfTop = (0.4 + 0.12 * 0.35) * itemW * 0.45, halfBot = (0.4 + 0.12) * itemW * 0.45;
        ry = (H - 8 - halfTop - halfBot - 30) / 1.809;
        cy = 4 + halfTop + 0.809 * ry;
        slots = [{ x: cx, y: cy, s: 1, o: 1, z: 10, lab: 1, link: 0 }];
        for(var k = 0; k < 5; k++){
          var a = ang[k] * Math.PI / 180;
          slots.push({ x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a), s: 0.4 + 0.12 * dep[k], o: 0.72 + 0.28 * dep[k], z: 1 + Math.round(dep[k] * 5), lab: 1, link: 1 });
        }
      } else {
        // all six stay visible: featured in the centre, five small previews around it.
        // Ring order clockwise from the right, so swiping left brings slot 1 to the centre.
        itemW = Math.min(W * 0.6, H * 0.46);
        cx = W * 0.5; cy = H * 0.46;
        var pv = function(fx, fy, z){ return { x: W * fx, y: H * fy, s: 0.38, o: 0.85, z: z, lab: 0, link: 1 }; };
        slots = [
          { x: cx, y: cy, s: 1, o: 1, z: 10, lab: 1, link: 0 },
          pv(0.87, 0.50, 4), pv(0.50, 0.89, 5), pv(0.13, 0.50, 4), pv(0.16, 0.14, 3), pv(0.84, 0.14, 3)
        ];
      }
      items.forEach(function(it){
        it.body.style.width = itemW + 'px';
        it.body.style.height = (itemW * 0.9) + 'px';
      });
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      stage.style.setProperty('--cx', (cx / W * 100) + '%');
      stage.style.setProperty('--cy', (cy / H * 100) + '%');
      while(railG.firstChild) railG.removeChild(railG.firstChild);
      if(mode === 'orbit'){
        [1, 0.56].forEach(function(f){
          var e = document.createElementNS(NS, 'ellipse');
          e.setAttribute('class', 'rail');
          e.setAttribute('cx', cx); e.setAttribute('cy', cy);
          e.setAttribute('rx', rx * f); e.setAttribute('ry', ry * f);
          railG.appendChild(e);
        });
      }
    }

    function put(it, p, lab){
      it.cur.x = p.x; it.cur.y = p.y; it.cur.s = p.s; it.cur.o = p.o; it.cur.link = p.link;
      set(it.el, { x: p.x, y: p.y });
      set(it.body, { scale: p.s, autoAlpha: p.o });
      set(it.label, { y: p.s * itemW * 0.45 + 10, autoAlpha: lab });
    }

    function lerp(a, b, e){ return a + (b - a) * e; }

    function place(it, plan, e){
      var f = plan.from, t = plan.to;
      var x = lerp(f.x, t.x, e), y = lerp(f.y, t.y, e);
      var w = Math.sin(Math.PI * e);
      if(plan.bulge){ x -= (t.y - f.y) * plan.bulge * w; y += (t.x - f.x) * plan.bulge * w; }
      if(plan.swirl){
        var a = plan.swirl * w * Math.PI / 180, dx = x - cx, dy = y - cy;
        x = cx + dx * Math.cos(a) - dy * Math.sin(a);
        y = cy + dx * Math.sin(a) + dy * Math.cos(a);
      }
      put(it, { x: x, y: y, s: lerp(f.s, t.s, e) + (plan.pop || 0) * w, o: lerp(f.o, t.o, e), link: lerp(f.link, t.link, e) }, lerp(f.lab, t.lab, e));
    }

    function drawLines(){
      var r0 = itemW * 0.36;
      items.forEach(function(it){
        var c = it.cur;
        var dx = c.x - cx, dy = c.y - cy, d = Math.sqrt(dx * dx + dy * dy);
        var r1 = itemW * 0.28 * c.s;
        var alpha = c.link * c.o;
        if(d < r0 + r1 + 6 || alpha < 0.03){
          it.path.setAttribute('opacity', 0); it.dot.setAttribute('opacity', 0);
          return;
        }
        var ux = dx / d, uy = dy / d;
        var sx = cx + ux * r0, sy = cy + uy * r0, ex = c.x - ux * r1, ey = c.y - uy * r1;
        var bow = d * 0.14;
        var qx = (sx + ex) / 2 - uy * bow, qy = (sy + ey) / 2 + ux * bow;
        it.path.setAttribute('d', 'M' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' Q' + qx.toFixed(1) + ' ' + qy.toFixed(1) + ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1));
        it.path.setAttribute('opacity', (alpha * 0.85).toFixed(2));
        it.dot.setAttribute('cx', ex.toFixed(1)); it.dot.setAttribute('cy', ey.toFixed(1));
        it.dot.setAttribute('opacity', alpha.toFixed(2));
      });
    }

    function syncState(){
      items.forEach(function(it){
        var on = it.slot === 0;
        it.el.classList.toggle('is-featured', on);
        it.el.setAttribute('aria-pressed', on ? 'true' : 'false');
        it.el.setAttribute('aria-label', on ? it.name + ', featured. Activate to enquire.' : 'Feature ' + it.name);
      });
    }

    function settle(){
      items.forEach(function(it){
        var sl = slots[it.slot];
        put(it, sl, sl.lab);
        set(it.el, { zIndex: sl.z });
      });
      syncState();
      drawLines();
    }

    var nowCount = document.getElementById('orbitCount'), nowName = document.getElementById('orbitName');
    function syncNow(it){
      if(nowCount) nowCount.textContent = (it.i < 9 ? '0' : '') + (it.i + 1) + ' / 0' + N;
      if(nowName) nowName.textContent = it.name;
    }
    function announce(it){
      syncNow(it);
      if(live) live.textContent = it.name + ' featured';
    }

    function itemAtSlot(s){
      for(var k = 0; k < N; k++) if(items[k].slot === s) return items[k];
    }

    function run(j){
      busy = true; queued = null;
      var target = items[j], prev = itemAtSlot(0);
      var from = items.map(function(it){ return it.slot; });
      var next;
      if(mode === 'orbit'){
        next = from.slice();
        next[j] = 0; next[prev.i] = from[j];
      } else {
        next = items.map(function(it){ return (it.i - j + N) % N; });
      }
      var plans = items.map(function(it){
        var plan = { from: slots[from[it.i]], to: slots[next[it.i]], bulge: 0, swirl: 0, pop: 0 };
        if(mode === 'orbit'){
          if(it.i === j){ plan.bulge = 0.2; plan.pop = 0.04; }
          else if(it === prev){ plan.bulge = 0.2; }
          else { plan.swirl = 7; }
        }
        return plan;
      });

      function finish(){
        items.forEach(function(it){ it.slot = next[it.i]; });
        feat = j;
        settle();
        busy = false;
        if(queued !== null && queued !== feat) run(queued);
        scheduleAuto();
      }

      if(reduce.matches || !hasTL){
        announce(target);
        finish();
        return;
      }

      set(target.el, { zIndex: 12 });
      set(prev.el, { zIndex: 11 });
      tl = g.timeline({ onUpdate: drawLines, onComplete: finish });
      var order = 0;
      items.forEach(function(it){
        var mover = it === target || it === prev;
        var dur = mode === 'orbit' ? (mover ? 1.05 : 0.95) : 0.75;
        var at = mover ? 0 : 0.05 + 0.035 * (order++);
        it.p.v = 0;
        tl.to(it.p, {
          v: 1, duration: dur, ease: mover ? 'power3.inOut' : 'power2.inOut',
          onUpdate: function(){ place(it, plans[it.i], it.p.v); }
        }, at);
      });
      tl.add(function(){ announce(target); }, 0.3);
    }

    function choose(j, viaHover){
      if(items[j].slot === 0) return;
      if(busy){ if(!viaHover) queued = j; return; }
      run(j);
    }

    function hot(it, on){
      it.path.classList.toggle('is-hot', on);
      it.dot.classList.toggle('is-hot', on);
    }

    items.forEach(function(it){
      it.el.addEventListener('pointerenter', function(e){
        if(mode !== 'orbit' || e.pointerType !== 'mouse' || it.slot === 0) return;
        hot(it, true);
        if(busy || !armed) return;
        if(swapPt && Math.hypot(e.clientX - swapPt.x, e.clientY - swapPt.y) < 8) return;
        clearTimeout(hoverT);
        hoverT = setTimeout(function(){
          swapPt = lastPt ? { x: lastPt.x, y: lastPt.y } : null;
          choose(it.i, true);
        }, 140);
      });
      it.el.addEventListener('pointerleave', function(){
        clearTimeout(hoverT);
        hot(it, false);
      });
      it.el.addEventListener('focus', function(){ if(it.slot !== 0) hot(it, true); });
      it.el.addEventListener('blur', function(){ hot(it, false); });
      it.el.addEventListener('click', function(){
        if(swiped) return;
        clearTimeout(hoverT);
        if(it.slot === 0){ enquire(it.req); return; }
        choose(it.i);
      });
    });

    stage.addEventListener('keydown', function(e){
      if(e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      choose((feat + (e.key === 'ArrowRight' ? 1 : -1) + N) % N);
    });

    // swipe (mobile)
    var sx = 0, sy = 0, tracking = false, swiped = false;
    stage.addEventListener('pointerdown', function(e){
      if(mode !== 'swipe') return;
      tracking = true; sx = e.clientX; sy = e.clientY;
    });
    stage.addEventListener('pointerup', function(e){
      if(!tracking) return;
      tracking = false;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if(Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.3){
        swiped = true;
        setTimeout(function(){ swiped = false; }, 80);
        choose((feat + (dx < 0 ? 1 : -1) + N) % N);
      }
    });
    stage.addEventListener('pointercancel', function(){ tracking = false; });

    // subtle parallax depth (desktop, mouse only)
    var qx = [], qy = [];
    if(g && g.quickTo){
      items.forEach(function(it){
        qx.push(g.quickTo(it.body, 'x', { duration: 0.9, ease: 'power3.out' }));
        qy.push(g.quickTo(it.body, 'y', { duration: 0.9, ease: 'power3.out' }));
      });
    }
    stage.addEventListener('pointermove', function(e){
      if(e.pointerType !== 'mouse') return;
      if(lastPt && Math.hypot(e.clientX - lastPt.x, e.clientY - lastPt.y) > 3) armed = true;
      lastPt = { x: e.clientX, y: e.clientY };
      if(mode !== 'orbit' || !qx.length || reduce.matches) return;
      var r = stage.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
      items.forEach(function(it, k){
        var f = 5 + slots[it.slot].z * 1.6;
        qx[k](-nx * f * 2); qy[k](-ny * f * 2);
      });
    });
    stage.addEventListener('pointerleave', function(){
      swapPt = null;
      qx.forEach(function(q, k){ q(0); qy[k](0); });
    });

    function relayout(){
      if(tl && tl.isActive()) tl.progress(1);
      layout();
      settle();
    }

    // opening move: products fan out from the centre
    function intro(){
      if(reduce.matches || !hasTL) return;
      var plans = items.map(function(it){
        var sl = slots[it.slot];
        var from = it.slot === 0
          ? { x: sl.x, y: sl.y + 24, s: 0.9, o: 0, z: sl.z, lab: 0, link: 0 }
          : { x: cx, y: cy, s: 0.25, o: 0, z: sl.z, lab: 0, link: 0 };
        return { from: from, to: sl, bulge: it.slot === 0 ? 0 : 0.12, swirl: 0, pop: 0 };
      });
      items.forEach(function(it){ place(it, plans[it.i], 0); });
      drawLines();
      tl = g.timeline({ onUpdate: drawLines, onComplete: settle });
      var order = 0;
      items.forEach(function(it){
        it.p.v = 0;
        var at = it.slot === 0 ? 0 : 0.3 + 0.09 * (order++);
        tl.to(it.p, { v: 1, duration: 1, ease: 'power3.out', onUpdate: function(){ place(it, plans[it.i], it.p.v); } }, at);
      });
    }

    var resizeT = 0;
    if('ResizeObserver' in window){
      new ResizeObserver(function(){
        clearTimeout(resizeT);
        resizeT = setTimeout(function(){
          if(stage.clientWidth !== W || stage.clientHeight !== H) relayout();
        }, 120);
      }).observe(stage);
    }
    mqMobile.addEventListener('change', function(){
      var nm = mqMobile.matches ? 'swipe' : 'orbit';
      if(nm === mode) return;
      if(tl && tl.isActive()) tl.progress(1);
      mode = nm;
      if(mode === 'swipe') items.forEach(function(it){ it.slot = (it.i - feat + N) % N; });
      relayout();
    });

    // Autoplay: the ring advances on its own 5s after the page opens, and every 5s after that.
    // Manual swipe/tap/click/arrow-key selection (via choose(), above) uses the exact same run()
    // as autoplay, and finish() reschedules this timer after every change — so autoplay and manual
    // control are never in conflict: whichever moved the ring last, the next auto-advance is just
    // 5s after that. Paused (not merely skipped) while the tab is hidden or the hero has scrolled
    // out of view, and off entirely for prefers-reduced-motion.
    var AUTO_MS = 5000;
    var autoT = null, autoPaused = false;
    function scheduleAuto(){
      clearTimeout(autoT);
      if(reduce.matches || autoPaused) return;
      autoT = setTimeout(function(){
        if(document.hidden){ scheduleAuto(); return; }
        choose((feat + 1) % N);
      }, AUTO_MS);
    }
    document.addEventListener('visibilitychange', function(){
      if(!document.hidden) scheduleAuto();
    });
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(entries){
        autoPaused = !entries[0].isIntersecting;
        if(!autoPaused) scheduleAuto(); else clearTimeout(autoT);
      }, { threshold: 0.2 }).observe(stage);
    }

    layout();
    settle();
    intro();
    scheduleAuto();
  } catch(e){ if(window.console && console.error) console.error('Orbit init error:', e); } })();

  // Products reel: pinned horizontal scroll. The section's height is set to the panel height plus
  // the track's horizontal overflow, so the sticky panel is pinned for exactly that much scroll and
  // vertical scroll maps 1:1 onto sideways travel. On phones too; only reduced motion gets a plain swipe strip.
  (function(){ try {
    var reel = document.getElementById('products');
    var pin = reel && reel.querySelector('.reel-pin');
    var track = document.getElementById('reelTrack');
    if(!reel || !pin || !track) return;
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    var header = document.querySelector('.site-header');
    var maxX = 0, stickTop = 90, ticking = false;
    function measure(){
      if(mq.matches){ reel.style.height = ''; track.style.transform = ''; pin.style.top = ''; return; }
      stickTop = header ? Math.round(header.getBoundingClientRect().height) : 90;
      pin.style.top = stickTop + 'px';
      maxX = Math.max(0, track.scrollWidth - window.innerWidth);
      reel.style.height = (pin.offsetHeight + maxX) + 'px';
    }
    function update(){
      ticking = false;
      if(mq.matches) return;
      var p = maxX > 0 ? Math.min(1, Math.max(0, (stickTop - reel.getBoundingClientRect().top) / maxX)) : 0;
      track.style.transform = 'translate3d(' + (-p * maxX).toFixed(1) + 'px,0,0)';
    }
    function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function(){ measure(); update(); });
    if(mq.addEventListener) mq.addEventListener('change', function(){ measure(); update(); });
    window.addEventListener('load', function(){ measure(); update(); });
    measure(); update();
  } catch(e){ if(window.console && console.error) console.error('Products reel error:', e); } })();

  // Interactive buttons (GSAP core): the products-reel pair AND the Services "Call us" button share
  // this base layer — all carry class .reel-btn — then the Call CTA gets extra treatment below
  // (idle pulse, sheen sweep, click ripple, its own pop-in) since it's the section's one closing
  // action and earns more emphasis than a plain link. The pair follows the mouse a little (desktop pointers only),
  // the arrow slides, a press squashes the button, and the phone icon rings on hover/focus.
  // Skipped entirely for prefers-reduced-motion; plain links either way.
  (function(){ try {
    var g = window.gsap;
    if(!g || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('.reel-btn').forEach(function(btn){
      var arrow = btn.querySelector('.arrow'), ico = btn.querySelector('.call-ico');
      var qx = g.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      var qy = g.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
      var ring = ico ? g.timeline({ paused: true })
        .to(ico, { rotation: -16, duration: 0.07 })
        .to(ico, { rotation: 14, duration: 0.09 })
        .to(ico, { rotation: -10, duration: 0.09 })
        .to(ico, { rotation: 8, duration: 0.08 })
        .to(ico, { rotation: 0, duration: 0.12, ease: 'power2.out' }) : null;
      btn.addEventListener('pointermove', function(e){
        if(e.pointerType !== 'mouse') return;
        var r = btn.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * 0.22);
        qy((e.clientY - (r.top + r.height / 2)) * 0.32);
      });
      btn.addEventListener('pointerenter', function(){
        if(arrow) g.to(arrow, { x: 6, duration: 0.25, ease: 'power2.out', overwrite: true });
        if(ring) ring.restart();
      });
      btn.addEventListener('pointerleave', function(){
        g.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)', overwrite: true });
        if(arrow) g.to(arrow, { x: 0, duration: 0.25, ease: 'power2.out', overwrite: true });
      });
      btn.addEventListener('focus', function(){ if(ring) ring.restart(); });
      btn.addEventListener('pointerdown', function(){ g.to(btn, { scale: 0.95, duration: 0.12, ease: 'power2.out' }); });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function(t){
        btn.addEventListener(t, function(){ g.to(btn, { scale: 1, duration: 0.4, ease: 'back.out(2.2)' }); });
      });
    });
  } catch(e){ if(window.console && console.error) console.error('Reel buttons error:', e); } })();

  // Services "Call us" CTA — extra layer on top of the shared .reel-btn magnetic/ring/press
  // behaviour above: a bespoke elastic pop-in the first time it scrolls into view, a spinning
  // conic-gradient glow ring behind the button, a synced idle cycle (box-shadow pulse + gentle
  // breathing scale + the phone icon actually wobbling, like it's ringing), a pointer-driven 3D
  // tilt (on top of the shared magnetic x/y translate — different transform properties, so both
  // run together without fighting), a stronger hover lift, and an expanding-ripple click flourish.
  // All gated behind prefers-reduced-motion; the CTA is a plain, fully visible link either way.
  (function(){ try {
    var g = window.gsap;
    var cta = document.querySelector('.services-call');
    if(!cta) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!g || reduce){ if(cta) g && g.set(cta, { opacity: 1, scale: 1 }); return; }

    var wrap = cta.parentElement;
    var ico = cta.querySelector('.call-ico');

    // spinning glow: a real sibling span (GSAP can't rotate a ::before), sized in JS to the
    // button's own box plus a small fixed inset — that inset can never scale with the button, so
    // it can't push the page wider on a full-width phone button the way a transform: scale() ring
    // did in an earlier version of this CTA (see the CSS comment above .services-call-glow).
    var glow = document.createElement('span');
    glow.className = 'services-call-glow';
    glow.setAttribute('aria-hidden', 'true');
    wrap.insertBefore(glow, cta);
    function syncGlow(){
      g.set(glow, {
        left: cta.offsetLeft - 8, top: cta.offsetTop - 8,
        width: cta.offsetWidth + 16, height: cta.offsetHeight + 16
      });
    }
    syncGlow();
    window.addEventListener('resize', syncGlow);
    g.to(glow, { '--glow-angle': '+=360deg', duration: 4, ease: 'none', repeat: -1 });

    // icon wobble: the same kind of quick side-to-side rotation as the shared .reel-btn ring
    // timeline, but its own instance here so the idle cycle below can trigger it on its own
    // schedule (making the phone icon actually shake like it's ringing every idle cycle, not only
    // on hover/focus)
    var iconWobble = ico ? g.timeline({ paused: true })
      .to(ico, { rotation: -16, duration: 0.07 })
      .to(ico, { rotation: 14, duration: 0.09 })
      .to(ico, { rotation: -10, duration: 0.09 })
      .to(ico, { rotation: 8, duration: 0.08 })
      .to(ico, { rotation: 0, duration: 0.12, ease: 'power2.out' }) : null;

    // idle cycle: box-shadow pulse + a hair of breathing scale + the icon wobble, all on one
    // timeline so they read as one "the phone is ringing" moment instead of three loose loops
    g.set(cta, { '--pulse-spread': '0px', '--pulse-alpha': 0.55 });
    var idle = g.timeline({ repeat: -1, paused: true })
      .to(cta, { '--pulse-spread': '14px', '--pulse-alpha': 0, scale: 1.02, duration: 1.7, ease: 'power1.out' }, 0)
      .call(function(){ if(iconWobble) iconWobble.restart(); }, null, 0.1)
      .to(cta, { scale: 1, duration: 0.5, ease: 'power1.inOut' }, 1.7)
      .set(cta, { '--pulse-spread': '0px', '--pulse-alpha': 0.55 }, 1.7)
      .to({}, { duration: 1.1 });

    // pop-in once, the first time the button is scrolled into view; the glow fades up and the idle
    // cycle starts right after
    var shown = false;
    function popIn(){
      if(shown) return;
      shown = true;
      g.to(cta, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.8)' });
      g.to(glow, { opacity: 0.8, duration: 0.9, delay: 0.2, onComplete: function(){ idle.play(); } });
    }
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){ if(en.isIntersecting) popIn(); });
      }, { threshold: 0.4 });
      io.observe(cta);
    } else {
      popIn();
    }

    // 3D tilt: follows the pointer independently of the shared reel-btn magnetic x/y translate
    // above (a different pair of transform properties on the same element — GSAP composes both
    // into one transform, so neither fights the other)
    var qrx = g.quickTo(cta, 'rotationX', { duration: 0.4, ease: 'power3.out' });
    var qry = g.quickTo(cta, 'rotationY', { duration: 0.4, ease: 'power3.out' });
    g.set(cta, { transformPerspective: 600 });

    cta.addEventListener('pointermove', function(e){
      if(e.pointerType !== 'mouse') return;
      var r = cta.getBoundingClientRect();
      qry(((e.clientX - r.left) / r.width - 0.5) * 16);
      qrx(-((e.clientY - r.top) / r.height - 0.5) * 12);
    });
    cta.addEventListener('pointerenter', function(e){
      if(e.pointerType !== 'mouse') return;
      idle.pause();
      g.set(cta, { '--pulse-alpha': 0 });
      g.to(cta, { scale: 1.08, duration: 0.3, ease: 'power2.out' });
      g.to(glow, { opacity: 1, scale: 1.15, duration: 0.35, ease: 'power2.out' });
      if(iconWobble) iconWobble.restart();
    });
    cta.addEventListener('pointerleave', function(e){
      if(e.pointerType !== 'mouse') return;
      g.to(cta, { scale: 1, rotationX: 0, rotationY: 0, duration: 0.5, ease: 'power2.out' });
      g.to(glow, { opacity: 0.8, scale: 1, duration: 0.5, ease: 'power2.out' });
      idle.restart().play();
    });
    cta.addEventListener('pointerdown', function(){
      g.to(cta, { scale: 0.93, duration: 0.1, ease: 'power2.out' });
    });
    ['pointerup', 'pointercancel'].forEach(function(t){
      cta.addEventListener(t, function(){
        g.to(cta, { scale: 1.08, duration: 0.45, ease: 'elastic.out(1, 0.4)' });
      });
    });

    // click flourish: the icon snaps up as if being picked up, then a ring expands from the tap
    // point and fades — purely visual, does not delay the tel: link's own navigation
    cta.addEventListener('click', function(e){
      if(ico) g.fromTo(ico, { rotation: -28, scale: 1.3 }, { rotation: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      var r = cta.getBoundingClientRect();
      var dot = document.createElement('span');
      dot.className = 'services-ripple';
      dot.style.left = (e.clientX - r.left) + 'px';
      dot.style.top = (e.clientY - r.top) + 'px';
      cta.appendChild(dot);
      g.fromTo(dot, { scale: 0, autoAlpha: 0.6 }, {
        scale: 22, autoAlpha: 0, duration: 0.6, ease: 'power2.out',
        onComplete: function(){ dot.remove(); }
      });
    });
  } catch(e){ if(window.console && console.error) console.error('Services CTA error:', e); } })();

  // Why/About slats divider: an equalizer-style bounce. Each bar scales on its own independent
  // random loop (scaleY from a fixed bottom transform-origin, not height, to stay off layout) so the
  // bars read like they're all moving at once but never in lockstep — a metronome-style yoyo tween
  // between two fixed heights would look mechanical next to a real equalizer. Starts once the divider
  // scrolls into view; skipped entirely for prefers-reduced-motion (bars stay at their static CSS
  // heights either way).
  (function(){ try {
    var g = window.gsap;
    var bars = document.querySelectorAll('.slats span');
    if(!bars.length) return;
    if(!g || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function pulse(bar){
      g.to(bar, {
        scaleY: 0.35 + Math.random() * 0.85,
        duration: 0.3 + Math.random() * 0.35,
        ease: 'sine.inOut',
        onComplete: function(){ pulse(bar); }
      });
    }
    var started = false;
    function start(){
      if(started) return;
      started = true;
      bars.forEach(function(bar){ pulse(bar); });
    }
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){ if(en.isIntersecting) start(); });
      }, { threshold: 0.3 });
      io.observe(bars[0].closest('.slats'));
    } else {
      start();
    }
  } catch(e){ if(window.console && console.error) console.error('Slats divider error:', e); } })();

  // Basic client-side form handling
  var form = document.getElementById('enquiryForm');
  var success = document.getElementById('formSuccess');
  var checks = [
    { id: 'fName',  ok: function(v){ return v.trim().length > 0; } },
    { id: 'fPhone', ok: function(v){ return v.replace(/\D/g, '').length >= 10; } },
    { id: 'fEmail', ok: function(v){ return v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } }
  ];
  function validate(c){
    var el = document.getElementById(c.id);
    var good = c.ok(el.value);
    el.closest('.field').classList.toggle('invalid', !good);
    el.setAttribute('aria-invalid', good ? 'false' : 'true');
    return good;
  }
  checks.forEach(function(c){
    var el = document.getElementById(c.id);
    el.addEventListener('blur', function(){ if(el.value !== '') validate(c); });
    el.addEventListener('input', function(){ if(el.closest('.field').classList.contains('invalid')) validate(c); });
  });
  form.addEventListener('submit', function(e){
    e.preventDefault();
    success.classList.remove('visible');
    var firstBad = null;
    checks.forEach(function(c){
      if(!validate(c) && !firstBad) firstBad = document.getElementById(c.id);
    });
    if(firstBad){ firstBad.focus(); return; }
    success.classList.add('visible');
    form.reset();
    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Highlight the nav link for the section in view. Only "#id" hrefs are real in-page anchors —
  // other nav links (e.g. a clean route like "/products") aren't valid CSS selectors at all
  // (unlike the old "products.html", which happened to parse as a harmless no-match type
  // selector), so guard with a try/catch rather than assume every href is selector-safe.
  var navAnchors = Array.prototype.slice.call(links.querySelectorAll('a:not(.btn)'));
  var spyTargets = navAnchors.map(function(a){
    var href = a.getAttribute('href');
    if(!href || href.charAt(0) !== '#') return null;
    try { return document.querySelector(href); } catch(e){ return null; }
  });
  if('IntersectionObserver' in window){
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        navAnchors.forEach(function(a, i){
          if(spyTargets[i] === en.target) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spyTargets.forEach(function(t){ if(t) spy.observe(t); });

    // Staggered reveal on scroll
    var revealSel = '.section-head, .service-card, .why-copy, .why-list li, .usecase-card, .shelf-item, .unsure-row, .contact-copy, form.enquiry';
    var items = document.querySelectorAll(revealSel);
    var reveal = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        var t = en.target;
        t.classList.add('in');
        reveal.unobserve(t);
        setTimeout(function(){ t.classList.remove('reveal', 'in'); t.style.removeProperty('--i'); }, 1300);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function(el){
      var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--i', Math.min(sib, 6));
      el.classList.add('reveal');
      reveal.observe(el);
    });
  }
})();

/* Scroll motion (GSAP): rolling chair + progress line in the header, spinning seal, back-to-top button */
(function(){
  // ?debug=1 shows a small on-page readout (values, not devtools) so this can be checked on a
  // phone with no console access: is GSAP loaded, is scroll firing, are the tween targets moving.
  var dbg = /[?&]debug=1\b/.test(location.search);
  var dbgEl = null;
  function dbgShow(text){
    if(!dbg) return;
    if(!dbgEl){
      dbgEl = document.createElement('pre');
      dbgEl.style.cssText = 'position:fixed;right:6px;bottom:6px;z-index:99999;margin:0;padding:8px 10px;background:rgba(0,0,0,0.82);color:#9f9;font:11px/1.5 monospace;border-radius:6px;max-width:70vw;white-space:pre-wrap;pointer-events:none;';
      document.body.appendChild(dbgEl);
    }
    dbgEl.textContent = text;
  }
  if(!window.gsap){ dbgShow('gsap: NOT loaded — vendor/gsap.min.js failed to fetch or parse'); return; }
  try {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var header = document.querySelector('.site-header');
    var chair = document.querySelector('.rail-chair');
    var fill = document.querySelector('.rail-fill');
    var toTop = document.getElementById('toTop');
    var products = document.getElementById('products');
    var title = document.getElementById('heroTitle');
    var rings = document.querySelectorAll('.stamp-ring');

    // Made in India seal: dashed ring turns slowly; scrolling speeds it up, then it eases back.
    // A real element with GSAP's own `rotation`, not a CSS custom property read by a ::before —
    // Safari/WebKit (all iOS browsers, "Chrome" on iPhone included) does not reliably repaint a
    // pseudo-element whose transform depends on a custom property set via JS on its host.
    var spin = null;
    if(rings.length && !reduce.matches){
      spin = gsap.to(rings, { rotation: 360, duration: 24, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
    }

    var chairW = 26, maxX = 0;
    var setX = null, setRot = null, lastY = window.scrollY, calmTimer = 0;
    function measure(){ maxX = Math.max(0, header.clientWidth - chairW - 12); }
    measure();
    if(chair){
      gsap.set(chair, { x: 6, transformOrigin: '50% 100%' });
      setX = gsap.quickTo(chair, 'x', { duration: reduce.matches ? 0 : 0.7, ease: 'power3.out' });
      setRot = gsap.quickTo(chair, 'rotation', { duration: 0.35, ease: 'power2.out' });
    }

    var shown = false;
    function progress(){
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    }
    function update(){
      var p = progress();
      if(chair){
        setX(6 + p * maxX);
        if(!reduce.matches){
          var dy = window.scrollY - lastY;
          setRot(Math.max(-9, Math.min(9, dy * 0.25)));
          clearTimeout(calmTimer);
          calmTimer = setTimeout(function(){ setRot(0); }, 140);
        }
        gsap.set(fill, { scaleX: p });
      }
      lastY = window.scrollY;
      if(spin && !reduce.matches) gsap.fromTo(spin, { timeScale: 6 }, { timeScale: 1, duration: 1.4, ease: 'power2.out', overwrite: true });

      // back-to-top appears once the products section has been scrolled past
      var past = products && products.getBoundingClientRect().bottom < window.innerHeight * 0.5;
      if(past !== shown){
        shown = past;
        gsap.to(toTop, past
          ? { autoAlpha: 1, y: 0, scale: 1, duration: reduce.matches ? 0 : 0.45, ease: 'back.out(1.8)', overwrite: true }
          : { autoAlpha: 0, y: 16, scale: 0.8, duration: reduce.matches ? 0 : 0.25, ease: 'power2.in', overwrite: true });
      }
      if(dbg){
        dbgShow('gsap: loaded\nreduceMotion: ' + reduce.matches +
          '\nscrollY: ' + Math.round(window.scrollY) +
          '\nchair x: ' + (chair ? Math.round(gsap.getProperty(chair, 'x')) : 'n/a') +
          '\nring rotation: ' + (rings.length ? Math.round(gsap.getProperty(rings[0], 'rotation')) : 'n/a') +
          '\nrings found: ' + rings.length);
      }
    }
    gsap.set(toTop, { autoAlpha: 0, y: 16, scale: 0.8 });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', function(){ measure(); update(); });
    update();

    toTop.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' });
      if(title) title.focus({ preventScroll: true });
    });
  } catch(e){
    dbgShow('scroll-motion script error:\n' + (e && e.message || e));
    if(window.console && console.error) console.error('Scroll motion error:', e);
  }
})();
