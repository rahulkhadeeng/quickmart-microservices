import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Radio, 
  Users, 
  Boxes, 
  Truck, 
  Database, 
  Activity, 
  ExternalLink 
} from 'lucide-react';
import { API_BASE } from '../services/api';

export default function ArchitectureView() {
  const [statuses, setStatuses] = useState({
    gateway: 'checking',
    eureka: 'online',
    user: 'checking',
    product: 'checking',
    order: 'checking',
    db: 'online'
  });
  const [isPinging, setIsPinging] = useState(false);

  const pingAll = async () => {
    setIsPinging(true);
    const newStatus = { ...statuses };

    // 1. Gateway & Product
    try {
      const res = await fetch(`${API_BASE}/products`);
      newStatus.gateway = res.ok ? 'online' : 'offline';
      newStatus.product = res.ok ? 'online' : 'offline';
    } catch {
      newStatus.gateway = 'offline';
      newStatus.product = 'offline';
    }

    // 2. User Service
    try {
      const res = await fetch(`${API_BASE}/users`);
      newStatus.user = res.ok ? 'online' : 'offline';
    } catch {
      newStatus.user = 'offline';
    }

    // 3. Order Service
    try {
      const res = await fetch(`${API_BASE}/orders`);
      newStatus.order = res.ok ? 'online' : 'offline';
    } catch {
      newStatus.order = 'offline';
    }

    setStatuses(newStatus);
    setIsPinging(false);
  };

  useEffect(() => {
    pingAll();
  }, []);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">Microservices Architecture & Live Health</h2>
          <p className="section-sub">
            Targeting API Gateway: <code className="code-pill">{API_BASE}</code>
          </p>
        </div>
        <button className="btn btn-primary" onClick={pingAll} disabled={isPinging}>
          <Activity size={15} className={isPinging ? 'spin-animate' : ''} />
          {isPinging ? 'Pinging Cloud Services...' : 'Ping All Services'}
        </button>
      </div>

      <div className="arch-cards-grid">
        {/* Gateway */}
        <div className="arch-card">
          <div className="arch-card-header">
            <div className="arch-icon gateway-color"><Network size={20} /></div>
            <div>
              <h4>API Gateway</h4>
              <span className="port-tag">Public Endpoint</span>
            </div>
            <span className={`arch-status-pill ${statuses.gateway}`}>
              {statuses.gateway === 'online' ? 'Online' : statuses.gateway === 'checking' ? 'Checking...' : 'Standby'}
            </span>
          </div>
          <p className="arch-desc">
            Spring Cloud Gateway Web MVC entry point. Manages reverse-proxy routing and global browser CORS policies.
          </p>
          <div className="endpoint-list">
            <code>/users/**</code>
            <code>/products/**</code>
            <code>/orders/**</code>
          </div>
        </div>

        {/* Eureka */}
        <div className="arch-card">
          <div className="arch-card-header">
            <div className="arch-icon eureka-color"><Radio size={20} /></div>
            <div>
              <h4>Eureka Registry</h4>
              <span className="port-tag">Discovery Server</span>
            </div>
            <span className="arch-status-pill online">Online</span>
          </div>
          <p className="arch-desc">
            Netflix Eureka service discovery server. Microservices dynamically register their network location.
          </p>
          <div className="endpoint-list">
            <code>eureka-server</code>
          </div>
        </div>

        {/* User Service */}
        <div className="arch-card">
          <div className="arch-card-header">
            <div className="arch-icon user-color"><Users size={20} /></div>
            <div>
              <h4>User Service</h4>
              <span className="port-tag">Port 8081 / Cloud</span>
            </div>
            <span className={`arch-status-pill ${statuses.user}`}>
              {statuses.user === 'online' ? 'Online' : statuses.user === 'checking' ? 'Checking...' : 'Standby'}
            </span>
          </div>
          <p className="arch-desc">
            Handles user profiles, role enforcement (Customer/Admin), and authentication with PostgreSQL table <code>users</code>.
          </p>
          <div className="endpoint-list">
            <code>GET /users</code>
            <code>POST /users/register</code>
          </div>
        </div>

        {/* Product Service */}
        <div className="arch-card">
          <div className="arch-card-header">
            <div className="arch-icon product-color"><Boxes size={20} /></div>
            <div>
              <h4>Product Service</h4>
              <span className="port-tag">Port 8082 / Cloud</span>
            </div>
            <span className={`arch-status-pill ${statuses.product}`}>
              {statuses.product === 'online' ? 'Online' : statuses.product === 'checking' ? 'Checking...' : 'Standby'}
            </span>
          </div>
          <p className="arch-desc">
            Product catalog management, category indexing, and real-time inventory decrement stored in table <code>products</code>.
          </p>
          <div className="endpoint-list">
            <code>GET /products</code>
            <code>POST /products</code>
          </div>
        </div>

        {/* Order Service */}
        <div className="arch-card">
          <div className="arch-card-header">
            <div className="arch-icon order-color"><Truck size={20} /></div>
            <div>
              <h4>Order Service</h4>
              <span className="port-tag">Port 8083 / Cloud</span>
            </div>
            <span className={`arch-status-pill ${statuses.order}`}>
              {statuses.order === 'online' ? 'Online' : statuses.order === 'checking' ? 'Checking...' : 'Standby'}
            </span>
          </div>
          <p className="arch-desc">
            Aggregates user & product data via Eureka load-balanced RestTemplate and manages orders lifecycle in table <code>orders</code>.
          </p>
          <div className="endpoint-list">
            <code>POST /orders</code>
            <code>GET /orders/user/:id</code>
          </div>
        </div>

        {/* PostgreSQL */}
        <div className="arch-card">
          <div className="arch-card-header">
            <div className="arch-icon db-color"><Database size={20} /></div>
            <div>
              <h4>PostgreSQL Database</h4>
              <span className="port-tag">Managed DB</span>
            </div>
            <span className="arch-status-pill online">Active</span>
          </div>
          <p className="arch-desc">
            Render PostgreSQL instance managing tables: <code>users</code>, <code>products</code>, <code>orders</code>, and <code>order_items</code>.
          </p>
          <div className="endpoint-list">
            <code>quickmart_db</code>
          </div>
        </div>
      </div>
    </div>
  );
}
