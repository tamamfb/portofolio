"use client"

import * as React from "react"
import { Link as RouterLink } from "react-router-dom"
import { ART } from "../doodle/crew-art"
import { Doodle } from "../doodle/art"
import { hash } from "../doodle/geometry"

/**
 * Doodle Crew Footer — adapted from the 21st.dev component of the same name.
 *
 * The brand's name is stamped across the footer in giant dry-brush ink and a
 * crew of hand-drawn characters lives on the letters. Scroll it into view and
 * it plays out like a storyboard: the ground line draws, the letters stamp down,
 * the crew pops up, doodles start to drift. Then it stays alive: eyes follow the
 * pointer and blink, lines boil, a click on a character makes it hop and talk,
 * and doodles scatter from the pointer and pop when caught.
 *
 * Changes from the original: plain JSX, the characters come from the site's
 * shared doodle art (adds the duck), links can be router links (`to`), and the
 * brand + link columns sit below the wordmark instead of above it.
 */

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)

const layoutWord = (advances, tracking, fontSize) => {
  const x = []
  const w = []
  let at = 0
  const gap = (Number.isFinite(tracking) ? tracking : 0) * fontSize
  for (let i = 0; i < advances.length; i++) {
    const a = Number.isFinite(advances[i]) && advances[i] > 0 ? advances[i] : 0
    x.push(at)
    w.push(a)
    at += a + (i < advances.length - 1 ? gap : 0)
  }
  return { x, w, width: Math.max(0, at) }
}

const seatPoint = (seat, letterX, letterW, cap, offset, scale) => {
  const x = letterX + letterW * (0.5 + (Number.isFinite(offset) ? offset : 0))
  if (seat === "top") return { x, y: -cap }
  if (seat === "behind") return { x, y: -cap + 30 * scale }
  return { x, y: 0 }
}

const lookAt = (ex, ey, tx, ty, max, reach) => {
  const dx = tx - ex
  const dy = ty - ey
  const d = Math.hypot(dx, dy)
  if (!Number.isFinite(d) || d < 1e-6 || max <= 0) return { x: 0, y: 0 }
  const k = (max * Math.min(1, d / Math.max(1e-6, reach))) / d
  return { x: dx * k, y: dy * k }
}

const stepFloater = (f, dt, t, w, h, px, py, radius, rand) => {
  const step = clamp(Number.isFinite(dt) ? dt : 0, 0, 0.05)
  const m = 40
  if (f.pop > 0) {
    f.pop -= step
    if (f.pop <= 0) {
      f.pop = 0
      f.x = rand() * w
      f.y = -m
      f.vx = 0
      f.vy = f.fall
    }
    return f
  }
  const sway = Math.sin(t * 0.7 + f.phase) * 14
  if (Number.isFinite(px) && Number.isFinite(py) && radius > 0) {
    const dx = f.x - px
    const dy = f.y - py
    const d = Math.hypot(dx, dy)
    if (d < radius && d > 0.01) {
      const k = (1 - d / radius) * (1 - d / radius) * 2400
      f.vx += (dx / d) * k * step
      f.vy += (dy / d) * k * step
      f.vr += (dx > 0 ? 1 : -1) * k * 0.004 * step
    }
  }
  const ease = Math.min(1, step * 2.4)
  f.vx += (sway - f.vx) * ease
  f.vy += (f.fall - f.vy) * ease
  f.vr += (Math.sin(f.phase * 3) * 18 - f.vr) * Math.min(1, step * 0.8)
  f.x += f.vx * step
  f.y += f.vy * step
  f.rot = (f.rot + f.vr * step) % 360
  if (f.y > h + m) {
    f.y = -m
    f.x = rand() * w
  } else if (f.y < -m * 3) {
    f.y = h + m
  }
  if (f.x < -m) f.x = w + m
  else if (f.x > w + m) f.x = -m
  return f
}

const timeline = (letters, crew, words, actions) => {
  const L = Math.max(0, Math.floor(letters) || 0)
  const C = Math.max(0, Math.floor(crew) || 0)
  const W = Math.max(0, Math.floor(words) || 0)
  const A = Math.max(0, Math.floor(actions) || 0)
  const letter = (i) => 160 + i * 80
  const crewStart = letter(Math.max(0, L - 1)) + 420
  const member = (j) => crewStart + j * 130
  const doodles = crewStart + Math.max(0, C - 1) * 130 * 0.5
  const copy = crewStart + 260
  const word = (k) => copy + k * 45
  const actionsStart = word(W) + 120
  const action = (k) => actionsStart + k * 110
  return { ground: 60, letter, crewStart, member, doodles, word, action }
}

const PRESETS = {
  paper: { background: "#FFFBF0", ink: "#141414", accent: "#E8402A", crew: "#FFFBF0" },
  sunny: { background: "#FFD94A", ink: "#141414", accent: "#E8402A", crew: "#FFFBF0" },
  night: { background: "#0e0e10", ink: "#f4f1ea", accent: "#ff8a3d", crew: "#0e0e10" },
}

const FONT_SIZE = 200
const DEFAULT_FONT = 'Montserrat, "Arial Black", Inter, "Helvetica Neue", Arial, sans-serif'
const DEFAULT_SERIF = '"Playfair Display", "Iowan Old Style", Georgia, serif'

const estimate = (word) => ({
  advances: Array.from(word).map((c) => (c === " " ? 0.3 : /[IJ1]/.test(c) ? 0.42 : /[MW]/.test(c) ? 0.98 : 0.76) * FONT_SIZE),
  cap: 0.7 * FONT_SIZE,
})

