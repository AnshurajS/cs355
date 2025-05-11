# Exoplanet Explorer

A single-page web application for exploring, searching, and saving your favorite exoplanets using NASA’s Exoplanet Archive API. Featuring user authentication, animated backgrounds, live search filtering, and non-blocking notifications.

---

## Table of Contents

* [Features](#features)
* [Demo](#demo)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Configuration](#configuration)
* [Usage](#usage)
* [Project Structure](#project-structure)
* [Functionality Details](#functionality-details)
* [Technologies](#technologies)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* **Browse Exoplanets**: Fetches live data from NASA’s Exoplanet Archive API.
* **Live Search**: Filter planets by name as you type.
* **User Accounts**: Register and log in with email/password, secured via JWT and bcrypt.
* **Favorites Management**: Add or remove planets from your personal favorites list, with no duplicates.
* **Non-Blocking Alerts**: Pop-up notifications appear in the corner to confirm actions (add/remove, auth errors).
* **Animated Background**: Orbiting planet and rocket animations over a Milky Way backdrop.
* **Responsive Design**: Grid layout adapts to various screen sizes.
* **Welcome Banner**: Displays the logged-in user’s email with a visual separator in the navigation bar. 

---

## Demo

* Here is the demo of the webapp: https://share.vidyard.com/watch/RcNpdfSqYaWLYdPCgLmsAa
---

## Getting Started

### Prerequisites

* Node.js (v14 or newer)
* npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/exoplanet-explorer.git
   cd exoplanet-explorer
   ```
2. **Install dependencies**

   ```bash
   npm install express cors nedb-promises bcrypt jsonwebtoken node-fetch@2 dotenv
   npm install --save-dev nodemon
   ```

### Configuration

1. Create a `.env` in the project root with:

   ```env
   NASA_API_URL="https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+ps&format=json"
   JWT_SECRET="your_strong_jwt_secret"
   ```
2. Place your site favicon (`favicon.png`) and rocket image (`rocket.png`) into `frontend/public/`. Ensure background `milkyway.jpg` is in the same folder.

---

## Usage

1. **Start the server** (with auto-reload):

   ```bash
   npx nodemon backend/index.js
   ```
2. **Open your browser** to `http://localhost:3000`.
3. **Register** a new account or **log in**.
4. **Browse** exoplanets, **search** by name, and **add/remove** favorites.

---

## Project Structure

```
exoplanet-explorer/
├── .env                   # Environment variables
├── backend/
│   ├── index.js           # Express & static file server, routes setup
│   ├── config/db.js       # NeDB Promises datastore
│   ├── models/User.js     # User CRUD helpers
│   ├── authentication/auth.js # JWT authentication
│   ├── routes/
│   │   ├── auth.js         # /api/auth endpoints
│   │   └── exoplanets.js   # /api/exoplanets endpoints
│   └── controllers/
│       ├── authentication.js     # register, login, profile
│       └── exoplanetFetch.js     # fetch and favorites logic
└── frontend/
    └── public/
        ├── index.html      # Dashboard & search
        ├── favorites.html  # Favorites list
        ├── login.html      # Login form
        ├── register.html   # Registration form
        ├── style.css       # Styles & animations
        ├── script.js       # Frontend logic
        ├── favicon.png     # Tab icon
        ├── rocket.png      # Rocket animation
        └── milkyway.jpg    # Background image
```

---

## Functionality Details

* **Authentication**:

  * **Register**: POST `/api/auth/register`, stores hashed password and issues JWT.
  * **Login**: POST `/api/auth/login`, verifies credentials and returns JWT.
  * **Profile**: GET `/api/auth/profile`, retrieves user email for welcome banner.

* **Exoplanets API**:

  * **Fetch Planets**: GET `/api/exoplanets`, proxies NASA API data.
  * **Favorites**:

    * **List**: GET `/api/exoplanets/favorites` (protected).
    * **Add**: POST `/api/exoplanets/favorites`, no duplicates allowed.
    * **Remove**: DELETE `/api/exoplanets/favorites/:pl_name`.

* **Frontend Interactions**:

  * **script.js** manages routing, data fetching, rendering, live search, and notifications.
  * **showNotification()** displays timed banners on add/remove actions.
  * **Dynamic Nav**: Injects `Welcome, user@example.com! | Logout` when authenticated.

* **Animations**:

  * CSS keyframes for orbiting planets and flying rockets.
  * Background set to a static Milky Way image.

---

## Technologies

* **Backend**: Node.js, Express.js, NeDB (nedb-promises), bcrypt, JSON Web Tokens, node-fetch
* **Frontend**: HTML, CSS, JavaScript
* **Deployment**: Single Express server serving both API and static files

---

## License

This project is licensed under the MIT License.
