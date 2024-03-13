/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const workbook = new ExcelJS.Workbook();// 创建工作簿

const ID_COLUMN_TEXT = "ID";
const sourcePath = path.resolve(__dirname, "../src/locales");
const excelFilePath = path.resolve(__dirname, "source/locales.xlsx");

/** 语言文件类型 ts|json */
const langLocaleFileType = ".json";
/** 语言跟文件关系表 */
const langLocaleMap = new Map([
    ["默认语言（中文）", "zh_CN" + langLocaleFileType],
    ["default", "zh_CN" + langLocaleFileType],
    ["Default Language（Chinese）", "zh_CN" + langLocaleFileType],
    ["英语", "en_US" + langLocaleFileType],
    ["English", "en_US" + langLocaleFileType],
    ["日语", "ja_JP" + langLocaleFileType],
    ["韩语", "ko_KR" + langLocaleFileType],
    ["泰语", "th_TH" + langLocaleFileType],
    ["Thai", "th_TH" + langLocaleFileType],
    ["繁体中文", "zh_TW" + langLocaleFileType],
]);

async function WriteLocaleToExcel() {
    // 检查是否存在locales.xlsx文件
    const fileExists = fs.existsSync(excelFilePath);
    // 如果文件已存在，则直接读取现有文件
    if (fileExists) {
        await workbook.xlsx.readFile(excelFilePath);
    }

    // 获取语言文件路径
    const localeFiles = fs.readdirSync(sourcePath);

    // 检查是否存在system工作表
    let worksheet = workbook.getWorksheet("system");
    // 如果system工作表不存在，则创建新的工作表
    if (worksheet) {
        workbook.removeWorksheet(worksheet.id);
    }
    // 创建新的system工作表
    worksheet = workbook.addWorksheet("system");
    // 添加表头行
    const columnHeader = [ID_COLUMN_TEXT];
    for (const localeFile of localeFiles) {
        let headerName = "";
        for (const [key, value] of langLocaleMap.entries()) {
            if (value === localeFile) {
                headerName = key;
                break;
            }
        }
        columnHeader.push(headerName);
    }
    worksheet.addRow(columnHeader);

    // 获取所有语言文本的键并去重
    let allKeys = new Set();
    for (const localeFile of localeFiles) {
        const filePath = path.resolve(sourcePath, localeFile);
        const localeObject = require(filePath);
        Object.keys(localeObject).forEach(key => allKeys.add(key));
    }
    allKeys = Array.from(allKeys);

    // 添加每行的语言文本
    for (const key of allKeys) {
        const rowValues = [key];
        for (const localeFile of localeFiles) {
            const localeName = localeFile.split(".")[0];
            const filePath = path.resolve(sourcePath, localeFile);
            const localeObject = require(filePath);
            rowValues.push(localeObject[key] || "");
        }
        worksheet.addRow(rowValues);
    }

    // 自适应列宽
    worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell(cell => {
            const columnLength = cell.value ? cell.value.toString().length : 0;
            if (columnLength > maxLength) {
                maxLength = columnLength;
            }
        });
        column.width = maxLength < 20 ? 20 : maxLength; // 最小宽度为10个字符
    });

    // 保存Excel文件
    await workbook.xlsx.writeFile(excelFilePath);
    console.log("Excel文件生成成功:", excelFilePath);
}

WriteLocaleToExcel().catch((error) => {
    console.error("生成Excel文件时发生错误:", error);
});
