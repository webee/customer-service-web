import { withRouter, Route, Link, Switch, Redirect } from 'dva/router';


export function getRootPath(path) {
  return path.replace(/\/*$/,'') || '/';
}

export function getRouteDataFromNavData(root_path, navData, NoMatch) {
  const pathPrefix = root_path.replace(/\/*$/,'');
  return navData.map(item => {
    const { pathname, component } = item;
    let { render } = item;
    const exact = pathname === '';
    const path =  exact ? root_path : `${pathPrefix}/${pathname}`;
    if (item.items) {
      render = ({match}) => {
        const { path } = match;
        return (
          <Routes path={path} navData={item.items} def={item.def} NoMatch={NoMatch} />
        );
      };
    }
    console.debug('route: ', {exact, path, component, render});
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
