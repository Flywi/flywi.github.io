# WANGJINXIN Blog

基于 Hexo 8 + [ParticleX 2.8.1](https://github.com/theme-particlex/hexo-theme-particlex) 的静态博客，站点地址 https://jrain.cn。

## 开发与构建

使用 Node.js 22.12+（部署环境使用 Node.js 24）：

```bash
npm ci
npm run dev
```

打开 http://127.0.0.1:4321。构建与预览：

```bash
npm run build
npm run preview
```

构建目录仍为 `dist/`，现有 GitHub Pages 和服务器部署工作流继续使用此目录。服务器站点目录为 `/app`。

## 写文章与配置

```bash
npm run new -- "文章标题"
```

- 文章：`source/_posts/*.md`，使用 `date`、`updated`、`tags`、`categories` 等 Hexo front matter。
- 站点配置：`_config.yml`；主题配置：`_config.particlex.yml`。
- 静态资源：`source/images/`、`source/uploads/` 等。
- 主题通过 npm 固定版本安装，更新 `hexo-theme-particlex` 后重新构建即可，无需手动克隆主题。
- 背景使用 ParticleX 自带图片，头像使用原站 `uploads/head_img.jpg`，可修改主题配置替换。

## 迁移说明

从 Astro 迁移，保留 4 篇文章及其原始 URL、13 张相册照片、关于页、旧文章/标签入口和 `/atom.xml`。旧 HTML 代码表格转换为 Markdown 代码块以适配主题高亮。

站点地图为 `/sitemap.xml`，旧 `/sitemap-index.xml` 入口也保留。ParticleX 默认使用 CDN 加载 Vue、图标、字体和高亮资源。

旧 Astro 源码、资源、导入脚本和 Yarn 锁文件归档在 `legacy-astro/`，不参与 Hexo 构建。

## 手动部署

```bash
npm run build
tar -czf site.tar.gz -C dist .
scp site.tar.gz jrain.cn:/tmp/jrain-site.tar.gz
```

在服务器备份 `/app` 后替换为解压后的站点文件。推送 `master` 会触发现有服务器和 GitHub Pages 部署工作流。
