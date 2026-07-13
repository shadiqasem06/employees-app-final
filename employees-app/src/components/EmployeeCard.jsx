import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext.jsx';

export default function EmployeeCard({ employee, company = 'google', showMoreInfo = true }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const id = employee.login.uuid;
  const favorite = isFavorite(id);

  return (
    <div className="card">
      {favorite && <span className="star" title="Favorite">&#9733;</span>}
      <img src={employee.picture.large} alt={`${employee.name.first} ${employee.name.last}`} />
      <h3>{employee.name.first} {employee.name.last}</h3>
      <p>Age: {employee.dob.age}</p>
      <p>{employee.location.city}, {employee.location.country}</p>
      <div className="card-actions">
        {showMoreInfo && (
          <Link className="btn" to={`/employee/${id}?company=${encodeURIComponent(company)}`}>More Info</Link>
        )}
        {favorite ? (
          <button className="btn btn-remove" onClick={() => removeFavorite(id)}>Remove Favorite</button>
        ) : (
          <button className="btn btn-fav" onClick={() => addFavorite(employee)}>Save Favorite</button>
        )}
      </div>
    </div>
  );
}
