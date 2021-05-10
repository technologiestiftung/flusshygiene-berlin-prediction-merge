const { S3 } = require("aws-sdk");
const { setupAWS, uploadAWS } = require("./util");
jest.mock(
  "aws-sdk"
  // , () => {
  // return {
  //   S3: jest.fn(() => {
  //     return {
  //       upload: jest.fn().mockReturnThis(),
  //       // promise: jest.fn(),
  //       promise: jest.fn().mockResolvedValue({
  //         ETag: "mock-etag",
  //         Location: "mock-location",
  //       }),
  //     };
  //   }),
  // };
  // }
);

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("AWS SDK tests", () => {
  test("setup aws client", () => {
    expect(typeof setupAWS()).toBe("object");
  });

  test("upload to AWS ", async () => {
    process.env.S3_BUCKET = "";
    // @ts-ignore
    S3.mockImplementation(() => {
      return {
        upload: jest.fn().mockReturnThis(),
        promise: jest.fn().mockResolvedValue({
          ETag: "mock-etag",
          Location: "mock-location",
        }),
      };
    });
    const s3 = setupAWS();
    // @ts-ignore
    // s3.mockImplementation(() => {
    //   return { upload: jest.fn() };
    // });
    const buffer = Buffer.from(JSON.stringify({}));
    await uploadAWS(s3, buffer, "test/test.csv");
    expect(s3.upload).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(s3.promise).toHaveBeenCalledTimes(1);
    expect(s3.upload).toHaveBeenCalledWith({
      Bucket: "",
      Body: buffer,
      Key: "test/test.csv",
    });
    process.env.S3_BUCKET = undefined;
  });

  test("missing env variable S3_BUCKET", async () => {
    delete process.env.S3_BUCKET;
    jest.spyOn(console, "error").mockImplementation(jest.fn());
    S3.mockImplementation(() => {
      return {
        upload: jest.fn().mockReturnThis(),
        promise: jest.fn().mockResolvedValue({
          ETag: "mock-etag",
          Location: "mock-location",
        }),
      };
    });
    const s3 = setupAWS();
    const buffer = Buffer.from(JSON.stringify({}));
    await expect(uploadAWS(s3, buffer, "test/test.csv")).rejects.toThrow();
  });
});
