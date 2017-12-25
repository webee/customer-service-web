import { withRouter, Route, Link, Switch, Redirect } from "dva/router";

export function getRootPath(path) {
  return path.replace(/\/*$/, "");
}

export function getRouteDataFromNavData(root_path, navItems, noMatch) {
  return navItems.map(item => {
    let { pathname, component, render, defPath, items, instance } = item;
    let exact = pathname === "";
    let path = !exact ? `${root_path}/${pathname}` : root_path || "/";
    if (items) {
      render = ({ match }) => (
        <Routes path={match.path} navItems={items} defPath={defPath} noMatch={noMatch} />
      );
    } else {
      let curPath = path;
      if (instance) {
        curPath = `${path}/${instance.pathname}`;
        component = instance.component;
      }
      render = () => (
        <Switch>
          <Route exact path={curPath} component={component} render={item.render} />
          {defPath !== undefined && <Redirect exact from={path} to={`${path}/${defPath}`} />}
          {noMatch && <Route component={noMatch} />}
          <Redirect to={path} />
        </Switch>
      );
    }
    console.debug("route: ", { exact, path, render });
    return { exact, path, render };
  });
}

export const Routes = ({ path, navItems, defPath, noMatch }) => {
  return (
    <Switch>
      {getRouteDataFromNavData(path, navItems, noMatch).map(item => (
        <Route key={item.path} exact={item.exact} path={item.path} component={item.component} render={item.render} />
      ))}
      {defPath !== undefined && <Redirect exact from={path} to={`${path}/${defPath}`} />}
      {noMatch && <Route component={noMatch} />}
      <Redirect to={path} />
    </Switch>
  );
};
