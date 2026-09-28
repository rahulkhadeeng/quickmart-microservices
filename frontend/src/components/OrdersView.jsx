import React from 'react';
import { RotateCw, ShoppingBag, MapPin, CreditCard } from 'lucide-react';

export default function OrdersView({ orders, onRefresh, onExploreStore }) {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">Order History & Tracking</h2>
          <p className="section-sub">
            Live orders fetched from <code className="code-pill">order-service (:8083)</code> for current profile
          </p>
        </div>
        <button className="btn btn-secondary" onClick={onRefresh}>
          <RotateCw size={15} /> Refresh Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
          <ShoppingBag size={54} color="var(--text-dark)" style={{ marginBottom: '1rem' }} />
          <h3>No Orders Yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders with this user profile yet.</p>
          <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={onExploreStore}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <span className="order-number">{order.orderNumber}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
                <span className={`status-badge status-${order.status}`}>{order.status}</span>
              </div>

              <table className="order-items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Unit Price</th>
                    <th>Qty</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map(item => (
                    <tr key={item.id}>
                      <td><strong>{item.productName}</strong></td>
                      <td>${Number(item.unitPrice).toFixed(2)}</td>
                      <td>x{item.quantity}</td>
                      <td style={{ textAlign: 'right' }}>${Number(item.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="order-footer">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} color="var(--primary)" /> {order.shippingAddress || 'Default Address'}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CreditCard size={14} color="var(--accent)" /> {order.paymentMethod || 'CARD'}
                  </span>
                </div>
                <div>
                  Total: <strong style={{ fontSize: '1.1rem', color: '#fff' }}>${Number(order.totalAmount).toFixed(2)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
