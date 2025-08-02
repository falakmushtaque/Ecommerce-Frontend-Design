document.addEventListener('DOMContentLoaded', function() {
    // Initialize search functionality
    initSearch();
    
    /**
     * Initialize search functionality
     */
    function initSearch() {
        // Get search elements
        const searchForms = document.querySelectorAll('.search-form, .custom-search-bar');
        const searchInputs = document.querySelectorAll('.search-input, .custom-search-bar input');
        
        searchForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get search input
                const searchInput = this.querySelector('input');
                const searchQuery = searchInput.value.trim();
                
                if (searchQuery) {
                    // Save search query to recent searches
                    saveRecentSearch(searchQuery);
                    
                    // Show success message
                    showNotification(`Searching for "${searchQuery}"`, 'info');
                    
                    // Navigate to web-gridView.html with search query as parameter
                    window.location.href = `web-gridView.html?search=${encodeURIComponent(searchQuery)}`;
                    
                    // Hide search suggestions if they exist
                    const searchSuggestions = document.querySelector('.search-suggestions');
                    if (searchSuggestions) {
                        searchSuggestions.remove();
                    }
                } else {
                    // Show error message
                    showNotification('Please enter a search term', 'error');
                }
            });
        });

        // Also add direct click handlers for search buttons
        const searchButtons = document.querySelectorAll('.custom-search-bar button, .search-button');
        
        searchButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Find the closest search form or container
                const searchContainer = this.closest('.custom-search-bar') || this.closest('.search-form');
                
                if (searchContainer) {
                    // Get search input
                    const searchInput = searchContainer.querySelector('input');
                    const searchQuery = searchInput.value.trim();
                    
                    if (searchQuery) {
                        // Save search query to recent searches
                        saveRecentSearch(searchQuery);
                        
                        // Show success message
                        showNotification(`Searching for "${searchQuery}"`, 'info');
                        
                        // Navigate to web-gridView.html with search query as parameter
                        window.location.href = `web-gridView.html?search=${encodeURIComponent(searchQuery)}`;
                    } else {
                        // Show error message
                        showNotification('Please enter a search term', 'error');
                    }
                }
            });
        });
        
        searchInputs.forEach(input => {
            // Add focus event to show suggestions
            input.addEventListener('focus', function() {
                showSearchSuggestions(this);
            });
            
            // Add input event to update suggestions
            input.addEventListener('input', function() {
                updateSearchSuggestions(this);
            });
            
            // Add click event to prevent suggestions from closing
            input.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            
            // Handle Enter key press on search inputs
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    
                    const searchQuery = this.value.trim();
                    
                    if (searchQuery) {
                        // Save search query to recent searches
                        saveRecentSearch(searchQuery);
                        
                        // Show success message
                        showNotification(`Searching for "${searchQuery}"`, 'info');
                        
                        // Navigate to web-gridView.html with search query as parameter
                        window.location.href = `web-gridView.html?search=${encodeURIComponent(searchQuery)}`;
                    } else {
                        // Show error message
                        showNotification('Please enter a search term', 'error');
                    }
                }
            });
            
            // Close suggestions when clicking outside
            document.addEventListener('click', function() {
                const suggestions = document.querySelector('.search-suggestions');
                if (suggestions) {
                    suggestions.remove();
                }
            });
        });
    }
    
    /**
     * Show search suggestions
     */
    function showSearchSuggestions(searchInput) {
        // Create suggestions element
        const suggestions = document.createElement('div');
        suggestions.className = 'search-suggestions';
        
        // Get recent searches
        const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        
        // Get dummy categories
        const categories = [
            'Electronics',
            'Clothing',
            'Home & Garden',
            'Toys & Games',
            'Sports & Outdoors',
            'Beauty & Personal Care',
            'Health & Household',
            'Books',
            'Automotive'
        ];
        
        // Get dummy popular products
        const popularProducts = [
            'Wireless Headphones',
            'Smart Watch',
            'Bluetooth Speaker',
            'Laptop Stand',
            'Phone Case',
            'Wireless Charger'
        ];
        
        // Create suggestions HTML
        let suggestionsHTML = '';
        
        // Add recent searches if available
        if (recentSearches.length > 0) {
            suggestionsHTML += `
                <div class="suggestions-section">
                    <h3 class="suggestions-title">Recent Searches</h3>
                    <ul class="suggestions-list">
            `;
            
            recentSearches.slice(0, 5).forEach(search => {
                suggestionsHTML += `
                    <li class="suggestion-item recent-search">
                        <i class="fas fa-history"></i>
                        <span>${search}</span>
                        <button class="remove-search" data-search="${search}">
                            <i class="fas fa-times"></i>
                        </button>
                    </li>
                `;
            });
            
            suggestionsHTML += `
                    </ul>
                </div>
            `;
        }
        
        // Add categories
        suggestionsHTML += `
            <div class="suggestions-section">
                <h3 class="suggestions-title">Categories</h3>
                <ul class="suggestions-list">
        `;
        
        categories.slice(0, 5).forEach(category => {
            suggestionsHTML += `
                <li class="suggestion-item category">
                    <i class="fas fa-tag"></i>
                    <span>${category}</span>
                </li>
            `;
        });
        
        suggestionsHTML += `
                </ul>
            </div>
        `;
        
        // Add popular products
        suggestionsHTML += `
            <div class="suggestions-section">
                <h3 class="suggestions-title">Popular Products</h3>
                <ul class="suggestions-list">
        `;
        
        popularProducts.slice(0, 5).forEach(product => {
            suggestionsHTML += `
                <li class="suggestion-item product">
                    <i class="fas fa-search"></i>
                    <span>${product}</span>
                </li>
            `;
        });
        
        suggestionsHTML += `
                </ul>
                    </div>
                `;
                
        // Set suggestions HTML
        suggestions.innerHTML = suggestionsHTML;
        
        // Add styles for suggestions
        addSearchStyles();
        
        // Position suggestions
        const searchForm = searchInput.closest('form, .custom-search-bar');
        searchForm.style.position = 'relative';
        suggestions.style.width = searchForm.offsetWidth + 'px';
        
        // Add suggestions to DOM
        searchForm.appendChild(suggestions);
        
        // Add event listeners for suggestions
        suggestions.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Check if clicked on suggestion item
            const suggestionItem = e.target.closest('.suggestion-item');
            
            if (suggestionItem) {
                const text = suggestionItem.querySelector('span').textContent;
                
                // Check if clicked on remove button
                const removeBtn = e.target.closest('.remove-search');
                
                if (removeBtn) {
                    // Remove from recent searches
                    removeRecentSearch(text);
                    
                    // Remove from DOM
                    suggestionItem.remove();
                    
                    // Check if there are no more recent searches
                    const recentSearchItems = suggestions.querySelectorAll('.recent-search');
                    if (recentSearchItems.length === 0) {
                        // Remove recent searches section
                        const recentSearchesSection = suggestions.querySelector('.suggestions-section:first-child');
                        if (recentSearchesSection) {
                            recentSearchesSection.remove();
                        }
                    }
                } else {
                    // Set search input value
                    searchInput.value = text;
                    
                    // Save recent search
                    saveRecentSearch(text);
                    
                    // Submit search form
                    const form = searchInput.closest('form, .custom-search-bar');
                    const submitEvent = new Event('submit');
                    form.dispatchEvent(submitEvent);
                }
            }
            });
        }
        
        /**
     * Update search suggestions based on input
     */
    function updateSearchSuggestions(searchInput) {
        const query = searchInput.value.trim().toLowerCase();
        const suggestions = document.querySelector('.search-suggestions');
        
        if (!suggestions) return;
        
        // Get all suggestion items
        const allSuggestions = suggestions.querySelectorAll('.suggestion-item');
        
        if (query) {
            // Filter suggestions based on query
            allSuggestions.forEach(suggestion => {
                const text = suggestion.querySelector('span').textContent.toLowerCase();
                if (text.includes(query)) {
                    suggestion.style.display = '';
            } else {
                    suggestion.style.display = 'none';
                }
            });
            
            // Check if any suggestions are visible in each section
            const sections = suggestions.querySelectorAll('.suggestions-section');
            sections.forEach(section => {
                const visibleItems = section.querySelectorAll('.suggestion-item[style="display: none;"]');
                
                if (visibleItems.length === section.querySelectorAll('.suggestion-item').length) {
                    section.style.display = 'none';
                } else {
                    section.style.display = '';
                }
            });
        } else {
            // Show all suggestions
            allSuggestions.forEach(suggestion => {
                suggestion.style.display = '';
            });
            
            // Show all sections
            const sections = suggestions.querySelectorAll('.suggestions-section');
            sections.forEach(section => {
                section.style.display = '';
            });
        }
    }
    
    /**
     * Save recent search
     */
    function saveRecentSearch(query) {
        // Get recent searches
        const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        
            // Remove if already exists
        const index = recentSearches.indexOf(query);
        if (index > -1) {
            recentSearches.splice(index, 1);
        }
            
        // Add to beginning of array
            recentSearches.unshift(query);
            
            // Limit to 10 recent searches
        if (recentSearches.length > 10) {
            recentSearches.pop();
        }
            
            // Save to localStorage
            localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        }
        
        /**
     * Remove recent search
     */
    function removeRecentSearch(query) {
        // Get recent searches
        const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        
        // Remove search
        const index = recentSearches.indexOf(query);
        if (index > -1) {
            recentSearches.splice(index, 1);
        }
        
        // Save to localStorage
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
    
    /**
     * Add styles for search suggestions
     */
    function addSearchStyles() {
        if (document.querySelector('style[data-search-styles]')) return;
        
        const style = document.createElement('style');
        style.setAttribute('data-search-styles', '');
        style.textContent = `
            .search-suggestions {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background-color: white;
                border-radius: 0 0 6px 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                z-index: 100;
                margin-top: 2px;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .suggestions-section {
                padding: 10px 0;
                border-bottom: 1px solid #E0E0E0;
            }
            
            .suggestions-section:last-child {
                border-bottom: none;
            }
            
            .suggestions-title {
                font-size: 12px;
                color: #8B96A5;
                margin: 0;
                padding: 0 15px 5px;
            }
            
            .suggestions-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .suggestion-item {
                padding: 8px 15px;
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            
            .suggestion-item:hover {
                background-color: #F5F5F5;
            }
            
            .suggestion-item i {
                color: #8B96A5;
                width: 16px;
                text-align: center;
            }
            
            .suggestion-item span {
                flex: 1;
                color: #1C1C1C;
            }
            
            .remove-search {
                background: none;
                border: none;
                color: #8B96A5;
                cursor: pointer;
                padding: 5px;
            }
            
            .remove-search:hover {
                color: #ea4335;
            }
        `;
        
        document.head.appendChild(style);
    }
}); 