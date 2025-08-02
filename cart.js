document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart page
    initializeCartPage();
    
    /**
     * Initialize cart page
     */
    function initializeCartPage() {
        // Render cart items
        renderCartItems();
        
        // Initialize cart summary
        updateCartSummary();
        
        // Initialize checkout button
        initializeCheckoutButton();
        
        // Initialize coupon code
        initializeCouponCode();
        
        // Initialize remove all button
        initializeRemoveAllButton();
    }
    
    /**
     * Initialize remove all button
     */
    function initializeRemoveAllButton() {
        const removeAllButton = document.querySelector('.cart-footer-actions .btn-outline');
        
        if (removeAllButton) {
            removeAllButton.addEventListener('click', function() {
                // Clear cart
                clearCart();
                
                // Update UI
                renderCartItems();
                updateCartSummary();
                
                // Show notification
                showNotification('All items have been removed from your cart', 'info');
            });
        }
    }
    
    /**
     * Clear cart
     */
    function clearCart() {
        localStorage.setItem('cartItems', JSON.stringify([]));
    }
    
    /**
     * Render cart items
     */
    function renderCartItems() {
        // Get cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartItemsList = document.querySelector('.cart-items-list');
        
        if (!cartItemsList) return;
        
        // Update cart count in title
        const cartTitle = document.querySelector('.cart-title');
        if (cartTitle) {
            const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
            cartTitle.textContent = `My cart (${totalItems})`;
        }
        
        // Clear cart items list
        cartItemsList.innerHTML = '';
        
        if (cartItems.length === 0) {
            // Show empty cart message
            cartItemsList.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <a href="index.html" class="btn-primary">Continue Shopping</a>
                </div>
            `;
            
            // Add styles for empty cart
            const style = document.createElement('style');
            style.textContent = `
                .empty-cart {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    text-align: center;
                }
                
                .empty-cart i {
                    font-size: 48px;
                    color: #8B96A5;
                    margin-bottom: 16px;
                }
                
                .empty-cart h3 {
                    font-size: 20px;
                    color: #1C1C1C;
                    margin-bottom: 8px;
                }
                
                .empty-cart p {
                    color: #505050;
                    margin-bottom: 24px;
                }
                
                .empty-cart .btn-primary {
                    padding: 10px 24px;
                    background-color: #0D6EFD;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 500;
                    text-decoration: none;
                    display: inline-block;
                }
            `;
            document.head.appendChild(style);
            
            return;
        }
        
        // Create cart item elements
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('article');
            cartItem.className = 'cart-item';
            cartItem.setAttribute('data-item-id', item.id);
            
            // Calculate item total
            const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            const itemTotal = price * item.quantity;
            
            cartItem.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-info">
                        <h2 class="item-title">${item.name}</h2>
                    <p class="item-specs">Size: medium, Color: blue</p>
                    <p class="item-seller">Seller: ShopEase</p>
                        <div class="item-actions">
                        <button class="btn-text-danger remove-item-btn"><i class="fas fa-trash-alt"></i> Remove</button>
                        <button class="btn-text-primary save-for-later-btn"><i class="far fa-heart"></i> Save for later</button>
                    </div>
                </div>
                <div class="item-price">
                    <span class="price-value">${formatPrice(price)}</span>
                </div>
                <div class="item-quantity">
                    <div class="quantity-control">
                            <button class="quantity-btn decrease-btn"><i class="fas fa-minus"></i></button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-item-index="${index}">
                            <button class="quantity-btn increase-btn"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                <div class="item-total">
                    <span>${formatPrice(itemTotal)}</span>
                </div>
            `;
            
            cartItemsList.appendChild(cartItem);
        });
        
        // Add event listeners for cart item actions
        initializeCartItemActions();
    }
    
    /**
     * Initialize cart item actions
     */
    function initializeCartItemActions() {
        // Remove item buttons
        const removeButtons = document.querySelectorAll('.remove-item-btn');
        
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const cartItem = this.closest('.cart-item');
                const itemId = cartItem.getAttribute('data-item-id');
                
                // Remove item from cart with animation
                cartItem.style.height = cartItem.offsetHeight + 'px';
                
                // Animate removal
                setTimeout(() => {
                    cartItem.style.opacity = '0';
                    cartItem.style.height = '0';
                    cartItem.style.margin = '0';
                    cartItem.style.padding = '0';
                    cartItem.style.overflow = 'hidden';
                }, 10);
                
                // Remove item from DOM after animation
                setTimeout(() => {
                    removeCartItem(itemId);
                    renderCartItems();
                    updateCartSummary();
                }, 300);
            });
        });
        
        // Save for later buttons
        const saveForLaterButtons = document.querySelectorAll('.save-for-later-btn');
        
        saveForLaterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const cartItem = this.closest('.cart-item');
                const itemId = cartItem.getAttribute('data-item-id');
                
                // Get cart items
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                
                // Find item
                const item = cartItems.find(item => item.id === itemId);
                
                if (item) {
                    // Add to wishlist
                    addToWishlist({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image
                    });
                    
                    // Remove from cart
                    removeCartItem(itemId);
                    
                    // Update UI
                    renderCartItems();
                    updateCartSummary();
                    
                    // Show notification
                    showNotification(`${item.name} moved to wishlist`, 'success');
                }
            });
        });
        
        // Quantity inputs
        const quantityInputs = document.querySelectorAll('.quantity-input');
        
        quantityInputs.forEach(input => {
            input.addEventListener('change', function() {
                const itemIndex = parseInt(this.getAttribute('data-item-index'));
                let quantity = parseInt(this.value);
                
                // Ensure quantity is at least 1
                if (isNaN(quantity) || quantity < 1) {
                    quantity = 1;
                    this.value = quantity;
                }
                
                // Update cart item quantity
                updateCartItemQuantity(itemIndex, quantity);
                
                // Update cart summary
                updateCartSummary();
                
                // Update item total
                const cartItem = this.closest('.cart-item');
                const priceElement = cartItem.querySelector('.price-value');
                const totalElement = cartItem.querySelector('.item-total span');
                
                if (priceElement && totalElement) {
                    const price = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, ''));
                    const total = price * quantity;
                    
                    totalElement.textContent = formatPrice(total);
                }
            });
        });
        
        // Quantity decrease buttons
        const decreaseButtons = document.querySelectorAll('.decrease-btn');
        
        decreaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.nextElementSibling;
                let quantity = parseInt(input.value);
                
                if (quantity > 1) {
                    quantity--;
                    input.value = quantity;
                    
                    // Trigger change event
                    const event = new Event('change');
                    input.dispatchEvent(event);
                }
            });
        });
        
        // Quantity increase buttons
        const increaseButtons = document.querySelectorAll('.increase-btn');
        
        increaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.previousElementSibling;
                let quantity = parseInt(input.value);
                
                quantity++;
                input.value = quantity;
                
                // Trigger change event
                const event = new Event('change');
                input.dispatchEvent(event);
            });
        });
    }
    
    /**
     * Update cart summary
     */
    function updateCartSummary() {
        // Get cart items
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Calculate subtotal
        const subtotal = cartItems.reduce((total, item) => {
            const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            return total + (price * item.quantity);
        }, 0);
        
        // Calculate discount (for demo purposes, 10% if subtotal is over $200)
        let discount = 0;
        const couponApplied = localStorage.getItem('couponApplied') === 'true';
        
        if (couponApplied) {
            discount = subtotal * 0.1; // 10% discount
        }
        
        // Calculate tax (for demo purposes, 8%)
        const tax = subtotal * 0.08;
        
        // Calculate total
        const total = subtotal - discount + tax;
        
        // Update summary elements
        const subtotalElement = document.querySelector('.summary-subtotal');
        const discountElement = document.querySelector('.summary-discount');
        const taxElement = document.querySelector('.summary-tax');
        const totalElement = document.querySelector('.summary-total');
        
        if (subtotalElement) {
            subtotalElement.textContent = formatPrice(subtotal);
        }
        
        if (discountElement) {
            discountElement.textContent = `-${formatPrice(discount)}`;
            
            // Show/hide discount row
            const discountRow = discountElement.closest('li');
            if (discountRow) {
                discountRow.style.display = discount > 0 ? '' : 'none';
            }
        }
        
        if (taxElement) {
            taxElement.textContent = formatPrice(tax);
        }
        
        if (totalElement) {
            totalElement.textContent = formatPrice(total);
        }
        
        // Update cart count
        updateCartCount();
    }
    
    /**
     * Initialize checkout button
     */
    function initializeCheckoutButton() {
        const checkoutButton = document.querySelector('.checkout-btn');
        
        if (checkoutButton) {
            checkoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // For demo purposes, just show a message
                showNotification('Checkout functionality would be implemented in a real application', 'info');
            });
        }
    }
    
    /**
     * Initialize coupon code
     */
    function initializeCouponCode() {
        const couponForm = document.querySelector('.coupon-form');
        
        if (couponForm) {
            couponForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const couponInput = this.querySelector('input');
                const couponCode = couponInput.value.trim().toUpperCase();
                
                // For demo purposes, "DISCOUNT10" is a valid coupon code
                if (couponCode === 'DISCOUNT10') {
                    // Set coupon as applied
                    localStorage.setItem('couponApplied', 'true');
                    
                    // Update cart summary
                    updateCartSummary();
                    
                    // Show success message
                    showNotification('Coupon code applied successfully!', 'success');
                    
                    // Disable input and button
                    couponInput.disabled = true;
                    this.querySelector('button').disabled = true;
                } else {
                    // Show error message
                    showNotification('Invalid coupon code', 'error');
                }
            });
            
            // Check if coupon is already applied
            if (localStorage.getItem('couponApplied') === 'true') {
                const couponInput = couponForm.querySelector('input');
                if (couponInput) {
                    couponInput.value = 'DISCOUNT10';
                    couponInput.disabled = true;
                    couponForm.querySelector('button').disabled = true;
                }
            }
        }
    }
    
    /**
     * Remove item from cart
     */
    function removeCartItem(itemId) {
        // Get cart items
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Find item index
        const itemIndex = cartItems.findIndex(item => item.id === itemId);
        
        if (itemIndex > -1) {
            // Get item name for notification
            const itemName = cartItems[itemIndex].name;
            
            // Remove item
            cartItems.splice(itemIndex, 1);
            
            // Save updated cart
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // Show notification
            showNotification(`${itemName} removed from cart`, 'info');
        }
    }
    
    /**
     * Update cart item quantity
     */
    function updateCartItemQuantity(itemIndex, quantity) {
        // Get cart items
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Ensure item exists
        if (itemIndex >= 0 && itemIndex < cartItems.length) {
            // Update quantity
            cartItems[itemIndex].quantity = quantity;
            
            // Save updated cart
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }
    
    /**
     * Add to wishlist
     */
    function addToWishlist(item) {
        // Get wishlist items
        const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        
        // Check if item already exists
        const existingItemIndex = wishlistItems.findIndex(wishlistItem => 
            wishlistItem.id === item.id
        );
        
        if (existingItemIndex === -1) {
            // Add new item
            wishlistItems.push(item);
            
            // Save updated wishlist
            localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        }
    }
    
    /**
     * Format price
     */
    function formatPrice(price) {
        return '$' + price.toFixed(2);
    }
}); 