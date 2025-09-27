# Shopify Wishlist App

A complete wishlist solution for Shopify stores with both customer-facing functionality and admin management capabilities.

## Features

### Customer Features
- ❤️ **Heart Toggle Button**: Click to add/remove products from wishlist
- 📋 **Dropdown Menu**: Shows first 5 wishlist items with quick access
- 📄 **Dedicated Wishlist Page**: Full page view of all wishlist items
- 👤 **Guest Support**: Save wishlists using browser cookies for non-logged users
- 🛒 **Add to Cart**: Quick add to cart from wishlist
- 📱 **Mobile Responsive**: Works seamlessly on all devices

### Admin Features
- 📊 **Dashboard**: View wishlist statistics and usage metrics
- 👥 **Customer Wishlists**: See all customer wishlists and their items
- ⚙️ **Settings**: Customize colors, behavior, and limits
- 🎨 **Customizable**: Adjust heart colors, dropdown count, page URLs
- 📈 **Analytics**: Track wishlist usage and popular items

## Installation

### Prerequisites
- Shopify store
- Shopify CLI
- Node.js 16+

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Siegfried082/shopify-wishlist.git
   cd shopify-wishlist
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd web/frontend && npm install
   cd ../backend && npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy example env file
   cp .env.example .env
   
   # Edit .env with your Shopify app credentials
   SHOPIFY_API_KEY=your_api_key
   SHOPIFY_API_SECRET=your_api_secret
   HOST=your_app_url
   ```

4. **Deploy the theme extension**
   ```bash
   shopify app deploy
   ```

5. **Install the app in your store**
   ```bash
   shopify app dev
   ```

## Theme Integration

### Adding Wishlist Button to Product Pages

Add the wishlist button to your product pages by including the block in your product template:

```liquid
<!-- In templates/product.liquid or sections/product-form.liquid -->
{% render 'wishlist-button', product: product %}
```

### Adding Wishlist Dropdown to Header

Include the wishlist dropdown in your theme header:

```liquid
<!-- In sections/header.liquid -->
<div class="header-wishlist">
  {% render 'wishlist-dropdown' %}
</div>
```

### Creating Wishlist Page

1. In Shopify Admin, go to **Pages** → **Add page**
2. Set the handle to `wishlist`
3. Choose template `page.wishlist`
4. Save the page

## File Structure

```
shopify-wishlist/
├── extensions/wishlist-extension/          # Theme extension files
│   ├── blocks/                            # Liquid blocks
│   │   ├── wishlist-button.liquid         # Heart toggle button
│   │   ├── wishlist-dropdown.liquid       # Dropdown menu
│   │   └── wishlist-page.liquid          # Full page view
│   ├── assets/                           # JavaScript and CSS
│   │   └── wishlist.js                   # Main functionality
│   ├── locales/                          # Translations
│   └── shopify.extension.toml            # Extension config
├── web/                                  # Admin app
│   ├── frontend/                         # React admin interface
│   └── backend/                          # Node.js API
├── templates/                            # Theme templates
└── shopify.app.toml                      # App configuration
```

## Configuration

### Customizing Colors

In the admin settings, you can customize:
- Heart icon color (default: #e91e63)
- Active heart color (default: #c2185b)
- Number of dropdown items (1-10)
- Maximum wishlist items per user

### JavaScript API

The wishlist functionality exposes a JavaScript API:

```javascript
// Add item to wishlist
window.shopifyWishlist.addToWishlist({
  id: 'product-id',
  title: 'Product Title',
  image: 'image-url',
  url: 'product-url',
  price: '99.99'
});

// Remove from wishlist
window.shopifyWishlist.removeFromWishlistById('product-id');

// Check if item is in wishlist
const inWishlist = window.shopifyWishlist.isInWishlist('product-id');

// Get full wishlist
const wishlist = window.shopifyWishlist.getWishlist();
```

### Events

Listen to wishlist events:

```javascript
window.addEventListener('wishlistUpdated', (event) => {
  console.log('Wishlist updated:', event.detail.wishlist);
});
```

## Storage

The app uses multiple storage methods for reliability:
1. **localStorage** - Primary storage for registered users
2. **Cookies** - Backup storage and guest users
3. **Database** - Server-side storage for registered customers (when logged in)

## Styling

Default styles are included, but you can override them:

```css
/* Customize heart button */
.wishlist-button {
  /* Your custom styles */
}

/* Customize dropdown */
.wishlist-dropdown-content {
  /* Your custom styles */
}

/* Customize wishlist page */
.wishlist-page {
  /* Your custom styles */
}
```

## Development

### Running Locally

1. **Start the development server**
   ```bash
   shopify app dev
   ```

2. **Frontend development**
   ```bash
   cd web/frontend
   npm run dev
   ```

3. **Backend development**
   ```bash
   cd web/backend
   npm run dev
   ```

### Building for Production

```bash
# Build frontend
cd web/frontend && npm run build

# Deploy app
shopify app deploy
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and questions:
- Open an issue on GitHub
- Check the documentation
- Review existing issues

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

**Note**: This app requires proper setup of Shopify app credentials and theme integration. Please follow the installation steps carefully for proper functionality.