const modules = import.meta.glob('../assets/**/*.{png,jpg,jpeg}', { eager: true });

const imagesByFolder = {};
for (const [path, mod] of Object.entries(modules)) {
  const match = path.match(/\.\.\/assets\/([^/]+)\/(.+)/);
  if (match) {
    const folder = match[1];
    if (!imagesByFolder[folder]) imagesByFolder[folder] = [];
    imagesByFolder[folder].push({ path, url: mod.default });
  }
}

for (const folder of Object.keys(imagesByFolder)) {
  imagesByFolder[folder].sort((a, b) => a.path.localeCompare(b.path));
}

export function getProjectImages(folder) {
  if (!folder) return [];
  return (imagesByFolder[folder] || []).map((item) => item.url);
}
