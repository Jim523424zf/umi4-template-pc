// import { lang } from "@/utils/lang";
import { authActions } from "@/models/auth/action";
import { myMsal } from "@/services/msal";
import { BrowserType, getCurrentBrowserType } from "@/utils/environment";
import { logUtil } from "@/utils/logUtil";
import { Spin } from "antd";
import { FC, ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};
/**
 * 处理登录回跳
 */
export const LoginRedirect: FC<Props> = (props) => {
  const [logging, setLogging] = useState(true);
  useEffect(() => {
    // lang.fixLocale();
    if (getCurrentBrowserType() === BrowserType.TEAMS) {
      myMsal.loginType = "teams";
    }
    if (myMsal.loginType) {
      authActions.setLoginType(myMsal.loginType);
    }
    tryHandleLoginRedirect();
  }, []);
  const tryHandleLoginRedirect = async () => {
    authActions.setLoginError(false);
    authActions.setAccount(null);
    myMsal.handleRedirect().then(async () => {
      try {
        // 未登录 或 非AAD、B2C登录
        // if (!myMsal.account) {
        //   setLogging(false);
        //   logUtil.debug("loginRedirect", "未登录");
        // }
        await myMsal.refreshAccessToken({ shipGoToLoginPage: !myMsal.account }).catch(() => {
          logUtil.debug("loginRedirect", "refreshAccessToken error");
          throw new Error("refreshAccessToken error");
        });
        logUtil.debug("loginRedirect", "refreshAccessToken", myMsal.accessToken);
        // 刷新完 不报异常 也没token 就不执行后面的了
        if (!myMsal.accessToken) {
          return;
        }
        await authActions.queryAccount();
        logUtil.debug("loginRedirect", "loginRedirect success");
        myMsal.goToVisitPage();
      } catch (error) {
        logUtil.error(error);
        // 因为这边路由还未加载，需要设置异常，在layout里 判断异常 跳转登录，其他非layout页面 在调接口时 会跳转
        authActions.setLoginError(true);
      } finally {
        setLogging(false);
      }
    });
  };
  return logging ? (
    <div className='loading-page-container'>
      <Spin />
    </div>
  ) : (
    props.children
  );
};
