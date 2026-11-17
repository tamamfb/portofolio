import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Polaroid from '../components/Polaroid'
import WalkingBird from '../components/WalkingBird'
import { DoodleIcon, Squiggle } from '../components/doodle/art'

const PIP_LINES = [
  "I'm Pip. I live down here.",
  'Tip: the projects are one click up there.',
  'Tamam builds models and the software around them.',
  'Tweet. That means hi.',
]

export default function Landing() {
  // Pip is drawn a bit smaller on phones
  const [pip, setPip] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? 84 : 112))
  useEffect(() => {
    const on = () => setPip(window.innerWidth < 768 ? 84 : 112)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <section className="page flex-1 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] items-center gap-x-[clamp(32px,6vw,120px)] gap-y-10 pt-10 md:pt-14">
        {/* text */}
        <div className="slide-up">
          <span className="label-chip bg-white text-[11px] sm:text-[13px]">AI Engineer · Data Scientist · Software Engineer</span>
          <h1 className="h-display relative z-0 mt-4 text-[clamp(56px,7.5vw,108px)]">
            Hi, I'm
            <br />
            <span className="relative inline-block">
              <span className="absolute -left-[0.08em] -right-[0.14em] bottom-[0.04em] h-[0.64em] -z-10 rounded-lg bg-sun -rotate-[1.2deg]" aria-hidden="true" />
              Tamam.
            </span>
          </h1>
          <Squiggle className="mt-3 h-2 w-[clamp(160px,17vw,250px)]" strokeWidth={3.5} />
          <p className="mt-6 max-w-[600px] font-serif italic text-[clamp(22px,2.1vw,30px)] leading-[1.25]">
            I build models from messy data, and the software that ships them.
          </p>
          <p className="mt-5 max-w-[540px] text-[clamp(15px,1.2vw,17px)] leading-relaxed text-soft">
            Computer Science student at ITS, Surabaya. Have a look at what I've built, or read a bit more about me.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
            <Link to="/projects" className="btn btn-solid">
              <DoodleIcon kind="arrow" size={20} stroke="var(--paper)" className="btn-icon" />
              See my projects
            </Link>
            <Link to="/about" className="btn btn-outline">About me</Link>
          </div>
        </div>

        {/* photo */}
        <div className="relative order-first md:order-none justify-self-center w-[clamp(220px,25vw,360px)] slide-up" style={{ animationDelay: '.1s' }}>
          <Polaroid />
          <DoodleIcon kind="star" size={40} className="floaty absolute -left-[18%] top-[8%]" style={{ '--r': '-12deg' }} />
          <DoodleIcon kind="sparkle" size={32} className="floaty absolute -right-[14%] top-[20%]" style={{ animationDelay: '-1.2s' }} />
          <DoodleIcon kind="heart" size={30} className="floaty absolute -right-[16%] bottom-[18%]" style={{ animationDelay: '-2.4s', '--r': '10deg' }} />
          <DoodleIcon kind="bolt" size={32} className="floaty absolute -left-[15%] bottom-[22%] hidden sm:block" style={{ animationDelay: '-3.1s' }} />
          <DoodleIcon kind="chart" size={38} className="floaty absolute right-[4%] -top-[14%] hidden sm:block" style={{ animationDelay: '-.6s', '--r': '8deg' }} />
        </div>
      </section>

      <WalkingBird size={pip} messages={PIP_LINES} />
    </div>
  )
}
