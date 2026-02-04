import type { DefaultSession } from "@auth/core/types";
import { signOut } from "auth-astro/client";

import { Button } from "@/components/ui/button";

type DashboardProps = {
  session: DefaultSession;
};

const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  return (
    <>
      <span className="status-pill authenticated">Authenticated</span>
      <h1>Admin Dashboard</h1>
      <p>Welcome back, {session.user?.name || session.user?.email}</p>

      <div className="user-info">
        <strong>Session Data:</strong>
        <pre
          style={{ fontSize: "0.8rem", overflowX: "auto", marginTop: "0.5rem" }}
        >
          {JSON.stringify(session.user, null, 2)}
        </pre>
      </div>

      <div className="admin-feature">
        <h2>Admin Functionality</h2>
        <p>You now have access to administrative tools.</p>
        <Button
          onClick={() => {
            signOut().then(() => {
              window.location.href = "/";
            });
          }}
        >
          Logout
        </Button>
      </div>
    </>
  );
};

export default Dashboard;
