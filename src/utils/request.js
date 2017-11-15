import axios from 'axios';
import { axiosConfig } from '~/config';


/**
 * https://github.com/mzabriskie/axios
 */
const axiosInst = axios.create(axiosConfig);

export default axiosInst;
