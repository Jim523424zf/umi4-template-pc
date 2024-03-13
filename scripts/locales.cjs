// 将locales文件转json放public目录
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const workbook = new ExcelJS.Workbook();

async function ReadLocaleFileToObject(filePath) {
  const str = fs.readFileSync(filePath, "utf-8");
  if (filePath.endsWith(".json")) {
    return JSON.parse(str);
  }
  if (filePath.endsWith(".ts")) {
    // eslint-disable-next-line prefer-const
    let object = {};
    // eslint-disable-next-line no-eval
    eval(`object = ` + str.replace("export default", ""));
    return object;
  }
  console.warn("文件格式不支持", filePath);
  return {};
}
async function getObjectWriteFileStr(object, desc) {
  const str = Object.keys(object)
    .map((field) => {
      return `  "${field}": "${decodeURIComponent(object[field])}",`;
    })
    .join("\n");
  if (desc) {
    return `  // ${desc}\n${str}`;
  }
  return str;
}
async function WriteStrToLocaleFile(filePath, str) {
  // 获取目录路径
  const dirPath = path.dirname(filePath);

  // 检查目录是否存在
  if (!fs.existsSync(dirPath)) {
    // 创建目录
    fs.mkdirSync(dirPath, { recursive: true });
  }
  if (filePath.endsWith(".json")) {
    fs.writeFileSync(filePath, str, "utf-8");
    return;
  }
  if (filePath.endsWith(".ts")) {
    fs.writeFileSync(filePath, `export default {\n${str}\n};`, "utf-8");
    return;
  }
  console.warn("文件格式不支持", filePath);
}
async function WriteObjectToLocaleFile(filePath, object) {
  await WriteStrToLocaleFile(filePath, await getObjectWriteFileStr(object));
}

const ID_COLUMN_TEXT = "ID";
const EXCEL_FILE_NAME = "source/locales.xlsx";
// const EXCEL_SHEET_NAME = "系统字段";
const EXCEL_SHEET_NAME = "system";
const sourcePath = path.resolve(__dirname, "../src/locales");
const distSrcPath = path.resolve(__dirname, "temp/locales/source");
const distPath = path.resolve(__dirname, "temp/locales/target");

/** 语言文件类型 ts|json */
const langLocaleFileType = ".json";
/** 语言跟文件关系表 */
const langLocaleMap = new Map([
  ["default", "zh_CN" + langLocaleFileType],
  ["默认语言（中文）", "zh_CN" + langLocaleFileType],
  ["Default Language（Chinese）", "zh_CN" + langLocaleFileType],
  ["Default Language（Chinese)", "zh_CN" + langLocaleFileType],
  ["英语", "en_US" + langLocaleFileType],
  ["English", "en_US" + langLocaleFileType],
  ["日语", "ja_JP" + langLocaleFileType],
  ["韩语", "ko_KR" + langLocaleFileType],
  ["泰语", "th_TH" + langLocaleFileType],
  ["Thai", "th_TH" + langLocaleFileType],
  ["繁体中文", "zh_TW" + langLocaleFileType],
]);

/**
 * 最终语言文件
 */
