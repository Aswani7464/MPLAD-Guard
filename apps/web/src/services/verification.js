import { apiRequest } from './api'

export async function getProjectVerification(projectId) {
  return apiRequest(`/verification/${projectId}`)
}

export async function createVerification(verificationData) {
  return apiRequest('/verification/', {
    method: 'POST',
    body: JSON.stringify(verificationData),
  })
}

export async function updateVerification(
  verificationId,
  verificationData
) {
  return apiRequest(`/verification/${verificationId}`, {
    method: 'PUT',
    body: JSON.stringify(verificationData),
  })
}
