/* eslint-disable @typescript-eslint/no-unused-vars */
import { logUtil } from "@/utils/logUtil";
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
import * as microsoftTeams from "@microsoft/teams-js";
import { decode as jwt_decode } from "jsonwebtoken";

const ACCESS_TOKEN_KEY = "teams_access_token";
const ACTIVE_ACCOUNT_KEY = "teams_active_account";

export class ClientApplicationTeams implements IPublicClientApplication {
  configuration: Configuration | null = null;
  public constructor(configuration: Configuration) {
    this.configuration = configuration;
  }
  initialize(): Promise<void> {
    return Promise.resolve();
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
    const decodedToken = jwt_decode(token); // 解码令牌
    return {
      accessToken: token,
      idToken: token,
      account: {
        name: decodedToken?.name as string,
      } as AccountInfo,
    } as unknown as AuthenticationResult;
  }
  private async getTeamsToken() {
    logUtil.info("microsoftTeams start");
    await microsoftTeams.app.initialize().catch((err) => {
      logUtil.error("microsoftTeams initialize error", err);
    });
    logUtil.info("microsoftTeams getAuthToken start");
    const token = await microsoftTeams.authentication.getAuthToken().catch((err) => {
      logUtil.error("microsoftTeams getAuthToken error", err);
      throw err;
    });
    // const context = await microsoftTeams.app.getContext();
    // logUtil.info("Teams ", context);
    return token;
  }
  async handleRedirectPromise(href = location.href): Promise<AuthenticationResult | null> {
    const token = await this.getTeamsToken();
    this.AccessToken = token;
    return this.genTokenResponse(token);
  }
  clearCache(logoutRequest?: ClearCacheRequest | undefined): Promise<void> {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    return Promise.resolve();
  }
  async loginRedirect(request?: RedirectRequest | undefined): Promise<void> {
    return Promise.resolve();
  }
  async acquireTokenSilent(silentRequest: SilentRequest): Promise<AuthenticationResult> {
    const token = await this.getTeamsToken();
    this.AccessToken = token;
    return this.genTokenResponse(token);
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
