import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ReminderList = ({ reminders, setReminders, setEditing }) => {
  const { user } = useAuth();

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reminder?')) return;
    try {
      await axiosInstance.delete(`/api/reminders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setReminders(reminders.filter((r) => r._id !== id));
    } catch (error) {
      alert('Failed to delete reminder.');
    }
  };

  if (reminders.length === 0) {
    return <p className="text-gray-500">No reminders yet. Schedule one above.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {reminders.map((r) => (
        <div key={r._id} className="bg-gray-50 border p-4 rounded shadow-sm">
          <h2 className="font-bold text-lg">{r.medication?.name || 'Medication'}</h2>
          <p className="text-sm text-gray-700">
            {r.frequency} · {(r.times || []).join(', ') || 'no times set'}
          </p>
          <p className="text-xs text-gray-400">
            From {new Date(r.startDate).toLocaleDateString()}
            {r.endDate ? ` to ${new Date(r.endDate).toLocaleDateString()}` : ''}
          </p>
          {r.notes && <p className="text-sm text-gray-500 mt-1">{r.notes}</p>}
          <div className="mt-3">
            <button onClick={() => setEditing(r)} className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm">Edit</button>
            <button onClick={() => handleDelete(r._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReminderList;
