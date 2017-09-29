import request from '../utils/request';


export function createProjectDomainTypeAction(project_domain, project_type, type, payload) {
  return {type: 'project/dispatchDomainType', payload: {project_domain, project_type, type, payload}}
}

export function createDomainTypeAction(project_domain, project_type, type, payload) {
  return {type: 'dispatchDomainType', payload: {project_domain, project_type, type, payload}}
}

export async function fetchMyHandlingSessions(project_domain, project_type) {
  const resp = await request.get(`/projects/${project_domain}/${project_type}/my_handling_sessions`);
  return resp.data;
}
