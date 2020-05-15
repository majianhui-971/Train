import http from '@/utils/http'

export function fetchInfo(query) {
  return http.get('/api/drive/admin', {
    params: query
  })
}

export function updateInfo(data) {
  return http.put('/api/drive/admin', data)
}

export function addInfo(data) {
  return http.post('/api/drive/admin', data)
}

export function deleteInfo(ids) {
  return http.delete('/api/drive/admin/' + ids)
}

export function fetchDriveBySelect() {
  return http.get('/api/drive/select')
}
