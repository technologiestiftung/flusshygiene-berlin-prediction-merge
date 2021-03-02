const util = require("./util");
const { showdown, merge, csv, lagesoFix, latestPredictions } = util;
const {
  lagesoRawCSVData,
  config,
  createLagesoData,
} = require("../__tests-fixtures/common");
describe("merge tests", () => {
  test("function merge with predictions", async () => {
    const data = await csv(lagesoFix(lagesoRawCSVData), ";");
    const predictions = latestPredictions(
      [
        {
          success: true,
          data: [
            {
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
            },
          ],
        },
      ],
      config.predictions
    );
    expect(merge([], {})).toEqual([]);
    expect(merge(data, predictions)).toMatchInlineSnapshot(`
      Array [
        Object {
          "Algen": "",
          "BSL": "B336",
          "BadName": "Radfahrerwiese",
          "BadestelleLink": "\\"Radfahrerwiese(Link zur Badestelle Radfahrerwiese)\\":/lageso/gesundheit/gesundheitsschutz/badegewaesser/badestellen/artikel.344357.php",
          "Bezirk": "Steglitz-Zehlendorf",
          "Dat": "15.09.2020",
          "Eco": "<15",
          "Ente": "<15",
          "Farb_ID": "1",
          "Farbe": "gruen.jpg",
          "Latitude": "52.45861200",
          "Longitude": "13.18963400",
          "PDFLink": "\\"Alle Probeentnamen der aktuellen Saison fÿr diese Badestelle(Link zur PDF-Datei mit allen Probeentnamen der aktuellen Saison)\\":http://ftp.berlinonline.de/lageso/baden/bad35.pdf",
          "Profil": "Unterhavel",
          "ProfilLink": "\\"Unterhavel - Radfahrerwiese(Link zum Badegewÿsserprofil Unterhavel Radfahrerwiese)\\":/lageso/gesundheit/gesundheitsschutz/badegewaesser/badegewaesserprofile/artikel.339135.php",
          "PrognoseLink": "",
          "RSS_Name": "Radfahrerwiese / Unterhavel",
          "Sicht": "110",
          "Temp": "20,2",
          "Wasserqualitaet": "1",
          "cb": "<300",
          "id": "344357",
          "id2": "339135",
        },
        Object {
          "Algen": "",
          "BSL": "B331",
          "BadName": "Lieper Bucht",
          "BadestelleLink": "\\"Lieper Bucht(Link zur Badestelle Lieper Bucht)\\":/lageso/gesundheit/gesundheitsschutz/badegewaesser/badestellen/artikel.344358.php",
          "Bezirk": "Steglitz-Zehlendorf",
          "Dat": "15.09.2020",
          "Eco": "<15",
          "Ente": "<15",
          "Farb_ID": "12",
          "Farbe": "gruen_a_prog.jpg",
          "Latitude": "52.46933200",
          "Longitude": "13.19672100",
          "PDFLink": "\\"Alle Probeentnamen der aktuellen Saison fÿr diese Badestelle(Link zur PDF-Datei mit allen Probeentnamen der aktuellen Saison)\\":http://ftp.berlinonline.de/lageso/baden/bad34.pdf",
          "Profil": "Unterhavel",
          "ProfilLink": "\\"Unterhavel - Lieper Bucht(Link zum Badegewÿsserprofil Unterhavel Lieper Bucht)\\":/lageso/gesundheit/gesundheitsschutz/badegewaesser/badegewaesserprofile/artikel.339132.php",
          "PrognoseLink": "\\"Erklÿrung zum Frÿhwarnsystem(Link zur Erklÿrung zum Frÿhwarnsystem)\\":http://www.berlin.de/lageso/gesundheit/gesundheitsschutz/badegewaesser/fruehwarnsystem-unterhavel/index.php /",
          "RSS_Name": "Lieper Bucht / Unterhavel",
          "Sicht": "90",
          "Temp": "20,3",
          "Wasserqualitaet": "12",
          "cb": "<300",
          "id": "344358",
          "id2": "339132",
        },
      ]
    `);
  });

  test("merge lageso is worse then prediction", () => {
    // @sebastian-meier I could use your help on understanding
    // this merge function
    const predictions = { 344350: ["mangelhaft", "2021-03-02T04:02:35.868Z"] };
    jest.spyOn(util, "showdown").mockImplementation(() => 11);

    const data = createLagesoData("12");
    const res = merge(data, predictions);
    expect(res[0]["Dat_predict"]).toBe(predictions["344350"][1]);
    expect(res[0]["Wasserqualitaet_predict"]).toBe(predictions["344350"][0]);
    expect(res[0]["Wasserqualitaet_lageso"]).toBe(12);
  });
});

describe.each([
  [1, "mangelhaft", 13],
  [2, "mangelhaft", 14],
  [3, "mangelhaft", 13],
  [4, "mangelhaft", 14],
  [5, "mangelhaft", 15],
  [6, "mangelhaft", 16],
  [13, "mangelhaft", 13],
  [14, "mangelhaft", 14],
  [15, "mangelhaft", 15],
  [16, "mangelhaft", 16],

  [7, "mangelhaft", 13],
  [8, "mangelhaft", 13],
  [9, "mangelhaft", 13],
  [10, "mangelhaft", 13],
  [11, "mangelhaft", 13],
  [12, "mangelhaft", 14],
  [1, "gut", 11],
  [2, "gut", 12],
  [3, "gut", 13],
  [4, "gut", 14],
  [5, "gut", 15],
  [6, "gut", 16],

  // [3, "mangelhaft", 13],
  // [13, "mangelhaft", 13],
  // [4, "mangelhaft", 4],
  // [14, "mangelhaft", 14],
  // [5, "mangelhaft", 5],
  // [6, "mangelhaft", 6],
  // [15, "mangelhaft", 15],
  // [16, "mangelhaft", 16],
])(".showdown(%i, undefined, %s)", (num, str, expected) => {
  test(`.showdown(${num}, undefined, ${str}) returns ${expected}`, () => {
    expect(showdown(num, undefined, str)).toBe(expected);
  });
});
