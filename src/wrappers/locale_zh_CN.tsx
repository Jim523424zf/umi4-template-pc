import { ProProvider, zhCNIntl } from "@ant-design/pro-components";
import { Outlet, RawIntlProvider, getIntl } from "@umijs/max";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import { useState } from "react";

export default () => {
  const [locale] = useState({ ...zhCN });
  const [intl] = useState(() => getIntl("zh_CN", true));
  const [proLocale] = useState({ ...zhCNIntl });
  return (
    <ConfigProvider locale={locale}>
      <RawIntlProvider value={intl}>
        <ProProvider.Provider value={{ intl: proLocale }}>
          <Outlet />
        </ProProvider.Provider>
      </RawIntlProvider>
    </ConfigProvider>
  );
};
