import request from '../utils/request';


export async function refreshJWT(jwt) {
  const resp = await request.post('/auth/refresh_token', {
    headers: {'X-STAFF-JWT': jwt}
  });
  return resp.data.token;
}

export function isAuthenticated() {
  return !!loadJWT();
}

export function persistJWT(jwt) {
  if (jwt) {
    localStorage.setItem('jwt', jwt);
  } else {
    localStorage.removeItem('jwt');
  }
}

export function loadJWT() {
  return localStorage.getItem('jwt');
}

export function persistLoginURL(login_url) {
  if (login_url) {
    localStorage.setItem('login_url', login_url);
  } else {
    localStorage.removeItem('login_url');
  }
}

export function loadLoginURL() {
  return localStorage.getItem('login_url');
}
