import { useMemo, useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import ProjectModal from '../components/ProjectModal'
import SearchFilter from '../components/SearchFilter'
import Crew from '../components/doodle/Crew'
import { DoodleIcon, Squiggle } from '../components/doodle/art'
import projectsData from '../data/projects.json'

const PAGE = 9

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedProject, setSelectedProject] = useState(null)
  const [shown, setShown] = useState(PAGE)

  const categories = useMemo(() => ['All', ...new Set(projectsData.map((p) => p.category))], [])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const list = projectsData.filter(
      (p) =>
        (selectedCategory === 'All' || p.category === selectedCategory) &&
        (!q ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))),
    )
    return list.sort((a, b) => (sortBy === 'oldest' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)))
  }, [searchQuery, selectedCategory, sortBy])

  const clear = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSortBy('newest')
  }

  const visible = filtered.slice(0, shown)
  const rest = filtered.length - visible.length

  return (
    <div className="page pt-[clamp(44px,5vw,68px)] pb-[clamp(80px,9vw,140px)]">
      {/* header */}
      <header className="relative slide-up">
        <span className="label-chip bg-sun">My work</span>
        <h1 className="h-display mt-4 text-[clamp(64px,7.2vw,104px)]">Projects</h1>
        <Squiggle className="mt-2 h-2.5 w-[clamp(220px,25vw,360px)]" strokeWidth={4} />
        <p className="mt-6 max-w-[760px] font-serif italic text-[clamp(20px,1.8vw,26px)] leading-[1.3] text-soft">
          A collection of things I've built, from research models to production-ish web apps.
        </p>
        <div className="hidden md:block absolute right-[4%] bottom-0" aria-hidden="true">
          <Crew kind="cat" height={150} flip look={{ x: -0.8, y: 0.2 }} />
          <DoodleIcon kind="star" size={36} className="floaty absolute -right-14 -top-6" style={{ '--r': '12deg' }} />
          <DoodleIcon kind="sparkle" size={30} className="floaty absolute -left-20 top-2" style={{ animationDelay: '-1.5s' }} />
        </div>
      </header>

      <div className="relative z-20 mt-12 fade-in" style={{ animationDelay: '.12s' }}>
        <SearchFilter
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          categories={categories}
          onSearch={(v) => { setSearchQuery(v); setShown(PAGE) }}
          onFilter={(v) => { setSelectedCategory(v); setShown(PAGE) }}
          onSort={setSortBy}
          onClear={clear}
          projectCount={filtered.length}
        />
      </div>

      {visible.length > 0 ? (
        <>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9">
            {visible.map((p, i) => (
              <div key={p.id} className="slide-up" style={{ animationDelay: `${0.15 + i * 0.06}s` }}>
                <ProjectCard project={p} index={i} onClick={() => setSelectedProject(p)} />
              </div>
            ))}
          </div>
          {rest > 0 && (
            <div className="mt-14 flex justify-center">
              <button type="button" className="btn btn-outline" onClick={() => setShown((s) => s + PAGE)}>
                <DoodleIcon kind="sparkle" size={20} className="btn-icon" />
                Show {rest} more
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-14 flex flex-col items-center text-center fade-in">
          <Crew kind="ghost" height={130} />
          <p className="mt-5 font-display font-black text-2xl">Nothing here, boo.</p>
          <p className="mt-2 text-soft">Try another search or category.</p>
          <button type="button" onClick={clear} className="btn btn-solid mt-6">Clear filters</button>
        </div>
      )}

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  )
}
