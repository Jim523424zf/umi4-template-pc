// 将locales文件转json放public目录 给后端使用
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const sourcePath = path.resolve(__dirname, "../src/locales");
const distPath = path.resolve(__dirname, "../public/locales");

try {
  const files = fs.readdirSync(sourcePath);
  console.log("开始转换国际化语言包[ts->json]...");
  files.forEach((file) => {
    try {
      if (file.endsWith(".orig")) {
        return;
      }
      const sourceFilePath = path.join(sourcePath, file);
      const distFile = file.replace(".ts", ".json");
      const distFilePath = path.join(distPath, distFile);
      const sourcefileData = fs.readFileSync(sourceFilePath, "utf8");
      if (!sourcefileData) {
        return;
      }

      // 获取目录路径
      const dirPath = path.dirname(distFilePath);
      // 检查目录是否存在
      if (!fs.existsSync(dirPath)) {
        // 创建目录
        fs.mkdirSync(dirPath, { recursive: true });
      }

      if (sourceFilePath.endsWith(".ts")) {
        let sourceFileObject;
        // eslint-disable-next-line no-eval
        eval(`sourceFileObject = ` + sourcefileData.replace("export default", ""));

        // console.log(`读取到文件: ${file}`, sourceFileObject);
        const distFileData = JSON.stringify(sourceFileObject, null, 2);

        // 获取目录路径
        const distFileDirPath = path.dirname(distFilePath);

        // 检查目录是否存在
        if (!fs.existsSync(distFileDirPath)) {
          // 创建目录
          fs.mkdirSync(distFileDirPath, { recursive: true });
        }

        // 写入文件
        fs.writeFileSync(distFilePath, distFileData, "utf8");
        console.log(`生成成功:${distFilePath}`);
      }
      if (sourceFilePath.endsWith(".json")) {
        fs.writeFileSync(distFilePath, sourcefileData, "utf8");
      }
    } catch (error) {
      console.error("文件处理时发生错误:", error);
    }
  });
} catch (error) {
  console.error("读取目录时发生错误:", error);
}
