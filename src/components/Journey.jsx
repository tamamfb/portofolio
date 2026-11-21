import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Crew from './doodle/Crew'
import { Doodle, DoodleIcon } from './doodle/art'
import { crewWidth, hash } from './doodle/geometry'
import { EMAIL } from '../data/site'

// Wide: the whole road fits the frame, no scrolling. Narrow (phones): a shorter
// strip you can swipe, which re-centres on the selected stop.
const LAYOUTS = {
  wide: { vh: 420, minSpacing: 112, x0: 96, ys: [290, 165, 300, 170, 295, 160], stop: 48, road: 26, duck: 80, label: 176 },
  narrow: { vh: 330, minSpacing: 120, x0: 64, ys: [225, 140, 232, 135, 228, 140], stop: 42, road: 22, duck: 66, label: 150 },
}

// The road is a chain of cubic curves, one per stop. Sampling it once in JS gives the
// length up to every stop and a cheap point lookup for the duck, instead of asking the
// browser (getPointAtLength) thousands of times, which froze slow phones for seconds.
function roadGeom(pts, startX, endX) {
  const seg = [[startX, pts[0][1] + 34], ...pts, [endX, pts[pts.length - 1][1] - 34]]
  let d = `M${seg[0][0]} ${seg[0][1]}`
  const xs = [seg[0][0]]
  const ys = [seg[0][1]]
  const ls = [0]
  const ends = [] // length at the end of each curve
  const STEPS = 28
  for (let i = 0; i < seg.length - 1; i++) {
    const [ax, ay] = seg[i]
    const [bx, by] = seg[i + 1]
    const dx = (bx - ax) * 0.55
    const c1x = ax + dx
    const c2x = bx - dx
    d += ` C${c1x} ${ay} ${c2x} ${by} ${bx} ${by}`
    for (let k = 1; k <= STEPS; k++) {
      const t = k / STEPS
      const u = 1 - t
      const x = u * u * u * ax + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * bx
      const y = u * u * u * ay + 3 * u * u * t * ay + 3 * u * t * t * by + t * t * t * by
      ls.push(ls[ls.length - 1] + Math.hypot(x - xs[xs.length - 1], y - ys[ys.length - 1]))
      xs.push(x)
      ys.push(y)
    }
    ends.push(ls[ls.length - 1])
  }
  const total = ls[ls.length - 1]
  const pointAt = (l) => {
    const v = Math.max(0, Math.min(total, l))
    let lo = 0
    let hi = ls.length - 1
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1
      if (ls[m] < v) lo = m
      else hi = m
    }
    const f = (v - ls[lo]) / (ls[hi] - ls[lo] || 1)
    return { x: xs[lo] + (xs[hi] - xs[lo]) * f, y: ys[lo] + (ys[hi] - ys[lo]) * f }
  }
  // stop i is the end of curve i (curve 0 runs from the road start to the first stop)
  return { d, total, pointAt, stopL: pts.map((_, i) => ends[i]) }
}

