import { useEffect, useId, useRef } from 'react'
import { ART } from './crew-art'
import { crewBox, lookAt } from './geometry'

const IDLE = {
  peck: 'peck 5.5s ease-in-out infinite',
  bob: 'bob 3.2s ease-in-out infinite',
}

/**
 * One doodle-crew character as a standalone SVG.
 * Its eyes follow the pointer (on devices that have one) and it blinks now and then.
 */
export default function Crew({
  kind,
  height = 120,
  flip = false,
  bg = 'var(--paper)',
  follow = true,
  look = { x: 0, y: 0 },
  idle = false,
  className = '',
  style,
  label,
}) {
  const art = ART[kind]
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const svgRef = useRef(null)
  const pupils = useRef([])
  const lids = useRef([])
  const box = crewBox(kind, flip)
  const width = (height * box.w) / box.h
  const sx = flip ? -1 : 1

  // eyes: follow the pointer, with a resting gaze when it's away
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const place = (tx, ty) => {
      art.eyes.forEach((e, i) => {
        const p = pupils.current[i]
        if (!p) return
        const o = tx == null ? { x: look.x * e.max, y: look.y * e.max } : lookAt(e.x * sx, e.y, tx, ty, e.max, 160)
        p.setAttribute('transform', `translate(${(o.x * sx).toFixed(2)} ${o.y.toFixed(2)})`)
      })
    }
    place(null)
    if (!follow || typeof window === 'undefined' || !window.matchMedia?.('(pointer: fine)').matches) return
    let raf = 0
    let last = null
    const onMove = (ev) => {
      last = ev
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const m = svg.getScreenCTM()
        if (!m || !last) return
        const inv = m.inverse()
        const x = inv.a * last.clientX + inv.c * last.clientY + inv.e
        const y = inv.b * last.clientX + inv.d * last.clientY + inv.f
        place(x, y)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [art, follow, look.x, look.y, sx])

  // blink every few seconds
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    let t1 = 0
    let t2 = 0
    const set = (s) =>
      art.eyes.forEach((e, i) => {
        const g = lids.current[i]
        if (g) g.setAttribute('transform', s === 1 ? '' : `translate(0 ${(e.y * (1 - s)).toFixed(2)}) scale(1 ${s})`)
      })
    const loop = () => {
      t1 = window.setTimeout(() => {
        set(0.12)
        t2 = window.setTimeout(() => {
          set(1)
          loop()
        }, 130)
      }, 2200 + Math.random() * 4000)
    }
    loop()
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [art])

  const hatch = `url(#${uid}-hatch)`
  const idleStyle = idle && art.idle ? { animation: IDLE[art.idle], transformBox: 'fill-box', transformOrigin: '50% 100%' } : undefined

  return (
    <svg
      ref={svgRef}
      className={'doodle-art overflow-visible ' + className}
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      width={width}
      height={height}
      style={{ '--art-bg': bg, ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <pattern id={`${uid}-hatch`} width="4.6" height="4.6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <line x1="0" y1="0" x2="0" y2="4.6" stroke="var(--art-ink, #141414)" strokeWidth="1.25" />
        </pattern>
      </defs>
      <g transform={flip ? 'scale(-1 1)' : undefined}>
        <g style={idleStyle}>
          {art.body(hatch)}
          {art.eyes.map((e, i) => (
            <g key={i} ref={(el) => (lids.current[i] = el)}>
              {e.r > 0 && <circle cx={e.x} cy={e.y} r={e.r} />}
              <g ref={(el) => (pupils.current[i] = el)}>
                <circle className="k" cx={e.x} cy={e.y} r={e.pupil} />
                <circle className="glint" cx={e.x + e.pupil * 0.35} cy={e.y - e.pupil * 0.4} r={e.pupil * 0.32} />
              </g>
            </g>
          ))}
          {art.after?.()}
          {art.front?.()}
        </g>
      </g>
    </svg>
  )
}
