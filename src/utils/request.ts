import { RequestStateEnum, RequestStateEnumDes } from "@/constants/requestMessage";
import { myMsal } from "@/services/msal";
import { RequestConfig, RequestOptions, formatMessage, request } from "@umijs/max";
import { message, notification } from "antd";
import { AxiosError } from "axios";
// import { lang } from "./lang";
import { logUtil } from "./logUtil";

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
  msg?: string;
  code?: RequestStateEnum;
}

// 运行时配置
export const requestConfig: RequestConfig = {
  // 统一的请求设定
  timeout: 30000,
  headers: { "X-Requested-With": "XMLHttpRequest" },
  // withCredentials: true,

  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res: ResponseStructure) => {
      const { success, data, errorCode, errorMessage, showType, msg, code } = res;
      if (success === false && errorMessage) {
        const error: any = new Error(errorMessage);
        error.name = "BizError";
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }

      if (success === false && RequestStateEnumDes[`${code!}`]) {
        const error: any = new Error(msg);
        error.name = "BizError";
        error.info = {
          showType: ErrorShowType.ERROR_MESSAGE,
          errorMessage: formatMessage({ id: RequestStateEnumDes[`${code!}`] }),
        };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts) => {
      if (opts?.skipErrorHandler) throw error;
      if (opts.method === "HEAD") {
        return;
      }
      // 我们的 errorThrower 抛出的错误。
      if (error.name === "BizError") {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.open({
                key: errorMessage,
                type: "warning",
                content: errorMessage,
              });
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.open({
                key: errorMessage,
                type: "error",
                content: errorMessage,
              });
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.open({
                key: errorMessage,
                type: "error",
                content: errorMessage,
              });
          }
        }
        return;
      }
      if (error.response) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          myMsal.goToLoginPage();
          return;
        }
        if (opts.errorMessageTip === false) {
          return;
        }
        const content = getErrorContentWithCode(error.code);
        if (content) {
          message.open({
            key: content,
            type: "error",
            content: content,
          });
          return;
        }
        const errorMessage = error.response.data?.msg || error.response.data?.errorMessage;
        if (error.response.data?.success === false && errorMessage) {
          message.open({
            key: errorMessage,
            type: "error",
            content: errorMessage,
          });
          return;
        }
        message.open({
          key: `Response status:${error.response.status}`,
          type: "error",
          content: `Response status:${error.response.status}`,
        });
        return;
      }
      // 发送请求时出了点问题
      const content = getErrorContentWithCode(error.code) || "Request error, please retry.";
      message.open({
        key: content,
        type: "error",
        content,
      });
    },
  },

  // 请求拦截器
  requestInterceptors: [
    async (config: RequestOptions) => {
      // 请求之前 如果token过期尝试刷新一次token , 刷失败也不抛错
      await myMsal.refreshAccessToken({ shipGoToLoginPage: true }).catch((err) => {
        logUtil.error(err);
      });
      // 拦截请求配置，进行个性化处理。
      const headers = {
        ...config.headers,
        ...getHttpHeaders(),
      };
      return { ...config, headers };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    [
      (response) => response,
      (error: any) => {
        const { response } = error;
        const originalRequest = error?.config;
        // return Promise.resolve(response);
        // 重试1次 超出直接跳登录去吧
        if ((response?.status === 401 || response?.status === 403) && originalRequest?.retryCount !== 1) {
          const promise = async (resolve: any, reject: any) => {
            try {
              /**
               * 是首次直接访问时 没有loginType,会跳过token刷新
               * 刷token失败会清理登录信息，设置跳过登录页跳转 留给接口401跳转登录
               */
              await myMsal.refreshAccessToken({ force: true, shipGoToLoginPage: true }).catch((err) => {
                // 刷token失败的异常 不抛出至接口请求异常捕获，防止捕获不到401异常
                logUtil.error(err);
              });
              const res = await request(originalRequest.url, { ...originalRequest, getResponse: true, retryCount: 1 });
              resolve(res);
            } catch (error) {
              reject(error);
            }
          };
          return new Promise(promise);
        }
        return Promise.reject(error);
      },
    ],
  ],
};

const getErrorContentWithCode = (code: string) => {
  let content;
  switch (code) {
    case AxiosError.ERR_NETWORK:
      content = "Network error!";
      break;
    case AxiosError.ERR_CANCELED:
      content = "Operation cancelled!";
      break;
    case AxiosError.ECONNABORTED:
      content = "Connection aborted!";
      break;
    case AxiosError.ETIMEDOUT:
      content = "Operation timed out!";
      break;
  }
  return content;
};

/**
 * 自定义请求 后端接收到的格式是 头按小写，并且单词用-分割，否则后端解析会出错（后端会自动转大写开头，还有Akamai会全部转小写）
 * @returns
 */
export const getHttpHeaders = () => {
  const accessToken = myMsal.accessToken;
  const LoginType = myMsal.loginType;
  return {
    // auth授权头信息
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    "Login-Type": LoginType,
    "Timezone-Offset": new Date().getTimezoneOffset(),
    // Language: lang.getLocale(),
  };
};
