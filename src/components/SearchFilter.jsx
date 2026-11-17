import { useEffect, useRef, useState } from 'react'

function SortMenu({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const selected = options.find((o) => o.value === value)
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        id="sort-select"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2.5 h-11 pl-[18px] pr-4 rounded-full border-2 border-ink bg-white font-semibold text-[15px] shadow-lift-sm"
      >
        {selected?.label}
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="M1 1 L6 6 L11 1" />
        </svg>
      </button>
      <ul
        role="listbox"
        className={`absolute right-0 top-[calc(100%+8px)] z-30 min-w-full rounded-2xl border-2 border-ink bg-white p-1.5 shadow-hard-sm origin-top transition-all duration-200 ${
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {options.map((o) => (
          <li key={o.value}>
            <button
              type="button"
              role="option"
              aria-selected={o.value === value}
              onClick={() => { onChange(o.value); setOpen(false) }}
              className={`w-full whitespace-nowrap rounded-xl px-3.5 py-2 text-left text-sm font-semibold ${o.value === value ? 'bg-sun' : 'hover:bg-paper'}`}
            >
              {o.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SearchFilter({ searchQuery, selectedCategory, sortBy, categories, onSearch, onFilter, onSort, onClear, projectCount }) {
  const hasFilters = searchQuery || selectedCategory !== 'All'
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3.5">
        <label className="relative flex items-center w-full lg:w-[440px] h-[52px] rounded-full border-[2.5px] border-ink bg-white shadow-lift-sm focus-within:shadow-lift">
          <svg className="absolute left-5" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="6.5" />
            <path d="M13.5 13.5 L18 18" />
          </svg>
          <span className="sr-only">Search projects</span>
          <input
            id="project-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search title, description or tech…"
            className="w-full h-full bg-transparent rounded-full pl-[52px] pr-10 text-[15px] placeholder:text-muted focus:outline-none"
          />
          {searchQuery && (
            <button type="button" onClick={() => onSearch('')} aria-label="Clear search" className="absolute right-4 text-muted hover:text-ink">
              <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M2 2 L12 12 M12 2 L2 12" /></svg>
            </button>
          )}
        </label>

        <div className="flex flex-wrap items-center gap-2.5 lg:ml-3" role="group" aria-label="Category">
          {categories.map((c) => {
            const on = c === selectedCategory
            return (
              <button
                key={c}
                type="button"
                onClick={() => onFilter(c)}
                aria-pressed={on}
                className={`h-11 px-[18px] rounded-full border-2 border-ink text-[15px] font-semibold transition-transform duration-200 hover:-translate-y-0.5 ${
                  on ? 'bg-ink text-paper shadow-[0_3px_0_#E8402A]' : 'bg-white shadow-lift-sm'
                }`}
              >
                {c}
              </button>
            )
          })}
        </div>

        <div className="lg:ml-auto">
          <SortMenu value={sortBy} onChange={onSort} options={[{ value: 'newest', label: 'Newest first' }, { value: 'oldest', label: 'Oldest first' }]} />
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm font-medium text-muted">
        <span>
          Showing <span className="font-bold text-ink">{projectCount}</span> project{projectCount !== 1 ? 's' : ''}
        </span>
        {hasFilters && (
          <button type="button" onClick={onClear} className="font-bold text-accent hover:underline">Clear filters</button>
        )}
      </div>
    </div>
  )
}
