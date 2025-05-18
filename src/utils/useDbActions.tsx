import { usePGlite, useLiveIncrementalQuery } from '@electric-sql/pglite-react';

type Patient = {
  id: number;
  name: string;
  age: number | null;
  gender: string | null;
};

export const useDbActions = () => {
  const db = usePGlite();

  const createPatientsTable = async () => {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER,
        gender TEXT
      );
    `);
  };

  const escapeText = (text: string) => text.replace(/'/g, "''");

  const registerPatient = async (formData: { name: string; age?: number; gender?: string }) => {
    await createPatientsTable();

    const name = escapeText(formData.name);
    const age = formData.age ?? null;
    const gender = formData.gender ?? null;

    await db.query(`
      INSERT INTO patients (name, age, gender)
      VALUES ('${name}', ${age !== null ? age : 'NULL'}, ${gender ? `'${escapeText(gender)}'` : 'NULL'});
    `);
  };

  return {
    registerPatient,
    useLivePatients: () => {
      // Live hook to keep UI in sync
      return useLiveIncrementalQuery<Patient>(`SELECT * FROM patients ORDER BY id DESC`, [], 'id');
    },
  };
};
