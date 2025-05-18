import { useState } from 'react';
import { useDbActions } from '@/utils/useDbActions';

export const RegisterPatient = () => {
  const { registerPatient, useLivePatients } = useDbActions();
  const patients = useLivePatients();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    if (!formData.name) {
      alert('Name is required');
      return;
    }

    try {
      await registerPatient({
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender,
      });
      alert('Patient registered!');
      setFormData({ name: '', age: '', gender: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to register patient.');
    }
  };

  return (
    <div>
      <h2>Register New Patient</h2>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Patient Name" />
      <input
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
        type="number"
      />
      <input name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" />
      <button onClick={handleRegister}>Register Patient</button>

      <h3>Patient List (Live)</h3>
      {patients?.rows.length === 0 ? (
        <p>No patients registered yet.</p>
      ) : (
        <ul>
          {patients?.rows.map((patient) => (
            <li key={patient.id}>
              {patient.name} ({patient.age ?? 'N/A'} yrs, {patient.gender ?? 'N/A'})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
