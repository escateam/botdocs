import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";

const __dirname = getDirname(import.meta.url);
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  head: [
    [
      "link",
      {
        href: "https://cdn.staticfile.org/lxgw-wenkai-screen-webfont/1.7.0/lxgwwenkaiscreen.css",
        rel: "stylesheet",
      },
    ],
    
  ],
  lang: "zh-CN",
  title: "逸燧Bot代挂文档",
  description: "适用于逸燧Bot的代挂文档",

  theme,

  alias: {
    "@pluginList": path.resolve(__dirname, "components/pluginList.vue"),
  },

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
