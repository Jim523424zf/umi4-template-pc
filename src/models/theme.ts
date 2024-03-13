import { proxy, useSnapshot } from "@umijs/max";

const initialState = { colorPrimary: "yellow" };

export const themeState = proxy(initialState);
export const useThemeState = () => useSnapshot(themeState);

const actions = {
  setColorPrimary(prop: string) {
    themeState.colorPrimary = prop;
  },
};
export const themeActions = actions;
