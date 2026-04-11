import { apiFetch } from "@/utils/apiFetch";

/* Fixed token to test for now, will remove later in favor of useService() that apply token from session automatically */
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxvdWxvdWRpIn0.xDl3GuKVz743m9Cmit_ME4dzr91bIaJiC-2ExUNwK0c";

type VersionInput = {
  name: string;
};

type VersionResult = {
  ID: number;
  Name: string;
};

const genomicsService = (fetch: typeof apiFetch = apiFetch) => {
  const createVersion = async (versionInput: VersionInput) => {
    return await fetch<VersionResult>("genomics", "/versions", {
      method: "POST",
      authorization: `Bearer ${ACCESS_TOKEN}`,
      body: {
        ...versionInput,
      },
    });
  };

  return {
    createVersion,
  };
};

export default genomicsService;
