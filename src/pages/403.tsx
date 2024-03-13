import { authActions } from "@/models/auth/action";
import { Button, Result } from "antd";
import React from "react";

const Page: React.FC = () => (
  <Result
    status='403'
    title='403'
    subTitle='Sorry, you are not authorized to access this page.'
    extra={
      <Button type='primary' onClick={() => authActions.goHome()}>
        Back Home
      </Button>
    }
  />
);

export default Page;
