import request from "../utils/request";

export function createDomainTypeWrapperAction(projectDomain, projectType, type, action, extras = {}) {
  return { type, payload: { projectDomain, projectType, ...action, ...extras } };
}

// model外部使用
export function createProjectDomainTypeAction(projectDomain, projectType, type, payload) {
  return createDomainTypeWrapperAction(projectDomain, projectType, "project/dispatchDomainType", {
    type,
    payload
  });
}

// model内部使用
export function createDomainTypeAction(projectDomain, projectType, type, payload) {
  return createDomainTypeWrapperAction(projectDomain, projectType, "dispatchDomainType", { type, payload });
}

export function dispatchDomainType({ projectDomain, projectType }, { dispatch }, type, payload) {
  dispatch(createProjectDomainTypeAction(projectDomain, projectType, type, payload));
}

export function createProjectDomainTypeEffectAction(projectDomain, projectType, type, payload) {
  return createDomainTypeWrapperAction(
    projectDomain,
    projectType,
    "project/dispatchDomainTypeEffect",
    { type, payload },
    {
      createAction: (type, payload) => createDomainTypeAction(projectDomain, projectType, type, payload),
      createEffectAction: (type, payload) => createDomainTypeEffectAction(projectDomain, projectType, type, payload)
    }
  );
}

export function createDomainTypeEffectAction(projectDomain, projectType, type, payload) {
  return createDomainTypeWrapperAction(
    projectDomain,
    projectType,
    "dispatchDomainTypeEffect",
    { type, payload },
    {
      createAction: (type, payload) => createDomainTypeAction(projectDomain, projectType, type, payload),
      createEffectAction: (type, payload) => createDomainTypeEffectAction(projectDomain, projectType, type, payload)
    }
  );
}

export function dispatchDomainTypeEffect({ projectDomain, projectType }, { dispatch }, type, payload) {
  dispatch(createProjectDomainTypeEffectAction(projectDomain, projectType, type, payload));
}

// apis
export async function fetchMyHandlingSessions(projectDomain, projectType) {
  const resp = await request.get(`/projects/${projectDomain}/${projectType}/my_handling_sessions`);
  return resp.data;
}

export async function sessionSendMsg(projectID, sessionID, { domain = "", type = "", content }) {
  return await request.post(`/sessions/${projectID}/${sessionID}/send_msg`, {
    domain,
    type,
    content
  });
}

export async function syncSessionMsgID(projectID, sessionID, msg_id) {
  return await request.post(`/sessions/${projectID}/${sessionID}/sync_msg_id`, {
    msg_id
  });
}

export async function fetchSessionMsgs(projectID, sessionID, { lid, rid, limit, desc }) {
  const resp = await request.get(`/sessions/${projectID}/${sessionID}/msgs`, {
    lid,
    rid,
    limit,
    desc
  });
  return resp.data;
}
