# Employees App

React app for searching employees, viewing details (with a Leaflet map), and saving favorites to localStorage.

## Run locally

```
npm install
npm run dev
```

## Build

```
npm run build
```

## Features

- Search employees by name (data from randomuser.me with seed=google, with fallback API)
- Results list: name, age, location, profile picture, "More Info" button
- Details page (routed by URL): full name, email, phone, full address, Leaflet map at coordinates
- Save/remove favorites (localStorage via React Context) — persists after refresh
- Favorites page (no "More Info" button, per assignment note)
