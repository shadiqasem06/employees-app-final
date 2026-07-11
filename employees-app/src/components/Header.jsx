import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <h1 className="logo">Employees App</h1>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/favorites">Favorites</NavLink>
      </nav>
    </header>
  );
}
