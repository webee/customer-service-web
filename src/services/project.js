import request from "../utils/request";

// model外部使用
export function createProjectDomainTypeAction(
  project_domain,
  project_type,
  type,
  payload
) {
  return {
    type: "project/dispatchDomainType",
    payload: { project_domain, project_type, type, payload }
  };
}

// model内部使用
export function createDomainTypeAction(
  project_domain,
  project_type,
  type,
  payload
) {
  return {
    type: "dispatchDomainType",
    payload: { project_domain, project_type, type, payload }
  };
}

export function dispatchDomainType(
  { projectDomain, projectType },
  { dispatch },
  type,
  payload
) {
  dispatch(
    createProjectDomainTypeAction(projectDomain, projectType, type, payload)
  );
}

export function createProjectDomainTypeEffectAction(
  project_domain,
  project_type,
  type,
  payload
) {
  return {
    type: "project/dispatchDomainTypeEffect",
    payload: { project_domain, project_type, type, payload }
  };
}

export function createDomainTypeEffectAction(
  project_domain,
  project_type,
  type,
  payload
) {
  return {
    type: "dispatchDomainTypeEffect",
    payload: { project_domain, project_type, type, payload }
  };
}

export function dispatchDomainTypeEffect(
  { projectDomain, projectType },
  { dispatch },
  type,
  payload
) {
  dispatch(
    createProjectDomainTypeEffectAction(
      projectDomain,
      projectType,
      type,
      payload
    )
  );
}

// apis
export async function fetchMyHandlingSessions(project_domain, project_type) {
  const resp = await request.get(
    `/projects/${project_domain}/${project_type}/my_handling_sessions`
  );
  return resp.data;
}
