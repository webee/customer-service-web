import React from "react";
import RouterLayout from "../components/layouts/RouterLayout";

const navData = {
  title: "Auth",
  items: [
    { title: "登录", pathname: "", component: require("../routes/Auth") },
    { title: "退出", pathname: "logout", component: require("../routes/Auth/Logout") }
  ]
};

export default class Auth extends React.Component {
  render() {
    return <RouterLayout navData={navData} />;
  }
}
