import { create } from "zustand";
import { setCookie, getCookie } from "@/utils/cookie";

const COOKIE_NAME = "emobase-version";

const clearCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

interface VersionState {
  selectedVersion: string | null;
  setSelectedVersion: (version: string | null) => void;
  hydrateFromCookie: () => void;
}

export const useVersionStore = create<VersionState>()((set) => ({
  selectedVersion: null,
  setSelectedVersion: (version) => {
    set({ selectedVersion: version });
    if (version) {
      setCookie(COOKIE_NAME, version);
    } else {
      clearCookie(COOKIE_NAME);
    }
  },
  hydrateFromCookie: () => {
    const cookieVersion = getCookie(COOKIE_NAME);
    if (cookieVersion) {
      set({ selectedVersion: cookieVersion });
    }
  },
}));

export { COOKIE_NAME as VERSION_COOKIE_NAME };
