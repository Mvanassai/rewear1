// ─────────────────────────────────────
// ADD PRODUCT
// ─────────────────────────────────────

const productForm = document.getElementById("add-product-form");

if (productForm) {

productForm.addEventListener("submit", async (e) => {

e.preventDefault();

const formData = new FormData(productForm);

const res = await fetch("http://127.0.0.1:5000/api/manufacturer/add-product", {

method: "POST",
body: formData

});

const data = await res.json();

if (data.success) {

alert("Product Added Successfully");

productForm.reset();

} else {

alert("Error adding product");

}

});

}


// ─────────────────────────────────────
// LOAD SELLER CLOTH REQUESTS
// ─────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

loadClothes();

});


async function loadClothes() {

const table = document.getElementById("cloth-table-body");

const res = await fetch("http://127.0.0.1:5000/api/seller/clothes");

const data = await res.json();

table.innerHTML = "";

if (data.length === 0) {

table.innerHTML = "<tr><td colspan='9'>No requests</td></tr>";

return;

}

data.forEach(cloth => {

const row = document.createElement("tr");

row.innerHTML = `

<td>${cloth.name}</td>
<td>${cloth.category}</td>
<td>${cloth.size}</td>
<td>${cloth.condition}</td>
<td>₹${cloth.price}</td>
<td>${cloth.location}</td>
<td>${cloth.phone}</td>

<td>
<img src="http://127.0.0.1:5000/${cloth.image}" width="60">
</td>

<td>

<button class="accept-btn">Accept</button>

<button class="reject-btn">Reject</button>

<button class="delete-btn">Delete</button>

</td>

`;


 // ─────────────────────────────
 // ACCEPT CLOTH
 // ─────────────────────────────

row.querySelector(".accept-btn").addEventListener("click", async () => {

await fetch("http://127.0.0.1:5000/api/seller/accept-cloth", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
name: cloth.name
})

});

alert("Cloth Accepted");

loadClothes();

});


 // ─────────────────────────────
 // REJECT CLOTH
 // ─────────────────────────────

row.querySelector(".reject-btn").addEventListener("click", async () => {

await fetch("http://127.0.0.1:5000/api/seller/reject-cloth", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
name: cloth.name
})

});

alert("Cloth Rejected");

loadClothes();

});


 // ─────────────────────────────
 // DELETE CLOTH
 // ─────────────────────────────

row.querySelector(".delete-btn").addEventListener("click", async () => {

if (confirm("Delete this cloth request?")) {

await fetch("http://127.0.0.1:5000/api/seller/delete-cloth", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
name: cloth.name,
seller_email: cloth.seller_email
})

});

alert("Cloth Deleted");

loadClothes();

}

});

table.appendChild(row);

});

}