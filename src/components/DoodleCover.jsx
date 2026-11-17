import Crew from './doodle/Crew'
import { DoodleIcon } from './doodle/art'

/** No screenshot yet: a doodle cover instead. */
export default function DoodleCover() {
  return (
    <div className="relative w-full h-full bg-sun grid place-items-end justify-center overflow-hidden">
      <Crew kind="ghost" height={120} bg="var(--paper)" follow={false} look={{ x: 0.6, y: -0.2 }} className="mb-3" />
      <DoodleIcon kind="chart" size={44} className="absolute left-[16%] top-[22%] -rotate-12" />
      <DoodleIcon kind="sparkle" size={32} className="absolute right-[20%] top-[18%]" />
      <DoodleIcon kind="star" size={28} className="absolute right-[14%] bottom-[30%] rotate-12" />
      <DoodleIcon kind="bolt" size={28} className="absolute left-[12%] bottom-[22%]" />
    </div>
  )
}
