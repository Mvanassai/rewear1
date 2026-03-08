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
        <div><strong>Location:</strong> ${pickup.location}</div>
      </div>

      <button class="btn-accept">Accept Pickup</button>

    `;

    const btn = div.querySelector(".btn-accept");

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

      btn.innerText="Accepted ✓";
      btn.disabled=true;

    });

    container.appendChild(div);

  });

}