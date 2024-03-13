import { createStyles } from "antd-style";

export default createStyles(({ css }) => {
  return {
    container: css`
      width: 100%;
      display: flex;
      justify-content: center;

      img {
        height: 44px;
      }
    `,
  };
});
