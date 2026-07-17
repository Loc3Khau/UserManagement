import { useState } from 'react'

function Dashboard({ onLogout }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={styles.container}>
      <style>{`
        .logout-btn {
          transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
        }
        .logout-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 123, 255, 0.45), 0 0 18px rgba(0, 153, 255, 0.5);
          filter: brightness(1.05);
        }
      `}</style>

      <div style={styles.card}>
        <h1 style={styles.title}>Chào mừng đến Dashboard 🎉</h1>
        <p style={styles.subtitle}>Bạn đã đăng nhập thành công vào hệ thống.</p>

        <button
          className="logout-btn"
          style={styles.logoutBtn}
          onClick={onLogout}
        >
          Đăng xuất
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
    padding: '50px 40px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
    textAlign: 'center',
  },
  title: {
    margin: '0 0 10px 0',
    color: '#333',
    fontSize: '24px',
  },
  subtitle: {
    margin: '0 0 30px 0',
    color: '#666',
    fontSize: '14px',
  },
  logoutBtn: {
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

export default Dashboard