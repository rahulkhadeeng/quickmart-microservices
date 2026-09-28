import React, { useState } from 'react';
import { ShoppingCart, X, Lock, Loader2 } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQty, 
  onCheckout, 
  currentUser 
}) {
  const [address, setAddress] = useState(currentUser?.address || '123 Innovation Way, Tech Hub');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      await onCheckout({
        shippingAddress: address,
        paymentMethod: paymentMethod
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="cart-drawer-overlay" onClick={onClose}></div>
      <div className="cart-drawer">
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800 }}>
            <ShoppingCart size={20} color="var(--primary)" />
            <span>Shopping Cart</span>
          </div>
          <button className="close-drawer-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart-msg">
              <ShoppingCart size={48} />
              <h4>Your cart is empty</h4>
              <p>Explore our catalog and add items!</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="cart-item-img"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'; }}
                />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">${Number(item.price).toFixed(2)}</div>
                </div>
                <div className="cart-qty-ctrl">
                  <button className="qty-btn" onClick={() => onUpdateQty(item.id, -1)}>-</button>
                  <span className="qty-count">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => onUpdateQty(item.id, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-line">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-line">
              <span>Est. Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="cart-summary-line">
              <span>Shipping</span>
              <span className="text-success">FREE</span>
            </div>
            <div className="cart-summary-line total">
              <span>Total Amount</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="checkout-form">
              <label className="form-label">Shipping Address</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, City, Country"
              />

              <label className="form-label" style={{ marginTop: '0.6rem' }}>Payment Method</label>
              <select
                className="form-control"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="CREDIT_CARD">Credit / Debit Card</option>
                <option value="UPI">UPI / Instant Pay</option>
                <option value="COD">Cash on Delivery</option>
              </select>
            </div>

            <button 
              className="btn btn-primary checkout-btn"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 size={18} className="spin-animate" /> Placing Order...</>
              ) : (
                <><Lock size={16} /> Place Order via Microservices</>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
