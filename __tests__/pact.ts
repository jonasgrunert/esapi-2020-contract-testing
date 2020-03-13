import { eachLike } from "pact/src/dsl/matchers";
import { pactWith } from "jest-pact";

pactWith(
  {
    consumer: "Collabify Web App",
    provider: "Collabify API"
  },
  provider => {
    describe("Getting all playlists from the API", () => {
      beforeEach(() =>
        provider.addInteraction({
          state: "There are playlists",
          uponReceiving: "a request to display playlists",
          withRequest: {
            path: "/playlists",
            method: "GET"
          },
          willRespondWith: {
            status: 200,
            body: eachLike({
              id: "uuid-2se",
              name: "Example Track",
              user: "M. Mustermensch"
            }),
            headers: {
              "Content-Type": "application/json"
            }
          }
        })
      );
    });
    it("Get all playlists", () => {
      expect(1).toBe(1);
    });
  }
);
