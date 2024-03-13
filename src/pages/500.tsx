import { authActions } from "@/models/auth/action";
import { Button, Result } from "antd";
import React from "react";

const Page: React.FC = () => (
  <Result
    status='500'
    title='500'
    subTitle='Sorry, something went wrong.'
    extra={
      <Button type='primary' onClick={() => authActions.goHome()}>
        Back Home
      </Button>
    }
  />
);

export default Page;
