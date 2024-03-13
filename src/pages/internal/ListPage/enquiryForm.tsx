/* eslint-disable @typescript-eslint/no-unused-vars */
import { context } from "@/components/ThemeLocalProvider";
import { themeActions } from "@/models/theme";
import { PageContainer } from "@ant-design/pro-components";
import { App, Button, ColorPicker, Divider } from "antd";
import { createStyles } from "antd-style";
import { useContext, useEffect, useMemo, useState } from "react";

const useStyles = createStyles(({ token, css }) => {
  const container = css`
    min-height: 100vh;
    background: #f5f7fa;
    display: flex;
    flex-direction: column;
    gap: 24;
    padding: 24;
  `;
  const loadingCom = css`
    color: red;
    padding: 30px;
    text-align: center;
  `;
  return { container, loadingCom };
});

const Page: React.FC = () => {
  const { styles } = useStyles();

  const { message } = App.useApp();

  const customLoadingDom = useMemo(() => <div className={styles.loadingCom}>自定义加载...</div>, []);
  const [customLoading, setCustomLoading] = useState<React.ReactNode | boolean>(customLoadingDom);

  useEffect(() => {
    setTimeout(() => {
      setCustomLoading(false);
    }, 1500);
  }, []);

  const { colorPrimary, onChangeTheme, toSwitchTheme } = useContext<any>(context);

  return (
    <div>
      <PageContainer
        // content='欢迎使用 ProLayout 组件'
        loading={customLoading}
        ghost
        onTabChange={() => {
          message.warning("敬请期待~.~");
        }}
        tabList={[
          {
            tab: "基本信息",
            key: "base",
            children: <p>基本信息</p>,
          },
          {
            tab: "详细信息",
            key: "info",
            children: <p>详细信息</p>,
          },
          {
            tab: "额外配置",
            key: "extra",
            children: <p>额外配置</p>,
            forceRender: true,
            disabled: true,
          },
        ]}
        extra={[
          <Button key='1' type='primary' onClick={() => message.warning("敬请期待~.~")}>
            主操作
          </Button>,
        ]}
        footer={[
          <Button key='rest' onClick={() => message.warning("敬请期待~.~")}>
            重置
          </Button>,
          <Button key='submit' type='primary' onClick={() => message.warning("敬请期待~.~")}>
            提交
          </Button>,
        ]}
      >
        <div>
          <ColorPicker
            showText
            value={colorPrimary}
            onChangeComplete={(color) => {
              themeActions.setColorPrimary(color.toHexString());
            }}
          />
          {/* <Button onClick={() => toSwitchTheme()}>toSwitchTheme</Button> */}
          <Divider />
          加载中这里不显示
        </div>
      </PageContainer>
    </div>
  );
};

export default Page;
