const ENV = process.env.ENV || "development";
let outputPath = "dist";
let extraBabelPlugins = ["transform-remove-console"];
if (ENV !== "production") {
  outputPath = `debug-dist/${ENV}`;
  extraBabelPlugins = [];
}
console.log(`env: ${ENV} -> ${outputPath}`);
export default {
  entry: "src/index.js",
  hash: true,
  html: { template: "./src/index.ejs" },
  publicPath: "/",
  outputPath: outputPath,
  extraBabelPlugins: [
    "transform-decorators-legacy",
    "transform-class-properties",
    ["root-import", { rootPathSuffix: "src" }],
    ["import", { libraryName: "antd", libraryDirectory: "es", style: true }]
  ],
  define: {
    "process.env.ENV": ENV
  },
  env: {
    development: {
      extraBabelPlugins: ["dva-hmr"],
      proxy: {
        "/api": {
          target: "http://local.cs.com",
          changeOrigin: true,
          pathRewrite: { "^/api": "/api" }
        }
      }
    },
    production: {
      extraBabelPlugins: extraBabelPlugins
    }
  },
  externals: {
    g2: "G2",
    "g-cloud": "Cloud",
    "g2-plugin-slider": "G2.Plugin.slider"
  },
  ignoreMomentLocale: true,
  theme: "./src/theme.js"
};
