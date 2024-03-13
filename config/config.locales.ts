import { defineConfig } from "@umijs/max";

/**
 * 国际化配置
 */
export default defineConfig({
  plugins: ["@medalsoft/umi-plugins/dist/locale"],
  // locale: {},
  // medalsoftLocale: {
  //   // 默认使用 src/locales/en_US.ts 作为多语言文件
  //   default: "en_US",
  //   baseSeparator: "_",
  //   reload: false,
  // },
});
