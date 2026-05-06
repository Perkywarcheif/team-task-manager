import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      nav('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={submit}>
          <input style={styles.input} placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input style={styles.input} type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <button style={styles.btn} type="submit">Login</button>
        </form>
        <p>No account? <Link to="/signup">Signup</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f0f2f5' },
  card: { background:'white', padding:'2rem', borderRadius:'8px', width:'320px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)' },
  input: { width:'100%', padding:'0.6rem', margin:'0.4rem 0', borderRadius:'4px', border:'1px solid #ccc', boxSizing:'border-box' },
  btn: { width:'100%', padding:'0.7rem', background:'#4f46e5', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', marginTop:'0.5rem' },
  error: { color:'red', fontSize:'0.85rem' }
};