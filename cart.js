
// Get current user's cart
function getUserCart() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (user) {
        // If logged in, use user's cart
        return user.cart || [];
    } else {
        // If not logged in, use anonymous cart
        const anonCart = localStorage.getItem('anonCart');
        return anonCart ? JSON.parse(anonCart) : [];
    }
}

// Save current user's cart
function saveUserCart(cart) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (user) {
        // If logged in, save to user data
        user.cart = cart;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Also update in users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }
    } else {
        // If not logged in, save to anonymous cart
        localStorage.setItem('anonCart', JSON.stringify(cart));
    }
}

// Update all other cart functions to use getUserCart() and saveUserCart()
// instead of getCart() and saveCart()
// Cart functions
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    showNotification(`${product.name} added to cart`);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
    
    // If we're on the cart page, refresh the display
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
}

function updateCartItemQuantity(productId, newQuantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            removeFromCart(productId);
            return;
        }
    }
    
    saveCart(cart);
    updateCartCount();
    
    // If we're on the cart page, refresh the display
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
    
    // If we're on the cart page, refresh the display
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Display cart items on cart.html
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartContainer && cartTotal) {
        const cart = getCart();
        
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotal.textContent = '$0.00';
            return;
        }
        
        cartContainer.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-subtotal">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartContainer.appendChild(itemElement);
            
            total += item.price * item.quantity;
        });
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners for quantity changes
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const input = this.parentElement.querySelector('.quantity-input');
                let quantity = parseInt(input.value);
                
                if (this.classList.contains('minus')) {
                    quantity = Math.max(1, quantity - 1);
                } else if (this.classList.contains('plus')) {
                    quantity += 1;
                }
                
                input.value = quantity;
                updateCartItemQuantity(productId, quantity);
            });
        });
        
        // Add event listener for direct input changes
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const quantity = parseInt(this.value) || 1;
                updateCartItemQuantity(productId, quantity);
            });
        });
        
        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
        
        // Clear cart button
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCart);
        }
    }
});