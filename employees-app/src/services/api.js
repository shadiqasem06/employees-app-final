const PRIMARY_API = 'https://randomuser.me/api/?results=10&seed=google';
const FALLBACK_API = 'https://monkeys.co.il/api2/wo.php';

let cache = null;

// Primary returns { results: [...] }, fallback returns a plain array
function normalize(data) {
  return Array.isArray(data) ? data : data.results;
}

export async function fetchEmployees() {
  if (cache) return cache;
  try {
    const res = await fetch(PRIMARY_API);
    if (!res.ok) throw new Error('Primary API failed: ' + res.status);
    cache = normalize(await res.json());
    return cache;
  } catch (primaryError) {
    try {
      const res = await fetch(FALLBACK_API);
      if (!res.ok) throw new Error('Fallback API failed: ' + res.status);
      cache = normalize(await res.json());
      return cache;
    } catch {
      throw primaryError;
    }
  }
}

export async function fetchEmployeeById(id) {
  const employees = await fetchEmployees();
  const index = employees.findIndex((e) => e.login.uuid === id);
  return index === -1 ? null : employees[index];
}