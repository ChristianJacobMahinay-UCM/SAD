// 1. Data: Product Catalog
const products = [
    { id: 1, name: "Mechanical Keyboard", price: 6250.00, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=500&q=60" },
    { id: 2, name: "Noise-Cancel Headphones", price: 9950.00, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=60" },
    { id: 3, name: "Midnight Graphic Tee", price: 1200.00, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&q=60" },
    { id: 4, name: "Vintage Wash Oversized", price: 1500.00, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&q=60" },
    { id: 5, name: "Essential White Tee", price: 850.00, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=60" },
    { id: 6, name: "Abstract Print Shirt", price: 1800.00, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=500&q=60" },
    { id: 7, name: "Urban Streetwear Polo", price: 1450.00, image: "https://images.unsplash.com/photo-1626557981101-aae6f84aa6ff?auto=format&fit=crop&w=500&q=60" },
    { id: 8, name: "Tactical Cargo Pants", price: 2500.00, image: "https://images.unsplash.com/photo-1552960562-daf630e9278b?auto=format&fit=crop&w=500&q=60" },
    { id: 9, name: "Ripped Black Denim", price: 2800.00, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&q=60" },
    { id: 10, name: "Relaxed Fit Joggers", price: 1600.00, image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=500&q=60" },
    { id: 11, name: "Slim Chino Trousers", price: 1950.00, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=500&q=60" },
    { id: 12, name: "Street Runner Shoes", price: 5500.00, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=60" },
];

// 2. State Management
let cart = [];
let currentUser = localStorage.getItem('user') || null;

// 3. DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const toast = document.getElementById('toast');
const deliveryInput = document.getElementById('deliveryAddress');

// Auth DOM
const loginOverlay = document.getElementById('loginOverlay');
const authBtn = document.getElementById('authBtn');
const loginEmail = document.getElementById('loginEmail');

// Order History DOM
const ordersOverlay = document.getElementById('ordersOverlay');
const ordersList = document.getElementById('ordersList');

// Helper: Format PHP
function formatCurrency(amount) {
    return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 4. Render Products
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${formatCurrency(product.price)}</p>
                <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
    updateAuthUI();
}

// 5. Cart Logic
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCartUI();
    showToast('Item added to cart!');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    cartCount.textContent = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = formatCurrency(total);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">${formatCurrency(item.price)}</p>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `).join('');
    }
}

// 6. UI Toggles
function toggleCart() {
    cartOverlay.style.display = (cartOverlay.style.display === 'flex') ? 'none' : 'flex';
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// 7. AUTHENTICATION LOGIC
function toggleAuth() {
    if (currentUser) {
        // Logout logic
        localStorage.removeItem('user');
        currentUser = null;
        showToast('Logged out successfully');
        updateAuthUI();
        closeOrdersModal(); // Close orders if open
    } else {
        // Open Login Modal
        loginOverlay.style.display = 'flex';
    }
}

function closeLogin() {
    loginOverlay.style.display = 'none';
}

function loginUser() {
    const email = loginEmail.value;
    if (email.trim() === "") {
        alert("Please enter an email.");
        return;
    }
    // Simulate Login
    currentUser = email;
    localStorage.setItem('user', email);
    closeLogin();
    updateAuthUI();
    showToast(Welcome back, ${email.split('@')[0]}!);
    
    // If cart has items, open cart immediately
    if (cart.length > 0) {
        toggleCart();
    }
}

function updateAuthUI() {
    if (currentUser) {
        authBtn.textContent = "Logout (" + currentUser.split('@')[0] + ")";
    } else {
        authBtn.textContent = "Login";
    }
}

// 8. CHECKOUT LOGIC
function processCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    if (!currentUser) {
        toggleCart();
        setTimeout(() => {
            loginOverlay.style.display = 'flex';
            showToast('Please login to continue');
        }, 200);
        return;
    }

    const address = deliveryInput.value.trim();
    if (!address) {
        alert('Please enter your Delivery Address.');
        deliveryInput.focus();
        return;
    }

    // Generate Order
    const total = cart.reduce((s,i) => s + i.price, 0);
    const trackingID = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    
    const newOrder = {
        id: trackingID,
        user: currentUser,
        address: address,
        items: cart.length,
        total: total,
        timestamp: Date.now(), // Use valid timestamp for sorting/status
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    };

    // Save to LocalStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    existingOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    // Success
    alert(ORDER PLACED!\n\nID: ${trackingID}\nYou can view this in "My Orders");
    
    // Reset
    cart = [];
    deliveryInput.value = '';
    updateCartUI();
    toggleCart();
}

// 9. AUTOMATIC ORDER HISTORY SYSTEM (UPDATED)
function openOrdersModal() {
    if (!currentUser) {
        loginOverlay.style.display = 'flex';
        showToast('Please login to view orders');
        return;
    }

    ordersOverlay.style.display = 'flex';
    loadUserOrders();
}

function closeOrdersModal() {
    ordersOverlay.style.display = 'none';
}

function loadUserOrders() {
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    // Filter orders for THIS user only
    const userOrders = allOrders.filter(o => o.user === currentUser);

    if (userOrders.length === 0) {
        ordersList.innerHTML = <p class="empty-msg">No orders found.</p>;
        return;
    }

    // Sort by newest first
    userOrders.reverse();

    ordersList.innerHTML = userOrders.map(order => {
        // Updated Status Logic
        const now = Date.now();
        const diffMinutes = (now - order.timestamp) / 60000;
        
        // DEFAULT STATUS (Immediate)
        let status = "Order Processed";
        let statusClass = "status-processing"; // Blue style
        let deliveryMsg = "Please wait 3-5 days to arrive.";

        // Simulation: Change to "Shipped" after 5 minutes
        if (diffMinutes > 5) {
            status = "Shipped";
            statusClass = "status-shipped"; // Green style
            deliveryMsg = "Your item is on the way! Arriving soon.";
        }

        return `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">#${order.id}</span>
                <span class="order-date">${order.date}</span>
            </div>
            <div class="order-details">
                Items: ${order.items} <br>
                Total: ${formatCurrency(order.total)} <br>
                <span style="font-size:0.8rem; color:var(--text-muted)">To: ${order.address}</span>
            </div>
            <div class="order-status-row">
                <span style="font-size:0.85rem; font-weight:600;">Status:</span>
                <span class="status-badge ${statusClass}">${status}</span>
            </div>
            <p style="font-size:0.8rem; color:var(--accent); margin-top:0.5rem; font-weight:600;">${deliveryMsg}</p>
        </div>
        `;
    }).join('');
}

// Close modals on outside click
window.onclick = function(event) {
    if (event.target == loginOverlay) closeLogin();
    if (event.target == ordersOverlay) closeOrdersModal();
    if (event.target == cartOverlay) toggleCart();
}

// Initialize
renderProducts();