import { withRouter, Route, Link, Switch, Redirect } from 'dva/router';


export function getRootPath(path) {
  return path.endsWith('/') ? path.substr(0, path.length - 1) : path;
}

export function getRouteDataFromNavData(root_path, navData, NoMatch) {
  return navData.map(item => {
    const { pathname, component } = item;
    let { render } = item;
    const exact = pathname === '';
    const path =  exact ? root_path : `${root_path}/${pathname}`;
    if (item.items) {
      render = ({match}) => {
        const { path } = match;
        return (
          <Routes path={path} navData={item.items} def={item.def} NoMatch={NoMatch} />
        );
      };
    }
    return {exact, path, component, render};
  });
}

export const Routes = ({path, navData, def, NoMatch}) => (
    <Switch>
      {
        getRouteDataFromNavData(path, navData, NoMatch).map(item => (
          <Route exact={item.exact} key={item.path} path={item.path}
            component={item.component}
            render={item.render}
          />
        ))
      }
      {def && <Redirect exact from={path} to={`${path}/${def}`}/> }
      <Route component={NoMatch} />
    </Switch>
);
