import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { shopifyApi } from "@shopify/shopify-api";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configure Shopify API
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ["read_customers", "write_customers", "read_products"],
  hostName: process.env.HOST?.replace(/https?:\/\//, "") || "localhost:3001",
  hostScheme: "https",
  apiVersion: "2023-10",
  isEmbeddedApp: true,
  logger: {
    level: "info",
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend build
app.use(express.static(join(__dirname, '../frontend/dist')));

// API Routes

// Get wishlist statistics
app.get('/api/stats', async (req, res) => {
  try {
    // Mock data - in production, fetch from database
    const stats = {
      totalUsers: 1542,
      totalWishlists: 987,
      totalWishlistItems: 4523,
      activeUsers: 234,
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all customer wishlists
app.get('/api/wishlists', async (req, res) => {
  try {
    // Mock data - in production, fetch from database
    const wishlists = [
      {
        id: "1",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        itemCount: 5,
        lastUpdated: "2024-01-15",
        items: [
          {
            id: "prod-1",
            title: "Wireless Headphones",
            image: "https://via.placeholder.com/60",
            price: "$99.99",
            addedAt: "2024-01-10",
          },
          {
            id: "prod-2", 
            title: "Smartphone Case",
            image: "https://via.placeholder.com/60",
            price: "$29.99",
            addedAt: "2024-01-12",
          },
        ],
      },
      {
        id: "2",
        customerName: "Jane Smith",
        customerEmail: "jane@example.com", 
        itemCount: 3,
        lastUpdated: "2024-01-14",
        items: [
          {
            id: "prod-3",
            title: "Running Shoes",
            image: "https://via.placeholder.com/60",
            price: "$129.99",
            addedAt: "2024-01-08",
          },
        ],
      },
      {
        id: "3",
        customerName: "Guest User",
        customerEmail: "guest@session.local",
        itemCount: 2,
        lastUpdated: "2024-01-16",
        items: [
          {
            id: "prod-4",
            title: "Coffee Mug",
            image: "https://via.placeholder.com/60", 
            price: "$19.99",
            addedAt: "2024-01-16",
          },
        ],
      },
    ];
    
    res.json(wishlists);
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    res.status(500).json({ error: 'Failed to fetch wishlists' });
  }
});

// Get app settings
app.get('/api/settings', async (req, res) => {
  try {
    // Mock data - in production, fetch from database
    const settings = {
      heartColor: "#e91e63",
      heartColorActive: "#c2185b", 
      dropdownItems: 5,
      wishlistPageUrl: "/pages/wishlist",
      enableGuestWishlist: true,
      enableWishlistSharing: false,
      maxWishlistItems: 100,
    };
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Save app settings
app.post('/api/settings', async (req, res) => {
  try {
    const settings = req.body;
    
    // In production, validate and save to database
    console.log('Saving settings:', settings);
    
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Customer wishlist data endpoint
app.post('/api/wishlist/customer', async (req, res) => {
  try {
    const { customerId, wishlistData } = req.body;
    
    // In production, save to database associated with customer
    console.log(`Saving wishlist for customer ${customerId}:`, wishlistData);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving customer wishlist:', error);
    res.status(500).json({ error: 'Failed to save wishlist' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

app.listen(PORT, () => {
  console.log(`Shopify Wishlist App backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});