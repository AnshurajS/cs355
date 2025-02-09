const toggleBtn = document.getElementById('toggle');

const isDarkMode = localStorage.getItem('darkMode') === 'true';

if (isDarkMode) {
  document.documentElement.setAttribute('theme', 'dark');
  toggleBtn.innerText = 'LIGHT';
}

toggleBtn.addEventListener('click', () => {
    if (document.documentElement.hasAttribute('theme')) {
        document.documentElement.removeAttribute('theme');
        toggleBtn.innerText = 'DARK';
        localStorage.setItem('darkMode', 'false');
    } else {
        document.documentElement.setAttribute('theme', 'dark');
        toggleBtn.innerText = 'LIGHT';
        localStorage.setItem('darkMode', 'true');
    }
});

if (window.location.pathname.includes('page2.html')) {
    const params = new URLSearchParams(location.search);
    const resultDiv = document.getElementById('result');
    
    params.forEach((value, key) => {
        const resultItem = document.createElement('div');
        resultItem.innerHTML = `<strong>${key}:</strong> ${value}`;
        resultDiv.appendChild(resultItem);
    });
}