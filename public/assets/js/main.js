// Utilities
const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));
const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser'));
const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];

// Update Navbar based on Auth State
function updateNavbar() {
    const user = getCurrentUser();
    const authLink = document.getElementById('authLink');
    const adminLink = document.getElementById('adminLink');
    const historyLink = document.getElementById('historyLink');
    const cartCount = document.getElementById('cartCount');

    if (cartCount) {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    if (user) {
        if (authLink) {
            authLink.innerHTML = `<a class="nav-link cursor-pointer" onclick="logout()">Logout (${user.name})</a>`;
        }
        if (historyLink) {
            historyLink.style.display = 'block';
        }
        if (user.isAdmin && adminLink) {
            adminLink.style.display = 'block';
        }
    } else {
        if (authLink) {
            authLink.innerHTML = `<a class="nav-link" href="login.html">Login</a>`;
        }
        if (historyLink) historyLink.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Fetch Menu
async function loadMenu() {
    try {
        const response = await fetch('assets/data/menu.json');
        const menu = await response.json();
        return menu;
    } catch (error) {
        console.error('Error loading menu:', error);
        return [];
    }
}

// Format Currency
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
};

// Add to Cart
function addToCart(id, name, price, image) {
    const cart = getCart();
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    saveCart(cart);
    updateNavbar();
    showToast(`${name} added to cart!`);
}

// Toast Notification
function showToast(message) {
    const toastHtml = `
        <div class="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3" role="alert" aria-live="assertive" aria-atomic="true" id="liveToast">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', toastHtml);
    const toastEl = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    setTimeout(() => {
        toastEl.remove();
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
});
