import {
  AccountInfo,
  AuthenticationResult,
  BrowserAuthOptions,
  BrowserCacheLocation,
  IPublicClientApplication,
  InteractionStatus,
  PublicClientApplication,
} from "@azure/msal-browser";
import { history } from "@umijs/max";
// import { lang } from "./lang";
import { authActions } from "@/models/auth/action";
import { BrowserType, getCurrentBrowserType, isMobile } from "@/utils/environment";
import { logUtil } from "@/utils/logUtil";
import { memoizePromise } from "@/utils/promise";
import { deleteCookie } from "@/utils/storage";
import { getHostUri, waitUntil } from "@/utils/tools";
import { decode as jwt_decode } from "jsonwebtoken";
import { isString } from "lodash-es";
import { ClientApplicationTeams } from "./ClientApplicationTeams";
import { ClientApplicationWecom } from "./ClientApplicationWecom";

export type MsalLoginType = "redirect" | "popup";

const isB2CAccount = (account: AccountInfo | null): boolean =>
  account?.environment && account.environment?.includes("b2c") ? true : false;
const isAADAccount = (account: AccountInfo | null): boolean =>
  account?.environment && !account?.environment?.includes("b2c") ? true : false;

type MyMsalOptions = {
  config?: {
    auth: {
      aad: BrowserAuthOptions;
      b2c?: BrowserAuthOptions;
      wecom?: BrowserAuthOptions;
    };
  };
  hooks?: {
    setLoginType(loginType: string): void;
  };
};
class MyMsal {
  options: MyMsalOptions = {};
  instance?: IPublicClientApplication;
  instanceInitialized = false;
  // instanceMessageListenerId?: string | null;
  inProgress = InteractionStatus.Startup;
  account: AccountInfo | null = null;
  get accessToken() {
    return sessionStorage.getItem("access_token") ?? localStorage.getItem("access_token") ?? "";
  }
  set accessToken(token: string | null) {
    sessionStorage.setItem("access_token", token ?? "");
  }

  constructor(options: MyMsalOptions) {
    this.options = options;
    if (!this.isLoginTypeValid(location.href)) {
      return;
    }
    this.visitUrl = location.href;
    // 针对页面刷新的情况 存储一下 当前链接，防止跳转出错
    window.addEventListener("beforeunload", () => {
      logUtil.debug("MyMsal:beforeunload", location.href);
      this.visitUrl = location.href;
    });
    // 第一次token刷新结束前，并发的会等待并获取第一次的结果
    this.refreshAccessToken = memoizePromise(this.refreshAccessToken.bind(this));
    // 页面打开的时候尝试构造一次
    this.createInstance();
  }

  /**
   * 针对AAD卡住的情况，手动跳转登录页面
   * @param url
   * @returns
   */
  private isLoginTypeValid(url: string) {
    if (!this.loginType && ["#code="].some((x) => url?.indexOf(x) > -1)) {
      this.goToLoginPage();
      return false;
    }
    return true;
  }

  private get visitUrl() {
    return sessionStorage.getItem("visit_url") ?? "";
  }
  private set visitUrl(url: string) {
    logUtil?.debug("visitUrl:set", url);
    // 跳过一些特殊的地址
    if (
      [
        // 跳过Azure msal 回调地址及其他异常地址
        "#code=",
        "#state=",
        "#error=",
        // 跳过微信回调地址
        "?code=",
        // 跳过登录
        "/login",
        // 跳过异常页面
        "#/403",
        "#/404",
        "#/500",
      ].some((x) => url?.indexOf(x) > -1)
    ) {
      return;
    }
    // 跳过首页
    if (location.pathname === "/" && (!location.hash || location.hash === "#" || location.hash === "#/")) {
      return;
    }
    sessionStorage.setItem("visit_url", url);
  }

