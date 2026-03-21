const API = '/api';

function getToken() {
  return localStorage.getItem('aptis_token');
}

async function fetchJSON(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API}${url}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error: ${res.status}`);
  }
  return res.json();
}

// ─── Auth ───────────────────────────────────────────────────────────────────
export const loginUser = (email, password) =>
  fetchJSON('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const registerUser = (name, email, password) =>
  fetchJSON('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });

export const getMe = () => fetchJSON('/auth/me');

// ─── Admin ──────────────────────────────────────────────────────────────────
export const getAdminUsers = () => fetchJSON('/admin/users');
export const deleteAdminUser = (id) => fetchJSON(`/admin/users/${id}`, { method: 'DELETE' });
export const changeUserRole = (id, role) =>
  fetchJSON(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
export const getAdminStats = () => fetchJSON('/admin/stats');

// ─── Practice ───────────────────────────────────────────────────────────────
export const getQuestions = (skill, difficulty = '', limit = 10) => {
  let url = `/practice?skill=${skill}&limit=${limit}`;
  if (difficulty) url += `&difficulty=${difficulty}`;
  return fetchJSON(url);
};

export const getSkills = () => fetchJSON('/practice/skills');

export const submitAnswer = (question_id, answer) =>
  fetchJSON('/practice/answer', {
    method: 'POST',
    body: JSON.stringify({ question_id, answer }),
  });

// ─── Mock Test ──────────────────────────────────────────────────────────────
export const createMockTest = (data) =>
  fetchJSON('/mocktest', { method: 'POST', body: JSON.stringify(data || {}) });

export const getMockTest = (id) => fetchJSON(`/mocktest/${id}`);

export const submitMockAnswer = (id, mtq_id, answer) =>
  fetchJSON(`/mocktest/${id}/answer`, {
    method: 'POST',
    body: JSON.stringify({ mtq_id, answer }),
  });

export const completeMockTest = (id) =>
  fetchJSON(`/mocktest/${id}/complete`, { method: 'POST', body: JSON.stringify({}) });

export const getMockTests = () => fetchJSON('/mocktest');

// ─── Vocabulary ─────────────────────────────────────────────────────────────
export const getVocabulary = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return fetchJSON(`/vocabulary${q ? '?' + q : ''}`);
};

export const getVocabThemes = () => fetchJSON('/vocabulary/themes');

export const addVocabulary = (data) =>
  fetchJSON('/vocabulary', { method: 'POST', body: JSON.stringify(data) });

export const deleteVocabulary = (id) =>
  fetchJSON(`/vocabulary/${id}`, { method: 'DELETE' });

export const getNotebook = (reviewOnly = false) =>
  fetchJSON(`/vocabulary/notebook${reviewOnly ? '?review_only=true' : ''}`);

export const reviewWord = (id, quality) =>
  fetchJSON(`/vocabulary/notebook/${id}/review`, { method: 'POST', body: JSON.stringify({ quality }) });

export const addToNotebook = (data) =>
  fetchJSON('/vocabulary/notebook', { method: 'POST', body: JSON.stringify(data) });

export const deleteFromNotebook = (id) =>
  fetchJSON(`/vocabulary/notebook/${id}`, { method: 'DELETE' });

// ─── Roadmap ─────────────────────────────────────────────────────────────────
export const getRoadmap = () => fetchJSON('/roadmap');
export const getRoadmapSession = (id) => fetchJSON(`/roadmap/${id}`);
export const completeRoadmapSession = (id) =>
  fetchJSON(`/roadmap/${id}/complete`, { method: 'POST', body: JSON.stringify({}) });
export const getSessionQuestions = (sessionId) => fetchJSON(`/roadmap/questions/${sessionId}`);

// ─── Gamification ────────────────────────────────────────────────────────────
export const getLeaderboard = () => fetchJSON('/gamification/leaderboard');
export const getUserStats = () => fetchJSON('/gamification/stats');

// ─── Progress ────────────────────────────────────────────────────────────────
export const getProgress = () => fetchJSON('/progress');
export const getProgressHistory = (days = 30) => fetchJSON(`/progress/history?days=${days}`);

// ─── AI ──────────────────────────────────────────────────────────────────────
export const askAiTutor = (data) =>
  fetchJSON('/ai/tutor', { method: 'POST', body: JSON.stringify(data) });

export const getAiAnalysis = () =>
  fetchJSON('/ai/analyze', { method: 'POST', body: JSON.stringify({}) });

export const getDailyStats = () => fetchJSON('/progress/stats');

// ─── Import ──────────────────────────────────────────────────────────────────
export async function importExamPDF(file, skill = '') {
  const formData = new FormData();
  formData.append('pdf', file);
  if (skill) formData.append('skill', skill);
  const token = getToken();
  const res = await fetch(`${API}/import/pdf`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Import failed: ${res.status}`);
  }
  return res.json();
}

export async function saveToNotebook(data) {
  const token = getToken();
  const res = await fetch(`${API}/vocabulary/notebook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });
  return res.json();
}
