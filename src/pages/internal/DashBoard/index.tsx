import { logUtil } from "@/utils/logUtil";
import {
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { Row } from "antd";
import { useRef } from "react";

export default () => {
  const formRef = useRef<ProFormInstance>();
  return (
    <>
      <ProForm
        grid
        formRef={formRef}
        onFinish={async (val) => {
          logUtil.warn(val);
        }}
        // rowProps={{
        //   gutter: [16, 16],
        // }}
      >
        <ProForm.Group>
          <ProCard title='Card Name 1'>
            <Row gutter={16}>
              <ProFormText
                width='md'
                name='name'
                label='名称'
                colProps={{
                  span: 8,
                }}
                placeholder='please enter'
              />
              <ProFormSelect
                width='md'
                label='职位'
                name='level'
                colProps={{
                  span: 8,
                }}
                placeholder='please enter'
                valueEnum={{
                  1: "front end",
                  2: "back end",
                  3: "full stack",
                }}
              />
              <ProFormDateRangePicker
                width='md'
                label='工作周期'
                name='dateRange'
                colProps={{
                  span: 8,
                }}
              />
            </Row>
            <Row gutter={16}>
              <ProFormDatePicker
                width='md'
                label='入职日期'
                name='date'
                colProps={{
                  span: 8,
                }}
              />
              <ProFormText colProps={{ span: 16 }} name='description' label='描述' placeholder='please enter' />
            </Row>
            <ProFormText name='other' label='其他' placeholder='please enter' />
          </ProCard>
        </ProForm.Group>
        <ProForm.Group>
          <ProCard title='Card Name 2' style={{ marginBlockStart: 25 }}>
            <Row gutter={16}>
              <ProFormText
                width='md'
                name='name2'
                label='名称'
                colProps={{
                  span: 8,
                }}
                placeholder='please enter'
              />

              <ProFormSelect
                width='md'
                label='职位'
                name='level2'
                colProps={{
                  span: 8,
                }}
                placeholder='please enter'
                valueEnum={{
                  1: "front end",
                  2: "back end",
                  3: "full stack",
                }}
              />
              <ProFormDateRangePicker
                width='md'
                label='工作周期'
                name='dateRange2'
                colProps={{
                  span: 8,
                }}
              />
            </Row>
            <Row gutter={16}>
              <ProFormDatePicker
                width='md'
                label='入职日期'
                name='date2'
                colProps={{
                  span: 8,
                }}
              />
              <ProFormText
                name='description2'
                label='描述'
                placeholder='please enter'
                colProps={{
                  span: 16,
                }}
              />
            </Row>
            <ProFormText name='other2' label='其他' placeholder='please enter' />
          </ProCard>
        </ProForm.Group>
      </ProForm>
    </>
  );
};
