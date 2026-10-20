const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { load } = require('js-yaml');

// Hexo deep-merges theme settings. Replace these maps so upstream demo links
// and English menu entries do not survive alongside our custom navigation.
hexo.extend.filter.register('before_generate', () => {
  const settings = load(readFileSync(join(hexo.base_dir, '_config.particlex.yml'), 'utf8'));
  hexo.theme.config.menu = settings.menu;
  hexo.theme.config.background = settings.background;
  hexo.theme.config.card.friendLinks = settings.card.friendLinks;
});
