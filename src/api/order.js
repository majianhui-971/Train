import http from '@/utils/http'


export function fetchOrderTicketInfo() {
  return http.get('/api/order/')
}


export function fetchInfo(query) {
  return http.get('/api/order/admin', {
    params: query
  })
}

export function updateInfo(data) {
  return http.put('/api/order/admin', data)
}

export function addInfo(data) {
  return http.post('/api/order/admin', data)
}

export function deleteData(id) {
  return http.delete('/api/order/' + id)
}


export function deleteInfo(ids) {
  return http.delete('/api/order/admin/' + ids)
}

export function addInfoData(data) {
  return http.post('/api/order/addInfoData', data)
}

export function fetchPageInfo(query) {
  return http.get('/api/order/fetchPageInfo', {
    params: query
  })
}

export function backOrderInfo(data) {
  return http.put('/api/order/back', data)
}
