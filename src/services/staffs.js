import request from "../utils/request";

// apis
export async function fetchStaffs(params) {
  const resp = await request.get("/staffs", {
    params
  });
  return resp.data;
}
