import { useAuthState } from "@/models/auth/state";
import { logUtil } from "@/utils/logUtil";
import { Navigate, Outlet, useRouteProps } from "@umijs/max";
import { useMemo } from "react";

export default () => {
  const routeProps = useRouteProps();
  const authState = useAuthState();
  const haveAccess = useMemo(() => {
    return authState.access[routeProps.access] || authState.access[routeProps.name];
  }, [routeProps.access, routeProps.name, authState.access]);
  if (!authState.account) {
    logUtil.info(`[wrappers auth] not login. ${routeProps.name}`);
    return <Navigate to='/login' replace />;
  }
  // 没设置name的页面不限制权限
  if (routeProps.name === undefined && !haveAccess) {
    return <Outlet />;
  }
  if (!haveAccess) {
    logUtil.info(`[wrappers auth] no access to ${routeProps.name}.`);
    return <Navigate to='/403' replace />;
  }
  return <Outlet />;
};
