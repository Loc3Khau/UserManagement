import { useRef, useState } from 'react'

const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg']

// Màn hình bắt buộc người dùng cập nhật ảnh đại diện sau khi đăng nhập thành công.
// Dùng chung cho cả Dashboard1 (Admin) và Dashboard2 (User).
function AvatarUploadGate({ onUploaded, name }) {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Bạn chọn sai kiểu ảnh')
      e.target.value = ''
      return
    }
    if (file.size > MAX_SIZE) {
      alert('Bạn chọn ảnh nhiều dung lượng quá')
      e.target.value = ''
      return
    }

    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  const handleConfirm = () => {
    if (!preview) {
      alert('Bạn chưa chọn ảnh đại diện!')
      return
    }
    onUploaded(preview)
  }

  return (
    <div style={styles.container}>
      <style>{`
        .btn-glow {
          transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
        }
        .btn-glow:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 123, 255, 0.45), 0 0 18px rgba(0, 153, 255, 0.5);
          filter: brightness(1.05);
        }
        .avatar-drop {
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .avatar-drop:hover {
          border-color: #007bff;
          transform: translateY(-2px);
        }
      `}</style>

      <div style={styles.card}>
        <h2 style={styles.title}>Cập nhật ảnh đại diện</h2>
        <p style={styles.subtitle}>
          {name ? `Chào ${name}, vui` : 'Vui'} lòng chọn ảnh đại diện (PNG, JPG, JPEG, tối đa 2MB) để tiếp tục.
        </p>

        <label className="avatar-drop" style={styles.avatarDrop}>
          {preview ? (
            <img src={preview} alt="avatar preview" style={styles.previewImg} />
          ) : (
            <span style={styles.avatarPlaceholder}>+</span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>

        <p style={styles.hint}>Bấm vào khung trên để chọn ảnh</p>

        <button className="btn-glow" style={styles.btnPrimary} onClick={handleConfirm}>
          Tiếp tục
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  card: {
    width: '400px',
    padding: '45px 40px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  title: {
    margin: '0 0 8px 0',
    color: '#333',
    fontSize: '24px',
  },
  subtitle: {
    margin: '0 0 28px 0',
    color: '#666',
    fontSize: '13.5px',
    lineHeight: 1.5,
  },
  avatarDrop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '140px',
    height: '140px',
    margin: '0 auto',
    borderRadius: '50%',
    border: '2px dashed #bbb',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    fontSize: '48px',
    color: '#bbb',
    fontWeight: 300,
  },
  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  hint: {
    margin: '14px 0 26px 0',
    fontSize: '12px',
    color: '#999',
  },
  btnPrimary: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #2f9bff, #007bff)',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
  },
}

export default AvatarUploadGate