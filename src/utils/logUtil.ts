import localforage from "localforage";
import log from "loglevel";
import { textDownload } from "./file";
import { createLocalforageInstance } from "./storage";

const logForage = createLocalforageInstance({
  driver: localforage.INDEXEDDB, // 使用IndexedDB作为存储引擎
  name: "webLogs", // 数据库名称
  version: 1, // 数据库版本
  storeName: "logData", // 对象存储空间名称
});

type LogData = {
  method: log.LogLevelNames;
  level: log.LogLevelNumbers;
  message: unknown;
  timestamp: number;
  localeTime: string;
};
// 创建一个自定义的log插件
function logStoragePlugin(logger: log.Logger) {
  const originalFactory = logger.methodFactory;

  logger.methodFactory = function (methodName, logLevel, loggerName) {
    const originalMethod = originalFactory(methodName, logLevel, loggerName);

    return function (...message) {
      originalMethod(...message);
      // 存储日志到 logForage
      logForage
        .getItem("logs")
        .then((logs) => {
          let logsData: LogData[] = (logs as LogData[]) || [];
          // 将日志消息添加到数组中
          logsData.push({
            method: methodName,
            level: logLevel,
            message: message,
            timestamp: Date.now(),
            localeTime: new Date().toLocaleString(),
          });
          // 最多保留1w条日志
          logsData = logsData.slice(-10000);
          // 删除超过7天的日志
          const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          logsData = logsData.filter((log) => log.timestamp >= sevenDaysAgo);
          // 存储更新后的日志数组
          logForage.setItem("logs", logsData).catch();
        })
        .catch();
    };
  };
}

export class LogUtil {
  private _log: log.Logger | null = null;

  constructor() {
    this.initLogger();
    this.applyLogStoragePlugin();
  }

  private initLogger() {
    this._log = log.getLogger("webLogs");
    this._log.setLevel(process.env.ENV === "prod" ? "warn" : "trace");
  }

  private applyLogStoragePlugin() {
    if (!this._log) return;
    logStoragePlugin(this._log);
  }

  log(...args: unknown[]) {
    this._log?.log(args);
  }
  trace(...args: unknown[]) {
    this._log?.trace(args);
  }
  debug(...args: unknown[]) {
    this._log?.debug(args);
  }
  info(...args: unknown[]) {
    this._log?.info(args);
  }
  warn(...args: unknown[]) {
    this._log?.warn(args);
  }
  error(...args: unknown[]) {
    this._log?.error(args);
  }
}

export const logUtil = new LogUtil();

// 下载日志方法
const downloadLogs = function () {
  // 从 logForage 获取存储的日志
  logForage.getItem("logs").then(function (logs) {
    if (!logs?.length) {
      // eslint-disable-next-line no-console
      console.log("没有可下载的日志");
      return;
    }
    textDownload(JSON.stringify(logs), `${new Date().toLocaleString()}.log`);
  });
};
(window as any).downloadLogs = downloadLogs;
// 添加下载按钮的事件监听
document.getElementById("download-web-log")?.addEventListener("click", downloadLogs);

// 测试方法

// const button = document.createElement("button");
// button.innerText = "下载日志";
// button.id = "download-button";
// button.onclick = downloadLogs;
// button.style.cssText = "position: fixed; top: 0; right: 0; z-index: 99999;";
// document.body.appendChild(button);

// let num = 0;
// const button1 = document.createElement("button");
// button1.innerText = "异常";
// button1.id = "download-button";
// button1.onclick = () => {
//   // 一个示例的错误
//   num++;
//   throw new Error("这是一个错误" + num);
// };
// button1.style.cssText = "position: fixed; top: 30px; right: 0; z-index: 99999;";
// document.body.appendChild(button1);

// const testLog = setInterval(() => {
//   button1.click();
// }, 100);

// setTimeout(() => {
//   clearInterval(testLog);
// }, 2000);
