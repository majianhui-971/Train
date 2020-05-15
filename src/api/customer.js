import http from '@/utils/http'

export function login(data) {
  return http.put('/api/customer/login', data)
}


export function register(data) {
  return http.put('/api/customer/register', data)
}

export function updateInfo(data) {
  return http.put('/api/customer/updateInfo', data)
}

export function updatePass(data) {
  return http.put('/api/customer/updatePass', data)
}

export function fetchCustomer(id) {
  return http.get('/api/customer/' + id)
}

export function fetchInfo(query) {
  return http.get('/api/customer/admin', {
    params: query
  })
}

export function deleteInfo(ids) {
  return http.delete('/api/customer/admin/' + ids)
}

export function fetchCustomerBySelect() {
  return http.get('/api/customer/select')
}
