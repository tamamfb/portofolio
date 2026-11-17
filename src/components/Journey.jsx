import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Crew from './doodle/Crew'
import { Doodle, DoodleIcon } from './doodle/art'
import { crewWidth, hash } from './doodle/geometry'
import { EMAIL } from '../data/site'

// Two layouts of the same map: a wide one, and a taller, tighter one for phones.
const LAYOUTS = {
  wide: { vh: 520, spacing: 250, x0: 110, ys: [330, 190, 350, 200, 340, 210, 330], stop: 52, card: 320, road: 30, duck: 92 },
  narrow: { vh: 520, spacing: 190, x0: 70, ys: [450, 370, 460, 360, 450, 370, 450], stop: 44, card: 264, road: 24, duck: 76 },
}
const CARD_H = 236 // room the opened card needs above or below a stop

function roadPath(pts, startX, endX) {
  const seg = [[startX, pts[0][1] + 40], ...pts, [endX, pts[pts.length - 1][1] - 40]]
  let d = `M${seg[0][0]} ${seg[0][1]}`
  for (let i = 0; i < seg.length - 1; i++) {
    const [ax, ay] = seg[i]
    const [bx, by] = seg[i + 1]
    const dx = (bx - ax) * 0.55
    d += ` C${ax + dx} ${ay} ${bx - dx} ${by} ${bx} ${by}`
  }
  return d
}

function Scenery({ w, h, pts, narrow }) {
  const mountains = []
  for (let k = 0; k * 420 < w; k++) mountains.push(40 + k * 420 + hash(k) * 60)
  const clouds = []
  for (let k = 0; k * 340 < w; k++) clouds.push([160 + k * 340 + hash(k * 3) * 80, 26 + hash(k * 5) * 40])
  const ms = narrow ? 0.7 : 1
  return (
    <g strokeLinejoin="round" strokeLinecap="round" stroke="var(--ink)" strokeWidth="2.2">
      {mountains.map((x, k) => (
        <g key={'m' + k} transform={`translate(${x} ${narrow ? 12 : 18}) scale(${ms})`}>
          <path fill="#E9DFC6" d="M2 88 L62 18 L92 52 L128 8 L218 88 Z" />
          <path fill="#FFFBF0" d="M128 8 L112 30 L122 26 L130 34 L140 24 L146 30 Z" />
          <path fill="none" strokeWidth="1.5" d="M70 40 l-8 14 M150 50 l-8 16 M170 66 l-6 10" />
        </g>
      ))}
      {clouds.map(([x, y], k) => (
        <path key={'c' + k} transform={`translate(${x} ${y})`} fill="#FFFFFF" strokeWidth="2"
          d="M12 36 C2 36 2 22 12 22 C12 10 30 6 36 16 C40 4 62 4 64 18 C76 14 86 24 80 36 Z" />
      ))}
      {pts.slice(0, -1).map(([ax, ay], i) => {
        const [bx, by] = pts[i + 1]
        const mx = (ax + bx) / 2
        let ty = ay > by ? Math.max(ay, by) + 30 : Math.min(ay, by) - 70
        ty = Math.max(narrow ? 150 : 100, Math.min(h - 70, ty))
        return (
          <g key={'t' + i}>
            {i % 2 ? (
              <g transform={`translate(${mx - 6 + hash(i * 2) * 20} ${ty + 50})`}>
                <path fill="none" d="M0 2 L0 -18" />
                <path fill="#9BD37A" d="M0 -50 C14 -50 20 -38 16 -28 C20 -20 12 -12 0 -14 C-12 -12 -20 -20 -16 -28 C-20 -38 -14 -50 0 -50 Z" />
                <path fill="none" strokeWidth="1.5" d="M-6 -34 C-3 -30 3 -30 6 -34" />
              </g>
            ) : (
              <g transform={`translate(${mx - 8 + hash(i * 2) * 20} ${ty + 52})`}>
                <path fill="none" d="M0 2 L0 -10" />
                <path fill="#5FB247" d="M0 -54 L12 -32 L6 -32 L15 -12 L-15 -12 L-6 -32 L-12 -32 Z" />
              </g>
            )}
            <g transform={`translate(${mx + 30} ${ty + 62}) scale(.8)`}>
              <path fill="none" d="M0 2 L0 -10" />
              <path fill="#5FB247" d="M0 -54 L12 -32 L6 -32 L15 -12 L-15 -12 L-6 -32 L-12 -32 Z" />
            </g>
          </g>
        )
      })}
      {pts[2] && (
        <path transform={`translate(${pts[2][0] + 70} ${Math.min(h - 60, pts[2][1] + 60)})`} fill="#8FDCFF"
          d="M10 26 C8 8 50 2 78 6 C108 10 118 26 104 38 C88 50 24 48 10 26 Z M36 22 C42 18 50 18 56 22 M66 32 C70 29 76 29 80 32" />
      )}
      {/* start sign (wide layout only; on phones it would sit on the first label) */}
      {!narrow && <g transform={`translate(4 ${pts[0][1] - 70})`}>
        <path fill="none" d="M20 68 L20 20" />
        <path fill="#FFD94A" d="M4 12 L54 12 L64 22 L54 32 L4 32 Z" />
        <text x="11" y="27" fontSize="11" fontWeight="800" fill="var(--ink)" stroke="none" letterSpacing=".06em">START</text>
      </g>}
    </g>
  )
}

