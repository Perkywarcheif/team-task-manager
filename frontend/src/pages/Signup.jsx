import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', form);
      nav('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Sign Up</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={submit}>
          <input style={styles.input} placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input style={styles.input} placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input style={styles.input} type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <button style={styles.btn} type="submit">Sign Up</button>
        </form>
        <p>Have account? <Link to="/login">Login</Link></p>
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