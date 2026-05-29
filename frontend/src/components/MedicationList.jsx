import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const MedicationList = ({ medications, setMedications, setEditing }) => {
  const { user } = useAuth();

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this medication?')) return;
    try {
      await axiosInstance.delete(`/api/medications/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMedications(medications.filter((m) => m._id !== id));
    } catch (error) {
      alert('Failed to delete medication.');
    }
  };

  if (medications.length === 0) {
    return <p className="text-gray-500">No medications yet. Add your first one above.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {medications.map((m) => (
        <div key={m._id} className="bg-gray-50 border p-4 rounded shadow-sm">
          <div className="flex justify-between items-start">
            <h2 className="font-bold text-lg">{m.name}</h2>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{m.form}</span>
          </div>
          <p className="text-sm text-gray-700">{m.dosage}</p>
          {m.instructions && <p className="text-sm text-gray-500 mt-1">{m.instructions}</p>}
          {m.prescriber && <p className="text-xs text-gray-400 mt-1">Prescribed by {m.prescriber}</p>}
          <p className="text-xs text-gray-400">On hand: {m.quantity}</p>
          <div className="mt-3">
            <button onClick={() => setEditing(m)} className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm">Edit</button>
            <button onClick={() => handleDelete(m._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicationList;
