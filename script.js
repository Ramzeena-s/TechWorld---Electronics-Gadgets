const productContainer = document.getElementById("product-container");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const brandFilter = document.getElementById("brand-filter");

let cart = JSON.parse(localStorage.getItem("techworldCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("techworldWishlist")) || [];
let reviews = JSON.parse(localStorage.getItem("techworldReviews")) || [];


/* =========================
   PRODUCTS
========================= */

function displayProducts(productList) {

    if (!productContainer) return;

    productContainer.innerHTML = "";

    if (productList.length === 0) {
        productContainer.innerHTML = `
            <div class="no-products">
                <h3>No products found 😔</h3>
                <p>Try another search or category.</p>
            </div>
        `;
        return;
    }

    productList.forEach(product => {

        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <h3>${product.name}</h3>

            <p><strong>Brand:</strong> ${product.brand}</p>

            <p>⭐ ${product.rating}</p>

            <h4>₹${product.price.toLocaleString("en-IN")}</h4>

            <p>
                <strong>Stock:</strong>
                ${product.stock > 0 ? "Available" : "Out of Stock"}
            </p>

            <div class="product-buttons">

                <button onclick="viewProduct(${product.id})">
                    👁️ View Details
                </button>

                <button onclick="addToCart(${product.id})">
                    🛒 Add to Cart
                </button>

            </div>
        `;

        productContainer.appendChild(productCard);
    });
}


/* =========================
   SEARCH & FILTER
========================= */

function filterProducts() {

    const searchText = searchInput
        ? searchInput.value.toLowerCase()
        : "";

    const selectedCategory = categoryFilter
        ? categoryFilter.value
        : "all";

    const selectedBrand = brandFilter
        ? brandFilter.value
        : "all";

    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.brand.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        const matchesBrand =
            selectedBrand === "all" ||
            product.brand === selectedBrand;

        return matchesSearch &&
               matchesCategory &&
               matchesBrand;
    });

    displayProducts(filteredProducts);
}


if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", filterProducts);
}

if (brandFilter) {
    brandFilter.addEventListener("change", filterProducts);
}


/* =========================
   CART
========================= */

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    const existingProduct = cart.find(
        item => item.id === productId
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem(
        "techworldCart",
        JSON.stringify(cart)
    );

    updateCartCount();

    alert(product.name + " added to cart! 🛒");
}


function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) return;

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;
}


function displayCart() {

    const cartContainer =
        document.getElementById("cart-container");

    if (!cartContainer) return;

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">

                <h3>Your cart is empty 🛒</h3>

                <p>
                    Add some amazing gadgets to your cart!
                </p>

                <a href="index.html#products">
                    <button>Continue Shopping</button>
                </a>

            </div>
        `;

        return;
    }

    let subtotal = 0;

    cartContainer.innerHTML = `

        <div class="cart-items">

            ${cart.map((item, index) => {

                subtotal += item.price * item.quantity;

                return `

                    <div class="cart-item">

                        <img
                            src="${item.image}"
                            alt="${item.name}"
                        >

                        <div class="cart-item-info">

                            <h3>${item.name}</h3>

                            <p>${item.brand}</p>

                            <p>
                                ₹${item.price.toLocaleString("en-IN")}
                            </p>

                        </div>

                        <div class="quantity-controls">

                            <button
                                onclick="changeQuantity(${index}, -1)"
                            >
                                −
                            </button>

                            <span>${item.quantity}</span>

                            <button
                                onclick="changeQuantity(${index}, 1)"
                            >
                                +
                            </button>

                        </div>

                        <div class="cart-item-total">

                            <strong>
                                ₹${(
                                    item.price * item.quantity
                                ).toLocaleString("en-IN")}
                            </strong>

                            <button
                                class="remove-btn"
                                onclick="removeFromCart(${index})"
                            >
                                ❌ Remove
                            </button>

                        </div>

                    </div>
                `;

            }).join("")}

        </div>

        <div class="cart-summary">

            <h3>Order Summary</h3>

            <p>
                Subtotal:
                <strong>
                    ₹${subtotal.toLocaleString("en-IN")}
                </strong>
            </p>

            <p>
                Shipping:
                <strong>FREE</strong>
            </p>

            <hr>

            <h3>
                Total:
                ₹${subtotal.toLocaleString("en-IN")}
            </h3>

            <button
                class="checkout-btn"
                onclick="goToCheckout()"
            >
                Proceed to Checkout
            </button>

        </div>
    `;
}


function changeQuantity(index, change) {

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem(
        "techworldCart",
        JSON.stringify(cart)
    );

    displayCart();
    updateCartCount();
}


function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "techworldCart",
        JSON.stringify(cart)
    );

    displayCart();
    updateCartCount();
}


function goToCheckout() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    window.location.href = "checkout.html";
}


