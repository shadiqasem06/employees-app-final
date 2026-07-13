import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'favoriteEmployees';

// The global store: createContext holds ALL the global variables and functions
const FavoritesContext = createContext({
  favorites: [],
  isFavorite: (id) => false,
  addFavorite: (employee) => {},
  removeFavorite: (id) => {},
});

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id) => favorites.some((f) => f.login.uuid === id);

  const addFavorite = (employee) => {
    setFavorites((prev) =>
      prev.some((f) => f.login.uuid === employee.login.uuid) ? prev : [...prev, employee]
    );
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((f) => f.login.uuid !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
