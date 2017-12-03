let config = undefined;

if (!config) {
  if (process.env.NODE_ENV === "production") {
    config = { ...require("./default"), ...require("./production") };
  } else if (process.env.NODE_ENV === "development") {
    config = { ...require("./default"), ...require("./development") };
  } else {
    config = require("./default");
  }
}

module.exports = config;
