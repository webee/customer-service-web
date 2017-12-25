import request from "../utils/request";

// apis
export async function fetchStaffs({ page, per_page, name, context_label, is_online, is_deleted, sorter, order }) {
  const resp = await request.get("/staffs", {
    params: {
      page,
      per_page,
      name,
      context_label,
      is_online,
      is_deleted,
      sorter,
      order
    }
  });
  return resp.data;
}
