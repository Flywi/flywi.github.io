export function GET() {
  return new Response(
    ['User-agent: *', 'Allow: /', 'Disallow: /.git/', 'Sitemap: https://jrain.cn/sitemap-index.xml', ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
