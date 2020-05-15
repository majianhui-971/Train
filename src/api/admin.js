import http from '@/utils/http'

export function login(data) {
  return http.put('/api/admin/login', data)
}

export function fetchInfo(query) {
  return http.get('/api/admin/info', {
    params: query
  })
}

export function updateInfo(data) {
  return http.put('/api/admin/info', data)
}

export function addInfo(data) {
  return http.post('/api/admin/info', data)
}

export function deleteInfo(ids) {
  return http.delete('/api/admin/info/' + ids)
}
