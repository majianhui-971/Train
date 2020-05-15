import http from '@/utils/http'

export function fetchInfo(query) {
  return http.get('/api/site/admin', {
    params: query
  })
}

export function updateInfo(data) {
  return http.put('/api/site/admin', data)
}

export function addInfo(data) {
  return http.post('/api/site/admin', data)
}

export function deleteInfo(ids) {
  return http.delete('/api/site/admin/' + ids)
}

export function getSiteInfo(query) {
  return http.get('/api/site/getSiteInfo',{
    params:query
  })
}

export function fetchSiteBySelect() {
  return http.get('/api/site/select')
}
