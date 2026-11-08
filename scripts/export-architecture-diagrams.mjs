import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const destination = path.join(root, 'docs', 'diagrams');
await mkdir(destination, { recursive: true });

for (const [file, prefix] of [
  ['HIGH_LEVEL_DESIGN.md', 'H'],
  ['LOW_LEVEL_DESIGN.md', 'L'],
]) {
  const markdown = await readFile(path.join(root, 'docs', file), 'utf8');
  const diagrams = [...markdown.matchAll(/```mermaid\r?\n([\s\S]*?)```/g)];
  if (diagrams.length === 0) throw new Error(`No Mermaid diagrams found in ${file}`);
  for (const [index, match] of diagrams.entries()) {
    const name = `${prefix}${index + 1}.mmd`;
    await writeFile(path.join(destination, name), `${match[1].trim()}\n`, 'utf8');
    console.log(`${file}: exported ${name}`);
  }
}
