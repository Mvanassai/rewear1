document.addEventListener('DOMContentLoaded', () => {

  const tabs = document.querySelectorAll('.tab');
  const loginContainer = document.getElementById('login-form');
  const signupContainer = document.getElementById('signup-form');

  // ✅ Correct FORM IDs
  const loginForm = document.getElementById('login-form-element');
  const signupForm = document.getElementById('signup-form-element');

  const switchLinks = document.querySelectorAll('[data-switch]');

  function showTab(tabName) {
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    loginContainer.classList.toggle('form-hidden', tabName !== 'login');
    signupContainer.classList.toggle('form-hidden', tabName !== 'signup');
  }

  tabs.forEach(tab =>
    tab.addEventListener('click', () => showTab(tab.dataset.tab))
  );

  switchLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showTab(link.dataset.switch);
    });
  });

  showTab('login');

  // ── SELLER LOGIN ─────────────────────────
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/login/seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login Successful! Welcome Seller.');
        window.location.href = "seller-dashboard.html"; // ✅ Dashboard open
      } else {
        alert(data.message || 'Invalid credentials');
      }

    } catch (error) {
      alert('Server error. Please try again.');
    }
  });

  // ── SELLER SIGNUP ─────────────────────────
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ✅ Correct IDs (match HTML)
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const address = document.getElementById('signup-address').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;

    if (!name || !email || !phone || !address || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/signup/seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, address, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Account created successfully! Please login.');
        showTab('login');  // ✅ After signup → Login tab ki velthundi
      } else {
        alert(data.message || 'Signup failed');
      }

    } catch (error) {
      alert('Server error. Please try again.');
    }
  });

});