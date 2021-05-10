//@ts-check
const http = require("http");
const https = require("https");
const nock = require("nock");
const path = require("path");
const fs = require("fs");
const {
  get,
  lagesoFix,
  lagesoCsv,
  websiteCsv,
  csv,
  latestPredictions,
  merge,
} = require("./util");
const { lagesoRawCSVData, config } = require("../__tests-fixtures/common");

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
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

  test("latestPredictions function", () => {
    const today = new Date().toISOString();
    const predictions = {
      success: true,
      data: [
        {
          id: 680,
          createdAt: "2021-01-21T18:29:36.893Z",
          updatedAt: "2021-01-21T18:29:36.899Z",
          percentile2_5: 0,
          percentile50: null,
          percentile90: null,
          percentile95: null,
          percentile97_5: null,
          credibleInterval2_5: null,
          credibleInterval97_5: null,
          oldId: null,
          date: "2021-01-21T00:00:00.000Z",
          prediction: "mangelhaft",
        },
        {
          id: 692,
          createdAt: "2021-01-29T04:08:11.842Z",
          updatedAt: "2021-01-29T04:08:11.845Z",
          percentile2_5: 0,
          percentile50: null,
          percentile90: null,
          percentile95: null,
          percentile97_5: null,
          credibleInterval2_5: null,
          credibleInterval97_5: null,
          oldId: null,
          date: "2021-01-29T00:00:00.000Z",
          prediction: "mangelhaft",
        },
        {
          id: 710,
          createdAt: today,
          updatedAt: "2021-02-04T04:02:29.583Z",
          percentile2_5: 0,
          percentile50: null,
          percentile90: null,
          percentile95: null,
          percentile97_5: null,
          credibleInterval2_5: null,
          credibleInterval97_5: null,
          oldId: null,
          date: "2021-02-04T00:00:00.000Z",
          prediction: "mangelhaft",
        },
      ],
    };

    const latest = latestPredictions([predictions], config.predictions);
    expect(latest[config.predictions[0][1]][1]).toBe(today);
  });

  test("latestPredictions function empty result", () => {
    const beforeYesterday = new Date();
    beforeYesterday.setDate(beforeYesterday.getDate() - 2); // if older then one day it should be empty

    const predictions = {
      success: true,
      data: [
        {
          id: 680,
          createdAt: "2021-01-21T18:29:36.893Z",
          updatedAt: "2021-01-21T18:29:36.899Z",
          percentile2_5: 0,
          percentile50: null,
          percentile90: null,
          percentile95: null,
          percentile97_5: null,
          credibleInterval2_5: null,
          credibleInterval97_5: null,
          oldId: null,
          date: "2021-01-21T00:00:00.000Z",
          prediction: "mangelhaft",
        },
        {
          id: 692,
          createdAt: "2021-01-29T04:08:11.842Z",
          updatedAt: "2021-01-29T04:08:11.845Z",
          percentile2_5: 0,
          percentile50: null,
          percentile90: null,
          percentile95: null,
          percentile97_5: null,
          credibleInterval2_5: null,
          credibleInterval97_5: null,
          oldId: null,
          date: "2021-01-29T00:00:00.000Z",
          prediction: "mangelhaft",
        },
        {
          id: 710,
          createdAt: beforeYesterday,
          updatedAt: "2021-02-04T04:02:29.583Z",
          percentile2_5: 0,
          percentile50: null,
          percentile90: null,
          percentile95: null,
          percentile97_5: null,
          credibleInterval2_5: null,
          credibleInterval97_5: null,
          oldId: null,
          date: "202mk1-02-04T00:00:00.000Z",
          prediction: "mangelhaft",
        },
      ],
    };

    const empty = latestPredictions([predictions], config.predictions);
    expect(empty).toEqual({});
  });

  test("function lagesoCSV", async () => {
    const data = await csv(lagesoFix(lagesoRawCSVData), ";");
    const prediction = {
      id: 680,
      createdAt: "2021-01-21T18:29:36.899Z",
      updatedAt: "2021-01-21T18:29:36.899Z",
      percentile2_5: 0,
      percentile50: null,
      percentile90: null,
      percentile95: null,
      percentile97_5: null,
      credibleInterval2_5: null,
      credibleInterval97_5: null,
      oldId: null,
      date: "2021-01-21T00:00:00.000Z",
      prediction: "mangelhaft",
    };
    const csvString = lagesoCsv(merge(data, prediction));
    expect(csvString).toMatchInlineSnapshot(`
      "BadName;Bezirk;Profil;RSS_Name;Latitude;Longitude;ProfilLink;BadestelleLink;Dat;Sicht;Eco;Ente;Farbe;BSL;Algen;Wasserqualitaet;cb;Temp;PDFLink;PrognoseLink;Farb_ID;Wasserqualitaet_lageso;Wasserqualitaet_predict;Dat_predict
      Radfahrerwiese;Steglitz-Zehlendorf;Unterhavel;Radfahrerwiese / Unterhavel;52.45861200;13.18963400;\\"\\"\\"\\"Unterhavel - Radfahrerwiese(Link zum Badegewÿsserprofil Unterhavel Radfahrerwiese)\\"\\"\\"\\":/lageso/gesundheit/gesundheitsschutz/badegewaesser/badegewaesserprofile/artikel.339135.php;\\"\\"\\"\\"Radfahrerwiese(Link zur Badestelle Radfahrerwiese)\\"\\"\\"\\":/lageso/gesundheit/gesundheitsschutz/badegewaesser/badestellen/artikel.344357.php;15.09.2020;110;<15;<15;gruen.jpg;B336;;1;<300;20,2;\\"\\"\\"\\"Alle Probeentnamen der aktuellen Saison fÿr diese Badestelle(Link zur PDF-Datei mit allen Probeentnamen der aktuellen Saison)\\"\\"\\"\\":http://ftp.berlinonline.de/lageso/baden/bad35.pdf;;1;;;
      Lieper Bucht;Steglitz-Zehlendorf;Unterhavel;Lieper Bucht / Unterhavel;52.46933200;13.19672100;\\"\\"\\"\\"Unterhavel - Lieper Bucht(Link zum Badegewÿsserprofil Unterhavel Lieper Bucht)\\"\\"\\"\\":/lageso/gesundheit/gesundheitsschutz/badegewaesser/badegewaesserprofile/artikel.339132.php;\\"\\"\\"\\"Lieper Bucht(Link zur Badestelle Lieper Bucht)\\"\\"\\"\\":/lageso/gesundheit/gesundheitsschutz/badegewaesser/badestellen/artikel.344358.php;15.09.2020;90;<15;<15;gruen_a_prog.jpg;B331;;12;<300;20,3;\\"\\"\\"\\"Alle Probeentnamen der aktuellen Saison fÿr diese Badestelle(Link zur PDF-Datei mit allen Probeentnamen der aktuellen Saison)\\"\\"\\"\\":http://ftp.berlinonline.de/lageso/baden/bad34.pdf;\\"\\"\\"\\"Erklÿrung zum Frÿhwarnsystem(Link zur Erklÿrung zum Frÿhwarnsystem)\\"\\"\\"\\":http://www.berlin.de/lageso/gesundheit/gesundheitsschutz/badegewaesser/fruehwarnsystem-unterhavel/index.php /;12;;;"
    `);
  });
  test("function websiteCsv", async () => {
    const data = await csv(lagesoFix(lagesoRawCSVData), ";");
    const prediction = {
      id: 680,
      createdAt: "2021-01-21T18:29:36.899Z",
      updatedAt: "2021-01-21T18:29:36.899Z",
      percentile2_5: 0,
      percentile50: null,
      percentile90: null,
      percentile95: null,
      percentile97_5: null,
      credibleInterval2_5: null,
      credibleInterval97_5: null,
      oldId: null,
      date: "2021-01-21T00:00:00.000Z",
      prediction: "mangelhaft",
    };
    const csvString = websiteCsv(merge(data, prediction), config);
    expect(csvString).toMatchInlineSnapshot(`
      "id,detail_id,detail_id2,predict_id,color,prediction,p_date,wasserqualitaet,sicht_txt,eco_txt,ente_txt,temp_txt,algen_txt,cb_txt,state,m_date,real_state
      ,344357,339135,,green,,,1,110,<15,<15,\\"20,2\\",,<300,1,15.09.2020,1
      42,344358,339132,56,green,,,12,90,<15,<15,\\"20,3\\",,<300,12,15.09.2020,12"
    `);
  });
});
