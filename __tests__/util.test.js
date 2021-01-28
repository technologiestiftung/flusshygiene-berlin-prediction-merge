const http = require("http");
const https = require("https");
const nock = require("nock");
const { get, lagesoFix, csv } = require("../lib/util");

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});
describe("Utility function unit tests", () => {
  test("get function", async () => {
    const httpSpy = jest.spyOn(http, "get");
    nock("http://example.com").get("/").reply(200, "hello world");
    const res = await get("http://example.com");

    expect(typeof res).toBe("string");
    expect(res).toBe("hello world");
    expect(httpSpy).toHaveBeenCalledTimes(1);
  });
  test("get function http vs https", async () => {
    const httpSpy = jest.spyOn(http, "get");
    const httpsSpy = jest.spyOn(https, "get");
    nock("http://example.com").get("/").reply(200, "hello world");
    await get("http://example.com");
    expect(httpSpy).toHaveBeenCalledTimes(1);
    expect(httpsSpy).not.toHaveBeenCalled();
    nock("https://example.com").get("/").reply(200, "hello world");
    await get("https://example.com");
    expect(httpSpy).toHaveBeenCalledTimes(1);
    expect(httpsSpy).toHaveBeenCalledTimes(1);
  });

  test("lagesoFix function", () => {
    expect(lagesoFix(`"a"""a"`)).toBe('"a"a"');
    expect(lagesoFix(`"""""`)).toBe('"""');
    expect(lagesoFix('""""')).toBe('""');
    expect(lagesoFix('""""""')).toBe('""');
  });

  test("csv function", async () => {
    const res = await csv(
      `a;b;c
      1;2;3

      4;5;6
      `,
      ";"
    );
    expect(res).toEqual([
      { a: "1", b: "2", c: "3" },
      { a: "4", b: "5", c: "6" },
    ]);
  });
});
