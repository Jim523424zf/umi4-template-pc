import { createStyles } from "antd-style";

export default createStyles(({ token, css }) => {
  return {
    container: css`
      cursor: pointer;

      > img {
        padding-inline: 30px;
      }

      > h1 {
        position: relative;
        padding-left: 30px;

        &::before {
          content: " ";
          position: absolute;
          left: 0;
          top: 50%;
          width: 1px;
          background: ${token.colorBgLayout};
          height: 56px;
          transform: translateY(-50%);
        }
      }
    `,
  };
});
