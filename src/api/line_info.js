import http from '@/utils/http'

export function fetchInfo(query) {
  return http.get('/api/line/admin', {
    params: query
  })
}

export function updateInfo(data) {
  return http.put('/api/line/admin', data)
}

export function addInfo(data) {
  return http.post('/api/line/admin', data)
}

export function deleteInfo(ids) {
  return http.delete('/api/line/admin/' + ids)
}


export function fetchLineBySelect() {
  return http.get('/api/line/select')
}
