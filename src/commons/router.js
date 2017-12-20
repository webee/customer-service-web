import { withRouter, Route, Link, Switch, Redirect } from "dva/router";

export function getRootPath(path) {
  return path.replace(/\/*$/, "");
}

export function getRouteDataFromNavData(root_path, navItems, noMatch) {
  return navItems.map(item => {
    let { pathname, component, render } = item;
    let exact = pathname === "";
    let path = !exact ? `${root_path}/${pathname}` : root_path || "/";
    if (item.items) {
      render = ({ match }) => (
        <Routes path={match.path} navItems={item.items} defPath={item.defPath} noMatch={noMatch} />
      );
    } else {
      let { component } = item;
      if (item.instance) {
        path = `${path}/${item.instance.pathname}`;
        component = item.instance.component;
      }
      render = () => (
        <Switch>
          <Route exact path={path} component={item.component} render={item.render} />
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
