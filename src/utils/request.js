import qs from "qs";
import axios from "axios";
import { axiosConfig } from "~/config";

/**
 * https://github.com/mzabriskie/axios
 */
const axiosInst = axios.create({
  ...axiosConfig,
  paramsSerializer: function(params) {
    return qs.stringify(params, { arrayFormat: "repeat" });
  }
});

export default axiosInst;

export function getQsArgBool(b, { t = true, f = false }) {
  return b === undefined ? b : b ? t : f;
}
