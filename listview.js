document.addEventListener('DOMContentLoaded', function() {
    // Check for search parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        // Update page title with search query
        document.title = `Search results for "${searchQuery}" - ShopEase`;
        
        // Find and update item count text if it exists
        const itemCountElement = document.querySelector('.item-count');
        if (itemCountElement) {
            itemCountElement.innerHTML = `Search results for <strong>"${searchQuery}"</strong>`;
        }
        
        // Show search query notification
        showNotification(`Showing results for "${searchQuery}"`, 'info');
    }
    
    // Initialize list view functionality
    initListView();
    
    // Initialize price range slider
    initPriceRangeSlider();
    
    // Initialize filter toggles
    initFilterToggles();
    
    // Initialize view toggle
    initViewToggle();
    
    // Initialize pagination
    initPagination();
    
    /**
     * Initialize list view specific functionality
     */
    function initListView() {
        // Add functionality to product cards
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            // Add hover effect
            card.addEventListener('mouseenter', function() {
                this.classList.add('hover');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('hover');
            });
            
            // Add click event for the whole card to navigate to product page
            card.addEventListener('click', function(e) {
                // Don't navigate if clicked on a button, link, or favorite
                if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.favorite-btn')) return;
                
                // Get product details
                const productName = card.querySelector('.product-card__title').textContent;
                // Generate a product ID from name (for demo purposes)
                const productId = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                
                // Navigate to product page with product ID
                window.location.href = `product.html?id=${encodeURIComponent(productId)}`;
            });
            
            // Add click event for "View details" link
            const productLink = card.querySelector('.product-card__link');
            if (productLink) {
                productLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Get product details
                    const productName = card.querySelector('.product-card__title').textContent;
                    const productId = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    
                    // Navigate to product page with product ID
                    window.location.href = `product.html?id=${encodeURIComponent(productId)}`;
                });
            }
            
            // Add hover effect to favorite button
            const favoriteBtn = card.querySelector('.favorite-btn');
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle favorite state
                    this.classList.toggle('active');
                    
                    // Get product details
                    const productName = card.querySelector('.product-card__title').textContent;
                    const productPrice = card.querySelector('.current-price').textContent;
                    const productImage = card.querySelector('.product-card__image').src;
                    const productId = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    
                    if (this.classList.contains('active')) {
                        this.innerHTML = '<i class="fas fa-heart"></i>';
                        
                        // Add to wishlist
                        addToWishlist({
                            id: productId,
                            name: productName,
                            price: productPrice,
                            image: productImage
                        });
                    } else {
                        this.innerHTML = '<i class="far fa-heart"></i>';
                        
                        // Remove from wishlist
                        removeFromWishlist(productId);
                    }
                });
            }
        });
        
        // Add styles for hover effects
        const style = document.createElement('style');
        style.textContent = `
            .product-card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                cursor: pointer;
                position: relative;
            }
            
            .product-card.hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                z-index: 1;
            }
            
            .favorite-btn {
                transition: background-color 0.2s ease, color 0.2s ease;
            }
            
            .favorite-btn:hover, .favorite-btn.active {
                background-color: #fce8e6;
                color: #ea4335;
            }
            
            .product-card__link {
                color: #0D6EFD;
                text-decoration: none;
                font-weight: 500;
                display: inline-block;
                margin-top: 10px;
            }
            
            .product-card__link:hover {
                text-decoration: underline;
            }
            
            /* Add quick action buttons */
            .product-quick-actions {
                position: absolute;
                bottom: 20px;
                right: 20px;
                display: flex;
                gap: 10px;
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.3s ease, transform 0.3s ease;
                z-index: 5;
            }
            
            .product-card:hover .product-quick-actions {
                opacity: 1;
                transform: translateY(0);
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
        `;
        
        document.head.appendChild(style);
        
        // Add quick action buttons to each product card
        productCards.forEach(card => {
            // Create buttons container
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'product-quick-actions';
            buttonsContainer.innerHTML = `
                <button class="quick-action-btn add-to-cart-btn" title="Add to Cart">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                <button class="quick-action-btn quick-view-btn" title="Quick View">
                    <i class="fas fa-eye"></i>
                </button>
            `;
            
            card.appendChild(buttonsContainer);
        });
        
        // Add event listeners for quick action buttons
        document.addEventListener('click', function(e) {
            // Add to cart button
            if (e.target.closest('.add-to-cart-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const card = e.target.closest('.product-card');
                const productName = card.querySelector('.product-card__title').textContent;
                const productPrice = card.querySelector('.current-price').textContent;
                const productImage = card.querySelector('.product-card__image').src;
                const productId = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                
                // Add to cart without redirecting to cart page
                addToCart({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage
                }, 1, false);
            }
            
            // Quick view button
            if (e.target.closest('.quick-view-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const card = e.target.closest('.product-card');
                const productName = card.querySelector('.product-card__title').textContent;
                const productPrice = card.querySelector('.current-price').textContent;
                const productImage = card.querySelector('.product-card__image').src;
                const productDescription = card.querySelector('.product-card__description').textContent;
                const productId = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                
                // Show quick view modal
                showQuickViewModal(productId, productName, productPrice, productImage, productDescription);
            }
        });
    }
    
    /**
     * Initialize price range slider
     */
    function initPriceRangeSlider() {
        const slider = document.querySelector('.price-range-slider');
        if (!slider) return;
        
        const minHandle = slider.querySelector('.slider-handle:first-child');
        const maxHandle = slider.querySelector('.slider-handle:last-child');
        const range = slider.querySelector('.slider-range');
        const minInput = document.getElementById('min-price');
        const maxInput = document.getElementById('max-price');
        const applyButton = document.querySelector('.apply-button');
        
        let isDragging = false;
        let currentHandle = null;
        let startX, startLeft;
        
        // Set up event listeners for handles
        [minHandle, maxHandle].forEach(handle => {
            handle.addEventListener('mousedown', function(e) {
                isDragging = true;
                currentHandle = this;
                startX = e.clientX;
                startLeft = parseInt(getComputedStyle(this).left);
                
                e.preventDefault();
            });
        });
        
        // Move the handle and update the range
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const sliderRect = slider.getBoundingClientRect();
            const sliderWidth = sliderRect.width;
            
            // Calculate new position
            let newLeft = startLeft + e.clientX - startX;
            
            // Constrain to slider bounds
            newLeft = Math.max(0, Math.min(sliderWidth, newLeft));
            
            // Constrain min handle to not go beyond max handle
            if (currentHandle === minHandle) {
                const maxLeft = parseInt(getComputedStyle(maxHandle).left);
                newLeft = Math.min(newLeft, maxLeft);
            }
            
            // Constrain max handle to not go before min handle
            if (currentHandle === maxHandle) {
                const minLeft = parseInt(getComputedStyle(minHandle).left);
                newLeft = Math.max(newLeft, minLeft);
            }
            
            // Update handle position
            currentHandle.style.left = newLeft + 'px';
            
            // Update range
            if (currentHandle === minHandle) {
                range.style.left = newLeft + 'px';
                range.style.width = (parseInt(getComputedStyle(maxHandle).left) - newLeft) + 'px';
                
                // Update min input
                const minPercent = newLeft / sliderWidth;
                const minValue = Math.round(minPercent * 999999);
                minInput.value = minValue;
            } else {
                range.style.width = (newLeft - parseInt(getComputedStyle(minHandle).left)) + 'px';
                
                // Update max input
                const maxPercent = newLeft / sliderWidth;
                const maxValue = Math.round(maxPercent * 999999);
                maxInput.value = maxValue;
            }
        });
        
        // Stop dragging
        document.addEventListener('mouseup', function() {
            isDragging = false;
            currentHandle = null;
        });
        
        // Input changes
        minInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            
            // Constrain min value
            value = Math.max(0, Math.min(999999, value));
            this.value = value;
            
            // Calculate position
            const sliderWidth = slider.getBoundingClientRect().width;
            const percent = value / 999999;
            const newLeft = percent * sliderWidth;
            
            // Update handle and range
            minHandle.style.left = newLeft + 'px';
            range.style.left = newLeft + 'px';
            range.style.width = (parseInt(getComputedStyle(maxHandle).left) - newLeft) + 'px';
        });
        
        maxInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            
            // Constrain max value
            value = Math.max(0, Math.min(999999, value));
            this.value = value;
            
            // Calculate position
            const sliderWidth = slider.getBoundingClientRect().width;
            const percent = value / 999999;
            const newLeft = percent * sliderWidth;
            
            // Update handle and range
            maxHandle.style.left = newLeft + 'px';
            range.style.width = (newLeft - parseInt(getComputedStyle(minHandle).left)) + 'px';
        });
        
        // Apply button
        applyButton.addEventListener('click', function() {
            const minValue = parseInt(minInput.value);
            const maxValue = parseInt(maxInput.value);
            
            // Show message
            showNotification(`Price filter applied: $${minValue.toLocaleString()} - $${maxValue.toLocaleString()}`, 'success');
        });
    }
    
    /**
     * Initialize filter toggles
     */
    function initFilterToggles() {
        const filterHeaders = document.querySelectorAll('.filter-header');
        
        filterHeaders.forEach(header => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('i');
            
            header.addEventListener('click', function() {
                // Toggle content visibility
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
                
                // Toggle icon
                icon.classList.toggle('fa-chevron-up');
                icon.classList.toggle('fa-chevron-down');
            });
        });
        
        // Initialize filter checkboxes
        const filterCheckboxes = document.querySelectorAll('.filter-list input[type="checkbox"]');
        
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const filterType = this.closest('.filter-group').querySelector('.filter-title').textContent;
                const filterValue = this.parentElement.textContent.trim();
                
                if (this.checked) {
                    // Show filter applied message
                    showNotification(`Filter applied: ${filterType} - ${filterValue}`, 'success');
                } else {
                    // Show filter removed message
                    showNotification(`Filter removed: ${filterType} - ${filterValue}`, 'info');
                }
            });
        });
        
        // Initialize radio buttons
        const filterRadios = document.querySelectorAll('.filter-list input[type="radio"]');
        
        filterRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    const filterType = this.closest('.filter-group').querySelector('.filter-title').textContent;
                    const filterValue = this.parentElement.textContent.trim();
                    
                    // Show filter applied message
                    showNotification(`Filter applied: ${filterType} - ${filterValue}`, 'success');
                }
            });
        });
    }
    
    /**
     * Initialize view toggle
     */
    function initViewToggle() {
        const viewToggleBtns = document.querySelectorAll('.view-toggle button');
        
        viewToggleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                viewToggleBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Check which view is clicked
                const isGrid = this.querySelector('i').classList.contains('fa-th');
                
                if (isGrid) {
                    // Navigate to grid view
                    window.location.href = 'web-gridView.html';
                }
            });
        });
        
        // "Verified only" checkbox
        const verifiedCheckbox = document.querySelector('.verified-only input');
        
        if (verifiedCheckbox) {
            verifiedCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    showNotification('Showing verified sellers only', 'info');
                } else {
                    showNotification('Showing all sellers', 'info');
                }
            });
        }
        
        // Sort dropdown
        const sortDropdown = document.querySelector('.sort-dropdown');
        
        if (sortDropdown) {
            sortDropdown.addEventListener('click', function() {
                // Create dropdown menu if it doesn't exist
                if (!document.querySelector('.sort-options')) {
                    const options = document.createElement('div');
                    options.className = 'sort-options';
                    options.innerHTML = `
                        <div class="sort-option active">Featured</div>
                        <div class="sort-option">Price: Low to High</div>
                        <div class="sort-option">Price: High to Low</div>
                        <div class="sort-option">Newest Arrivals</div>
                        <div class="sort-option">Customer Rating</div>
                    `;
                    
                    // Add styles for options
                    const style = document.createElement('style');
                    style.textContent = `
                        .sort-options {
                            position: absolute;
                            top: 100%;
                            right: 0;
                            background-color: white;
                            border: 1px solid #e4e4e4;
                            border-radius: 6px;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                            z-index: 10;
                            overflow: hidden;
                            min-width: 180px;
                        }
                        
                        .sort-option {
                            padding: 10px 16px;
                            cursor: pointer;
                            color: #606060;
                            font-size: 14px;
                            transition: background-color 0.2s ease;
                        }
                        
                        .sort-option:hover {
                            background-color: #f5f5f5;
                        }
                        
                        .sort-option.active {
                            color: #0D6EFD;
                            font-weight: 500;
                        }
                    `;
                    
                    document.head.appendChild(style);
                    
                    // Add options to dropdown
                    this.appendChild(options);
                    
                    // Add event listeners to options
                    const sortOptions = options.querySelectorAll('.sort-option');
                    
                    sortOptions.forEach(option => {
                        option.addEventListener('click', function(e) {
                            e.stopPropagation();
                            
                            // Remove active class from all options
                            sortOptions.forEach(o => o.classList.remove('active'));
                            
                            // Add active class to clicked option
                            this.classList.add('active');
                            
                            // Update dropdown text
                            sortDropdown.querySelector('span').textContent = this.textContent;
                            
                            // Show message
                            showNotification(`Sorting by ${this.textContent}`, 'info');
                            
                            // Remove options
                            options.remove();
                        });
                    });
                    
                    // Close dropdown when clicking outside
                    document.addEventListener('click', function closeDropdown(e) {
                        if (!sortDropdown.contains(e.target)) {
                            options.remove();
                            document.removeEventListener('click', closeDropdown);
                        }
                    });
                } else {
                    // Remove options if already open
                    document.querySelector('.sort-options').remove();
                }
            });
        }
    }
    
    /**
     * Initialize pagination
     */
    function initPagination() {
        const pageButtons = document.querySelectorAll('.page-num');
        const prevButton = document.querySelector('.prev-page');
        const nextButton = document.querySelector('.next-page');
        
        // Page number buttons
        pageButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                pageButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show message
                showNotification(`Navigated to page ${this.textContent}`, 'info');
                
                // Scroll to top of products
                const productsSection = document.querySelector('.product-list');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Previous page button
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                // Find active page
                const activePage = document.querySelector('.page-num.active');
                
                // Check if it's the first page
                if (activePage.textContent === '1') {
                    showNotification('Already on the first page', 'info');
                    return;
                }
                
                // Find previous page
                const prevPage = activePage.previousElementSibling;
                
                if (prevPage && prevPage.classList.contains('page-num')) {
                    // Remove active class from current page
                    activePage.classList.remove('active');
                    
                    // Add active class to previous page
                    prevPage.classList.add('active');
                    
                    // Show message
                    showNotification(`Navigated to page ${prevPage.textContent}`, 'info');
                    
                    // Scroll to top of products
                    const productsSection = document.querySelector('.product-list');
                    if (productsSection) {
                        productsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }
        
        // Next page button
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                // Find active page
                const activePage = document.querySelector('.page-num.active');
                
                // Check if it's the last page
                const lastPage = document.querySelector('.page-num:last-of-type');
                
                if (activePage === lastPage) {
                    showNotification('Already on the last page', 'info');
                    return;
                }
                
                // Find next page
                const nextPage = activePage.nextElementSibling;
                
                if (nextPage && nextPage.classList.contains('page-num')) {
                    // Remove active class from current page
                    activePage.classList.remove('active');
                    
                    // Add active class to next page
                    nextPage.classList.add('active');
                    
                    // Show message
                    showNotification(`Navigated to page ${nextPage.textContent}`, 'info');
                    
                    // Scroll to top of products
                    const productsSection = document.querySelector('.product-list');
                    if (productsSection) {
                        productsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }
        
        // Show per page dropdown
        const perPageSelect = document.querySelector('.show-per-page select');
        
        if (perPageSelect) {
            perPageSelect.addEventListener('change', function() {
                // Show message
                showNotification(`Showing ${this.value} items per page`, 'info');
            });
        }
    }
    
    /**
     * Add to cart
     */
    function addToCart(item, quantity = 1, redirect = true) {
        // Get cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Check if item already exists
        const existingItemIndex = cartItems.findIndex(cartItem => 
            cartItem.id === item.id
        );
        
        if (existingItemIndex > -1) {
            // Update quantity
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cartItems.push(item);
        }
        
        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Update cart count
        updateCartCount();

        if (redirect) {
            // Navigate to cart page
            window.location.href = 'cart.html';
        }
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
        const cartIcon = document.querySelector('.action i.fa-shopping-cart');
        
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
                const cartElement = cartIcon.closest('.action');
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
            wishlistItem.id === item.id
        );
        
        if (existingItemIndex === -1) {
            // Add new item
            wishlistItems.push(item);
            
            // Save to localStorage
            localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
            
            // Show notification
            showNotification(`${item.name} added to wishlist!`, 'success');
        }
    }
    
    /**
     * Remove from wishlist
     */
    function removeFromWishlist(productId) {
        // Get wishlist items from localStorage
        const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        
        // Find item to remove
        const itemToRemove = wishlistItems.find(item => item.id === productId);
        
        if (itemToRemove) {
            // Remove item
            const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
            
            // Save to localStorage
            localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
            
            // Show notification
            showNotification(`Item removed from wishlist`, 'info');
        }
    }
    
    /**
     * Show quick view modal
     */
    function showQuickViewModal(productId, productName, productPrice, productImage, productDescription) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.setAttribute('data-product-id', productId);
        
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
                            ${productDescription}
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
                                View Full Details
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
            
            // Add to cart without redirecting
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            }, quantity, false);
            
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
            
            // Navigate to product page
            window.location.href = `product.html?id=${encodeURIComponent(productId)}`;
        });
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
    
    // Initialize cart count
    updateCartCount();
}); 