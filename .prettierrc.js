module.exports = {
  // 'all':尽可能在结尾处加上尾逗号
  trailingComma: "all",
  // js css 是否使用单引号，不包含JSX
  singleQuote: false,
  // 是否在JSX中使用单引号
  jsxSingleQuote: true,
  // 代码行的宽度，通用建议每行最大长度建议为100/120，但最好不超过这两个数
  printWidth: 120,
  // 'preserve':使用默认的折行标准
  proseWrap: "never",
  // lf / crlf / cr / auto
  endOfLine: "crlf",
  // （默认）为属性名称强制执行 小驼峰 样式
  properties: "always",
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  overrides: [{ files: ".prettierrc", options: { parser: "json" } }],
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-packagejson"],
};
