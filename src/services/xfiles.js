import axios from "axios";
import { xfilesAxiosConfig, xfilesBaseURL } from "~/config";

export const baseURL = xfilesBaseURL;
const request = axios.create(xfilesAxiosConfig);
let authInterceptor = undefined;

export function setupToken(token) {
  if (authInterceptor) {
    request.interceptors.request.eject(authInterceptor);
  }
  authInterceptor = request.interceptors.request.use(req => {
    req.headers["Authorization"] = `Bearer ${token}`;
    return req;
  });
}

export async function upload(file, onUploadProgress) {
  const data = new FormData();
  data.append("file", file);
  const resp = await request.put("/api/upload", data, {
    onUploadProgress
  });
  return resp.data;
}
