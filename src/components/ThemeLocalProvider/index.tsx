/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThemeConfig, theme } from "antd";
import { ThemeProvider, createStyles } from "antd-style";
import { MapToken } from "antd/es/theme/interface";
import { SeedToken } from "antd/es/theme/internal";
import { ReactNode, createContext, useState } from "react";

interface ThemeType {
  children: ReactNode;
}

export const context = createContext({});

/**
 * 定义样式，可单独创建一个文件进行编写
 */
const useStyles = createStyles(({ token, css }) => {
  const themeToken = css({});

  return {
    themeToken: css({
      colorPrimary: "yellowgreen",
    }),
  };
});

/**
 * 自定义主题算法
 */
const customDarkAlgorithm = (seedToken: SeedToken, mapToken: MapToken | undefined) => {
  //   const mergeToken = theme.darkAlgorithm(seedToken, mapToken);
  const mergeToken = theme.defaultAlgorithm(seedToken);

  return {
    ...mergeToken,
    // Layout 颜色
    // colorBgLayout: "#20252b",
    // 容器颜色
    // colorBgContainer: "#282c34",
    // 悬浮类面板颜色
    // colorBgElevated: "#32363e",
    colorPrimary: "#2a82e4",
  };
};

const darkThemeConfig: ThemeConfig = {
  token: { colorPrimary: "#2a82e4" },
  // algorithm: [customDarkAlgorithm, theme.compactAlgorithm],
  algorithm: [customDarkAlgorithm],
  cssVar: true,
  hashed: false,
};

const Page: React.FC<ThemeType> = ({ children }) => {
  const { styles } = useStyles();

  /**
   * ThemeProvider 的 props
   */
  const [providerConfig, setProviderConfig] = useState({ count: 0, appearance: "light" });

  /**
   * 切换自带主题：dark / light
   */
  const toSwitchTheme = () => {
    providerConfig.count++;
    if (providerConfig.count % 2 !== 0) {
      setProviderConfig((v) => ({ ...v, appearance: "dark" }));
    } else {
      setProviderConfig((v) => ({ ...v, appearance: "light" }));
    }
  };

  return (
    <context.Provider value={{ toSwitchTheme }}>
      <ThemeProvider
        appearance={providerConfig.appearance}
        theme={(appearance) => (appearance === "light" ? darkThemeConfig : { cssVar: true, hashed: false })}
        customToken={{ customToken: "yellowgreen" }}
      >
        {children}
      </ThemeProvider>
    </context.Provider>
  );
};

export default Page;
