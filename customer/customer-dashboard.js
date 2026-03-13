// customer-dashboard.js
// Simple client-side interactions for Customer Dashboard



// ─────────────────────────────
// LOAD PRODUCTS FROM BACKEND
// ─────────────────────────────

async function loadProducts(){

const grid = document.getElementById("products-grid");

const res = await fetch("http://127.0.0.1:5000/api/products");

const data = await res.json();

grid.innerHTML = "";

data.forEach(product => {

const card = document.createElement("div");

card.className = "product-card";

card.innerHTML = `

<div class="product-image"
style="background-image:url('http://127.0.0.1:5000/${product.image}')">
</div>

<div class="product-info">

<h3>${product.title}</h3>

<div class="price">₹${product.price}</div>

<button class="btn-add-cart">Add to Cart</button>

</div>

`;

grid.appendChild(card);

});

}



// ─────────────────────────────
// DASHBOARD FUNCTIONS
// ─────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

loadProducts();


 // Logout functionality

const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {

logoutBtn.addEventListener('click', () => {

if (confirm('Are you sure you want to logout?')) {

window.location.href = 'customer-auth.html';

}

});

}



 // CART MODAL OPEN

document.querySelector('.cart-icon')?.addEventListener('click', (e) => {

e.preventDefault();

const modal = document.getElementById('cart-modal');

const itemsDiv = document.getElementById('cart-items');

let cart = JSON.parse(localStorage.getItem('rewearCart')) || [];

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



 // ADD TO CART ALERT (Simple feedback)

document.querySelectorAll('.btn-add-cart').forEach(btn => {

btn.addEventListener('click', () => {

alert('Item added to cart!');

});

});

});