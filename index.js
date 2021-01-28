const config = require("./config.json");
const fs = require("fs");
const path = require("path");
const {
  get,
  csv,
  lagesoFix,
  latestPredictions,
  merge,
  lagesoCsv,
  setupAWS,
  uploadAWS,
  websiteCsv
} = require("./lib/util");

async function main() {
  if (!("LAGESO" in process.env) || !("FLUSSHYGIENE_API_HOST" in process.env)) {
    throw Error(
      "LAGESO and FLUSSHYGIENE_API_HOST are required as environmental variable"
    );
  }

  const s3 = setupAWS();

  Promise.all([
    get(process.env.LAGESO, 'latin1')
      .then((data) => csv(lagesoFix(data), ";")),
    Promise.all(
      config.predictions.map((id) =>
        get(
          `${process.env.FLUSSHYGIENE_API_HOST}/api/v1/public/bathingspots/${id[0]}/predictions`
        ).then((body) => JSON.parse(body))
      )
    )
  ])
  .then((data) => {
    const predictions = latestPredictions(data[1], config.predictions);
    const newData = merge(data[0], predictions);
    return Promise.all([
      uploadAWS(
        s3,
        Buffer.from(lagesoCsv(newData)),
        'app/letzte.csv'
      ),
      uploadAWS(
        s3,
        Buffer.from(websiteCsv(newData, config)),
        'app/data.csv'
      ),
    ]);
  })
  .then(() => {
    // HIP HIP HORRAY
  })
  .catch((err) => {
    throw err;
  });
  
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});