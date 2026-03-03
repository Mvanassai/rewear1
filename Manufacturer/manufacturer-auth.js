// manufacturer-auth.js
// Manufacturer / Brand login with Flask backend

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login/manufacturer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success === true) {
        alert(data.message || 'Login successful');
        window.location.href = 'manufacturer-dashboard.html';
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Cannot connect to server. Is Flask running?');
    }
  });
});