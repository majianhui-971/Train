import http from '@/utils/http'

export function fetchInfo(query) {
  return http.get('/api/ticket/admin', {
    params: query
  })
}

export function updateInfo(data) {
  return http.put('/api/ticket/admin', data)
}

export function addInfo(data) {
  return http.post('/api/ticket/admin', data)
}

export function deleteInfo(ids) {
  return http.delete('/api/ticket/admin/' + ids)
}

export function fetchTicketInfo(data) {
  return http.post('/api/ticket/getTicketInfo', data)
}

export function fetchNewTicketInfo() {
  return http.get('/api/ticket/newTicketInfo')
}

