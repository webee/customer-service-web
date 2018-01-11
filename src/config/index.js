let config = undefined;

if (!config) {
  if (CONFIG_ENV === "production") {
    config = { ...require("./default"), ...require("./production") };
  } else if (CONFIG_ENV === "beta") {
    config = { ...require("./default"), ...require("./beta") };
  } else if (CONFIG_ENV === "development") {
    config = { ...require("./default"), ...require("./development") };
  } else {
    config = require("./default");
  }
}

module.exports = config;
