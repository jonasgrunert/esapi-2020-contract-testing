import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { parseParameters, getApiClient } from "../src/parsing/request";
import requestWrapper from "../src/parsing/response";

interface Playlist {
  id: string;
  name: string;
  user?: string;
}

interface PlaylistDetail {
  info: Playlist;
  tracks: {
    id: string;
    name: string;
    artist?: string;
  };
}

export async function httpTrigger(
  context: Context,
  req: HttpRequest
): Promise<{ data: PlaylistDetail | Playlist[] }> {
  const { playlistId } = parseParameters(context, ["playlistId"]);
  const client = await getApiClient(req);
  if (playlistId) {
    const res = await client.get(`/playlists/${playlistId}`);
    if (res.status !== 200) {
      throw { status: 404 };
    }
    return {
      data: {
        info: {
          id: res.data.id,
          name: res.data.name,
          user: res.data.owner?.display_name
        },
        tracks: res.data.tracks.map(({ track }) => ({
          id: track.id,
          name: track.name,
          artists: track.artist?.map(({ name }) => name).join(" & ")
        }))
      }
    };
  }
  const res = await client.get("/me/playlists");
  if (res.status !== 200) {
    throw { status: 404 };
  }
  return {
    data: res.data.items
      .filter(({ collaborative }) => collaborative)
      .map(list => ({
        id: list.id,
        name: list.name,
        user: list.owner?.display_name
      }))
  };
}

export default requestWrapper(httpTrigger);
