import { createStyles } from "antd-style";
/**
 * 参考地址（fq）：https://ant-design-antd-style-preview-pr-19.surge.sh
 * 1. 文件名后缀为 ts
 * 2. 可用对象形式，普通css样式写法，可传参 等等
 */
export default createStyles(({ token, css }) => {
  /** 文字的粗细 */
  const commonFontWeightStyles = css`
    font-weight: ${token.fontWeightStrong};
  `;

  /** 弹性盒 */
  const commonDisplayFlexStyles = css`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  `;

  return {
    container: css`
      ${commonDisplayFlexStyles}
      height: 100vh;
      background-color: ${token.colorBgLayout};
    `,
    containerOuter: css`
      width: 720px;
      height: 405px;
      display: flex;
    `,
    container_left: css`
      width: 40%;
      height: 100%;
      background-color: #56ccf2;
      border-radius: 20px 0 0 20px;
    `,
    container_left_text: css`
      ${commonFontWeightStyles};
      color: #fff;
      font-size: ${token.fontSizeHeading3}px;
      margin: ${token.marginMD}px;
      > p {
        margin: 0;
      }
    `,
    container_right: css`
      width: 480px;
      padding: 80px 80px 0 50px;
      background-color: #fff;
      > p {
        ${commonFontWeightStyles};
        color: #030072;
        font-size: ${token.fontSizeHeading1}px;
        margin-left: -30px;
      }
      .ant-form-item-label > label {
        font-size: 17px;
      }
    `,
    container_right_input: css`
      border-radius: 0;
      line-height: 30px;
      font-size: large;
      border-bottom: 1px solid gray;
      &:hover {
        border-bottom: 1px solid gray;
      }
    `,
    container_right_btn: css`
      ${commonFontWeightStyles};
      ${commonDisplayFlexStyles}
      width: 90px;
      height: 32px;
      margin: 0 auto;
      border-radius: 10px;
      font-size: ${token.fontSizeXL}px;
    `,
    container_bottom: css`
      position: absolute;
      bottom: 10px;
    `,
  };
});
