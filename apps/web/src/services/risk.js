import { apiRequest } from './api'

export async function getProjectRisk(projectId) {
  return apiRequest(`/risk/${projectId}`)
}

export async function createRisk(riskData) {
  return apiRequest('/risk/', {
    method: 'POST',
    body: JSON.stringify(riskData),
  })
}
