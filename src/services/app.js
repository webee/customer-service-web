import request from '../utils/request';


export async function fetchStaffAppTree() {
  const resp = await request.get('/staff_app_tree');
  return resp.data;
}
