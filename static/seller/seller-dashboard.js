document.addEventListener('DOMContentLoaded', () => {

  const logoutBtn = document.getElementById('logout-btn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem("sellerEmail");
      window.location.href = "seller-auth.html";
    });
  }

  const form = document.getElementById('add-cloth-form');
  const locationBtn = document.getElementById('get-location');
  const locationInput = document.getElementById('location');
  const successMsg = document.getElementById('success-message');

  // LOCATION
  if (locationBtn) {
    locationBtn.addEventListener('click', () => {

      navigator.geolocation.getCurrentPosition((pos) => {

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        locationInput.value = `Lat:${lat}, Lon:${lon}`;

      });

    });
  }

  // ADD CLOTH
  form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const formData = new FormData(form);

    // ✅ ADD SELLER EMAIL
    const sellerEmail = localStorage.getItem("sellerEmail");
    formData.append("seller_email", sellerEmail);

    const res = await fetch("http://127.0.0.1:5000/api/seller/add-cloth", {

      method: "POST",
      body: formData

    });

    const data = await res.json();

    if (data.success) {

      successMsg.classList.remove("d-none");
      form.reset();

      loadSellerClothes();

    } else {

      alert(data.message);

    }

  });

  const sellerTable = document.getElementById("seller-cloth-table");

  async function loadSellerClothes(){

    const sellerEmail = localStorage.getItem("sellerEmail");

    const res = await fetch(`http://127.0.0.1:5000/api/seller/my-clothes?email=${sellerEmail}`);

    const data = await res.json();

    sellerTable.innerHTML = "";

    data.forEach(cloth => {

      const row = `
      <tr>
      <td>${cloth.name}</td>
      <td>${cloth.category}</td>
      <td>₹${cloth.price}</td>
      <td>${cloth.status}</td>
      </tr>
      `;

      sellerTable.innerHTML += row;

    });

  }

  loadSellerClothes();

});