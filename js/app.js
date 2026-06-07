/*==========================================================================
   E-COMMERCE MAIN LOGIC CORE ENGINE
   ========================================================================== */

// 1. Static Comprehensive Product Database Catalog Data
const products = [
    { id: 1, name: "hair clip", price: 2000, category: "hair clip", rating: 4.9, img: "https://media.istockphoto.com/id/1277309174/photo/these-hair-clips-are-flattering-on-everyone.jpg?s=612x612&w=0&k=20&c=QwuSRTG1F_D8htk7UtT2NmbSfMm6uYthkGIiJDAQWdQ=", desc: "Premium hair structure." },
    { id: 2, name: "Hair bands", price: 1000, category: "Hair bands", rating: 4.8, img: "WhatsApp Image 2026-06-06 at 16.03.57.jpeg", desc: "Seamless double-drawn natural weave tracks." },
    {id: 3, name: "Bobby pins" ,price:1500 ,category: "bobby pins" ,rating :4.6 , img :"https://i.ebayimg.com/images/g/AlQAAOSwR6plzucy/s-l400.jpg" ,desc :"beauty"},
    { id: 4, name: "Decorative headbands", price: 3000, category: "Decorative headbands", rating: 4.6, img: "https://ssww-blog.s3.amazonaws.com/blog/wp-content/uploads/DIY-Headbands.jpg", desc: "Soft padded feminine detail presentation piece." },
];

// Initialize Cart Array from localStorage or empty
let cart = JSON.parse(localStorage.getItem('GLAM_CART')) || [];
let activeCategory = "All";

// 2. Global UI Synchronizer
function updateGlobalCartUI() {
    localStorage.setItem('GLAM_CART', JSON.stringify(cart));
    
    // Count total unique or individual structural items
    const count = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    const badge = document.getElementById('cart-count');
    if(badge) badge.innerText = count;

    renderSidebarCartContents();
}

// Toggle Cart View Panel
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    if(sidebar) sidebar.classList.toggle('open');
}

// 3. Render Strategies
function renderFeaturedHome() {
    const target = document.getElementById('featured-products-container');
    if(!target) return;
    
    // Pick first 3 items for home marketing visibility showcase
    const featured = products.slice(0, 3);
    target.innerHTML = featured.map(p => createProductCardHtml(p, 1)).join('');
}

function renderShopCatalog(itemsList) {
    const target = document.getElementById('shop-catalog-grid');
    if(!target) return;
    
    if(itemsList.length === 0) {
        target.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 3rem; color: #888;">No matching high fashion assets match your criteria.</p>`;
        return;
    }
    target.innerHTML = itemsList.map(p => createProductCardHtml(p, p.id)).join('');
}

// Generate Modular UI Product Component Card Markup
function createProductCardHtml(product, inputRefId) {
    return `
        <div class="product-card">
            <div class="product-img-holder">
                <img src="${product.img}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p style="font-size:0.85rem; color:#777; margin-bottom:1rem; flex-grow:1;">${product.desc || ''}</p>
                <div class="product-meta">
                    <span class="price">TSh ${product.price.toLocaleString()}</span>
                    <span class="rating">★ ${product.rating}</span>
                </div>
                <div class="qty-selector">
                    <button class="qty-btn" onclick="adjustInputQty('${inputRefId}', -1)">-</button>
                    <input type="number" id="qty-input-${inputRefId}" value="1" min="1" style="width:50px; text-align:center; padding:0.2rem;" readonly>
                    <button class="qty-btn" onclick="adjustInputQty('${inputRefId}', 1)">+</button>
                </div>
                <button class="btn btn-primary" style="padding:0.6rem; font-size:0.9rem;" onclick="addToCartEngine(${product.id}, '${inputRefId}')">Add To Cart</button>
            </div>
        </div>
    `;
}

function adjustInputQty(inputId, delta) {
    const field = document.getElementById(`qty-input-${inputId}`);
    if(!field) return;
    let val = parseInt(field.value) + delta;
    if(val < 1) val = 1;
    field.value = val;
}

// 4. Cart Core Actions
function addToCartEngine(productId, inputRefId) {
    const qtyField = document.getElementById(`qty-input-${inputRefId}`);
    const qtyToAdd = qtyField ? parseInt(qtyField.value) : 1;
    
    const matchedProduct = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += qtyToAdd;
    } else {
        cart.push({
            id: matchedProduct.id,
            name: matchedProduct.name,
            price: matchedProduct.price,
            img: matchedProduct.img,
            quantity: qtyToAdd
        });
    }
    
    if(qtyField) qtyField.value = 1; // Reset product card entry back to 1
    updateGlobalCartUI();
    toggleCart(); // Modern luxury responsive feedback loop open interaction drawer
}

function updateCartItemQty(productId, newQty) {
    if(newQty <= 0) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if(item) item.quantity = newQty;
    }
    updateGlobalCartUI();
    renderCheckoutSummary(); // Live recalculation hook safety if viewing checkout state
}

