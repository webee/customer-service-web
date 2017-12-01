import React from "react";
import ReactDOM from "react-dom";
import app from "./app";

// 4. Router
app.router(require("./router"));
app.start("#root");
