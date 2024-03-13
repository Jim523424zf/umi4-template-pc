import { defineConfig } from "@umijs/max";

/**
 * 路由配置
 */
export default defineConfig({
  history: {
    type: "hash",
  },
  routes: [
    // {
    //   path: "/welcome",
    //   component: "IndexPage",
    //   name: "欢迎", // 兼容此写法
    //   icon: "testicon",
    //   // 更多功能查看
    //   // https://beta-pro.ant.design/docs/advanced-menu
    //   // ---
    //   // 新页面打开
    //   target: "_blank",
    //   // 不展示顶栏
    //   headerRender: false,
    //   // 不展示页脚
    //   footerRender: false,
    //   // 不展示菜单
    //   menuRender: false,
    //   // 不展示菜单顶栏
    //   menuHeaderRender: false,
    //   // 权限配置，需要与 plugin-access 插件配合使用
    //   access: "canRead",
    //   // 隐藏子菜单
    //   hideChildrenInMenu: true,
    //   // 隐藏自己和子菜单
    //   hideInMenu: true,
    //   // 在面包屑中隐藏
    //   hideInBreadcrumb: true,
    //   // 子项往上提，仍旧展示,
    //   flatMenu: true,
    // },
    {
      path: "/",
      component: "@/pages/Index",
      layout: false,
    },
    {
      path: "/login",
      component: "@/pages/Login",
      layout: false,
    },
    // 内部门户
    {
      name: "internal",
      path: "/internal",
      hideInBreadcrumb: true, // 在面包屑中隐藏
      routes: [
        {
          name: "Home",
          icon: "HomeOutlined",
          path: "/internal/home",
          component: "@/pages/internal/Home",
          wrappers: ["@/wrappers/auth"],
          access: "canReadByLogin",
          // menuRender: false,
        },
        {
          name: "DashBoard",
          locale: "",
          icon: "WindowsOutlined",
          path: "/internal/dash-board",
          component: "@/pages/internal/DashBoard",
          wrappers: ["@/wrappers/auth"],
          access: "canReadByLogin",
        },
        {
          name: "Form Page",
          locale: "",
          icon: "ToTopOutlined",
          path: "/internal/formPage",
          routes: [
            {
              name: "Basic Form",
              locale: "",
              path: "/internal/formPage/basicForm",
              component: "@/pages/internal/FormPage/basicPage",
              wrappers: ["@/wrappers/auth"],
              access: "canReadByLogin",
            },
            {
              name: "Advanced Form",
              path: "/internal/formPage/advancedForm",
              component: "@/pages/internal/FormPage/advancedForm",
              wrappers: ["@/wrappers/auth"],
              access: "canReadByLogin",
            },
          ],
        },
        {
          name: "List Page",
          locale: "",
          icon: "BarsOutlined",
          path: "/internal/listPage",
          routes: [
            {
              name: "Enquiry Form",
              locale: "",
              path: "/internal/listPage/enquiryForm",
              component: "@/pages/internal/ListPage/enquiryForm",
              wrappers: ["@/wrappers/auth"],
              access: "canReadByLogin",
            },
            {
              name: "basicList",
              locale: "",
              path: "/internal/listPage/basicList",
              component: "@/pages/internal/ListPage/BasicList",
              wrappers: ["@/wrappers/auth"],
              access: "canReadByLogin",
            },
            {
              name: "cardList",
              locale: "",
              path: "/internal/listPage/cardList",
              component: "@/pages/internal/ListPage/cardList",
              wrappers: ["@/wrappers/auth"],
              access: "canReadByLogin",
            },
            {
              name: "searchList",
              locale: "",
              path: "/internal/listPage/searchList",
              component: "@/pages/internal/ListPage/searchList",
              wrappers: ["@/wrappers/auth"],
              access: "canReadByLogin",
            },
          ],
        },
        {
          name: "resultPage",
          locale: "",
          icon: "CodeSandboxOutlined",
          path: "/internal/resultPage",
          component: "@/pages/internal/ResultPage/index",
          wrappers: ["@/wrappers/auth"],
          access: "canReadByLogin",
        },
        {
          name: "detailPage",
          locale: "",
          icon: "ApartmentOutlined",
          path: "/internal/detailPage",
          component: "@/pages/internal/DetailPage/index",
          wrappers: ["@/wrappers/auth"],
          access: "canReadByLogin",
        },
      ],
    },
    // 内部门户 一些不走layout的表单页
    {
      name: "internal-demo",
      path: "/internal/demo",
      component: "@/pages/internal/Demo",
      layout: false,
    },
    // 其他门户
    {
      name: "outer",
      path: "/outer",
      routes: [
        {
          name: "home",
          locale: "menu.internal.home",
          icon: "HomeOutlined",
          path: "/outer/home",
          component: "@/pages/internal/Home",
          wrappers: ["@/wrappers/auth"],
        },
      ],
    },
    { path: "/403", component: "@/pages/403.tsx", layout: false },
    { path: "/500", component: "@/pages/500.tsx", layout: false },
    { path: "/*", component: "@/pages/404.tsx", layout: false },
  ],
});
