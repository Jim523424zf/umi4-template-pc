# README

`@umijs/max` 模板项目，更多功能参考 [Umi Max 简介](https://umijs.org/docs/max/introduce)

## 开发规范

### 命名规则

- 1、组件、页面文件名使用 `PascalCase` 命名，如 `MyComponent`、`MyPage`
- 2、文件夹使用 `kebab-case`|`camelCased` 命名（除了 [`MyComponent`|`MyPage`]/index.tsx），如 `module-a`、`components/customForm/xxx`
- 3、功能模块文件名使用`camelCased` 命名，如 `util/myUtil.ts`
- 4、国际化locales中语言包内「key」使用`.`隔开的字符串，如 `my.key`

### 样式规范

- 页面、组件对应的less样式文件，最外层需要用一个class包裹隔离，避免影响其他页面
- 全局通用样式写到`src\global.less`内，或在其内引用

## 开发流程

### 项目包管理工具 pnpm

没安装pnpm的允许安装命令`npm i -g pnpm`

项目启动 `pnpm start`

### 新增页面

创建文件

- src/pages/xx-xx/`PageName`/index.tsx —— 包含页面布局，UI交互
- src/pages/xx-xx/`PageName`/index.less
- src/store/xx-xx/(`pageName`.ts|`pageName`/index.ts) —— 包含非UI交互逻辑，如接口请求、数据状态更新、业务逻辑处理等（模版文件：`src/store/template.ts`）
- [可选] src/components/xx-xx/(`ComponentName`.tsx|`ComponentName`/index.tsx) ——新增组件

配置路由

```ts
// config/config.ts
// 禁止使用redirect 往子routes里跳转,会导致内存上升
// 路由对应菜单名国际化，设置src/locales，key为menu.[路由name]
export default defineConfig({
    routes:[
        {
            // 菜单-JCI内部
            name: "internal",
            path: "/internal",
            routes:[
                // 菜单页面
                ...
            ],
            // 不需要走layout的页面，建议这么写，性能好
            {
            name: "supplier-management",
            icon: "BookOutlined",  // @ant-design/icons 设置可能会报错，需要重新启动开发模式
            path: "/internal/supplier-management",
            component: "@/pages/internal/SupplierManagement",
            },
        }
    ]
})


```ts
import jciService from "@/services/jciService";

jciService.System.getSystemQueryLoginUser();
```

### 国际化

新增语言包，文件名参考 [Ant Design 国际化](https://ant.design/docs/react/i18n-cn)，例如：en_US.ts

使用

- 组件使用 `<FormattedMessage id='welcome' />`
- 传递message

```ts
import { useIntl } from "@umijs/max";
···
const intl = useIntl();
const msg = intl.formatMessage({
    id: "welcome",
});
...
// render
<Alert message={msg} type='success' />
```

### 权限

使用参考[umi max权限](https://umijs.org/docs/max/access)

```ts

import { useAuthState } from "@/models/auth/state";

const {access} = useAuthState();

if (!access.canReadFoo) {
  return <div>没有权限</div>;
}

```

```ts
import { Access } from "@/components/Access";

return <Access accessible={access.canReadFoo} fallback={<div>有权限</div>} />;
```

### 表单错误定位

抛出异常

```js
form?.validateFields().catch(() => {
    throw new Error("internal-supplier-draft.errorVerify", {
        cause: "business",
    }) as CommonError;
});
```

捕获异常

```js
const {
    errorNotify,
  } = useMyLocales();
 xxxPromise.catch(errorNotify);

```

### 必填项校验的提示应该在点击提交时再统一提示

组件`CustomFormPage`增加配置项`formValidateAble`，类型为`boolean`

用于启用表单校验提示的，默认为`true`

页面加载时，赋值`false`；首次提交时，赋值`true`

注：需要在出发表单验证前设置`true`，否则可能影响表单错误定位

### 列表要求

#### 使用自定义列表组件 `CustomProTable` 统一基本样式

```js
import { CustomProTable } from "@/components/CustomProTable";

<CustomProTable {...proTableProps} />
```

表格内column统一左对齐，无需设置 align='center'

#### 操作按钮图标

操作列 根元素 className 统一使用 `column-option-button`

内部img元素高度自动设置16px

内部字体默认16px，默认会应用到使用的antd icon

##### 1、查看

代码格式：

```ts
<Tooltip title={internalSupplierCheck} key='view'>
  <Link
    className='column-option-button'
    to={`/internal/midway/${record.id}/${ProcessCodeEnumDes[ProcessCodeEnum.SupplierInvitation]}/${
      SupplierFormStateEnum.NONE
    }`}
  >
    <img src={supplierManagementItemView} alt='' />
  </Link>
</Tooltip>
```

图标统一采用：supplierManagementItemView 表示

##### 2、删除

删除按钮需要二次确认

代码格式：

```ts
<Tooltip title={internalSupplierDelete} key='delete'>
  <CustomPopconfirm title={confirmDelete} onConfirm={() => handleDelete(record)}>
    <a className='column-option-button'>
      <img src={draftDelete} alt='' />
    </a>
  </CustomPopconfirm>
</Tooltip>
```

列表删除图标统一采用： draftDelete

##### 3、编辑

代码格式：

```ts
<Tooltip title={internalSupplierManagementEdit} key='edit'>
  <Link
    className='column-option-button'
    to={`/internal/supplier-modify/${record.id}/${ProcessCodeEnum.SupplierModify}/${SupplierFormStateEnum.NONE}`}
  >
    <img src={supplierManagementItemEdit} alt='' />
  </Link>
</Tooltip>
```

列表图标统一采用：supplierManagementItemEdit

##### 4、拓展

代码格式：

```ts
<Tooltip title={internalSupplierManagementExpand} key='expand'>
  <Link className='column-option-button' to={`/internal/supplier-expand/${record.id}`}>
    <img src={supplierManagementItemExpand} alt='' />
  </Link>
</Tooltip>
```

列表图标统一采用：supplierManagementItemExpand

### 按钮要求

### 跳转要求

## QA

### umi 路由配置 icon 图标报错问题

现象：在运行的时候实时修改路由的 icon 不会生效

报错信息:

```js
index.js:1  The above error occurred in the <AntdIcon> component:
mf-dep____vendor.c5605a35.js:316500  Uncaught TypeError: Cannot read properties of null (reading 'useContext')
index.js:1 Warning: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
```

解决方案：重新启动项目
