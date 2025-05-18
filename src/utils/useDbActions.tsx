import { usePGlite, useLiveIncrementalQuery } from '@electric-sql/pglite-react';
import type { PGliteWithLive } from '@electric-sql/pglite/live';
import { useEffect, useState } from 'react';

type Patient = {
  id: number;
  firstname: string;
  lastname: string;
  age: number;
  gender: string;
  dateOfBirth: Date;
  address: string | null;
  medicalHistory: string | null;
  allergies: string | null;
  email: string | null;
  emergencyContactName: string | null;
  emergencyContactNumber: string | null;
  insuranceNumber: string | null;
  insuranceProvider: string | null;
};

const createPatientsTable = async (db: PGliteWithLive) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      dateOfBirth TEXT,
      address TEXT,
      medicalHistory TEXT,
      allergies TEXT,
      email TEXT,
      emergencyContactName TEXT,
      emergencyContactNumber TEXT,
      insuranceNumber TEXT,
      insuranceProvider TEXT
    );
  `);
};

export const useDbActions = () => {
  const db = usePGlite();
  const [isTableCreated, setIsTableCreated] = useState<boolean>(false);

  useEffect(() => {
    createPatientsTable(db).then(() => {
      setIsTableCreated(true);
      console.log('Table created');
    });
  }, [db]);

  const escapeText = (text: string) => text.replace(/'/g, "''");

  const registerPatient = async (formData: Omit<Patient, 'id'>) => {
    if (!isTableCreated) throw new Error('Table not created');

    const escape = (val: string | null) => (val ? `'${escapeText(val)}'` : 'NULL');
    const formatDate = (date: Date | null) => (date ? `'${date.toISOString()}'` : 'NULL');

    await db.query(`
      INSERT INTO patients (
        firstName, lastName, age, gender, dateOfBirth, address, medicalHistory,
        allergies, email, emergencyContactName, emergencyContactNumber,
        insuranceNumber, insuranceProvider
      ) VALUES (
        ${escape(formData.firstname)},
        ${escape(formData.lastname)},
        ${formData.age ?? 'NULL'},
        ${escape(formData.gender)},
        ${formatDate(formData.dateOfBirth)},
        ${escape(formData.address)},
        ${escape(formData.medicalHistory)},
        ${escape(formData.allergies)},
        ${escape(formData.email)},
        ${escape(formData.emergencyContactName)},
        ${escape(formData.emergencyContactNumber)},
        ${escape(formData.insuranceNumber)},
        ${escape(formData.insuranceProvider)}
      );
    `);
  };

  function useLivePatients(columns: string, conditions: string) {
    const queryResults = useLiveIncrementalQuery(
      `
         SELECT ${columns}, id as _id
         FROM patients
         ${conditions};
      `,
      [],
      '_id',
    );
    if (!queryResults) return null;
    return {
      fields: queryResults.fields,
      rows: queryResults.rows,
    };
  }

  return {
    registerPatient,
    useLivePatients,
  };
};
