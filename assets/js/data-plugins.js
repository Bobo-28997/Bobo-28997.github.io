/* ============================================================
 * 个人插件数据（RPG Maker 插件博客）
 * 维护方式：复制一个 { ... } 对象，改掉字段即可，位置任意
 * （渲染时会按 date 倒序自动重排）。字段说明见根目录 README.md。
 * 图片路径固定写 ../assets/images/plugins/…，不要以 / 开头。
 * ============================================================ */
window.SiteData = window.SiteData || {};

window.SiteData.plugins = [
  // 示例条目（复制取消注释后按需修改）：
   {
     id: "plugins-2026-001",
     date: "2026-7-29",
     title: "喜欢用的素材网站",
     tags: ["RPG Maker MZ", "BGM"],
     summary: "日本社区创作者的免费素材网站。",
     body: "Moon☆Wind四人组，非常棒的创意网站。",
     images: ["../assets/images/plugins/test1.webp"],
     link: "https://moonwind.pw/material_sound.html"
   }
];
