import { proxy, subscribe } from "@umijs/max";
import { getLocalState, setLocalState } from "./storage";

type ProxyWithPersistantOption = {
  type: "localStorage" | "sessionStorage";
  key: string;
};
export const proxyWithPersistant = <T>(defaultState: T, option: ProxyWithPersistantOption): T => {
  const storage = option.type === "localStorage" ? localStorage : sessionStorage;
  const state = proxy({
    ...defaultState,
    ...getLocalState(option.key, storage),
  });
  // 更新的时候，订阅更新一下本地存储
  subscribe(state, () => setLocalState(option.key, state, storage));
  return state;
};
