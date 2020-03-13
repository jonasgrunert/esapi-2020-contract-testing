import { Context, HttpRequest, AzureFunction } from "@azure/functions";

export async function asyncStringify(promise: unknown): Promise<string> {
  if (typeof promise === "undefined") return JSON.stringify(undefined);
  if (promise === null) return JSON.stringify(null);
  if (typeof promise !== "object") {
    return JSON.stringify(promise);
  }

  const map: Promise<any>[] = [];
  // This replaces every promise with ::$idx:: and writes the promise into the map
  let t: string = JSON.stringify(promise, (key, value) => {
    if (typeof value === "undefined") return undefined;
    if (value === null) return null;
    if (typeof value.then === "function") {
      const idx = map.length;
      map.push(Promise.resolve(value));
      return `::$${idx}::`;
    }
    return value;
  });
  const res = await Promise.all(map);
  let idx = 0;
  for (const v of res) {
    t = t.replace(`"::$${idx}::"`, await asyncStringify(v));
    idx++;
  }
  return t;
}

function requestWrapper(
  func: (
    c: Context,
    h: HttpRequest
  ) => Promise<{ status?: number; data?: object | string }>
): AzureFunction {
  return async function(c, h) {
    try {
      const res = await func(c, h);
      const body = res.data ? await asyncStringify(res.data) : "Ok";
      c.res = {
        status: res.status || 200,
        headers: {
          "Content-Type":
            typeof res.data === "object" ? "application/json" : "text/plain"
        },
        body
      };
    } catch (e) {
      c.res = {
        headers: {
          "Content-Type": "application/json"
        },
        status: e.status ? e.status : 500,
        body: e.status ? e.message : JSON.stringify(e)
      };
    }
  };
}

export default requestWrapper;
