module.exports = {
  extends: require.resolve("@umijs/max/eslint"),
  rules: {
    // @fixable 必须使用 === 或 !==，禁止使用 == 或 !=，与 null 比较时除外
    eqeqeq: [
      "error",
      "always",
      {
        null: "ignore",
      },
    ],
    // 这个规则的作用是确保在条件表达式中使用的布尔值是明确的，而不是模糊的或容易混淆的
    "@typescript-eslint/strict-boolean-expressions": 0,
    // 分隔符 分号
    "@typescript-eslint/semi": [2, "always"],
    // 禁止空函数
    "@typescript-eslint/no-empty-function": 2,
    // console.log
    "no-console": 1,
    // 防止在代码中使用require函数时，将其放在函数内部或局部作用域中，而导致其无法被缓存 正确const fs = require('fs');
    "global-require": 2,
    // 用于检查 JavaScript 中是否存在变量或函数在定义之前就被使用的情况
    "@typescript-eslint/no-use-before-define": [0, { extensions: [".tsx"] }],
    // 用于检查 JavaScript 中是否有变量被声明为 let，但是在后续的代码中没有被重新赋值，这种情况下建议将变量声明为 const。
    "prefer-const": [
      2,
      {
        destructuring: "all",
      },
    ],
    // 禁止混用tab和空格
    "no-mixed-spaces-and-tabs": [2, false],
    // 没有子元素的标签请自闭合
    "react/self-closing-comp": 2,
    // 如果组件包含多行属性，在新的一行闭合标签
    "react/jsx-closing-bracket-location": 1,
    // 避免使用数组的索引作为 key 属性值, 建议使用稳定的ID
    "react/no-array-index-key": 2,
    // 当属性值为true时可以省略
    "react/jsx-boolean-value": 1,
    // 不要在 JSX 的花括号里边加空格
    "react/jsx-curly-spacing": 1,
    // 对齐：遵循以下JSX语法的对齐风格
    "react/jsx-closing-bracket-location": 1,
    // 用于检查文件扩展名是否符合 JSX 文件的命名约定。
    "react/jsx-filename-extension": [2, { extensions: [".tsx", "ts", ".jsx", "js"] }],
    "react/jsx-indent-props": [2, 2],
    "react/jsx-indent": [2, 2],
    // 用于检查 React 组件的 props 是否定义了正确的类型。
    "react/prop-types": 0,
    // 规则要求在 JSX 属性中使用双引号作为属性值的引号风格
    "jsx-quotes": [2, "prefer-single"],
  },
};
