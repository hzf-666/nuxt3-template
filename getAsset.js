const assets = import.meta.glob(['/assets/image/**/*'], { eager: true });
const staticMap = {};

for (const k in assets) {
  staticMap[k.replace('/assets/', '')] = assets[k].default;
}

export default function(path) {
  return staticMap[path];
}