/* =========================
   PRODUCT DETAILS
========================= */

function viewProduct(productId) {

    window.location.href =
        "product-detail.html?id=" + productId;
}


function displayProductDetail() {

    const container =
        document.getElementById("product-detail-container");

    if (!container) return;

    const urlParams =
        new URLSearchParams(window.location.search);

    const productId =
        Number(urlParams.get("id"));

    const product =
        products.find(item => item.id === productId);

    if (!product) {

        container.innerHTML = `
            <h2>Product not found 😔</h2>

            <a href="index.html#products">
                Back to Products
            </a>
        `;

        return;
    }

    container.innerHTML = `

        <div class="product-detail">

            <div class="product-detail-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>

            <div class="product-detail-info">

                <h1>${product.name}</h1>

                <p class="brand">
                    Brand: ${product.brand}
                </p>

                <p class="rating">
                    ⭐ ${product.rating} / 5
                </p>

                <p class="price">
                    ₹${product.price.toLocaleString("en-IN")}
                </p>

                <p class="stock-available">
                    ✓ In Stock (${product.stock} available)
                </p>

                <p class="product-description">
                    Experience premium technology with
                    ${product.name}. Designed for performance,
                    reliability and an amazing user experience.
                </p>

                <div class="specifications">

                    <h3>Specifications</h3>

                    <ul>

                        <li>
                            Brand: ${product.brand}
                        </li>

                        <li>
                            Category: ${product.category}
                        </li>

                        <li>
                            Rating: ⭐ ${product.rating}
                        </li>

                        <li>
                            Stock: ${product.stock} units
                        </li>

                    </ul>

                </div>

                <div class="product-buttons">

                    <button onclick="addToCart(${product.id})">
                        🛒 Add to Cart
                    </button>

                    <button onclick="addToWishlist(${product.id})">
                        ❤️ Add to Wishlist
                    </button>

                </div>

                <br>

                <button
                    class="back-btn"
                    onclick="window.location.href='index.html#products'"
                >
                    ← Back to Products
                </button>

            </div>

        </div>

        <div class="reviews-section">

            <h2>⭐ Customer Reviews</h2>

            <div class="review-form">

                <input
                    type="text"
                    id="review-name"
                    placeholder="Your name"
                >

                <select id="review-rating">

                    <option value="5">
                        ⭐⭐⭐⭐⭐ 5
                    </option>

                    <option value="4">
                        ⭐⭐⭐⭐ 4
                    </option>

                    <option value="3">
                        ⭐⭐⭐ 3
                    </option>

                    <option value="2">
                        ⭐⭐ 2
                    </option>

                    <option value="1">
                        ⭐ 1
                    </option>

                </select>

                <textarea
                    id="review-text"
                    placeholder="Write your review..."
                ></textarea>

                <button
                    onclick="addReview(${product.id})"
                >
                    Submit Review ⭐
                </button>

            </div>

            <div id="reviews-container"></div>

        </div>
    `;

    displayReviews(product.id);
}


/* =========================
   WISHLIST
========================= */