export default function Journey({ stops }) {
  const viewRef = useRef(null)
  const roadRef = useRef(null)
  const duckRef = useRef(null)
  const duckFaceRef = useRef(null)
  const duckBodyRef = useRef(null)
  const closeTimer = useRef(0)
  const drag = useRef(null)
  const sim = useRef({ L: null, target: 0, lastPrint: 0, id: 0, stopL: [] })

  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  const [active, setActive] = useState(null)
  const [scroll, setScroll] = useState({ left: 0, width: 0, max: 1 })
  const [touched, setTouched] = useState(false)
  const [prints, setPrints] = useState([])

  const L = LAYOUTS[narrow ? 'narrow' : 'wide']
  const n = stops.length
  const pts = useMemo(() => stops.map((_, i) => [L.x0 + i * L.spacing, L.ys[i % L.ys.length]]), [stops, L])
  const trackW = L.x0 + (n - 1) * L.spacing + 200
  const d = useMemo(() => roadPath(pts, -40, trackW + 40), [pts, trackW])
  const duckW = crewWidth('duck', L.duck)

  useEffect(() => {
    const on = () => setNarrow(window.innerWidth < 768)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  // where each stop sits along the road, so the duck can walk to it
  useLayoutEffect(() => {
    const path = roadRef.current
    if (!path) return
    const total = path.getTotalLength()
    sim.current.stopL = pts.map(([sx, sy]) => {
      let best = 0
      let bestD = Infinity
      for (let l = 0; l <= total; l += 4) {
        const p = path.getPointAtLength(l)
        const dd = (p.x - sx) ** 2 + (p.y - sy) ** 2
        if (dd < bestD) { bestD = dd; best = l }
      }
      return best
    })
    sim.current.L = null
  }, [pts])

  const readScroll = useCallback(() => {
    const v = viewRef.current
    if (!v) return
    setScroll({ left: v.scrollLeft, width: v.clientWidth, max: Math.max(1, v.scrollWidth - v.clientWidth) })
  }, [])
  useEffect(() => {
    readScroll()
    window.addEventListener('resize', readScroll)
    return () => window.removeEventListener('resize', readScroll)
  }, [readScroll, narrow])

  // the stop closest to the middle of the view
  const nearest = useMemo(() => {
    const mid = scroll.left + scroll.width / 2
    let best = 0
    pts.forEach(([x], i) => { if (Math.abs(x - mid) < Math.abs(pts[best][0] - mid)) best = i })
    return best
  }, [scroll, pts])
  const current = active ?? nearest

  // the duck walks the road towards the current stop, leaving footprints
  useEffect(() => {
    sim.current.target = current
  }, [current])
  useEffect(() => {
    const path = roadRef.current
    if (!path) return
    const s = sim.current
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let last = performance.now()
    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const goal = Math.max(0, (s.stopL[s.target] ?? 0) - 58)
      if (s.L == null || reduced) s.L = goal
      const diff = goal - s.L
      const moving = Math.abs(diff) > 1
      if (moving) s.L += Math.sign(diff) * Math.min(Math.abs(diff), 240 * dt)
      const p = path.getPointAtLength(s.L)
      if (duckRef.current) duckRef.current.style.transform = `translate3d(${(p.x - duckW / 2).toFixed(1)}px, ${(p.y - L.duck + 14).toFixed(1)}px, 0)`
      if (duckFaceRef.current && moving) duckFaceRef.current.style.transform = `scaleX(${diff < 0 ? -1 : 1})`
      if (duckBodyRef.current) duckBodyRef.current.style.animationPlayState = moving ? 'running' : 'paused'
      if (moving && Math.abs(s.L - s.lastPrint) > 22) {
        s.lastPrint = s.L
        const id = ++s.id
        setPrints((ps) => [...ps.slice(-16), { id, x: p.x, y: p.y + (id % 2 ? 6 : -2) }])
      }
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [d, duckW, L.duck])

  // opening and closing a stop's card
  const open = (i) => { clearTimeout(closeTimer.current); setActive(i) }
  const closeSoon = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setActive(null), 180) }
  const isMouse = (e) => e.pointerType === 'mouse'

  const scrollToStop = (i) => {
    const v = viewRef.current
    if (!v) return
    const k = Math.max(0, Math.min(n - 1, i))
    v.scrollTo({ left: pts[k][0] - v.clientWidth / 2, behavior: 'smooth' })
    setActive(k)
  }

  // drag to scroll with a mouse
  const onPointerDown = (e) => {
    if (!isMouse(e) || e.button !== 0) return
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

  const s = active != null ? stops[active] : null
  let card = null
  if (s) {
    const [sx, sy] = pts[active]
    const cw = L.card
    const lo = scroll.left + 12
    const hi = scroll.left + scroll.width - cw - 12
    const left = Math.max(lo, Math.min(hi, sx - cw / 2))
    const above = sy - L.stop / 2 - 22 - CARD_H >= 8
    card = { s, left, above, sx, sy, cw, tail: Math.max(20, Math.min(cw - 20, sx - left)) }
  }

  return (
    <div>
      <div className="relative rounded-[18px] md:rounded-[24px] border-[2.5px] border-ink bg-map shadow-hard overflow-hidden">
        <div
          ref={viewRef}
          className="no-scrollbar overflow-x-auto overflow-y-hidden overscroll-x-contain"
          onScroll={() => { setTouched(true); requestAnimationFrame(readScroll) }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          tabIndex={0}
          aria-label="My journey map. Scroll sideways to follow the road."
        >
          <div className="relative" style={{ width: trackW, height: L.vh }}>
            <svg className="absolute inset-0" width={trackW} height={L.vh} viewBox={`0 0 ${trackW} ${L.vh}`} aria-hidden="true">
              <Scenery w={trackW} h={L.vh} pts={pts} narrow={narrow} />
              <path d={d} fill="none" stroke="var(--ink)" strokeWidth={L.road + 5} strokeLinecap="round" />
              <path d={d} fill="none" stroke="#F2D9A0" strokeWidth={L.road} strokeLinecap="round" />
              <path ref={roadRef} d={d} fill="none" stroke="var(--ink)" strokeWidth="2" strokeDasharray="8 10" opacity=".5" />
            </svg>

            {/* footprints */}
            {prints.map((p) => (
              <svg key={p.id} width="10" height="8" viewBox="0 0 10 8" className="absolute pointer-events-none" aria-hidden="true"
                style={{ left: p.x - 5, top: p.y - 4, animation: 'footprint 2.4s ease-out forwards' }}
                onAnimationEnd={() => setPrints((ps) => ps.filter((q) => q.id !== p.id))}>
                <path d="M5 8 L0 0 M5 8 L5 0 M5 8 L10 0" fill="none" stroke="#FF9F1C" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            ))}

            {/* stops */}
            {stops.map((st, i) => {
              const [sx, sy] = pts[i]
              const below = narrow ? sy < L.vh - 90 : sy >= L.vh * 0.5
              const on = active === i
              return (
                <div key={i}>
                  <button
                    type="button"
                    className="absolute z-10 grid place-items-center rounded-full border-[2.5px] border-ink shadow-lift transition-transform duration-300 ease-[cubic-bezier(.3,1.5,.5,1)] hover:scale-110"
                    style={{ left: sx - L.stop / 2, top: sy - L.stop / 2, width: L.stop, height: L.stop, background: st.color, transform: on ? 'scale(1.1)' : undefined }}
                    aria-label={`${st.date}: ${st.title}`}
                    aria-expanded={on}
                    onPointerEnter={(e) => isMouse(e) && open(i)}
                    onPointerLeave={(e) => isMouse(e) && closeSoon()}
                    onFocus={() => open(i)}
                    onBlur={closeSoon}
                    onClick={(e) => { if (e.nativeEvent.pointerType !== 'mouse') setActive((a) => (a === i ? null : i)) }}
                  >
                    {on && <span className="absolute -inset-[11px] rounded-full border-2 border-dashed border-ink" aria-hidden="true" />}
                    <svg viewBox="-16 -16 32 32" width={L.stop * 0.5} height={L.stop * 0.5} className="doodle-icon" style={{ strokeWidth: 2.2 }} aria-hidden="true">
                      <Doodle kind={st.icon} />
                    </svg>
                  </button>
                  {!on && (
                    <div
                      className="absolute z-[5] flex flex-col items-center gap-1 w-[160px] -translate-x-1/2 text-center pointer-events-none"
                      style={below ? { left: sx, top: sy + L.stop / 2 + 10 } : { left: sx, bottom: L.vh - (sy - L.stop / 2 - 10) }}
                    >
                      <span className="chip border-[1.5px] px-2.5 py-0.5 text-[11px] font-bold">{st.date}</span>
                      <span className="text-[13px] md:text-[15px] font-bold leading-tight">{st.title}</span>
                    </div>
                  )}
                </div>
              )
            })}

            {/* the duck */}
            <div ref={duckRef} className="absolute left-0 top-0 z-[8] pointer-events-none will-change-transform" style={{ width: duckW }} aria-hidden="true">
              <div ref={duckFaceRef}>
                <div ref={duckBodyRef} style={{ animation: 'waddle .45s ease-in-out infinite', transformOrigin: '50% 100%' }}>
                  <Crew kind="duck" height={L.duck} look={{ x: 0.8, y: -0.4 }} />
                </div>
              </div>
            </div>

            {/* the opened stop */}
            {card && (
              <div
                key={active}
                className="absolute z-20"
                style={{
                  left: card.left,
                  width: card.cw,
                  ...(card.above ? { bottom: L.vh - (card.sy - L.stop / 2 - 20) } : { top: card.sy + L.stop / 2 + 20 }),
                  transformOrigin: `${card.tail}px ${card.above ? '100%' : '0%'}`,
                  animation: 'cardGrow .35s cubic-bezier(.3,1.4,.5,1) both',
                }}
                onPointerEnter={(e) => isMouse(e) && open(active)}
                onPointerLeave={(e) => isMouse(e) && closeSoon()}
                role="dialog"
                aria-label={card.s.title}
              >
                <div className="relative rounded-[18px] border-[2.5px] border-ink bg-white p-5 shadow-hard">
                  <div className="flex items-center gap-2">
                    <span className="chip border-[1.5px] px-2.5 py-0.5 text-xs font-bold" style={{ background: card.s.color === '#FFFFFF' || card.s.color === '#E8402A' ? '#FFD94A' : card.s.color }}>
                      {card.s.date}
                    </span>
                    {card.s.dummy && <span className="chip border border-muted px-2 py-0.5 text-[11px] text-muted">dummy</span>}
                  </div>
                  <h3 className="mt-2.5 font-display font-black text-[19px] md:text-[21px] leading-[1.15]">{card.s.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-accent">{card.s.org}</p>
                  <p className="mt-2 text-sm leading-relaxed text-soft">{card.s.description}</p>
                  {card.s.tags.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {card.s.tags.map((t) => <li key={t} className="chip border-[1.2px] bg-paper px-2 py-0.5 text-[11px]">{t}</li>)}
                    </ul>
                  )}
                  {active === n - 1 && (
                    <a href={`mailto:${EMAIL}`} className="btn btn-solid mt-4 h-11 text-sm">
                      <DoodleIcon kind="plane" size={18} stroke="var(--paper)" className="btn-icon" /> Email me
                    </a>
                  )}
                  <span
                    className={`absolute w-4 h-4 bg-white border-ink -translate-x-1/2 rotate-45 ${card.above ? '-bottom-[9.5px] border-r-[2.5px] border-b-[2.5px]' : '-top-[9.5px] border-l-[2.5px] border-t-[2.5px]'}`}
                    style={{ left: card.tail }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* edge fades + hint */}
        <div className={`pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-map to-transparent transition-opacity ${scroll.left > 4 ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-map to-transparent transition-opacity ${scroll.left < scroll.max - 4 ? 'opacity-100' : 'opacity-0'}`} />
        <span className={`pointer-events-none absolute left-4 bottom-4 chip border-[1.5px] px-3 py-1 text-xs font-bold transition-opacity duration-500 ${touched ? 'opacity-0' : 'opacity-100'}`}>
          {narrow ? 'swipe sideways →' : 'scroll sideways →'}
        </span>
      </div>

      {/* controls */}
      <div className="mt-6 flex items-center gap-2.5">
        <button type="button" onClick={() => scrollToStop(current - 1)} disabled={current === 0}
          className="grid place-items-center w-11 h-11 rounded-full border-2 border-ink bg-white shadow-lift-sm disabled:opacity-40 hover:-translate-y-0.5 transition-transform" aria-label="Previous stop">
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 1 L1 8 L8 15" /></svg>
        </button>
        <button type="button" onClick={() => scrollToStop(current + 1)} disabled={current === n - 1}
          className="grid place-items-center w-11 h-11 rounded-full border-2 border-ink bg-ink text-paper shadow-[0_3px_0_#E8402A] disabled:opacity-40 hover:-translate-y-0.5 transition-transform" aria-label="Next stop">
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1 L8 8 L1 15" /></svg>
        </button>
        <div className="ml-4 w-[clamp(140px,18vw,260px)] h-2 rounded-full border-[1.5px] border-ink bg-white overflow-hidden" aria-hidden="true">
          <div className="h-full rounded-full bg-sun border-r-[1.5px] border-ink transition-[width] duration-150" style={{ width: `${Math.max(8, (scroll.left / scroll.max) * 100)}%` }} />
        </div>
        <span className="ml-2 text-sm font-bold tabular-nums" aria-live="polite">{current + 1} / {n}</span>
      </div>
    </div>
  )
}
