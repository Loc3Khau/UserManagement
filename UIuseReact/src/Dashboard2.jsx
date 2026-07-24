import { useState } from 'react'
import AvatarUploadGate from './AvatarUploadGate'

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
      .avatar-logout-wrapper:hover .avatar-logout-tag {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }
      .avatar-logout-tag {
        opacity: 0;
        pointer-events: none;
        transform: translateY(-6px);
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
    `}</style>
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

function Dashboard2({ loginEmail, onLogout }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [showEditProfile, setShowEditProfile] = useState(false)

  // Hồ sơ mẫu của user (thực tế sẽ lấy từ API sau khi đăng nhập)
  const [profile, setProfile] = useState({
    name: 'Người dùng mới',
    email: loginEmail || '',
    dob: '',
    gender: '',
    address: '',
    phone: '',
  })

  // Bắt buộc chọn ảnh đại diện trước khi vào trang chính thức
  if (!avatarUrl) {
    return <AvatarUploadGate name={profile.name} onUploaded={setAvatarUrl} />
  }

  return (
    <div style={styles.page}>
      <GlowStyles />

      {/* Avatar góc trên cùng bên phải, hover hiện "Đăng Xuất" */}
      <div className="avatar-logout-wrapper" style={styles.topRightAvatarWrapper}>
        <img src={avatarUrl} alt="avatar" style={styles.topRightAvatar} />
        <div className="avatar-logout-tag" style={styles.logoutTag} onClick={onLogout}>
          Đăng Xuất
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          {/* Hàng: nút Sửa hồ sơ + avatar lớn + tên */}
          <div style={styles.profileHeader}>
            <button className="btn-glow" style={styles.editBtn} onClick={() => setShowEditProfile(true)}>
              Sửa hồ sơ
            </button>
            <img src={avatarUrl} alt="avatar lớn" style={styles.bigAvatar} />
            <div>
              <h2 style={styles.profileName}>{profile.name}</h2>
              <p style={styles.profileEmail}>{profile.email}</p>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>Thông tin của tôi</h3>
          <div style={styles.profileGrid}>
            <Field label="Họ và tên" value={profile.name} />
            <Field label="Email" value={profile.email} />
            <Field label="Ngày sinh" value={profile.dob} />
            <Field label="Giới tính" value={profile.gender} />
            <Field label="Số điện thoại" value={profile.phone} />
            <Field label="Địa chỉ" value={profile.address} />
          </div>
        </div>
      </div>

      {/* Modal sửa hồ sơ */}
      {showEditProfile && (
        <div style={styles.modalOverlay} onClick={() => setShowEditProfile(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Sửa hồ sơ của tôi</h3>
              <span style={styles.modalClose} onClick={() => setShowEditProfile(false)}>✕</span>
            </div>

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
        </div>
      )}
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    position: 'relative',
  },
  topRightAvatarWrapper: {
    position: 'absolute',
    top: '20px',
    right: '32px',
    zIndex: 10,
  },
  topRightAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #007bff',
    cursor: 'pointer',
  },
  logoutTag: {
    position: 'absolute',
    right: 0,
    top: '52px',
    backgroundColor: '#fff',
    color: '#e05555',
    fontSize: '13px',
    fontWeight: 600,
    padding: '10px 16px',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  content: {
    padding: '80px 32px 32px',
    maxWidth: '700px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '14px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
    padding: '28px',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '26px',
    paddingBottom: '22px',
    borderBottom: '1px solid #f0f0f0',
  },
  editBtn: {
    border: '1px solid #007bff',
    color: '#007bff',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13.5px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  bigAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #007bff',
  },
  profileName: {
    margin: '0 0 4px 0',
    fontSize: '18px',
    color: '#333',
  },
  profileEmail: {
    margin: 0,
    fontSize: '13px',
    color: '#888',
  },
  sectionTitle: {
    margin: '0 0 14px 0',
    fontSize: '15px',
    color: '#333',
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
  label: {
    fontSize: '12.5px',
    color: '#666',
    marginBottom: '6px',
    display: 'block',
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
    width: '100%',
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

export default Dashboard2