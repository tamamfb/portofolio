import { ExternalLink } from 'lucide-react';
import { getProjectImages } from '../data/projectImages';

export default function ProjectCard({ project, onClick }) {
  const localImages = getProjectImages(project.imageFolder);
  const thumbnail = localImages.length > 0 ? localImages[0] : project.image;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 flex flex-col h-full"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48 flex-shrink-0">
        <img
          src={thumbnail}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
          <div className="bg-white/90 text-[#2C3E50] px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
            <ExternalLink size={12} /> View Details
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-[#2C3E50] leading-snug group-hover:text-[#E67E4D] transition-colors">
            {project.title}
          </h3>
          <span className="ml-2 flex-shrink-0 inline-block bg-[#FFF2E8] text-[#E67E4D] border border-[#FFD6B8] px-2 py-0.5 rounded-full text-xs font-semibold">
            {project.category}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.technologies.slice(0, 4).map((tech, idx) => (
            <span
              key={idx}
              className="bg-[#FFF8F4] text-[#2C3E50] border border-[#FFE8D6] px-2 py-0.5 rounded-md text-xs font-medium"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="bg-gray-50 text-gray-400 border border-gray-100 px-2 py-0.5 rounded-md text-xs font-medium">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom accent bar — always at the very bottom */}
      <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-[#FFB27D] to-[#FFC499] transition-all duration-500 rounded-b-xl flex-shrink-0" />
    </div>
  );
}
