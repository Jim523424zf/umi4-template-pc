import { defineConfig } from "@umijs/max";
// import px2vw from "postcss-px-to-viewport-8-plugin";

export default defineConfig({
  styledComponents: {
    // fix: SC babel plugin config. https://github.com/umijs/umi/pull/11167
    babelPlugin: {
      topLevelImportPaths: ["umi", "@umijs/max"],
    },
  },
  // extraPostCSSPlugins: [
  //   px2vw({
  //     unitToConvert: "px", //需要转换的单位，默认为"px"；
  //     viewportWidth: 1920, // 根据设计搞来
  //     // viewportHeight: 1080,
  //     unitPrecision: 6,
  //     viewportUnit: "vw",
  //     propList: ["*"], //要进行转换的属性列表,*表示匹配所有,!表示不转换
  //     selectorBlackList: [".ignore", ".hairlines"], //不进行转换的css选择器，继续使用原有单位
  //     minPixelValue: 1,
  //     mediaQuery: true, //设置媒体查询里的单位是否需要转换单位
  //     replace: true, //是否直接更换属性值，而不添加备用属性
  //     // exclude: /(\/|\\)(node_modules)(\/|\\)/, //忽略某些文件夹下的文件
  //   }),
  // ],
});
