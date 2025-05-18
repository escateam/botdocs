import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "逸燧Bot代挂文档",
  description: "适用于逸燧Bot的代挂文档",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
