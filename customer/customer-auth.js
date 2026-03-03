// customer-auth.js
// Redirect to customer dashboard after successful login

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

  // ── Customer Login ─────────────────────────
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email && password) {
      alert('Login Successful! Welcome back, Customer.');

      // Redirect to Customer Dashboard
      window.location.href = "customer-dashboard.html";
    } else {
      alert('Please fill in all fields');
    }
  });

  // ── Customer Signup ─────────────────────────
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    alert('Account created successfully!\nPlease login to continue shopping.');

    showTab('login');
  });

});