const locales = new Map();
async function ReadLocaleExcel() {
  // 加载现有的Excel语言文件
  await workbook.xlsx.readFile(path.resolve(__dirname, EXCEL_FILE_NAME));
  // 获取第一个工作表
  const worksheet = workbook.getWorksheet(EXCEL_SHEET_NAME); // 或者使用 workbook.getWorksheet('Sheet1')

  // 列跟文件关系表    key colNumber , value "zh_CN.ts"
  const colNumberLocaleMap = new Map();
  // Id对于的列
  let IdColumnNumber = 1;
  function initLocaleFiles(row, rowNumber) {
    if (rowNumber !== 1) {
      return;
    }
    row.eachCell((cell, colNumber) => {
      if (cell.value === ID_COLUMN_TEXT) {
        IdColumnNumber = colNumber;
        return;
      }
      if (langLocaleMap.has(cell.value)) {
        colNumberLocaleMap.set(colNumber, langLocaleMap.get(cell.value));
      }
    });
  }
  // 行对应的ID
  const rowIdMap = new Map();
  function initRowId(row, rowNumber) {
    row.eachCell((cell, colNumber) => {
      if (colNumber !== IdColumnNumber) {
        return;
      }
      rowIdMap.set(rowNumber, cell.value);
    });
  }
  // 设置语言ID对于属性
  function setIdValue(row, rowNumber) {
    if (!rowIdMap.has(rowNumber)) {
      return;
    }
    const id = rowIdMap.get(rowNumber);
    row.eachCell((cell, colNumber) => {
      if (colNumber === IdColumnNumber) {
        return;
      }
      if (!colNumberLocaleMap.has(colNumber)) {
        return;
      }
      const file = colNumberLocaleMap.get(colNumber);
      const locale = locales.get(file);
      let text = cell.value;
      // 富文本单元格处理
      if (cell.value.richText) {
        text = cell.value.richText.map((x) => x.text).join("");
      }
      // 富文本处理过后还有问题的
      if (text.toString() === "[object Object]") {
        console.warn(`[warning] 非正常字段,${id},`, cell.value);
      }
      // 带换行付的单元格处理
      if (text.includes("\n")) {
        text = text.replace(/\n/g, "");
        // console.info(`[warning] 带换行字段,${id},`, text);
      }
      // 处理双引号
      if (text.includes('"')) {
        text = text.replace(/"/g, '\\"');
        // console.info(`[warning] 带双引号字段,${id},`, text);
      }

      locales.set(file, {
        ...locale,
        [id]: encodeURIComponent(text),
      });
    });
  }
  // 遍历每一行
  worksheet.eachRow((row, rowNumber) => {
    initLocaleFiles(row, rowNumber);
    initRowId(row, rowNumber);
    setIdValue(row, rowNumber);
  });
}
async function WriteLocale() {
  locales.forEach((value, key) => WriteObjectToLocaleFile(path.resolve(distSrcPath, key), value));
}
// 对比项目和生成的语言文件，生成新的语言包文件
async function diffLocale(excelLocale, sourceLocale = langLocaleMap.get("default")) {
  console.log("diff", excelLocale, sourceLocale);
  const isZhCN = excelLocale === sourceLocale;
  const zhProject = await ReadLocaleFileToObject(path.resolve(sourcePath, sourceLocale));
  const zhExcel = locales.get(excelLocale);
  const zhProjectKeys = Object.keys(zhProject);
  const zhExcelKeys = Object.keys(zhExcel);
  const addKeys = [];
  const modifyKeys = [];
  const deleteKeys = [];
  /**
   * 对比 zhProjectKeys zhExcelKeys 2个对象
   * 将 zhProjectKeys 和 zhExcelKeys 相同的键做赋值处理
   * 将 zhProjectKeys 和 zhExcelKeys 新增的key整理到addKeys
   * 将 zhProjectKeys 和 zhExcelKeys 减少的key整理到deleteKeys
   */
  zhProjectKeys.forEach((key) => {
    if (!zhExcelKeys.includes(key)) {
      addKeys.push(key);
      return;
    }
    if (isZhCN) {
      // 中文的对比一下中文是否有被改动，修改的打印出来，并写进文件
      const zhExcelValue = decodeURIComponent(zhExcel[key]);
      if (zhProject[key] !== zhExcelValue) {
        console.warn(`文案有修改${key}\n： ${zhProject[key]} -> ${zhExcelValue} `);
        modifyKeys.push(key);
      }
      return;
    }
    modifyKeys.push(key);
  });
  zhExcelKeys.forEach((key) => {
    if (zhProjectKeys.includes(key)) {
      return;
    }
    deleteKeys.push(key);
  });

  const modifyObject = modifyKeys.reduce((object, field) => ((object[field] = zhExcel[field]), object), {});
  const addObject = addKeys.reduce((object, field) => ((object[field] = zhProject[field]), object), {});
  const deleteObject = deleteKeys.reduce((object, field) => ((object[field] = zhExcel[field]), object), {});
  const zhUpdateProject = zhProjectKeys.reduce((object, field) => ((object[field] = zhExcel[field]), object), {});

  if (sourceLocale.endsWith(".ts")) {
    const modifyStr = await getObjectWriteFileStr(modifyObject);
    const addStr = await getObjectWriteFileStr(addObject, "新增的ID");
    // const deleteStr = await getObjectWriteFileStr(deleteObject, "删除的ID");

    // 中文的输出到dist 其他语言输出到项目内
    if (isZhCN) {
      const zhUpdateStr = await getObjectWriteFileStr(zhUpdateProject);
      await WriteStrToLocaleFile(path.resolve(distPath, excelLocale), zhUpdateStr + "\n");
      return;
    }
    await WriteStrToLocaleFile(path.resolve(sourcePath, excelLocale), [modifyStr, addStr].join("\n") + "\n");
  } else {
    // 中文的输出到dist 其他语言输出到项目内
    if (isZhCN) {
      await WriteStrToLocaleFile(
        path.resolve(distPath, excelLocale),
        decodeURIComponent(JSON.stringify(zhUpdateProject, null, 2)) + "\n",
      );
      return;
    }
    await WriteStrToLocaleFile(
      path.resolve(sourcePath, excelLocale),
      decodeURIComponent(JSON.stringify({ ...modifyObject, ...addObject }, null, 2)) + "\n",
    );
  }
}
ReadLocaleExcel().then(async () => {
  console.log("文件读取完成");
  // await WriteLocaleTs();
  // console.log("文件写入完成");
  const tasks = [];
  locales.forEach((_, key) => tasks.push(diffLocale(key)));
  console.log("tasks", tasks.length);
  await Promise.all(tasks);
  console.log("文件对比完成");
});
