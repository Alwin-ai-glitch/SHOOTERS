const MY_WHATSAPP_NUMBER = "https://api.whatsapp.com/send?phone=263778080002";

const Store = {
  cart: JSON.parse(localStorage.getItem('tn_cart') || '[]'),
  searchText: '',

  products: {
    premium: [
      {
        name: 'Adidas F50 pink',
        quality: 'PREMIUM GOOD QUALITY',
        price: 60,
        img: 'images (5).jpeg'
      },
      {
        name: 'Adidas F50 black',
        quality: 'PREMIUM QUALITY',
        price: 60,
        img: 'images (6).jpeg'
      },
      {
        name: 'Adidas Predator',
        quality: 'GOOD QUALITY',
        price: 60,
        img: 'IMG-20261002-WA0082.jpg'
      },
      {
        name: 'Adidas F50 White',
        quality: 'PREMIUM QUALITY',
        price: 60,
        img: 'images (2).jpeg'
      },
      {
        name: 'Adidas F50 BS',
        quality: 'PREMIUM QUALITY',
        price: 60,
        img: 'images (3).jpeg'
      },
      {
        name: 'Nike Sanad',
        quality: 'PREMIUM QUALITY',
        price: 60,
        img: 'IMG-20261002-WA0085.jpg'
      }
    ],
    standard: [
      
      {
        name: 'Adidas Predator black',
        quality: 'PREMIUM QUALITY',
        price: 45,
        img: 'images.jpg'
      },
      {
        name: 'Nike Pink',
        quality: 'PREMIUM QUALITY',
        price: 45,
        img: 'IMG-20261002-WA0101.jpg'
      },
      {
        name: 'Nike Furd',
        quality: 'STANDARD QUALITY',
        price: 45,
        img: '1035848_main.jpg'
      },
      {
        name: 'Nike ',
        quality: 'GOOD QUALITY',
        price: 45,
        img: '27a2e5341ba5.webp'
      },
      {
        name: 'Adidis-F50.jpg',
        quality: 'GOOD QUALITY',
        price: 45,
        img: 'Adidis-F50.jpg'
      },
      {
        name: 'Phantom',
        quality: 'GOOD QUALITY',
        price: 45,
        img: 'IMG-20261002-WA0095.jpg'
      },
    ],
    budget: [
      {
        name: 'Adidis-F50.jpg',
        quality: 'GOOD QUALITY',
        price: 45,
        img: 'Adidis-F50.jpg'
      },
      
      {
        name: 'Starter Shooter',
        quality: 'BUDGET QUALITY',
        price: 45,
        img: 'IMG-20261002-WA0107.jpg'
      },
      {
        name: 'NB predator',
        quality: 'BUDGET QUALITY',
        price: 45,
        img: 'IMG-20261002-WA0102.jpg'
      }
    ]
  },

  init() {
    this.render();
    this.updateCount();
    this.renderCart();
  },

  search() {
    const input = document.getElementById('searchInput');
    if (input) {
      this.searchText = input.value.toLowerCase().trim();
    }
    this.render();
  },

  render() {
    const all = [
      ...this.products.premium,
      ...this.products.standard,
      ...this.products.budget
    ];
    this.renderGrid('grid-all', all);
    this.renderGrid('grid-premium', this.products.premium);
    this.renderGrid('grid-standard', this.products.standard);
    this.renderGrid('grid-budget', this.products.budget);
  },

  renderGrid(gridId, list) {
    const el = document.getElementById(gridId);
    if (!el) return;

    let filtered = list;
    if (this.searchText) {
      filtered = list.filter((p) =>
        p.name.toLowerCase().includes(this.searchText)
      );
    }

    if (filtered.length === 0) {
      el.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px;color:#555;">
          No shoes found for "${this.searchText}"
        </div>`;
      return;
    }

    el.innerHTML = filtered
      .map(
        (p) => `
          <div class="card">
            <img class="card-img" src="${p.img}" loading="lazy" />
            <div class="card-info">
              <div class="card-name">${p.name}</div>
              <div class="card-quality">${p.quality}</div>
              <div class="card-price">$${p.price.toFixed(2)} <span>USD</span></div>
              <div class="card-stock">IN STOCK</div>
              <button
                class="btn-add"
                data-name="${p.name}"
                data-price="${p.price}"
                data-img="${p.img}"
                onclick="Store.addByButton(this)"
              >+</button>
            </div>
          </div>
        `
      )
      .join('');
  },

  addByButton(btn) {
    const name = btn.getAttribute('data-name');
    const price = parseFloat(btn.getAttribute('data-price'));
    const img = btn.getAttribute('data-img');
    this.add(name, price, img);
  },

  save() {
    localStorage.setItem('tn_cart', JSON.stringify(this.cart));
    this.updateCount();
    this.renderCart();
  },

  add(name, price, img) {
    const found = this.cart.find((i) => i.name === name);
    if (found) {
      found.qty++;
    } else {
      this.cart.push({ name, price, img, qty: 1 });
    }
    this.save();
  },

  inc(index) {
    this.cart[index].qty++;
    this.save();
  },

  dec(index) {
    this.cart[index].qty--;
    if (this.cart[index].qty <= 0) {
      this.cart.splice(index, 1);
    }
    this.save();
  },

  remove(index) {
    this.cart.splice(index, 1);
    this.save();
  },

  updateCount() {
    const total = this.cart.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('#cartCount').forEach((el) => {
      el.innerText = total;
    });
  },

  renderCart() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:30px;color:#555;">
          Your cart is empty
        </div>`;
      totalEl.innerText = '$0.00';
      return;
    }

    let total = 0;

    container.innerHTML = this.cart
      .map((it, idx) => {
        const t = it.price * it.qty;
        total += t;
        return `
          <div class="cart-row">
            <div class="cart-left">
              <div class="cart-name">${it.name}</div>
              <div class="cart-each">$${it.price.toFixed(2)} each</div>
            </div>
            <div class="cart-middle">
              <div class="qty-pill">
                <button class="q-btn" onclick="Store.dec(${idx})">-</button>
                <span class="q-num">${it.qty}</span>
                <button class="q-btn" onclick="Store.inc(${idx})">+</button>
              </div>
              <button class="btn-remove" onclick="Store.remove(${idx})">✕</button>
            </div>
            <div class="cart-price">$${t.toFixed(2)}</div>
          </div>
        `;
      })
      .join('');

    totalEl.innerText = `$${total.toFixed(2)}`;
  },

  openCart() {
    document.getElementById('cartOverlay').classList.add('open');
    document.getElementById('cartDrawer').classList.add('open');
  },

  closeCart() {
    document.getElementById('cartOverlay').classList.remove('open');
    document.getElementById('cartDrawer').classList.remove('open');
  },

  checkout() {
    if (this.cart.length === 0) {
      return alert('Cart empty');
    }

    let raw = MY_WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
    if (raw.startsWith('0')) {
      raw = '263' + raw.substring(1);
    }

    let total = 0;
    let list = '';

    this.cart.forEach((it, i) => {
      const t = it.price * it.qty;
      total += t;
      list += `${i + 1}. ${it.name} x${it.qty} = $${t.toFixed(2)}%0A`;
    });

    const msg = `Hi TN FOOTWEAR%0A%0A${list}%0ATotal: $${total.toFixed(2)}`;
    const url = `https://api.whatsapp.com/send?phone=${raw}&text=${msg}`;
    window.open(url, '_blank');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Store.init();
});