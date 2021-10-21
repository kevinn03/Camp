const fs = require("fs");

const quoteCleaner = (oldArr) => {
  let tempArr = oldArr;

  tempArr = tempArr.map((ele) => ele.slice(1, -1));

  return tempArr;
};
const csvHandler = function () {
  let bufferString;
  let arr;
  const jsonObj = [];
  const fileread = fs.readFileSync("./seeds/canadacities.csv", "utf8");
  bufferString = fileread.toString();
  arr = bufferString.split("\n");

  let headers = arr[0].split(",");
  headers = quoteCleaner(headers);
  for (let i = 1; i < arr.length; i++) {
    let data = arr[i].split(",");
    data = quoteCleaner(data);
    let obj = {};
    for (let j = 0; j < data.length - 1; j++) {
      obj[headers[j]?.trim()] = data[j]?.trim();
    }
    jsonObj.push(obj);
  }
  jsonObj.pop();
  return jsonObj;
};

module.exports.csvHandler = csvHandler;
