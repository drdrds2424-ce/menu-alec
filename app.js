const PHONE_NUMBER = "9647854777816";
const ADMIN_PASS = "1234";

const defaultProducts = [
  { id: 1, name: "برغر لحم", price: 6000, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
  { id: 2, name: "بيتزا ببروني", price: 8000, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500" }
];

let products = JSON.parse(localStorage.getItem('menu_products_v2')) || defaultProducts;
let cart = [];

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="card">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price.toLocaleString()} د.ع</p>
      <button type="button" onclick="addToCart(${p.id})">➕ إضافة للسلة</button>
    </div>
  `).join('');
}

window.addToCart = function(id) {
  const item = products.find(p => p.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCartUI();
};

window.changeQty = function(id, delta) {
  const item = cart.find(c => c.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(c => c.id !== id);
    }
  }
  updateCartUI();
};

function updateCartUI() {
  const countElem = document.getElementById('cartCount');
  if (countElem) {
    countElem.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }
  
  const cartItems = document.getElementById('cartItems');
  let total = 0;
  
  if (cart.length === 0) {
    cartItems.innerHTML = `<p style="text-align:center; color:#64748b; padding:10px;">السلة فارغة حالياً</p>`;
  } else {
    cartItems.innerHTML = cart.map(item => {
      const subtotal = item.price * item.qty;
      total += subtotal;
      return `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <div style="font-size:0.85rem; color:#64748b;">${subtotal.toLocaleString()} د.ع</div>
          </div>
          <div class="cart-controls">
            <button type="button" class="btn-qty" onclick="changeQty(${item.id}, -1)">-</button>
            <span class="qty-num">${item.qty}</span>
            <button type="button" class="btn-qty" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
      `;
    }).join('');
  }
  
  const totalElem = document.getElementById('cartTotal');
  if (totalElem) {
    totalElem.textContent = total.toLocaleString();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();

  const cartBtn = document.getElementById('cartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartModal = document.getElementById('cartModal');

  if (cartBtn && cartModal) {
    cartBtn.addEventListener('click', () => cartModal.classList.remove('hidden'));
  }
  if (closeCartBtn && cartModal) {
    closeCartBtn.addEventListener('click', () => cartModal.classList.add('hidden'));
  }

  const adminBtn = document.getElementById('adminBtn');
  const closeAdminBtn = document.getElementById('closeAdminBtn');
  const adminModal = document.getElementById('adminModal');

  if (adminBtn && adminModal) {
    adminBtn.addEventListener('click', () => {
      const pass = prompt("أدخل كلمة مرور الإدارة:");
      if (pass === ADMIN_PASS) {
        adminModal.classList.remove('hidden');
      } else if (pass !== null) {
        alert("كلمة المرور خاطئة!");
      }
    });
  }

  if (closeAdminBtn && adminModal) {
    closeAdminBtn.addEventListener('click', () => adminModal.classList.add('hidden'));
  }

  const addForm = document.getElementById('addForm');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('pName').value;
      const price = Number(document.getElementById('pPrice').value);
      const img = document.getElementById('pImg').value;

      const newProd = { id: Date.now(), name, price, img };
      products.push(newProd);
      localStorage.setItem('menu_products_v2', JSON.stringify(products));
      
      renderProducts();
      if (adminModal) adminModal.classList.add('hidden');
      addForm.reset();
    });
  }

      const sendWhatsappBtn = document.getElementById('sendWhatsappBtn');
  if (sendWhatsappBtn) {
    sendWhatsappBtn.addEventListener('click', () => {
      if (cart.length === 0) return alert("السلة فارغة!");
      
      // قراءة رقم الطاولة
      const tableInput = document.getElementById('tableNumber');
      const tableNumber = tableInput ? tableInput.value : '';

      let msg = "📋 طلب جديد من المنيو:\n\n";
      let total = 0;
      cart.forEach(item => {
        const sub = item.price * item.qty;
        total += sub;
        msg += `• ${item.name} × ${item.qty} = ${sub.toLocaleString()} د.ع\n`;
      });
      
      msg += `\n💵 المجموع الكلي: ${total.toLocaleString()} د.ع`;

      // إرفاق رقم الطاولة بالرسالة
      if (tableNumber) {
        msg += `\n📍 رقم الطاولة: ${tableNumber}`;
      } else {
        msg += `\n📍 رقم الطاولة: لم يحدد`;
      }

      const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    });
  }
