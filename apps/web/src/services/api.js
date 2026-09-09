const API_BASE_URL = 'http://127.0.0.1:8000'

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    let message = 'Something went wrong'

    if (typeof data?.detail === 'string') {
      message = data.detail
    } else if (Array.isArray(data?.detail)) {
      message = data.detail
        .map((item) => item?.msg || String(item))
        .join(', ')
    } else if (data?.detail && typeof data.detail === 'object') {
      message =
        data.detail.message ||
        data.detail.error ||
        JSON.stringify(data.detail)
    } else if (typeof data?.message === 'string') {
      message = data.message
    }

    throw new Error(message)
  }

  return data
}

export { API_BASE_URL, apiRequest }