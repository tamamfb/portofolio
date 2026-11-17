import Crew from '../components/doodle/Crew'
import Journey from '../components/Journey'
import { DoodleIcon } from '../components/doodle/art'
import journey from '../data/journey.json'

const FACTS = [
  { label: 'Location', value: 'Flexible: remote or on-site', icon: 'star', bg: 'bg-sun' },
  { label: 'Studying', value: 'CS at ITS, since 2023', icon: 'chart', bg: 'bg-sky' },
  { label: 'Into', value: 'AI, data science & software engineering', icon: 'heart', bg: 'bg-rose' },
  { label: 'Go-to stack', value: 'Python, PyTorch & TypeScript', icon: 'bolt', bg: 'bg-white' },
]

const SKILLS = [
  { label: 'Programming languages', icon: 'bolt', items: ['Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'PHP', 'R', 'SQL'] },
  {
    label: 'AI',
    icon: 'sparkle',
    highlight: true,
    items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'Keras', 'CNN', 'LSTM', 'GAN', 'Transformers', 'BERT', 'SBERT', 'MiniLM', 'E5',
      'FastEmbed', 'RAG pipelines', 'Hugging Face', 'OpenCV', 'Text embeddings', 'NLP', 'Computer vision'],
  },
  {
    label: 'Data & analysis',
    icon: 'chart',
    items: ['Pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Seaborn', 'Plotly', 'Jupyter', 'Feature engineering', 'EDA', 'Data cleaning',
      'Statistical analysis', 'Excel'],
  },
  { label: 'Software engineering', icon: 'flame', items: ['React', 'Next.js', 'NestJS', 'Laravel', 'Django', 'FastAPI', 'Node.js', 'Livewire', 'REST API', 'Tailwind CSS', 'Prisma'] },
  { label: 'Databases & DevOps', icon: 'heart', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Docker', 'CI/CD', 'Jenkins', 'Git', 'GitHub'] },
]
const TILTS = [-0.5, 0.5, 0.4, -0.4, 0.3]

export default function About() {
  return (
    <div className="page pt-[clamp(44px,5vw,58px)] pb-[clamp(90px,9vw,140px)]">
      {/* intro: text on the left, Bruno the yeti on the right, both ending on the same line */}
      <section className="grid grid-cols-1 md:grid-cols-[minmax(0,760px)_1fr] md:items-end gap-x-[clamp(32px,5vw,90px)] slide-up">
        <div>
          <span className="label-chip bg-sun">About me</span>
          <h1 className="h-display mt-4 text-[clamp(52px,5vw,72px)]">
            A bit more
            <br />
            about me.
          </h1>
          <p className="mt-7 text-[clamp(16px,1.25vw,18px)] leading-[1.65] text-soft">
            I'm a Computer Science student with a strong interest in data science, machine learning and data-driven decision making.
            I've built data processing pipelines, done exploratory analysis and trained predictive models in both academic and
            independent projects, mostly with Python (Pandas, NumPy, Scikit-learn, TensorFlow / PyTorch) and a healthy amount of SQL.
          </p>
        </div>
        <div className="relative hidden md:flex justify-center" aria-hidden="true">
          <Crew kind="yeti" height={340} bg="var(--sun)" look={{ x: -0.7, y: 0.3 }} className="max-w-full h-auto w-[clamp(220px,24vw,330px)]" />
          <DoodleIcon kind="flame" size={30} className="floaty absolute left-[2%] top-[8%]" style={{ '--r': '-10deg' }} />
          <DoodleIcon kind="sparkle" size={26} className="floaty absolute right-[4%] top-[2%]" style={{ animationDelay: '-1.4s' }} />
          <DoodleIcon kind="star" size={24} className="floaty absolute right-0 top-[52%]" style={{ animationDelay: '-2.6s', '--r': '14deg' }} />
        </div>
      </section>

      {/* four facts, one row across the full width */}
      <ul className="mt-11 flex flex-wrap lg:flex-nowrap lg:justify-between gap-3 slide-up" style={{ animationDelay: '.08s' }}>
        {FACTS.map((f) => (
          <li key={f.label} className={`inline-flex items-center gap-2.5 rounded-full border-2 border-ink ${f.bg} pl-3 pr-[18px] py-2.5 text-[15px] font-bold shadow-lift-sm`}>
            <DoodleIcon kind={f.icon} size={20} />
            <span className="sr-only">{f.label}: </span>
            {f.value}
          </li>
        ))}
      </ul>

      {/* journey */}
      <section className="mt-[clamp(80px,8vw,110px)]" aria-labelledby="journey-title">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-2">
          <div>
            <span className="label-chip bg-sun">My journey</span>
            <h2 id="journey-title" className="h-display mt-4 text-[clamp(36px,3.4vw,48px)] tracking-[-0.02em]">The road so far</h2>
          </div>
          <p className="pb-1.5 font-serif italic text-lg md:text-xl text-soft">
            <span className="md:hidden">(swipe sideways, tap a stop)</span>
            <span className="hidden md:inline">(scroll sideways, hover a stop)</span>
          </p>
        </div>
        <div className="mt-8">
          <Journey stops={journey} />
        </div>
      </section>

      {/* skills */}
      <section className="mt-[clamp(90px,9vw,120px)]" aria-labelledby="skills-title">
        <span className="label-chip bg-sun">Technical skills</span>
        <h2 id="skills-title" className="h-display mt-4 text-[clamp(38px,3.9vw,56px)] tracking-[-0.02em]">What's in the backpack</h2>
        <div className="mt-10 columns-1 md:columns-2 gap-6">
          {SKILLS.map((g, k) => (
            <div
              key={g.label}
              className={`break-inside-avoid mb-7 ink-card p-6 md:p-7 shadow-[5px_5px_0_#141414] transition-transform duration-300 hover:rotate-0 hover:-translate-y-1 rotate-[var(--tilt)] ${g.highlight ? '!bg-sun' : ''}`}
              style={{ '--tilt': `${TILTS[k]}deg` }}
            >
              <h3 className="flex items-center gap-2.5 font-display font-black text-xl">
                <DoodleIcon kind={g.icon} size={26} /> {g.label}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <li key={it} className={`chip border-[1.5px] px-3 py-1 text-[13px] ${g.highlight ? 'bg-white' : 'bg-paper'}`}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
