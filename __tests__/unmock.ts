import unmock, { Service, u } from "unmock";
import { getApiToken } from "../src/parsing/request";
import { httpTrigger } from "../playlists";

let spotify: Service;
let oauth: Service;

unmock
  .nock("https://api.spotify.com/v1", "spotify")
  .get("/me/playlists")
  .reply(200, {
    items: [
      {
        id: u.string("random.uuid"),
        name: u.string("random.words"),
        owner: {
          display_name: u.string("name.findName")
        }
      }
    ]
  });

unmock
  .nock("https://accounts.spotify.com", "oauth")
  .post("/api/token")
  .reply(200, { access_token: "this-is-a-token" });

beforeAll(() => {
  const mock = unmock.on().services;
  spotify = mock.spotify;
  oauth = mock.oauth;
});
beforeEach(() => {
  if (spotify) spotify.reset();
  if (oauth) oauth.reset();
});
afterEach(() => {
  if (spotify) spotify.spy.resetHistory();
  if (oauth) oauth.spy.resetHistory();
});
//afterAll(unmock.off);

describe("Mock testing Spotify API", () => {
  it("Get a proper ApiToken", async () => {
    expect(
      await getApiToken({
        method: "GET",
        url: "url",
        headers: { Authorization: "this-is-my-token" },
        query: {},
        params: {}
      })
    ).toBe("this-is-a-token");
  });
});
