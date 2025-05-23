import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "代挂教程",
      icon: "lightbulb",
      prefix: "guide/",
      link: "guide/",
      children: "structure",
    },
    {
      text: "配置信息",
      icon: "sliders",
      prefix: "infos/",
      link: "infos",
    },
    {
      text: "服务条款",
      icon: "lock",
      prefix: "limit",
      link: "limit"
    }
  ],
});
