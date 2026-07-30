// Lấy URL Backend từ biến môi trường Vite (.env), mặc định fallback về localhost nếu chưa cấu hình
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

// --- Quản lý JWT token trong localStorage ---
export function getToken() {
  return localStorage.getItem('access_token')
}

export function getRole() {
  return localStorage.getItem('role')
}

export function saveSession({ access_token, role, id, full_name, avatar_url }) {
  localStorage.setItem('access_token', access_token)
  localStorage.setItem('role', role)
  localStorage.setItem('user_id', id)
  localStorage.setItem('full_name', full_name || '')
  localStorage.setItem('avatar_url', avatar_url || '')
}

export function clearSession() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('role')
  localStorage.removeItem('user_id')
  localStorage.removeItem('full_name')
  localStorage.removeItem('avatar_url')
}

// --- Gọi API kèm token tự động, xử lý 401 tự động logout ---
export async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = { ...(options.headers || {}) }

  // Không set Content-Type khi gửi FormData (upload ảnh)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  // Tự động xử lý khi Token hết hạn hoặc không hợp lệ (Lỗi 401)
  if (res.status === 401) {
    clearSession()
    // Chuyển hướng người dùng về trang login nếu chưa ở trang login
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
    throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.')
  }

  let data = null
  try {
    data = await res.json()
  } catch (e) {
    // Trường hợp response trống (ví dụ: HTTP status 204 No Content)
  }

  if (!res.ok) {
    let message = 'Đã có lỗi xảy ra, vui lòng thử lại'
    if (data?.detail) {
      // FastAPI trả về lỗi validate 422 dạng mảng object
      message = Array.isArray(data.detail)
        ? data.detail.map((d) => d.msg).join(', ')
        : data.detail
    }
    throw new Error(message)
  }

  return data
}

// Ghép URL ảnh đại diện trả về từ backend thành URL đầy đủ
export function avatarFullUrl(avatarUrl) {
  if (!avatarUrl) return null
  return avatarUrl.startsWith('http') ? avatarUrl : `${API_BASE}${avatarUrl}`
}