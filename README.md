# WANGJINXIN Astro Blog

Astro 静态博客。

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

构建产物在 `dist/`，线上 Nginx 当前托管的是这个目录的内容。

## 部署到服务器

当前服务器站点目录：

```text
/app
```

手动部署流程：

```bash
npm run build
zip -r jrain-astro-dist.zip dist/*
scp jrain-astro-dist.zip jrain.cn:/tmp/jrain-astro-dist.zip
```

然后在服务器上备份并替换 `/app`。

## GitHub Pages

如果以后部署到 GitHub Pages，推荐在仓库设置里选择：

```text
Settings -> Pages -> Build and deployment -> GitHub Actions
```

再添加 GitHub Actions workflow 构建 `dist/` 并发布。
