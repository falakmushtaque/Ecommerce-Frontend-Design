document.addEventListener('DOMContentLoaded', function() {
    // Initialize product hover effects
    initializeProductHoverEffects();
    
    // Initialize newsletter subscription
    initializeNewsletterForm();
    
    // Initialize countdown timer
    initializeCountdownTimer();
    
    // Initialize category hover effects
    initializeCategoryHover();
    
    // Initialize lazy loading for images
    initializeLazyLoading();
    
    /**
     * Initialize product hover effects
     */
    function initializeProductHoverEffects() {
        const productCards = document.querySelectorAll('.product-card, .deal-product, .product-item');
        
        productCards.forEach(card => {
            // Create quick action buttons container
            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'product-quick-actions';
            
            // Add quick action buttons
            actionsContainer.innerHTML = `
                <button class="quick-action-btn quick-view-btn" title="Quick View">
                    <i class="far fa-eye"></i>
                </button>
                <button class="quick-action-btn add-to-cart-btn" title="Add to Cart">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                <button class="quick-action-btn add-to-wishlist-btn" title="Add to Wishlist">
                    <i class="far fa-heart"></i>
                </button>
            `;
            
            // Add to card
            card.appendChild(actionsContainer);
            
            // Add hover effect
            card.addEventListener('mouseenter', function() {
                actionsContainer.classList.add('show');
            });
            
            card.addEventListener('mouseleave', function() {
                actionsContainer.classList.remove('show');
            });
        });
        
        // Add styles for quick actions
        const quickActionsStyle = document.createElement('style');
        quickActionsStyle.textContent = `
            .product-card, .deal-product, .product-item {
                position: relative;
                overflow: hidden;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .product-card:hover, .deal-product:hover, .product-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                z-index: 1;
            }
            
            .product-quick-actions {
                position: absolute;
                top: 10px;
                right: 10px;
                display: flex;
                flex-direction: column;
                gap: 5px;
                opacity: 0;
                transform: translateX(20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
                z-index: 2;
            }
            
            .product-quick-actions.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .quick-action-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: white;
                border: none;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #8B96A5;
                transition: background-color 0.2s ease, color 0.2s ease;
            }
            
            .quick-action-btn:hover {
                background-color: #0D6EFD;
                color: white;
            }
            
            .add-to-wishlist-btn.active {
                background-color: #FF5252;
                color: white;
            }
        `;
        
        document.head.appendChild(quickActionsStyle);
        
        // Add event listeners to quick action buttons
        document.addEventListener('click', function(e) {
            // Quick view button
            if (e.target.closest('.quick-view-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const card = e.target.closest('.product-card, .deal-product, .product-item');
                const productName = card.querySelector('.product-name')?.textContent || 
                                    card.querySelector('.product-title')?.textContent || 
                                    card.querySelector('.deal-name')?.textContent || 
                                    'Product';
                
                showQuickViewModal(card, productName);
            }
            
            // Add to cart button
            if (e.target.closest('.add-to-cart-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const card = e.target.closest('.product-card, .deal-product, .product-item');
                const productName = card.querySelector('.product-name')?.textContent || 
                                    card.querySelector('.product-title')?.textContent || 
                                    card.querySelector('.deal-name')?.textContent || 
                                    'Product';
                const productPrice = card.querySelector('.product-price')?.textContent || 
                                     card.querySelector('.current-price')?.textContent || 
                                     card.querySelector('.price-amount')?.textContent || 
                                     '$99.99';
                const productImage = card.querySelector('img')?.src || '';
                
                // Add to cart
                addToCart({
                    name: productName,
                    price: productPrice,
                    quantity: 1,
                    image: productImage
                });
                
                // Show success message
                showNotification(`${productName} added to cart!`, 'success');
            }
            
            // Add to wishlist button
            if (e.target.closest('.add-to-wishlist-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const wishlistBtn = e.target.closest('.add-to-wishlist-btn');
                const card = wishlistBtn.closest('.product-card, .deal-product, .product-item');
                const productName = card.querySelector('.product-name')?.textContent || 
                                    card.querySelector('.product-title')?.textContent || 
                                    card.querySelector('.deal-name')?.textContent || 
                                    'Product';
                
                // Toggle wishlist state
                wishlistBtn.classList.toggle('active');
                
                if (wishlistBtn.classList.contains('active')) {
                    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
                    
                    // Add to wishlist
                    addToWishlist({
                        name: productName,
                        price: card.querySelector('.product-price')?.textContent || 
                               card.querySelector('.current-price')?.textContent || 
                               card.querySelector('.price-amount')?.textContent || 
                               '$99.99',
                        image: card.querySelector('img')?.src || ''
                    });
                    
                    // Show success message
                    showNotification(`${productName} added to wishlist!`, 'success');
                } else {
                    wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
                    
                    // Remove from wishlist
                    removeFromWishlist(productName);
                    
                    // Show message
                    showNotification(`${productName} removed from wishlist!`, 'info');
                }
            }
        });
    }
    
    /**
     * Initialize newsletter form
     */
    function initializeNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (!newsletterForm) return;
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const subscribeBtn = newsletterForm.querySelector('.subscribe-btn');
        
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            if (!email) {
                showNotification('Please enter your email address', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Show success message
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            
            // Clear input
            emailInput.value = '';
        });
    }
    
    /**
     * Initialize countdown timer
     */
    function initializeCountdownTimer() {
        const timerBoxes = document.querySelectorAll('.timer-box');
        if (timerBoxes.length === 0) return;
        
        // Set end time to 24 hours from now
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + 24);
        
        // Update timer
        function updateTimer() {
            const now = new Date();
            const diff = endTime - now;
            
            if (diff <= 0) {
                // Timer ended
                timerBoxes.forEach(box => {
                    const span = box.querySelector('span');
                    if (span) span.textContent = '00';
                });
                return;
            }
            
            // Calculate time units
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            // Update timer display
            const timeUnits = [days, hours, minutes, seconds];
            timerBoxes.forEach((box, index) => {
                if (index < timeUnits.length) {
                    const span = box.querySelector('span');
                    if (span) {
                        const value = timeUnits[index].toString().padStart(2, '0');
                        
                        // Add animation if value changed
                        if (span.textContent !== value) {
                            span.classList.add('timer-update');
                            setTimeout(() => {
                                span.classList.remove('timer-update');
                            }, 500);
                        }
                        
                        span.textContent = value;
                    }
                }
            });
        }
        
        // Add styles for timer animation
        const timerStyle = document.createElement('style');
        timerStyle.textContent = `
            .timer-update {
                animation: timer-pulse 0.5s ease;
            }
            
            @keyframes timer-pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                    color: #0D6EFD;
                }
                100% {
                    transform: scale(1);
                }
            }
        `;
        
        document.head.appendChild(timerStyle);
        
        // Update timer immediately
        updateTimer();
        
        // Update timer every second
        setInterval(updateTimer, 1000);
    }
    
    /**
     * Initialize category hover effects
     */
    function initializeCategoryHover() {
        const categoryItems = document.querySelectorAll('.sidebar li');
        
        categoryItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                // Add hover class
                this.classList.add('hover');
            });
            
            item.addEventListener('mouseleave', function() {
                // Remove hover class
                this.classList.remove('hover');
            });
            
            // Add click event
            item.addEventListener('click', function() {
                // Remove active class from all items
                categoryItems.forEach(cat => cat.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Get category name
                const categoryName = this.textContent.trim();
                
                // Show message
                showNotification(`Browsing category: ${categoryName}`, 'info');
            });
        });
        
        // Add styles for hover effect
        const categoryStyle = document.createElement('style');
        categoryStyle.textContent = `
            .sidebar li.hover {
                background-color: #f0f7ff;
                color: #0D6EFD;
                cursor: pointer;
            }
        `;
        
        document.head.appendChild(categoryStyle);
    }
    
    /**
     * Initialize lazy loading for images
     */
    function initializeLazyLoading() {
        // Check if IntersectionObserver is available
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        }
                        
                        observer.unobserve(img);
                    }
                });
            });
            
            // Get all images
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            });
        }
    }
    
    /**
     * Show quick view modal
     */
    function showQuickViewModal(product, productName) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        
        // Get product details
        const productImage = product.querySelector('img')?.src || '';
        const productPrice = product.querySelector('.product-price')?.textContent || 
                             product.querySelector('.current-price')?.textContent || 
                             product.querySelector('.price-amount')?.textContent || 
                             '$99.99';
        
        // Create modal content
        modal.innerHTML = `
            <div class="quick-view-content">
                <button class="close-modal">&times;</button>
                <div class="quick-view-grid">
                    <div class="quick-view-image">
                        <img src="${productImage}" alt="${productName}">
                    </div>
                    <div class="quick-view-details">
                        <h2 class="quick-view-title">${productName}</h2>
                        <div class="quick-view-price">${productPrice}</div>
                        <div class="quick-view-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half-alt"></i>
                            <span>(4.5)</span>
                        </div>
                        <p class="quick-view-description">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <div class="quick-view-actions">
                            <div class="quantity-selector">
                                <button class="quantity-btn decrease-btn"><i class="fas fa-minus"></i></button>
                                <input type="number" value="1" min="1" class="quantity-input">
                                <button class="quantity-btn increase-btn"><i class="fas fa-plus"></i></button>
                            </div>
                            <button class="btn btn-primary add-to-cart-btn">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                            <button class="btn btn-outline view-details-btn">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles for modal
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            .quick-view-modal {
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
            
            .quick-view-content {
                background-color: white;
                width: 90%;
                max-width: 900px;
                border-radius: 6px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                position: relative;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .close-modal {
                position: absolute;
                top: 15px;
                right: 15px;
                font-size: 24px;
                color: #8B96A5;
                background: none;
                border: none;
                cursor: pointer;
                z-index: 10;
            }
            
            .quick-view-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                padding: 20px;
            }
            
            .quick-view-image {
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                border-radius: 6px;
                background-color: #F7F7F7;
            }
            
            .quick-view-image img {
                max-width: 100%;
                max-height: 400px;
                object-fit: contain;
            }
            
            .quick-view-title {
                font-size: 24px;
                color: #1C1C1C;
                margin-bottom: 10px;
            }
            
            .quick-view-price {
                font-size: 20px;
                font-weight: 600;
                color: #1C1C1C;
                margin-bottom: 10px;
            }
            
            .quick-view-rating {
                color: #FFB800;
                margin-bottom: 15px;
            }
            
            .quick-view-rating span {
                color: #8B96A5;
                margin-left: 5px;
            }
            
            .quick-view-description {
                color: #505050;
                line-height: 1.5;
                margin-bottom: 20px;
            }
            
            .quick-view-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                align-items: center;
            }
            
            .quantity-selector {
                display: flex;
                align-items: center;
                border: 1px solid #E0E0E0;
                border-radius: 4px;
                overflow: hidden;
            }
            
            .quantity-btn {
                background: none;
                border: none;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #8B96A5;
            }
            
            .quantity-input {
                width: 40px;
                height: 32px;
                border: none;
                text-align: center;
                font-size: 14px;
                color: #1C1C1C;
                -moz-appearance: textfield;
            }
            
            .quantity-input::-webkit-outer-spin-button,
            .quantity-input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            
            .btn {
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
            }
            
            .btn-primary {
                background-color: #0D6EFD;
                color: white;
                border: none;
            }
            
            .btn-outline {
                background-color: transparent;
                color: #0D6EFD;
                border: 1px solid #0D6EFD;
            }
            
            @media (max-width: 768px) {
                .quick-view-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        document.head.appendChild(modalStyle);
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
        
        // Quantity buttons
        const decreaseBtn = modal.querySelector('.decrease-btn');
        const increaseBtn = modal.querySelector('.increase-btn');
        const quantityInput = modal.querySelector('.quantity-input');
        
        decreaseBtn.addEventListener('click', function() {
            let quantity = parseInt(quantityInput.value);
            if (quantity > 1) {
                quantity--;
                quantityInput.value = quantity;
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            let quantity = parseInt(quantityInput.value);
            quantity++;
            quantityInput.value = quantity;
        });
        
        // Add to cart button
        const addToCartBtn = modal.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(quantityInput.value);
            
            // Add to cart
            addToCart({
                name: productName,
                price: productPrice,
                quantity: quantity,
                image: productImage
            });
            
            // Show success message
            showNotification(`${productName} added to cart!`, 'success');
            
            // Close modal
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        // View details button
        const viewDetailsBtn = modal.querySelector('.view-details-btn');
        viewDetailsBtn.addEventListener('click', function() {
            // Close modal
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 300);
            
            // Show message
            showNotification(`Viewing details for ${productName}`, 'info');
            
            // In a real application, you would redirect to product page
            // window.location.href = `product.html?product=${encodeURIComponent(productName)}`;
        });
    }
    
    /**
     * Add to cart
     */
    function addToCart(item) {
        // Get cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Check if item already exists
        const existingItemIndex = cartItems.findIndex(cartItem => 
            cartItem.name === item.name
        );
        
        if (existingItemIndex > -1) {
            // Update quantity
            cartItems[existingItemIndex].quantity += item.quantity;
        } else {
            // Add new item
            cartItems.push(item);
        }
        
        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Update cart count
        updateCartCount();
    }
    
    /**
     * Update cart count
     */
    function updateCartCount() {
        // Get cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Calculate total items
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        
        // Find cart icon
        const cartIcon = document.querySelector('.action i.fa-shopping-cart') || 
                         document.querySelector('.action-item i.fa-shopping-cart');
        
        if (cartIcon) {
            // Check if cart count badge exists
            let cartBadge = document.querySelector('.cart-count-badge');
            
            if (!cartBadge) {
                // Create badge
                cartBadge = document.createElement('span');
                cartBadge.className = 'cart-count-badge';
                
                // Add styles for badge
                const badgeStyle = document.createElement('style');
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
                
                // Add to cart icon
                const cartElement = cartIcon.closest('.action') || cartIcon.closest('.action-item');
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
     * Add to wishlist
     */
    function addToWishlist(item) {
        // Get wishlist items from localStorage
        const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        
        // Check if item already exists
        const existingItemIndex = wishlistItems.findIndex(wishlistItem => 
            wishlistItem.name === item.name
        );
        
        if (existingItemIndex === -1) {
            // Add new item
            wishlistItems.push(item);
            
            // Save to localStorage
            localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        }
    }
    
    /**
     * Remove from wishlist
     */
    function removeFromWishlist(productName) {
        // Get wishlist items from localStorage
        const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        
        // Remove item
        const updatedWishlist = wishlistItems.filter(item => item.name !== productName);
        
        // Save to localStorage
        localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
    }
    
    /**
     * Show notification
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
        if (!document.querySelector('style[data-id="notification-styles"]')) {
            const notificationStyle = document.createElement('style');
            notificationStyle.setAttribute('data-id', 'notification-styles');
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
     * Helper: Check if email is valid
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Initialize cart count
    updateCartCount();
}); 