function renderSidebarCartContents() {
    const container = document.getElementById('cart-items-target');
    const totalLabel = document.getElementById('cart-total-val');
    if(!container) return;

    if(cart.length === 0) {
        container.innerHTML = `<p style="padding:2rem 0; text-align:center; color:#999;">Your cart sits empty right now.</p>`;
        if(totalLabel) totalLabel.innerText = "TSh 0";
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map(item => {
        subtotal += item.price * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p style="font-size:0.85rem; color:var(--primary-rose)">TSh ${item.price.toLocaleString()} x ${item.quantity}</p>
                    <div style="margin-top: 0.2rem;">
                        <button style="border:none; padding:1px 6px; cursor:pointer;" onclick="updateCartItemQty(${item.id}, ${item.quantity - 1})">-</button>
                        <button style="border:none; padding:1px 6px; cursor:pointer;" onclick="updateCartItemQty(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <span class="remove-item" onclick="updateCartItemQty(${item.id}, 0)">&times;</span>
            </div>
        `;
    }).join('');

    if(totalLabel) totalLabel.innerText = `TSh ${subtotal.toLocaleString()}`;
}

// 5. Advanced Search & Category Processing Filters (Page 2 specific)
function filterCategory(cat, btnRef) {
    activeCategory = cat;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if(btnRef) btnRef.classList.add('active');
    filterAndSearchProducts();
}

function filterAndSearchProducts() {
    const query = document.getElementById('productSearch')?.value.toLowerCase() || "";
    
    let filtered = products;
    
    if(activeCategory !== "All") {
        if(activeCategory === "Clips & Bands") {
            filtered = products.filter(p => p.category === "Clips & Bands");
        } else if(activeCategory === "Bonnets & Scarves") {
            filtered = products.filter(p => p.category === "Bonnets & Scarves");
        } else {
            filtered = products.filter(p => p.category === activeCategory);
        }
    }

    if(query.trim() !== "") {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));
    }

    renderShopCatalog(filtered);
}

// 6. Checkout Execution (Page 3 specific)
function renderCheckoutSummary() {
    const summaryTarget = document.getElementById('checkout-summary-items');
    const grandTotalTarget = document.getElementById('checkout-total-val');
    if(!summaryTarget) return;

    if(cart.length === 0) {
        summaryTarget.innerHTML = `<p style="color:#aaa;">No dynamic items ready inside active transaction stack.</p>`;
        if(grandTotalTarget) grandTotalTarget.innerText = "TSh 0";
        return;
    }

    let runningTotal = 0;
    summaryTarget.innerHTML = cart.map(item => {
        const rowTotal = item.price * item.quantity;
        runningTotal += rowTotal;
        return `
            <div class="summary-row" style="margin-bottom:1rem; border-bottom:1px dashed #eee; padding-bottom:0.4rem;">
                <div>
                    <strong>${item.name}</strong><br>
                    <small style="color:#777">Qty: ${item.quantity}</small>
                </div>
                <span>TSh ${rowTotal.toLocaleString()}</span>
            </div>
        `;
    }).join('');

    if(grandTotalTarget) grandTotalTarget.innerText = `TSh ${runningTotal.toLocaleString()}`;
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    if(cart.length === 0) {
        alert("Your shopping process stack indicates zero contents to complete an automated purchase pipeline framework for.");
        return;
    }

    // Capture customer information securely
    const customerOrderData = {
        orderId: "GLM-" + Math.floor(100000 + Math.random() * 900000),
        clientName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        destination: document.getElementById('address').value + ", " + document.getElementById('city').value,
        payment: document.getElementById('paymentMethod').value,
        purchasedItems: cart,
        timestamp: new Date().toISOString()
    };

    // Simulate saving data out securely (Session, LocalStorage logs)
    console.log("Saving verified customer payload architecture down: ", customerOrderData);

    // Switch view structure with glass success screen layout natively
    const targetContainer = document.getElementById('checkout-main-view');
    if(targetContainer) {
        targetContainer.innerHTML = `
            <div class="checkout-card success-screen" style="grid-column: 1 / -1; background: var(--glass-bg); border: 1px solid var(--primary-rose);">
                <div class="success-icon">✓</div>
                <h2>Order Successfully Placed!</h2>
                <p style="margin: 1rem 0 2rem 0; color:#555;">Thank you for shopping luxury accents with us, <strong>${customerOrderData.clientName}</strong>. Your payment method profile route choice (<strong>${customerOrderData.payment}</strong>) is currently validated into preparation cycles.</p>
                
                <div style="background:#fff; border-radius:12px; padding:1.5rem; display:inline-block; text-align:left; border: 1px solid #eee; margin-bottom:2rem;">
                    <p><strong>Order Receipt reference ID:</strong> <span style="color:var(--primary-rose); font-family:monospace; font-size:1.1rem">${customerOrderData.orderId}</span></p>
                    <p><strong>Estimated Dispatched Logistics:</strong> Within 24-48 Hours</p>
                </div>
                <br>
                <a href="shop.html" class="btn btn-primary" onclick="clearCartFlush()">Continue Boutique Browsing</a>
            </div>
        `;
    }

    // Flush active global variables
    cart = [];
    localStorage.removeItem('GLAM_CART');
    const badge = document.getElementById('cart-count');
    if(badge) badge.innerText = 0;
}

function clearCartFlush() {
    // Utility clean safety escape trigger helper
    cart = [];
    updateGlobalCartUI();
}

// Boot setup script execution cycles natively
window.addEventListener('load', () => {
    updateGlobalCartUI();
});