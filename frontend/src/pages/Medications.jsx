import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import MedicationForm from '../components/MedicationForm';
import MedicationList from '../components/MedicationList';
import { useAuth } from '../context/AuthContext';

const Medications = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const res = await axiosInstance.get('/api/medications', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMedications(res.data);
      } catch (error) {
        alert('Failed to fetch medications.');
      }
    };
    if (user) fetchMedications();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <MedicationForm
        medications={medications}
        setMedications={setMedications}
        editing={editing}
        setEditing={setEditing}
      />
      <MedicationList medications={medications} setMedications={setMedications} setEditing={setEditing} />
    </div>
  );
};

export default Medications;
