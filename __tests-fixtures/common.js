const fs = require("fs");
const path = require("path");
const lagesoRawCSVData = fs.readFileSync(
  path.resolve(process.cwd(), "__tests-fixtures/lageso.csv"),
  "latin1"
);
const config = {
  predictions: [
    [56, 344358, 42],
    [57, 339135, 52],
    [58, 344350, 6],
    [59, 339129, 36],
    [60, 339131, 28],
  ],
};

/**
 *
 * @param {String} quality
 */
const createLagesoData = (quality) => {
  const data = [
    {
      BadestelleLink:
        '"Breitehorn(Link zur Badestelle Breitehorn)":/lageso/gesundheit/gesundheitsschutz/badegewaesser/badestellen/artikel.344350.php',
      Farbe: "gruen_a_prog.jpg",
      Farb_ID: "12",
      Wasserqualitaet: quality,
      ProfilLink:
        '"Unterhavel - Breitehorn(Link zum Badegewässerprofil Unterhavel Breithorn)":/lageso/gesundheit/gesundheitsschutz/badegewaesser/badegewaesserprofile/artikel.339130.php',
      // id: "344350",
      // id2: "339130",
    },
  ];
  return data;
};
module.exports = { lagesoRawCSVData, config, createLagesoData };
