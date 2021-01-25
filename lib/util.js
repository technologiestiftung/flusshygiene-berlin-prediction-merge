// @ts-check
const https = require("https");
const http = require("http");
const parse = require("csv-parse");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

/**
 * @param {string} url
 * @param {BufferEncoding} _encoding
 */
const get = (url, _encoding) => {
  const encoding = _encoding || "utf8";
  return new Promise((resolve, reject) => {
    let protocol = https;
    if (url.substring(0, 5).toLowerCase() !== "https") {
      // @ts-ignore
      protocol = http;
    }
    protocol
      .get(url, (response) => {
        response.setEncoding(encoding)
        let body = "";
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => resolve(body));
      })
      .on("error", reject);
  });
}

/**
 * @param {string} string
 */
const lagesoFix = (string) => {
  return string.split('"""').join('\"');
}

/**
 * @param {string | Buffer} csvString
 * @param {string} delimiter
 * @param {string} _quote
 */
const csv = (csvString, delimiter, _quote) =>
  new Promise((resolve, reject) => {
    const quote = _quote || null;
    parse(
      csvString,
      {
        trim: true,
        skip_empty_lines: true,
        delimiter,
        columns: true,
        quote,
      },
      (err, output) => {
        if (err) {
          reject(err);
        } else {
          resolve(output);
        }
      }
    );
  });

/**
 * @param {object[]} predictions
 * @param {boolean} predictions[].success
 * @param {Object[]} predictions[].data
 * @param {string} predictions[].data[].createdAt
 * @param {string} predictions[].data[].prediction
 * @param {number[][]} config
 */
const latestPredictions = (predictions, config) => {
  predictions.forEach((p,  pi) => {
    p["config"] = config[pi];
  })

  // remove unsuccessfull queries
  // and queries with no predictions
  const successfull = predictions.filter((p) => p.success && p.data.length > 0);
  const rPredictions = {};
  const today = Date.now();

  successfull.forEach((p) => {
    // Sort predictions by data and get the latest
    // If the latest prediction is older than 1 day ignore
    p.data.forEach((d) => d["pDate"] = Date.parse(d.createdAt));
    p.data.sort((a, b) => b["pDate"] - a["pDate"]);
    const diff = (today - p.data[0]["pDate"])/1000/60/60;
    if (diff < 48) {
      rPredictions[p["config"][1]] = [p.data[0].prediction, p.data[0].createdAt];
    }
  });

  return rPredictions;
}

/**
 * @param {object} predictions
 * @param {object[]} data
 */
const merge = (data, predictions) => {
  data.forEach((d) => {
    const split = d.BadestelleLink.split(".");
    const id = split[split.length - 2];
    d['id'] = id;
    const split2 = d.ProfilLink.split(".");
    const id2 = split2[split2.length - 2];
    d['id2'] = id2;
    const state = d.Farbe.split('.')[0];
    const quality = parseNum(d.Wasserqualitaet);
    const algae = d.Algen;
    if (id in predictions) {
      d['Dat_predict'] = predictions[id][1];
      d['Wasserqualitaet_predict'] = predictions[id][0];
      d['Wasserqualitaet_lageso'] = quality;
      const result = showdown(quality, algae, predictions[id][0]);
      if (result != quality) {
        d.Wasserqualitaet = result;
        d.Farb_ID = result;
        d.Farbe = imageFromState(result);
      }
    }
  })
  return data;
}

/**
 * @param {number} lageso
 * @param {string} algae
 * @param {string} prediction
 */
const showdown = (lageso, algae, prediction) => {
  let newState = lageso;
  if (prediction === 'mangelhaft' && ![3,13,4,14,5,6,15,16].includes(lageso)) {
    if ([2,12].includes(lageso)) {
      // with algae
      newState = 14;
    } else {
      newState = 13;
    }
  } else {
    // even if we don't change it, the new id should indicate that there is a prediction:
    switch (lageso) {
      case 1: newState = 11; break;
      case 2: newState = 12; break;
      case 3: newState = 13; break;
      case 4: newState = 14; break;
      case 5: newState = 15; break;
      case 6: newState = 16; break;
    }
  }
  return newState;
}

/**
 * @param {number} _state
 */
const colorFromState = (_state) => {
  const state = parseInt(_state.toString());
  if ([1, 11, 2, 12].includes(state)) { return 'green'; }
  if ([3, 13, 4, 14, 10].includes(state)) { return 'orange'; }
  if ([5, 15, 6, 16].includes(state)) { return 'red'; }
  return 'grey';
}

/**
 * @param {number} state
 */
