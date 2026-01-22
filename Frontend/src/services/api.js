const API_BASE = import.meta.env.VITE_API_URL || '/api';


// Topics API
export const topicsAPI = {
  getAll: () => fetch(`${API_BASE}/topics`).then(res => res.json()),
  getById: (id) => fetch(`${API_BASE}/topics/${id}`).then(res => res.json()),
  create: (topic) => fetch(`${API_BASE}/topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(topic)
  }).then(res => res.json()),
  update: (id, topic) => fetch(`${API_BASE}/topics/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(topic)
  }).then(res => res.json()),
  delete: (id) => fetch(`${API_BASE}/topics/${id}`, { method: 'DELETE' }),
  updateNotes: (id, notes) => fetch(`${API_BASE}/topics/${id}/notes`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes })
  }).then(res => res.json())
};

// Questions API
export const questionsAPI = {
  getAll: () => fetch(`${API_BASE}/questions`).then(res => res.json()),
  getByTopic: (topicId) => fetch(`${API_BASE}/topics/${topicId}/questions`).then(res => res.json()),
  getById: (id) => fetch(`${API_BASE}/questions/${id}`).then(res => res.json()),
  getRecentCompleted: (limit = 5) => fetch(`${API_BASE}/questions/recent/completed?limit=${limit}`).then(res => res.json()),
  create: (question) => fetch(`${API_BASE}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question)
  }).then(res => res.json()),
  update: (id, question) => fetch(`${API_BASE}/questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question)
  }).then(res => res.json()),
  delete: (id) => fetch(`${API_BASE}/questions/${id}`, { method: 'DELETE' }),
  updateStatus: (id, status) => fetch(`${API_BASE}/questions/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then(res => res.json()),
  toggleImportant: (id) => fetch(`${API_BASE}/questions/${id}/important`, {
    method: 'PATCH'
  }).then(res => res.json())
};

// Reminders API
export const remindersAPI = {
  getAll: () => fetch(`${API_BASE}/reminders`).then(res => res.json()),
  getUpcoming: () => fetch(`${API_BASE}/reminders/upcoming`).then(res => res.json()),
  getByQuestion: (questionId) => fetch(`${API_BASE}/questions/${questionId}/reminders`).then(res => res.json())
};

// Daily Progress API
export const progressAPI = {
  getToday: () => fetch(`${API_BASE}/progress/today`).then(res => res.json()),
  getHistory: (startDate, endDate) => 
    fetch(`${API_BASE}/progress/history?startDate=${startDate}&endDate=${endDate}`).then(res => res.json()),
  getStats: () => fetch(`${API_BASE}/progress/stats`).then(res => res.json()),
  getDailyCompletions: (startDate, endDate) =>
    fetch(`${API_BASE}/progress/completions?startDate=${startDate}&endDate=${endDate}`).then(res => res.json())
};
