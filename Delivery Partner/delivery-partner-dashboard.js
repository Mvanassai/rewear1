// delivery-partner-dashboard.js
// Frontend interactions for delivery partner dashboard

document.addEventListener('DOMContentLoaded', () => {
  // === Logout functionality ===
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'delivery-partner-auth.html.html';
      }
    });
  }

  // === Accept Pickup handlers ===
  const acceptBtns = document.querySelectorAll('.btn-accept');
  acceptBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pickupId = btn.dataset.id;
      
      // In production, this would send to backend
      // fetch('http://localhost:5000/accept-pickup', { method: 'POST', body: JSON.stringify({pickup_id: pickupId}) })
      
      alert(`Pickup #PICK-${pickupId} accepted! You're on the way.`);
      btn.textContent = 'Accepted ✓';
      btn.disabled = true;
      btn.style.background = '#166534';
      
      // Optional: remove the card or move to active deliveries
      setTimeout(() => {
        btn.closest('.pickup-card').style.opacity = '0.6';
      }, 500);
    });
  });

  // === Update delivery status (demo) ===
  const updateBtns = document.querySelectorAll('table .btn-small');
  updateBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const statusCell = btn.closest('tr').querySelector('.status');
      if (statusCell && statusCell.textContent.includes('Picked')) {
        statusCell.textContent = 'In Transit';
        statusCell.className = 'status in-transit';
        btn.textContent = 'Update';
      } else if (statusCell && statusCell.textContent.includes('In Transit')) {
        statusCell.textContent = 'Delivered';
        statusCell.className = 'status completed';
        btn.textContent = 'Complete';
      } else if (statusCell) {
        alert('Delivery completed!');
        btn.closest('tr').style.opacity = '0.5';
        btn.disabled = true;
      }
    });
  });

  // === Optional: Real-time geolocation tracking (demo) ===
  // In production, you'd periodically POST the delivery partner's location
  // if (navigator.geolocation) {
  //   navigator.geolocation.watchPosition((pos) => {
  //     const { latitude, longitude } = pos.coords;
  //     console.log(`Current location: ${latitude}, ${longitude}`);
  //     // POST to backend: /update-delivery-location
  //   });
  // }
});
