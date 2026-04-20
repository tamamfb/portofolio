import { useEffect } from 'react';
import { X, ExternalLink, Star, Calendar } from 'lucide-react';
import ImageSlider from './ImageSlider';
import { getProjectImages } from '../data/projectImages';

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export default function ProjectModal({ project, onClose }) {
  const images = getProjectImages(project.imageFolder);
  const sliderImages = images.length > 0 ? images : [project.image];
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ESC to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[#FFD6B8] px-6 py-5 flex justify-between items-start z-10">
          <div>
            <div className="mb-1.5">
              <span className="text-xs font-bold bg-[#FFF2E8] text-[#E67E4D] border border-[#FFD6B8] px-2.5 py-0.5 rounded-full">
                {project.category}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#2C3E50]">{project.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-[#2C3E50] hover:bg-[#FFF8F4] transition"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6">
          {/* Image slider */}
          <div className="mb-6 h-80">
            <ImageSlider images={sliderImages} className="h-80" />
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5 text-sm text-gray-500">
            {project.featured && (
              <div className="flex items-center gap-1 text-[#FFB27D] font-semibold">
                <Star size={14} className="fill-[#FFB27D]" /> Featured Project
              </div>
            )}
            {project.date && (
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(project.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long',
                })}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {project.fullDescription}
          </p>

          {/* Features */}
          {project.features && (
            <div className="mb-6">
              <h3 className="text-base font-bold text-[#2C3E50] mb-3">✦ Key Features</h3>
              <ul className="space-y-2">
                {project.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#FFB27D] flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          <div className="mb-6">
            <h3 className="text-base font-bold text-[#2C3E50] mb-3">🛠 Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="bg-[#FFF2E8] text-[#2C3E50] border border-[#FFD6B8] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <ExternalLink size={16} />
                View Live
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <GitHubIcon />
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
