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

## 写文章与配置

```bash
npm run new -- "文章标题"
```

- 文章：`source/_posts/*.md`，使用 `date`、`updated`、`tags`、`categories` 等 Hexo front matter。
- 站点配置：`_config.yml`；主题配置：`_config.particlex.yml`。
- 静态资源：`source/images/`、`source/uploads/` 等。
- 主题通过 npm 固定版本安装，更新 `hexo-theme-particlex` 后重新构建即可，无需手动克隆主题。
- 首页使用极简星空背景，支持鼠标视差和拖动旋转；图片为 `source/images/background-stars.png`，样式与交互位于 `source/css/home-stars.css` 和 `source/js/home-stars.js`。
- 头像使用原站 `uploads/head_img.jpg`，可修改主题配置替换。



