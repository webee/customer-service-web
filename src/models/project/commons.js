export function normalizeSession(s) {
  return { ...s, project_id: s.project.id, project: undefined, handler: s.handler.uid };
}

export function normalizePrject(p) {
  return {
    ...p,
    owner: p.owner.uid,
    leader: p.leader.uid,
    customers: p.customers.map(c => c.uid)
  };
}

export function* updateProjectList({ createAction, payload: projectList }, { call, put }) {
  yield put(createAction(`_/updateProjects`, projectList.map(normalizePrject)));

  const staffs = [];
  const customers = [];
  projectList.forEach(p => {
    // staffs
    staffs.push(p.leader);
    // customers
    customers.push(p.owner);
    customers.push(...p.customers);
  });
  yield put({ type: "app/updateStaffs", payload: staffs });
  yield put({ type: "app/updateCustomers", payload: customers });
}

export function* updateSessionList({ createAction, payload: sessionList }, { call, put }) {
  yield put(createAction(`_/updateSessions`, sessionList.map(normalizeSession)));
  const projectList = sessionList.map(s => s.project);
  yield updateProjectList({ createAction, payload: projectList }, { call, put });
  const staffs = [];
  sessionList.forEach(s => {
    // staffs
    staffs.push(s.handler);
  });
  yield put({ type: "app/updateStaffs", payload: staffs });
}
