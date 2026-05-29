import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const todayStr = () => new Date().toISOString().slice(0, 10);
const EMPTY = { medication: '', times: '', frequency: 'daily', startDate: todayStr(), endDate: '', notes: '' };

// Create/Update form for a reminder schedule. `medications` is the dropdown source.
const ReminderForm = ({ medications, reminders, setReminders, editing, setEditing }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(EMPTY);

  useEffect(() => {
    if (editing) {
      setFormData({
        medication: editing.medication?._id || editing.medication || '',
        times: (editing.times || []).join(', '),
        frequency: editing.frequency || 'daily',
        startDate: editing.startDate ? editing.startDate.slice(0, 10) : todayStr(),
        endDate: editing.endDate ? editing.endDate.slice(0, 10) : '',
        notes: editing.notes || '',
      });
    } else {
      setFormData(EMPTY);
    }
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert the comma-separated "HH:mm" string into the array the API expects.
    const payload = {
      ...formData,
      times: formData.times.split(',').map((t) => t.trim()).filter(Boolean),
      endDate: formData.endDate || undefined,
    };
    try {
      const auth = { headers: { Authorization: `Bearer ${user.token}` } };
      if (editing) {
        const res = await axiosInstance.put(`/api/reminders/${editing._id}`, payload, auth);
        setReminders(reminders.map((r) => (r._id === res.data._id ? res.data : r)));
      } else {
        const res = await axiosInstance.post('/api/reminders', payload, auth);
        setReminders([res.data, ...reminders]);
      }
      setEditing(null);
      setFormData(EMPTY);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save reminder.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editing ? 'Edit Reminder' : 'Add Reminder'}</h1>
      <select
        value={formData.medication}
        onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
        className="w-full mb-4 p-2 border rounded" required
      >
        <option value="">Select medication…</option>
        {medications.map((m) => (
          <option key={m._id} value={m._id}>{m.name} ({m.dosage})</option>
        ))}
      </select>
      <input
        type="text" placeholder="Times, e.g. 08:00, 20:00" value={formData.times}
        onChange={(e) => setFormData({ ...formData, times: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <select
        value={formData.frequency}
        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      >
        {['daily', 'weekly', 'as-needed'].map((f) => <option key={f} value={f}>{f}</option>)}
      </select>
      <label className="block text-sm text-gray-600">Start date</label>
      <input
        type="date" value={formData.startDate}
        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded" required
      />
      <label className="block text-sm text-gray-600">End date (optional)</label>
      <input
        type="date" value={formData.endDate}
        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text" placeholder="Notes" value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">{editing ? 'Update' : 'Add'}</button>
        {editing && (
          <button type="button" onClick={() => setEditing(null)} className="flex-1 bg-gray-400 text-white p-2 rounded">Cancel</button>
        )}
      </div>
    </form>
  );
};

export default ReminderForm;
