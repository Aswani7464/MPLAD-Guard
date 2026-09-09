const API_BASE_URL = 'https://mplad-guard.onrender.com'

export async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(API_BASE_URL + endpoint, {
      ...options,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
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
  } catch (error) {
    console.error('API request failed:', error)

    if (error instanceof TypeError) {
      throw new Error(
        'Unable to connect to the MPLAD-Guard server. Please check your internet connection.'
      )
    }

    throw error
  }
}

export { API_BASE_URL }