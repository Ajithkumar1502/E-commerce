// auth.js - User authentication functionality

// Check if user is logged in
function checkAuth() {
    return localStorage.getItem('currentUser') !== null;
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Register new user
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Get existing users or create empty array
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if user already exists
            if (users.some(user => user.email === email)) {
                alert('User already exists with this email!');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password, // Note: In a real app, you would hash the password
                cart: []
            };
            
            // Save user
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Log the user in
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }
    
    // Login existing user
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Get users
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Find user
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Log the user in
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password!');
            }
        });
    }
    
    // Update navigation based on auth status
    updateNavigation();
});

// Update navigation links based on auth status
function updateNavigation() {
    const isLoggedIn = checkAuth();
    const navLinks = document.querySelectorAll('.nav-links');
    
    navLinks.forEach(links => {
        if (isLoggedIn) {
            // Remove login/register links
            const loginLink = links.querySelector('a[href="login.html"]');
            const registerLink = links.querySelector('a[href="register.html"]');
            
            if (loginLink) loginLink.remove();
            if (registerLink) registerLink.remove();
            
            // Add logout link
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.textContent = 'Logout';
            logoutLink.addEventListener('click', logout);
            links.appendChild(logoutLink);
            
            // Add profile link
            const user = getCurrentUser();
            const profileLink = document.createElement('a');
            profileLink.href = 'profile.html';
            profileLink.innerHTML = `<i class="fas fa-user"></i> ${user.name.split(' ')[0]}`;
            links.insertBefore(profileLink, links.querySelector('a[href="cart.html"]'));
        }
    });
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}