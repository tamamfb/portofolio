/** Doodles and the hand-drawn underline, shared by every page. */

/** Each doodle in a 32-unit box centred on (0, 0). */
export function Doodle({ kind }) {
  switch (kind) {
    case 'flame':
      return (
        <>
          <path fill="#FF7A1A" d="M0 14 C-9 14 -12 6 -10 0 C-8 -5 -4 -6 -4 -12 C1 -9 3 -5 2 -1 C4 -3 5 -6 5 -8 C10 -3 11 4 8 9 C6 12 3 14 0 14 Z" />
          <path fill="#FFD23F" d="M0 11.5 C-4 11.5 -6 8 -5 5 C-4 2 -1 1 -1 -3 C2 -1 4 3 3 6 C4 5 5 4 5 3 C7 6 5 11.5 0 11.5 Z" />
        </>
      )
    case 'sandwich':
      return (
        <>
          <path fill="#F2C48D" d="M-13 5 L13 5 L12.5 9.5 C4 11 -4 11 -12.5 9.5 Z" />
          <path fill="#FFD23F" d="M-12 2 L12 2 L11 5 L5 5 L3 9 L1 5 L-12 5 Z" />
          <path fill="none" stroke="#5FB247" strokeWidth="2.6" d="M-13 1 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0" />
          <path fill="#F2C48D" d="M-13 -1 C-14 -8 -10 -11 -6 -10 C-3 -13.5 3 -13.5 6 -10 C10 -11 14 -8 13 -1 Z" />
        </>
      )
    case 'star':
      return <path fill="#FFD23F" d="M0 -13 L3.6 -4.4 L13 -4 L5.8 2.2 L8.2 12 L0 6.6 L-8.2 12 L-5.8 2.2 L-13 -4 L-3.6 -4.4 Z" />
    case 'heart':
      return <path fill="#FF5C7A" d="M0 11 C-6 6 -13 1 -13 -5 C-13 -10 -8 -13 -4 -11 C-2 -10 -1 -8 0 -6 C1 -8 2 -10 4 -11 C8 -13 13 -10 13 -5 C13 1 6 6 0 11 Z" />
    case 'bolt':
      return <path fill="#FFD23F" d="M3 -14 L-8 2 L-1 2 L-4 14 L8 -3 L1 -3 Z" />
    case 'sparkle':
      return <path fill="#8FDCFF" d="M0 -13 C1 -4 4 -1 13 0 C4 1 1 4 0 13 C-1 4 -4 1 -13 0 C-4 -1 -1 -4 0 -13 Z" />
    case 'spiral':
      return <path fill="none" d="M0 0 C2 -2 4 0 3 3 C1 6 -4 5 -5 1 C-6 -4 -1 -8 4 -7 C9 -5 10 2 7 6" />
    case 'plane':
      return (
        <>
          <path fill="var(--paper)" d="M-13 -1 L13 -10 L4 12 L0 3 Z" />
          <path fill="none" d="M0 3 L13 -10 M0 3 L-2 9 L2 5" />
        </>
      )
    case 'chart':
      return (
        <>
          <rect fill="var(--paper)" x="-12" y="-12" width="24" height="24" rx="3" />
          <path fill="none" d="M-7 6 L-7 1 M-2 6 L-2 -4 M3 6 L3 -1 M8 6 L8 -7" />
        </>
      )
    case 'arrow':
      return <path fill="none" d="M-11 0 C-4 -1 4 1 10 0 M4 -6 C6 -4 8 -2 11 0 C8 2 6 4 4 6" />
    case 'flag':
      return (
        <>
          <path fill="none" d="M-6 13 L-6 -13" />
          <path fill="#E8402A" d="M-6 -13 C0 -15 4 -9 11 -11 L11 -1 C4 1 0 -5 -6 -3 Z" />
        </>
      )
    default:
      return null
  }
}

/** A doodle as a standalone icon. */
export function DoodleIcon({ kind, size = 20, stroke, strokeWidth = 2.2, className = '', style }) {
  return (
    <svg className={'doodle-icon ' + className} viewBox="-16 -16 32 32" width={size} height={size} aria-hidden="true"
      style={{ ...(stroke ? { stroke } : null), strokeWidth, ...style }}>
      <Doodle kind={kind} />
    </svg>
  )
}

/** The hand-drawn underline. */
export function Squiggle({ className = '', color = 'var(--accent)', strokeWidth = 3, style }) {
  return (
    <svg className={className} viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true" style={style}>
      <path d="M1 5 C10 1 16 7 25 4 S40 1 50 4 S66 7 75 4 S90 1 99 4" fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
