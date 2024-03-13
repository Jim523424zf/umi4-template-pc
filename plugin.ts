import { IApi } from "@umijs/max";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (api: IApi) => {
  api.modifyHTML(($) => {
    // $("meta[name=viewport]").attr(
    //   "content",
    //   `width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no`,
    // );
    /**
     *  添加如下标签到html头部
     */
    $("head").append(`
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
`);

    return $;
  });
  // api.modifyHTML(($) => {
  //   $("html").addClass("dark");
  //   return $;
  // });
};
