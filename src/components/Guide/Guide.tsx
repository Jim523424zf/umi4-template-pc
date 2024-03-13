import jciService from "@/services/jciService";
import { Layout, Row, Typography } from "antd";
import React, { useEffect } from "react";
import styles from "./Guide.less";

interface Props {
  name: string;
}

// 脚手架示例组件
const Guide: React.FC<Props> = (props) => {
  const { name } = props;
  useEffect(() => {
    jciService.System.getSystemUserRoleQuery({})
      .then((res) => {
        console.log("getSystemUserRoleQuery", res);
      })
      .catch((err) => {
        console.log("getSystemUserRoleQuery", err);
      });
  }, []);
  return (
    <Layout>
      <Row>
        <Typography.Title level={3} className={styles.title}>
          欢迎使用 <strong>{name}</strong> ！
        </Typography.Title>
      </Row>
    </Layout>
  );
};

export default Guide;
