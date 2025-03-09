const { v4: uuidv4 } = require("uuid");

let data = [];

exports.createNew = function (url) {
  data.push({
    id: data.length + 1,
    original_url: url,
  });
  return data[data.length - 1];
};

exports.findURL = function (id) {
  return data.find((url) => url.id === id);
};
