import { ART } from './crew-art'

/** A small deterministic hash -> [0, 1). */
export const hash = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

/** A wobbly hand-drawn line `w` units long, around y = 6. */
export function groundPath(w, seed = 1) {
  const n = Math.max(6, Math.round(w / 90))
  let d = 'M0 6'
  for (let k = 1; k <= n; k++) {
    const x = (w * k) / n
    d += ` Q${(x - w / n / 2).toFixed(1)} ${(6 + (hash(k * 3.1 + seed) - 0.5) * 6).toFixed(1)} ${x.toFixed(1)} ${(6 + (hash(k * 7.7 + seed) - 0.5) * 2).toFixed(1)}`
  }
  return d
}

export function tuftsPath(w, count, seed = 1) {
  let d = ''
  for (let k = 0; k < count; k++) {
    const x = 20 + hash(k * 11.3 + seed) * (w - 40)
    const s = 0.7 + hash(k * 5.9 + seed) * 0.6
    d += `M${x.toFixed(1)} 14 l${(2 * s).toFixed(1)} ${(-9 * s).toFixed(1)} M${(x + 3 * s).toFixed(1)} 14 l${s.toFixed(1)} ${(-12 * s).toFixed(1)} M${(x + 6 * s).toFixed(1)} 14 l${(-s).toFixed(1)} ${(-7 * s).toFixed(1)} `
  }
  return d
}

/**
 * Where a pupil sits inside its eye: towards the target, never further than
 * `max` from the centre, easing off as the target comes close.
 */
export const lookAt = (ex, ey, tx, ty, max, reach) => {
  const dx = tx - ex
  const dy = ty - ey
  const d = Math.hypot(dx, dy)
  if (!Number.isFinite(d) || d < 1e-6 || max <= 0) return { x: 0, y: 0 }
  const k = (max * Math.min(1, d / Math.max(1e-6, reach))) / d
  return { x: dx * k, y: dy * k }
}

const PAD = 4

/** The drawing's box in its own units (with a little padding for strokes). */
export function crewBox(kind, flip = false) {
  const { l, r, t, b } = ART[kind].box
  const x = flip ? -r - PAD : l - PAD
  return { x, y: t - PAD, w: r - l + PAD * 2, h: b - t + PAD * 2 }
}

/** Width in px for a crew member drawn `height` px tall. */
export const crewWidth = (kind, height) => {
  const b = crewBox(kind)
  return (height * b.w) / b.h
}
