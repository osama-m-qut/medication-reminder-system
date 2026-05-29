import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ReminderForm from '../components/ReminderForm';
import ReminderList from '../components/ReminderList';
import { useAuth } from '../context/AuthContext';

const Reminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [medications, setMedications] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = { headers: { Authorization: `Bearer ${user.token}` } };
        const [remRes, medRes] = await Promise.all([
          axiosInstance.get('/api/reminders', auth),
          axiosInstance.get('/api/medications', auth),
        ]);
        setReminders(remRes.data);
        setMedications(medRes.data);
      } catch (error) {
        alert('Failed to fetch reminders.');
      }
    };
    if (user) fetchData();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <ReminderForm
        medications={medications}
        reminders={reminders}
        setReminders={setReminders}
        editing={editing}
        setEditing={setEditing}
      />
      <ReminderList reminders={reminders} setReminders={setReminders} setEditing={setEditing} />
    </div>
  );
};

export default Reminders;
