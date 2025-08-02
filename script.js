document.addEventListener('DOMContentLoaded', function() {
    console.log('ShopEase E-commerce initialized');
    
    // Initialize header components
    initializeHeader();
    
    // Initialize common functionality
    initializeTooltips();
    initializeDropdowns();
    
    // Initialize cart count
    updateCartCount();
    
    /**
     * Initialize header components
     */
    function initializeHeader() {
        // Mobile menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', function() {
                document.body.classList.toggle('mobile-menu-open');
            });
        }
        
        // Search functionality placeholder (detailed in search.js)
        const searchForm = document.querySelector('.search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // Search functionality is handled in search.js
            });
        }
        
        // Cart icon click
        const cartIcon = document.querySelector('.action-item i.fa-shopping-cart, .action i.fa-shopping-cart');
        if (cartIcon) {
            const cartElement = cartIcon.closest('.action-item, .action');
            cartElement.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'cart.html';
            });
        }
    }
    
    /**
     * Initialize tooltips
     */
    function initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const tooltipText = this.getAttribute('data-tooltip');
                
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = tooltipText;
                
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.top = rect.bottom + 10 + 'px';
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                
                setTimeout(() => {
                    tooltip.classList.add('show');
                }, 10);
                    
                this.addEventListener('mouseleave', function onMouseLeave() {
                    tooltip.classList.remove('show');
                    
                    setTimeout(() => {
                        document.body.removeChild(tooltip);
                    }, 200);
                    
                    this.removeEventListener('mouseleave', onMouseLeave);
                });
            });
        });
    }
    
    /**
     * Initialize dropdowns
     */
    function initializeDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger');
            const content = dropdown.querySelector('.dropdown-content');
            
            if (trigger && content) {
                trigger.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close all other dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                    
                    // Toggle this dropdown
                    dropdown.classList.toggle('active');
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', function(e) {
                    if (!dropdown.contains(e.target)) {
                        dropdown.classList.remove('active');
                    }
                });
                }
            });
        }
});

/**
 * Global utility function to update cart count
 */
function updateCartCount() {
    // Get cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Calculate total items
    const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    
    // Find cart icon
    const cartIcon = document.querySelector('.action-item i.fa-shopping-cart, .action i.fa-shopping-cart');
    
    if (cartIcon) {
        // Check if cart count badge exists
        let cartBadge = document.querySelector('.cart-count-badge');
        
        if (!cartBadge) {
            // Create badge
            cartBadge = document.createElement('span');
            cartBadge.className = 'cart-count-badge';
            
            // Add styles for badge if needed
            if (!document.querySelector('style[data-badge-styles]')) {
                const badgeStyle = document.createElement('style');
                badgeStyle.setAttribute('data-badge-styles', '');
                badgeStyle.textContent = `
                    .cart-count-badge {
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        background-color: #FF5252;
                        color: white;
                        font-size: 10px;
                        font-weight: 600;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                `;
                
                document.head.appendChild(badgeStyle);
            }
            
            // Add to cart icon
            const cartElement = cartIcon.closest('.action-item, .action');
            cartElement.style.position = 'relative';
            cartElement.appendChild(cartBadge);
        }
        
        // Update badge
        cartBadge.textContent = totalItems;
        
        // Show/hide badge
        if (totalItems > 0) {
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

/**
 * Global utility function to add to cart
 */
function addToCart(product, quantity = 1, redirect = false) {
    // Get cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
        // Update quantity
        cartItems[existingProductIndex].quantity += quantity;
                } else {
        // Add new product
        cartItems.push({
            ...product,
            quantity: quantity
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart!`, 'success');
    
    // Redirect to cart page if requested
    if (redirect) {
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1000);
    }
}

/**
 * Global utility function for showing notifications
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : (type === 'error' ? 'exclamation-circle' : 'info-circle')}"></i>
                    </div>
        <div class="notification-content">
            <p>${message}</p>
                </div>
            `;
            
    // Add notification styles if not already added
    if (!document.querySelector('style[data-notification-styles]')) {
        const notificationStyle = document.createElement('style');
        notificationStyle.setAttribute('data-notification-styles', '');
        notificationStyle.textContent = `
            .notification {
                    position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                align-items: center;
                padding: 15px;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                min-width: 300px;
                    max-width: 400px;
                animation: notification-slide-in 0.3s forwards;
            }
            
            @keyframes notification-slide-in {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes notification-slide-out {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification.success {
                background-color: #e6f4ea;
                border-left: 4px solid #34a853;
            }
            
            .notification.error {
                background-color: #fce8e6;
                border-left: 4px solid #ea4335;
            }
            
            .notification.info {
                background-color: #e8f0fe;
                border-left: 4px solid #4285f4;
            }
            
            .notification-icon {
                margin-right: 15px;
                font-size: 20px;
            }
            
            .notification.success .notification-icon {
                color: #34a853;
            }
            
            .notification.error .notification-icon {
                color: #ea4335;
            }
            
            .notification.info .notification-icon {
                color: #4285f4;
            }
            
            .notification-content p {
                margin: 0;
                color: #1C1C1C;
            }
        `;
        
        document.head.appendChild(notificationStyle);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'notification-slide-out 0.3s forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Get URL parameters
 */
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Format price
 */
function formatPrice(price) {
    return '$' + parseFloat(price).toFixed(2);
} 