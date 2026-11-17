import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ppImg from '../assets/pp.jpg'
import { DoodleIcon, Squiggle } from './doodle/art'
import { groundPath } from './doodle/geometry'
import { EMAIL } from '../data/site'

const LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
]

export function Avatar({ size = 44, className = '' }) {
  return (
    <span
      className={'inline-block shrink-0 rounded-full overflow-hidden border-[2.5px] border-ink bg-sun -rotate-6 ' + className}
      style={{ width: size, height: size }}
    >
      <img src={ppImg} alt="" className="w-full h-full object-cover" />
    </span>
  )
}

export function Rule({ className = '' }) {
  return (
    <svg className={'block w-full h-2 ' + className} viewBox="0 0 1440 12" preserveAspectRatio="none" aria-hidden="true">
      <path d={groundPath(1440, 9)} fill="none" stroke="var(--ink)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-paper">
      <div className="page h-[72px] md:h-[92px] flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-3" aria-label="tamamfb, home">
          <Avatar className="transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" />
          <span className="font-display font-black text-[22px] tracking-[-0.02em]">tamamfb</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {LINKS.map((l) => {
            const active = location.pathname === l.path
            return (
              <Link
                key={l.path}
                to={l.path}
                className={`relative py-2 text-base font-semibold transition-colors ${active ? 'text-ink' : 'text-soft hover:text-ink'}`}
                aria-current={active ? 'page' : undefined}
              >
                {l.name}
                <Squiggle
                  className={`absolute -left-0.5 -right-0.5 -bottom-1.5 h-2 w-[calc(100%+4px)] transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-0'}`}
                />
              </Link>
            )
          })}
          <a
            href={`mailto:${EMAIL}`}
            className="ml-14 inline-flex items-center gap-2 h-11 pl-3.5 pr-[18px] rounded-full border-2 border-ink bg-sun font-bold text-[15px] shadow-lift-sm transition-transform duration-200 hover:-translate-y-0.5 hover:-rotate-2"
          >
            <DoodleIcon kind="plane" size={18} />
            Say hi
          </a>
        </div>

        <button
          className="md:hidden grid place-items-center w-11 h-11 rounded-full border-2 border-ink bg-paper shadow-lift-sm"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M2 1 L16 13 M16 1 L2 13" /> : <path d="M0 2 C6 1 12 3 18 2 M0 7 C6 6 12 8 18 7 M0 12 C6 11 12 13 18 12" />}
          </svg>
        </button>
      </div>
      <Rule />

      {open && (
        <div className="md:hidden absolute inset-x-0 top-full bg-paper border-b-2 border-ink fade-in">
          <div className="page py-4 flex flex-col gap-1">
            {LINKS.map((l) => {
              const active = location.pathname === l.path
              return (
                <Link key={l.path} to={l.path} onClick={() => setOpen(false)} className={`py-3 text-lg font-bold ${active ? 'text-ink' : 'text-soft'}`}>
                  {l.name}
                  {active && <Squiggle className="block h-2 w-16 mt-1" />}
                </Link>
              )
            })}
            <a href={`mailto:${EMAIL}`} className="btn btn-solid mt-3 w-full">
              <DoodleIcon kind="plane" size={18} stroke="var(--paper)" className="btn-icon" />
              Say hi
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
