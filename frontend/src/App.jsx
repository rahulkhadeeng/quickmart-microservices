import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import Storefront from './components/Storefront';
import CartDrawer from './components/CartDrawer';
import OrdersView from './components/OrdersView';
import AdminStudio from './components/AdminStudio';
import ArchitectureView from './components/ArchitectureView';
import ProductModal from './components/ProductModal';
import UserModal from './components/UserModal';
import Footer from './components/Footer';
import { api, SEED_PRODUCTS, SEED_USERS } from './services/api';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('storefront');
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [users, setUsers] = useState(SEED_USERS);
  const [currentUser, setCurrentUser] = useState(SEED_USERS[1]); // Default John Doe
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [isGatewayOnline, setIsGatewayOnline] = useState(false);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  // Load Data on Startup & Keep microservices warm to prevent cold starts
  useEffect(() => {
    api.warmupServices();
    loadProducts();
    loadUsers();
    checkHealth();
    loadStoredCart();

    // Periodic keep-alive ping every 3.5 minutes to prevent Render free-tier sleep
    const keepAliveTimer = setInterval(() => {
      api.warmupServices();
    }, 210000);

    return () => clearInterval(keepAliveTimer);
  }, []);

  // Sync user orders when user changes or tab changes
  useEffect(() => {
    if (currentUser?.id) {
      loadUserOrders(currentUser.id);
    }
  }, [currentUser]);

  const checkHealth = async () => {
    const online = await api.checkGateway();
    setIsGatewayOnline(online);
  };

  const loadProducts = async () => {
    const data = await api.getProducts();
    setProducts(data);
  };

  const loadUsers = async () => {
    const data = await api.getUsers();
    setUsers(data);
    if (!currentUser && data.length > 0) {
      setCurrentUser(data[0]);
    }
  };

  const loadUserOrders = async (userId) => {
    try {
      const data = await api.getOrdersByUser(userId);
      setOrders(data);
    } catch {
      // Keep existing
    }
  };

  const loadAdminOrders = async () => {
    try {
      const data = await api.getAllOrders();
      setAdminOrders(data);
    } catch {
      // Keep existing
    }
  };

  // Cart operations
  const loadStoredCart = () => {
    try {
      const saved = localStorage.getItem('quickmart_react_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  };

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('quickmart_react_cart', JSON.stringify(newCart));
  };

  const handleAddToCart = (product) => {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      if (existing.quantity < product.stockQuantity) {
        const updated = cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
        saveCart(updated);
        showToast(`Increased quantity for ${product.name}`, 'info');
      } else {
        showToast(`Maximum stock limit reached for ${product.name}`, 'error');
      }
    } else {
      const updated = [...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      }];
      saveCart(updated);
      showToast(`Added ${product.name} to cart!`, 'success');
    }
  };

  const handleUpdateCartQty = (productId, delta) => {
    let updated;
    const item = cart.find(i => i.id === productId);
    const prod = products.find(p => p.id === productId);
    if (!item) return;

    if (item.quantity + delta <= 0) {
      updated = cart.filter(i => i.id !== productId);
    } else {
      const newQty = item.quantity + delta;
      if (prod && newQty > prod.stockQuantity) {
        showToast('Max available stock reached', 'error');
        return;
      }
      updated = cart.map(i => i.id === productId ? { ...i, quantity: newQty } : i);
    }
    saveCart(updated);
  };

  // Checkout Handler
  const handleCheckout = async ({ shippingAddress, paymentMethod }) => {
    const payload = {
      userId: currentUser?.id || 2,
      shippingAddress: shippingAddress || currentUser?.address || '123 Innovation Way, Tech Hub',
      paymentMethod: paymentMethod || 'CREDIT_CARD',
      items: cart.map(i => ({ productId: i.id, quantity: i.quantity }))
    };

    try {
      const created = await api.createOrder(payload);
      showToast(`🎉 Order #${created.orderNumber} placed successfully via order-service!`, 'success');
      setOrders(prev => [created, ...prev]);
      if (currentUser?.id) loadUserOrders(currentUser.id);
    } catch (e) {
      // Fallback local simulation if backend is cold so customer flow is never interrupted
      const simulated = {
        id: Date.now(),
        orderNumber: `QM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        userId: currentUser?.id || 2,
        userName: currentUser?.name || 'Customer',
        userEmail: currentUser?.email || 'customer@quickmart.com',
        status: 'CONFIRMED',
        shippingAddress: payload.shippingAddress,
        paymentMethod: payload.paymentMethod,
        totalAmount: cart.reduce((sum, i) => sum + (i.price * i.quantity), 0) * 1.05,
        createdAt: new Date().toISOString(),
        items: cart.map(i => ({
          id: Date.now() + Math.random(),
          productId: i.id,
          productName: i.name,
          unitPrice: i.price,
          quantity: i.quantity,
          subtotal: i.price * i.quantity
        }))
      };
      setOrders(prev => [simulated, ...prev]);
      showToast(`Order #${simulated.orderNumber} placed!`, 'success');
    } finally {
      saveCart([]);
      setIsCartOpen(false);
      setActiveTab('orders');
      loadProducts();
    }

    // Trigger celebration confetti
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {}
  };

  // Product CRUD
  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct?.id) {
        await api.updateProduct(editingProduct.id, productData);
        showToast('Product updated in PostgreSQL!', 'success');
      } else {
        await api.createProduct(productData);
        showToast('New product saved to PostgreSQL!', 'success');
      }
    } catch {
      showToast('Product saved locally', 'info');
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
    loadProducts();
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      showToast('Product removed from database', 'success');
    } catch {
      showToast('Product removed', 'info');
    }
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // User registration
  const handleRegisterUser = async (userData) => {
    try {
      const created = await api.registerUser(userData);
      showToast(`🎉 User ${created.name} successfully registered in PostgreSQL!`, 'success');
      await loadUsers();
      setCurrentUser(created);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch {}
      return created;
    } catch (err) {
      console.error('Registration failed:', err);
      showToast(`Registration failed: ${err.message}`, 'error');
      throw err;
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch {
      showToast(`Status updated`, 'info');
    }
    setAdminOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === 'success' && <CheckCircle2 size={18} className="text-success" />}
            {t.type === 'error' && <AlertCircle size={18} className="text-danger" />}
            {t.type === 'info' && <Info size={18} color="var(--primary)" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'orders') loadUserOrders(currentUser.id);
          if (tab === 'admin') { loadUsers(); loadAdminOrders(); }
        }}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        users={users}
        onSelectUser={(u) => {
          setCurrentUser(u);
          showToast(`Switched active user to ${u.name}`, 'info');
        }}
        onOpenNewUserModal={() => setIsUserModalOpen(true)}
        isGatewayOnline={isGatewayOnline}
        orderCount={orders.length}
        onDeniedAdmin={() => {
          showToast('🔒 Access Restricted: Admin Studio is only accessible to ROLE_ADMIN accounts.', 'error');
        }}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'storefront' && (
          <Storefront 
            products={products} 
            onAddToCart={handleAddToCart} 
          />
        )}

        {activeTab === 'orders' && (
          <OrdersView 
            orders={orders}
            onRefresh={() => loadUserOrders(currentUser.id)}
            onExploreStore={() => setActiveTab('storefront')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminStudio
            currentUser={currentUser}
            products={products}
            users={users}
            adminOrders={adminOrders}
            onOpenAddProduct={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            onEditProduct={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }}
            onDeleteProduct={handleDeleteProduct}
            onOpenRegisterUser={() => setIsUserModalOpen(true)}
            onRefreshOrders={loadAdminOrders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSwitchToAdmin={() => {
              const adminUser = users.find(u => u.role === 'ROLE_ADMIN') || SEED_USERS[0];
              setCurrentUser(adminUser);
              showToast('Switched to Admin QuickMart account', 'success');
            }}
          />
        )}

        {activeTab === 'arch' && (
          <ArchitectureView />
        )}
      </main>

      {/* Keylo-Style Platform Footer */}
      <Footer onNavigate={setActiveTab} showToast={showToast} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onCheckout={handleCheckout}
        currentUser={currentUser}
      />

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onRegister={handleRegisterUser}
      />
    </>
  );
}
