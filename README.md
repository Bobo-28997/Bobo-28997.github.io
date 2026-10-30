# 洋葱的小站 🧅

一颗洋葱的个人展示网站。纯手写 HTML / CSS / JS，**零依赖、零构建**，
直接部署在 GitHub Pages 项目站点（`username.github.io/repo/` 这种子路径）也能正常工作。

## 目录结构

```
.
├── index.html                  # 个人主页（简介 / 技能 / 经历时间线）
├── works/index.html            # 工作作品（博客流 + 搜索）
├── plugins/index.html          # 个人插件（RPG Maker 插件博客流 + 搜索）
├── daily/index.html            # 日常娱乐（博客流 + 搜索）
├── treasures/index.html        # 洋葱宝藏（博客流 + 搜索，网格布局）
├── 404.html                    # 自动逐级回退跳回首页
├── assets/
│   ├── favicon.svg
│   ├── css/style.css           # 设计 token + 全部样式（改主题色在这里）
│   ├── js/
│   │   ├── data-works.js       # 工作作品数据
│   │   ├── data-plugins.js     # 个人插件数据
│   │   ├── data-daily.js       # 日常娱乐数据
│   │   ├── data-treasures.js   # 洋葱宝藏数据
│   │   ├── onions.js           # SVG 洋葱模板（空状态 / 图片占位）
│   │   └── main.js             # 渲染 / 排序 / 搜索 / 导航高亮
│   └── images/
│       ├── avatar/             # 头像（替换 hero 里的占位 SVG）
│       ├── works/              # 工作作品配图
│       ├── plugins/            # 个人插件配图
│       ├── daily/              # 日常配图
│       └── treasures/          # 宝藏配图
└── README.md
```

## 本地预览

```bash
python -m http.server 8080 --bind 127.0.0.1 --directory .
# 然后浏览器打开 http://127.0.0.1:8080/
```

必须通过 HTTP 访问（不要直接双击 HTML 文件），否则 ES 数据脚本路径与 404 行为都会不正常。

## 如何新增一条内容

1. 打开对应板块的数据文件：`assets/js/data-works.js`、`data-plugins.js`、`data-daily.js` 或 `data-treasures.js`。
2. **复制一个完整的 `{ ... }` 对象**，粘贴到数组里任意位置（顺序无所谓，页面会按日期倒序自动排列）。
3. 逐个修改字段：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | ✅ | 全站唯一即可，建议 `板块-年份-序号`，如 `daily-2026-013` |
| `date` | ✅ | `YYYY-MM-DD` 格式，排序依据 |
| `title` | ✅ | 标题 |
| `tags` | 建议 | 字符串数组，标签会渲染成可点击的 pill（点击即搜索） |
| `summary` | 建议 | 一句话摘要，显示在卡片上 |
| `body` | 建议 | 完整正文（纯文本），参与搜索、暂不上屏 |
| `images` | 可选 | 图片路径数组，只取第一张做卡片封面；空数组显示线稿洋葱占位 |
| `link` | 可选 | 外链（GitHub 仓库、原文等），不写就不显示「查看链接」 |

4. 保存刷新页面即可看到新条目，搜索框里输入关键词应能命中。

## 如何放图片

1. 把图片放进 `assets/images/<板块>/`（如 `assets/images/daily/`）。
2. 数据条目里写**相对路径**，固定以 `../assets/images/` 开头，例如：

```js
images: ["../assets/images/daily/hiking-0830.webp"]
```

⚠️ 不要以 `/` 开头（部署到 `username.github.io/repo/` 子路径时会 404）。
推荐 WebP / PNG，宽度 1200px 左右即可；页面用 `loading="lazy"` 加载，图片加载失败会自动换成线稿洋葱占位。

## 如何换成自己的头像

把头像图片放进 `assets/images/avatar/`（如 `me.webp`），然后编辑 `index.html`，
把 `.avatar` 里的占位 `<svg>…</svg>` 换成：

```html
<img src="assets/images/avatar/me.webp" alt="洋葱的头像">
```

## 改主题色 / 字体

所有颜色、圆角、阴影都是 CSS 变量，集中在 `assets/css/style.css` 顶部的 `:root` 里：

- `--color-bg` 米白底（#FAF6EF）
- `--color-primary` 洋葱皮紫（#9B7EBD）
- `--color-accent` 葱苗绿（#7CA35B）
- `--color-text` 墨紫灰正文（#3A3143）

## 部署到 GitHub Pages（项目站点）

```bash
git init
git add .
git commit -m "init: 洋葱小站上线"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

然后到仓库 **Settings → Pages → Build and deployment**：
Source 选 **Deploy from a branch**，Branch 选 **main**、目录选 **/(root)**，保存。

稍等一两分钟，访问 `https://<你的用户名>.github.io/<仓库名>/` 即可。
全站均为相对路径，子路径部署无需任何配置；`404.html` 会自动逐级回退跳回首页。
