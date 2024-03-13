type FormatMessageById = (id: string) => string;
type MyLocales = {
  /** 当前语言 */
  curLang: string;
  /** 根据id获取国际化文案 */
  formatMessageById: FormatMessageById;
  /** 异常处理,捕获业务异常并提示 */
  errorNotify: (err: any) => void;
};
