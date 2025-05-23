import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "TRSS-Yunzai",
    icon: "code",
    link: "https://gitee.com/TimeRainStarSky/Yunzai"
  },
  {
    text: "关于",
    icon: "info",
    prefix: "about",
    link: "about"
  },
  {
    text: "友情链接",
    icon: "link",
    prefix: "link",
    link: "link"
  }
]);
