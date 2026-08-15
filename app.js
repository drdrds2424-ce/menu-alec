const PHONE_NUMBER = "9647854777816";
const ADMIN_PASS = "1234";

let products = JSON.parse(localStorage.getItem('menu_products')) || [
  { id: 1, name: "برغر لحم", price: 6000, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
  { id: 2, name: "بيتزا ببروني", price: 8000, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500" }
];

let cart = [];

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = products.map(p => `
    <div class="card">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price.toLocaleString()} د.ع</p>
      <button onclick="addToCart(${p.id})">➕ إضافه للسلة</button>
    </div>
  `).join('');
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  document.getElementById('cartCount').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartItems = document.getElementById('cartItems');
  let total = 0;
  cartItems.innerHTML = cart.map(item => {
    total += item.price * item.qty;
    return `
      <div class="cart-item">
        <span>${item.name} (x${item.qty})</span>
        <span>${(item.price * item.qty).toLocaleString()} د.ع</span>
      </div>
    `;
  }).join('');
  document.getElementById('cartTotal').textContent = total.toLocaleString();
}

function toggleCart() {
  document.getElementById('cartModal').classList.toggle('hidden');
}

function openAdminModal() {
  const pass = prompt("أدخل كلمة مرور الإدارة:");
  if (pass === ADMIN_PASS) {
    document.getElementById('adminModal').classList.remove('hidden');
  } else if (pass !== null) {
    alert("كلمة المرور خاطئة!");
  }
}

function closeAdminModal() {
  document.getElementById('adminModal').classList.add('hidden');
}

function addProduct(e) {
  e.preventDefault();
  const name = document.getElementById('pName').value;
  const price = Number(document.getElementById('pPrice').value);
  const img = document.getElementById('pImg').value;

  const newProd = { id: Date.now(), name, price, img };
  products.push(newProd);
  localStorage.setItem('menu_products', JSON.stringify(products));
  
  renderProducts();
  closeAdminModal();
  document.getElementById('addForm').reset();
}

function sendToWhatsApp() {
  if (cart.length === 0) return alert("السلة فارغة!");
  
  let msg = "طلب جديد من المنيو:\n\n";
  let total = 0;
  cart.forEach(item => {
    const sub = item.price * item.qty;
    total += sub;
    msg += `• ${item.name} × ${item.qty} = ${sub.toLocaleString()} د.ع\n`;
  });
  msg += `\nالمجموع الكلي: ${total.toLocaleString()} د.ع`;

  const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

renderProducts();
