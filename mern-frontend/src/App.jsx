import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch backend status
    fetch('http://localhost:5000/')
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => console.error('Error fetching backend status:', err));

    // Fetch users from API
    fetch('http://localhost:5000/api/users')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Users data received:', data);
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>MERN Stack App (Vite)</h1>
      <p>Backend says: {message}</p>
      
      <hr />
      
      <h2>Users List</h2>
      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <div>
          <p>Total users: {users.length}</p>
          {users.length > 0 ? (
            <ul>
              {users.map((user, index) => (
                <li key={index}>{user.name || user.email || JSON.stringify(user)}</li>
              ))}
            </ul>
          ) : (
            <p>No users found. The API is working but returned an empty array.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
