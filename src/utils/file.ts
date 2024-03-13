import streamSaver from "streamsaver";
import { getHttpHeaders } from "./request";

/**
 * 远程文件下载
 * @param url
 * @param fileName
 * @param init
 * @returns
 */
export function fileDownload(url: string, fileName?: string, init?: RequestInit) {
  const promise = (resolve: (value?: unknown) => void, reject: (reason?: any) => void) => {
    const { headers, ...restInit } = init || {};
    fetch(url, { headers: { ...getHttpHeaders(), ...headers }, ...restInit }).then((res) => {
      let distFileName = fileName;
      if (!distFileName) {
        // 接口获取文件名
        const contentDisposition = res.headers.get("Content-Disposition");
        if (contentDisposition && contentDisposition.includes("attachment")) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            distFileName = matches[1].replace(/['"]/g, "");
          }
        }
      }
      if (!distFileName) {
        throw new Error("文件名获取失败");
      }
      const fileStream = streamSaver.createWriteStream(distFileName);

      const readableStream = res.body;
      if (window.WritableStream && readableStream?.pipeTo) {
        return readableStream
          .pipeTo(fileStream)
          .then(() => {
            resolve();
          })
          .catch(reject);
      }

      // 【步骤3】监听文件内容是否读取完整，读取完就执行“保存并关闭文件”的操作。
      const writer = fileStream.getWriter();
      const reader = res.body?.getReader();
      const pump = () =>
        reader
          ?.read()
          .then((res) => {
            if (res.done) {
              writer.close();
              resolve();
            } else {
              writer.write(res.value).then(pump);
            }
          })
          .catch(reject);
      pump();
    });
  };
  return new Promise(promise);
}

/**
 * 字符串写入文件下载
 * @param text
 * @param fileName
 */
export function textDownload(text: string, fileName: string) {
  // 使用streamSaver库创建写入流
  const writableStream = streamSaver.createWriteStream(fileName);
  const writer = writableStream.getWriter();
  writer.write(new TextEncoder().encode(text));
  writer.close();
}
