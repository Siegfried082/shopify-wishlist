/**
 * Shopify Wishlist App - Main JavaScript
 * Handles wishlist functionality including local storage, cookies, and UI updates
 */

class ShopifyWishlist {
  constructor() {
    this.wishlistKey = 'shopify_wishlist';
    this.wishlist = this.loadWishlist();
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateAllUI();
    
    // Update UI when page loads
    document.addEventListener('DOMContentLoaded', () => {
      this.updateAllUI();
    });
  }

  bindEvents() {
    // Wishlist button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.wishlist-button')) {
        e.preventDefault();
        const button = e.target.closest('.wishlist-button');
        this.toggleWishlistItem(button);
      }
      
      // Dropdown toggle
      if (e.target.closest('.wishlist-dropdown-trigger')) {
        e.preventDefault();
        this.toggleDropdown();
      }
      
      // Remove from wishlist (in dropdown or page)
      if (e.target.closest('.remove-from-wishlist')) {
        e.preventDefault();
        const productId = e.target.closest('[data-product-id]').dataset.productId;
        this.removeFromWishlist(productId);
      }
      
      // Clear all wishlist
      if (e.target.closest('.clear-wishlist-btn')) {
        e.preventDefault();
        this.clearWishlist();
      }
      
      // Add to cart from wishlist
      if (e.target.closest('.add-to-cart-btn')) {
        e.preventDefault();
        const productId = e.target.closest('[data-product-id]').dataset.productId;
        this.addToCart(productId);
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.wishlist-dropdown-wrapper')) {
        this.closeDropdown();
      }
    });

    // Handle page visibility change (to sync across tabs)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.wishlist = this.loadWishlist();
        this.updateAllUI();
      }
    });
  }

  loadWishlist() {
    try {
      // Try localStorage first
      if (typeof Storage !== 'undefined') {
        const stored = localStorage.getItem(this.wishlistKey);
        if (stored) {
          return JSON.parse(stored);
        }
      }
      
      // Fallback to cookies
      const cookieValue = this.getCookie(this.wishlistKey);
      if (cookieValue) {
        return JSON.parse(decodeURIComponent(cookieValue));
      }
      
      return [];
    } catch (e) {
      console.warn('Failed to load wishlist:', e);
      return [];
    }
  }

  saveWishlist() {
    try {
      const wishlistData = JSON.stringify(this.wishlist);
      
      // Save to localStorage
      if (typeof Storage !== 'undefined') {
        localStorage.setItem(this.wishlistKey, wishlistData);
      }
      
      // Also save to cookies as backup
      this.setCookie(this.wishlistKey, encodeURIComponent(wishlistData), 365);
      
      // Dispatch custom event for other parts of the app
      window.dispatchEvent(new CustomEvent('wishlistUpdated', {
        detail: { wishlist: this.wishlist }
      }));
      
    } catch (e) {
      console.warn('Failed to save wishlist:', e);
    }
  }

  toggleWishlistItem(button) {
    const productId = button.dataset.productId;
    const productData = {
      id: productId,
      title: button.dataset.productTitle,
      image: button.dataset.productImage,
      url: button.dataset.productUrl,
      price: button.dataset.productPrice,
      addedAt: new Date().toISOString()
    };

    const existingIndex = this.wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
      // Remove from wishlist
      this.wishlist.splice(existingIndex, 1);
      button.classList.remove('active');
      button.setAttribute('aria-label', 'Add to wishlist');
      button.setAttribute('title', 'Add to wishlist');
      
      // Show removal feedback
      this.showToast('Removed from wishlist', 'success');
    } else {
      // Add to wishlist
      this.wishlist.unshift(productData); // Add to beginning
      button.classList.add('active');
      button.setAttribute('aria-label', 'Remove from wishlist');
      button.setAttribute('title', 'Remove from wishlist');
      
      // Show addition feedback
      this.showToast('Added to wishlist', 'success');
    }
    
    this.saveWishlist();
    this.updateAllUI();
  }

  removeFromWishlist(productId) {
    const existingIndex = this.wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
      const product = this.wishlist[existingIndex];
      this.wishlist.splice(existingIndex, 1);
      this.saveWishlist();
      this.updateAllUI();
      
      this.showToast(`${product.title} removed from wishlist`, 'success');
    }
  }

  clearWishlist() {
    if (this.wishlist.length === 0) return;
    
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      this.wishlist = [];
      this.saveWishlist();
      this.updateAllUI();
      this.showToast('Wishlist cleared', 'success');
    }
  }

  addToCart(productId) {
    // Add to Shopify cart using Ajax API
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        items: [{
          id: productId,
          quantity: 1
        }]
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.items && data.items.length > 0) {
        this.showToast('Added to cart!', 'success');
        // Optionally update cart UI or redirect
        this.updateCartCount();
      } else {
        throw new Error('Failed to add to cart');
      }
    })
    .catch(error => {
      console.error('Add to cart error:', error);
      this.showToast('Could not add to cart', 'error');
    });
  }

  updateAllUI() {
    this.updateWishlistButtons();
    this.updateDropdownUI();
    this.updateWishlistPage();
    this.updateCounters();
  }

  updateWishlistButtons() {
    const buttons = document.querySelectorAll('.wishlist-button');
    buttons.forEach(button => {
      const productId = button.dataset.productId;
      const inWishlist = this.wishlist.some(item => item.id === productId);
      
      if (inWishlist) {
        button.classList.add('active');
        button.setAttribute('aria-label', 'Remove from wishlist');
        button.setAttribute('title', 'Remove from wishlist');
      } else {
        button.classList.remove('active');
        button.setAttribute('aria-label', 'Add to wishlist');
        button.setAttribute('title', 'Add to wishlist');
      }
    });
  }

  updateCounters() {
    const count = this.wishlist.length;
    
    // Update dropdown counter
    const counters = document.querySelectorAll('.wishlist-count');
    counters.forEach(counter => {
      counter.textContent = count;
      if (count === 0) {
        counter.classList.add('hidden');
      } else {
        counter.classList.remove('hidden');
      }
    });
    
    // Update total counters
    const totalCounters = document.querySelectorAll('.wishlist-total-count, .wishlist-total-items');
    totalCounters.forEach(counter => {
      counter.textContent = `${count} item${count !== 1 ? 's' : ''}`;
    });
  }

  updateDropdownUI() {
    const dropdownItems = document.querySelector('.wishlist-dropdown-items');
    const emptyState = document.querySelector('.wishlist-dropdown .wishlist-empty-state');
    
    if (!dropdownItems) return;
    
    if (this.wishlist.length === 0) {
      dropdownItems.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    // Get dropdown item limit from settings
    const dropdown = document.querySelector('.wishlist-dropdown-wrapper');
    const limit = 5; // Default, could be made configurable
    
    const itemsToShow = this.wishlist.slice(0, limit);
    
    dropdownItems.innerHTML = itemsToShow.map(item => `
      <a href="${item.url}" class="wishlist-item-preview" data-product-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" class="wishlist-item-image" loading="lazy">
        <div class="wishlist-item-details">
          <h4>${item.title}</h4>
          <div class="wishlist-item-price">${this.formatPrice(item.price)}</div>
        </div>
      </a>
    `).join('');
  }

  updateWishlistPage() {
    const wishlistGrid = document.querySelector('.wishlist-items-grid');
    const emptyState = document.querySelector('.wishlist-page .wishlist-empty-state');
    const clearBtn = document.querySelector('.clear-wishlist-btn');
    
    if (!wishlistGrid) return; // Not on wishlist page
    
    if (this.wishlist.length === 0) {
      wishlistGrid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      if (clearBtn) clearBtn.style.display = 'none';
      return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    if (clearBtn) clearBtn.style.display = 'inline-block';
    
    wishlistGrid.innerHTML = this.wishlist.map(item => `
      <div class="wishlist-item-card" data-product-id="${item.id}">
        <div class="wishlist-item-image-wrapper">
          <img src="${item.image}" alt="${item.title}" class="wishlist-item-image" loading="lazy">
          <button class="remove-from-wishlist" aria-label="Remove from wishlist" title="Remove from wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="wishlist-item-info">
          <h3 class="wishlist-item-title">
            <a href="${item.url}">${item.title}</a>
          </h3>
          <div class="wishlist-item-price">${this.formatPrice(item.price)}</div>
          <div class="wishlist-item-actions">
            <button class="add-to-cart-btn" data-product-id="${item.id}">Add to Cart</button>
            <a href="${item.url}" class="view-product-btn">View Product</a>
          </div>
        </div>
      </div>
    `).join('');
  }

  toggleDropdown() {
    const dropdown = document.querySelector('.wishlist-dropdown-wrapper');
    if (!dropdown) return;
    
    dropdown.classList.toggle('active');
  }

  closeDropdown() {
    const dropdown = document.querySelector('.wishlist-dropdown-wrapper');
    if (!dropdown) return;
    
    dropdown.classList.remove('active');
  }

  formatPrice(price) {
    if (!price) return '';
    
    // Assume price is already formatted or in cents
    if (typeof price === 'string' && price.includes('$')) {
      return price;
    }
    
    // Convert cents to dollars if needed
    const numericPrice = parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numericPrice / (numericPrice > 100 ? 100 : 1));
  }

  updateCartCount() {
    // Update cart count if cart counter exists
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        const cartCounters = document.querySelectorAll('.cart-count, #cart-count');
        cartCounters.forEach(counter => {
          counter.textContent = cart.item_count;
        });
      })
      .catch(console.error);
  }

  showToast(message, type = 'info') {
    // Create or update toast notification
    let toast = document.querySelector('.wishlist-toast');
    
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'wishlist-toast';
      document.body.appendChild(toast);
      
      // Add toast styles
      const style = document.createElement('style');
      style.textContent = `
        .wishlist-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #333;
          color: white;
          padding: 12px 18px;
          border-radius: 6px;
          z-index: 10000;
          transform: translateX(100%);
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 500;
          max-width: 300px;
        }
        .wishlist-toast.show {
          transform: translateX(0);
        }
        .wishlist-toast.success {
          background: #28a745;
        }
        .wishlist-toast.error {
          background: #dc3545;
        }
      `;
      document.head.appendChild(style);
    }
    
    toast.textContent = message;
    toast.className = `wishlist-toast ${type}`;
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Cookie utilities
  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Public API methods
  getWishlist() {
    return [...this.wishlist];
  }

  addToWishlist(productData) {
    const existingIndex = this.wishlist.findIndex(item => item.id === productData.id);
    if (existingIndex === -1) {
      this.wishlist.unshift({
        ...productData,
        addedAt: new Date().toISOString()
      });
      this.saveWishlist();
      this.updateAllUI();
      return true;
    }
    return false;
  }

  removeFromWishlistById(productId) {
    const existingIndex = this.wishlist.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      this.wishlist.splice(existingIndex, 1);
      this.saveWishlist();
      this.updateAllUI();
      return true;
    }
    return false;
  }

  isInWishlist(productId) {
    return this.wishlist.some(item => item.id === productId);
  }
}

// Initialize wishlist when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.shopifyWishlist = new ShopifyWishlist();
  });
} else {
  window.shopifyWishlist = new ShopifyWishlist();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShopifyWishlist;
}