import { signIn } from "auth-astro/client";

import { Icon } from "@/components/ui/icon";

const AdminLogin = () => {
  return (
    <div className="bg-background-subtle text-text-main font-body antialiased min-h-screen flex items-center justify-center security-bg p-6">
      <div className="w-full max-w-[480px]">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden relative">
          <div className="h-1.5 mustard-gradient w-full"></div>
          <div className="p-10 md:p-12 text-center">
            <div className="flex flex-col items-center gap-4 mb-10">
              <div className="size-16 rounded-2xl mustard-gradient flex items-center justify-center shadow-xl shadow-orange-500/20 text-white">
                <Icon name="pest_control" className="text-3xl" />
              </div>
              <div>
                <h1 className="text-text-main text-3xl font-bold tracking-tight font-display">
                  iBeetle Base
                </h1>
                <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mt-1">
                  Administrative Gateway
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex justify-center mb-2">
                <div className="bg-orange-50 text-primary px-4 py-1 rounded-full flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    admin_panel_settings
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Restricted Access
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Administrator Access
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                This section is restricted to authorized personnel. Please sign
                in with your Keycloak account to continue to the dashboard.
              </p>
            </div>

            <button
              onClick={() => signIn("keycloak")}
              className="flex items-center justify-center gap-3 w-full mustard-gradient hover:brightness-110 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-orange-500/25 group cursor-pointer mb-2"
            >
              <span className="text-sm tracking-wider uppercase">
                Login with Keycloak
              </span>
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                lock
              </span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-slate-400">
          <a
            className="text-xs hover:text-primary transition-colors flex items-center gap-1"
            href="/"
          >
            <Icon name="arrow_back" className="text-sm" />
            Back to Public Site
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
