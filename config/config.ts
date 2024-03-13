import { defineConfig } from "@umijs/max";
import compileConfig from "./config.compile";
import localesConfig from "./config.locales";
import routesConfig from "./config.routes";
import serviceConfig from "./config.service";
import styleConfig from "./config.style";

function mergeConfig(...configs: any[]) {
  return defineConfig(
    configs.reduce(
      (targetConfig, config) => ({
        ...targetConfig,
        ...config,
        plugins: [].concat(...(targetConfig.plugins ?? []), ...(config.plugins ?? [])),
      }),
      {},
    ),
  );
}

export default mergeConfig(
  defineConfig({
    plugins: ["@medalsoft/umi-plugins/dist/layout"],
    antd: {},
    moment2dayjs: {
      preset: "antd",
      plugins: ["duration"],
    },
    request: {},
    valtio: {},
    layout: {},
    medalsoftLayout: {},
  }),
  compileConfig,
  localesConfig,
  routesConfig,
  serviceConfig,
  styleConfig,
);
