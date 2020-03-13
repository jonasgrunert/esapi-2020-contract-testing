import { eachLike } from "pact/src/dsl/matchers";
import { pactWith } from "jest-pact";
import Axios from "axios";

pactWith(
  {
    consumer: "Collabify Web App",
    provider: "Collabify API",
    port: 1234
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
      it("Get all playlists frontend test", async () => {
        expect(
          await Axios.get("http://localhost:1234/playlists").then(c =>
            Array.isArray(c.data)
          )
        ).toBeTruthy();
      });
    });
  }
);
