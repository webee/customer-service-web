import React from "react";
import ReactDOM from "react-dom";
import Loader from "./components/Loader";
import styles from "./launcher.less";

// start launcher.
ReactDOM.render(<Loader type="pacman" />, document.querySelector("#root"));

// async load app.
(() => {
  NProgress.inc(0.1);
  import("./index").then(() => {
    NProgress.done();
  });
})();
