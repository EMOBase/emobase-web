import { create } from "zustand";
import {
  setCookie,
  getCookie,
  VERSION_COOKIE_NAME,
} from "@/utils/cookie";

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
      setCookie(VERSION_COOKIE_NAME, version);
    } else {
      clearCookie(VERSION_COOKIE_NAME);
    }
  },
  hydrateFromCookie: () => {
    const cookieVersion = getCookie(VERSION_COOKIE_NAME);
    if (cookieVersion) {
      set({ selectedVersion: cookieVersion });
    }
  },
}));
