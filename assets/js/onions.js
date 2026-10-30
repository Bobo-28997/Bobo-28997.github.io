/* ============================================================
 * onions.js — 手绘线稿风 SVG 洋葱模板
 * 线稿统一 stroke="currentColor"，颜色随所在容器 color 走。
 * 由 main.js / 页面按需注入（空状态、图片占位等）。
 * ============================================================ */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";

  /** 把 viewBox + inner markup 组装成一段完整的 svg 字符串 */
  function wrap(viewBox, inner, extraAttrs) {
    return (
      '<svg xmlns="' + NS + '" viewBox="' + viewBox + '"' +
      ' fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"' +
      ' aria-hidden="true" focusable="false"' +
      (extraAttrs ? " " + extraAttrs : "") +
      ">" + inner + "</svg>"
    );
  }

  var OnionArt = {};

  /* 空状态洋葱：球体 + 圆点眼 + 下弯嘴 + 放大镜 */
  OnionArt.empty = wrap(
    "0 0 64 64",
    // 球体（灯泡形）
    '<path d="M32 12 C20 24 12 34 12 44 C12 54 21 59 32 59 C43 59 52 54 52 44 C52 34 44 24 32 12 Z" stroke-width="2.4"/>' +
    // 顶部芽
    '<path d="M30 10 C29 6.5 29.5 4 31.5 2" stroke="#7CA35B" stroke-width="2.2"/>' +
    '<path d="M34 11 C35.5 8 37.5 6.5 40 6" stroke="#7CA35B" stroke-width="2.2"/>' +
    // 底部根须
    '<path d="M26 58.5 L25 62.5 M32 59 L32 63 M38 58.5 L39 62.5" stroke-width="2"/>' +
    // 淡层弧线
    '<path d="M22 20 C18.5 27 17 33 18 40" stroke-width="1.6" opacity="0.45"/>' +
    '<path d="M42 20 C45.5 27 47 33 46 40" stroke-width="1.6" opacity="0.45"/>' +
    // 圆点眼
    '<circle cx="26" cy="38" r="1.8" fill="currentColor" stroke="none"/>' +
    '<circle cx="38" cy="38" r="1.8" fill="currentColor" stroke="none"/>' +
    // 下弯嘴（委屈）
    '<path d="M28 47 C30 44.5 34 44.5 36 47" stroke-width="2"/>' +
    // 放大镜
    '<circle cx="45" cy="46" r="7.5" stroke="#7CA35B" stroke-width="2.4"/>' +
    '<path d="M50.5 51.5 L57 58" stroke="#7CA35B" stroke-width="2.8"/>'
  );

  /* 卡片图片占位洋葱（onerror 时替换破图，line-art 版） */
  OnionArt.placeholder = wrap(
    "0 0 64 64",
    '<path d="M32 12 C20 24 12 34 12 44 C12 54 21 59 32 59 C43 59 52 54 52 44 C52 34 44 24 32 12 Z" stroke-width="2.4"/>' +
    '<path d="M30 10 C29 6.5 29.5 4 31.5 2" stroke="#7CA35B" stroke-width="2.2"/>' +
    '<path d="M34 11 C35.5 8 37.5 6.5 40 6" stroke="#7CA35B" stroke-width="2.2"/>' +
    '<path d="M26 58.5 L25 62.5 M32 59 L32 63 M38 58.5 L39 62.5" stroke-width="2"/>' +
    '<path d="M22 22 C18.5 28 17.5 34 18.5 41" stroke-width="1.6" opacity="0.45"/>' +
    '<path d="M42 22 C45.5 28 46.5 34 45.5 41" stroke-width="1.6" opacity="0.45"/>' +
    '<circle cx="27" cy="39" r="1.6" fill="currentColor" stroke="none"/>' +
    '<circle cx="37" cy="39" r="1.6" fill="currentColor" stroke="none"/>' +
    '<path d="M28 46.5 C30 48.5 34 48.5 36 46.5" stroke-width="2"/>'
  );

  window.OnionArt = OnionArt;
})();
