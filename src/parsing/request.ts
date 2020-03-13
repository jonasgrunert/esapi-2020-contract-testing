import { Context, HttpRequest } from "@azure/functions";
import Axios, { AxiosInstance } from "axios";

export function parseParameters(
  ctx: Context,
  keys: string[],
  forceKey: boolean = false
): { [key in typeof keys[number]]: unknown } {
  return Object.fromEntries(
    keys.map(k => {
      if ((forceKey && ctx[k] === undefined) || ctx[k] === null)
        throw {
          status: 400,
          message: `No URL path parameter named ${k} found.`
        };
      return [k, ctx[k]];
    })
  );
}

export async function getApiToken(req: HttpRequest): Promise<string> {
  if (req.headers.Authorization === undefined)
    throw { status: 401, message: "No API token provided." };
  const token = await Axios.post("https://accounts.spotify.com/api/token", {
    data: {
      grant_type: "authorization_code",
      code: req.headers.Authorization,
      redirect_uri:
        process.env.REDIRECT_URI || "http://localhost:3000/auth/callback",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    }
  });
  if (token.status !== 200) throw { status: 401, message: "Not able to login" };
  return token.data.access_token;
}

export async function getApiClient(req: HttpRequest): Promise<AxiosInstance> {
  return Axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: {
      Authorization: `Bearer ${await getApiToken(req)}`
    }
  });
}
