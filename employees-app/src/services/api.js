const API_BASE = 'https://randomuser.me/api/';
const FALLBACK_API = 'https://monkeys.co.il/api2/wo.php';
const DEFAULT_COMPANY = 'google';

// Cache results per company seed
const cache = {};

// Primary returns { results: [...] }, fallback returns a plain array
function normalize(data) {
  return Array.isArray(data) ? data : data.results;
}

// The search runs on the API itself: the "seed" query param determines
// which company's employees are returned.
export async function fetchEmployees(company = DEFAULT_COMPANY) {
  const seed = (company || '').trim().toLowerCase() || DEFAULT_COMPANY;
  if (cache[seed]) return cache[seed];
  try {
    const res = await fetch(`${API_BASE}?results=10&seed=${encodeURIComponent(seed)}`);
    if (!res.ok) throw new Error('Primary API failed: ' + res.status);
    cache[seed] = normalize(await res.json());
    return cache[seed];
  } catch (primaryError) {
    try {
      const res = await fetch(FALLBACK_API);
      if (!res.ok) throw new Error('Fallback API failed: ' + res.status);
      cache[seed] = normalize(await res.json());
      return cache[seed];
    } catch {
      throw primaryError;
    }
  }
}

// Retrieve a single employee using findIndex, as required by the assignment
export async function fetchEmployeeById(id, company = DEFAULT_COMPANY) {
  const employees = await fetchEmployees(company);
  const index = employees.findIndex((e) => e.login.uuid === id);
  return index === -1 ? null : employees[index];
}
