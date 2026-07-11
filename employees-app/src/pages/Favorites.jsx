import { useFavorites } from '../context/FavoritesContext.jsx';
import EmployeeCard from '../components/EmployeeCard.jsx';

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div>
      <h2>Favorite Employees</h2>
      {favorites.length === 0 ? (
        <p className="status">No favorite employees saved yet.</p>
      ) : (
        <div className="grid">
          {favorites.map((employee) => (
            <EmployeeCard key={employee.login.uuid} employee={employee} showMoreInfo={false} />
          ))}
        </div>
      )}
    </div>
  );
}
