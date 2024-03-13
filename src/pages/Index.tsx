import { authActions } from "@/models/auth/action";
import { Spin } from "antd";
import { FC, useEffect } from "react";

const Index: FC = () => {
  useEffect(() => {
    authActions.goHome();
  }, []);
  return (
    <div className='loading-page-container'>
      <Spin />
    </div>
  );
};

export default Index;
