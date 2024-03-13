import { ParamsType, ProTable, ProTableProps } from "@ant-design/pro-components";
import classnames from "classnames";
import { ReactNode } from "react";
import "./index.less";

export const CustomProTable = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = "text",
>(
  props: ProTableProps<DataType, Params, ValueType>,
): ReactNode => {
  const { className, ...restProps } = props;
  return <ProTable className={classnames("custom-pro-table hairlines", className)} {...restProps} />;
};
