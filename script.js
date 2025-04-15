// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 150,
        image: "02.jpg",
        description: "GUGGU FG-169 SH12 Headset Super Extra Bass Bluetooth Headset (Furious On the Ear) Bluetooth  (Multicolor, True Wireless)."
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 1000,
        image: "04.jpeg",
        description: "Noise Colorfit Icon 2 1.8'' Display with Bluetooth Calling, AI Voice Assistant Smartwatch  (Deep Wine Strap, Regular)1.8 " 
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        price: 250,
        image: "03.jpeg",
        description: "F FERONS Wireless rechargeable brand new portable Premium bass Multimedia FFRTG-113 9 W Bluetooth Speaker  (Black, Stereo Channel)."
    },
    {
        id: 4,
        name: "Laptop ",
        price: 5000,
        image: "01.jpg",
        description: " SAMSUNG Galaxy Book4 Metal Intel Core i3 13th Gen 1315U - (8 GB/512 GB SSD/Windows 11 Home) NP750XGJ-LG4IN Thin and Light Laptop  (15.6 Inch, Gray, 1.55 Kg, With MS Office)."
    },
    {
        id: 5,
        name: "iphone",
        price: 5000,
        image: "05.jpg",
        description: "Apple iPhone 15 (Pink, 128 GB) 128 GB ROM 15.49 cm (6.1 inch) Super Retina XDR Display48MP + 12MP | 12MP Front CameraA16 Bionic Chip, 6 Core Processor Processor."
    },
    {
        id: 6,
        name: "Data cable",
        price: 10,
        image: "06.jpeg",
        description: "Portronics Type C 3 A 1 m Konenct X USB to Fast Charging with 1M Length  (Compatible with Smartphones, White, One Cable)."
    }
];

// Display featured products on homepage
function displayFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    
    if (featuredContainer) {
        // Show first 4 products as featured
        const featuredProducts = products.slice(0, 4);
        
        featuredProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-card';
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            featuredContainer.appendChild(productElement);
        });
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayFeaturedProducts();
    
    // Add event listeners for "Add to Cart" buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            if (product) {
                addToCart(product);
                updateCartCount();
            }
        }
    });
});

// Update cart count in navbar
function updateCartCount() {
    const cart = getCart();
    const countElements = document.querySelectorAll('.cart-count');
    
    countElements.forEach(element => {
        element.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    });
}