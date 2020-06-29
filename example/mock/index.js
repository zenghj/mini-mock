const path = require("path");
const absolute = relative => path.resolve(__dirname, relative);

module.exports = {
  off: false,
  routes: {
    "GET:/test": absolute("test.json"),
    "GET:/test/:id": absolute("test2.json")
  }
};
