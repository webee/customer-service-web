import app from "./app";

// 4. Router
app.router(require("./router").default);
app.start("#root");

// done load
NProgress.done();
