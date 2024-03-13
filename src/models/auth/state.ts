import { proxy, useSnapshot } from "@umijs/max";

const initialState = {
  login: {
    loginType: "",
    isAAD: false,
    isB2C: false,
    account: "",
    password: "",
  } as LoginInfo,
  loginError: false,
  account: null as MyAccountInfo | null,
  access: {} as Record<string, boolean>,
};

export const authState = proxy(initialState);
export const useAuthState = () => useSnapshot(authState);