const imageFromState = (state) => {
  switch (state) {
    case 1:  return 'gruen.jpg'; break;
    case 11: return 'gruen_prog.jpg'; break;
    case 2:  return 'gruen_a.jpg'; break;
    case 12: return 'gruen_a_prog.jpg'; break;
    case 3:  return 'gelb.jpg'; break;
    case 13: return 'gelb_prog.jpg'; break;
    case 4:  return 'gelb_a.jpg'; break;
    case 14: return 'gelb_a_prog.jpg';
    case 5:  return 'rot.jpg'; break;
    case 15: return 'rot_prog.jpg'; break;
    case 6:  return 'rot_a.jpg'; break;
    case 16: return 'rot_a_prog.jpg'; break;
  }
}


/**
 * @param {string} str
 */
const parseNum = (str) => {
  if(str.length==0) return 0
  return parseInt((str.replace('>','')).replace('<','').replace(',', '.'))
}

/**
 * @param {Object[]} data
 */
const websiteCsv = (data, config) => {
  const cMap = {};
  config.predictions.forEach((p) => {
    cMap[p[1]] = p;
  });

  const cols = [
    ['id', (d) => (d.id in cMap) ? cMap[d.id][2] : ''],
    ['detail_id', (d) => d.id],
    ['detail_id2', (d) => d.id2],
    ['predict_id', (d) => (d.id in cMap) ? cMap[d.id][0] : ''],
    ['color', (d) => colorFromState(d.Farb_ID)],
    ['prediction', (d) => d.Wasserqualitaet_predict],
    ['p_date', (d) => d.Dat_predict],
    ['wasserqualitaet', (d) => d.Wasserqualitaet],
    ['sicht_txt', (d) => d.Sicht],
    ['eco_txt', (d) => d.Eco],
    ['ente_txt', (d) => d.Ente],
    ['temp_txt', (d) => d.Temp],
    ['algen_txt', (d) => d.Algen],
    ['cb_txt', (d) => d.cb],
    ['state', (d) => d.Farb_ID],
    ['m_date', (d) => d.Dat],
    ['real_state', (d) => d.Farb_ID]
  ];

  let lcsv = cols.map((c) => c[0]).join(',');

  data.forEach((d) => {
    let row = '\n';
    let col = [];
    cols.forEach((c) => {
      if (typeof c[1] === 'function') {
        let val = c[1](d);
        if (typeof val === 'string' && val.length > 0 && val.indexOf(',')>=0) {
          val = '"' + val + '"';
        }
        col.push(val);
      } else {
        console.log('ohoh')
      }
    });
    lcsv += '\n' + col.join(',');
  })

  return lcsv;
}

/**
 * @param {Object[]} data
 */
const lagesoCsv = (data) => {
  const cols = ['BadName','Bezirk','Profil','RSS_Name','Latitude','Longitude','ProfilLink','BadestelleLink','Dat','Sicht','Eco','Ente','Farbe','BSL','Algen','Wasserqualitaet','cb','Temp','PDFLink','PrognoseLink','Farb_ID','Wasserqualitaet_lageso','Wasserqualitaet_predict','Dat_predict'];
  let lcsv = cols.join(';');
  data.forEach((d)=>{
    lcsv += '\n';
    cols.forEach((col, colI) => {
      if (colI > 0) {
        lcsv += ';';
      }

      let value = ''; 
      if (col in d) {
        value = d[col];
        if(col.indexOf("Link")>=0 && value.length>0){
          if(value.indexOf(':/lageso')>=0){
            value = '"""'+value.split(':/lageso').join('""":/lageso')
          }else{
            value = '"""'+value.split(':http').join('""":http')
          }
        } else {
          if(value.length>0 && value.indexOf(';')>=0){ //&& (cc.indexOf(',')>=0 || 
            value = '"'+value+'"'
          }
        }
      }
      lcsv += value;
    });
  });     
  return lcsv;
}

const setupAWS = () => {
  if (process.env.NODE_ENV !== "test") {
    if (
      !("AWS_ACCESS_KEY_ID" in process.env) ||
      !("AWS_SECRET_ACCESS_KEY" in process.env)
    ) {
      throw Error(
        "AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required as environmental variables"
      );
    }
  }

  return new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
};

const uploadAWS = async (s3, fileContent, target) => {
  try {
    if (!("S3_BUCKET" in process.env)) {
      throw new Error("S3_BUCKET is required as an environmental variable");
    }

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: target,
      Body: fileContent,
    };
    const data = await s3.upload(params).promise();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  get,
  csv,
  lagesoFix,
  latestPredictions,
  merge,
  lagesoCsv,
  setupAWS,
  uploadAWS,
  websiteCsv
};