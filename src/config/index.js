let config = undefined;

if (!config) {
  if (process.env.ENV === "prod") {
    config = { ...require("./default"), ...require("./prod") };
  } else if (process.env.ENV === "beta") {
    config = { ...require("./default"), ...require("./beta") };
  } else if (process.env.ENV === "test") {
    config = { ...require("./default"), ...require("./test") };
  } else if (process.env.ENV === "dev") {
    config = { ...require("./default"), ...require("./dev") };
  } else {
    config = require("./default");
  }
}

module.exports = config;