  get loginType() {
    // 由于teams直接获取token的，没走登录流程，所以需要特殊处理
    if (this.isTeams) {
      return "teams";
    }
    return (sessionStorage.getItem("login_type") || localStorage.getItem("login_type") || "").toLowerCase();
  }
  /** 设置登录类型 */
  set loginType(type: string) {
    const _loginType = type.toLowerCase();
    this.options.hooks?.setLoginType(_loginType);
    if (this.loginType === _loginType) {
      return;
    }
    localStorage.setItem("login_type", _loginType);
    // 设置登录类型的时候，尝试重新构造
    this.createInstance();
  }

  get isAAD() {
    return this.loginType === "aad";
  }
  get isB2C() {
    return this.loginType === "b2c";
  }
  get isWeCom() {
    return this.loginType === "wecom";
  }
  get isTeams() {
    return getCurrentBrowserType() === BrowserType.TEAMS;
  }
  get isFramed() {
    return window.self !== window.top;
  }

  // get ui_locales() {
  //   const b2cLangMapping = {
  //     zh_CN: "zh-hans",
  //     en_US: "en",
  //     th_TH: "th",
  //     ja_JP: "ja",
  //     ko_KR: "ko",
  //     zh_TW: "zh-hant",
  //   };
  //   return b2cLangMapping[lang.getLocale() as keyof typeof b2cLangMapping] ?? "zh-hans";
  // }

  get loginScopes() {
    return (this.isAAD ? process.env.AADScope?.split(" ") : [""]) as Array<string>;
  }
  get loginRequest() {
    return {
      scopes: this.loginScopes,
      // extraQueryParameters: {
      //   ui_locales: this.ui_locales,
      // },
    };
  }

  get authConfig() {
    if (this.isTeams) {
      return this.options.config?.auth.aad;
    }
    if (this.isAAD) {
      return this.options.config?.auth.aad;
    }
    if (this.isB2C) {
      return this.options.config?.auth.b2c;
    }
    if (this.isWeCom) {
      return this.options.config?.auth.wecom;
    }
    return null;
  }

  get msalLoginType(): MsalLoginType {
    // if (this.isFramed) {
    //   return "popup";
    // }
    return "redirect";
  }

  /**
   * 匹配第一个跟登录类型相符的账号
   */
  private get currentAccount() {
    const activeAccount = this.instance?.getActiveAccount();
    logUtil.debug("get currentAccount activeAccount", activeAccount);
    if (activeAccount) {
      return this.syncAccount(activeAccount);
    }
    const accounts = this.instance?.getAllAccounts() ?? [];
    const matchAccounts = accounts.filter(
      (account) => (this.isAAD && isAADAccount(account)) || (this.isB2C && isB2CAccount(account)),
    );
    logUtil.debug("get currentAccount matchAccounts", matchAccounts);
    // 没有账号或者有超过一个账号的 返回null
    if (matchAccounts.length !== 1) {
      return this.syncAccount(null);
    }
    return this.syncAccount(matchAccounts[0]);
  }

  private set currentAccount(account: AccountInfo | null) {
    if (!this.instance) {
      return;
    }
    this.account = account;
    this.instance.setActiveAccount(account);
    logUtil.debug("set currentAccount activeAccount", account);
  }

  /**
   * 同步 account 信息，account作为缓存，减少频繁读取currentAccount 影响性能
   */
  private syncAccount(account: AccountInfo | null) {
    if (this.account !== account) {
      this.account = account;
    }
    return this.account;
  }

