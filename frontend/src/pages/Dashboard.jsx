import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

// Patient home screen: shows adherence at a glance and the active reminders,
// with one-tap buttons to log each scheduled dose as taken or skipped.
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [adherence, setAdherence] = useState(null);

  const auth = { headers: { Authorization: `Bearer ${user?.token}` } };

  const load = useCallback(async () => {
    try {
      const [remRes, adhRes] = await Promise.all([
        axiosInstance.get('/api/reminders', auth),
        axiosInstance.get('/api/doselogs/adherence', auth),
      ]);
      setReminders(remRes.data.filter((r) => r.active !== false));
      setAdherence(adhRes.data);
    } catch (error) {
      alert('Failed to load dashboard.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    load();
  }, [user, load, navigate]);

  const logDose = async (reminder, time, status) => {
    try {
      await axiosInstance.post('/api/doselogs', {
        medication: reminder.medication?._id || reminder.medication,
        reminder: reminder._id,
        scheduledTime: new Date(),
        status,
        notes: time ? `Scheduled ${time}` : undefined,
      }, auth);
      load(); // refresh adherence
    } catch (error) {
      alert('Failed to log dose.');
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>

      {adherence && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Stat label="Adherence" value={`${adherence.adherence}%`} color="bg-green-100 text-green-800" />
          <Stat label="Taken" value={adherence.taken} color="bg-blue-100 text-blue-800" />
          <Stat label="Skipped" value={adherence.skipped} color="bg-yellow-100 text-yellow-800" />
          <Stat label="Missed" value={adherence.missed} color="bg-red-100 text-red-800" />
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-3">Today's Schedule</h2>
      {reminders.length === 0 ? (
        <p className="text-gray-500">No active reminders. Add medications and reminders to get started.</p>
      ) : (
        <div className="space-y-4">
          {reminders.map((r) => (
            <div key={r._id} className="bg-white border p-4 rounded shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{r.medication?.name || 'Medication'}</h3>
                  <p className="text-sm text-gray-500">
                    {r.frequency} · {(r.times || []).join(', ') || 'no set times'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => logDose(r, (r.times || [])[0], 'taken')} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Mark Taken</button>
                  <button onClick={() => logDose(r, (r.times || [])[0], 'skipped')} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Skip</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value, color }) => (
  <div className={`p-4 rounded shadow-sm ${color}`}>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm">{label}</p>
  </div>
);

export default Dashboard;
