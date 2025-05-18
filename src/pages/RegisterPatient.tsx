import { useState } from 'react';
import { useDbActions } from '@/utils/useDbActions';

export const RegisterPatient = () => {
  const { registerPatient } = useDbActions();
  //   const patients = useLivePatients();
  //   console.log(patients);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    medicalHistory: '',
    allergies: '',
    email: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    insuranceNumber: '',
    insuranceProvider: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.age ||
      !formData.gender ||
      !formData.dateOfBirth
    ) {
      alert('First and Last name and age and gender and date of birth are required');
      return;
    }

    try {
      await registerPatient({
        firstname: formData.firstName,
        lastname: formData.lastName,
        age: parseInt(formData.age),
        gender: formData.gender,
        dateOfBirth: new Date(formData.dateOfBirth),
        address: formData.address || null,
        medicalHistory: formData.medicalHistory || null,
        allergies: formData.allergies || null,
        email: formData.email || null,
        emergencyContactName: formData.emergencyContactName || null,
        emergencyContactNumber: formData.emergencyContactNumber || null,
        insuranceNumber: formData.insuranceNumber || null,
        insuranceProvider: formData.insuranceProvider || null,
      });

      alert('Patient registered!');
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        medicalHistory: '',
        allergies: '',
        email: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        insuranceNumber: '',
        insuranceProvider: '',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to register patient.');
    }
  };

  return (
    <div>
      <h2>Register New Patient</h2>

      <input
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
      />
      <input
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
      />
      <input
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
        type="number"
      />
      <input name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" />
      <input
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        type="date"
        placeholder="Date of Birth"
      />
      <input
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
      />
      <input
        name="medicalHistory"
        value={formData.medicalHistory}
        onChange={handleChange}
        placeholder="Medical History"
      />
      <input
        name="allergies"
        value={formData.allergies}
        onChange={handleChange}
        placeholder="Allergies"
      />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      <input
        name="emergencyContactName"
        value={formData.emergencyContactName}
        onChange={handleChange}
        placeholder="Emergency Contact Name"
      />
      <input
        name="emergencyContactNumber"
        value={formData.emergencyContactNumber}
        onChange={handleChange}
        placeholder="Emergency Contact Number"
      />
      <input
        name="insuranceNumber"
        value={formData.insuranceNumber}
        onChange={handleChange}
        placeholder="Insurance Number"
      />
      <input
        name="insuranceProvider"
        value={formData.insuranceProvider}
        onChange={handleChange}
        placeholder="Insurance Provider"
      />

      <button onClick={handleRegister}>Register Patient</button>
    </div>
  );
};
