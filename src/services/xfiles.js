import axios from "axios";
import { xfilesAxiosConfig, xfilesBaseURL } from "~/config";

export const baseURL = xfilesBaseURL;
const request = axios.create(xfilesAxiosConfig);

export function setupToken(token) {
  request.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export async function upload(file, onUploadProgress) {
  const data = new FormData();
  data.append("file", file);
  const resp = await request.put("/upload", data, {
    onUploadProgress
  });
  return resp.data;
}
