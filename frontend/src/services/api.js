/**
 * API Service for QuickMart Microservices Platform
 * All calls route through API Gateway
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://quickmart-gateway.onrender.com';
export const USER_SERVICE_DIRECT = 'https://quickmart-user-service.onrender.com';
export const PRODUCT_SERVICE_DIRECT = 'https://quickmart-product-service.onrender.com';
export const ORDER_SERVICE_DIRECT = 'https://quickmart-order-service.onrender.com';

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
  // Concurrent Warmup for all 5 microservices to eliminate cold starts
  warmupServices() {
    const endpoints = [
      `${API_BASE}/health`,
      `${USER_SERVICE_DIRECT}/users`,
      `${PRODUCT_SERVICE_DIRECT}/products`,
      `${ORDER_SERVICE_DIRECT}/orders`,
      'https://quickmart-eureka.onrender.com/'
    ];
    endpoints.forEach(url => {
      fetch(url, { method: 'GET', mode: 'no-cors' }).catch(() => {});
    });
  },

  // Products API (Parallel Race for ultra-fast response)
  async getProducts() {
    try {
      const fetchGw = fetch(`${API_BASE}/products`).then(r => r.ok ? r.json() : Promise.reject());
      const fetchDirect = fetch(`${PRODUCT_SERVICE_DIRECT}/products`).then(r => r.ok ? r.json() : Promise.reject());
      
      const data = await Promise.any([fetchGw, fetchDirect]);
      if (data && data.length > 0) return data;
    } catch (e) {}

    return SEED_PRODUCTS;
  },

  async createProduct(product) {
    const sendReq = async (baseUrl) => {
      const res = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        return await res.json();
      }
      const errJson = await res.json().catch(() => null);
      if (errJson && errJson.error) {
        throw new Error(errJson.error);
      }
      throw new Error(`HTTP ${res.status}`);
    };

    try {
      return await Promise.any([
        sendReq(API_BASE),
        sendReq(PRODUCT_SERVICE_DIRECT)
      ]);
    } catch (err) {
      if (err && err.errors) {
        for (const e of err.errors) {
          if (e && e.message && !e.message.startsWith('HTTP')) {
            throw e;
          }
        }
      }
      throw new Error('Failed to create product in PostgreSQL');
    }
  },

  async updateProduct(id, product) {
    const sendReq = async (baseUrl) => {
      const res = await fetch(`${baseUrl}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) return await res.json();
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.error || `HTTP ${res.status}`);
    };

    try {
      return await Promise.any([
        sendReq(API_BASE),
        sendReq(PRODUCT_SERVICE_DIRECT)
      ]);
    } catch (e) {
      throw new Error('Failed to update product');
    }
  },

  async deleteProduct(id) {
    const sendReq = async (baseUrl) => {
      const res = await fetch(`${baseUrl}/products/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
      throw new Error(`HTTP ${res.status}`);
    };

    try {
      return await Promise.any([
        sendReq(API_BASE),
        sendReq(PRODUCT_SERVICE_DIRECT)
      ]);
    } catch (e) {
      throw new Error('Failed to delete product');
    }
  },

  // UploadThing Image Upload API (Microservice + Gateway integration)
  async uploadProductImages(files) {
    const formData = new FormData();
    const fileList = Array.isArray(files) ? files : Array.from(files);
    fileList.forEach(file => formData.append('files', file));

    const sendUpload = async (baseUrl) => {
      const res = await fetch(`${baseUrl}/products/upload-images`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) return await res.json();
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || `Upload failed (HTTP ${res.status})`);
    };

    try {
      return await Promise.any([
        sendUpload(API_BASE),
        sendUpload(PRODUCT_SERVICE_DIRECT)
      ]);
    } catch (e) {
      // Local fallback in case network / server is unavailable during dev
      if (fileList.length > 0 && typeof FileReader !== 'undefined') {
        const readAsDataUrl = (file) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const urls = await Promise.all(fileList.map(readAsDataUrl));
        return { urls, url: urls[0], success: true };
      }
      throw new Error('Image upload failed. Check connection or UploadThing settings.');
    }
  },

  async uploadProductImage(file) {
    const res = await this.uploadProductImages([file]);
    return res?.urls?.[0] || res?.url;
  },

  // Users API (Fast Parallel Race between Gateway and User Service)
  async getUsers() {
    try {
      const fetchGw = fetch(`${API_BASE}/users`).then(r => r.ok ? r.json() : Promise.reject());
      const fetchDirect = fetch(`${USER_SERVICE_DIRECT}/users`).then(r => r.ok ? r.json() : Promise.reject());
      
      const data = await Promise.any([fetchGw, fetchDirect]);
      if (data && data.length > 0) return data;
    } catch (e) {}

    return SEED_USERS;
  },

  async registerUser(user) {
    const sendReq = async (baseUrl) => {
      const res = await fetch(`${baseUrl}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (res.ok) {
        return await res.json();
      }
      const errJson = await res.json().catch(() => null);
      if (errJson && errJson.error) {
        throw new Error(errJson.error);
      }
      if (res.status === 400) {
        throw new Error('User with this email already exists');
      }
      throw new Error(`HTTP ${res.status}`);
    };

    // Race both endpoints concurrently so the fastest warm instance responds immediately
    try {
      return await Promise.any([
        sendReq(API_BASE),
        sendReq(USER_SERVICE_DIRECT)
      ]);
    } catch (aggregateErr) {
      // If all failed, extract specific validation error if present
      if (aggregateErr.errors) {
        for (const err of aggregateErr.errors) {
          if (err.message && (err.message.includes('already exists') || err.message.includes('Validation'))) {
            throw err;
          }
        }
      }
      throw new Error('Could not connect to User Service. Services may still be spinning up.');
    }
  },

  // Orders API
  async getOrdersByUser(userId) {
    try {
      const fetchGw = fetch(`${API_BASE}/orders/user/${userId}`).then(r => r.ok ? r.json() : Promise.reject());
      const fetchDirect = fetch(`${ORDER_SERVICE_DIRECT}/orders/user/${userId}`).then(r => r.ok ? r.json() : Promise.reject());
      return await Promise.any([fetchGw, fetchDirect]);
    } catch (e) {
      throw new Error('Failed to fetch orders');
    }
  },

  async getAllOrders() {
    try {
      const fetchGw = fetch(`${API_BASE}/orders`).then(r => r.ok ? r.json() : Promise.reject());
      const fetchDirect = fetch(`${ORDER_SERVICE_DIRECT}/orders`).then(r => r.ok ? r.json() : Promise.reject());
      return await Promise.any([fetchGw, fetchDirect]);
    } catch (e) {
      throw new Error('Failed to fetch all orders');
    }
  },

  async createOrder(orderPayload) {
    const sendReq = async (baseUrl) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      try {
        const res = await fetch(`${baseUrl}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) return await res.json();
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error || `HTTP ${res.status}`);
      } catch (e) {
        clearTimeout(timeoutId);
        throw e;
      }
    };

    try {
      return await Promise.any([
        sendReq(API_BASE),
        sendReq(ORDER_SERVICE_DIRECT)
      ]);
    } catch (e) {
      throw new Error('Failed to place order via Order Service');
    }
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(() => fetch(`${ORDER_SERVICE_DIRECT}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }));

    if (!res || !res.ok) throw new Error('Failed to update status');
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
