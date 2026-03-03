// customer-dashboard.js
// Simple client-side interactions for Customer Dashboard

document.addEventListener('DOMContentLoaded', () => {
  // Logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'customer-auth.html'; // or homepage
      }
    });
  }
document.querySelector('.cart-icon')?.addEventListener('click', (e) => {
  e.preventDefault();
  const modal = document.getElementById('cart-modal');
  const itemsDiv = document.getElementById('cart-items');

  itemsDiv.innerHTML = cart.length === 0 
    ? '<p>Your cart is empty.</p>'
    : cart.map(item => `
        <div style="margin:12px 0;padding:12px;background:#f1f5f9;border-radius:8px;">
          <strong>${item.name}</strong><br>
          <small>${item.price} • Added ${item.addedAt}</small>
        </div>
      `).join('');

  modal.style.display = 'flex';
});
  // Optional: fake "Add to Cart" feedback
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Item added to cart!');
    });
  });
});