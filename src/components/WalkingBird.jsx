import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Crew from './doodle/Crew'
import { crewWidth, groundPath, hash, tuftsPath } from './doodle/geometry'

const SPEED = 46 // px per second
const STEP = 26 // px between footprints

/**
 * Pip, the bird that lives on the Home page: it walks back and forth along the
 * ground line leaving footprints that fade, stops now and then to peck, watches
 * the cursor, stops and looks up on hover, and hops + talks when clicked.
 * With reduced motion it just sits on the line.
 */
export default function WalkingBird({ messages, intro, size = 96 }) {
  const wrapRef = useRef(null)
  const birdRef = useRef(null)
  const facingRef = useRef(null)
  const bubbleRef = useRef(null)
  const tailRef = useRef(null)
  const placeRef = useRef(null)
  const state = useRef({ x: 0, dir: 1, w: 0, hover: false, pauseUntil: 0, nextPause: 0, lastPrint: 0, printUp: 0, id: 0 })
  const [prints, setPrints] = useState([])
  const [pecking, setPecking] = useState(false)
  const [hop, setHop] = useState(0)
  const [bubble, setBubble] = useState(intro || null)
  const [clicked, setClicked] = useState(false)
  const msgIndex = useRef(0)
  const bubbleTimer = useRef(0)
  const birdW = crewWidth('bird', size)

  // a new line: lay the bubble out before it paints
  useLayoutEffect(() => {
    state.current.talking = !!bubble // Pip stands still while it talks
    placeRef.current?.()
  }, [bubble])

  // the intro line goes away on its own
  useEffect(() => {
    if (!intro) return
    bubbleTimer.current = window.setTimeout(() => setBubble(null), 7000)
    return () => clearTimeout(bubbleTimer.current)
  }, [intro])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const s = state.current
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const place = () => {
      if (birdRef.current) birdRef.current.style.transform = `translate3d(${s.x.toFixed(1)}px,0,0)`
      if (facingRef.current) facingRef.current.style.transform = `scaleX(${s.dir})`
      // keep the speech bubble on screen, its tail still pointing at Pip
      const bub = bubbleRef.current
      if (bub) {
        const bw = bub.offsetWidth
        const want = s.x + birdW / 2 - bw / 2
        const left = Math.min(Math.max(want, 8), Math.max(8, s.w - bw - 8))
        bub.style.left = `${(left - s.x).toFixed(1)}px`
        if (tailRef.current) tailRef.current.style.left = `${(s.x + birdW / 2 - left).toFixed(1)}px`
      }
    }
    placeRef.current = place
    const measure = () => {
      s.w = wrap.clientWidth
      if (!s.w) return
      if (!s.started) {
        s.started = true
        s.x = Math.min(s.w * (s.w >= 768 ? 0.44 : 0.4), s.w - birdW - 40)
      }
      s.x = Math.min(Math.max(s.x, 16), Math.max(16, s.w - birdW - 16))
      s.lastPrint = s.x
      place()
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    if (reduced) return () => ro.disconnect()

    let raf = 0
    let last = performance.now()
    s.nextPause = last + 3000 + Math.random() * 3000
    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (document.hidden) return
      // pause to peck now and then
      if (!s.hover && now > s.nextPause && now > s.pauseUntil) {
        s.pauseUntil = now + 1300
        s.nextPause = now + 4500 + Math.random() * 5000
        setPecking(true)
        window.setTimeout(() => setPecking(false), 1300)
      }
      if (s.hover || s.talking || now < s.pauseUntil) return
      // on wide screens Pip keeps to the right of the text, so a bubble never covers the buttons
      const lo = s.w >= 768 ? s.w * 0.36 : 16
      const hi = Math.max(lo + 1, s.w - birdW - 16)
      s.x += s.dir * SPEED * dt
      if (s.x > hi) { s.x = hi; s.dir = -1 }
      if (s.x < lo) { s.x = lo; s.dir = 1 }
      if (Math.abs(s.x - s.lastPrint) >= STEP) {
        s.lastPrint = s.x
        s.printUp = 1 - s.printUp
        const id = ++s.id
        const px = s.x + birdW / 2 - s.dir * birdW * 0.32
        setPrints((p) => [...p.slice(-28), { id, x: px, up: s.printUp, dir: s.dir }])
      }
      place()
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [birdW])

  const onClick = () => {
    setClicked(true)
    setHop((h) => h + 1)
    const text = messages[msgIndex.current % messages.length]
    msgIndex.current += 1
    setBubble(text)
    clearTimeout(bubbleTimer.current)
    bubbleTimer.current = window.setTimeout(() => setBubble(null), 3600)
  }

  const W = 1440
  return (
    <div ref={wrapRef} className="relative w-full h-[150px] md:h-[170px] mt-[112px] md:mt-0 select-none" aria-label="Pip the bird">
      {/* ground */}
      <svg className="absolute inset-x-0 bottom-[56px] w-full h-4 overflow-visible" viewBox={`0 0 ${W} 16`} preserveAspectRatio="none" aria-hidden="true">
        <path d={groundPath(W, 5)} fill="none" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d={tuftsPath(W, 18, 4)} transform="translate(0 -8)" fill="none" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="absolute inset-x-0 bottom-[30px] h-5" aria-hidden="true">
        {Array.from({ length: 8 }, (_, k) => (
          <span key={k} className="absolute rounded-full border-[1.6px] border-ink bg-paper"
            style={{ left: `${4 + hash(k * 13.7) * 92}%`, top: hash(k * 2.9) * 10, width: 6 + hash(k * 4.4) * 7, height: 4 + hash(k * 4.4) * 5 }} />
        ))}
      </div>

      {/* footprints, fading */}
      <div className="absolute inset-x-0 bottom-[44px] h-4 pointer-events-none" aria-hidden="true">
        {prints.map((p) => (
          <svg key={p.id} width="10" height="8" viewBox="0 0 10 8" className="absolute"
            style={{ left: p.x, top: p.up ? 6 : 0, transform: `scaleX(${p.dir})`, animation: 'footprint 2.6s ease-out forwards' }}
            onAnimationEnd={() => setPrints((ps) => ps.filter((q) => q.id !== p.id))}>
            <path d="M5 8 L0 0 M5 8 L5 0 M5 8 L10 0" fill="none" stroke="#FF9F1C" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        ))}
      </div>

      {/* Pip */}
      <div ref={birdRef} className="absolute left-0 bottom-[60px] will-change-transform" style={{ width: birdW }}>
        {bubble && (
          <div ref={bubbleRef} key={bubble} className="absolute bottom-[calc(100%+14px)] w-max max-w-[230px]" role="status">
            <div
              className="relative rounded-2xl border-2 border-ink bg-paper px-3.5 py-2 text-[13px] md:text-sm font-bold leading-snug shadow-hard-sm -rotate-2"
              style={{ animation: 'cardGrow .32s cubic-bezier(.3,1.6,.5,1) both', transformOrigin: '50% 100%' }}
            >
              {bubble}
              <span ref={tailRef} className="absolute left-1/2 -bottom-[9px] w-3.5 h-3.5 bg-paper border-r-2 border-b-2 border-ink -translate-x-1/2 rotate-45" />
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={onClick}
          onPointerEnter={() => (state.current.hover = true)}
          onPointerLeave={() => (state.current.hover = false)}
          className="block origin-bottom"
          aria-label="Pip the bird. Click to hear what it says."
        >
          <div ref={facingRef} className="origin-bottom">
            <div key={hop} style={hop ? { animation: 'hop .62s cubic-bezier(.3,.7,.4,1)' } : undefined} className="origin-bottom">
              <div style={pecking ? { animation: 'peck 1.3s ease-in-out', transformOrigin: '50% 100%' } : { animation: 'waddle .5s ease-in-out infinite', transformOrigin: '50% 100%' }}>
                <Crew kind="bird" height={size} look={{ x: 0.6, y: -0.3 }} />
              </div>
            </div>
          </div>
        </button>
      </div>

      <p className={`absolute left-1/2 -translate-x-1/2 bottom-2 font-serif italic text-[15px] md:text-base text-soft transition-opacity duration-500 ${clicked ? 'opacity-0' : 'opacity-100'}`}>
        psst, click Pip
      </p>
    </div>
  )
}
