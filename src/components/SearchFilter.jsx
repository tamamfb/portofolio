import { Search, X, SlidersHorizontal } from 'lucide-react';

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
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => onFilter(e.target.value)}
            className="px-3 py-1.5 border-2 border-[#E0F4EA] rounded-lg focus:outline-none focus:border-[#FFB27D] transition bg-white text-sm font-medium text-[#2C3E50]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm font-semibold text-[#2C3E50]">
            Sort
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSort(e.target.value)}
            className="px-3 py-1.5 border-2 border-[#E0F4EA] rounded-lg focus:outline-none focus:border-[#FFB27D] transition bg-white text-sm font-medium text-[#2C3E50]"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Featured First</option>
          </select>
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
