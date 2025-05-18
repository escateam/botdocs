import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "指南",
      icon: "lightbulb",
      prefix: "guide/",
      link: "guide/",
      children: "structure",
    },
    {
      text: "案例",
      icon: "laptop-code",
      prefix: "high/",
      link: "high/",
      children: "structure",
    },
  ],
});
