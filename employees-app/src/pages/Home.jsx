import { useEffect, useState } from 'react';
import { fetchEmployees } from '../services/api.js';
import EmployeeCard from '../components/EmployeeCard.jsx';

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees()
      .then(setEmployees)
      .catch(() => setError('Failed to load employees. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = employees.filter((e) =>
    `${e.name.first} ${e.name.last}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="status">Loading...</p>;
  if (error) return <p className="status error">{error}</p>;

  return (
    <div>
      <input
        type="text"
        className="search"
        placeholder="Search employee by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filtered.length === 0 ? (
        <p className="status">No employees found.</p>
      ) : (
        <div className="grid">
          {filtered.map((employee) => (
            <EmployeeCard key={employee.login.uuid} employee={employee} />
          ))}
        </div>
      )}
    </div>
  );
}
