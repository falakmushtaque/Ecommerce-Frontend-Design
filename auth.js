document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication
    initAuth();
    
    /**
     * Initialize authentication
     */
    function initAuth() {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Get user elements
        const userProfileElement = document.querySelector('.action-item i.fa-user, .action i.fa-user');
        
        if (userProfileElement) {
            const profileElement = userProfileElement.closest('.action-item, .action');
            
            // Update profile element based on login status
            if (isLoggedIn && currentUser) {
                // Create user dropdown
                profileElement.innerHTML = `
                    <div class="user-dropdown">
                        <div class="user-dropdown-toggle">
                            <i class="fas fa-user-circle"></i>
                            <span>${currentUser.firstName}</span>
                        </div>
                        <div class="user-dropdown-menu">
                            <div class="user-dropdown-header">
                                <p>Hello, ${currentUser.firstName} ${currentUser.lastName}</p>
                                <p class="user-email">${currentUser.email}</p>
                            </div>
                            <ul class="user-dropdown-items">
                                <li><a href="#"><i class="fas fa-user"></i> My Profile</a></li>
                                <li><a href="#"><i class="fas fa-box"></i> My Orders</a></li>
                                <li><a href="#"><i class="fas fa-heart"></i> My Wishlist</a></li>
                                <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
                                <li><a href="#" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                            </ul>
                        </div>
                    </div>
                `;
                
                // Add styles for user dropdown
                addUserDropdownStyles();
                
                // Add event listeners for dropdown
                const dropdownToggle = profileElement.querySelector('.user-dropdown-toggle');
                const dropdownMenu = profileElement.querySelector('.user-dropdown-menu');
                
                if (dropdownToggle && dropdownMenu) {
                    dropdownToggle.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        dropdownMenu.classList.toggle('active');
                    });
                    
                    // Close dropdown when clicking outside
                    document.addEventListener('click', function(e) {
                        if (!profileElement.contains(e.target)) {
                            dropdownMenu.classList.remove('active');
                        }
                    });
                    
                    // Logout button
                    const logoutBtn = profileElement.querySelector('.logout-btn');
                    
                    if (logoutBtn) {
                        logoutBtn.addEventListener('click', function(e) {
                            e.preventDefault();
                            logout();
                        });
                    }
                }
            } else {
                // Show login/register option
                profileElement.innerHTML = `
                    <i class="fas fa-user"></i>
                    <span class="login-register-btn">Sign in</span>
                `;
                
                // Add click event for login/register
                const loginRegisterBtn = profileElement.querySelector('.login-register-btn');
                
                if (loginRegisterBtn) {
                    loginRegisterBtn.addEventListener('click', function() {
                        showAuthModal();
                    });
                }
            }
        }
    }
    
    /**
     * Add styles for user dropdown
     */
    function addUserDropdownStyles() {
        if (document.querySelector('style[data-auth-styles]')) return;
        
        const style = document.createElement('style');
        style.setAttribute('data-auth-styles', '');
        style.textContent = `
            .user-dropdown {
                position: relative;
                cursor: pointer;
            }
            
            .user-dropdown-toggle {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .user-dropdown-toggle i {
                font-size: 18px;
                color: #1C1C1C;
            }
            
            .user-dropdown-menu {
                position: absolute;
                top: calc(100% + 10px);
                right: 0;
                background-color: white;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                width: 220px;
                z-index: 100;
                overflow: hidden;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
            }
            
            .user-dropdown-menu.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .user-dropdown-header {
                padding: 15px;
                border-bottom: 1px solid #E0E0E0;
            }
            
            .user-dropdown-header p {
                margin: 0;
            }
            
            .user-dropdown-header p:first-child {
                font-weight: 500;
                color: #1C1C1C;
                margin-bottom: 4px;
            }
            
            .user-email {
                font-size: 14px;
                color: #8B96A5;
            }
            
            .user-dropdown-items {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .user-dropdown-items li {
                margin: 0;
            }
            
            .user-dropdown-items a {
                padding: 12px 15px;
                display: flex;
                align-items: center;
                gap: 10px;
                color: #505050;
                text-decoration: none;
                transition: background-color 0.2s ease;
            }
            
            .user-dropdown-items a:hover {
                background-color: #F5F5F5;
                color: #0D6EFD;
            }
            
            .user-dropdown-items a i {
                width: 16px;
            }
            
                .auth-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                display: flex;
                align-items: center;
                    justify-content: center;
                animation: modal-fade-in 0.3s ease forwards;
            }
            
            @keyframes modal-fade-in {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
                }
                
                .auth-modal-content {
                    background-color: white;
                    width: 90%;
                    max-width: 400px;
                    border-radius: 6px;
                    overflow: hidden;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    position: relative;
                }
                
            .auth-modal-tabs {
                    display: flex;
                border-bottom: 1px solid #E0E0E0;
                }
                
            .auth-modal-tab {
                    flex: 1;
                padding: 15px;
                text-align: center;
                font-weight: 500;
                    color: #8B96A5;
                    cursor: pointer;
                transition: color 0.2s ease;
                    position: relative;
                }
                
            .auth-modal-tab.active {
                    color: #0D6EFD;
                }
                
            .auth-modal-tab.active::after {
                content: '';
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: #0D6EFD;
                }
                
            .auth-modal-body {
                    padding: 20px;
                }
                
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
                }
                
                .form-group {
                    margin-bottom: 15px;
                }
                
                .form-group label {
                    display: block;
                margin-bottom: 5px;
                    font-size: 14px;
                color: #505050;
                }
                
            .form-group input {
                    width: 100%;
                    height: 40px;
                padding: 0 12px;
                border: 1px solid #E0E0E0;
                border-radius: 4px;
                    font-size: 14px;
                }
            
            .form-group input:focus {
                outline: none;
                border-color: #0D6EFD;
            }
            
            .form-group .error-message {
                color: #ea4335;
                font-size: 12px;
                margin-top: 5px;
                display: none;
            }
            
            .form-group.error input {
                border-color: #ea4335;
            }
            
            .form-group.error .error-message {
                display: block;
            }
            
            .form-submit {
                width: 100%;
                height: 40px;
                background-color: #0D6EFD;
                color: white;
                border: none;
                border-radius: 4px;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            
            .form-submit:hover {
                background-color: #0b5ed7;
            }
            
            .social-login {
                margin-top: 20px;
                text-align: center;
            }
            
            .social-login-title {
                position: relative;
                margin-bottom: 15px;
                font-size: 14px;
                color: #8B96A5;
            }
            
            .social-login-title::before,
            .social-login-title::after {
                content: '';
                position: absolute;
                top: 50%;
                width: calc(50% - 60px);
                height: 1px;
                background-color: #E0E0E0;
            }
            
            .social-login-title::before {
                left: 0;
            }
            
            .social-login-title::after {
                right: 0;
            }
            
            .social-login-buttons {
                display: flex;
                gap: 10px;
            }
            
            .social-login-button {
                flex: 1;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #E0E0E0;
                border-radius: 4px;
                color: #505050;
                text-decoration: none;
                transition: background-color 0.2s ease;
            }
            
            .social-login-button:hover {
                background-color: #F5F5F5;
            }
            
            .close-modal {
                position: absolute;
                top: 15px;
                right: 15px;
                font-size: 20px;
                color: #8B96A5;
                background: none;
                border: none;
                cursor: pointer;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Show authentication modal
     */
    function showAuthModal() {
        // Add styles for auth modal
        addUserDropdownStyles();
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        
        // Create modal content
        modal.innerHTML = `
            <div class="auth-modal-content">
                <button class="close-modal">&times;</button>
                
                <div class="auth-modal-tabs">
                    <div class="auth-modal-tab active" data-tab="login">Sign In</div>
                    <div class="auth-modal-tab" data-tab="register">Register</div>
                </div>
                
                <div class="auth-modal-body">
                    <form class="auth-form login-form active" id="login-form">
                        <div class="form-group">
                            <label for="login-email">Email</label>
                            <input type="email" id="login-email" placeholder="Enter your email" required>
                            <div class="error-message">Please enter a valid email</div>
                        </div>
                        
                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <input type="password" id="login-password" placeholder="Enter your password" required>
                            <div class="error-message">Password is required</div>
                        </div>
                        
                        <div class="form-group" style="text-align: right;">
                            <a href="#" style="font-size: 14px; color: #0D6EFD; text-decoration: none;">Forgot password?</a>
                        </div>
                        
                        <button type="submit" class="form-submit">Sign In</button>
                        
                        <div class="social-login">
                            <div class="social-login-title">Or sign in with</div>
                            
                            <div class="social-login-buttons">
                                <a href="#" class="social-login-button">
                                    <i class="fab fa-google"></i>
                                </a>
                                <a href="#" class="social-login-button">
                                    <i class="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" class="social-login-button">
                                    <i class="fab fa-apple"></i>
                                </a>
                            </div>
                        </div>
                    </form>
                    
                    <form class="auth-form register-form" id="register-form">
                        <div class="form-group">
                            <label for="register-first-name">First Name</label>
                            <input type="text" id="register-first-name" placeholder="Enter your first name" required>
                            <div class="error-message">Please enter your first name</div>
                        </div>
                        
                        <div class="form-group">
                            <label for="register-last-name">Last Name</label>
                            <input type="text" id="register-last-name" placeholder="Enter your last name" required>
                            <div class="error-message">Please enter your last name</div>
                        </div>
                        
                        <div class="form-group">
                            <label for="register-email">Email</label>
                            <input type="email" id="register-email" placeholder="Enter your email" required>
                            <div class="error-message">Please enter a valid email</div>
                        </div>
                        
                        <div class="form-group">
                            <label for="register-password">Password</label>
                            <input type="password" id="register-password" placeholder="Enter your password" required>
                            <div class="error-message">Password must be at least 8 characters</div>
                        </div>
                        
                        <div class="form-group">
                            <label for="register-confirm-password">Confirm Password</label>
                            <input type="password" id="register-confirm-password" placeholder="Confirm your password" required>
                            <div class="error-message">Passwords don't match</div>
                        </div>
                        
                        <button type="submit" class="form-submit">Register</button>
                    </form>
                </div>
            </div>
        `;
        
        // Add modal to DOM
        document.body.appendChild(modal);
        
        // Add event listeners
        // Close modal
        const closeButton = modal.querySelector('.close-modal');
        closeButton.addEventListener('click', function() {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
        
        // Tab switching
        const tabs = modal.querySelectorAll('.auth-modal-tab');
        const forms = modal.querySelectorAll('.auth-form');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Hide all forms
                forms.forEach(form => form.classList.remove('active'));
                
                // Show target form
                const targetForm = this.getAttribute('data-tab');
                modal.querySelector(`.${targetForm}-form`).classList.add('active');
            });
        });
        
        // Form submission
        const loginForm = modal.querySelector('#login-form');
        const registerForm = modal.querySelector('#register-form');
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const email = this.querySelector('#login-email').value;
            const password = this.querySelector('#login-password').value;
            
            // Validate form
            let isValid = true;
            
            // Email validation
            if (!validateEmail(email)) {
                this.querySelector('#login-email').parentElement.classList.add('error');
                isValid = false;
            } else {
                this.querySelector('#login-email').parentElement.classList.remove('error');
            }
            
            // Password validation
            if (!password) {
                this.querySelector('#login-password').parentElement.classList.add('error');
                isValid = false;
            } else {
                this.querySelector('#login-password').parentElement.classList.remove('error');
            }
            
            // If form is valid, try to login
            if (isValid) {
                // For demo purposes, we'll accept any credentials
                // In a real application, we would validate against a database
                
                // Create a demo user
                const user = {
                    firstName: 'Demo',
                    lastName: 'User',
                    email: email,
                };
                
                // Set as logged in
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Close modal
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.remove();
                    
                    // Reload the page to update header
                    location.reload();
                }, 300);
            }
        });
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const firstName = this.querySelector('#register-first-name').value;
            const lastName = this.querySelector('#register-last-name').value;
            const email = this.querySelector('#register-email').value;
            const password = this.querySelector('#register-password').value;
            const confirmPassword = this.querySelector('#register-confirm-password').value;
            
            // Validate form
            let isValid = true;
            
            // First name validation
            if (!firstName) {
                this.querySelector('#register-first-name').parentElement.classList.add('error');
                isValid = false;
            } else {
                this.querySelector('#register-first-name').parentElement.classList.remove('error');
            }
            
            // Last name validation
            if (!lastName) {
                this.querySelector('#register-last-name').parentElement.classList.add('error');
                isValid = false;
            } else {
                this.querySelector('#register-last-name').parentElement.classList.remove('error');
            }
            
            // Email validation
            if (!validateEmail(email)) {
                this.querySelector('#register-email').parentElement.classList.add('error');
                isValid = false;
            } else {
                this.querySelector('#register-email').parentElement.classList.remove('error');
            }
            
            // Password validation
            if (password.length < 8) {
                this.querySelector('#register-password').parentElement.classList.add('error');
                isValid = false;
            } else {
                this.querySelector('#register-password').parentElement.classList.remove('error');
            }
            
            // Confirm password validation
            if (password !== confirmPassword) {
                this.querySelector('#register-confirm-password').parentElement.classList.add('error');
                isValid = false;
            } else {
                this.querySelector('#register-confirm-password').parentElement.classList.remove('error');
            }
            
            // If form is valid, create user
            if (isValid) {
                // Create user
                const user = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                };
                
                // Set as logged in
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Close modal
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.remove();
                    
                    // Reload the page to update header
                    location.reload();
                }, 300);
            }
        });
    }
    
    /**
     * Logout user
     */
    function logout() {
        // Clear user data
            localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
            
        // Show notification
            showNotification('You have been logged out', 'info');
            
        // Reload the page to update header
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
    
    /**
     * Validate email
     */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}); 