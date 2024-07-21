import { defineUserConfig } from "vuepress";
import { hopeTheme } from "vuepress-theme-hope";

export default defineUserConfig({

  lang: "zh-CN",
  title: "逸燧Bot代挂文档",
  description: "「自由朝天,向心出发」",

  theme: hopeTheme({
  hostname: "https://escateam.icu",

  author: {
    name: "朝天工作室",
    url: "https://escateam.icu",
  },

  iconAssets: "fontawesome-with-brands",

  logo: "https://pi.escaped.icu/1.png",

  repo: "escateam/botdocs",

  docsDir: "src",

  // 导航栏
  navbar: [
  {
    text: "首页",
    icon: "laptop-code",
    link: "/",
    activeMatch: "^/$",
  },
  {
    text: "协议",
    icon: "book",
    link: "/read",
    activeMatch: "^/$",
  },
  {
    text: "朝天工作室",
    icon: "book",
    link: "https://escateam.icu",
    activeMatch: "^/$",
  },
  {
    text: "trss官方文档",
    icon: "signs-post",
    link: "https://trss.me",
    activeMatch: "^/$",
  },
  ],

  // 侧边栏
  sidebar: [
  {
    text: "首页",
    icon: "laptop-code",
    link: "/",
    activeMatch: "^/$",
  },
  {
    text: "快速上手",
    icon: "book",
    link: "/start",
    activeMatch: "^/$",
  },
  {
    text: "详细了解",
    icon: "project",
    link: "/detail/",
    activeMatch: "^/$",
    collapsible: true,
    children: [
      {
        text: "简要介绍",
        icon: "book",
        link: "/detail/introduction",
      },
      {
        text: "已装插件",
        icon: "project",
        link: "/detail/plugins",
      },
      {
        text: "配置阅览",
        icon: "layout",
        link: "/detail/sys",
      },
    ],
  },
  ],

  // 页脚
  footer: "Powered By EscaWorkTeam",
  displayFooter: true,
  
  copyright: "Copyright 2023-present ©朝天工作室",

  metaLocales: {

  },
  
  editLink: false,

  plugins: {
    blog: false,
    comment: {
       provider: "Waline",
       serverURL: "https://waline.escateam.icu",
    },

    components: {
      components: ["Badge", "VPCard"],
    },
    mdEnhance: {
      alert: true,
      align: true,
      attrs: true,
      codetabs: true,
      component: true,
      demo: true,
      figure: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      mark: true,
      tasklist: true,
      footnote: true,
      tabs: true,
      spoiler: true,
      chart: true,
      markmap: true,
      flowchart: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
    },
  },
}),
});
