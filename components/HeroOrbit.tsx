"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Hero product orbit — six products, one featured in the centre. Desktop: hover/select swaps a
 * satellite with the centre along curved paths. Mobile (≤900px): swipe/tap conveyor with the
 * featured product and previews around it. Autoplay advances every 5s, paused while the tab is
 * hidden or the hero has scrolled out of view, off for prefers-reduced-motion.
 *
 * Ported from the orbit IIFE in the Astro source's public/scripts/site.js as closely as possible
 * — same geometry math, same swap/timeline logic, same autoplay/resize/intro sequencing — scoped
 * to this component's own container ref instead of `document.getElementById('orbit')`, so it has
 * a real React lifecycle: everything this effect creates (GSAP tweens/timelines, ResizeObserver,
 * IntersectionObserver, matchMedia listeners, the autoplay setTimeout, the post-intro relayout
 * setTimeout) is torn down in the effect's cleanup function, which runs if this component ever
 * unmounts (e.g. a future route that doesn't render the hero) or on Fast Refresh. The static-site
 * source never had to worry about that — every page load was a fresh document — but a React/Next
 * client component can remount, so cleanup here isn't optional.
 *
 * THE IMAGE FIX (see this project's CLAUDE.md for the full writeup): all six `oi-img` photos below
 * are now real alpha-transparent cutouts (public/images/cutouts/*.webp), not the original white-
 * studio-background photos. The source faked transparency with `mix-blend-mode: multiply` +
 * `isolation: isolate` on `.orbit-item` (see app/home.css's comment on that rule) to blend the
 * white background into the page, which caused a GPU-compositing bug that intermittently rendered
 * the featured photo as a solid black shape. That CSS is gone entirely here — not disabled, not
 * guarded, removed — because the images themselves no longer need it.
 */
type OrbitItemData = {
  id: string;
  name: string;
  desc: string;
  chips: string[];
  req: string;
  src: string;
  width: number;
  height: number;
  alt: string;
};

const ORBIT_ITEMS: OrbitItemData[] = [
  {
    id: "executive",
    name: "Executive chairs",
    desc: "High-back seating for cabins and leadership spaces, in leather or premium fabric.",
    chips: ["High-back", "Leather or fabric", "Padded headrest"],
    req: "Executive Chairs",
    src: "/images/cutouts/executive-chair.webp",
    width: 537,
    height: 851,
    alt: "Tan leather high-back executive chair with a polished aluminium base",
  },
  {
    id: "tables",
    name: "Office tables",
    desc: "Workstations, cabin tables and modular desks for offices of any size.",
    chips: ["Cabin desk", "Side drawer unit", "Cable management"],
    req: "Office Tables",
    src: "/images/cutouts/desk.webp",
    width: 970,
    height: 498,
    alt: "Executive office desk in walnut and charcoal with a lockable side drawer unit",
  },
  {
    id: "cupboards",
    name: "Cupboards",
    desc: "Storage units and filing cabinets for documents, stationery and supplies.",
    chips: ["Lockable", "Glass-door shelves", "Filing"],
    req: "Cupboards",
    src: "/images/cutouts/cupboard.webp",
    width: 599,
    height: 788,
    alt: "Walnut and charcoal storage cupboard with lockable doors and glass-front shelves",
  },
  {
    id: "computer",
    name: "Computer chairs",
    desc: "Adjustable seating for computer workstations and shared desks.",
    chips: ["Mesh back", "Headrest", "Adjustable armrests"],
    req: "Computer Chairs",
    src: "/images/cutouts/computer-chair.webp",
    width: 1254,
    height: 1254,
    alt: "Black mesh computer chair with a headrest and adjustable armrests",
  },
  {
    id: "visitor",
    name: "Visitor chairs",
    desc: "Bench and standalone seating for receptions, waiting areas and meeting rooms.",
    chips: ["Cantilever frame", "Reception", "Meeting rooms"],
    req: "Visitor Chairs",
    src: "/images/cutouts/visitor-chair.webp",
    width: 1290,
    height: 1219,
    alt: "Black leather visitor chair on a chrome cantilever frame",
  },
  {
    id: "blinds",
    name: "Vertical blinds",
    desc: "Window blinds fitted for cabins, meeting rooms and open-plan offices.",
    chips: ["Fabric vanes", "Cabins", "Meeting rooms"],
    req: "Vertical Blinds",
    src: "/images/cutouts/blinds.webp",
    width: 718,
    height: 701,
    alt: "Vertical window blinds in a warm grey woven fabric",
  },
];

export default function HeroOrbit() {
  const stageRef = useRef<HTMLDivElement>(null);
  const orbitCountRef = useRef<HTMLElement>(null);
  const orbitNameRef = useRef<HTMLSpanElement>(null);
  const orbitLiveRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    try {
      const g = gsap;
      const hasTL = !!(g && g.timeline);
      const NS = "http://www.w3.org/2000/svg";
      const svg = stage.querySelector<SVGSVGElement>(".orbit-lines")!;
      const railG = svg.querySelector<SVGGElement>(".rails")!;
      const linkG = svg.querySelector<SVGGElement>(".links")!;
      const live = orbitLiveRef.current;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      const mqMobile = window.matchMedia("(max-width: 900px)");
      let mode: "orbit" | "swipe" = mqMobile.matches ? "swipe" : "orbit";

      function enquire(req: string) {
        window.dispatchEvent(new CustomEvent("enquire:prefill", { detail: { requirement: req } }));
      }

      type Pt = { x: number; y: number; s: number; o: number; z?: number; lab: number; link: number };

      function set(el: Element, v: Record<string, unknown>) {
        g.set(el, v);
      }

      const elItems = Array.prototype.slice.call(
        stage.querySelectorAll<HTMLButtonElement>(".orbit-item")
      ) as HTMLButtonElement[];

      type Item = {
        i: number;
        el: HTMLButtonElement;
        slot: number;
        path: SVGPathElement;
        dot: SVGCircleElement;
        body: HTMLElement;
        label: HTMLElement;
        cur: { x: number; y: number; s: number; o: number; link: number };
        p: { v: number };
        name: string;
        req: string;
      };

      const items: Item[] = elItems.map((el, i) => {
        const path = document.createElementNS(NS, "path");
        path.setAttribute("class", "link");
        const dot = document.createElementNS(NS, "circle");
        dot.setAttribute("class", "node");
        dot.setAttribute("r", "2.6");
        linkG.appendChild(path);
        linkG.appendChild(dot);
        return {
          i,
          el,
          slot: i,
          path,
          dot,
          body: el.querySelector<HTMLElement>(".oi-body")!,
          label: el.querySelector<HTMLElement>(".oi-label")!,
          cur: { x: 0, y: 0, s: 1, o: 1, link: 0 },
          p: { v: 0 },
          name: el.getAttribute("data-name") || "",
          req: el.getAttribute("data-product-req") || "",
        };
      });
      const N = items.length;
      let W = 0,
        H = 0,
        itemW = 0,
        cx = 0,
        cy = 0,
        slots: Pt[] = [];
      let busy = false,
        queued: number | null = null,
        tl: gsap.core.Timeline | null = null,
        feat = 0,
        hoverT: ReturnType<typeof setTimeout> | undefined;
      let lastPt: { x: number; y: number } | null = null,
        swapPt: { x: number; y: number } | null = null,
        armed = false;

      items.forEach((it) => {
        set(it.body, { xPercent: -50, yPercent: -50 });
        set(it.label, { xPercent: -50 });
      });

      function layout() {
        W = stage!.clientWidth;
        H = stage!.clientHeight;
        let rx = 0,
          ry = 0;
        if (mode === "orbit") {
          itemW = Math.min(W * 0.46, H * 0.52);
          cx = W * 0.5;
          rx = W * 0.385;
          const ang = [-54, 18, 90, 162, 234];
          const dep = [0.35, 0.6, 1, 0.6, 0.35];
          const halfTop = (0.4 + 0.12 * 0.35) * itemW * 0.45;
          const halfBot = (0.4 + 0.12) * itemW * 0.45;
          ry = (H - 8 - halfTop - halfBot - 30) / 1.809;
          cy = 4 + halfTop + 0.809 * ry;
          slots = [{ x: cx, y: cy, s: 1, o: 1, z: 10, lab: 1, link: 0 }];
          for (let k = 0; k < 5; k++) {
            const a = (ang[k] * Math.PI) / 180;
            slots.push({
              x: cx + rx * Math.cos(a),
              y: cy + ry * Math.sin(a),
              s: 0.4 + 0.12 * dep[k],
              o: 0.72 + 0.28 * dep[k],
              z: 1 + Math.round(dep[k] * 5),
              lab: 1,
              link: 1,
            });
          }
        } else {
          itemW = Math.min(W * 0.6, H * 0.46);
          cx = W * 0.5;
          cy = H * 0.46;
          const pv = (fx: number, fy: number, z: number): Pt => ({
            x: W * fx,
            y: H * fy,
            s: 0.38,
            o: 0.85,
            z,
            lab: 0,
            link: 1,
          });
          slots = [
            { x: cx, y: cy, s: 1, o: 1, z: 10, lab: 1, link: 0 },
            pv(0.87, 0.5, 4),
            pv(0.5, 0.89, 5),
            pv(0.13, 0.5, 4),
            pv(0.16, 0.14, 3),
            pv(0.84, 0.14, 3),
          ];
        }
        items.forEach((it) => {
          it.body.style.width = itemW + "px";
          it.body.style.height = itemW * 0.9 + "px";
        });
        svg.setAttribute("viewBox", "0 0 " + W + " " + H);
        stage!.style.setProperty("--cx", (cx / W) * 100 + "%");
        stage!.style.setProperty("--cy", (cy / H) * 100 + "%");
        while (railG.firstChild) railG.removeChild(railG.firstChild);
        if (mode === "orbit") {
          [1, 0.56].forEach((f) => {
            const e = document.createElementNS(NS, "ellipse");
            e.setAttribute("class", "rail");
            e.setAttribute("cx", String(cx));
            e.setAttribute("cy", String(cy));
            e.setAttribute("rx", String(rx * f));
            e.setAttribute("ry", String(ry * f));
            railG.appendChild(e);
          });
        }
      }

      function put(it: Item, p: Pt, lab: number) {
        it.cur.x = p.x;
        it.cur.y = p.y;
        it.cur.s = p.s;
        it.cur.o = p.o;
        it.cur.link = p.link;
        set(it.el, { x: p.x, y: p.y });
        set(it.body, { scale: p.s, autoAlpha: p.o });
        set(it.label, { y: p.s * itemW * 0.45 + 10, autoAlpha: lab });
      }

      function lerp(a: number, b: number, e: number) {
        return a + (b - a) * e;
      }

      function place(it: Item, plan: { from: Pt; to: Pt; bulge: number; swirl: number; pop: number }, e: number) {
        const f = plan.from,
          t = plan.to;
        let x = lerp(f.x, t.x, e),
          y = lerp(f.y, t.y, e);
        const w = Math.sin(Math.PI * e);
        if (plan.bulge) {
          x -= (t.y - f.y) * plan.bulge * w;
          y += (t.x - f.x) * plan.bulge * w;
        }
        if (plan.swirl) {
          const a = (plan.swirl * w * Math.PI) / 180,
            dx = x - cx,
            dy = y - cy;
          x = cx + dx * Math.cos(a) - dy * Math.sin(a);
          y = cy + dx * Math.sin(a) + dy * Math.cos(a);
        }
        put(
          it,
          {
            x,
            y,
            s: lerp(f.s, t.s, e) + (plan.pop || 0) * w,
            o: lerp(f.o, t.o, e),
            link: lerp(f.link, t.link, e),
            lab: 0,
          },
          lerp(f.lab, t.lab, e)
        );
      }

      function drawLines() {
        const r0 = itemW * 0.36;
        items.forEach((it) => {
          const c = it.cur;
          const dx = c.x - cx,
            dy = c.y - cy,
            d = Math.sqrt(dx * dx + dy * dy);
          const r1 = itemW * 0.28 * c.s;
          const alpha = c.link * c.o;
          if (d < r0 + r1 + 6 || alpha < 0.03) {
            it.path.setAttribute("opacity", "0");
            it.dot.setAttribute("opacity", "0");
            return;
          }
          const ux = dx / d,
            uy = dy / d;
          const sx = cx + ux * r0,
            sy = cy + uy * r0,
            ex = c.x - ux * r1,
            ey = c.y - uy * r1;
          const bow = d * 0.14;
          const qx = (sx + ex) / 2 - uy * bow,
            qy = (sy + ey) / 2 + ux * bow;
          it.path.setAttribute(
            "d",
            "M" + sx.toFixed(1) + " " + sy.toFixed(1) + " Q" + qx.toFixed(1) + " " + qy.toFixed(1) + " " + ex.toFixed(1) + " " + ey.toFixed(1)
          );
          it.path.setAttribute("opacity", (alpha * 0.85).toFixed(2));
          it.dot.setAttribute("cx", ex.toFixed(1));
          it.dot.setAttribute("cy", ey.toFixed(1));
          it.dot.setAttribute("opacity", alpha.toFixed(2));
        });
      }

      function syncState() {
        items.forEach((it) => {
          const on = it.slot === 0;
          it.el.classList.toggle("is-featured", on);
          it.el.setAttribute("aria-pressed", on ? "true" : "false");
          it.el.setAttribute("aria-label", on ? it.name + ", featured. Activate to enquire." : "Feature " + it.name);
        });
      }

      function settle() {
        items.forEach((it) => {
          const sl = slots[it.slot];
          put(it, sl, sl.lab);
          set(it.el, { zIndex: sl.z ?? 0 });
        });
        syncState();
        drawLines();
      }

      function syncNow(it: Item) {
        if (orbitCountRef.current) orbitCountRef.current.textContent = (it.i < 9 ? "0" : "") + (it.i + 1) + " / 0" + N;
        if (orbitNameRef.current) orbitNameRef.current.textContent = it.name;
      }
      function announce(it: Item) {
        syncNow(it);
        if (live) live.textContent = it.name + " featured";
      }

      function itemAtSlot(s: number) {
        for (let k = 0; k < N; k++) if (items[k].slot === s) return items[k];
      }

      function run(j: number) {
        busy = true;
        queued = null;
        const target = items[j],
          prev = itemAtSlot(0)!;
        const from = items.map((it) => it.slot);
        let next: number[];
        if (mode === "orbit") {
          next = from.slice();
          next[j] = 0;
          next[prev.i] = from[j];
        } else {
          next = items.map((it) => (it.i - j + N) % N);
        }
        const plans = items.map((it) => {
          const plan = { from: slots[from[it.i]], to: slots[next[it.i]], bulge: 0, swirl: 0, pop: 0 };
          if (mode === "orbit") {
            if (it.i === j) {
              plan.bulge = 0.2;
              plan.pop = 0.04;
            } else if (it === prev) {
              plan.bulge = 0.2;
            } else {
              plan.swirl = 7;
            }
          }
          return plan;
        });

        function finish() {
          items.forEach((it) => {
            it.slot = next[it.i];
          });
          feat = j;
          settle();
          busy = false;
          if (queued !== null && queued !== feat) run(queued);
          scheduleAuto();
        }

        if (reduce.matches || !hasTL) {
          announce(target);
          finish();
          return;
        }

        set(target.el, { zIndex: 12 });
        set(prev.el, { zIndex: 11 });
        tl = g.timeline({ onUpdate: drawLines, onComplete: finish });
        let order = 0;
        items.forEach((it) => {
          const mover = it === target || it === prev;
          const dur = mode === "orbit" ? (mover ? 1.05 : 0.95) : 0.75;
          const at = mover ? 0 : 0.05 + 0.035 * order++;
          it.p.v = 0;
          tl!.to(
            it.p,
            {
              v: 1,
              duration: dur,
              ease: mover ? "power3.inOut" : "power2.inOut",
              onUpdate: () => place(it, plans[it.i], it.p.v),
            },
            at
          );
        });
        tl.add(() => announce(target), 0.3);
      }

      function choose(j: number, viaHover?: boolean) {
        if (items[j].slot === 0) return;
        if (busy) {
          if (!viaHover) queued = j;
          return;
        }
        run(j);
      }

      function hot(it: Item, on: boolean) {
        it.path.classList.toggle("is-hot", on);
        it.dot.classList.toggle("is-hot", on);
      }

      items.forEach((it) => {
        it.el.addEventListener("pointerenter", (e) => {
          if (mode !== "orbit" || e.pointerType !== "mouse" || it.slot === 0) return;
          hot(it, true);
          if (busy || !armed) return;
          if (swapPt && Math.hypot(e.clientX - swapPt.x, e.clientY - swapPt.y) < 8) return;
          clearTimeout(hoverT);
          hoverT = setTimeout(() => {
            swapPt = lastPt ? { x: lastPt.x, y: lastPt.y } : null;
            choose(it.i, true);
          }, 140);
        });
        it.el.addEventListener("pointerleave", () => {
          clearTimeout(hoverT);
          hot(it, false);
        });
        it.el.addEventListener("focus", () => {
          if (it.slot !== 0) hot(it, true);
        });
        it.el.addEventListener("blur", () => hot(it, false));
        it.el.addEventListener("click", () => {
          if (swiped) return;
          clearTimeout(hoverT);
          if (it.slot === 0) {
            enquire(it.req);
            return;
          }
          choose(it.i);
        });
      });

      function onStageKeydown(e: KeyboardEvent) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        choose((feat + (e.key === "ArrowRight" ? 1 : -1) + N) % N);
      }
      stage.addEventListener("keydown", onStageKeydown);

      let sx = 0,
        sy = 0,
        tracking = false,
        swiped = false;
      function onPointerDown(e: PointerEvent) {
        if (mode !== "swipe") return;
        tracking = true;
        sx = e.clientX;
        sy = e.clientY;
      }
      function onPointerUp(e: PointerEvent) {
        if (!tracking) return;
        tracking = false;
        const dx = e.clientX - sx,
          dy = e.clientY - sy;
        if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.3) {
          swiped = true;
          setTimeout(() => {
            swiped = false;
          }, 80);
          choose((feat + (dx < 0 ? 1 : -1) + N) % N);
        }
      }
      function onPointerCancel() {
        tracking = false;
      }
      stage.addEventListener("pointerdown", onPointerDown);
      stage.addEventListener("pointerup", onPointerUp);
      stage.addEventListener("pointercancel", onPointerCancel);

      const qx: ((v: number) => void)[] = [];
      const qy: ((v: number) => void)[] = [];
      if (g && g.quickTo) {
        items.forEach((it) => {
          qx.push(g.quickTo(it.body, "x", { duration: 0.9, ease: "power3.out" }));
          qy.push(g.quickTo(it.body, "y", { duration: 0.9, ease: "power3.out" }));
        });
      }
      function onPointerMove(e: PointerEvent) {
        if (e.pointerType !== "mouse") return;
        if (lastPt && Math.hypot(e.clientX - lastPt.x, e.clientY - lastPt.y) > 3) armed = true;
        lastPt = { x: e.clientX, y: e.clientY };
        if (mode !== "orbit" || !qx.length || reduce.matches) return;
        const r = stage!.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5,
          ny = (e.clientY - r.top) / r.height - 0.5;
        items.forEach((it, k) => {
          const f = 5 + (slots[it.slot].z ?? 0) * 1.6;
          qx[k](-nx * f * 2);
          qy[k](-ny * f * 2);
        });
      }
      function onStagePointerLeave() {
        swapPt = null;
        qx.forEach((q, k) => {
          q(0);
          qy[k](0);
        });
      }
      stage.addEventListener("pointermove", onPointerMove);
      stage.addEventListener("pointerleave", onStagePointerLeave);

      function relayout() {
        if (tl && tl.isActive()) tl.progress(1);
        layout();
        settle();
      }

      function intro() {
        if (reduce.matches || !hasTL) return;
        const plans = items.map((it) => {
          const sl = slots[it.slot];
          const from: Pt =
            it.slot === 0
              ? { x: sl.x, y: sl.y + 24, s: 0.9, o: 0, z: sl.z, lab: 0, link: 0 }
              : { x: cx, y: cy, s: 0.25, o: 0, z: sl.z, lab: 0, link: 0 };
          return { from, to: sl, bulge: it.slot === 0 ? 0 : 0.12, swirl: 0, pop: 0 };
        });
        items.forEach((it) => place(it, plans[it.i], 0));
        drawLines();
        tl = g.timeline({ onUpdate: drawLines, onComplete: settle });
        let order = 0;
        items.forEach((it) => {
          it.p.v = 0;
          const at = it.slot === 0 ? 0 : 0.3 + 0.09 * order++;
          tl!.to(it.p, { v: 1, duration: 1, ease: "power3.out", onUpdate: () => place(it, plans[it.i], it.p.v) }, at);
        });
      }

      let resizeT: ReturnType<typeof setTimeout> | undefined;
      let resizeObserver: ResizeObserver | null = null;
      if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(() => {
          clearTimeout(resizeT);
          resizeT = setTimeout(() => {
            if (stage!.clientWidth !== W || stage!.clientHeight !== H) relayout();
          }, 120);
        });
        resizeObserver.observe(stage);
      }
      function onMqChange() {
        const nm: "orbit" | "swipe" = mqMobile.matches ? "swipe" : "orbit";
        if (nm === mode) return;
        if (tl && tl.isActive()) tl.progress(1);
        mode = nm;
        if (mode === "swipe") items.forEach((it) => (it.slot = (it.i - feat + N) % N));
        relayout();
      }
      mqMobile.addEventListener("change", onMqChange);

      const AUTO_MS = 5000;
      let autoT: ReturnType<typeof setTimeout> | undefined;
      let autoPaused = false;
      function scheduleAuto() {
        clearTimeout(autoT);
        if (reduce.matches || autoPaused) return;
        autoT = setTimeout(() => {
          if (document.hidden) {
            scheduleAuto();
            return;
          }
          choose((feat + 1) % N);
        }, AUTO_MS);
      }
      function onVisibilityChange() {
        if (!document.hidden) scheduleAuto();
      }
      document.addEventListener("visibilitychange", onVisibilityChange);

      let intersectionObserver: IntersectionObserver | null = null;
      if ("IntersectionObserver" in window) {
        intersectionObserver = new IntersectionObserver(
          (entries) => {
            autoPaused = !entries[0].isIntersecting;
            if (!autoPaused) scheduleAuto();
            else clearTimeout(autoT);
          },
          { threshold: 0.2 }
        );
        intersectionObserver.observe(stage);
      }

      layout();
      settle();
      intro();
      scheduleAuto();

      // Safety-net relayout — same bad-geometry fix documented in the source CLAUDE.md ("Hero
      // orbit 'black blob' — Bug 1"): a plain setTimeout (not requestAnimationFrame, which fully
      // suspends on a hidden tab) re-checks the stage's settled size 2.2s after init, comfortably
      // after intro()'s own fan-out timeline has finished so relayout()'s tl.progress(1) can't
      // collide with it.
      const safetyTimer = setTimeout(relayout, 2200);

      // stamp-ring spin (the "Made in India" seal): moved here from the source's separate "Scroll
      // motion" script block since this is the only place `.stamp-ring` exists — a real element
      // tween (GSAP `rotation`), not a CSS-custom-property-driven `::before`, because Safari/WebKit
      // does not reliably repaint a pseudo-element whose transform depends on a JS-set custom
      // property (see the source CLAUDE.md comment this is ported from).
      const rings = stage.querySelectorAll<SVGElement | HTMLElement>(".stamp-ring");
      let spin: gsap.core.Tween | null = null;
      let lastScrollY = window.scrollY;
      function onScrollSpin() {
        if (spin && !reduce.matches) {
          gsap.fromTo(spin, { timeScale: 6 }, { timeScale: 1, duration: 1.4, ease: "power2.out", overwrite: true });
        }
        lastScrollY = window.scrollY;
      }
      if (rings.length && !reduce.matches) {
        spin = gsap.to(rings, { rotation: 360, duration: 24, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
        window.addEventListener("scroll", onScrollSpin, { passive: true });
      }

      return () => {
        clearTimeout(safetyTimer);
        clearTimeout(resizeT);
        clearTimeout(autoT);
        clearTimeout(hoverT);
        resizeObserver?.disconnect();
        intersectionObserver?.disconnect();
        mqMobile.removeEventListener("change", onMqChange);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.removeEventListener("scroll", onScrollSpin);
        stage.removeEventListener("keydown", onStageKeydown);
        stage.removeEventListener("pointerdown", onPointerDown);
        stage.removeEventListener("pointerup", onPointerUp);
        stage.removeEventListener("pointercancel", onPointerCancel);
        stage.removeEventListener("pointermove", onPointerMove);
        stage.removeEventListener("pointerleave", onStagePointerLeave);
        if (tl) tl.kill();
        if (spin) spin.kill();
        items.forEach((it) => {
          gsap.killTweensOf(it.body);
          gsap.killTweensOf(it.el);
          gsap.killTweensOf(it.label);
          gsap.killTweensOf(it.p);
        });
      };
    } catch (e) {
      if (window.console && console.error) console.error("Orbit init error:", e);
    }
  }, []);

  return (
    <Fragment>
      <div className="orbit-stage" id="orbit" role="group" aria-label="Product showcase" ref={stageRef}>
        <svg className="orbit-lines" aria-hidden="true" focusable="false">
          <g className="rails" />
          <g className="links" />
        </svg>

        {ORBIT_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="orbit-item"
            data-id={item.id}
            data-product-req={item.req}
            data-name={item.name}
            data-desc={item.desc}
            data-chips={item.chips.join("|")}
          >
            <span className="oi-body">
              <img
                className="oi-img"
                src={item.src}
                width={item.width}
                height={item.height}
                alt={item.alt}
                decoding="async"
                fetchPriority={item.id === "executive" ? "high" : undefined}
              />
            </span>
            <span className="oi-label" aria-hidden="true">{item.name}</span>
          </button>
        ))}

        <div className="stamp" aria-hidden="true">
          <span className="stamp-ring" />
          <span>
            Made in
            <br />
            India
          </span>
        </div>
      </div>
      {/* siblings of .orbit-stage within .hero-grid, not nested inside it — .orbit-now occupies its
          own "now" grid-area on the mobile stacked layout (see app/home.css's .hero-grid rules),
          which only works if it's a direct grid item, same as the Astro source's markup. */}
      <div className="orbit-now">
        <p className="on-line">
          <b id="orbitCount" ref={orbitCountRef}>01 / 06</b>
          <span id="orbitName" ref={orbitNameRef}>Executive chairs</span>
        </p>
      </div>
      <p className="sr-only" id="orbitLive" aria-live="polite" ref={orbitLiveRef} />
    </Fragment>
  );
}