  /**
   * 手动登录
   */
  async handleLogin(loginType: string) {
    if (!loginType) {
      throw new Error("loginType is required");
    }
    this.loginType = loginType;
    if (!this.instance) {
      throw new Error("login instance is null");
    }
    await waitUntil(() => this.instanceInitialized, 3000);
    if (this.msalLoginType === "redirect") {
      deleteCookie("msal.interaction.status"); // 解决AAD登录中 无法继续登录的问题
      await this.instance.loginRedirect(this.loginRequest).catch((error) => {
        logUtil.warn("handleLogin loginRedirect Error:" + error.message);
        throw error;
      });
      return;
    }
    if (this.msalLoginType === "popup") {
      await this.instance.loginPopup(this.loginRequest).then((response) => {
        if (response) {
          // 登录回跳走这里
          this.accessToken = this.convertLoginToken(response);
          this.currentAccount = response.account;
        }
      });
    }
  }
  async createInstance() {
    this.instance = undefined;
    this.instanceInitialized = false;
    const auth = this.authConfig;

    if (!auth) {
      return;
    }
    if (this.isWeCom) {
      this.instance = new ClientApplicationWecom({
        auth,
      });
    } else if (this.isTeams) {
      this.instance = new ClientApplicationTeams({
        auth,
      });
    } else {
      this.instance = new PublicClientApplication({
        cache: {
          cacheLocation: BrowserCacheLocation.SessionStorage,
          storeAuthStateInCookie: true,
        },
        auth,
      });
    }
    this.instance.initialize().then(() => {
      this.instanceInitialized = true;
    });
  }

  /**
   * 处理登录重定向
   * 不会抛异常出来
   */
  async handleRedirect() {
    if (!this.instance) {
      return; // 没有实例，直接返回
    }

    if (this.isAAD || this.isB2C) {
      // await waitUntil(() => this.instanceInitialized, 3000);
    }
    try {
      logUtil.debug("handleRedirect start");
      const response = await this.instance
        .handleRedirectPromise(this.isWeCom ? location.href : location.hash)
        .catch((error) => {
          logUtil.error("handleRedirect handleRedirectPromise", error);
          if (error.message?.indexOf("invalid_request") > -1) {
            throw error;
          }
          // this.handleLogout();
        });
      logUtil.debug("handleRedirect end", response);
      if (response) {
        // 登录回跳走这里
        this.accessToken = this.convertLoginToken(response);
        this.currentAccount = response.account;
      } else {
        // 可能是刷新页面操作，需要同步一下account
        // currentAccount读取时 内会同步到 account
        if (!this.account && this.currentAccount) {
          logUtil.debug("handleRedirect currentAccount sync", this.account);
        }
      }
    } catch (error: any) {
      // 跳转报错时 清理登录信息
      logUtil.error("handleRedirect", error);
      if (error.message?.indexOf("invalid_request") > -1) {
        // AAD 配置问题导致的无法登录就中断登录流程
        this.goTo500();
        throw error;
      }
      this.handleLoginClean();
      this.goToLoginPage();
    }
  }
  /**
   * 刷新token
   */
  async refreshAccessToken(props?: { force?: boolean; account?: AccountInfo | null; shipGoToLoginPage?: boolean }) {
    if (!this.instance) {
      return;
    }
    const account = props?.account || this.currentAccount;
    // logUtil.debug("refreshAccessToken account", account);
    if (!account) {
      return;
    }
    if (!props?.force && this.isLoginTokenNotExpired) {
      return this.accessToken;
    }
    // 获取访问令牌
    const accessTokenRequest = {
      scopes: this.loginScopes,
      account,
    };
    // 有了用户信息可以获取token
    try {
      logUtil.debug("refreshAccessToken start", this.accessToken);
      const accessTokenResponse = await this.instance.acquireTokenSilent(accessTokenRequest);
      this.accessToken = this.convertLoginToken(accessTokenResponse);
      logUtil.debug("refreshAccessToken end", this.accessToken);
      return this.accessToken;
    } catch (error) {
      logUtil.error("refreshAccessToken", error);
      //   this.instance["browserStorage"].clear();
      this.handleLoginClean();
      if (!props?.shipGoToLoginPage) {
        this.goToLoginPage();
      }
    }
  }
  private convertLoginToken(response: AuthenticationResult) {
    if (response.accessToken === null || response.accessToken === "") {
      return response.idToken;
    } else {
      return response.accessToken;
    }
  }
  /**
   * 验证jwtToken未过期
   */
  private get isLoginTokenNotExpired() {
    if (!this.accessToken) {
      return false;
    }
    try {
      const decodedToken = jwt_decode(this.accessToken); // 解码令牌
      if (!decodedToken || isString(decodedToken)) {
        return false;
      }
      const tokenExp = decodedToken?.exp ?? 0; // 令牌的过期时间（exp）
      const currentTime = Math.floor(Date.now() / 1000); // 将当前时间转换为秒
      return currentTime < tokenExp;
    } catch (error) {
      return false;
    }
  }

