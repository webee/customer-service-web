import request from '../utils/request';
// FIXME: replace localStorage by localforage.


export async function fetchStaffAppTree() {
  const resp = await request.get('/staff_app_tree');
  return resp.data;
}


export function saveUISettings(settings) {
  localStorage.setItem('ui_settings', JSON.stringify(settings));
}

export function loadUISettings() {
  try {
    const ui_settings = JSON.parse(localStorage.getItem('ui_settings'));
    if (ui_settings && typeof ui_settings === 'object') {
      return ui_settings;
    }
    return {};
  } catch(e) {
    console.debug(e);
    return {};
  }
}
