import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchEmployees } from '../services/api.js';
import EmployeeCard from '../components/EmployeeCard.jsx';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const company = searchParams.get('company') || 'google';
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // The search runs on the API itself (seed=company) whenever the
  // "company" query param in the URL changes.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchEmployees(company)
      .then((list) => {
        if (active) setEmployees(list);
      })
      .catch(() => {
        if (active) setError('Failed to load employees. Please try again later.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [company]);

  // Typing a company name updates the URL query param, which triggers a new API search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchParams(value ? { company: value } : {});
  };

  return (
    <div>
      <input
        type="text"
        className="search"
        placeholder="Search employees by company name (default: google)..."
        value={searchParams.get('company') || ''}
        onChange={handleSearch}
      />
      {loading ? (
        <p className="status">Loading...</p>
      ) : error ? (
        <p className="status error">{error}</p>
      ) : employees.length === 0 ? (
        <p className="status">No employees found.</p>
      ) : (
        <>
          <h2>Employees of {company}</h2>
          <div className="grid">
            {employees.map((employee) => (
              <EmployeeCard key={employee.login.uuid} employee={employee} company={company} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