function addToWishlist(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    const alreadyExists =
        wishlist.some(item => item.id === productId);

    if (alreadyExists) {

        alert(
            "This product is already in your wishlist ❤️"
        );

        return;
    }

    wishlist.push(product);

    localStorage.setItem(
        "techworldWishlist",
        JSON.stringify(wishlist)
    );

    updateWishlistCount();

    alert(product.name + " added to wishlist ❤️");
}


function removeFromWishlist(index) {

    wishlist.splice(index, 1);

    localStorage.setItem(
        "techworldWishlist",
        JSON.stringify(wishlist)
    );

    displayWishlist();
    updateWishlistCount();
}


function updateWishlistCount() {

    const wishlistCount =
        document.getElementById("wishlist-count");

    if (!wishlistCount) return;

    wishlistCount.textContent =
        wishlist.length;
}


function displayWishlist() {

    const container =
        document.getElementById("wishlist-container");

    if (!container) return;

    if (wishlist.length === 0) {

        container.innerHTML = `
            <div class="empty-wishlist">

                <h3>Your wishlist is empty ❤️</h3>

                <p>
                    Add your favourite gadgets here!
                </p>

                <a href="index.html#products">
                    Continue Shopping
                </a>

            </div>
        `;

        return;
    }

    container.innerHTML =
        wishlist.map((product, index) => `

            <div class="wishlist-item">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="wishlist-info">

                    <h3>${product.name}</h3>

                    <p>
                        Brand: ${product.brand}
                    </p>

                    <p>
                        ⭐ ${product.rating}
                    </p>

                    <h4>
                        ₹${product.price.toLocaleString("en-IN")}
                    </h4>

                    <button
                        onclick="addToCart(${product.id})"
                    >
                        🛒 Add to Cart
                    </button>

                    <button
                        onclick="removeFromWishlist(${index})"
                    >
                        ❌ Remove
                    </button>

                </div>

            </div>

        `).join("");
}


/* =========================
   REVIEWS
========================= */

function addReview(productId) {

    const nameInput =
        document.getElementById("review-name");

    const ratingInput =
        document.getElementById("review-rating");

    const textInput =
        document.getElementById("review-text");

    if (!nameInput || !ratingInput || !textInput) return;

    const name = nameInput.value.trim();
    const rating = Number(ratingInput.value);
    const text = textInput.value.trim();

    if (name === "" || text === "") {

        alert(
            "Please enter your name and review."
        );

        return;
    }

    if (rating < 1 || rating > 5) {

        alert(
            "Please select a rating between 1 and 5."
        );

        return;
    }

    if (!reviews[productId]) {
        reviews[productId] = [];
    }

    reviews[productId].push({

        name: name,
        rating: rating,
        text: text,
        date: new Date().toLocaleDateString()

    });

    localStorage.setItem(
        "techworldReviews",
        JSON.stringify(reviews)
    );

    nameInput.value = "";
    ratingInput.value = "5";
    textInput.value = "";

    displayReviews(productId);

    alert(
        "Review submitted successfully! ⭐"
    );
}


function displayReviews(productId) {

    const reviewContainer =
        document.getElementById("reviews-container");

    if (!reviewContainer) return;

    const productReviews =
        reviews[productId] || [];

    if (productReviews.length === 0) {

        reviewContainer.innerHTML = `
            <p>
                No reviews yet. Be the first to review
                this product! ⭐
            </p>
        `;

        return;
    }

    reviewContainer.innerHTML =
        productReviews.map(review => `

            <div class="review-card">

                <h4>
                    ${review.name}
                </h4>

                <p>
                    ${"⭐".repeat(review.rating)}
                </p>

                <p>
                    ${review.text}
                </p>

                <small>
                    ${review.date}
                </small>

            </div>

        `).join("");
}


/* =========================
   CHECKOUT
========================= */

