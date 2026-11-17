// full-size images for the modal slider (loaded only when a modal opens)
const modules = import.meta.glob('../assets/**/*.{png,jpg,jpeg}', { eager: true, import: 'default' })
// small webp covers for the project cards, generated at build time
const thumbs = import.meta.glob('../assets/**/*.{png,jpg,jpeg}', {
  eager: true,
  import: 'default',
  query: { w: 720, format: 'webp', quality: 72 },
})

const group = (mods) => {
  const out = {}
  for (const [path, url] of Object.entries(mods)) {
    const match = path.match(/\.\.\/assets\/([^/]+)\/(.+)/)
    if (!match) continue
    ;(out[match[1]] ||= []).push({ path, url })
  }
  for (const list of Object.values(out)) list.sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }))
  return out
}

const imagesByFolder = group(modules)
const thumbsByFolder = group(thumbs)

export function getProjectImages(folder) {
  if (!folder) return []
  return (imagesByFolder[folder] || []).map((item) => item.url)
}

export function getProjectCover(folder) {
  return folder ? thumbsByFolder[folder]?.[0]?.url : undefined
}