function Scenery({ w, h, pts, narrow }) {
  const mountains = []
  for (let k = 0; k * 420 < w; k++) mountains.push(40 + k * 420 + hash(k) * 60)
  const clouds = []
  for (let k = 0; k * 340 < w; k++) clouds.push([160 + k * 340 + hash(k * 3) * 80, 18 + hash(k * 5) * 30])
  const ms = narrow ? 0.55 : 0.8
  return (
    <g strokeLinejoin="round" strokeLinecap="round" stroke="var(--ink)" strokeWidth="2.2">
      {mountains.map((x, k) => (
        <g key={'m' + k} transform={`translate(${x} 10) scale(${ms})`} opacity=".85">
          <path fill="#E9DFC6" d="M2 88 L62 18 L92 52 L128 8 L218 88 Z" />
          <path fill="#FFFBF0" d="M128 8 L112 30 L122 26 L130 34 L140 24 L146 30 Z" />
          <path fill="none" strokeWidth="1.5" d="M70 40 l-8 14 M150 50 l-8 16 M170 66 l-6 10" />
        </g>
      ))}
      {clouds.map(([x, y], k) => (
        <path key={'c' + k} transform={`translate(${x} ${y}) scale(${narrow ? 0.7 : 0.85})`} fill="#FFFFFF" strokeWidth="2"
          d="M12 36 C2 36 2 22 12 22 C12 10 30 6 36 16 C40 4 62 4 64 18 C76 14 86 24 80 36 Z" />
      ))}
      {(() => {
        // trees stand inside the arch under each high stop, clear of every label
        const ysAll = pts.map((p) => p[1])
        const midY = (Math.min(...ysAll) + Math.max(...ysAll)) / 2
        const sc = narrow ? 0.62 : 0.82
        const drop = narrow ? 86 : 124
        return pts.map(([sx, sy], i) => sy < midY && (
          <g key={'t' + i} transform={`translate(${sx} ${Math.min(h - 18, sy + drop)}) scale(${sc})`}>
            {i % 4 === 1 ? (
              <g transform="translate(-16 0)">
                <path fill="none" d="M0 2 L0 -18" />
                <path fill="#9BD37A" d="M0 -50 C14 -50 20 -38 16 -28 C20 -20 12 -12 0 -14 C-12 -12 -20 -20 -16 -28 C-20 -38 -14 -50 0 -50 Z" />
              </g>
            ) : (
              <g transform="translate(-16 0)">
                <path fill="none" d="M0 2 L0 -10" />
                <path fill="#5FB247" d="M0 -54 L12 -32 L6 -32 L15 -12 L-15 -12 L-6 -32 L-12 -32 Z" />
              </g>
            )}
            <g transform="translate(16 4) scale(.78)">
              <path fill="none" d="M0 2 L0 -10" />
              <path fill="#5FB247" d="M0 -54 L12 -32 L6 -32 L15 -12 L-15 -12 L-6 -32 L-12 -32 Z" />
            </g>
          </g>
        ))
      })()}
      {!narrow && (
        <g transform={`translate(6 ${pts[0][1] - 92})`}>
          <path fill="none" d="M20 68 L20 20" />
          <path fill="#FFD94A" d="M4 12 L54 12 L64 22 L54 32 L4 32 Z" />
          <text x="11" y="27" fontSize="11" fontWeight="800" fill="var(--ink)" stroke="none" letterSpacing=".06em">START</text>
        </g>
      )}
    </g>
  )
}

const Chevron = ({ dir }) => (
  <svg width="9" height="16" viewBox="0 0 9 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir < 0 ? 'M8 1 L1 8 L8 15' : 'M1 1 L8 8 L1 15'} />
  </svg>
)

