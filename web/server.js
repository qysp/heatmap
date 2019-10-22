const http = require('http');
const { readFile } = require('fs').promises;

const HEATMAP_PATH = '/var/log/heatmap.log';

const getHeatmapLog = (filepath) => {
  return readFile(filepath, { encoding: 'utf8' }).then((content) => {
    let codes = [];
    if (typeof content === 'string' && content.length > 0) {
      codes = content.split(' ');
      codes.pop();
    }
    return codes;
  });
};

const mapCodes = (codes) => {
  const mappedCodes = {};
  codes.forEach((code) => {
    if (mappedCodes.hasOwnProperty(code)) {
      mappedCodes[code]++
    } else {
      mappedCodes[code] = 1;
    }
  });
  return mappedCodes;
}

http.createServer((_, res) => {
  getHeatmapLog(HEATMAP_PATH)
    .then((codes) => mapCodes(codes))
    .catch((err) => {
      console.error(err);
      return {};
    })
    .then((mappedCodes) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(mappedCodes));
    });
}).listen(1337);