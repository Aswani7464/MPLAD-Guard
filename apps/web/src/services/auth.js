import { apiRequest } from './api'

export async function registerUser(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export async function loginUser(loginData) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(loginData),
  })
}
