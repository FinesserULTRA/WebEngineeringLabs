import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/users');
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data.data || []);
      setBackendStatus('connected');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
      setBackendStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Check backend connection every 5 seconds
    const interval = setInterval(() => {
      fetch('http://localhost:5000/')
        .then(() => setBackendStatus('connected'))
        .catch(() => setBackendStatus('disconnected'));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>MERN Users</h1>
        <div className="status-badge">
          <span className={`status-dot ${backendStatus}`}></span>
          <span className="status-text">
            {backendStatus === 'connected' ? 'Backend Connected' : 
             backendStatus === 'disconnected' ? 'Backend Offline' : 
             'Checking...'}
          </span>
        </div>
      </header>

      <main className="main">
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Loading users...</p>
          </div>
        )}

        {error && (
          <div className="error-card">
            <h2>⚠️ Connection Error</h2>
            <p>{error}</p>
            <p className="error-hint">
              Make sure the backend server is running on port 5000
            </p>
            <button onClick={fetchUsers} className="retry-btn">
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="users-header">
              <h2>Users ({users.length})</h2>
              <button onClick={fetchUsers} className="refresh-btn">
                ↻ Refresh
              </button>
            </div>

            {users.length > 0 ? (
              <div className="users-grid">
                {users.map((user) => (
                  <div key={user.id} className="user-card">
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <p className="user-email">{user.email}</p>
                      <span className={`user-role ${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No users found</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
