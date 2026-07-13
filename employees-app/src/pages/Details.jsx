import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchEmployeeById } from '../services/api.js';
import { useFavorites } from '../context/FavoritesContext.jsx';

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Details() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const company = searchParams.get('company') || 'google';
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    fetchEmployeeById(id, company)
      .then((emp) => {
        if (!emp) setError('Employee not found.');
        else setEmployee(emp);
      })
      .catch(() => setError('Failed to load employee details.'))
      .finally(() => setLoading(false));
  }, [id, company]);

  useEffect(() => {
    if (!employee || !mapRef.current || mapInstance.current) return;
    const { latitude, longitude } = employee.location.coordinates;
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    mapInstance.current = L.map(mapRef.current).setView([lat, lng], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance.current);
    L.marker([lat, lng], { icon: markerIcon }).addTo(mapInstance.current);
    return () => {
      mapInstance.current.remove();
      mapInstance.current = null;
    };
  }, [employee]);

  if (loading) return <p className="status">Loading...</p>;
  if (error) return <p className="status error">{error}</p>;

  const favorite = isFavorite(employee.login.uuid);
  const { street, city, state, country, postcode } = employee.location;

  return (
    <div className="details">
      <img src={employee.picture.large} alt={`${employee.name.first} ${employee.name.last}`} />
      <h2>{employee.name.title} {employee.name.first} {employee.name.last}</h2>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Phone:</strong> {employee.phone}</p>
      <p>
        <strong>Address:</strong> {street.number} {street.name}, {city}, {state}, {country} {postcode}
      </p>
      {favorite ? (
        <button className="btn btn-remove" onClick={() => removeFavorite(employee.login.uuid)}>
          Remove Favorite
        </button>
      ) : (
        <button className="btn btn-fav" onClick={() => addFavorite(employee)}>
          Save Favorite
        </button>
      )}
      <div ref={mapRef} className="map"></div>
    </div>
  );
}
