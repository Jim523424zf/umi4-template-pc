import { authActions } from "@/models/auth/action";
import { Button, Result } from "antd";
import React from "react";

const Page: React.FC = () => (
  <Result
    status='404'
    title='404'
    subTitle='Sorry, the page you visited does not exist.'
    extra={
      <Button type='primary' onClick={() => authActions.goHome()}>
        Back Home
      </Button>
    }
  />
);

export default Page;
