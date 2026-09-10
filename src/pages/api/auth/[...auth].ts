import { Auth } from "@auth/core";
import authConfig from "../../../../auth.config.mjs";

const handler = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  url.protocol = "https:";
  return await Auth(new Request(url, request), authConfig);
};

export const GET = handler;
export const POST = handler;