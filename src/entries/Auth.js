import React from "react";
import RouterLayout from "../components/layouts/RouterLayout";

const navData = {
  title: "Auth",
  items: [
    { title: "登录", pathname: "", component: require("../routes/Auth").default },
    { title: "退出", pathname: "logout", component: require("../routes/Auth/Logout").default }
  ]
};

export default class Auth extends React.Component {
  render() {
    return <RouterLayout navData={navData} />;
  }
}