export default function Journey({ stops }) {
  const frameRef = useRef(null)
  const viewRef = useRef(null)
  const walkedRef = useRef(null)
  const duckRef = useRef(null)
  const duckFaceRef = useRef(null)
  const duckBodyRef = useRef(null)
  const drag = useRef(null)
  const sim = useRef({ L: null, target: 0, lastPrint: 0, id: 0 })

  const [frameW, setFrameW] = useState(0)
  const [active, setActive] = useState(0)
  const [scroll, setScroll] = useState({ left: 0, max: 0 })
  const [prints, setPrints] = useState([])

  const narrow = frameW > 0 && frameW < 768
  const L = LAYOUTS[narrow ? 'narrow' : 'wide']
  const n = stops.length

  // spread the stops to fill the frame; only fall back to scrolling when it is too narrow
  const spacing = Math.max(L.minSpacing, frameW ? (frameW - 2 * L.x0) / (n - 1) : L.minSpacing)
  const trackW = Math.max(frameW, 2 * L.x0 + (n - 1) * spacing)
  const pts = useMemo(() => stops.map((_, i) => [L.x0 + i * spacing, L.ys[i % L.ys.length]]), [stops, L, spacing])
  const road = useMemo(() => roadGeom(pts, -40, trackW + 40), [pts, trackW])
  const d = road.d
  const duckW = crewWidth('duck', L.duck)
  const mid = (Math.min(...L.ys) + Math.max(...L.ys)) / 2

  useLayoutEffect(() => {
    const el = frameRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setFrameW(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // a new road (resize, layout switch) puts the duck straight onto it
  useEffect(() => {
    sim.current.L = null
  }, [road])

  const readScroll = useCallback(() => {
    const v = viewRef.current
    if (v) setScroll({ left: v.scrollLeft, max: Math.max(0, v.scrollWidth - v.clientWidth) })
  }, [])
  useEffect(readScroll, [readScroll, trackW, frameW])

  // the duck walks the road to the selected stop; the road it has covered gets coloured in
  useEffect(() => { sim.current.target = active }, [active])
  useEffect(() => {
    const s = sim.current
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let last = performance.now()
    let drawn = null
    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const goal = Math.max(0, (road.stopL[s.target] ?? 0) - L.stop * 1.05)
      if (s.L == null || reduced) s.L = goal
      const diff = goal - s.L
      const moving = Math.abs(diff) > 1
      // idle: the duck is already where it should be, so touch nothing
      if (!moving && drawn === s.L) return
      // quicker over long distances so a far jump never feels slow
      if (moving) s.L += Math.sign(diff) * Math.min(Math.abs(diff), Math.max(260, Math.abs(diff) * 2.2) * dt)
      drawn = s.L
      const p = road.pointAt(s.L)
      if (duckRef.current) duckRef.current.style.transform = `translate3d(${(p.x - duckW / 2).toFixed(1)}px, ${(p.y - L.duck + 12).toFixed(1)}px, 0)`
      if (duckFaceRef.current && moving) duckFaceRef.current.style.transform = `scaleX(${diff < 0 ? -1 : 1})`
      if (duckBodyRef.current) duckBodyRef.current.style.animationPlayState = moving ? 'running' : 'paused'
      if (walkedRef.current) walkedRef.current.style.strokeDasharray = `${(s.L + L.stop).toFixed(1)} ${road.total + 100}`
      if (moving && Math.abs(s.L - s.lastPrint) > 22) {
        s.lastPrint = s.L
        const id = ++s.id
        setPrints((ps) => [...ps.slice(-14), { id, x: p.x, y: p.y + (id % 2 ? 5 : -2) }])
      }
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [road, duckW, L.duck, L.stop])

  const select = useCallback((i) => {
    const k = Math.max(0, Math.min(n - 1, i))
    setActive(k)
    const v = viewRef.current
    if (v && v.scrollWidth > v.clientWidth) v.scrollTo({ left: pts[k][0] - v.clientWidth / 2, behavior: 'smooth' })
  }, [n, pts])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); select(active + 1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); select(active - 1) }
    else if (e.key === 'Home') { e.preventDefault(); select(0) }
    else if (e.key === 'End') { e.preventDefault(); select(n - 1) }
  }

  // drag to scroll with a mouse, only when the road is wider than the frame
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || scroll.max === 0) return
    drag.current = { x: e.clientX, left: viewRef.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e) => {
    const g = drag.current
    if (!g) return
    const dx = e.clientX - g.x
    if (Math.abs(dx) > 5) g.moved = true
    if (g.moved) viewRef.current.scrollLeft = g.left - dx
  }
  const endDrag = () => {
    const g = drag.current
    drag.current = null
    if (g?.moved) {
      const stopClick = (ev) => { ev.stopPropagation(); ev.preventDefault() }
      window.addEventListener('click', stopClick, { capture: true, once: true })
      setTimeout(() => window.removeEventListener('click', stopClick, { capture: true }), 0)
    }
  }

  const s = stops[active]
  const chipBg = s.color === '#FFFFFF' || s.color === '#E8402A' ? '#FFD94A' : s.color

  return (
    <div
      ref={frameRef}
      className="rounded-[18px] md:rounded-[24px] border-[2.5px] border-ink bg-white shadow-hard overflow-hidden"
      onKeyDown={onKeyDown}
    >
      {/* the map */}
      <div className="relative bg-map">
        <div
          ref={viewRef}
          className="no-scrollbar overflow-x-auto overflow-y-hidden overscroll-x-contain"
          onScroll={() => requestAnimationFrame(readScroll)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          <div className="relative" style={{ width: trackW, height: L.vh }} role="tablist" aria-label="Stops on my journey">
            <svg className="absolute inset-0" width={trackW} height={L.vh} viewBox={`0 0 ${trackW} ${L.vh}`} aria-hidden="true">
              <Scenery w={trackW} h={L.vh} pts={pts} narrow={narrow} />
              <path d={d} fill="none" stroke="var(--ink)" strokeWidth={L.road + 5} strokeLinecap="round" />
              <path d={d} fill="none" stroke="#F2D9A0" strokeWidth={L.road} strokeLinecap="round" />
              <path ref={walkedRef} d={d} fill="none" stroke="#FFC93A" strokeWidth={L.road - 8} strokeLinecap="round" strokeDasharray="0 99999" />
              <path d={d} fill="none" stroke="var(--ink)" strokeWidth="2" strokeDasharray="8 10" opacity=".45" />
            </svg>

            {prints.map((p) => (
              <svg key={p.id} width="10" height="8" viewBox="0 0 10 8" className="absolute pointer-events-none" aria-hidden="true"
                style={{ left: p.x - 5, top: p.y - 4, animation: 'footprint 2.4s ease-out forwards' }}
                onAnimationEnd={() => setPrints((ps) => ps.filter((q) => q.id !== p.id))}>
                <path d="M5 8 L0 0 M5 8 L5 0 M5 8 L10 0" fill="none" stroke="#E8402A" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            ))}

            {stops.map((st, i) => {
              const [sx, sy] = pts[i]
              const below = sy >= mid
              const on = active === i
              const done = i < active
              return (
                <div key={i}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="journey-detail"
                    tabIndex={on ? 0 : -1}
                    onClick={() => select(i)}
                    className="group absolute z-10 grid place-items-center rounded-full border-[2.5px] border-ink shadow-lift transition-transform duration-300 ease-[cubic-bezier(.3,1.5,.5,1)] hover:scale-110 cursor-pointer"
                    style={{ left: sx - L.stop / 2, top: sy - L.stop / 2, width: L.stop, height: L.stop, background: st.color, transform: on ? 'scale(1.14)' : undefined }}
                    aria-label={`${st.date}: ${st.title}`}
                  >
                    {on && <span className="absolute -inset-[10px] rounded-full border-2 border-dashed border-ink animate-[spin_14s_linear_infinite]" aria-hidden="true" />}
                    <svg viewBox="-16 -16 32 32" width={L.stop * 0.5} height={L.stop * 0.5} className="doodle-icon" style={{ strokeWidth: 2.2 }} aria-hidden="true">
                      <Doodle kind={st.icon} />
                    </svg>
                    {done && (
                      <span className="absolute -right-1 -top-1 grid place-items-center w-[18px] h-[18px] rounded-full bg-ink" aria-hidden="true">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="#FFD94A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4 L4 7 L9 1" /></svg>
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => select(i)}
                    className="absolute z-[9] flex flex-col items-center gap-1 -translate-x-1/2 text-center cursor-pointer"
                    style={{ width: Math.min(L.label, 2 * spacing - 18), left: sx, ...(below ? { top: sy + L.stop / 2 + 12 } : { bottom: L.vh - (sy - L.stop / 2 - 12) }) }}
                    aria-hidden="true"
                  >
                    <span className={`chip border-[1.5px] px-2.5 py-0.5 text-[11px] font-bold transition-colors ${on ? 'bg-ink text-paper' : ''}`}>{st.date}</span>
                    <span className={`text-[12.5px] md:text-[14.5px] font-bold leading-tight [text-shadow:0_0_4px_#FFF4D6,0_0_8px_#FFF4D6] ${on ? 'text-ink' : 'text-soft'}`}>
                      {st.title}
                    </span>
                  </button>
                </div>
              )
            })}

            <div ref={duckRef} className="absolute left-0 top-0 z-[8] pointer-events-none will-change-transform" style={{ width: duckW }} aria-hidden="true">
              <div ref={duckFaceRef}>
                <div ref={duckBodyRef} style={{ animation: 'waddle .45s ease-in-out infinite', transformOrigin: '50% 100%' }}>
                  <Crew kind="duck" height={L.duck} look={{ x: 0.8, y: -0.4 }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {scroll.max > 0 && (
          <>
            <div className={`pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-map to-transparent transition-opacity ${scroll.left > 4 ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-map to-transparent transition-opacity ${scroll.left < scroll.max - 4 ? 'opacity-100' : 'opacity-0'}`} />
          </>
        )}
      </div>

      {/* the selected stop, always readable */}
      <div id="journey-detail" role="tabpanel" aria-live="polite" className="border-t-[2.5px] border-ink px-5 py-5 md:px-8 md:py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-10">
          <div key={active} className="min-w-0 flex-1 fade-in md:min-h-[112px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip border-[1.5px] px-2.5 py-0.5 text-xs font-bold" style={{ background: chipBg }}>{s.period || s.date}</span>
              <span className="text-xs font-bold uppercase tracking-[.12em] text-muted">Stop {active + 1} of {n}</span>
            </div>
            <h3 className="mt-2.5 font-display font-black text-[22px] md:text-[28px] leading-[1.1] tracking-[-0.01em]">{s.role || s.title}</h3>
            <p className="mt-1 text-sm md:text-[15px] font-semibold text-accent">{s.org}</p>
            <p className="mt-2 max-w-[640px] text-[15px] leading-relaxed text-soft">{s.description}</p>
            {(s.tags.length > 0 || active === n - 1) && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {s.tags.map((t) => <span key={t} className="chip border-[1.2px] bg-paper px-2.5 py-0.5 text-xs">{t}</span>)}
                {active === n - 1 && (
                  <a href={`mailto:${EMAIL}`} className="btn btn-solid h-11 text-sm">
                    <DoodleIcon kind="plane" size={18} stroke="var(--paper)" className="btn-icon" /> Email me
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-4 md:flex-col md:items-end">
            <div className="hidden md:flex items-center gap-1.5" aria-hidden="true">
              {stops.map((st, i) => (
                <button key={i} type="button" tabIndex={-1} onClick={() => select(i)}
                  className={`h-2.5 rounded-full border-[1.5px] border-ink transition-all duration-300 ${i === active ? 'w-7 bg-sun' : i < active ? 'w-2.5 bg-ink' : 'w-2.5 bg-white'}`} />
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <button type="button" onClick={() => select(active - 1)} disabled={active === 0}
                className="grid place-items-center w-11 h-11 rounded-full border-2 border-ink bg-white shadow-lift-sm disabled:opacity-40 enabled:hover:-translate-y-0.5 transition-transform" aria-label="Previous stop">
                <Chevron dir={-1} />
              </button>
              <button type="button" onClick={() => select(active + 1)} disabled={active === n - 1}
                className="flex items-center gap-2 h-11 pl-4 pr-3.5 rounded-full border-2 border-ink bg-ink text-paper text-sm font-bold shadow-[0_3px_0_#E8402A] disabled:opacity-40 enabled:hover:-translate-y-0.5 transition-transform" aria-label="Next stop">
                Next <Chevron dir={1} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
