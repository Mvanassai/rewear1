document.addEventListener('DOMContentLoaded', () => {

  const logoutBtn = document.getElementById('logout-btn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'delivery-partner-auth.html';
      }
    });
  }

  loadPickups();

});

async function loadPickups(){

  const container = document.getElementById("pickups-list");

  const res = await fetch("http://127.0.0.1:5000/api/delivery/pickups");

  const data = await res.json();

  container.innerHTML="";

  if(data.length === 0){
    container.innerHTML = "<p>No pickups available</p>";
    return;
  }

  data.forEach((pickup,index)=>{

    const div = document.createElement("div");
    div.className="pickup-card";

    div.innerHTML = `

      <div class="pickup-header">
        <span class="pickup-id">#PICK-${index+1000}</span>
        <span class="pickup-priority">${pickup.status}</span>
      </div>

      <div class="pickup-details">
        <div><strong>Cloth:</strong> ${pickup.cloth_name}</div>
        <div><strong>Category:</strong> ${pickup.category}</div>
        <div><strong>Price:</strong> ₹${pickup.price}</div>
        <div><strong>Phone:</strong> ${pickup.phone}</div>
        <div><strong>Location:</strong> ${pickup.location}</div>
      </div>

      <div class="pickup-actions">
        <button class="btn-accept">
          ${pickup.status === "Accepted by Delivery" ? "Accepted" : "Accept Pickup"}
        </button>

        <button class="btn-location">View Location</button>
      </div>

    `;

    const btn = div.querySelector(".btn-accept");

    // If already accepted
    if(pickup.status === "Accepted by Delivery"){
      btn.disabled = true;
      btn.style.background = "green";
    }

    // ACCEPT PICKUP
    btn.addEventListener("click", async ()=>{

      await fetch("http://127.0.0.1:5000/api/delivery/accept-pickup",{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body: JSON.stringify({
          cloth_name: pickup.cloth_name
        })

      });

      alert("Pickup Accepted!");

      btn.innerText = "Accepted";
      btn.disabled = true;
      btn.style.background = "green";

    });

    // VIEW LOCATION
    const locationBtn = div.querySelector(".btn-location");

    locationBtn.addEventListener("click",()=>{

      const lat = pickup.lat;
      const lon = pickup.lon;

      if(lat && lon){

        const url = `https://www.google.com/maps?q=${lat},${lon}`;
        window.open(url,"_blank");

      }else{

        alert("Location coordinates not available");

      }

    });

    container.appendChild(div);

  });

}