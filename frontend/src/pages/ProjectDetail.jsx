import { useEffect, useState } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProjectDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [taskForm, setTaskForm] = useState({ title:'', description:'', due_date:'', priority:'medium', assigned_to:'' });
  const [memberEmail, setMemberEmail] = useState('');
  const [role, setRole] = useState('member');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [t, m, s] = await Promise.all([
      api.get(`/tasks/project/${id}`),
      api.get(`/projects/${id}/members`),
      api.get(`/tasks/dashboard/${id}`)
    ]);
    setTasks(t.data);
    setMembers(m.data);
    setStats(s.data);
    const me = m.data.find(x => x.id === user.id);
    if (me) setRole(me.role);
  };

  const createTask = async (e) => {
    e.preventDefault();
    await api.post('/tasks', { ...taskForm, project_id: id });
    setTaskForm({ title:'', description:'', due_date:'', priority:'medium', assigned_to:'' });
    fetchAll();
  };

  const updateStatus = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}/status`, { status });
    fetchAll();
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    fetchAll();
  };

  const addMember = async (e) => {
    e.preventDefault();
    await api.post(`/projects/${id}/members`, { email: memberEmail });
    setMemberEmail('');
    fetchAll();
  };

  const removeMember = async (userId) => {
    await api.delete(`/projects/${id}/members/${userId}`);
    fetchAll();
  };

  const statusColor = { todo:'#fbbf24', inprogress:'#3b82f6', done:'#10b981' };

  return (
    <div style={styles.container}>
      <button onClick={() => nav('/projects')} style={styles.back}>← Back</button>
      {stats && (
        <div style={styles.statsRow}>
          <div style={styles.stat}><b>{stats.total}</b><span>Total</span></div>
          {stats.byStatus.map(s => (
            <div key={s.status} style={styles.stat}><b>{s.count}</b><span>{s.status}</span></div>
          ))}
          <div style={styles.stat}><b style={{color:'red'}}>{stats.overdue}</b><span>Overdue</span></div>
        </div>
      )}
      <div style={styles.cols}>
        <div style={{flex:2}}>
          {role === 'admin' && (
            <div style={styles.card}>
              <h3>Create Task</h3>
              <form onSubmit={createTask}>
                <input style={styles.input} placeholder="Title" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title:e.target.value})} required />
                <input style={styles.input} placeholder="Description" value={taskForm.description} onChange={e => setTaskForm({...taskForm, description:e.target.value})} />
                <input style={styles.input} type="date" value={taskForm.due_date} onChange={e => setTaskForm({...taskForm, due_date:e.target.value})} />
                <select style={styles.input} value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority:e.target.value})}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <select style={styles.input} value={taskForm.assigned_to} onChange={e => setTaskForm({...taskForm, assigned_to:e.target.value})}>
                  <option value="">Assign to...</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <button style={styles.btn} type="submit">Add Task</button>
              </form>
            </div>
          )}
          <h3>Tasks</h3>
          {tasks.map(t => (
            <div key={t.id} style={styles.taskCard}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <b>{t.title}</b>
                <span style={{...styles.badge, background: statusColor[t.status]}}>{t.status}</span>
              </div>
              <p style={{fontSize:'0.85rem', color:'#555'}}>{t.description}</p>
              <div style={{fontSize:'0.8rem', color:'#888'}}>
                📅 {t.due_date?.split('T')[0]} | 👤 {t.assigned_name} | ⚡ {t.priority}
              </div>
              <div style={{marginTop:'0.5rem', display:'flex', gap:'0.4rem', flexWrap:'wrap'}}>
                {['todo','inprogress','done'].map(s => (
                  <button key={s} onClick={() => updateStatus(t.id, s)} style={{...styles.smallBtn, background: t.status===s?'#4f46e5':'#e5e7eb', color: t.status===s?'white':'black'}}>{s}</button>
                ))}
                {role === 'admin' && <button onClick={() => deleteTask(t.id)} style={{...styles.smallBtn, background:'#ef4444', color:'white'}}>Delete</button>}
              </div>
            </div>
          ))}
        </div>
        <div style={{flex:1}}>
          <div style={styles.card}>
            <h3>Members</h3>
            {role === 'admin' && (
              <form onSubmit={addMember}>
                <input style={styles.input} placeholder="Member email" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} />
                <button style={styles.btn} type="submit">Add</button>
              </form>
            )}
            {members.map(m => (
              <div key={m.id} style={styles.memberRow}>
                <span>{m.name} <small>({m.role})</small></span>
                {role === 'admin' && m.id !== user.id && (
                  <button onClick={() => removeMember(m.id)} style={styles.removeBtn}>✕</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth:'1000px', margin:'0 auto', padding:'1.5rem' },
  back: { background:'none', border:'none', cursor:'pointer', color:'#4f46e5', fontSize:'1rem', marginBottom:'1rem' },
  statsRow: { display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' },
  stat: { background:'white', padding:'1rem', borderRadius:'8px', textAlign:'center', minWidth:'80px', boxShadow:'0 2px 6px rgba(0,0,0,0.08)', display:'flex', flexDirection:'column' },
  cols: { display:'flex', gap:'1.5rem', alignItems:'flex-start' },
  card: { background:'white', padding:'1rem', borderRadius:'8px', marginBottom:'1rem', boxShadow:'0 2px 6px rgba(0,0,0,0.08)' },
  input: { width:'100%', padding:'0.5rem', margin:'0.3rem 0', borderRadius:'4px', border:'1px solid #ccc', boxSizing:'border-box' },
  btn: { padding:'0.5rem 1rem', background:'#4f46e5', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', marginTop:'0.3rem' },
  taskCard: { background:'white', padding:'1rem', borderRadius:'8px', marginBottom:'0.8rem', boxShadow:'0 2px 6px rgba(0,0,0,0.08)' },
  badge: { padding:'2px 8px', borderRadius:'12px', fontSize:'0.75rem', color:'white' },
  smallBtn: { padding:'3px 8px', borderRadius:'4px', border:'none', cursor:'pointer', fontSize:'0.75rem' },
  memberRow: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.4rem 0', borderBottom:'1px solid #f0f0f0' },
  removeBtn: { background:'none', border:'none', cursor:'pointer', color:'#ef4444' }
};