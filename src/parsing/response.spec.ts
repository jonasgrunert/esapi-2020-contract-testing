import { asyncStringify } from "./response";

describe("Testing Stringifying promises", () => {
  test("Expecting the resolved Promise to be returned", async () => {
    expect(
      await asyncStringify(
        new Promise(res => setTimeout(() => res("Resolved"), 100))
      )
    ).toBe('"Resolved"');
  });
  test("Expecting the String to be returned", async () => {
    expect(await asyncStringify("Resolved")).toBe('"Resolved"');
  });
  test("Expecting the object to be returned with resolved promises", async () => {
    expect(
      await asyncStringify({
        prom: new Promise(res => setTimeout(() => res("Resolved"), 100))
      })
    ).toBe('{"prom":"Resolved"}');
  });
  test("Expecting the object to be returned with intact values", async () => {
    expect(
      await asyncStringify({
        prom: "Resolved"
      })
    ).toBe('{"prom":"Resolved"}');
  });
  test("Expecting the object to be returned with resolved promise and intact keys", async () => {
    expect(
      await asyncStringify({
        noprom: "Noprom",
        prom: new Promise(res => setTimeout(() => res("Resolved"), 100))
      })
    ).toBe('{"noprom":"Noprom","prom":"Resolved"}');
  });
  test("Expecting the object to be returned with resolved nested promise and intact keys", async () => {
    expect(
      await asyncStringify({
        noprom: "Noprom",
        prom: {
          nested: new Promise(res => setTimeout(() => res("Resolved"), 100))
        }
      })
    ).toBe('{"noprom":"Noprom","prom":{"nested":"Resolved"}}');
  });
  test("Expecting the object to be returned with resolved promise with nested object", async () => {
    expect(
      await asyncStringify({
        noprom: "Noprom",
        prom: new Promise(res =>
          setTimeout(() => res({ nested: "Resolved" }), 100)
        )
      })
    ).toBe('{"noprom":"Noprom","prom":{"nested":"Resolved"}}');
  });
  test("Expecting the object to be returned with resolved promise array", async () => {
    expect(
      await asyncStringify({
        noprom: "Noprom",
        prom: Promise.all([
          new Promise(res => setTimeout(() => res("Resolved"), 100)),
          new Promise(res => setTimeout(() => res("Resolved"), 100))
        ])
      })
    ).toBe('{"noprom":"Noprom","prom":["Resolved","Resolved"]}');
  });
  test("Expecting the object to be returned with resolved promise from a resolved promise", async () => {
    expect(
      await asyncStringify({
        noprom: "Noprom",
        prom: Promise.all([
          new Promise(res =>
            setTimeout(
              () => res(new Promise(r => setTimeout(() => r("Resolved"), 100))),
              100
            )
          ),
          new Promise(res => setTimeout(() => res("Resolved"), 100))
        ])
      })
    ).toBe('{"noprom":"Noprom","prom":["Resolved","Resolved"]}');
  });
  test("Expecting the object to be returned with resolved promise from a nested resolved promise", async () => {
    expect(
      await asyncStringify({
        noprom: "Noprom",
        prom: new Promise(res =>
          setTimeout(
            () =>
              res({
                nested: new Promise(r => setTimeout(() => r("Resolved"), 100))
              }),
            100
          )
        )
      })
    ).toBe('{"noprom":"Noprom","prom":{"nested":"Resolved"}}');
  });
  test("Expecting correct parsing of primary level undefined", async () => {
    expect(await asyncStringify(undefined)).toBe("Missing property");
  });
  test("Expecting correct parsing of a Promise resolving undefined", async () => {
    expect(await asyncStringify(new Promise(res => res(undefined)))).toBe(
      "Missing property"
    );
  });
  test("Expecting the object to be returned with undefined replavement value", async () => {
    expect(
      await asyncStringify({
        prom: undefined
      })
    ).toBe('{"prom":"Missing property"}');
  });
  test("Expecting correct parsing of primary level null", async () => {
    expect(await asyncStringify(null)).toBe("No value");
  });
  test("Expecting correct parsing of a Promise resolving null", async () => {
    expect(await asyncStringify(new Promise(res => res(null)))).toBe(
      "No value"
    );
  });
  test("Expecting the object to be returned with null replavement value", async () => {
    expect(
      await asyncStringify({
        prom: null
      })
    ).toBe('{"prom":"No value"}');
  });
});

describe("Testing correct header setting", () => {});
