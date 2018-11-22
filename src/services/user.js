import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}


// Kinfy 

export async function queryHeaderStore() {
  return request('/api/headerStore');
}

export async function replaceStore(params) {
  return request(`/api/enterStore/${params.id}`);
}

