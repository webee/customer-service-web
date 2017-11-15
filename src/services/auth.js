import jwt from 'jsonwebtoken';
import envConfig from '../config';
import request from '../utils/request';
import { STAFF_JWT_HEADER } from '../constants'


export async function refreshJWT(jwt) {
  const resp = await request({
    method: 'post',
    url: '/auth/refresh_token',
    headers: {[STAFF_JWT_HEADER]: jwt}
  });
  return resp.data.token;
}

export function isAuthenticated() {
  const jwt = loadJWT();
  const jwt_exp = loadJWTExp();
  return jwt && jwt_exp > new Date();
}

export function validateJWT(token) {
  const payload = jwt.decode(token);
  if (payload) {
    const {exp, role} = payload;
    if (role != 'staff') {
      throw new Error('bad token');
    }
    const jwt_exp = new Date(exp*1000);
    if (!(jwt_exp - new Date() > envConfig.jwtRefreshTime)) {
      // 至少有30分钟有效期
      throw new Error('token expired');
    }

    return {jwt_exp};
  }
  throw new Error('invalid token');
}

export function saveJWT(jwt) {
  const {jwt_exp} = validateJWT(jwt);

	localStorage.setItem('jwt', jwt);
	localStorage.setItem('jwt_exp', jwt_exp);
}

export function clearJWT() {
	localStorage.removeItem('jwt');
  localStorage.removeItem('jwt_exp');
}

export function loadJWT() {
  return localStorage.getItem('jwt');
}

export function loadJWTExp() {
  return new Date(localStorage.getItem('jwt_exp'));
}

export function saveLoginURL(login_url) {
  if (login_url) {
    localStorage.setItem('login_url', login_url);
  } else {
    localStorage.removeItem('login_url');
  }
}

export function clearLoginURL() {
	localStorage.removeItem('login_url');
}

export function loadLoginURL() {
  return localStorage.getItem('login_url');
}