  /**
   * 跳转登录页
   */
  goToLoginPage(replace = false) {
    logUtil?.trace("goToLoginPage");
    if (replace) {
      history.replace("/login");
      return;
    }
    history.push("/login");
  }
  /**
   * 登录成功后的跳转地址
   */
  goToVisitPage() {
    const needGotoH5 = !!process.env.LoginRedirectH5 && isMobile();

    if (this.visitUrl) {
      let visitUrl = this.visitUrl;
      this.visitUrl = "";
      if (needGotoH5) {
        // 需要将链接的域名后面添加h5
        const url = new URL(visitUrl);
        const search = url.search;
        const hash = url.hash;
        const pathname = url.pathname;
        const hostname = url.hostname;
        const protocol = url.protocol;
        const visitUrlH5 = `${protocol}//${hostname}/h5${pathname.replace("/h5", "")}${search}${hash}`;
        visitUrl = visitUrlH5;
      }
      if (visitUrl !== window.location.href) {
        try {
          window.location.replace(visitUrl);
        } catch (error) {
          // app内核不兼容的场景
          window.location = visitUrl;
        }
      }
      return;
    }
    if ((this.isAAD || isAADAccount(this.account)) && process.env.AADHomePagePath) {
      if (needGotoH5) {
        location.href = `${location.protocol}//${location.host}/h5/`;
      }
      history.push(process.env.AADHomePagePath as string);
      return;
    }
    if (this.isTeams) {
      if (needGotoH5) {
        location.href = `${location.protocol}//${location.host}/h5/`;
      }
      history.push(process.env.AADHomePagePath as string);
      return;
    }
    if (this.isB2C && process.env.B2CHomePagePath) {
      if (needGotoH5) {
        location.href = `${location.protocol}//${location.host}/h5/`;
      }
      history.push(process.env.B2CHomePagePath);
      return;
    }
    if (this.isWeCom) {
      if (needGotoH5) {
        location.href = `${location.protocol}//${location.host}/h5/`;
      }
      history.push(process.env.WeComHomePagePath as string);
      return;
    }
    this.goTo404();
  }
  /**
   * 跳转404
   */
  goTo404() {
    history.push("/404");
  }
  /**
   * 跳转500
   */
  goTo500() {
    history.push("/500");
  }

  /**
   * 退出
   */
  async handleLogout() {
    this.currentAccount = null;
    this.accessToken = "";
    if (this.msalLoginType === "redirect") {
      await this.instance?.logoutRedirect();
    }
    if (this.msalLoginType === "popup") {
      await this.instance?.logoutPopup();
    }
    this.loginType = "";
  }

  /**
   * 清理登录信息
   */
  async handleLoginClean() {
    await this.instance?.clearCache();
  }
}

export const myMsal = new MyMsal({
  config: {
    auth: {
      aad: {
        clientId: process.env.AADClientId,
        tenantId: process.env.AADTenantId,
        authority: "https://login.microsoftonline.com/" + process.env.AADTenantId,
        redirectUri: getHostUri(process.env.AADRedirectUrl),
      } as BrowserAuthOptions,
      b2c: {
        clientId: process.env.B2CClientId,
        authority: process.env.B2CAuthority,
        loginType: "redirect",
        knownAuthorities: [process.env.B2CHost],
        redirectUri: getHostUri(process.env.B2CRedirectUrl),
      } as BrowserAuthOptions,
      wecom: {
        clientId: "",
        loginType: "redirect",
        redirectUri: getHostUri(process.env.WeComRedirectUrl),
      } as BrowserAuthOptions,
    },
  },
  hooks: {
    setLoginType(loginType: string) {
      return authActions.setLoginType(loginType);
    },
  },
});
