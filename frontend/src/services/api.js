/**
 * API Service for QuickMart Microservices Platform
 * All calls route through API Gateway
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const SEED_PRODUCTS = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise canceling with two processors and 8 microphones for exceptional sound quality.",
    price: 399.99,
    category: "Electronics",
    stockQuantity: 25,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    rating: 4.8
  },
  {
    id: 2,
    name: "Apple Watch Ultra 2 GPS + Cellular",
    description: "The most rugged and capable Apple Watch. Designed for outdoor adventure, endurance training, and water sports.",
    price: 799.00,
    category: "Electronics",
    stockQuantity: 18,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    rating: 4.9
  },
  {
    id: 3,
    name: "Nike Air Max 270 React",
    description: "Nike's first lifestyle Air unit meets the softest, smoothest, and most resilient foam for supreme comfort.",
    price: 159.50,
    category: "Footwear",
    stockQuantity: 40,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    rating: 4.7
  },
  {
    id: 4,
    name: "Minimalist Leather Everyday Backpack",
    description: "Handcrafted full-grain leather backpack with dedicated 15-inch laptop sleeve and weather-resistant zipper.",
    price: 129.99,
    category: "Fashion",
    stockQuantity: 30,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    rating: 4.6
  },
  {
    id: 5,
    name: "Mechanical Gaming Keyboard RGB",
    description: "Custom mechanical switches, aircraft-grade aluminum frame, dynamic per-key RGB backlighting.",
    price: 89.99,
    category: "Gaming",
    stockQuantity: 50,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    rating: 4.5
  },
  {
    id: 6,
    name: "AeroPress Go Travel Coffee Maker",
    description: "Delicious coffee anywhere. Brews smooth, rich espresso-style and cold brew in about a minute.",
    price: 39.95,
    category: "Home & Kitchen",
    stockQuantity: 35,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    rating: 4.8
  },
  {
    id: 7,
    name: "Sony Alpha A7 IV Mirrorless Camera",
    description: "33MP Full-Frame Exmor R CMOS Sensor, 4K 60p Video, Real-Time Eye AF for Photo and Video.",
    price: 2498.00,
    category: "Electronics",
    stockQuantity: 10,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
    rating: 4.9
  },
  {
    id: 8,
    name: "Polarized Classic Sunglasses UV400",
    description: "Timeless aviator design with lightweight metal frame and high-definition polarized glare-free lenses.",
    price: 45.00,
    category: "Fashion",
    stockQuantity: 65,
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
    rating: 4.4
  }
];

export const SEED_USERS = [
  { id: 1, name: 'Admin QuickMart', email: 'admin@quickmart.com', role: 'ROLE_ADMIN', phone: '+91 9876543210', address: '101 Tech Park, Bangalore' },
  { id: 2, name: 'John Doe', email: 'john.doe@gmail.com', role: 'ROLE_CUSTOMER', phone: '+91 9123456780', address: '42 MG Road, Pune, India' },
  { id: 3, name: 'Alice Smith', email: 'alice.smith@gmail.com', role: 'ROLE_CUSTOMER', phone: '+91 9988776655', address: '15 Park Avenue, Mumbai, India' }
];

export const api = {
  // Products API
  async getProducts() {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        return (data && data.length > 0) ? data : SEED_PRODUCTS;
      }
    } catch (e) {}
    return SEED_PRODUCTS;
  },

  async createProduct(product) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to create product in PostgreSQL');
    return await res.json();
  },

  async updateProduct(id, product) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return await res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
    return true;
  },

  // Users API
  async getUsers() {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) return data;
      }
    } catch (e) {}
    return SEED_USERS;
  },

  async registerUser(user) {
    const res = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!res.ok) {
      let errMsg = 'Failed to register user in PostgreSQL';
      try {
        const errJson = await res.json();
        if (errJson.error) errMsg = errJson.error;
      } catch (e) {}
      throw new Error(errMsg);
    }
    return await res.json();
  },

  // Orders API
  async getOrdersByUser(userId) {
    const res = await fetch(`${API_BASE}/orders/user/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  },

  async getAllOrders() {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch all orders');
    return await res.json();
  },

  async createOrder(orderPayload) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) throw new Error('Failed to place order');
    return await res.json();
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return await res.json();
  },

  // Health check
  async checkGateway() {
    try {
      const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
      if (res.ok) return true;
    } catch (e) {}
    try {
      const res2 = await fetch(`${API_BASE}/products`, { method: 'GET' });
      return res2.ok;
    } catch (err) {
      return false;
    }
  }
};
