// delivery-auth.js
// Redirect to delivery-partner-dashboard.html after login

document.addEventListener('DOMContentLoaded', () => {

  const tabs = document.querySelectorAll('.tab');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const switchLinks = document.querySelectorAll('[data-switch]');

  function showTab(tabName) {
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    loginForm.classList.toggle('form-hidden', tabName !== 'login');
    signupForm.classList.toggle('form-hidden', tabName !== 'signup');
  }

  // Tab switching
  tabs.forEach(tab =>
    tab.addEventListener('click', () => showTab(tab.dataset.tab))
  );

  switchLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showTab(link.dataset.switch);
    });
  });

  // Default tab
  showTab('login');

  // ── LOGIN ─────────────────────────────
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const mobile = document.getElementById('login-mobile').value;
    const password = document.getElementById('login-password').value;

    if (mobile && password) {
      alert('Login Successful! Welcome back, Delivery Partner.');

      // ✅ Redirect to correct dashboard
      window.location.href = "delivery-partner-dashboard.html";
    } else {
      alert('Please fill in all fields');
    }
  });

  // ── SIGNUP ─────────────────────────────
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    alert('Account created successfully!\nPlease login to continue.');
    showTab('login');
  });

});