import { copyFile, cp, mkdir } from 'node:fs/promises';

const output = new URL('../dist/licenses/', import.meta.url);
await mkdir(output, { recursive: true });
await cp(new URL('../licenses/', import.meta.url), output, { recursive: true });

for (const dependency of ['react', 'react-dom', 'scheduler', 'three']) {
  await copyFile(
    new URL(`../node_modules/${dependency}/LICENSE`, import.meta.url),
    new URL(`${dependency}-LICENSE.txt`, output),
  );
}

console.log('Copied font, badge and runtime dependency licenses into dist/licenses/.');
