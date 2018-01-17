export function normalizeSession(s) {
  return { ...s, project_id: s.project.id, project: undefined, handler: s.handler.uid };
}

export function normalizeProject(p) {
  return {
    ...p,
    owner: p.owner.uid,
    leader: p.leader.uid,
    customers: p.customers.map(c => c.uid)
  };
}

export function* updateProjectList({ ns = "_", createAction, payload: projectList }, { call, put }) {
  yield put(createAction(`${ns}/updateProjects`, projectList.map(normalizeProject)));

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

export function* updateSessionList({ ns = "_", createAction, payload: sessionList }, { call, put }) {
  yield put(createAction(`${ns}/updateSessions`, sessionList.map(normalizeSession)));
  const projectList = sessionList.map(s => s.project);
  yield updateProjectList({ ns, createAction, payload: projectList }, { call, put });
  const staffs = [];
  sessionList.forEach(s => {
    // staffs
    staffs.push(s.handler);
  });
  yield put({ type: "app/updateStaffs", payload: staffs });
}
