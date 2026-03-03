document.addEventListener('DOMContentLoaded', () => {

  // Logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      window.location.href = '../home.html';
    }
  });

  const tableBody = document.getElementById('cloth-table-body');

  // Fetch seller clothes from backend
  async function loadClothes() {
    try {

      const response = await fetch("http://127.0.0.1:5000/api/seller/clothes");
      const data = await response.json();

      tableBody.innerHTML = "";

      if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7">No clothes available</td></tr>`;
        return;
      }

      data.forEach(cloth => {

        const row = `
          <tr>
            <td>${cloth.name}</td>
            <td>${cloth.category}</td>
            <td>${cloth.size}</td>
            <td>${cloth.condition}</td>
            <td>₹${cloth.price}</td>
            <td>${cloth.location}</td>
            <td>
              <img src="http://127.0.0.1:5000/${cloth.image}" width="60">
            </td>
          </tr>
        `;

        tableBody.innerHTML += row;

      });

    } catch (error) {
      console.error("Error loading clothes:", error);
      tableBody.innerHTML = `<tr><td colspan="7">Failed to load data</td></tr>`;
    }
  }

  loadClothes();

});