import { AsyncLocalStorage } from "node:async_hooks";

import { registerVersionContext } from "./genomics";

type VersionContext = { version?: string };

export const versionStorage = new AsyncLocalStorage<VersionContext>();

registerVersionContext(() => versionStorage.getStore());