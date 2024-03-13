import avatarIcon from "@/assets/images/avatarIcon.png";
import logo from "@/assets/images/logo.png";
import { CustomLayoutHeaderTitle } from "@/components/CustomLayoutHeader/Title";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoginRedirect } from "@/components/Login/LoginRedirect";
import ThemeLocalProvider from "@/components/ThemeLocalProvider";
import { authState } from "@/models/auth/state";
import { myMsal } from "@/services/msal";
import { logUtil } from "@/utils/logUtil";
import { requestConfig } from "@/utils/request";
import { MenuDataItem } from "@ant-design/pro-components";
import { defineApp, getRightRenderContent } from "@umijs/max";
import { App } from "antd";
import React from "react";

// 配置参考：https://umijs.org/docs/api/runtime-config
export default defineApp({
  // 加载layout的时候会触发
  layout: () => {
    return {
      disableMobile: true,
      fixSidebar: true,
      logo,
      title: "System Name",
      layout: "mix",
      splitMenus: true,
      menu: {
        // 每当params发生修改，且layout加载时，会重新执行 request
        params: { account: authState.account },
        request: async (params, defaultMenuData) => {
          logUtil.log("menu.request", params.account, defaultMenuData);
          let newMenuData: MenuDataItem[] = [];
          if (!params.account) {
            // 没菜单必须处理，否则页面会破相。登录异常跳登录页，否则没权限走404页
            if (authState.loginError || !authState.account) {
              myMsal.goToLoginPage();
            } else {
              myMsal.goTo404();
            }
            return newMenuData;
          }
          /** 根据登录类型过滤菜单 */
          function filterNewMenuData(defaultMenuData: MenuDataItem[]) {
            if (myMsal.isAAD) {
              return defaultMenuData.filter((x) => x.name === "internal");
            }
            if (myMsal.isB2C) {
              return defaultMenuData.filter((x) => x.name === "supplier");
            }
            return [];
          }
          /** 获取可显示的菜单 */
          // function filterNewMenuDataByAuthCodes(menuData: MenuDataItem[], authCodeList: string[]) {
          //   const convertMenuData: MenuDataItem[] = menuData.map((x: MenuDataItem) => {
          //     if (x.children?.length) {
          //       return {
          //         ...x,
          //         children: filterNewMenuDataByAuthCodes(x.children, authCodeList),
          //       };
          //     }
          //     return x;
          //   });
          //   const filterMenuData = convertMenuData.filter((x: MenuDataItem) => {
          //     if (isEmpty(x)) {
          //       return false;
          //     }
          //     if (x.children?.length) {
          //       return true;
          //     }
          //     return authCodeList.includes(x.name || "");
          //   });
          //   return filterMenuData;
          // }
          newMenuData = filterNewMenuData(defaultMenuData);
          // const authCodeList = params.account?.authCodeList || [];
          // newMenuData = filterNewMenuDataByAuthCodes(newMenuData, authCodeList);

          logUtil.debug("menu.request-end", newMenuData);
          return newMenuData;
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      headerTitleRender(logo, title, props) {
        return (
          <CustomLayoutHeaderTitle>
            {logo}
            {title}
          </CustomLayoutHeaderTitle>
        );
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      headerContentRender(props, defaultDom) {
        // return <CustomLayoutHeaderContent />;
        return null;
      },
      rightContentRender(_layoutProps, _dom, { runtimeConfig, loading, setInitialState }) {
        return getRightRenderContent({
          runtimeConfig,
          loading,
          initialState: {
            name: authState.account?.realName,
            avatar: authState.account?.avatar || avatarIcon,
          },
          setInitialState,
        });
      },
      // selectLangProps: {
      //   icon: <SelectLangIcon />,
      //   postLocalesData: (defaultLangUConfig: any[]) => {
      //     return defaultLangUConfig.map((x) => ({ ...x, icon: "" }));
      //   },
      // },
      // avatarMenus: [
      //   {
      //     key: "logout",
      //     label: (
      //       <>
      //         <LogoutOutlined />
      //         {/* <FormattedMessage id='logout' /> */}
      //         <span>退出登录</span>
      //       </>
      //     ),
      //     onClick: () => myMsal.handleLogout(),
      //   },
      // ],
      logout: () => myMsal.handleLogout(),
      collapsed: false,
      collapsedButtonRender: false,
      breadcrumbRender: (route) => {
        return route?.map((x: any) => ({
          path: x.linkPath,
          title: x.title,
        }));
      },
    };
  },
  // patchRoutes({ routes, routeComponents }) {
  //   logUtil.debug("menu.patchRoutes", routes, routeComponents);
  // },
  // patchClientRoutes({ routes }) {
  //   logUtil.debug("menu.patchClientRoutes-start", routes, extraRoutes, authState.account);
  // },
  // render(oldRender) {
  //   fetch("/locales/zh_CN.json")
  //     .then((res) => res.json())
  //     .then((res) => {
  //       extraRoutes = res;
  //       logUtil.debug("menu.render-end", extraRoutes);
  //       oldRender();
  //     });
  // },
  request: requestConfig,
  rootContainer(container: React.ReactNode) {
    let newContainer = container;
    newContainer = React.createElement(App, null, newContainer);
    newContainer = React.createElement(LoginRedirect, null, newContainer);
    newContainer = React.createElement(ErrorBoundary, null, newContainer);
    newContainer = React.createElement(ThemeLocalProvider, null, newContainer);
    return newContainer;
  },
});