const measure = (word, family) => {
  if (typeof document === "undefined") return null
  const ctx = document.createElement("canvas").getContext("2d")
  if (!ctx) return null
  ctx.font = "900 " + FONT_SIZE + "px " + family
  const chars = Array.from(word)
  const advances = []
  let prev = 0
  for (let i = 0; i < chars.length; i++) {
    const wNow = ctx.measureText(chars.slice(0, i + 1).join("")).width
    advances.push(wNow - prev)
    prev = wNow
  }
  const m = ctx.measureText(word.replace(/\s/g, "") || "H")
  const cap = m.actualBoundingBoxAscent > 0 ? m.actualBoundingBoxAscent : 0.7 * FONT_SIZE
  return { advances, cap }
}

const useIso = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

const DoodleIcon = ({ kind, size = 18 }) => (
  <svg className="dcf-icon" viewBox="-16 -16 32 32" width={size} height={size} aria-hidden="true">
    <Doodle kind={kind} />
  </svg>
)

const FooterLink = ({ link, className }) => {
  const inner = (
    <>
      <span>{link.label}</span>
      <svg className="dcf-squiggle" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength={1} d="M1 5 C10 1 16 7 25 4 S40 1 50 4 S66 7 75 4 S90 1 99 4" />
      </svg>
    </>
  )
  if (link.to) return <RouterLink className={className} to={link.to}>{inner}</RouterLink>
  if (link.href) {
    const ext = /^https?:/.test(link.href)
    return (
      <a className={className} href={link.href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : null)}>
        {inner}
      </a>
    )
  }
  return <span className={className}>{link.label}</span>
}

