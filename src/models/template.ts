import { proxy, useSnapshot } from "@umijs/max";

const initialState = {};

export const templateState = proxy(initialState);
/**
 * hook写在此处方便调用
 * 需要触发render的组件/页面调用，否则直接用上方的state即可
 */
export const useTemplateState = () => useSnapshot(templateState);

const actions = {};
export const templateActions = actions;
