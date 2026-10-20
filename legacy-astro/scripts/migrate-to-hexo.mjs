import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'source');
await mkdir(resolve(output, '_posts'), { recursive: true });
for (const file of await readdir(resolve(root, 'src/content/posts'))) {
  let text = await readFile(resolve(root, 'src/content/posts', file), 'utf8');
  text = text.replace(/^pubDate:/m, 'date:').replace(/^updatedDate:/m, 'updated:')
    .replace(/^legacyPath: (.+)$/m, 'permalink: $1');
  // Old exports contain rendered code tables. Restore code fences for ParticleX.
  text = text.replace(/<figure class="highlight ([^"]+)">[\s\S]*?<td class="code"><pre>([\s\S]*?)<\/pre><\/td><\/tr><\/table><\/figure>/g,
    (_, language, code) => '\n\n```' + language + '\n' + code.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&amp;', '&').trimEnd() + '\n```\n\n');
  text = text.replace('href="href=https://', 'href="https://');
  await writeFile(resolve(output, '_posts', file), text);
}
for (const asset of await readdir(resolve(root, 'public'))) {
  await cp(resolve(root, 'public', asset), resolve(output, asset), { recursive: true });
}
async function page(path, text) {
  await mkdir(resolve(output, path), { recursive: true });
  await writeFile(resolve(output, path, 'index.md'), text);
}
await page('about', `---\ntitle: 关于\nlayout: page\n---\n\n这里是 WANGJINXIN 的个人博客，用来记录技术、服务器维护、工具折腾和一些阶段性的想法。\n\n站点从早期 Hexo/NexT 迁移到 Astro，现在使用 **Hexo + ParticleX**。旧文章链接继续保留。\n`);
await page('2020', `---\ntitle: 2020我的家乡我来拍\nlayout: page\n---\n\n${Array.from({ length: 13 }, (_, i) => `![2020 我的家乡照片 ${i + 1}](/images/2020/pic/${i + 1}.jpg)`).join('\n\n')}\n`);
await page('categories', '---\ntitle: 分类\nlayout: categories\n---\n');
await page('tags', '---\ntitle: 标签\nlayout: tags\n---\n');
await page('posts', '---\ntitle: 文章\nlayout: page\n---\n\n[查看全部文章](/archives/)\n');
await page('tags/docker-centos', '---\ntitle: docker-centos\nlayout: page\n---\n\n[Dockerfile问题解决](/2019/03/21/docker-entry-point/)\n\n[最近使用docker碰到的一些问题记录下](/2018/08/31/docker-problems/)\n');
await writeFile(resolve(output, 'robots.txt'), 'User-agent: *\nAllow: /\nDisallow: /.git/\nSitemap: https://jrain.cn/sitemap.xml\n');
await writeFile(resolve(output, '.nojekyll'), '');
await writeFile(resolve(output, 'images/avatar.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" rx="100" fill="#355c7d"/><text x="100" y="126" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="72">WJ</text></svg>');
await writeFile(resolve(output, 'images/background.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#182b49"/><stop offset=".55" stop-color="#526c93"/><stop offset="1" stop-color="#c9b1ca"/></linearGradient></defs><path fill="url(#bg)" d="M0 0h1920v1080H0z"/><path fill="#fff" opacity=".1" d="M0 850 480 400 1000 900 1450 350 1920 850v230H0z"/></svg>');
