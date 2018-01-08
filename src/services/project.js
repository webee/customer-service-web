import { promiseDispatch } from "../models/utils";
import request from "../utils/request";

export function createDomainTypeWrapperAction(projectDomain, projectType, type, action, extras = {}) {
  return { type, payload: { projectDomain, projectType, ...action, ...extras } };
}

export function createProjectDomainTypeAction(projectDomain, projectType, type = "", payload = undefined) {
  return {
    type: `/project/${projectDomain}/${projectType}/${type}`,
    payload
  };
}

export function domainTypeName({ projectDomain, projectType }, name, from_root = false) {
  if (from_root) {
    return `/project/${projectDomain}/${projectType}/${name}`;
  }
  return `project/${projectDomain}/${projectType}/${name}`;
}

export function createProjectDomainTypeEffectAction(projectDomain, projectType, type, payload) {
  return createDomainTypeWrapperAction(
    projectDomain,
    projectType,
    "project/dispatchDomainTypeEffect",
    { type, payload },
    {
      createAction: (type, payload) => createProjectDomainTypeAction(projectDomain, projectType, type, payload),
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
      createAction: (type, payload) => createProjectDomainTypeAction(projectDomain, projectType, type, payload),
      createEffectAction: (type, payload) => createDomainTypeEffectAction(projectDomain, projectType, type, payload)
    }
  );
}

export function dispatchDomainType({ projectDomain, projectType }, { dispatch }, type, payload) {
  return dispatch(createProjectDomainTypeAction(projectDomain, projectType, type, payload));
}

export function dispatchDomainTypeEffect({ projectDomain, projectType }, { dispatch }, type, payload) {
  return promiseDispatch(dispatch, createProjectDomainTypeEffectAction(projectDomain, projectType, type, payload));
}

// apis
export async function fetchMyHandlingSessions(projectDomain, projectType) {
  const resp = await request.get(`/projects/${projectDomain}/${projectType}/my_handling_sessions`);
  return resp.data;
}

export async function fetchHandlingSessions(projectDomain, projectType, params) {
  const resp = await request.get(`/projects/${projectDomain}/${projectType}/handling_sessions`, {
    params
  });
  return resp.data;
}

export async function fetchHandledSessions(projectDomain, projectType, params) {
  const resp = await request.get(`/projects/${projectDomain}/${projectType}/handled_sessions`, {
    params
  });
  return resp.data;
}

export async function fetchSessionItem(sessionID) {
  const resp = await request.get(`/sessions/${sessionID}`);
  return resp.data;
}

export async function fetchProjectItem(projectID) {
  const resp = await request.get(`/projects/${projectID}`);
  return resp.data;
}

export async function fetchProjectMsgs(projectID, { lid, rid, limit, desc }) {
  const resp = await request.get(`/projects/${projectID}/msgs`, {
    params: {
      lid,
      rid,
      limit,
      desc
    }
  });
  return resp.data;
}

export async function getProjectAccessFuncionURL(id, name, uid) {
  const resp = await request.get(`/projects/${id}/access_functions/${name}/url`, {
    params: { uid }
  });
  return resp.data;
}

export async function fetchProjectExtData(projectID) {
  return await request.get(`/projects/${projectID}/fetch_ext_data`);
}

export async function sendSessionMsg(projectID, sessionID, { domain = "", type = "", content }) {
  const resp = await request.post(`/sessions/${projectID}/${sessionID}/send_msg`, {
    domain,
    type,
    content
  });
  return resp.data;
}

export async function syncSessionMsgID(projectID, sessionID, msg_id) {
  return await request.post(`/sessions/${projectID}/${sessionID}/sync_msg_id`, {
    msg_id
  });
}

export async function finishHandlingSession(projectID, sessionID) {
  return await request.post(`/sessions/${projectID}/${sessionID}/finish_handling`);
}