function displayCheckout() {

    const checkoutItems =
        document.getElementById("checkout-items");

    if (!checkoutItems) return;

    if (cart.length === 0) {

        checkoutItems.innerHTML =
            `<p>Your cart is empty.</p>`;

        return;
    }

    let subtotal = 0;

    checkoutItems.innerHTML =
        cart.map(item => {

            subtotal +=
                item.price * item.quantity;

            return `

                <div class="checkout-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <div class="checkout-item-info">

                        <h4>${item.name}</h4>

                        <p>
                            Qty: ${item.quantity}
                        </p>

                    </div>

                    <strong>
                        ₹${(
                            item.price * item.quantity
                        ).toLocaleString("en-IN")}
                    </strong>

                </div>
            `;

        }).join("");

    const subtotalElement =
        document.getElementById("checkout-subtotal");

    const totalElement =
        document.getElementById("checkout-total");

    if (subtotalElement) {
        subtotalElement.textContent =
            "₹" + subtotal.toLocaleString("en-IN");
    }

    if (totalElement) {
        totalElement.textContent =
            "₹" + subtotal.toLocaleString("en-IN");
    }
}


/* =========================
   PLACE ORDER
========================= */

const checkoutForm =
    document.getElementById("checkout-form");

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            if (cart.length === 0) {

                alert("Your cart is empty!");

                return;
            }

            const customerName =
                document
                    .getElementById("customer-name")
                    .value
                    .trim();

            const customerEmail =
                document
                    .getElementById("customer-email")
                    .value
                    .trim();

            const customerPhone =
                document
                    .getElementById("customer-phone")
                    .value
                    .trim();

            const customerAddress =
                document
                    .getElementById("customer-address")
                    .value
                    .trim();

            const customerCity =
                document
                    .getElementById("customer-city")
                    .value
                    .trim();

            const customerPin =
                document
                    .getElementById("customer-pin")
                    .value
                    .trim();

            const payment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );

            if (!payment) {

                alert(
                    "Please select a payment method."
                );

                return;
            }

            const orderId =
                "TW" +
                Math.floor(
                    1000 + Math.random() * 9000
                );

            const order = {

                orderId: orderId,

                customerName: customerName,

                customerEmail: customerEmail,

                customerPhone: customerPhone,

                address: customerAddress,

                city: customerCity,

                pin: customerPin,

                paymentMethod: payment.value,

                items: cart,

                date:
                    new Date().toLocaleDateString(),

                status: "Order Placed"

            };

            localStorage.setItem(
                "techworldOrder",
                JSON.stringify(order)
            );

            cart = [];

            localStorage.setItem(
                "techworldCart",
                JSON.stringify(cart)
            );

            updateCartCount();

            alert(
                "Order placed successfully! 🎉\n\n" +
                "Your Order ID is: " +
                orderId
            );

            window.location.href =
                "order-tracking.html?id=" + orderId;
        }
    );
}


/* =========================
   ORDER TRACKING
========================= */

