import { FC, ReactNode } from "react";
import useStyles from "./styles";

type Props = {
  children: ReactNode;
};
export const CustomLayoutHeaderTitle: FC<Props> = (props) => {
  const { styles } = useStyles();
  return <div className={styles.container}>{props.children}</div>;
};
