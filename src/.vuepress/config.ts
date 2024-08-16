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
  },
  {
    text: "协议",
    icon: "book",
    link: "/read",
  },
  {
    text: "赞助",
    icon: "lightbuld",
    link: "/support",
  },
  {
    text: "朝天工作室",
    icon: "book",
    link: "https://escateam.icu",
  },
  {
    text: "trss官方文档",
    icon: "signs-post",
    link: "https://trss.me",
  },
  ],

  // 侧边栏
  sidebar: [
  {
    text: "首页",
    icon: "home",
    link: "/",
  },
  {
    text: "快速上手",
    icon: "book",
    link: "/start",
  },
  {
    text: "详细了解",
    icon: "laptop-code",
    link: "/detail/",
    collapsible: true,
    children: [
      {
        text: "简要介绍",
        icon: "book",
        link: "/detail/introduction",
      },
      {
        text: "已装插件",
        icon: "book",
        link: "/detail/plugins",
        children: [
          {
            text: "js插件列表",
            icon: "laptop-code",
            link: "/js/",
          },
          {
            text: "X抠图",
            icon: "laptop-code",
            link: "/js/xkoutu",
          },
          {
            text: "网页截图预览",
            icon: "laptop-code",
            link: "/js/webview",
          },
          {
            text: "看图片",
            icon: "laptop-code",
            link: "/js/kantupian",
          },
          {
            text: "艾特主人回复",
            icon: "laptop-code",
            link: "/js/atadminreply",
          },
          {
            text: "电子木鱼",
            icon: "laptop-code",
            link: "/js/dianzimuyu",
          },
          {
            text: "广播通知",
            icon: "laptop-code",
            link: "/js/guangbotongzhi",
          },
          {
            text: "不要戳主人啦~",
            icon: "laptop-code",
            link: "/js/dontpadmin",
          },
        ],
      },
      {
        text: "配置阅览",
        icon: "book",
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
      // 你想使用的组件
      components: [
        "ArtPlayer",
        "Badge",
        "BiliBili",
        "CodePen",
        "PDF",
        "Share",
        "SiteInfo",
        "StackBlitz",
        "VPBanner",
        "VPCard",
        "VidStack",
        "XiGua",
      ],
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
