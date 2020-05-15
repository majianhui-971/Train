import http from '@/utils/http'

export function addInfo(data) {
  return http.post('/api/comment/', data)
}

export function fetchAllCommentInfo() {
  return http.get('/api/comment/all')
}

export function fetchInfo(query) {
  return http.get('/api/comment/admin', {
    params: query
  })
}

export function deleteInfo(ids) {
  return http.delete('/api/comment/admin/' + ids)
}

export function fetchNewCommentInfo() {
  return http.get('/api/comment/newCommentInfo')
}
