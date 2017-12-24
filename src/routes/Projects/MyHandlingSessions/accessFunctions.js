import * as projectService from "~/services/project";

export async function accessFunction(project_id, name, uid) {
  const { url } = await projectService.getProjectAccessFuncionURL(project_id, name, uid);
  window.open(url, "_blank");
}
