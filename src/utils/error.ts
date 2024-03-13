import { message } from "antd";
import { ErrorInfo } from "react";
import { logUtil } from "./logUtil";
import { focusFormError } from "./tools";

function unhandledRejectionLogHandler(event: PromiseRejectionEvent) {
  // 记录错误信息或发送错误报告等操作
  logUtil.error({
    type: event?.type,
    timeStamp: event?.timeStamp,
    error: {
      message: event?.reason?.message,
      stack: event?.reason?.stack,
    },
  });
}

function errorLogHandler(event: ErrorEvent) {
  // 捕获到未捕获的错误并进行处理
  logUtil.error({
    type: event?.type,
    timeStamp: event?.timeStamp,
    filename: event?.filename,
    lineno: event?.lineno,
    colno: event?.colno,
    message: event?.message,
    error: {
      message: event?.error?.message,
      stack: event?.error?.stack,
    },
  });
}

export function componentErrorLogHandler(error: Error, errorInfo: ErrorInfo) {
  logUtil.error({
    type: "component error",
    message: error?.message,
    componentStack: errorInfo?.componentStack,
    error: {
      message: error?.message,
      stack: error?.stack,
    },
  });
}
/**
 * 打开未捕获异常监听
 */
export function listenUncaughtErrors() {
  window.addEventListener("unhandledrejection", unhandledRejectionLogHandler);
  window.addEventListener("error", errorLogHandler);
}
/**
 * 关闭未捕获异常监听
 */
export function unListenUncaughtErrors() {
  window.removeEventListener("unhandledrejection", unhandledRejectionLogHandler);
  window.removeEventListener("error", errorLogHandler);
}

/** 异常处理类 */
export const commonErrorHandler = (formatMessageById?: FormatMessageById) => {
  function errorNotify(err: any) {
    if ((err as CommonError).cause === "business") {
      // 验证提示 自动聚焦
      if ((err as CommonError).message === "internal-supplier-draft.errorVerify") {
        focusFormError();
      }
      if (formatMessageById) {
        message.error(formatMessageById((err as CommonError).message));
      } else {
        message.error(err.message);
      }
      throw err;
    }
    // 默认抛出异常
    throw err;
  }
  return {
    /** 针对异常作提示，不处理异常 */
    errorNotify,
  };
};
