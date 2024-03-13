import { myMsal } from "@/services/msal";
import { logUtil } from "@/utils/logUtil";
import { authState } from "./state";

const actions = {
  setLoginError(isError: boolean) {
    authState.loginError = isError;
  },
  setLoginType(loginType: string) {
    authState.login.loginType = loginType?.toLowerCase() ?? "";
    authState.login.isAAD = myMsal.isAAD;
    authState.login.isB2C = myMsal.isB2C;
  },
  setAccount(payload: MyAccountInfo | null) {
    authState.account = payload;
    this.loadAccess();
  },
  async queryAccount() {
    // TODO: 从服务拿取用户信息和权限
    const res = {
      data: {
        realName: myMsal.account?.name,
        authList: [],
      },
    };
    logUtil.debug("loginRedirect queryAccount", myMsal.account);
    const authList = res.data?.authList || [];
    const authCodeList = authList.map((x: { authCode: string }) => x.authCode);
    actions.setAccount({
      ...res.data,
      authCodeList,
      name: res.data.realName,
    });
  },
  loadAccess() {
    const access: Record<string, boolean> = {};
    if (!authState.account) return;
    access.canReadByLogin = true;
    authState.account.authCodeList?.forEach((code) => {
      access[code] = true;
    });
    authState.access = access;
  },
  logout() {
    authState.account = null;
  },
  goHome() {
    if (authState.account) {
      myMsal.goToVisitPage();
    } else {
      myMsal.goToLoginPage();
    }
  },
};

export const authActions = actions;
