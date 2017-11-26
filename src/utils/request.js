import axios from 'axios';
import { axiosConfig } from '~/config';


/**
 * https://github.com/mzabriskie/axios
 */
const axiosInst = axios.create(axiosConfig);

export default axiosInst;

export function getQsArgBool(b, { t = true, f = false }) {
  return b === undefined ? b : b ? t : f;
}
