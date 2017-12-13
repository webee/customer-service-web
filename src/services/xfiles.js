import axios from "axios";
import { xfilesAxiosConfig } from "~/config";

const request = axios.create(xfilesAxiosConfig);

export function setupToken(token) {
  request.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export async function upload(onUploadProgress) {
  const resp = await request.post("/upload", {
    onUploadProgress
  });
  return resp.data;
}
