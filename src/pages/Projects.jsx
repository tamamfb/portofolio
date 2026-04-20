import { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import SearchFilter from '../components/SearchFilter';
import projectsData from '../data/projects.json';

export default function Projects() {
  const [projects] = useState(projectsData);
  const [filteredProjects, setFilteredProjects] = useState(projectsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['All', ...new Set(projects.map((p) => p.category))];

  useEffect(() => {
    let filtered = [...projects];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.featured - a.featured);
    }

    setFilteredProjects(filtered);
  }, [searchQuery, selectedCategory, sortBy, projects]);

  const handleClear = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('newest');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-16 py-16">

      {/* Header */}
      <div className="mb-12 slide-up">
        <div className="inline-flex items-center gap-2 bg-[#FFF2E8] border border-[#FFD6B8] rounded-full px-3 py-1 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#FFB27D]" />
          <span className="text-xs font-bold text-[#E67E4D] uppercase tracking-wider">My Work</span>
        </div>
        <h1 className="text-5xl font-extrabold text-[#2C3E50] mb-3">Projects</h1>
        <p className="text-gray-400 text-lg">
          A collection of things I've built — from hobby projects to production apps.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="fade-in" style={{ animationDelay: '0.15s' }}>
        <SearchFilter
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          categories={categories}
          onSearch={setSearchQuery}
          onFilter={setSelectedCategory}
          onSort={setSortBy}
          onClear={handleClear}
          projectCount={filteredProjects.length}
        />
      </div>

      {/* Cards */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              className="fade-in-up h-full"
              style={{ animationDelay: `${0.2 + idx * 0.08}s` }}
            >
              <ProjectCard
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 fade-in">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl font-semibold text-gray-400 mb-2">No projects found</p>
          <p className="text-sm text-gray-300">Try adjusting your search or filters</p>
          <button onClick={handleClear} className="mt-6 btn-primary text-sm">
            Clear filters
          </button>
        </div>
      )}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
