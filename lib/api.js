const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export async function apiFetch(endpoint, options = {}) {
  const token = getToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
    
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
    
  const response = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers
  })
    
  const data = await response.json()
    
  if (!response.ok) {
    throw new Error(data.error || 'Erro na requisição')
  }
    
  return data
}

export async function login(emailOrPhone, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ emailOrPhone, password })
  })
}

export async function register(userData) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
}

export async function recoverPassword(email, phone) {
  return apiFetch('/auth/recover-password', {
    method: 'POST',
    body: JSON.stringify({ email, phone })
  })
}

export async function resetPassword(token, password) {
  return apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password })
  })
}

export async function getDashboardStats() {
  return apiFetch('/reports')
}

export async function getSalesReport(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiFetch(`/reports/sales${query ? '?' + query : ''}`)
}

export async function getCommissionsReport() {
  return apiFetch('/reports/commissions')
}

export async function getPlans() {
  return apiFetch('/plans')
}

export async function createPlan(data) {
  return apiFetch('/plans', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function updatePlan(id, data) {
  return apiFetch(`/plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export async function deletePlan(id) {
  return apiFetch(`/plans/${id}`, {
    method: 'DELETE'
  })
}

export async function getRaffles(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiFetch(`/raffles${query ? '?' + query : ''}`)
}

export async function createRaffle(data) {
  return apiFetch('/raffles', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function updateRaffle(id, data) {
  return apiFetch(`/raffles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export async function deleteRaffle(id) {
  return apiFetch(`/raffles/${id}`, {
    method: 'DELETE'
  })
}

export async function getClientAdmins() {
  return apiFetch('/users')
}

export async function createClientAdmin(data) {
  return apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function deleteUser(id) {
  return apiFetch(`/users/${id}`, {
    method: 'DELETE'
  })
}

export async function getSubscriptions() {
  return apiFetch('/subscriptions')
}
