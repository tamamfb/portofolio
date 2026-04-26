import { useState, useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';

function Dropdown({ value, options, onChange, id }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-2 px-3 py-1.5 border-2 rounded-lg bg-white text-sm font-medium text-[#2C3E50] transition-all duration-200 min-w-[110px] ${
          open ? 'border-[#FFB27D] shadow-sm' : 'border-[#E0F4EA] hover:border-[#FFD6B8]'
        }`}
      >
        <span className="flex-1 text-left">{selected?.label}</span>
        <ChevronDown
          size={14}
          className={`text-[#FFB27D] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute left-0 top-[calc(100%+6px)] z-50 bg-white border border-[#FFD6B8] rounded-xl shadow-lg overflow-hidden transition-all duration-200 origin-top ${
          open ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'
        }`}
        style={{ minWidth: '100%' }}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => { onChange(opt.value); setOpen(false); }}
            className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors duration-150 ${
              opt.value === value
                ? 'bg-[#FFF2E8] text-[#E67E4D] font-semibold'
                : 'text-[#2C3E50] hover:bg-[#FFF8F4]'
            }`}
          >
            <Check size={12} className={opt.value === value ? 'opacity-100 text-[#E67E4D]' : 'opacity-0'} />
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SearchFilter({
  searchQuery,
  selectedCategory,
  sortBy,
  categories,
  onSearch,
  onFilter,
  onSort,
  onClear,
  projectCount,
}) {
  const hasFilters = searchQuery || selectedCategory !== 'All';

  const categoryOptions = categories.map((cat) => ({ value: cat, label: cat }));
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-50">
      {/* Search bar */}
      <div className="mb-5 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
        <input
          type="text"
          id="project-search"
          placeholder="Search by name, description, or technology..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-[#E0F4EA] rounded-lg focus:outline-none focus:border-[#FFB27D] transition-colors text-[#2C3E50] text-sm placeholder-gray-300"
        />
        {searchQuery && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#FFB27D]" />
          <label htmlFor="category-filter" className="text-sm font-semibold text-[#2C3E50]">
            Category
          </label>
          <Dropdown
            id="category-filter"
            value={selectedCategory}
            options={categoryOptions}
            onChange={onFilter}
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm font-semibold text-[#2C3E50]">
            Sort
          </label>
          <Dropdown
            id="sort-select"
            value={sortBy}
            options={sortOptions}
            onChange={onSort}
          />
        </div>

        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm font-medium text-gray-400">
            <span className="text-[#2C3E50] font-bold">{projectCount}</span> result{projectCount !== 1 ? 's' : ''}
          </span>
          {hasFilters && (
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 text-sm text-[#FFB27D] hover:text-[#E67E4D] font-semibold transition"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
