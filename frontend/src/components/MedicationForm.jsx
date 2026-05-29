import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const EMPTY = { name: '', dosage: '', form: 'tablet', instructions: '', prescriber: '', quantity: 0 };

// Create/Update form for a medication. Reused for both operations: when `editing`
// is set the form pre-fills and submits a PUT; otherwise it POSTs a new record.
const MedicationForm = ({ medications, setMedications, editing, setEditing }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(EMPTY);

  useEffect(() => {
    setFormData(editing ? { ...EMPTY, ...editing } : EMPTY);
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = { headers: { Authorization: `Bearer ${user.token}` } };
      if (editing) {
        const res = await axiosInstance.put(`/api/medications/${editing._id}`, formData, auth);
        setMedications(medications.map((m) => (m._id === res.data._id ? res.data : m)));
      } else {
        const res = await axiosInstance.post('/api/medications', formData, auth);
        setMedications([res.data, ...medications]);
      }
      setEditing(null);
      setFormData(EMPTY);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save medication.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editing ? 'Edit Medication' : 'Add Medication'}</h1>
      <input
        type="text" placeholder="Name (e.g. Metformin)" value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded" required
      />
      <input
        type="text" placeholder="Dosage (e.g. 500 mg)" value={formData.dosage}
        onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
        className="w-full mb-4 p-2 border rounded" required
      />
      <select
        value={formData.form}
        onChange={(e) => setFormData({ ...formData, form: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      >
        {['tablet', 'capsule', 'liquid', 'injection', 'inhaler', 'other'].map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
      <input
        type="text" placeholder="Instructions (e.g. Take with food)" value={formData.instructions}
        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text" placeholder="Prescriber" value={formData.prescriber}
        onChange={(e) => setFormData({ ...formData, prescriber: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number" placeholder="Quantity on hand" value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
        className="w-full mb-4 p-2 border rounded"
      />
      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">
          {editing ? 'Update' : 'Add'}
        </button>
        {editing && (
          <button type="button" onClick={() => setEditing(null)} className="flex-1 bg-gray-400 text-white p-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default MedicationForm;
