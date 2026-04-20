import { GraduationCap, Code2 } from 'lucide-react';

const skills = [
  {
    label: 'Programming Languages',
    items: ['Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'PHP', 'R', 'SQL'],
  },
  {
    label: 'AI',
    items: [
      'PyTorch', 'TensorFlow', 'Scikit-learn', 'Keras',
      'CNN', 'LSTM', 'GAN', 'Transformers',
      'BERT', 'SBERT', 'MiniLM', 'E5', 'FastEmbed',
      'RAG Pipelines', 'Hugging Face', 'OpenCV',
      'Text Embeddings', 'NLP', 'Computer Vision',
    ],
  },
  {
    label: 'Data & Analysis',
    items: [
      'Pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Seaborn',
      'Plotly', 'Jupyter', 'Feature Engineering', 'EDA',
      'Data Cleaning', 'Statistical Analysis', 'Excel',
    ],
  },
  {
    label: 'Web & Backend',
    items: [
      'React', 'Next.js', 'NestJS', 'Laravel', 'Django',
      'FastAPI', 'Node.js', 'Livewire', 'REST API',
      'Tailwind CSS', 'Prisma',
    ],
  },
  {
    label: 'Databases & DevOps',
    items: [
      'PostgreSQL', 'MySQL', 'MongoDB',
      'Docker', 'CI/CD', 'Jenkins',
      'Git', 'GitHub',
    ],
  },
];

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-16 py-16 slide-up">

      {/* ── Header ── */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 bg-[#FFF2E8] border border-[#FFD6B8] rounded-full px-3 py-1 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#FFB27D]" />
          <span className="text-xs font-bold text-[#E67E4D] uppercase tracking-wider">About Me</span>
        </div>
        <h1 className="text-5xl font-extrabold text-[#2C3E50] mb-6">Hello, I'm Tamam.</h1>
        <p className="text-[#2C3E50] text-lg leading-relaxed text-justify">
          I am an active Computer Science student with a strong interest in data science, machine
          learning, and data driven decision making. Experienced in handling data processing pipelines,
          exploratory data analysis, and building predictive models in both academic and independent
          projects. Skilled in statistical analysis, Python based data science tools (Pandas, NumPy,
          Scikit-learn, TensorFlow/PyTorch), and database management.
        </p>
      </div>

      {/* ── Education ── */}
      <section className="mb-14">
        <h2 className="text-2xl font-extrabold text-[#2C3E50] mb-6 flex items-center gap-2">
          <GraduationCap size={22} className="text-[#E67E4D]" />
          Education
        </h2>
        <div className="bg-white border border-[#FFE8D6] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-[#2C3E50] text-lg">
              Institut Teknologi Sepuluh Nopember (ITS)
            </h3>
            <p className="text-gray-500 text-sm mt-0.5">
              Bachelor's in Computer Science · Surabaya, Indonesia
            </p>
            <p className="text-sm text-gray-400 mt-1">Aug 2023 – Present</p>
          </div>
          <div className="flex-shrink-0 text-center bg-[#FFF2E8] border border-[#FFD6B8] rounded-xl px-6 py-4">
            <p className="text-3xl font-extrabold text-[#E67E4D]">3.77</p>
            <p className="text-xs text-gray-400 font-semibold">GPA / 4.00</p>
          </div>
        </div>
      </section>

      {/* ── Technical Skills ── */}
      <section className="mb-14">
        <h2 className="text-2xl font-extrabold text-[#2C3E50] mb-6 flex items-center gap-2">
          <Code2 size={22} className="text-[#E67E4D]" />
          Technical Skills
        </h2>
        <div className="space-y-4">
          {skills.map(({ label, items }) => (
            <div
              key={label}
              className="bg-white border border-[#FFE8D6] rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 transition-transform"
            >
              <p className="text-sm font-bold text-[#E67E4D] mb-3">{label}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="bg-[#FFF8F4] text-[#2C3E50] border border-[#FFE8D6] px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}
