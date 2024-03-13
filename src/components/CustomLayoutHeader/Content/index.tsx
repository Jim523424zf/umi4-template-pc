// import logoBlossom from "@/assets/images/avatarIcon.png";
import { FC } from "react";
import useStyles from "./styles";

export const CustomLayoutHeaderContent: FC = () => {
  const { styles } = useStyles();
  return (
    <div className={styles.container}>
      <img
        src='https://img0.baidu.com/it/u=1418920863,2484633002&fm=253&fmt=auto&app=138&f=JPEG?w=517&h=500'
        alt='logo'
      />
    </div>
  );
};
