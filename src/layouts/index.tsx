import { useAuthState } from "@/models/auth/state";
import { Outlet } from "@umijs/max";

export default function () {
  const authState = useAuthState();

  return !authState.account ? null : (
    <div
      style={{
        background: "#F5F7FA",
      }}
    >
      <Outlet />
    </div>
  );
}
