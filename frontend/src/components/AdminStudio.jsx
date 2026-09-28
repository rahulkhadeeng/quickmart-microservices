import React, { useState } from 'react';
import { 
  Boxes, 
  Users, 
  ListChecks, 
  Plus, 
  RotateCw, 
  Pen, 
  Trash2, 
  Star 
} from 'lucide-react';

export default function AdminStudio({ 
  products, 
  users, 
  adminOrders, 
  onOpenAddProduct, 
  onEditProduct, 
  onDeleteProduct, 
  onOpenRegisterUser, 
  onRefreshOrders,
  onUpdateOrderStatus 
}) {
  const [subTab, setSubTab] = useState('products');

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <div className="admin-header">
        <div>
          <h2 className="section-title">Admin Management Studio</h2>
          <p className="section-sub">
            Directly inspect and mutate PostgreSQL microservices data
          </p>
        </div>
        <div className="admin-tab-buttons">
          <button 
            className={`btn-subtab ${subTab === 'products' ? 'active' : ''}`}
            onClick={() => setSubTab('products')}
          >
            <Boxes size={15} /> Products Catalog
          </button>
          <button 
            className={`btn-subtab ${subTab === 'users' ? 'active' : ''}`}
            onClick={() => setSubTab('users')}
          >
            <Users size={15} /> Users Management
          </button>
          <button 
            className={`btn-subtab ${subTab === 'orders' ? 'active' : ''}`}
            onClick={() => setSubTab('orders')}
          >
            <ListChecks size={15} /> Global Orders
          </button>
        </div>
      </div>

      {/* Subtab: Products */}
      {subTab === 'products' && (
        <div>
          <div className="table-toolbar">
            <h3 className="subsection-title">Product Inventory ({products.length} items)</h3>
            <button className="btn btn-primary" onClick={onOpenAddProduct}>
              <Plus size={15} /> Add New Product
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td><code>#{p.id}</code></td>
                    <td>
                      <div className="inline-flex">
                        <img 
                          src={p.imageUrl} 
                          className="table-thumb" 
                          alt={p.name}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'; }}
                        />
                        <div>
                          <strong>{p.name}</strong>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {p.description ? p.description.substring(0, 45) + '...' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><span className="code-pill">{p.category}</span></td>
                    <td><strong>${Number(p.price).toFixed(2)}</strong></td>
                    <td>
                      <span className={`stock-badge ${p.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Star size={13} fill="#FBBF24" color="#FBBF24" /> {p.rating || 4.5}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '4px 8px', marginRight: '5px' }}
                        onClick={() => onEditProduct(p)}
                      >
                        <Pen size={13} />
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '4px 8px' }}
                        onClick={() => onDeleteProduct(p.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab: Users */}
      {subTab === 'users' && (
        <div>
          <div className="table-toolbar">
            <h3 className="subsection-title">Registered Users in User Service ({users.length})</h3>
            <button className="btn btn-primary" onClick={onOpenRegisterUser}>
              <Plus size={15} /> Register User
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><code>#{u.id}</code></td>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className="code-pill">{u.role}</span></td>
                    <td>{u.phone || '-'}</td>
                    <td>{u.address || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab: Orders */}
      {subTab === 'orders' && (
        <div>
          <div className="table-toolbar">
            <h3 className="subsection-title">Global Orders Pipeline ({adminOrders.length})</h3>
            <button className="btn btn-secondary" onClick={onRefreshOrders}>
              <RotateCw size={15} /> Refresh
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {adminOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No orders registered in the system yet.
                    </td>
                  </tr>
                ) : (
                  adminOrders.map(o => (
                    <tr key={o.id}>
                      <td><strong>{o.orderNumber}</strong></td>
                      <td>
                        <div>{o.userName || 'Customer'}</div>
                        <small style={{ color: 'var(--text-muted)' }}>{o.userEmail || ''}</small>
                      </td>
                      <td><strong>${Number(o.totalAmount).toFixed(2)}</strong></td>
                      <td>{o.items ? o.items.length : 0} items</td>
                      <td><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>
                        <select 
                          className="form-control" 
                          style={{ padding: '3px 8px', fontSize: '0.75rem', width: 'auto' }}
                          value={o.status}
                          onChange={(e) => onUpdateOrderStatus(o.id, e.target.value)}
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
