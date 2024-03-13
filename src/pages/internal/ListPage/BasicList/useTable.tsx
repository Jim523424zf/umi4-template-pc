/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactComponent as DeleteSvg } from "@/assets/images/delete.svg";
import view from "@/assets/images/view.png";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { message } from "antd";
import { useRef } from "react";

type BasicListTableItem = {
  id?: number | undefined;
  title: string;
  state: string;
  approver: string;
  process: number;
  processName?: string;
  description?: string;
  createdAt?: string;
};

export const useTable = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<BasicListTableItem>[] = [
    {
      title: "单号",
      dataIndex: "title",
      //   fixed: "left",
      formItemProps: {
        rules: [],
      },
    },
    {
      title: "状态",
      dataIndex: "state",
    },
    {
      title: "审批人",
      dataIndex: "approver",
    },
    {
      title: "流程",
      dataIndex: "process",
      render: (a) => (
        <a
          key='view'
          onClick={() => {
            // action?.startEditable?.(record.id);
            message.warning("敬请期待");
          }}
        >
          <img width={20} src={view} alt='1' />
        </a>
      ),
    },
    {
      title: "流程名称",
      dataIndex: "processName",
    },
    {
      title: "描述",
      dataIndex: "description",
      hideInSearch: true,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      valueType: "dateRange",
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: "操作",
      valueType: "option",
      fixed: "right",
      key: "option",
      render: (text, record, _, action) => [
        <a
          key='editable'
          onClick={() => {
            // action?.startEditable?.(record.id);
            message.warning("敬请期待");
          }}
        >
          <img width={20} src={DeleteSvg} alt='1' />
        </a>,
      ],
    },
  ];

  // 数据源 (用属性 request 来替换数据源)
  const dataSource = [
    { title: "微钉科技", state: "Success", approver: "1", process: 1, createdAt: "1999-2023" },
    { title: "微钉科技", state: "Success", approver: "1", process: 1, createdAt: "1999-2023" },
    { title: "微钉科技", state: "Success", approver: "1", process: 1, createdAt: "1999-2023" },
    { title: "微钉科技", state: "Success", approver: "1", process: 1, createdAt: "1999-2023" },
    { title: "微钉科技", state: "Success", approver: "2", process: 1, createdAt: "1999-2023" },
  ];

  // 搜索配置
  const search = {
    // span 会造成样式固化
    // span: 8,
    labelWidth: 100,
    searchText: "Search",
    resetText: "Clear",
    collapsed: false,
    collapseRender: false,
    optionRender: (searchConfig: any, formProps: any, dom: any) => [...dom.reverse()],
  };

  // 分页配置
  const pagination = {
    pageSize: 10,
  };

  // 滚动配置
  const scroll = {
    x: "1200px",
  };

  return {
    columns,
    rowKey: "id",
    headerTitle: false,
    actionRef,
    options: false,
    dataSource,
    request: false,
    search,
    pagination,
    scroll,
    toolBarRender: () => [],
  };
};
