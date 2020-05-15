import http from '@/utils/http'

export function fetchInfo(query) {
  return http.get('/api/message/admin', {
    params: query
  })
}

export function updateInfo(data) {
  return http.put('/api/message/admin', data)
}

export function addInfo(data) {
  return http.post('/api/message/admin', data)
}

export function deleteInfo(ids) {
  return http.delete('/api/message/admin/' + ids)
}

export function fetchMessageInfo(query) {
  return http.get('/api/message/messageInfo/fetchInfoData', {
    params: query
  })
}

export function fetchNewMessageInfo(data) {
  return http.get('/api/message/newMessageInfo')
}
