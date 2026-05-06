import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const { data } = await api.get('/projects');
    setProjects(data);
  };

  const createProject = async (e) => {
    e.preventDefault();
    await api.post('/projects', form);
    setForm({ name: '', description: '' });
    fetchProjects();
  };

  const logout = () => { localStorage.clear(); nav('/login'); };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>👋 Welcome, {user?.name}</h2>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>
      <div style={styles.card}>
        <h3>Create New Project</h3>
        <form onSubmit={createProject}>
          <input style={styles.input} placeholder="Project Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input style={styles.input} placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <button style={styles.btn} type="submit">Create</button>
        </form>
      </div>
      <h3>My Projects</h3>
      <div style={styles.grid}>
        {projects.map(p => (
          <div key={p.id} style={styles.projectCard} onClick={() => nav(`/projects/${p.id}`)}>
            <h4>{p.name}</h4>
            <p>{p.description}</p>
            <span style={styles.badge}>{p.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth:'800px', margin:'0 auto', padding:'2rem' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  card: { background:'white', padding:'1.5rem', borderRadius:'8px', marginBottom:'1.5rem', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
  input: { width:'100%', padding:'0.6rem', margin:'0.4rem 0', borderRadius:'4px', border:'1px solid #ccc', boxSizing:'border-box' },
  btn: { padding:'0.6rem 1.2rem', background:'#4f46e5', color:'white', border:'none', borderRadius:'4px', cursor:'pointer' },
  logoutBtn: { padding:'0.5rem 1rem', background:'#ef4444', color:'white', border:'none', borderRadius:'4px', cursor:'pointer' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1rem' },
  projectCard: { background:'white', padding:'1rem', borderRadius:'8px', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
  badge: { background:'#e0e7ff', color:'#4f46e5', padding:'2px 8px', borderRadius:'12px', fontSize:'0.75rem' }
};