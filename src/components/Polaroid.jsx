import ppImg from '../assets/pp.jpg'

export default function Polaroid({ className = '', caption = 'me, probably debugging' }) {
  return (
    <figure className={'relative ' + className}>
      <span className="absolute left-1/2 -top-[18px] z-10 w-[30%] h-[34px] -translate-x-1/2 -rotate-6 bg-tape/85" aria-hidden="true" />
      <div className="rotate-3 bg-white border-[2.5px] border-ink rounded-md shadow-hard p-[5%] pb-0 transition-transform duration-500 hover:rotate-1 hover:-translate-y-1">
        <div className="aspect-square overflow-hidden border-2 border-ink bg-sun">
          <img src={ppImg} alt="Tamam's avatar: a yellow duck" className="w-full h-full object-cover" />
        </div>
        <figcaption className="py-[7%] text-center font-serif italic text-[clamp(16px,1.55vw,22px)]">{caption}</figcaption>
      </div>
    </figure>
  )
}
