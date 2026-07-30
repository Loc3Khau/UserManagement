import { useState, useEffect } from 'react'
import AvatarUploadGate from './AvatarUploadGate'

// Base URL của FastAPI backend
const API_BASE_URL = 'http://localhost:8000'

function GlowStyles() {
  return (
    <style>{`
      .btn-glow {
        transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
      }
      .btn-glow:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 22px rgba(0, 123, 255, 0.35);
        filter: brightness(1.05);
      }
      .row-hover {
        transition: background-color 0.15s ease;
      }
      .row-hover:hover {
        background-color: #f5f9ff;
      }
      .avatar-menu-wrapper:hover .avatar-menu {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }
      .avatar-menu {
        opacity: 0;
        pointer-events: none;
        transform: translateY(-6px);
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
    `}</style>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <span style={styles.modalClose} onClick={onClose}>✕</span>
        </div>
        {children}
      </div>
    </div>
  )
}

// Lấy token đã lưu lúc login (localStorage key: access_token)
// Nếu login flow của bạn lưu token ở chỗ khác thì đổi hàm này lại
function getAuthHeaders() {
  const token = localStorage.getItem('access_token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

function Dashboard1({ loginEmail, onLogout }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewingUser, setViewingUser] = useState(null)
  const [showEditProfile, setShowEditProfile] = useState(false)

  const [profile, setProfile] = useState({
    name: 'Quản trị viên',
    email: loginEmail || 'nguyenthanhbao031123@gmail.com',
    dob: '03/11/2006',
    gender: 'Nam',
    address: 'Đà Nẵng',
    phone: '0858745797',
  })

  // Gọi API lấy danh sách user ngay khi component được mount (render lần đầu)
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/users/`, {
        headers: getAuthHeaders(),
      })
      if (!res.ok) {
        throw new Error(`Lỗi API: ${res.status}`)
      }
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  // Bắt buộc chọn ảnh đại diện trước khi vào Dashboard chính thức
  if (!avatarUrl) {
    return <AvatarUploadGate name={profile.name} onUploaded={setAvatarUrl} />
  }

  const toggleLock = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/lock/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      })
      if (!res.ok) {
        throw new Error(`Lỗi API: ${res.status}`)
      }
      const updated = await res.json()
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: updated.status } : u))
      )
    } catch (err) {
      alert('Khóa/mở khóa thất bại: ' + err.message)
    }
  }

  // Lọc danh sách theo từ khóa: tên, giới tính, địa chỉ, sđt
  // .toLowerCase() để search không phân biệt hoa/thường
  const filteredUsers = users.filter((u) => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return true
    return (
      (u.full_name || '').toLowerCase().includes(keyword) ||
      (u.gender || '').toLowerCase().includes(keyword) ||
      (u.address || '').toLowerCase().includes(keyword) ||
      (u.phone_number || '').toLowerCase().includes(keyword)
    )
  })

  return (
    <div style={styles.page}>
      <GlowStyles />

      {/* Thanh header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Admin Dashboard</h1>

        <div className="avatar-menu-wrapper" style={styles.avatarWrapper}>
          <img src={avatarUrl} alt="avatar" style={styles.headerAvatar} />
          <div className="avatar-menu" style={styles.avatarMenu}>
            <div style={styles.avatarMenuItem} onClick={() => setShowEditProfile(true)}>Sửa hồ sơ</div>
            <div style={{ ...styles.avatarMenuItem, borderTop: '1px solid #eee' }} onClick={onLogout}>Đăng xuất</div>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Danh sách tài khoản người dùng</h2>

          {/* Thanh tìm kiếm */}
          <input
            type="text"
            placeholder="Tìm theo tên, giới tính, địa chỉ, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />

          {loading && <p style={styles.stateText}>Đang tải danh sách...</p>}
          {error && <p style={{ ...styles.stateText, color: '#d33' }}>{error}</p>}

          {!loading && !error && (
            <>
              <div style={styles.tableHeaderRow}>
                <span style={{ flex: 2 }}>Người dùng</span>
                <span style={{ flex: 2 }}>Email</span>
                <span style={{ flex: 1 }}>Trạng thái</span>
                <span style={{ flex: 2, textAlign: 'right' }}>Hành động</span>
              </div>

              {filteredUsers.length === 0 && (
                <p style={styles.stateText}>Không tìm thấy người dùng phù hợp.</p>
              )}

              {filteredUsers.map((u) => (
                <div key={u.id} className="row-hover" style={styles.tableRow}>
                  <span style={{ flex: 2, fontWeight: 600, color: '#333' }}>{u.full_name}</span>
                  <span style={{ flex: 2, color: '#666', fontSize: '13px' }}>{u.email}</span>
                  <span style={{ flex: 1 }}>
                    <span style={u.status === 'active' ? styles.badgeActive : styles.badgeLocked}>
                      {u.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </span>
                  <span style={{ flex: 2, textAlign: 'right' }}>
                    <button className="btn-glow" style={styles.smallBtnOutline} onClick={() => setViewingUser(u)}>
                      Xem hồ sơ
                    </button>
                    <button
                      className="btn-glow"
                      style={u.status === 'active' ? styles.smallBtnDanger : styles.smallBtnSuccess}
                      onClick={() => toggleLock(u.id)}
                    >
                      {u.status === 'active' ? 'Khóa' : 'Mở khóa'}
                    </button>
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Modal: xem hồ sơ user (chỉ xem, không sửa) */}
      {viewingUser && (
        <Modal title="Hồ sơ người dùng" onClose={() => setViewingUser(null)}>
          <div style={styles.profileGrid}>
            <Field label="Họ và tên" value={viewingUser.full_name} />
            <Field label="Email" value={viewingUser.email} />
            <Field label="Ngày sinh" value={viewingUser.date_of_birth} />
            <Field label="Giới tính" value={viewingUser.gender} />
            <Field label="Số điện thoại" value={viewingUser.phone_number} />
            <Field label="Địa chỉ" value={viewingUser.address} />
            <Field label="Trạng thái" value={viewingUser.status === 'active' ? 'Hoạt động' : 'Đã khóa'} />
          </div>
          <p style={styles.readonlyNote}>Admin chỉ có thể xem, không thể chỉnh sửa hồ sơ của người dùng khác.</p>
        </Modal>
      )}

      {/* Modal: sửa hồ sơ của chính admin */}
      {showEditProfile && (
        <Modal title="Sửa hồ sơ của tôi" onClose={() => setShowEditProfile(false)}>
          <div style={styles.editForm}>
            <label style={styles.label}>Họ và tên</label>
            <input
              style={styles.input}
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
            <label style={styles.label}>Ngày sinh</label>
            <input
              type="date"
              style={styles.input}
              value={profile.dob}
              onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
            />
            <label style={styles.label}>Số điện thoại</label>
            <input
              style={styles.input}
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
            <label style={styles.label}>Địa chỉ</label>
            <input
              style={styles.input}
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
            <button className="btn-glow" style={styles.saveBtn} onClick={() => setShowEditProfile(false)}>
              Lưu thay đổi
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div style={styles.fieldBox}>
      <span style={styles.fieldLabel}>{label}</span>
      <span style={styles.fieldValue}>{value || '—'}</span>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  },
  headerTitle: {
    margin: 0,
    fontSize: '20px',
    color: '#333',
  },
  avatarWrapper: {
    position: 'relative',
  },
  headerAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    objectFit: 'cover',
    cursor: 'pointer',
    border: '2px solid #007bff',
  },
  avatarMenu: {
    position: 'absolute',
    right: 0,
    top: '52px',
    width: '150px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    zIndex: 20,
  },
  avatarMenuItem: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer',
  },
  content: {
    padding: '32px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '14px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
    padding: '24px',
  },
  cardTitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    color: '#333',
  },
  searchInput: {
    width: '100%',
    padding: '10px 14px',
    marginBottom: '18px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  stateText: {
    padding: '20px 0',
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
  },
  tableHeaderRow: {
    display: 'flex',
    padding: '10px 12px',
    fontSize: '12px',
    color: '#999',
    textTransform: 'uppercase',
    borderBottom: '1px solid #eee',
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 12px',
    borderBottom: '1px solid #f2f2f2',
    borderRadius: '8px',
  },
  badgeActive: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#1a9c4b',
    backgroundColor: '#e6f7ec',
    padding: '4px 10px',
    borderRadius: '999px',
  },
  badgeLocked: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#d33',
    backgroundColor: '#fdecec',
    padding: '4px 10px',
    borderRadius: '999px',
  },
  smallBtnOutline: {
    border: '1px solid #007bff',
    color: '#007bff',
    backgroundColor: '#fff',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12.5px',
    cursor: 'pointer',
    marginLeft: '8px',
  },
  smallBtnDanger: {
    border: 'none',
    color: '#fff',
    backgroundColor: '#e05555',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12.5px',
    cursor: 'pointer',
    marginLeft: '8px',
  },
  smallBtnSuccess: {
    border: 'none',
    color: '#fff',
    backgroundColor: '#2fa860',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12.5px',
    cursor: 'pointer',
    marginLeft: '8px',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  modalCard: {
    width: '420px',
    maxHeight: '85vh',
    overflowY: 'auto',
    backgroundColor: '#fff',
    borderRadius: '14px',
    padding: '24px',
    boxSizing: 'border-box',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
  },
  modalTitle: {
    margin: 0,
    fontSize: '18px',
    color: '#333',
  },
  modalClose: {
    cursor: 'pointer',
    color: '#999',
    fontSize: '16px',
  },
  profileGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  fieldBox: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #f2f2f2',
    paddingBottom: '8px',
  },
  fieldLabel: {
    color: '#999',
    fontSize: '13px',
  },
  fieldValue: {
    color: '#333',
    fontSize: '13.5px',
    fontWeight: 600,
  },
  readonlyNote: {
    marginTop: '18px',
    fontSize: '12px',
    color: '#aaa',
    fontStyle: 'italic',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '12.5px',
    color: '#666',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    marginBottom: '14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  saveBtn: {
    marginTop: '4px',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #2f9bff, #007bff)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
}

export default Dashboard1