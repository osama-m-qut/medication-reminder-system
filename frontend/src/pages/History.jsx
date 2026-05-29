import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

// Dose history: the Read view over DoseLog records, with the ability to delete entries.
const History = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);

  const auth = { headers: { Authorization: `Bearer ${user?.token}` } };

  const load = async () => {
    try {
      const res = await axiosInstance.get('/api/doselogs', auth);
      setLogs(res.data);
    } catch (error) {
      alert('Failed to load history.');
    }
  };

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const remove = async (id) => {
    try {
      await axiosInstance.delete(`/api/doselogs/${id}`, auth);
      setLogs(logs.filter((l) => l._id !== id));
    } catch (error) {
      alert('Failed to delete entry.');
    }
  };

  const badge = (status) => ({
    taken: 'bg-green-100 text-green-800',
    skipped: 'bg-yellow-100 text-yellow-800',
    missed: 'bg-red-100 text-red-800',
    scheduled: 'bg-gray-100 text-gray-800',
  }[status] || 'bg-gray-100');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Dose History</h1>
      {logs.length === 0 ? (
        <p className="text-gray-500">No dose history yet.</p>
      ) : (
        <table className="w-full bg-white shadow rounded overflow-hidden">
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="p-3">Medication</th>
              <th className="p-3">Scheduled</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l._id} className="border-t text-sm">
                <td className="p-3">{l.medication?.name || '—'}</td>
                <td className="p-3">{new Date(l.scheduledTime).toLocaleString()}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${badge(l.status)}`}>{l.status}</span></td>
                <td className="p-3">
                  <button onClick={() => remove(l._id)} className="text-red-500 text-xs underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;
