import { useState } from 'react';
import { useDbActions } from '../utils/useDbActions';

export const QueryPatient = () => {
  const { useLivePatients } = useDbActions();

  const [inputColumns, setInputColumns] = useState('*');
  const [inputConditions, setInputConditions] = useState('');

  const [columns, setColumns] = useState('*');
  const [conditions, setConditions] = useState('');

  const patients = useLivePatients(columns, conditions);
  console.log(patients);

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Live SQL Patient Query</h2>

      <label>
        <strong>SELECT columns:</strong>
        <textarea
          value={inputColumns}
          onChange={(e) => setInputColumns(e.target.value)}
          rows={2}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
      </label>

      <label>
        <strong>WHERE conditions:</strong>
        <textarea
          value={inputConditions}
          onChange={(e) => setInputConditions(e.target.value)}
          rows={2}
          placeholder="e.g. WHERE age > 25"
          style={{ width: '100%', marginBottom: '1rem' }}
        />
      </label>

      <button
        onClick={() => {
          setColumns(inputColumns.trim() || '*');
          setConditions(inputConditions.trim());
        }}
      >
        Run Query
      </button>

      <hr style={{ margin: '2rem 0' }} />

      <h3>
        Results for:{' '}
        <code>
          {columns} {conditions}
        </code>
      </h3>
      {patients?.rows.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <ul>
          {patients?.rows.map((p: any) => (
            <li key={p.id}>
              {p.firstname ?? 'Unknown'} {p.lastname ?? ''} - Age: {p.age ?? 'N/A'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
