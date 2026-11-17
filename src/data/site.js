export const EMAIL = 'tamamfb01@gmail.com'

export const SOCIALS = {
  github: 'https://github.com/tamamfb',
  linkedin: 'https://www.linkedin.com/in/tamam-fajar-briliansyah',
  instagram: 'https://www.instagram.com/tamam_fb',
  kaggle: 'https://www.kaggle.com/tamamfajar',
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const fmtDate = (s) => {
  if (!s) return ''
  const [y, m] = s.split('-')
  return `${MONTHS[Number(m) - 1]} ${y}`
}

export const CATEGORY_STYLE = {
  AI: 'bg-sun text-ink',
  'Web App': 'bg-accent text-white',
  Game: 'bg-[#8FDCFF] text-ink',
  'Data Science': 'bg-sky text-ink',
}
