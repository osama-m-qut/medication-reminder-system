import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

// Admin panel: system stats + user management (promote/demote/delete).
// Guarded both by the role-gated nav link and by the backend admin middleware.
const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);

  const auth = { headers: { Authorization: `Bearer ${user?.token}` } };

  const load = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        axiosInstance.get('/api/admin/users', auth),
        axiosInstance.get('/api/admin/stats', auth),
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      alert('Admin access required.');
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleRole = async (u) => {
    try {
      const role = u.role === 'admin' ? 'user' : 'admin';
      const res = await axiosInstance.put(`/api/admin/users/${u._id}`, { role }, auth);
      setUsers(users.map((x) => (x._id === u._id ? { ...x, role: res.data.role } : x)));
    } catch (error) {
      alert('Failed to update role.');
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axiosInstance.delete(`/api/admin/users/${id}`, auth);
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user.');
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Stat label="Users" value={stats.userCount} />
          <Stat label="Medications" value={stats.medicationCount} />
          <Stat label="Reminders" value={stats.reminderCount} />
          <Stat label="Overall adherence" value={`${stats.adherence}%`} />
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-3">Users</h2>
      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-100 text-left text-sm">
          <tr>
            <th className="p-3">Name</th><th className="p-3">Email</th>
            <th className="p-3">Role</th><th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t text-sm">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}>{u.role}</span>
              </td>
              <td className="p-3 space-x-2">
                <button onClick={() => toggleRole(u)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                  {u.role === 'admin' ? 'Demote' : 'Promote'}
                </button>
                <button onClick={() => removeUser(u._id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="bg-white border p-4 rounded shadow-sm">
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export default Admin;
