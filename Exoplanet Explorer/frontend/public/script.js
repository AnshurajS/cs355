const API_URL = 'http://localhost:3000/api';
let planetsData = [];

// Notification function to show messages
function showNotification(msg) {
  const el = document.getElementById('notification');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 5000);
}

// On page load, set up navigation, redirects, and load data or bind forms
window.onload = () => {
  const token = localStorage.getItem('token');
  const userMenu = document.getElementById('user-menu');

  if (userMenu) {
    if (token) {
      // fetch profile to get email
      fetch(`${API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Not authorized');
        return res.json();
      })
      .then(user => {
        // insert Welcome + Logout
        userMenu.innerHTML = 
          `&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;`+
          `Welcome, ${user.email}! ` +
          `<a href="#" id="logout">Logout</a>`;
        document.getElementById('logout').onclick = () => {
          localStorage.removeItem('token');
          window.location = 'login.html';
        };
      })
      .catch(() => {
        // invalid token → force re-login
        localStorage.removeItem('token');
        window.location = 'login.html';
      });
    } else {
      userMenu.innerHTML =
        `<a href="login.html">Login</a> ` +
        `<a href="register.html">Register</a>`;
    }
  }


  // Route handling
  const path = window.location.pathname;
  if (path.endsWith('login.html')) {
    if (token) return window.location.href = 'index.html';
    bindLogin();
  } else if (path.endsWith('register.html')) {
    if (token) return window.location.href = 'index.html';
    bindRegister();
  } else if (path.endsWith('favorites.html')) {
    if (!token) return window.location.href = 'login.html';
    loadFavorites();
  } else {
    // index.html and other frontend routes
    if (!token) return window.location.href = 'login.html';
    loadPlanets();
    setupSearch();
  }
};

// Fetch and render exoplanets on the dashboard
async function loadPlanets() {
  try {
    const res = await fetch(`${API_URL}/exoplanets`);
    planetsData = await res.json();
    renderPlanets(planetsData);    
  } catch (error) {
    console.error('Error loading planets:', error);
  }
}

function renderPlanets(planets) {
  const container = document.getElementById('planet-list');
    container.innerHTML = planets.map(p => `
      <div class="planet-card">
        <h3>${p.pl_name}</h3>
        <p>Mass: ${p.pl_masse}</p>
        <p>Radius: ${p.pl_rade}</p>
        <button onclick="addFav('${p.pl_name}', ${p.pl_masse}, ${p.pl_rade})">Add</button>
      </div>
    `).join('');
  }

// Filters planets list as you type
function setupSearch() {
  const input = document.getElementById('search');
  input.addEventListener('input', () => {
    const term = input.value.trim().toLowerCase();
    const filtered = term
      ? planetsData.filter(p => p.pl_name.toLowerCase().includes(term))
      : planetsData;
    renderPlanets(filtered);
  });
}

// Add a planet to favorites
async function addFav(name, mass, radius) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/exoplanets/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ pl_name: name, pl_masse: mass, pl_rade: radius })
  });
  if (res.ok) {
      showNotification(`Planet ${name} added to favorites!`);}
  else {
    const {msg} = await res.json();
    showNotification('This planet is already in your favorites!');
  }
}

// Fetch and render user's favorite exoplanets
async function loadFavorites() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/exoplanets/favorites`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const favs = await res.json();
    const container = document.getElementById('favorites-list');
    container.innerHTML = favs.map(f => `
      <div class="planet-card">
        <h3>${f.pl_name}</h3>
        <p>Mass: ${f.pl_masse}</p>
        <p>Radius: ${f.pl_rade}</p>
        <button onclick="removeFav('${f.pl_name}')">Remove</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
}

// Remove a planet from favorites
async function removeFav(name) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/exoplanets/favorites/${name}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (res.ok) {
    loadFavorites();
    showNotification(`Planet ${name} removed from favorites!`);
  } else {
    const {msg} = await res.json();
    showNotification('Error removing planet from favorites.');
  }
}

// Bind login form submission to API
function bindLogin() {
  const form = document.getElementById('login-form');
  form.onsubmit = async e => {
    e.preventDefault();
    const email = form.elements.email.value;
    const password = form.elements.password.value;
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok)  {
      const { token } = await res.json();
      localStorage.setItem('token', token);
      window.location.href = 'index.html';
    } else {
      const { msg } = await res.json();
      alert('Please try again. ' + msg);
    }
  };
}

// Bind register form submission to API
function bindRegister() {
  const form = document.getElementById('register-form');
  form.onsubmit = async e => {
    e.preventDefault();
    const username = form.elements.username.value;
    const email    = form.elements.email.value;
    const password = form.elements.password.value;

    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    if (res.ok) {
      alert('Registration successful! Please log in.');
      window.location.href = 'login.html';
    } else {
      const { msg } = await res.json();
      alert('Registration failed: ' + msg);
    }
  };
}
