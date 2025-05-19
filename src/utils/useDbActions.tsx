import { usePGlite, useLiveIncrementalQuery } from '@electric-sql/pglite-react';
import type { PGliteWithLive } from '@electric-sql/pglite/live';
import { useEffect, useState } from 'react';

type Patient = {
  id: number;
  firstname: string;
  lastname: string;
  age: number;
  gender: string;
  dateofbirth: Date;
  address: string | null;
  medicalhistory: string | null;
  allergies: string | null;
  email: string | null;
  emergencycontactname: string | null;
  emergencycontactnumber: string | null;
  insurancenumber: string | null;
  insuranceprovider: string | null;
  registrationdate?: Date;
};

const createPatientsTable = async (db: PGliteWithLive) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender VARCHAR(10) NOT NULL,
      dateofbirth DATE NOT NULL,
      address TEXT,
      medicalhistory TEXT,
      allergies TEXT,
      email TEXT,
      emergencycontactname TEXT,
      emergencycontactnumber VARCHAR(15),
      insurancenumber TEXT,
      insuranceprovider TEXT,
      registrationdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    const now = `'${new Date().toISOString()}'`;

    await db.query(`
      INSERT INTO patients (
        firstname, lastname, age, gender, dateofbirth, address, medicalhistory,
        allergies, email, emergencycontactname, emergencycontactnumber,
        insurancenumber, insuranceprovider, registrationdate
      ) VALUES (
        ${escape(formData.firstname)},
        ${escape(formData.lastname)},
        ${formData.age ?? 'NULL'},
        ${escape(formData.gender)},
        ${formatDate(formData.dateofbirth)},
        ${escape(formData.address)},
        ${escape(formData.medicalhistory)},
        ${escape(formData.allergies)},
        ${escape(formData.email)},
        ${escape(formData.emergencycontactname)},
        ${escape(formData.emergencycontactnumber)},
        ${escape(formData.insurancenumber)},
        ${escape(formData.insuranceprovider)},
        ${now}
      );
    `);
  };

  const deletePatient = async (id: number) => {
    if (!isTableCreated) throw new Error('Table not created');
    await db.query(`DELETE FROM patients WHERE id = ${id};`);
  };

  const useLivePatientsQuery = (columns: string, conditions: string) => {
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
  };

  const useLivePatients = () => {
    const result = useLiveIncrementalQuery(`SELECT * FROM patients;`, [], 'id');
    if (!result) return null;
    return {
      fields: result.fields,
      rows: result.rows as Patient[],
    };
  };

  return {
    registerPatient,
    deletePatient,
    useLivePatientsQuery,
    useLivePatients,
  };
};
