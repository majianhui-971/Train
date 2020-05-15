import http from '@/utils/http'

export function getMessage(data) {
  return http.get('/api/message')
}

export function getOnline() {
  return http.get('/api/online')
}

export function deleteUserSession() {
  return http.delete('/api/session')
}


export function deleteAdminSession() {
  return http.delete('/api/admin/session')
}

export function redisData(key) {
  return http.get('/api/redis/data/' + key)
}

