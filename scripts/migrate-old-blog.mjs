import { mkdir, readFile, writeFile, cp, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const project = join(root, '..');
const oldApp = join(project, '..', 'old-app');

const posts = [
  { id: 'hello-world', source: '2018/07/17/hello-world/index.html', legacyPath: '/2018/07/17/hello-world/', pubDate: '2018-07-17' },
  { id: 'markdown', source: '2018/07/17/markdown/index.html', legacyPath: '/2018/07/17/markdown/', pubDate: '2018-07-17' },
  { id: 'docker-problems', source: '2018/08/31/docker-problems/index.html', legacyPath: '/2018/08/31/docker-problems/', pubDate: '2018-08-31', tags: ['docker', 'centos'] },
  { id: 'docker-entry-point', source: '2019/03/21/docker-entry-point/index.html', legacyPath: '/2019/03/21/docker-entry-point/', pubDate: '2019-03-21', tags: ['docker'] },
];

await mkdir(join(project, 'src/content/posts'), { recursive: true });
await mkdir(join(project, 'public'), { recursive: true });

for (const asset of ['images', 'uploads', 'live2dw']) {
  await cp(join(oldApp, asset), join(project, 'public', asset), { recursive: true, force: true });
}

try {
  await copyFile(join(oldApp, 'uploads/favicon_m.ico'), join(project, 'public/favicon.ico'));
} catch {
  // The build can continue without a favicon.
}

for (const post of posts) {
  const html = await readFile(join(oldApp, post.source), 'utf8');
  const title = pick(html, /<h1 class="post-title"[^>]*>([\s\S]*?)<\/h1>/) ?? post.id;
  const description =
    pick(html, /<meta name="description" content="([^"]*)">/) ??
    stripHtml(pick(html, /<div class="post-body">([\s\S]*?)<\/div>/) ?? '').slice(0, 140);
  const updatedDate = pick(html, /<meta property="og:updated_time" content="([^"]*)">/);
  const body = cleanupBody(pick(html, /<div class="post-body">([\s\S]*?)<\/div>\s*<\/div>/) ?? '');
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(stripHtml(title))}`,
    `description: ${JSON.stringify(decodeEntities(description).replace(/\s+/g, ' ').trim())}`,
    `pubDate: ${post.pubDate}`,
    updatedDate ? `updatedDate: ${updatedDate}` : '',
    `legacyPath: ${JSON.stringify(post.legacyPath)}`,
    `tags: ${JSON.stringify(post.tags ?? [])}`,
    '---',
    '',
  ]
    .filter(Boolean)
    .join('\n');

  await writeFile(join(project, 'src/content/posts', `${post.id}.md`), `${frontmatter}\n\n${body.trim()}\n`, 'utf8');
}

function pick(value, pattern) {
  const match = value.match(pattern);
  return match?.[1]?.trim();
}

function cleanupBody(value) {
  return value
    .replaceAll('\r\n', '\n')
    .replace(/<a href="#[^"]+" class="headerlink" title="[^"]*"><\/a>/g, '')
    .replace(/\?v=6\.3\.0/g, '')
    .replace(/<span[^>]*>/g, '')
    .replace(/<\/span><br>/g, '\n')
    .replace(/<\/span>/g, '')
    .replace(/<br><figure/g, '\n<figure')
    .replace(/<\/figure><\/p>/g, '</figure>')
    .replace(/<p>\s*<figure/g, '<figure')
    .replace(/\n{3,}/g, '\n\n');
}

function stripHtml(value) {
  return decodeEntities(value.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
