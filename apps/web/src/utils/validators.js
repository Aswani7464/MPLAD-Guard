export function isRequired(value) {
  return (
    value !== null &&
    value !== undefined &&
    String(value).trim() !== ''
  )
}

export function isValidEmail(email) {
  if (!email) {
    return false
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return emailPattern.test(email)
}

export function isValidPassword(password) {
  if (!password) {
    return false
  }

  return password.length >= 6
}

export function isValidPercentage(value) {
  const number = Number(value)

  return (
    !Number.isNaN(number) &&
    number >= 0 &&
    number <= 100
  )
}

export function validateLoginForm({ email, password }) {
  const errors = {}

  if (!isRequired(email)) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email'
  }

  if (!isRequired(password)) {
    errors.password = 'Password is required'
  } else if (!isValidPassword(password)) {
    errors.password = 'Password must be at least 6 characters'
  }

  return errors
}

export function validateRegisterForm({
  name,
  email,
  password,
}) {
  const errors = {}

  if (!isRequired(name)) {
    errors.name = 'Name is required'
  }

  if (!isRequired(email)) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email'
  }

  if (!isRequired(password)) {
    errors.password = 'Password is required'
  } else if (!isValidPassword(password)) {
    errors.password = 'Password must be at least 6 characters'
  }

  return errors
}