function trackOrder() {

    const orderInput =
        document.getElementById("order-id");

    const result =
        document.getElementById("tracking-result");

    if (!orderInput || !result) return;

    const orderId =
        orderInput.value.trim().toUpperCase();

    if (orderId === "") {

        result.innerHTML = `
            <div class="tracking-error">

                <p>
                    ⚠️ Please enter an Order ID.
                </p>

            </div>
        `;

        return;
    }

    const savedOrder =
        JSON.parse(
            localStorage.getItem("techworldOrder")
        );

    if (
        savedOrder &&
        savedOrder.orderId === orderId
    ) {

        result.innerHTML = `

            <div class="order-status">

                <h2>
                    Order #${orderId}
                </h2>

                <p class="status-success">
                    🚚 Your order has been placed!
                </p>

                <div class="tracking-steps">

                    <div class="tracking-step completed">

                        <div class="step-icon">
                            ✓
                        </div>

                        <h3>
                            Order Placed
                        </h3>

                        <p>
                            Your order has been received.
                        </p>

                    </div>

                    <div class="tracking-step">

                        <div class="step-icon">
                            2
                        </div>

                        <h3>
                            Order Confirmed
                        </h3>

                        <p>
                            Your order will be confirmed soon.
                        </p>

                    </div>

                    <div class="tracking-step">

                        <div class="step-icon">
                            3
                        </div>

                        <h3>
                            Shipped
                        </h3>

                        <p>
                            Your package will be shipped soon.
                        </p>

                    </div>

                    <div class="tracking-step">

                        <div class="step-icon">
                            4
                        </div>

                        <h3>
                            Out for Delivery
                        </h3>

                        <p>
                            Your package will be delivered soon.
                        </p>

                    </div>

                    <div class="tracking-step">

                        <div class="step-icon">
                            5
                        </div>

                        <h3>
                            Delivered
                        </h3>

                        <p>
                            Your order will be delivered.
                        </p>

                    </div>

                </div>

            </div>
        `;

    } else {

        result.innerHTML = `

            <div class="tracking-error">

                <h3>
                    ❌ Order Not Found
                </h3>

                <p>
                    We couldn't find an order with ID
                    <strong>${orderId}</strong>.
                </p>

            </div>
        `;
    }
}


/* =========================
   INITIALIZE
========================= */

if (productContainer) {
    displayProducts(products);
}

if (document.getElementById("cart-container")) {
    displayCart();
}

if (document.getElementById("checkout-items")) {
    displayCheckout();
}

if (document.getElementById("product-detail-container")) {
    displayProductDetail();
}

if (document.getElementById("wishlist-container")) {
    displayWishlist();
}

updateCartCount();
updateWishlistCount();
/* =========================
   ORDER HISTORY
========================= */

function displayOrderHistory() {

    const container =
        document.getElementById("order-history-container");

    if (!container) return;

    const savedOrder =
        JSON.parse(localStorage.getItem("techworldOrder"));

    if (!savedOrder) {

        container.innerHTML = `
            <div class="empty-orders">

                <h3>📦 No Orders Yet</h3>

                <p>
                    You haven't placed any orders yet.
                </p>

                <a href="index.html#products">
                    Continue Shopping
                </a>

            </div>
        `;

        return;
    }

    container.innerHTML = `

        <div class="order-card">

            <div class="order-header">

                <h3>
                    Order #${savedOrder.orderId}
                </h3>

                <span>
                    ${savedOrder.date}
                </span>

            </div>

            <p>
                <strong>Status:</strong>
                ${savedOrder.status}
            </p>

            <p>
                <strong>Payment:</strong>
                ${savedOrder.paymentMethod}
            </p>

            <h4>Products</h4>

            <div class="order-products">

                ${savedOrder.items.map(item => `

                    <div class="order-product">

                        <img
                            src="${item.image}"
                            alt="${item.name}"
                        >

                        <div>

                            <h4>${item.name}</h4>

                            <p>
                                Quantity:
                                ${item.quantity}
                            </p>

                            <p>
                                ₹${(
                                    item.price *
                                    item.quantity
                                ).toLocaleString("en-IN")}
                            </p>

                        </div>

                    </div>

                `).join("")}

            </div>

            <div class="order-customer">

                <h4>Shipping Information</h4>

                <p>
                    ${savedOrder.customerName}
                </p>

                <p>
                    ${savedOrder.customerEmail}
                </p>

                <p>
                    ${savedOrder.customerPhone}
                </p>

                <p>
                    ${savedOrder.address},
                    ${savedOrder.city} -
                    ${savedOrder.pin}
                </p>

            </div>

            <button
                onclick="window.location.href='order-tracking.html?id=${savedOrder.orderId}'"
                class="track-order-btn"
            >
                🚚 Track Order
            </button>

        </div>
    `;
}


/* Display Order History */

if (
    document.getElementById(
        "order-history-container"
    )
) {

    displayOrderHistory();

}