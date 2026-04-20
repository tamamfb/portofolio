import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ppImg from '../assets/pp.jpg';

const techStack = [
  { name: 'JavaScript', icon: 'javascript', color: 'F7DF1E' },
  { name: 'TypeScript', icon: 'typescript', color: '3178C6' },
  { name: 'React', icon: 'react', color: '61DAFB' },
  { name: 'Node.js', icon: 'nodedotjs', color: '339933' },
  { name: 'Python', icon: 'python', color: '3776AB' },
  { name: 'C++', icon: 'cplusplus', color: '00599C' },
  { name: '.NET', icon: 'dotnet', color: '512BD4' },
  { name: 'PHP', icon: 'php', color: '777BB4' },
  { name: 'PyTorch', icon: 'pytorch', color: 'EE4C2C' },
  { name: 'TensorFlow', icon: 'tensorflow', color: 'FF6F00' },
  { name: 'Scikit-Learn', icon: 'scikitlearn', color: 'F7931E' },
  { name: 'Keras', icon: 'keras', color: 'D00000' },
  { name: 'Pandas', icon: 'pandas', color: '150458' },
  { name: 'NumPy', icon: 'numpy', color: '013243' },
  { name: 'SciPy', icon: 'scipy', color: '8CAAEE' },
  { name: 'OpenCV', icon: 'opencv', color: '5C3EE8' },
  { name: 'Jupyter', icon: 'jupyter', color: 'F37626' },
  { name: 'Hugging Face', icon: 'huggingface', color: 'FFD21E' },
  { name: 'Kaggle', icon: 'kaggle', color: '20BEFF' },
  { name: 'FastAPI', icon: 'fastapi', color: '009688' },
  { name: 'Django', icon: 'django', color: '092E20' },
  { name: 'Laravel', icon: 'laravel', color: 'FF2D20' },
  { name: 'PostgreSQL', icon: 'postgresql', color: '4169E1' },
  { name: 'MongoDB', icon: 'mongodb', color: '47A248' },
  { name: 'MySQL', icon: 'mysql', color: '4479A1' },
  { name: 'Docker', icon: 'docker', color: '2496ED' },
  { name: 'Jenkins', icon: 'jenkins', color: 'D24939' },
  { name: 'Git', icon: 'git', color: 'F05032' },
  { name: 'GitHub', icon: 'github', color: '181717' },
];

export default function Landing() {
  return (
    /* flex-grow + h-full → fills remaining viewport height after navbar */
    <div className="flex-grow flex items-center overflow-hidden relative">

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#FFD6B8]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#FFC499]/25 blur-3xl pointer-events-none" />

      {/* Content — same max-w + padding as navbar */}
      <div className="relative w-full max-w-6xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-4 items-center slide-up">

        {/* LEFT — Text */}
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#2C3E50] mb-4 leading-tight tracking-tight whitespace-nowrap">
            Hi, I'm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB27D] to-[#E67E4D]">
              Tamam
            </span>{' '}👋
          </h1>
          <p className="text-base text-gray-500 mb-8 leading-relaxed max-w-lg text-justify">
            I'm studying computer science, and somewhere along the way I got hooked on AI and data. There's something satisfying about starting with raw, unstructured information and slowly making sense of it, whether that's through exploration, visualization, or building a model that actually holds up.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mb-3">
            <Link
              to="/projects"
              id="hero-projects-btn"
              className="btn-primary inline-flex items-center gap-2 text-sm shadow-md shadow-[#FFB27D]/30"
            >
              Projects
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/about"
              id="hero-about-btn"
              className="btn-secondary inline-flex items-center gap-2 text-sm"
            >
              About
            </Link>
          </div>

          {/* Tech Stack Marquee */}
          <div className="w-full max-w-lg overflow-hidden whitespace-nowrap relative mt-2 pt-12 pb-6 -mt-10 -mb-4">
            {/* Gradient masks for smooth fade effect at edges */}
            <div className="absolute top-12 left-0 w-12 h-12 bg-gradient-to-r from-[#FFFBF0] z-10 pointer-events-none" />
            <div className="absolute top-12 right-0 w-12 h-12 bg-gradient-to-l from-[#FFFBF0] z-10 pointer-events-none" />
            
            <div className="animate-marquee gap-4 items-center">
              {/* Render array twice to create seamless loop */}
              {[...techStack, ...techStack].map((tech, idx) => (
                <div 
                  key={`${tech.name}-${idx}`} 
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white rounded-xl shadow-sm border border-[#FFE8D6] p-2 hover:-translate-y-1 transition-transform cursor-pointer group relative"
                >
                  <img 
                    src={`https://cdn.simpleicons.org/${tech.icon}/${tech.color}`} 
                    alt={tech.name} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform" 
                  />
                  {/* Tooltip Popup */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#2C3E50] text-[#FFFBF0] text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-20 shadow-md">
                    {tech.name}
                    {/* Tooltip triangle indicator */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#2C3E50]"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Avatar photo */}
        <div className="flex justify-end">
          <div className="relative mr-0 md:-mr-16">
            <div className="w-52 h-52 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-[#FFD6B8] to-[#FFB27D] p-1.5 shadow-2xl shadow-[#FFB27D]/40">
              <div className="w-full h-full rounded-full bg-[#FFFBF0] overflow-hidden">
                <img src={ppImg} alt="Tamam" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
