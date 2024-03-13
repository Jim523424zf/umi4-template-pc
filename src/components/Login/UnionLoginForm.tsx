/* eslint-disable @typescript-eslint/no-unused-vars */
// import loginLogo from "@/assets/images/loginLogo.png";
// import { SelectLang } from "@umijs/max";
// import { history } from "@umijs/max";
import { Button, Form, Input, Typography } from "antd";
import React from "react";
import useStyles from "./UnionLoginFormStyles";
import { useLogin } from "./useLogin";
export const UnionLoginForm: React.FC = () => {
  const { handleAADLogin, handleB2CLogin } = useLogin();

  const { Title, Paragraph, Text, Link } = Typography;

  //  theme 对象包含了所有的 token 与主题等信息,当前主题模式：{theme.appearance}
  const { styles, cx, theme } = useStyles();
  const onLogin = () => {
    handleAADLogin();
    // history.push("/internal/home");
  };
  return (
    <div className={styles.container}>
      <div className={styles.containerOuter}>
        <div className={styles.container_left}>
          <div className={styles.container_left_text}>
            <p>Company</p>
            <p>System Name</p>
          </div>
        </div>
        <div className={styles.container_right}>
          <p>Welcome</p>
          <Form layout='vertical'>
            <Form.Item label='Username' name='username'>
              <div className={styles.container_right_input}>
                <Input bordered={false} />
              </div>
            </Form.Item>
            <Form.Item label='Password' name='password'>
              <div className={styles.container_right_input}>
                <Input.Password bordered={false} />
              </div>
            </Form.Item>
            <Form.Item>
              <Button className={styles.container_right_btn} type='primary' htmlType='submit' onClick={() => onLogin()}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className={styles.container_bottom}>
        <Paragraph>
          <pre>{`@ copyright`}</pre>
        </Paragraph>
      </div>
    </div>
  );
};
