import { useState } from 'react'
import Dashboard1 from './Dashboard1'
import Dashboard2 from './Dashboard2'

// Chỉ cho phép chữ cái (kể cả có dấu tiếng Việt) và khoảng trắng
const NAME_REGEX = /^[\p{L}\s]*$/u
// Bắt buộc: chữ thường, chữ hoa, số, ký tự đặc biệt, tối thiểu 8 ký tự
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]/;'])[^\s]{8,}$/
// Email cơ bản
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Số điện thoại: chỉ chữ số, 9-11 số
const PHONE_REGEX = /^[0-9]{9,11}$/

function EyeIcon({ visible }) {
  return visible ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.6 18.6 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [page, setPage] = useState('auth') // 'auth' | 'dashboard1' | 'dashboard2'

  // State cho form đăng nhập
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  // State cho form đăng ký
  const [regName, setRegName] = useState('')
  const [regDob, setRegDob] = useState('')
  const [regGender, setRegGender] = useState('')
  const [regAddress, setRegAddress] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [showRegPassword, setShowRegPassword] = useState(false)

  // Không lọc ký tự khi đang gõ vì các bộ gõ tiếng Việt (Unikey, VNI...) mô
  // phỏng phím Backspace + gõ lại ở tầng hệ điều hành, không qua composition
  // chuẩn của trình duyệt -> lọc theo từng ký tự sẽ làm rớt chữ khi gõ dấu.
  // Định dạng tên chỉ được kiểm tra khi bấm nút "Tạo tài khoản" (xem handleRegisterClick).

  const handlePhoneChange = (e) => {
    const value = e.target.value
    // Chỉ cho phép nhập số
    if (/^[0-9]*$/.test(value)) {
      setRegPhone(value)
    }
  }

  const handleLoginClick = () => {
    if (loginEmail.trim() === '' && loginPassword.trim() === '') {
      alert('bạn đã nhập chi mô ??')
      return
    }
    if (loginEmail.trim() === '' || loginPassword.trim() === '') {
      alert('Vui lòng nhập đầy đủ thông tin!')
      return
    }
    if (!EMAIL_REGEX.test(loginEmail)) {
      alert('Email không hợp lệ!')
      return
    }
    if (!PASSWORD_REGEX.test(loginPassword)) {
      alert('mật khẩu bạn yếu vãi!')
      return
    }
    // Đã thỏa mọi điều kiện -> xác định vai trò rồi chuyển trang phù hợp
    // Quy ước tạm: email có chứa "admin" -> vào Dashboard1 (Admin), còn lại -> Dashboard2 (User)
    const isAdmin = loginEmail.toLowerCase().includes('admin')
    setPage(isAdmin ? 'dashboard1' : 'dashboard2')
  }

  const handleRegisterClick = () => {
    const allEmpty =
      regName.trim() === '' &&
      regDob === '' &&
      regGender === '' &&
      regAddress.trim() === '' &&
      regPhone.trim() === '' &&
      regEmail.trim() === '' &&
      regPassword.trim() === ''
    if (allEmpty) {
      alert('bạn đã nhập chi mô ??')
      return
    }
    const anyEmpty =
      regName.trim() === '' ||
      regDob === '' ||
      regGender === '' ||
      regAddress.trim() === '' ||
      regPhone.trim() === '' ||
      regEmail.trim() === '' ||
      regPassword.trim() === ''
    if (anyEmpty) {
      alert('Vui lòng nhập đầy đủ thông tin!')
      return
    }
    if (!NAME_REGEX.test(regName.normalize('NFC'))) {
      alert('bạn đang nhập sai tên của mình')
      return
    }
    if (!PHONE_REGEX.test(regPhone)) {
      alert('Số điện thoại không hợp lệ!')
      return
    }
    if (!EMAIL_REGEX.test(regEmail)) {
      alert('Email không hợp lệ!')
      return
    }
    if (!PASSWORD_REGEX.test(regPassword)) {
      alert('mật khẩu bạn yếu vãi!')
      return
    }
    alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.')
  }

  const handleLogout = () => {
    setPage('auth')
    setLoginEmail('')
    setLoginPassword('')
  }

  if (page === 'dashboard1') {
    return <Dashboard1 loginEmail={loginEmail} onLogout={handleLogout} />
  }
  if (page === 'dashboard2') {
    return <Dashboard2 loginEmail={loginEmail} onLogout={handleLogout} />
  }

  return (
    <div style={styles.container}>
      {/* CSS cho hiệu ứng hover - inline style object không hỗ trợ pseudo-class */}
      <style>{`
        .btn-glow {
          position: relative;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
        }
        .btn-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%);
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .btn-glow:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 123, 255, 0.45), 0 0 18px rgba(0, 153, 255, 0.5);
          filter: brightness(1.05);
        }
        .btn-glow:hover::before {
          opacity: 1;
        }
        .btn-glow:active {
          transform: translateY(-1px);
        }
        .link-glow {
          transition: color 0.2s ease, text-shadow 0.2s ease, transform 0.2s ease;
          display: inline-block;
        }
        .link-glow:hover {
          color: #0056d6;
          text-shadow: 0 0 8px rgba(0, 123, 255, 0.45);
          transform: translateY(-2px);
        }
        .input-focus {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .input-focus:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0,123,255,0.15);
        }
        .eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease;
        }
        .eye-btn:hover {
          opacity: 0.7;
        }
        .gender-option {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ddd;
          background-color: #f9f9f9;
          cursor: pointer;
          font-size: 14px;
          color: #333;
          transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
        }
        .gender-option:hover {
          transform: translateY(-2px);
          border-color: #99c7ff;
        }
        .gender-option.selected {
          border-color: #007bff;
          background-color: #eaf3ff;
          color: #007bff;
          font-weight: bold;
        }
      `}</style>

      {/* Khung lớn cố định kích thước */}
      <div style={styles.cardWrapper}>

        {/* Khung chạy ngang chứa 2 form */}
        <div style={{
          ...styles.slidingContainer,
          transform: isLogin ? 'translateX(0%)' : 'translateX(-50%)'
        }}>

          {/* FORM 1: ĐĂNG NHẬP */}
          <div style={styles.formBox}>
            <h2 style={styles.title}>Đăng Nhập</h2>
            <p style={styles.subtitle}>Chào mừng bạn quay trở lại!</p>

            <input
              type="email"
              placeholder="Email của bạn"
              style={styles.input}
              className="input-focus"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <div style={styles.passwordWrapper}>
              <input
                type={showLoginPassword ? 'text' : 'password'}
                placeholder="Mật khẩu (Aa1@...)"
                style={styles.passwordInput}
                className="input-focus"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                style={styles.eyeButton}
                onClick={() => setShowLoginPassword((v) => !v)}
                aria-label={showLoginPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                <EyeIcon visible={showLoginPassword} />
              </button>
            </div>

            <button
              style={styles.btnPrimary}
              className="btn-glow"
              onClick={handleLoginClick}
            >
              Vào hệ thống
            </button>

            <p style={styles.switchText}>
              Chưa có tài khoản?{' '}
              <span style={styles.link} className="link-glow" onClick={() => setIsLogin(false)}>Đăng ký ngay</span>
            </p>
          </div>

          {/* FORM 2: ĐĂNG KÝ */}
          <div style={styles.formBoxScroll}>
            <h2 style={styles.title}>Tạo Tài Khoản</h2>
            <p style={styles.subtitle}>Tham gia cùng chúng tôi hôm nay</p>

            <input
              type="text"
              placeholder="Họ và tên"
              style={styles.input}
              className="input-focus"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
            />

            <input
              type="date"
              style={styles.input}
              className="input-focus"
              value={regDob}
              onChange={(e) => setRegDob(e.target.value)}
            />

            <div style={styles.genderRow}>
              <div
                className={`gender-option${regGender === 'nam' ? ' selected' : ''}`}
                onClick={() => setRegGender('nam')}
              >
                <span>Nam</span>
              </div>
              <div
                className={`gender-option${regGender === 'nữ' ? ' selected' : ''}`}
                onClick={() => setRegGender('nữ')}
              >
                <span>Nữ</span>
              </div>
            </div>

            <input
              type="text"
              placeholder="Địa chỉ"
              style={styles.input}
              className="input-focus"
              value={regAddress}
              onChange={(e) => setRegAddress(e.target.value)}
            />

            <input
              type="text"
              inputMode="numeric"
              placeholder="Số điện thoại"
              style={styles.input}
              className="input-focus"
              value={regPhone}
              onChange={handlePhoneChange}
            />

            <input
              type="email"
              placeholder="Email của bạn"
              style={styles.input}
              className="input-focus"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />

            <div style={styles.passwordWrapper}>
              <input
                type={showRegPassword ? 'text' : 'password'}
                placeholder="Mật khẩu (Aa1@...)"
                style={styles.passwordInput}
                className="input-focus"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                style={styles.eyeButton}
                onClick={() => setShowRegPassword((v) => !v)}
                aria-label={showRegPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                <EyeIcon visible={showRegPassword} />
              </button>
            </div>

            <p style={styles.hint}>
              Mật khẩu cần ít nhất 8 ký tự, gồm chữ thường, chữ HOA, số và ký tự đặc biệt (!@#$...).
            </p>

            <button
              style={styles.btnPrimary}
              className="btn-glow"
              onClick={handleRegisterClick}
            >
              Tạo tài khoản
            </button>

            <p style={styles.switchText}>
              Đã có tài khoản rồi?{' '}
              <span style={styles.link} className="link-glow" onClick={() => setIsLogin(true)}>Đăng nhập</span>
            </p>
          </div>

        </div>
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
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
  },
  cardWrapper: {
    width: '400px',
    height: '720px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    position: 'relative',
  },
  slidingContainer: {
    display: 'flex',
    width: '200%',
    height: '100%',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  formBox: {
    width: '50%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    boxSizing: 'border-box',
  },
  title: {
    margin: '0 0 5px 0',
    color: '#333',
    fontSize: '28px',
    textAlign: 'center'
  },
  subtitle: {
    margin: '0 0 25px 0',
    color: '#666',
    fontSize: '14px',
    textAlign: 'center'
  },
  formBoxScroll: {
    width: '50%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '28px 40px 36px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  genderRow: {
    width: '100%',
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  passwordWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: '15px',
  },
  passwordInput: {
    width: '100%',
    padding: '12px 44px 12px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  eyeButton: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  hint: {
    margin: '-4px 0 10px 0',
    fontSize: '11.5px',
    color: '#888',
    textAlign: 'center',
    lineHeight: 1.4,
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
    marginTop: '10px',
    boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
  },
  switchText: {
    marginTop: '25px',
    fontSize: '14px',
    color: '#666',
    textAlign: 'center'
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
}

export default App