export default function DoodleCrewFooter({
  wordmark = "MISCHIEF",
  brand = "mischief",
  logo = null,
  blurb = "",
  tagline = "",
  columns = [],
  actions = [],
  copyright = "",
  socials = [],
  backToTop = true,
  crew = [],
  doodles = ["star", "heart", "sparkle", "bolt", "plane", "star", "chart", "heart", "sparkle", "flame"],
  doodleCount = 10,
  preset = "sunny",
  palette,
  fontFamily = DEFAULT_FONT,
  serifFamily = DEFAULT_SERIF,
  tracking = -0.03,
  interactive = true,
  className,
}) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "")
  const word = wordmark.toUpperCase()
  const chars = React.useMemo(() => Array.from(word), [word])
  const colors = { ...(PRESETS[preset] || PRESETS.sunny), ...(palette || {}) }

  const rootRef = React.useRef(null)
  const svgRef = React.useRef(null)
  const worldRef = React.useRef(null)
  const crewLayerRefs = React.useRef([])
  const eyeRefs = React.useRef([])
  const doodleRefs = React.useRef([])

  const [metrics, setMetrics] = React.useState(() => estimate(word))
  const [play, setPlay] = React.useState(false)
  const [reduced, setReduced] = React.useState(false)
  const [talking, setTalking] = React.useState(-1)
  const [hopping, setHopping] = React.useState(-1)
  const talkTimer = React.useRef(0)

  // measure the real face, again once the web font lands
  useIso(() => {
    const run = () => {
      const m = measure(word, fontFamily)
      if (m) setMetrics(m)
    }
    run()
    const fonts = typeof document !== "undefined" ? document.fonts : undefined
    if (!fonts) return
    let alive = true
    fonts.ready.then(() => alive && run())
    fonts.addEventListener?.("loadingdone", run)
    return () => {
      alive = false
      fonts.removeEventListener?.("loadingdone", run)
    }
  }, [word, fontFamily])

  const layout = React.useMemo(() => layoutWord(metrics.advances, tracking, FONT_SIZE), [metrics, tracking])
  const cap = metrics.cap

  const placed = React.useMemo(
    () =>
      crew
        .map((m, i) => {
          const art = ART[m.kind]
          if (!art || !chars.length) return null
          const li = clamp(Math.floor(m.letter) || 0, 0, chars.length - 1)
          const scale = (cap / 144) * art.k * (m.scale ?? 1)
          const seat = m.seat || art.seat
          const p = seatPoint(seat, layout.x[li], layout.w[li], cap, m.offset ?? 0, scale)
          return { i, m, art, seat, scale, ...p, flip: m.flip ? -1 : 1 }
        })
        .filter(Boolean),
    [crew, chars.length, layout, cap],
  )

  // the viewBox hugs the word, the crew and the ground
  const view = React.useMemo(() => {
    let l = 0
    let r = layout.width
    let t = -cap
    let b = 30
    for (const p of placed) {
      const bx = p.flip > 0 ? [p.art.box.l, p.art.box.r] : [-p.art.box.r, -p.art.box.l]
      l = Math.min(l, p.x + bx[0] * p.scale)
      r = Math.max(r, p.x + bx[1] * p.scale)
      t = Math.min(t, p.y + p.art.box.t * p.scale)
      b = Math.max(b, p.y + p.art.box.b * p.scale)
    }
    const pad = 24
    return { x: l - pad, y: t - pad, w: r - l + pad * 2, h: b - t + pad * 2 }
  }, [layout, placed, cap])

  const words = tagline.split(/\s+/).filter(Boolean)
  const tl = timeline(chars.length, placed.length, words.length, actions.length)

  const ground = React.useMemo(() => {
    const x0 = view.x + 6
    const x1 = view.x + view.w - 6
    let d = "M" + x0.toFixed(1) + " 6"
    const n = 14
    for (let k = 1; k <= n; k++) {
      const x = x0 + ((x1 - x0) * k) / n
      d += " Q" + (x - (x1 - x0) / n / 2).toFixed(1) + " " + (6 + (hash(k * 3.1) - 0.5) * 5).toFixed(1) + " " + x.toFixed(1) + " " + (6 + (hash(k * 7.7) - 0.5) * 2).toFixed(1)
    }
    let tufts = ""
    for (let k = 0; k < 22; k++) {
      const x = x0 + 20 + hash(k * 11.3) * (x1 - x0 - 40)
      const s = 0.7 + hash(k * 5.9) * 0.6
      tufts += "M" + x.toFixed(1) + " 6 l" + (2 * s).toFixed(1) + " " + (-9 * s).toFixed(1) + " M" + (x + 3 * s).toFixed(1) + " 6 l" + (1 * s).toFixed(1) + " " + (-12 * s).toFixed(1) + " M" + (x + 6 * s).toFixed(1) + " 6 l" + (-1 * s).toFixed(1) + " " + (-7 * s).toFixed(1) + " "
    }
    const pebbles = Array.from({ length: 9 }, (_, k) => ({ x: x0 + 40 + hash(k * 17.1) * (x1 - x0 - 80), y: 14 + hash(k * 2.3) * 8, r: 2 + hash(k * 9.4) * 2.6 }))
    return { d, tufts, pebbles }
  }, [view])

  // ---- doodles ----
  const doodleList = React.useMemo(() => {
    const n = doodles.length ? clamp(Math.floor(doodleCount) || 0, 0, 40) : 0
    return Array.from({ length: n }, (_, k) => ({ kind: doodles[k % doodles.length], size: 24 + hash(k * 4.7) * 14 }))
  }, [doodles, doodleCount])

  const sim = React.useRef({ floaters: [], w: 0, h: 0, px: NaN, py: NaN, inside: false, visible: false, gaze: [], seed: 1, start: 0 })

  const paintDoodles = () => {
    const s = sim.current
    const k = clamp(s.w / 1100, 0.6, 1)
    for (let i = 0; i < s.floaters.length; i++) {
      const el = doodleRefs.current[i]
      const f = s.floaters[i]
      if (!el || !f) continue
      let sc = k
      let op = 1
      if (f.pop > 0) {
        const age = 1.4 - f.pop
        sc = k * (1 + Math.min(1, age / 0.3) * 0.7)
        op = Math.max(0, 1 - age / 0.3)
      }
      el.style.transform = "translate3d(" + f.x.toFixed(1) + "px," + f.y.toFixed(1) + "px,0) rotate(" + f.rot.toFixed(1) + "deg) scale(" + sc.toFixed(3) + ")"
      el.style.opacity = String(op)
    }
  }

  // lay the doodles out once the world has a size; keep them across resizes
  useIso(() => {
    const el = worldRef.current
    if (!el) return
    const s = sim.current
    const size = () => {
      const r = el.getBoundingClientRect()
      const ow = s.w
      const oh = s.h
      s.w = r.width
      s.h = r.height
      if (s.floaters.length !== doodleList.length || !ow) {
        s.floaters = doodleList.map((d, k) => ({
          x: (0.04 + 0.92 * ((k + hash(k * 9.1) * 0.8) / Math.max(1, doodleList.length))) * r.width,
          y: (0.02 + hash(k * 3.3) * 0.4) * r.height,
          vx: 0,
          vy: 0,
          rot: (hash(k * 1.7) - 0.5) * 50,
          vr: (hash(k * 6.1) - 0.5) * 30,
          fall: 9 + hash(k * 2.9) * 16,
          phase: hash(k * 8.3) * Math.PI * 2,
          pop: 0,
        }))
      } else if (ow && oh) {
        for (const f of s.floaters) {
          f.x *= r.width / ow
          f.y *= r.height / oh
        }
      }
      paintDoodles()
    }
    size()
    if (typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(size)
    ro.observe(el)
    return () => ro.disconnect()
  }, [doodleList])

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener?.("change", on)
    return () => mq.removeEventListener?.("change", on)
  }, [])

  // the storyboard starts when the footer comes into view; the loop sleeps off-screen
  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const s = sim.current
    if (typeof IntersectionObserver === "undefined") {
      s.visible = true
      setPlay(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          s.visible = e.isIntersecting
          if (e.isIntersecting && e.intersectionRatio > 0.12) setPlay(true)
        }
      },
      { threshold: [0, 0.12, 0.3] },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])

  React.useEffect(() => {
    if (play && !sim.current.start) sim.current.start = performance.now()
  }, [play])

  // the living loop: eyes, blinks, doodles, line boil
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const s = sim.current
    let raf = 0
    let last = performance.now()
    let boilAt = 0
    let boil = 0
    const rand = () => {
      s.seed = (s.seed * 16807) % 2147483647
      return s.seed / 2147483647
    }
    const svgPoint = (svg, cx, cy) => {
      const m = svg.getScreenCTM()
      if (!m) return null
      const inv = m.inverse()
      return { x: inv.a * cx + inv.c * cy + inv.e, y: inv.b * cx + inv.d * cy + inv.f }
    }
    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      if (!s.visible || document.hidden) {
        last = now
        return
      }
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const t = now / 1000
      const svg = svgRef.current
      const world = worldRef.current

      let target = null
      if (svg && s.inside && interactive) target = svgPoint(svg, s.px, s.py)
      for (let c = 0; c < placed.length; c++) {
        const p = placed[c]
        const g = (s.gaze[c] ||= { tx: 0, ty: 0, next: 0, blinkAt: t + 1 + hash(c * 3.7) * 3, blink: 0, o: [] })
        if (!target && t > g.next) {
          const other = placed[(c + 1 + Math.floor(rand() * Math.max(1, placed.length - 1))) % placed.length]
          if (other && rand() < 0.45) {
            g.tx = other.x
            g.ty = other.y - 60 * other.scale
          } else {
            g.tx = p.x + (rand() - 0.5) * 900
            g.ty = p.y - 80 * p.scale + (rand() - 0.5) * 500
          }
          g.next = t + 1.4 + rand() * 2.6
        }
        if (t > g.blinkAt) {
          g.blink = 0.16
          g.blinkAt = t + 2.2 + rand() * 4
        }
        g.blink = Math.max(0, g.blink - dt)
        const lid = g.blink > 0 ? 0.12 + (Math.abs(g.blink - 0.08) / 0.08) * 0.88 : 1
        const eyes = eyeRefs.current[p.i] || []
        for (let e = 0; e < p.art.eyes.length; e++) {
          const eye = p.art.eyes[e]
          const ex = p.x + eye.x * p.scale * p.flip
          const ey = p.y + eye.y * p.scale
          const o = lookAt(ex, ey, target ? target.x : g.tx, target ? target.y : g.ty, eye.max, 220)
          const ref = eyes[e]
          if (!ref) continue
          const prev = g.o[e] || { x: 0, y: 0 }
          const ease = Math.min(1, dt * (target ? 14 : 6))
          const nx = prev.x + (o.x * p.flip - prev.x) * ease
          const ny = prev.y + (o.y - prev.y) * ease
          g.o[e] = { x: nx, y: ny }
          if (ref.pupil) ref.pupil.setAttribute("transform", "translate(" + nx.toFixed(2) + " " + ny.toFixed(2) + ")")
          if (ref.blink) ref.blink.setAttribute("transform", "translate(0 " + (eye.y * (1 - lid)).toFixed(2) + ") scale(1 " + lid.toFixed(3) + ")")
        }
      }

      if (world && s.floaters.length) {
        const started = play && s.start ? now - s.start > tl.doodles || reduced : false
        if (started) {
          const r = world.getBoundingClientRect()
          const px = s.inside && interactive ? s.px - r.left : NaN
          const py = s.inside && interactive ? s.py - r.top : NaN
          if (!reduced) for (const f of s.floaters) stepFloater(f, dt, t, s.w, s.h, px, py, 110, rand)
          paintDoodles()
        }
      }

      // line boil: three hand-drawn takes swapped at 8 fps
      if (!reduced && now - boilAt > 125) {
        boilAt = now
        boil = (boil + 1) % 3
        const f = "url(#" + uid + "-boil" + boil + ")"
        for (const el of crewLayerRefs.current) if (el) el.setAttribute("filter", f)
      }
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [placed, play, reduced, interactive, uid, tl.doodles])

  React.useEffect(() => () => window.clearTimeout(talkTimer.current), [])

  const onPointerMove = (e) => {
    const s = sim.current
    s.px = e.clientX
    s.py = e.clientY
    s.inside = true
  }
  const onPointerLeave = () => {
    sim.current.inside = false
  }

  const poke = (c) => {
    if (!interactive) return
    setTalking(c)
    setHopping(-1)
    requestAnimationFrame(() => setHopping(c))
    window.clearTimeout(talkTimer.current)
    talkTimer.current = window.setTimeout(() => {
      setTalking(-1)
      setHopping(-1)
    }, 2600)
  }

  const popDoodle = (k) => {
    if (!interactive) return
    const f = sim.current.floaters[k]
    if (f && f.pop <= 0) {
      f.pop = 1.4
      paintDoodles()
    }
  }

  const toTop = () => {
    if (typeof window === "undefined") return
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
  }

  const hatch = "url(#" + uid + "-hatch)"
  const vars = {
    "--dcf-bg": colors.background,
    "--dcf-ink": colors.ink,
    "--dcf-accent": colors.accent,
    "--dcf-serif": serifFamily,
    "--art-bg": colors.crew,
    "--art-ink": colors.ink,
    "--art-accent": colors.accent,
  }

  const pct = (v, base, span) => (((v - base) / span) * 100).toFixed(3) + "%"

  const renderCrew = (p, part) => (
    <g key={p.i + part} transform={"translate(" + p.x.toFixed(2) + " " + p.y.toFixed(2) + ") scale(" + (p.scale * p.flip).toFixed(4) + " " + p.scale.toFixed(4) + ")"}>
      <g className={"dcf-arrive dcf-arrive-" + p.seat} style={{ "--d": tl.member(p.i) + "ms" }}>
        <g className={"dcf-hopper" + (hopping === p.i ? " is-hop" : "")}>
          <g className={"doodle-art dcf-art" + (p.art.idle ? " dcf-" + p.art.idle : "")}>
            {part === "body" ? (
              <>
                {p.art.body(hatch)}
                {p.art.eyes.map((eye, e) => (
                  <g key={e} ref={(el) => { (eyeRefs.current[p.i] ||= [])[e] = { ...(eyeRefs.current[p.i]?.[e] || { pupil: null }), blink: el } }}>
                    {eye.r > 0 && <circle cx={eye.x} cy={eye.y} r={eye.r} />}
                    <g ref={(el) => { (eyeRefs.current[p.i] ||= [])[e] = { ...(eyeRefs.current[p.i]?.[e] || { blink: null }), pupil: el } }}>
                      <circle className="k" cx={eye.x} cy={eye.y} r={eye.pupil} />
                      <circle className="glint" cx={eye.x + eye.pupil * 0.35} cy={eye.y - eye.pupil * 0.4} r={eye.pupil * 0.32} />
                    </g>
                  </g>
                ))}
                {p.art.after?.()}
              </>
            ) : (
              p.art.front?.()
            )}
          </g>
        </g>
      </g>
    </g>
  )

  return (
    <footer
      ref={rootRef}
      className={"dcf" + (className ? " " + className : "")}
      data-play={play || reduced ? "1" : "0"}
      data-interactive={interactive ? "1" : "0"}
      style={vars}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <style>{CSS}</style>

      <div className="dcf-world" ref={worldRef}>
        <div className="dcf-stage">
          <h2 className="dcf-sr">{wordmark}</h2>
          <svg
            ref={svgRef}
            className="dcf-svg"
            viewBox={view.x.toFixed(1) + " " + view.y.toFixed(1) + " " + view.w.toFixed(1) + " " + view.h.toFixed(1)}
            role="group"
            aria-label={wordmark + ": meet the crew"}
          >
            <defs>
              <pattern id={uid + "-hatch"} width="4.6" height="4.6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
                <line x1="0" y1="0" x2="0" y2="4.6" style={{ stroke: "var(--dcf-ink)" }} strokeWidth="1.25" />
              </pattern>
              {[0, 1, 2].map((k) => (
                <filter key={k} id={uid + "-boil" + k} x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={k * 7 + 3} result="n" />
                  <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              ))}
              <filter id={uid + "-ink"} x="-4%" y="-6%" width="108%" height="112%">
                <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="11" result="edge" />
                <feDisplacementMap in="SourceGraphic" in2="edge" scale="5" xChannelSelector="R" yChannelSelector="G" result="rough" />
                <feTurbulence type="fractalNoise" baseFrequency="0.018 0.32" numOctaves="2" seed="4" result="streak" />
                <feColorMatrix in="streak" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -16 3.9" result="streakA" />
                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" seed="9" result="speck" />
                <feColorMatrix in="speck" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -24 4.6" result="speckA" />
                <feComposite in="streakA" in2="speckA" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="holes" />
                <feComposite in="rough" in2="holes" operator="out" />
              </filter>
            </defs>

            <g ref={(el) => void (crewLayerRefs.current[0] = el)}>
              <g className="dcf-ground">
                <path className="dcf-draw" pathLength={1} d={ground.d} style={{ "--d": tl.ground + "ms" }} />
                <path className="dcf-tufts dcf-fade" d={ground.tufts} style={{ "--d": tl.ground + 500 + "ms" }} />
                {ground.pebbles.map((pb, k) => (
                  <ellipse key={k} className="dcf-pebble dcf-fade" cx={pb.x} cy={pb.y} rx={pb.r * 1.5} ry={pb.r} style={{ "--d": tl.ground + 600 + "ms" }} />
                ))}
              </g>
              {placed.filter((p) => p.seat === "behind").map((p) => renderCrew(p, "body"))}
            </g>

            {chars.map((c, i) =>
              c === " " ? null : (
                <g key={i} className="dcf-letter" style={{ "--d": tl.letter(i) + "ms", "--r": ((hash(i * 2.3) - 0.5) * 9).toFixed(2) + "deg" }}>
                  <g className="dcf-glyph">
                    <text x={layout.x[i]} y={0} fontSize={FONT_SIZE} fontWeight={900} style={{ fontFamily }} filter={"url(#" + uid + "-ink)"}>
                      {c}
                    </text>
                  </g>
                  <path
                    className="dcf-dust"
                    d={"M" + (layout.x[i] - 6) + " -6 l-16 -6 M" + (layout.x[i] - 4) + " -16 l-12 -12 M" + (layout.x[i] + layout.w[i] + 6) + " -6 l16 -6 M" + (layout.x[i] + layout.w[i] + 4) + " -16 l12 -12"}
                  />
                </g>
              ),
            )}

            <g ref={(el) => void (crewLayerRefs.current[1] = el)}>
              {placed.filter((p) => p.seat === "behind").map((p) => renderCrew(p, "front"))}
              {placed.filter((p) => p.seat !== "behind").map((p) => renderCrew(p, "body"))}
            </g>

            {interactive &&
              placed.map((p) => {
                const bx = p.flip > 0 ? [p.art.box.l, p.art.box.r] : [-p.art.box.r, -p.art.box.l]
                const bottom = p.seat === "behind" ? -30 : p.art.box.b
                return (
                  <rect
                    key={"hit" + p.i}
                    className="dcf-hit"
                    x={p.x + bx[0] * p.scale}
                    y={p.y + p.art.box.t * p.scale}
                    width={(bx[1] - bx[0]) * p.scale}
                    height={(bottom - p.art.box.t) * p.scale}
                    rx={12}
                    role="button"
                    tabIndex={0}
                    aria-label={(p.m.name || p.m.kind) + (p.m.says ? ": " + p.m.says : "")}
                    onClick={() => poke(p.i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        poke(p.i)
                      }
                    }}
                  />
                )
              })}
          </svg>

          <div className="dcf-bubbles" aria-live="polite">
            {placed.map((p) =>
              talking === p.i && p.m.says ? (
                <div
                  key={p.i}
                  className={"dcf-bubble" + (p.x > view.x + view.w * 0.72 ? " is-left" : "")}
                  style={{ left: pct(p.x, view.x, view.w), top: pct(p.y + p.art.box.t * p.scale - 6, view.y, view.h) }}
                >
                  {p.m.says}
                </div>
              ) : null,
            )}
          </div>
        </div>

        {doodleList.length > 0 && (
          <div className="dcf-doodles" aria-hidden="true">
            {doodleList.map((d, k) => (
              <div
                key={k}
                className="dcf-doodle"
                ref={(el) => void (doodleRefs.current[k] = el)}
                style={{ width: d.size, height: d.size, marginLeft: -d.size / 2, marginTop: -d.size / 2 }}
                onPointerDown={() => popDoodle(k)}
              >
                <span className="dcf-doodle-in" style={{ "--d": tl.doodles + k * 70 + "ms" }}>
                  <svg viewBox="-16 -16 32 32" width={d.size} height={d.size}>
                    <Doodle kind={d.kind} />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="dcf-cta">
          {words.length > 0 && (
            <p className="dcf-tagline">
              {words.map((w, k) => (
                <span key={k} className="dcf-word" style={{ "--d": tl.word(k) + "ms" }}>
                  {w}{" "}
                </span>
              ))}
            </p>
          )}
          {actions.length > 0 && (
            <div className="dcf-actions">
              {actions.map((a, k) => {
                const inner = (
                  <>
                    {a.icon && <DoodleIcon kind={a.icon} />}
                    <span>{a.label}</span>
                  </>
                )
                const cls = "dcf-btn dcf-pop " + (a.variant === "outline" ? "is-outline" : "is-solid")
                const st = { "--d": tl.action(k) + "ms" }
                const ext = a.href && /^https?:/.test(a.href)
                return a.href ? (
                  <a key={a.label} className={cls} style={st} href={a.href} onClick={a.onClick} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : null)}>
                    {inner}
                  </a>
                ) : (
                  <button key={a.label} type="button" className={cls} style={st} onClick={a.onClick}>
                    {inner}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* brand + link columns, below the wordmark */}
      <div className="dcf-links dcf-rise" style={{ "--d": "0ms" }}>
        <div className="dcf-brandcol">
          <div className="dcf-brand">
            {logo && <span className="dcf-logo" aria-hidden="true">{logo}</span>}
            <span className="dcf-brandname">{brand}</span>
          </div>
          {blurb && <p className="dcf-blurb">{blurb}</p>}
        </div>
        {columns.length > 0 && (
          <nav className="dcf-cols" aria-label="Footer">
            {columns.map((col) => (
              <div className="dcf-col" key={col.title}>
                <h3 className="dcf-coltitle">{col.title}</h3>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <FooterLink link={l} className="dcf-link" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        )}
      </div>

      <div className="dcf-bar">
        <p className="dcf-copy">{copyright}</p>
        {socials.length > 0 && (
          <ul className="dcf-inline dcf-socials">
            {socials.map((l) => (
              <li key={l.label}>
                <FooterLink link={l} className="dcf-link" />
              </li>
            ))}
          </ul>
        )}
        {backToTop && (
          <button type="button" className="dcf-totop" onClick={toTop}>
            <span>Back to top</span>
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M12 20 C11 14 12.5 9 12 4 M6 10 C8 8 10 6 12 4 C14 6 16 8 18.5 9.5" />
            </svg>
          </button>
        )}
      </div>
    </footer>
  )
}

const CSS =
  ".dcf{position:relative;isolation:isolate;overflow:hidden;overflow:clip;width:100%;box-sizing:border-box;display:flex;flex-direction:column;background:var(--dcf-bg);color:var(--dcf-ink);-webkit-font-smoothing:antialiased;--dcf-soft:color-mix(in oklab,var(--dcf-ink) 70%,var(--dcf-bg));--dcf-line:color-mix(in oklab,var(--dcf-ink) 30%,var(--dcf-bg));--dcf-pad:var(--gutter,clamp(20px,6.6vw,96px))}" +
  ":where(.dcf) *,:where(.dcf) *::before,:where(.dcf) *::after{box-sizing:border-box}" +
  ":where(.dcf) a{color:inherit;text-decoration:none}" +
  ":where(.dcf) button{appearance:none;background:none;border:0;padding:0;margin:0;font:inherit;color:inherit}" +
  ":where(.dcf) h2,:where(.dcf) h3,:where(.dcf) p,:where(.dcf) ul{margin:0;padding:0}" +
  ":where(.dcf) ul{list-style:none}" +
  ".dcf svg{max-width:none;overflow:visible}" +
  ".dcf-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +
  // world
  ".dcf-world{position:relative;display:flex;flex-direction:column;padding:clamp(48px,7vw,96px) var(--dcf-pad) 0;max-width:1440px;width:100%;margin:0 auto}" +
  ".dcf-stage{position:relative;z-index:1}" +
  ".dcf-svg{display:block;width:100%;height:auto;user-select:none;-webkit-user-select:none}" +
  ".dcf-svg text{fill:var(--dcf-ink)}" +
  ".dcf-art{transform-box:fill-box}" +
  ".dcf-art.dcf-bob{animation:dcf-bob 3.2s ease-in-out infinite}" +
  ".dcf-art.dcf-peck{transform-origin:50% 100%;animation:dcf-peck 5.5s ease-in-out infinite}" +
  ".dcf .tail{transform-box:fill-box;transform-origin:0% 100%;animation:dcf-tail 2.8s ease-in-out infinite}" +
  ".dcf-ground path{fill:none;stroke:var(--dcf-ink);stroke-width:2.4;stroke-linecap:round}" +
  ".dcf-ground .dcf-tufts{stroke-width:1.8}" +
  ".dcf-pebble{fill:var(--dcf-bg);stroke:var(--dcf-ink);stroke-width:1.6}" +
  ".dcf-dust{fill:none;stroke:var(--dcf-ink);stroke-width:3;stroke-linecap:round;opacity:0}" +
  ".dcf-hit{fill:transparent;stroke:none;outline:none}" +
  ".dcf-hit:focus-visible{stroke:var(--dcf-ink);stroke-width:2.5;stroke-dasharray:6 6}" +
  ".dcf-glyph{transform-box:fill-box;transform-origin:50% 100%}" +
  ".dcf[data-interactive='1'] .dcf-glyph:hover{animation:dcf-jiggle .6s cubic-bezier(.3,1.5,.5,1)}" +
  ".dcf-hopper{transform-box:fill-box;transform-origin:50% 100%}" +
  ".dcf-hopper.is-hop{animation:dcf-hop .62s cubic-bezier(.3,.7,.4,1)}" +
  ".dcf-arrive{transform-box:fill-box;transform-origin:50% 100%}" +
  // bubbles
  ".dcf-bubbles{position:absolute;inset:0;pointer-events:none;z-index:2}" +
  ".dcf-bubble{position:absolute;transform:translate(-50%,-100%) rotate(-2deg);transform-origin:50% 100%;background:#FFFBF0;color:var(--dcf-ink);border:2px solid var(--dcf-ink);border-radius:16px;padding:7px 12px;font-size:14px;font-weight:700;line-height:1.25;white-space:nowrap;box-shadow:3px 3px 0 var(--dcf-ink);animation:dcf-bubble .32s cubic-bezier(.3,1.6,.5,1) both;margin-top:-4px}" +
  ".dcf-bubble::after{content:'';position:absolute;left:50%;bottom:-9px;width:14px;height:14px;background:#FFFBF0;border-right:2px solid var(--dcf-ink);border-bottom:2px solid var(--dcf-ink);transform:translateX(-50%) rotate(45deg) skew(8deg,8deg)}" +
  ".dcf-bubble.is-left{transform:translate(-88%,-100%) rotate(2deg);transform-origin:88% 100%}" +
  ".dcf-bubble.is-left::after{left:88%}" +
  // doodles
  ".dcf-doodles{position:absolute;inset:0;pointer-events:none;z-index:2;overflow:hidden}" +
  ".dcf-doodle{position:absolute;left:0;top:0;pointer-events:auto;will-change:transform;touch-action:manipulation}" +
  ".dcf-doodle-in{display:block;width:100%;height:100%}" +
  ".dcf[data-interactive='0'] .dcf-doodle{pointer-events:none}" +
  ".dcf-doodle svg,.dcf-icon{display:block;stroke:var(--dcf-ink);stroke-width:1.9;stroke-linejoin:round;stroke-linecap:round}" +
  ".dcf-doodle svg{width:100%;height:100%;filter:drop-shadow(2px 2px 0 color-mix(in oklab,var(--dcf-ink) 18%,transparent))}" +
  // cta
  ".dcf-cta{position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;gap:20px;padding:clamp(18px,2.6vw,30px) 0 clamp(40px,5vw,64px);text-align:center}" +
  ".dcf-tagline{font-family:var(--dcf-serif);font-style:italic;font-size:clamp(19px,1.7vw,24px);line-height:1.4;max-width:44ch;text-wrap:balance}" +
  ".dcf-word{display:inline-block;white-space:pre}" +
  ".dcf-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:12px}" +
  ".dcf-btn{display:inline-flex;align-items:center;gap:8px;height:48px;padding:0 22px 0 18px;border-radius:999px;border:2.5px solid var(--dcf-ink);font-size:15px;font-weight:700;box-shadow:0 4px 0 var(--dcf-ink);transition:transform .18s cubic-bezier(.3,1.4,.5,1),box-shadow .18s cubic-bezier(.3,1.4,.5,1)}" +
  ".dcf-btn.is-outline{background:#FFFBF0;color:var(--dcf-ink)}" +
  ".dcf-btn.is-solid{background:var(--dcf-ink);color:#FFFBF0;box-shadow:0 4px 0 var(--dcf-accent)}" +
  ".dcf-btn.is-solid .dcf-icon{stroke:#FFFBF0}" +
  ".dcf-btn:hover{transform:translateY(-2px) rotate(-1.2deg);box-shadow:0 6px 0 var(--dcf-ink)}" +
  ".dcf-btn.is-solid:hover{box-shadow:0 6px 0 var(--dcf-accent)}" +
  ".dcf-btn:active{transform:translateY(2px);box-shadow:0 1px 0 var(--dcf-ink);transition-duration:.06s}" +
  ".dcf-btn:hover .dcf-icon{animation:dcf-wiggle .5s ease-in-out}" +
  // links band
  ".dcf-links{position:relative;z-index:3;display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:clamp(24px,5vw,80px);row-gap:28px;padding:36px var(--dcf-pad) 40px;max-width:1440px;width:100%;margin:0 auto;border-top:1.5px dashed var(--dcf-line)}" +
  ".dcf-brand{display:flex;align-items:center;gap:12px}" +
  ".dcf-logo{display:block;width:44px;height:44px;border-radius:999px;overflow:hidden;border:2.5px solid var(--dcf-ink);transform:rotate(-6deg);transition:transform .35s cubic-bezier(.3,1.6,.5,1)}" +
  ".dcf-logo img{width:100%;height:100%;object-fit:cover;display:block}" +
  ".dcf-brand:hover .dcf-logo{transform:rotate(8deg) scale(1.06)}" +
  ".dcf-brandname{font-family:Montserrat,'Arial Black',sans-serif;font-weight:900;font-size:22px;letter-spacing:-.02em}" +
  ".dcf-blurb{margin-top:16px;font-family:var(--dcf-serif);font-style:italic;font-size:18px;line-height:1.5;color:var(--dcf-soft);max-width:30ch}" +
  ".dcf-cols{display:grid;grid-template-columns:repeat(3,auto);column-gap:clamp(32px,4.5vw,72px)}" +
  ".dcf-coltitle{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:14px}" +
  ".dcf-col li{margin:0 0 8px}" +
  ".dcf-link{position:relative;display:inline-block;font-size:15px;font-weight:500;color:var(--dcf-soft);padding:2px 0;transition:color .2s}" +
  ".dcf-link:hover{color:var(--dcf-ink)}" +
  ".dcf-squiggle{position:absolute;left:-2px;right:-2px;bottom:-4px;width:calc(100% + 4px);height:7px;pointer-events:none}" +
  ".dcf-squiggle path{fill:none;stroke:var(--dcf-accent);stroke-width:2.2;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .35s cubic-bezier(.4,0,.2,1)}" +
  ".dcf-link:hover .dcf-squiggle path,.dcf-link:focus-visible .dcf-squiggle path{stroke-dashoffset:0}" +
  // bar
  ".dcf-bar{position:relative;z-index:3;display:flex;flex-wrap:wrap;align-items:center;gap:12px 26px;padding:18px var(--dcf-pad) 24px;max-width:1440px;width:100%;margin:0 auto;border-top:1.5px dashed var(--dcf-line);font-size:13px}" +
  ".dcf-copy{color:var(--dcf-soft);margin-right:auto}" +
  ".dcf-inline{display:flex;flex-wrap:wrap;gap:4px 18px}" +
  ".dcf-socials .dcf-link{font-size:13px;color:var(--dcf-ink);font-weight:700}" +
  ".dcf-totop{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;padding:6px 12px;border-radius:999px;border:1.5px solid var(--dcf-ink);transition:transform .2s cubic-bezier(.3,1.5,.5,1)}" +
  ".dcf-totop svg{fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}" +
  ".dcf-totop:hover{transform:translateY(-2px)}" +
  // storyboard
  ".dcf[data-play='0'] .dcf-letter,.dcf[data-play='0'] .dcf-arrive,.dcf[data-play='0'] .dcf-word,.dcf[data-play='0'] .dcf-pop,.dcf[data-play='0'] .dcf-rise,.dcf[data-play='0'] .dcf-fade,.dcf[data-play='0'] .dcf-doodle-in{opacity:0}" +
  ".dcf[data-play='0'] .dcf-draw{stroke-dasharray:1;stroke-dashoffset:1}" +
  ".dcf-letter{transform-box:fill-box;transform-origin:50% 100%}" +
  ".dcf[data-play='1'] .dcf-letter{animation:dcf-stamp .62s cubic-bezier(.2,.8,.25,1.15) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-dust{animation:dcf-dust .5s ease-out calc(var(--d) + .22s) both}" +
  ".dcf[data-play='1'] .dcf-draw{stroke-dasharray:1;animation:dcf-draw 1.1s cubic-bezier(.6,0,.3,1) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-fade{animation:dcf-fade .6s ease-out var(--d) both}" +
  ".dcf[data-play='1'] .dcf-arrive-front{animation:dcf-rise-up .75s cubic-bezier(.3,1.5,.5,1) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-arrive-top{animation:dcf-plop .8s cubic-bezier(.3,.9,.4,1) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-arrive-behind{animation:dcf-peek .9s cubic-bezier(.3,1.4,.5,1) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-word{animation:dcf-word .6s cubic-bezier(.2,.8,.3,1) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-pop{animation:dcf-popin .55s cubic-bezier(.3,1.6,.5,1) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-rise{animation:dcf-fadeup .7s cubic-bezier(.2,.8,.3,1) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-doodle-in{animation:dcf-fade .6s ease-out var(--d) both}" +
  "@keyframes dcf-stamp{0%{opacity:0;transform:translateY(-34%) scale(1.28) rotate(var(--r))}55%{opacity:1;transform:translateY(2%) scale(.95,1.05) rotate(0deg)}75%{transform:translateY(0) scale(1.04,.95)}100%{opacity:1;transform:none}}" +
  "@keyframes dcf-dust{0%{opacity:0;stroke-dasharray:0 40}30%{opacity:.9}100%{opacity:0;stroke-dasharray:14 40;stroke-dashoffset:-16}}" +
  "@keyframes dcf-draw{to{stroke-dashoffset:0}}" +
  "@keyframes dcf-fade{from{opacity:0}to{opacity:1}}" +
  "@keyframes dcf-rise-up{0%{opacity:0;transform:translateY(30%) scale(.7,.3)}45%{opacity:1;transform:translateY(-8%) scale(.92,1.12)}70%{transform:translateY(0) scale(1.08,.92)}100%{opacity:1;transform:none}}" +
  "@keyframes dcf-plop{0%{opacity:0;transform:translateY(-90%)}50%{opacity:1;transform:translateY(0) scale(1.1,.86)}68%{transform:translateY(-10%) scale(.96,1.04)}84%{transform:translateY(0) scale(1.03,.97)}100%{opacity:1;transform:none}}" +
  "@keyframes dcf-peek{0%{opacity:0;transform:translateY(55%)}60%{opacity:1;transform:translateY(-6%)}100%{opacity:1;transform:none}}" +
  "@keyframes dcf-word{from{opacity:0;transform:translateY(.6em) rotate(3deg)}to{opacity:1;transform:none}}" +
  "@keyframes dcf-popin{0%{opacity:0;transform:translateY(10px) scale(.6) rotate(-4deg)}100%{opacity:1;transform:none}}" +
  "@keyframes dcf-fadeup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}" +
  "@keyframes dcf-jiggle{0%{transform:none}25%{transform:rotate(-4deg) scale(1.03,.97)}50%{transform:rotate(3deg) translateY(-3%)}75%{transform:rotate(-1.5deg)}100%{transform:none}}" +
  "@keyframes dcf-hop{0%{transform:none}18%{transform:scale(1.12,.84)}45%{transform:translateY(-28%) scale(.94,1.08)}72%{transform:translateY(0) scale(1.1,.88)}86%{transform:scale(.97,1.03)}100%{transform:none}}" +
  "@keyframes dcf-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}" +
  "@keyframes dcf-peck{0%,62%,100%{transform:none}66%{transform:rotate(14deg) translateY(2px)}70%{transform:none}74%{transform:rotate(12deg) translateY(2px)}78%{transform:none}}" +
  "@keyframes dcf-tail{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-12deg)}}" +
  "@keyframes dcf-bubble{from{opacity:0;scale:.6}to{opacity:1;scale:1}}" +
  "@keyframes dcf-wiggle{0%,100%{transform:none}30%{transform:rotate(-14deg) scale(1.15)}60%{transform:rotate(10deg)}}" +
  "@media (max-width:860px){.dcf-links{grid-template-columns:1fr}.dcf-cols{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:24px}.dcf-copy{width:100%;margin-right:0}}" +
  "@media (max-width:480px){.dcf-btn{height:44px;font-size:14px;padding:0 16px 0 13px}.dcf-bubble{font-size:12px;padding:6px 10px}.dcf-totop span{display:none}}" +
  "@media (prefers-reduced-motion:reduce){.dcf *,.dcf *::before,.dcf *::after{animation:none!important;transition:none!important}.dcf .dcf-letter,.dcf .dcf-arrive,.dcf .dcf-word,.dcf .dcf-pop,.dcf .dcf-rise,.dcf .dcf-fade,.dcf .dcf-doodle-in{opacity:1!important}.dcf .dcf-draw{stroke-dashoffset:0!important}.dcf .dcf-dust{opacity:0!important}}"
