import { getProjectCover } from '../data/projectImages'
import DoodleCover from './DoodleCover'
import { DoodleIcon } from './doodle/art'
import { CATEGORY_STYLE, fmtDate } from '../data/site'

// tiny tilts so a grid of cards looks pinned up by hand
const TILTS = [-0.7, 0.4, -0.3, 0.6, -0.5, 0.3, -0.4, 0.7, -0.6]

export default function ProjectCard({ project, onClick, index = 0, titleSize = 'text-2xl' }) {
  const cover = getProjectCover(project.imageFolder)
  const tilt = TILTS[index % TILTS.length]

  return (
    <article
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onClick())}
      role="button"
      tabIndex={0}
      aria-label={`${project.title}: open details`}
      className="group ink-card h-full flex flex-col p-3.5 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.3,1.4,.5,1)] rotate-[var(--tilt)] hover:rotate-0 hover:-translate-y-1.5 hover:shadow-hard-lg"
      style={{ '--tilt': `${tilt}deg` }}
    >
      <div className="relative aspect-[16/9.4] overflow-hidden rounded-xl border-2 border-ink bg-sun">
        {cover ? (
          <img src={cover} alt="" loading="lazy" decoding="async" width={720} height={423} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <DoodleCover />
        )}
        <span
          className={`absolute left-3 top-3 -rotate-[4deg] rounded-full border-2 border-ink px-3 py-1 text-xs font-bold shadow-[2px_2px_0_#141414] ${CATEGORY_STYLE[project.category] || 'bg-white'}`}
        >
          {project.category}
        </span>
      </div>

      <div className="flex-1 flex flex-col px-2.5 pt-5 pb-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className={`font-display font-black ${titleSize} leading-[1.1] tracking-[-0.01em] line-clamp-2`}>{project.title}</h3>
          <span className="shrink-0 pt-1 text-[13px] font-medium text-muted">{fmtDate(project.date)}</span>
        </div>
        <p className="mt-2.5 text-[15px] leading-relaxed text-soft line-clamp-2">{project.description}</p>

        <div className="mt-auto pt-5 flex items-end justify-between gap-3">
          <ul className="flex flex-wrap gap-1.5 h-[26px] overflow-hidden" aria-label="Technologies">
            {project.technologies.slice(0, 4).map((t) => (
              <li key={t} className="chip border-[1.5px] bg-paper px-2.5 py-[3px] text-xs">{t}</li>
            ))}
          </ul>
          <span className="shrink-0 grid place-items-center w-11 h-11 rounded-full bg-ink shadow-[0_3px_0_#E8402A] transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-12" aria-hidden="true">
            <DoodleIcon kind="arrow" size={24} stroke="var(--paper)" />
          </span>
        </div>
      </div>
    </article>
  )
}
