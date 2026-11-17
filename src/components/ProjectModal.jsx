import { useEffect } from 'react'
import ImageSlider from './ImageSlider'
import DoodleCover from './DoodleCover'
import { getProjectImages } from '../data/projectImages'
import { CATEGORY_STYLE, fmtDate } from '../data/site'
import { DoodleIcon } from './doodle/art'

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

export default function ProjectModal({ project, onClose }) {
  const images = getProjectImages(project.imageFolder)
  const slides = images.length > 0 ? images : project.image ? [project.image] : []

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 p-4 fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
    >
      <div className="relative w-full max-w-[720px] max-h-[90vh] overflow-y-auto rounded-[22px] border-[2.5px] border-ink bg-paper shadow-hard-lg slide-up">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b-2 border-dashed border-ink/30 bg-paper px-6 pt-6 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className={`-rotate-[4deg] rounded-full border-2 border-ink px-3 py-1 text-xs font-bold ${CATEGORY_STYLE[project.category] || 'bg-white'}`}>
                {project.category}
              </span>
              <span className="text-sm font-medium text-muted">{fmtDate(project.date)}</span>
              {project.featured && <span className="chip bg-sun px-2.5 py-0.5 text-xs">Featured</span>}
            </div>
            <h2 id="project-title" className="mt-3 font-display font-black text-[clamp(24px,3vw,32px)] leading-[1.1] tracking-[-0.01em]">{project.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 grid place-items-center w-11 h-11 rounded-full border-2 border-ink bg-white shadow-lift-sm hover:-translate-y-0.5 transition-transform"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M2 2 L12 12 M12 2 L2 12" /></svg>
          </button>
        </div>

        <div className="p-6">
          <div className="h-[clamp(220px,40vw,340px)] overflow-hidden rounded-2xl border-2 border-ink bg-white">
            {slides.length > 0 ? <ImageSlider images={slides} className="h-full" /> : <DoodleCover />}
          </div>

          <p className="mt-6 leading-relaxed text-soft">{project.fullDescription}</p>

          {project.features && (
            <section className="mt-7">
              <h3 className="flex items-center gap-2 font-display font-black text-lg">
                <DoodleIcon kind="sparkle" size={22} /> Key features
              </h3>
              <ul className="mt-3 space-y-2">
                {project.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[15px] text-soft">
                    <span className="mt-[7px] w-2 h-2 shrink-0 rounded-full border-[1.5px] border-ink bg-sun" />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-7">
            <h3 className="flex items-center gap-2 font-display font-black text-lg">
              <DoodleIcon kind="bolt" size={22} /> Tech stack
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <li key={t} className="chip px-3 py-1 text-sm">{t}</li>
              ))}
            </ul>
          </section>

          {(project.liveLink || project.githubLink) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                  <DoodleIcon kind="arrow" size={20} stroke="var(--paper)" className="btn-icon" /> View live
                </a>
              )}
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  <GitHubIcon /> GitHub
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
