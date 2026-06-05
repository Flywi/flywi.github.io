import { getCollection } from 'astro:content';

export async function GET() {
  const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  const updated = posts[0]?.data.updatedDate ?? posts[0]?.data.pubDate ?? new Date();
  const entries = posts
    .map((post) => {
      const url = `https://jrain.cn${post.data.legacyPath}`;
      return `<entry>
  <title>${escapeXml(post.data.title)}</title>
  <link href="${url}" />
  <id>${url}</id>
  <updated>${(post.data.updatedDate ?? post.data.pubDate).toISOString()}</updated>
  <summary>${escapeXml(post.data.description ?? '')}</summary>
</entry>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>WANGJINXIN</title>
  <link href="https://jrain.cn/" />
  <link href="https://jrain.cn/atom.xml" rel="self" />
  <id>https://jrain.cn/</id>
  <updated>${updated.toISOString()}</updated>
${entries}
</feed>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  });
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
