let config = undefined;

if (!config) {
  if (process.env.ENV === "production") {
    config = { ...require("./default"), ...require("./production") };
  } else if (process.env.ENV === "beta") {
    config = { ...require("./default"), ...require("./beta") };
  } else if (process.env.ENV === "development") {
    config = { ...require("./default"), ...require("./development") };
  } else {
    config = require("./default");
  }
}

module.exports = config;
