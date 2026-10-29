import { useEffect, useState } from "react";

import { cn } from "@/utils/classname";
import { getCookie, VERSION_COOKIE_NAME } from "@/utils/cookie";
import genomicsService from "@/utils/services/genomics";

type NoticeState = {
  viewingVersion: string;
  selectedVersion: string;
} | null;

const fallbackVersion = (versions: { name: string; isDefault?: boolean }[]) =>
  versions.find((version) => version.isDefault)?.name ?? versions[0]?.name;

/**
 * Explains the difference between a shared-link viewing override and the
 * user's saved selection.
 */
export default function VersionOverrideNotice({
  className,
}: {
  className?: string;
}) {
  const [notice, setNotice] = useState<NoticeState>(null);

  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return;

    const requestedVersion = new URL(window.location.href).searchParams.get(
      "version",
    );
    if (!requestedVersion) return;

    let cancelled = false;
    const load = async () => {
      try {
        const { fetchPublicVersions } = genomicsService();
        const versions = await fetchPublicVersions();
        if (cancelled || !versions.some((v) => v.name === requestedVersion))
          return;

        const defaultVersion = fallbackVersion(versions);
        if (!defaultVersion) return;
        const cookieVersion = getCookie(VERSION_COOKIE_NAME);
        const selectedVersion = versions.some((v) => v.name === cookieVersion)
          ? (cookieVersion as string)
          : defaultVersion;

        if (requestedVersion !== selectedVersion) {
          setNotice({ viewingVersion: requestedVersion, selectedVersion });
        }
      } catch {
        // The page can still render using its server-resolved version; omit a
        // potentially misleading notice if the validation request fails.
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!notice) return null;

  const navigateWithoutOverride = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("version");
    window.location.assign(`${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <section
      className={cn(
        "mb-6 flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      role="status"
    >
      <p>
        You are viewing version <strong>{notice.viewingVersion}</strong> from a
        shared link. Your selected version is{" "}
        <strong>{notice.selectedVersion}</strong>.
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={navigateWithoutOverride}
          className="rounded-md px-3 py-1.5 font-medium text-amber-900 hover:bg-amber-100 -mr-0.5"
        >
          Return to {notice.selectedVersion}
        </button>
      </div>
    </section>
  );
}
