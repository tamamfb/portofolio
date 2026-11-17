import DoodleCrewFooter from './ui/doodle-crew-footer'
import ppImg from '../assets/pp.jpg'
import { EMAIL, SOCIALS } from '../data/site'

const CREW = [
  { kind: 'duck', letter: 0, seat: 'front', offset: -0.62, name: 'Dux', says: 'Quack! Thanks for scrolling.' },
  { kind: 'bird', letter: 1, seat: 'top', name: 'Pip', says: 'Tweet tweet. Hire Tamam.' },
  { kind: 'ghost', letter: 2, seat: 'behind', name: 'Boo', says: 'Boo! …sorry. Hi.' },
  { kind: 'kid', letter: 3, seat: 'top', offset: 0.05, name: 'Juno', says: 'Best seat in the house!' },
  { kind: 'cat', letter: 4, seat: 'front', offset: 0.62, flip: true, name: 'Patch', says: 'Arr. Nice cursor.' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <DoodleCrewFooter
      preset="sunny"
      wordmark="TAMAM"
      brand="tamamfb"
      logo={<img src={ppImg} alt="" />}
      blurb="CS student at ITS. I build things with models, data, and the software around them."
      tagline="Data in, ideas out. Let's make something together."
      crew={CREW}
      actions={[
        { label: 'View GitHub', href: SOCIALS.github, icon: 'star', variant: 'outline' },
        { label: 'Email me', href: `mailto:${EMAIL}`, icon: 'plane', variant: 'solid' },
      ]}
      columns={[
        { title: 'Pages', links: [{ label: 'Home', to: '/' }, { label: 'Projects', to: '/projects' }, { label: 'About', to: '/about' }] },
        {
          title: 'Elsewhere',
          links: [
            { label: 'GitHub', href: SOCIALS.github },
            { label: 'LinkedIn', href: SOCIALS.linkedin },
            { label: 'Instagram', href: SOCIALS.instagram },
            { label: 'Kaggle', href: SOCIALS.kaggle },
          ],
        },
        { title: 'Say hi', links: [{ label: EMAIL, href: `mailto:${EMAIL}` }, { label: 'Surabaya, Indonesia' }] },
      ]}
      socials={[
        { label: 'GitHub', href: SOCIALS.github },
        { label: 'LinkedIn', href: SOCIALS.linkedin },
        { label: 'Instagram', href: SOCIALS.instagram },
        { label: 'Kaggle', href: SOCIALS.kaggle },
      ]}
      copyright={`© ${year} tamamfb. Drawn by hand in Surabaya.`}
    />
  )
}
