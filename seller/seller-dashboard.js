// seller-dashboard.js
// Single consolidated script for ReWear seller dashboard

document.addEventListener('DOMContentLoaded', () => {

  // ── Logout ─────────────────────────────────────
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'seller-auth.html';
      }
    });
  }

  // ── Add Cloth Form elements ─────────────────────
  const form          = document.getElementById('add-cloth-form');
  const locationBtn   = document.getElementById('get-location');
  const locationInput = document.getElementById('location');
  const successMsg    = document.getElementById('success-message');

  // ── Get current location ────────────────────────
  if (locationBtn && locationInput) {
    locationBtn.addEventListener('click', () => {

      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      locationBtn.disabled = true;
      locationBtn.textContent = "Detecting...";

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          locationInput.value = `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`;
          locationBtn.disabled = false;
          locationBtn.textContent = "Use My Location";
        },
        (error) => {
          let msg = "Unable to get location.";
          if (error.code === 1) msg = "Location permission denied.";
          else if (error.code === 2) msg = "Location unavailable.";
          else if (error.code === 3) msg = "Location request timed out.";
          alert(msg);
          locationBtn.disabled = false;
          locationBtn.textContent = "Use My Location";
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  // ── Form submission ─────────────────────────────
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!locationInput?.value.trim()) {
        alert("Please detect your current location first.");
        return;
      }

      const formData = new FormData(form);

      try {

        // ✅ Updated fetch URL (as you requested)
        const response = await fetch("http://127.0.0.1:5000/api/seller/add-cloth", {
          method: "POST",
          body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {

          if (successMsg) {
            successMsg.textContent = result.message || "Cloth added successfully!";
            successMsg.classList.remove('d-none');
            setTimeout(() => successMsg.classList.add('d-none'), 5000);
          } else {
            alert(result.message || "Cloth added successfully!");
          }

          form.reset();
          locationInput.value = '';

        } else {
          alert(result.message || result.error || "Failed to add cloth.");
        }

      } catch (err) {
        console.error('Form submission error:', err);
        alert("Network error. Please check connection.");
      }

    });
  }

});