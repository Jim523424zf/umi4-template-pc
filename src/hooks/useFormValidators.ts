// import { useIntl } from "@umijs/max";
import type { Rule } from "antd/es/form";

export type FormValidators = Record<"inputRequired" | "selectRequired" | "fileRequired" | "email", Rule>;

/**
 * 表单验证规则集
 */
export const useFormValidators = (): FormValidators => {
  // const intl = useIntl();
  return {
    inputRequired: {
      required: true,
      message: "请输入",
      // message: intl.formatMessage({ id: "validator.input.required" }),
    },
    selectRequired: {
      required: true,
      message: "请选择",
      // message: intl.formatMessage({ id: "validator.select.required" }),
    },
    fileRequired: {
      required: true,
      message: "请上传",
      // message: intl.formatMessage({ id: "validator.file.required" }),
    },
    email: {
      validator: (rule, value, callback) => {
        if (!value || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          callback();
        } else {
          callback("请输入正确的邮箱");
          // callback(intl.formatMessage({ id: "validator.email" }));
        }
      },
    },
  };
};
