/* ============================================================
 * 日常娱乐数据
 * 维护方式：复制一个 { ... } 对象，改掉字段即可，位置任意
 * （渲染时会按 date 倒序自动重排）。字段说明见根目录 README.md。
 * 图片路径固定写 ../assets/images/daily/…，不要以 / 开头。
 * ============================================================ */
window.SiteData = window.SiteData || {};

window.SiteData.daily = [
  {
    id: "daily-2026-001",
    date: "2026-01-01",
    title: "作为魂5的成就",
    tags: ["黑暗之魂", "只狼", "艾尔登法环"],
    summary: "时刻准备着化身太阳战士出击。。。",
    body: "反正就是很魂5。",
    images: ["../assets/images/daily/steam1.webp"],
    link: ""
  },
  {
    id: "daily-2026-002",
    date: "2026-04-08",
    title: "我进塔！",
    tags: ["杀戮尖塔", "杀戮尖塔2"],
    summary: "解锁了铁甲战士，储君和机宝的进阶10。",
    body: "东尼更新太难玩，已摸鱼。。。需要某个红蓝色互换的女人。",
    images: ["../assets/images/daily/steam2.webp"],
    link: ""
  },
  {
    id: "daily-2026-003",
    date: "2026-05-22",
    title: "微信龙虾接口实际上可以接自己的东西",
    tags: ["微信", "Generic Agent"],
    summary: "现在微信和钉钉都有bot接口了，感觉实际用处不大。",
    body: "微信开放了一个Clawbot插件。我魔改了一个Generic Agent项目作为我的桌面机器人，打算拿来写周报用，不过后面发现还是不如直接bash用claude code什么的方便。",
    images: ["../assets/images/daily/clawbot.webp"],
    link: "https://github.com/lsdefine/GenericAgent"
  },
  {
    id: "daily-2026-004",
    date: "2026-09-17",
    title: "万紫千红",
    tags: ["火焰纹章"],
    summary: "作为从初中就在玩3DS的火纹老粉，这作是必须体验的，为了这个买的switch2。",
    body: "后续补充：非常推荐，虽然是个半成品，没做完的一半还要卖dlc，剧情前半段十分强壮后半段贫弱不堪，但仍然是有史以来最宏大的火纹作品，战棋八方旅人。",
    images: ["../assets/images/daily/nitendo1.webp"],
    link: "https://store.nintendo.com.hk/70010000126932"
  },
  {
    id: "daily-2026-005",
    date: "2026-10-18",
    title: "上海怪猎荒野联动餐厅",
    tags: ["怪物猎人"],
    summary: "总之感觉还是可以的。",
    body: "潮玩星球工作人员的服务态度一如既往的非常差，东西本身还是可以的。获得了最想要的冻峰龙的徽章。",
    images: ["../assets/images/daily/cafe1.webp"],
    link: ""
  }
];
