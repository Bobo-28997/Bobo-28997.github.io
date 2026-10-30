/* ============================================================
 * main.js — 全站行为
 * 首页（data-page="home"）：只做导航高亮。
 * 列表页（works / plugins / daily / treasures）：渲染卡片、date 倒序、
 * 前端搜索（防抖 200ms）、计数播报、空状态、tag 点击过滤。
 *
 * 安全约定：所有来自数据文件的动态文本一律用 textContent 写入，
 * 不拼接 innerHTML；仅注入本文件内受控的 OnionArt SVG 模板。
 * ============================================================ */
(function () {
  "use strict";

  var page = document.body.dataset.page || "";

  // 到达正常页面说明 404 回退已结束，清空 404.html 里的连续跳转计数
  try { sessionStorage.removeItem("onion404"); } catch (e) { /* ignore */ }

  /* ----------------------------------------------------------
   * 导航高亮（所有页面）
   * -------------------------------------------------------- */
  function highlightNav() {
    if (!page) return;
    var link = document.querySelector('.site-nav__link[data-nav="' + page + '"]');
    if (link) link.classList.add("is-active");
  }

  /* ----------------------------------------------------------
   * 工具
   * -------------------------------------------------------- */
  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var args = arguments;
      var self = this;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(self, args);
      }, wait);
    };
  }

  /** 把受控的 SVG 字符串模板挂到容器上（内容为代码内常量，非用户数据） */
  function mountSvg(container, svgMarkup) {
    container.innerHTML = svgMarkup;
    var svg = container.querySelector("svg");
    if (svg) svg.setAttribute("role", "img");
  }

  /* ----------------------------------------------------------
   * 首页：只做导航高亮
   * -------------------------------------------------------- */
  highlightNav();

  /* ----------------------------------------------------------
   * 首页头像：照片加载成功变实线圆框；缺失/破图换洋葱占位
   * -------------------------------------------------------- */
  var avatarBox = document.querySelector(".avatar");
  var avatarImg = avatarBox && avatarBox.querySelector("img");
  if (avatarBox && avatarImg) {
    var markPhoto = function () {
      avatarBox.classList.add("avatar--photo");
    };
    var swapToPlaceholder = function () {
      avatarImg.replaceWith(makePlaceholder());
    };
    if (avatarImg.complete) {
      // defer 脚本执行时图片可能已加载完，事件不再触发，直接查状态
      if (avatarImg.naturalWidth > 0) markPhoto();
      else swapToPlaceholder();
    } else {
      avatarImg.addEventListener("load", markPhoto);
      avatarImg.addEventListener("error", swapToPlaceholder);
    }
  }

  if (page === "home" || !page) return;

  /* ----------------------------------------------------------
   * 列表页
   * -------------------------------------------------------- */
  var listEl = document.getElementById("card-list");
  var countEl = document.getElementById("result-count");
  var emptyEl = document.getElementById("empty-state");
  var inputEl = document.getElementById("search-input");

  // 结构缺失时静默退出，避免在错误页面上抛错
  if (!listEl || !countEl || !emptyEl) return;

  var items = (window.SiteData && window.SiteData[page]) || [];
  var hasDataFile = !!(window.SiteData && window.SiteData[page]);

  // treasures 网格页保持紧凑卡片；works / daily 使用文章式布局
  var isArticleLayout = !listEl.classList.contains("card-list--grid");

  // date 支持两种格式：ISO YYYY-MM-DD（works/daily）与纯年份（treasures，含负数公元前）。
  // 统一转成数值比较，避免字典序对位数不同的年份错乱（如 "621" > "1921"）。
  var YEAR_ONLY_RE = /^-?\d+$/;
  function dateValue(value) {
    var s = String(value == null ? "" : value).trim();
    if (YEAR_ONLY_RE.test(s)) return parseFloat(s);
    var t = Date.parse(s);
    return isNaN(t) ? NaN : t;
  }
  items = items.slice().sort(function (a, b) {
    var av = dateValue(a.date);
    var bv = dateValue(b.date);
    if (isNaN(av) && isNaN(bv)) return 0;
    if (isNaN(av)) return 1;  // 缺失日期排最后
    if (isNaN(bv)) return -1;
    return bv - av;           // 倒序：新的在前
  });

  /** 无图 / 破图时显示的线稿洋葱占位（受控常量） */
  function makePlaceholder() {
    var span = document.createElement("span");
    if (window.OnionArt && window.OnionArt.placeholder) {
      span.innerHTML = window.OnionArt.placeholder;
    }
    return span;
  }

  /** 建一张首图，加载失败换成洋葱占位 */
  function makeImage(src, title) {
    var img = document.createElement("img");
    img.loading = "lazy";
    img.decoding = "async";
    img.src = src;
    img.alt = title ? title + " 的配图" : "配图";
    img.addEventListener("error", function () {
      img.replaceWith(makePlaceholder());
    });
    return img;
  }

  /** 用 textContent 安全写入文本 */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  /** 卡片首图 / 占位 */
  function buildMedia(item) {
    var media = el("div", "card__media");
    var first = item.images && item.images[0];
    if (first) {
      media.appendChild(makeImage(first, item.title));
    } else {
      media.appendChild(makePlaceholder());
    }
    return media;
  }

  /** 标签 pills（点击填入搜索框），无标签返回 null */
  function buildTags(item) {
    if (!item.tags || !item.tags.length) return null;
    var tags = el("ul", "card__tags");
    item.tags.forEach(function (t) {
      var liTag = el("li");
      var btn = el("button", "pill pill--button", String(t));
      btn.type = "button";
      btn.setAttribute("aria-label", "搜索标签：" + t);
      btn.addEventListener("click", function () {
        if (!inputEl) return;
        inputEl.value = t;
        inputEl.focus();
        applyFilter(t);
      });
      liTag.appendChild(btn);
      tags.appendChild(liTag);
    });
    return tags;
  }

  /**
   * works / daily：文章式卡片 —— 标题置顶，下方左图右信息
   * （上 tags 下 summary），正文全文随后完整展示。
   * treasures：保持原有紧凑网格卡片。
   */
  function buildCard(item) {
    var li = el("li", isArticleLayout ? "card card--article" : "card");

    if (isArticleLayout) {
      // 标题 + 日期置顶
      var header = el("header", "card__header");
      header.appendChild(el("h2", "card__title", String(item.title || "未命名条目")));
      header.appendChild(el("p", "card__meta", String(item.date || "")));
      li.appendChild(header);

      // 左图右信息
      var main = el("div", "card__main");
      main.appendChild(buildMedia(item));

      var side = el("div", "card__side");
      var tags = buildTags(item);
      if (tags) side.appendChild(tags);
      if (item.summary) {
        side.appendChild(el("p", "card__summary", String(item.summary)));
      }
      main.appendChild(side);
      li.appendChild(main);

      // 正文全文
      if (item.body) {
        li.appendChild(el("p", "card__text", String(item.body)));
      }
    } else {
      // 原网格卡片布局
      li.appendChild(buildMedia(item));

      var body = el("div", "card__body");
      body.appendChild(el("p", "card__meta", String(item.date || "")));
      body.appendChild(el("h2", "card__title", String(item.title || "未命名条目")));
      if (item.summary) {
        body.appendChild(el("p", "card__summary", String(item.summary)));
      }
      var gridTags = buildTags(item);
      if (gridTags) body.appendChild(gridTags);
      li.appendChild(body);
    }

    // 可选外链
    if (item.link) {
      var a = el("a", "card__link", "查看链接 →");
      a.href = String(item.link);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      if (isArticleLayout) li.appendChild(a);
      else body.appendChild(a);
    }

    return li;
  }

  /** 计数播报：无查询「共 N 条」；有查询「匹配 M / 共 N 条」 */
  function updateCount(matched, query) {
    var total = items.length;
    countEl.textContent = query
      ? "匹配 " + matched + " / 共 " + total + " 条"
      : "共 " + total + " 条";
  }

  /** 空状态：搜索无结果（线稿洋葱）或数据为空（纯文案） */
  function renderEmpty(mode) {
    emptyEl.textContent = "";
    var box = el("div", "empty");

    if (mode === "no-result" && window.OnionArt && window.OnionArt.empty) {
      var art = document.createElement("div");
      art.innerHTML = window.OnionArt.empty;
      box.appendChild(art);
      box.appendChild(el("p", "empty__title", "一颗洋葱也没有找到"));
      box.appendChild(el("p", null, "换个关键词试试，或者清空搜索框看全部内容。"));
    } else {
      box.appendChild(el("p", "empty__title", "这里还空空如也"));
      box.appendChild(el("p", null, "往对应的数据文件里加一条记录，它就会出现在这里。"));
    }
    emptyEl.appendChild(box);
  }

  function renderList(query) {
    var q = String(query || "").trim().toLowerCase();

    var matched = q
      ? items.filter(function (item) {
          var hay = [
            item.title,
            item.summary,
            item.body,
            (item.tags || []).join(" ")
          ]
            .map(function (v) { return String(v || "").toLowerCase(); })
            .join("\n");
          // 纯字符串 includes，不构造 RegExp，避免注入与转义问题
          return hay.indexOf(q) !== -1;
        })
      : items;

    listEl.textContent = "";
    emptyEl.textContent = "";

    if (matched.length) {
      var frag = document.createDocumentFragment();
      matched.forEach(function (item) {
        frag.appendChild(buildCard(item));
      });
      listEl.appendChild(frag);
    } else if (q) {
      renderEmpty("no-result");
    } else {
      renderEmpty("no-data");
    }

    updateCount(matched.length, q);
  }

  /** 数据文件缺失时的友好提示（不抛错） */
  function renderMissingData() {
    listEl.textContent = "";
    var notice = el("p", "notice");
    notice.textContent =
      "没有找到数据文件（assets/js/data-" +
      page +
      ".js）。请确认文件存在，并在其中给 window.SiteData." +
      page +
      " 赋一个数组。";
    listEl.parentNode.insertBefore(notice, listEl);
    countEl.textContent = "共 0 条";
  }

  /* 搜索：防抖 200ms */
  var applyFilter = debounce(function (value) {
    renderList(value);
  }, 200);

  if (inputEl) {
    inputEl.addEventListener("input", function (e) {
      applyFilter(e.target.value);
    });
  }

  // 初始化：数据缺失给提示；数据为空给空状态；正常则渲染全部
  if (!hasDataFile) {
    renderMissingData();
  } else {
    renderList("");
  }
})();
