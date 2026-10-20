const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { load } = require('js-yaml');

hexo.extend.injector.register('head_end', '<link rel="stylesheet" href="/css/home-stars.css">', 'home');
hexo.extend.injector.register('body_end', '<script src="/js/home-stars.js" defer></script>', 'home');
hexo.extend.injector.register('head_end', '<link rel="stylesheet" href="/css/cursor.css">');
hexo.extend.injector.register('body_end', '<script src="/js/cursor-trail.js" defer></script>');
// Inline loader styles before theme CDN requests to avoid a white loading screen.
hexo.extend.injector.register('head_begin', () => `<style>${readFileSync(join(hexo.base_dir, 'source/css/loading-stars.css'), 'utf8')}</style>`);
hexo.extend.filter.register('after_render:html', (html) => html.replace(
  /<div id="loading-circle">[\s\S]*?<\/div>/,
  `<div id="loading-circle" role="status" aria-live="polite">
    <div class="loading-orbit" aria-hidden="true"><span class="loading-star"></span><span class="loading-satellite"></span></div>
    <h2>WANGJINXIN</h2>
    <p>LOADING<span class="loading-dots" aria-hidden="true">...</span></p>
  </div>`,
));

// Hexo deep-merges theme settings. Replace these maps so upstream demo links
// and English menu entries do not survive alongside our custom navigation.
hexo.extend.filter.register('before_generate', () => {
  const settings = load(readFileSync(join(hexo.base_dir, '_config.particlex.yml'), 'utf8'));
  hexo.theme.config.menu = settings.menu;
  hexo.theme.config.background = settings.background;
  hexo.theme.config.card.friendLinks = settings.card.friendLinks;
});
