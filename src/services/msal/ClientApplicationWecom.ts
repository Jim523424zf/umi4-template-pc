/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AccountInfo,
  AuthenticationResult,
  AuthorizationCodeRequest,
  BrowserConfiguration,
  ClearCacheRequest,
  Configuration,
  EndSessionPopupRequest,
  EndSessionRequest,
  EventCallbackFunction,
  INavigationClient,
  IPublicClientApplication,
  ITokenCache,
  Logger,
  PerformanceCallbackFunction,
  PopupRequest,
  RedirectRequest,
  SilentRequest,
  SsoSilentRequest,
  WrapperSKU,
} from "@azure/msal-browser";
import { decode as jwt_decode } from "jsonwebtoken";

const CODE_KEY = "wecom_code";
const ACCESS_TOKEN_KEY = "wecom_access_token";
const ACTIVE_ACCOUNT_KEY = "wecom_active_account";

export class ClientApplicationWecom implements IPublicClientApplication {
  configuration: Configuration | null = null;
  public constructor(configuration: Configuration) {
    this.configuration = configuration;
  }
  initialize(): Promise<void> {
    return Promise.resolve();
  }
  private getWeComCode(href = location.href, readonly = false) {
    const url = new URL(href ?? "");
    const code = url.searchParams.get("code");
    if (readonly) {
      return code || sessionStorage.getItem(CODE_KEY);
    }
    if (code) {
      sessionStorage.setItem(CODE_KEY, code ?? "");
      location.href = location.href.replace(location.search, "");
      return; // 第一次处理链接跳转 不反悔code，第二次访问直接从缓存拿
    }
    return sessionStorage.getItem(CODE_KEY);
  }
  private _accessToken: string | null = null;
  private get AccessToken() {
    return this._accessToken || sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }
  private set AccessToken(value: string | null) {
    this._accessToken = value;
    sessionStorage.setItem(ACCESS_TOKEN_KEY, value ?? "");
  }
  private genTokenResponse(token: string): AuthenticationResult {
    sessionStorage.removeItem(CODE_KEY);
    const decodedToken = jwt_decode(token); // 解码令牌
    return {
      accessToken: token,
      idToken: token,
      account: {
        name: decodedToken?.userName as string,
      } as AccountInfo,
    } as unknown as AuthenticationResult;
  }
  private async goToWeComAuthUri() {
    sessionStorage.removeItem(CODE_KEY);
    // await ESP.Authentication.postApiV1AuthenticationGetWeComLoginUrl({
    //   redirectUrl: this.configuration?.auth.redirectUri,
    // }).then((res) => {
    //   if (!res.data) {
    //     return;
    //   }
    //   window.location.replace(res.data);
    // });
  }
  async handleRedirectPromise(href = location.href): Promise<AuthenticationResult | null> {
    // https://espsitapp01.serviceme.cn/?code=exEb3YaBEwv2vXsPJMCHxoiA3qftyot41PTYiAcLLMk&state=
    const code = this.getWeComCode(href);
    if (!code) {
      return null;
    }
    const res = { data: "" };
    // const res = await ESP.Authentication.postApiV1AuthenticationWeComLogin({ code });
    // if (!res.data) {
    //   await this.goToWeComAuthUri();
    //   return null;
    // }
    this.AccessToken = res.data;
    return this.genTokenResponse(res.data);
  }
  clearCache(logoutRequest?: ClearCacheRequest | undefined): Promise<void> {
    sessionStorage.removeItem(CODE_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    return Promise.resolve();
  }
  async loginRedirect(request?: RedirectRequest | undefined): Promise<void> {
    const code = this.getWeComCode(location.href, true);
    if (code) {
      // 带code走解析逻辑
      return;
    }
    if (this.AccessToken) {
      // 登录过的也不用再跳转了
      return;
    }
    await this.goToWeComAuthUri();
  }
  async acquireTokenSilent(silentRequest: SilentRequest): Promise<AuthenticationResult> {
    const res = { data: "" };
    // const res = await ESP.Authentication.postApiSystemUserAuthenticationReflushToken();
    if (!res.data) {
      throw new Error("获取token失败");
    }
    this.AccessToken = res.data;
    return this.genTokenResponse(res.data);
  }
  setActiveAccount(account: AccountInfo | null): void {
    sessionStorage.setItem(ACTIVE_ACCOUNT_KEY, JSON.stringify(account));
  }
  getActiveAccount(): AccountInfo | null {
    const account = sessionStorage.getItem(ACTIVE_ACCOUNT_KEY);
    if (!account) {
      return null;
    }
    return JSON.parse(account);
  }
  getAllAccounts(): AccountInfo[] {
    if (!this.AccessToken) {
      return [];
    }
    return [this.genTokenResponse(this.AccessToken)];
  }
  async acquireTokenRedirect(request: RedirectRequest): Promise<void> {
    throw new Error("Method not implemented.");
  }
  acquireTokenPopup(request: PopupRequest): Promise<AuthenticationResult> {
    throw new Error("Method not implemented.");
  }
  acquireTokenByCode(request: AuthorizationCodeRequest): Promise<AuthenticationResult> {
    throw new Error("Method not implemented.");
  }
  addEventCallback(callback: EventCallbackFunction): string | null {
    throw new Error("Method not implemented.");
  }
  removeEventCallback(callbackId: string): void {
    throw new Error("Method not implemented.");
  }
  addPerformanceCallback(callback: PerformanceCallbackFunction): string {
    throw new Error("Method not implemented.");
  }
  removePerformanceCallback(callbackId: string): boolean {
    throw new Error("Method not implemented.");
  }
  enableAccountStorageEvents(): void {
    throw new Error("Method not implemented.");
  }
  disableAccountStorageEvents(): void {
    throw new Error("Method not implemented.");
  }
  getAccountByHomeId(homeAccountId: string): AccountInfo | null {
    throw new Error("Method not implemented.");
  }
  getAccountByLocalId(localId: string): AccountInfo | null {
    throw new Error("Method not implemented.");
  }
  getAccountByUsername(userName: string): AccountInfo | null {
    throw new Error("Method not implemented.");
  }
  loginPopup(request?: PopupRequest | undefined): Promise<AuthenticationResult> {
    throw new Error("Method not implemented.");
  }
  logout(logoutRequest?: EndSessionRequest | undefined): Promise<void> {
    throw new Error("Method not implemented.");
  }
  logoutRedirect(logoutRequest?: EndSessionRequest | undefined): Promise<void> {
    throw new Error("Method not implemented.");
  }
  logoutPopup(logoutRequest?: EndSessionPopupRequest | undefined): Promise<void> {
    throw new Error("Method not implemented.");
  }
  ssoSilent(request: SsoSilentRequest): Promise<AuthenticationResult> {
    throw new Error("Method not implemented.");
  }
  getTokenCache(): ITokenCache {
    throw new Error("Method not implemented.");
  }
  getLogger(): Logger {
    throw new Error("Method not implemented.");
  }
  setLogger(logger: Logger): void {
    throw new Error("Method not implemented.");
  }
  initializeWrapperLibrary(sku: WrapperSKU, version: string): void {
    throw new Error("Method not implemented.");
  }
  setNavigationClient(navigationClient: INavigationClient): void {
    throw new Error("Method not implemented.");
  }
  getConfiguration(): BrowserConfiguration {
    throw new Error("Method not implemented.");
  }
  hydrateCache(
    result: AuthenticationResult,
    request: RedirectRequest | SilentRequest | PopupRequest | SsoSilentRequest,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
