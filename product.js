document.addEventListener('DOMContentLoaded', function() {
    // Initialize product page
    initializeProductPage();
    
    /**
     * Initialize product page
     */
    function initializeProductPage() {
        // Get product ID from URL
        const productId = getUrlParameter('id');
        
        if (productId) {
            // In a real application, we would fetch product data from a database or API
            // For this demo, we'll use hardcoded product details or dummy data
            setupProductDetails(productId);
        }
        
        // Initialize quantity selector
    initializeQuantitySelector();
    
        // Initialize product tabs
        initializeProductTabs();
        
        // Initialize product gallery
        initializeProductGallery();
        
        // Initialize related products
        initializeRelatedProducts();
        
        // Initialize add to cart button
        initializeAddToCartButton();
        
        // Initialize favorite button
        initializeFavoriteButton();
    }
    
    /**
     * Set up product details based on product ID
     */
    function setupProductDetails(productId) {
        // For a real application, this would fetch data from a backend or API
        // For this demo, we'll use the product ID to simulate different products
        
        // Set product name if it exists in the DOM
        const productName = document.querySelector('.product-title');
        if (productName) {
            // Keep the existing product name from HTML
            const currentName = productName.textContent;
            document.title = `${currentName} - ShopEase`;
        }
        
        // Other product details would be updated here in a real application
    }
    
    /**
     * Initialize quantity selector
     */
    function initializeQuantitySelector() {
        const decreaseBtn = document.querySelector('.quantity-decrease');
        const increaseBtn = document.querySelector('.quantity-increase');
        const quantityInput = document.querySelector('.quantity-input');
        
        if (decreaseBtn && increaseBtn && quantityInput) {
            decreaseBtn.addEventListener('click', function() {
                let quantity = parseInt(quantityInput.value);
                if (quantity > 1) {
                    quantity--;
                    quantityInput.value = quantity;
                    
                    // Update total price if applicable
                    updateTotalPrice();
                }
            });
            
            increaseBtn.addEventListener('click', function() {
                let quantity = parseInt(quantityInput.value);
                quantity++;
                quantityInput.value = quantity;
                
                // Update total price if applicable
                updateTotalPrice();
            });
            
            quantityInput.addEventListener('change', function() {
                let quantity = parseInt(this.value);
                if (isNaN(quantity) || quantity < 1) {
                    quantity = 1;
                }
                this.value = quantity;
                
                // Update total price if applicable
                updateTotalPrice();
            });
        }
    }
    
    /**
     * Update total price based on quantity
     */
    function updateTotalPrice() {
        const quantityInput = document.querySelector('.quantity-input');
        const originalPriceElement = document.querySelector('.product-price');
        const totalPriceElement = document.querySelector('.product-total-price');
        
        if (quantityInput && originalPriceElement && totalPriceElement) {
            const quantity = parseInt(quantityInput.value);
            const originalPrice = parseFloat(originalPriceElement.textContent.replace(/[^0-9.]/g, ''));
            const totalPrice = originalPrice * quantity;
            
            totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        }
    }
    
    /**
     * Initialize product tabs
     */
    function initializeProductTabs() {
        const tabLinks = document.querySelectorAll('.product-tab-link');
        const tabContents = document.querySelectorAll('.product-tab-content');
        
        if (tabLinks.length && tabContents.length) {
            tabLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                e.preventDefault();
                
                    // Get target tab
                const targetId = this.getAttribute('href').substring(1);
                    
                    // Hide all tab contents
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                    });
                    
                    // Remove active class from all tab links
                    tabLinks.forEach(tabLink => {
                        tabLink.classList.remove('active');
                    });
                    
                    // Show target tab content
                    const targetTab = document.getElementById(targetId);
                    if (targetTab) {
                        targetTab.classList.add('active');
                    }
                    
                    // Add active class to clicked tab link
                    this.classList.add('active');
                });
            });
        }
    }
    
    /**
     * Initialize product gallery
     */
    function initializeProductGallery() {
        const mainImage = document.querySelector('.product-main-image img');
        const thumbnails = document.querySelectorAll('.product-thumbnail');
        
        if (mainImage && thumbnails.length) {
            thumbnails.forEach(thumbnail => {
                thumbnail.addEventListener('click', function() {
                    // Get image source
                    const imgSrc = this.querySelector('img').getAttribute('src');
                    
                    // Update main image
                    mainImage.setAttribute('src', imgSrc);
                    
                    // Remove active class from all thumbnails
                    thumbnails.forEach(thumb => {
                        thumb.classList.remove('active');
                    });
                    
                    // Add active class to clicked thumbnail
                    this.classList.add('active');
                                });
                            });
                            
            // Image zoom on hover
            const imageContainer = mainImage.parentElement;
            
            if (imageContainer) {
                imageContainer.addEventListener('mousemove', function(e) {
                    // Only apply zoom on desktop
                    if (window.innerWidth < 992) return;
                    
                    const { left, top, width, height } = this.getBoundingClientRect();
                    const x = (e.clientX - left) / width * 100;
                    const y = (e.clientY - top) / height * 100;
                    
                    mainImage.style.transformOrigin = `${x}% ${y}%`;
                });
                
                imageContainer.addEventListener('mouseenter', function() {
                    // Only apply zoom on desktop
                    if (window.innerWidth < 992) return;
                    
                    mainImage.style.transform = 'scale(1.5)';
                });
                
                imageContainer.addEventListener('mouseleave', function() {
                    mainImage.style.transform = 'scale(1)';
                                });
                            }
                        }
    }
    
    /**
     * Initialize related products
     */
    function initializeRelatedProducts() {
        const relatedProducts = document.querySelectorAll('.related-product');
        
        relatedProducts.forEach(product => {
            product.addEventListener('click', function(e) {
                // Don't navigate if clicked on a button
                if (e.target.closest('button')) return;
                
                // Get product details
                const productName = this.querySelector('.related-product-title').textContent;
                const productId = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                
                // Navigate to product page with product ID
                window.location.href = `product.html?id=${encodeURIComponent(productId)}`;
            });
            
            // Add to cart button
            const addToCartBtn = product.querySelector('.related-add-to-cart');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const productName = product.querySelector('.related-product-title').textContent;
                    const productPrice = product.querySelector('.related-product-price').textContent;
                    const productImage = product.querySelector('.related-product-image').src;
                    const productId = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    
                    // Add to cart
                    addToCart({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage
                    }, 1, false);
                });
            }
        });
    }
    
    /**
     * Initialize add to cart button
     */
    function initializeAddToCartButton() {
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                // Get product details
                const productName = document.querySelector('.product-title').textContent;
                const productPrice = document.querySelector('.product-price').textContent;
                const productImage = document.querySelector('.product-main-image img').src;
                const quantityInput = document.querySelector('.quantity-input');
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                const productId = getUrlParameter('id') || productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                
                // Add to cart
                addToCart({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage
                }, quantity, false);
            });
        }
        
        // Buy now button
        const buyNowBtn = document.querySelector('.buy-now-btn');
        
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function() {
                // Get product details
                const productName = document.querySelector('.product-title').textContent;
                const productPrice = document.querySelector('.product-price').textContent;
                const productImage = document.querySelector('.product-main-image img').src;
                const quantityInput = document.querySelector('.quantity-input');
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                const productId = getUrlParameter('id') || productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                
                // Add to cart and redirect to cart page
                addToCart({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage
                }, quantity, true);
            });
        }
    }
    
    /**
     * Initialize favorite button
     */
    function initializeFavoriteButton() {
        const favoriteBtn = document.querySelector('.favorite-btn');
        
        if (favoriteBtn) {
            // Check if product is already in wishlist
            const productId = getUrlParameter('id');
            const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
            const isInWishlist = wishlistItems.some(item => item.id === productId);
            
            // Update button state
            if (isInWishlist) {
                favoriteBtn.classList.add('active');
                favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Added to Wishlist';
            }
            
            favoriteBtn.addEventListener('click', function() {
                // Get product details
                const productName = document.querySelector('.product-title').textContent;
                const productPrice = document.querySelector('.product-price').textContent;
                const productImage = document.querySelector('.product-main-image img').src;
                const productId = getUrlParameter('id') || productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                
                // Toggle wishlist state
                const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
                const existingItemIndex = wishlistItems.findIndex(item => item.id === productId);
                
                if (existingItemIndex === -1) {
                    // Add to wishlist
                    wishlistItems.push({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage
                    });
                    
                    // Update button state
                    this.classList.add('active');
                    this.innerHTML = '<i class="fas fa-heart"></i> Added to Wishlist';
                    
                    // Show notification
                    showNotification(`${productName} added to wishlist!`, 'success');
                } else {
                    // Remove from wishlist
                    wishlistItems.splice(existingItemIndex, 1);
                    
                    // Update button state
                    this.classList.remove('active');
                    this.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
                    
                    // Show notification
                    showNotification(`${productName} removed from wishlist`, 'info');
                }
                
                // Save to localStorage
                localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
            });
        }
    }
}); 