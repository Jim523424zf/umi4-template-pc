/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomProTable } from "@/components/CustomProTable";
import { PageContainer } from "@ant-design/pro-components";
import { FC, Fragment } from "react";
import { useTable } from "./useTable";

const Page: FC = () => {
  const { ...basicListTableProps } = useTable();

  const pageProps = {
    title: " ",
    ghost: true,
    token: {
      paddingBlockPageContainerContent: 20,
      paddingInlinePageContainerContent: 20,
    },
  };

  return (
    <Fragment>
      <PageContainer {...pageProps}>
        <CustomProTable {...basicListTableProps} />
      </PageContainer>
    </Fragment>
  );
};

export default Page;
