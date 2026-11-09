import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 10000,
})

export const getDashboardStats = async () => {
  const { data } = await api.get('/dashboard')
  return data
}

export const getInterviews = async () => {
  const { data } = await api.get('/interviews')
  return data
}

export const createInterview = async (payload) => {
  const { data } = await api.post('/interviews', payload)
  return data
}

export const deleteInterview = async (id) => {
  await api.delete(`/interviews/${id}`)
}

export default api
