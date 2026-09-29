import React, { useState } from 'react';
import { 
  Send, 
  Heart, 
  Server, 
  Database, 
  Layers, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer({ onNavigate, showToast }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      if (showToast) showToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    if (showToast) showToast('🎉 Thanks for subscribing to QuickMart updates!', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="keylo-footer">
      <div className="footer-top-accent"></div>
      <div className="footer-container">
        
        {/* Main Footer Content Grid */}
        <div className="footer-grid">
          
          {/* Col 1: Brand & Identity */}
          <div className="footer-brand-col">
            <div className="footer-brand" onClick={() => onNavigate && onNavigate('storefront')}>
              <div className="footer-logo-icon">
                <BrandLogo width={30} height={22} fill="#FFFFFF" />
              </div>
              <div className="brand-text">
                <span className="brand-title" style={{ fontSize: '1.25rem', fontWeight: 800 }}>QuickMart</span>
                <span className="brand-sub" style={{ fontSize: '0.7rem' }}>Microservices Platform</span>
              </div>
            </div>
            
            <p className="footer-tagline">
              Modern distributed cloud-native e-commerce powered by Spring Boot microservices, Netflix Eureka service discovery, Spring Cloud Gateway Web MVC, and PostgreSQL database.
            </p>

            <div className="footer-social-links">
              <a 
                href="https://github.com/rahulkhadeeng/quickmart-microservices" 
                target="_blank" 
                rel="noreferrer" 
                className="footer-social-icon"
                title="GitHub Repository"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="footer-social-icon"
                title="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                className="footer-social-icon"
                title="Twitter / X"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                </svg>
              </a>
              <a 
                href="mailto:contact@quickmart.com" 
                className="footer-social-icon"
                title="Email Support"
              >
                <Send size={16} />
              </a>
            </div>

            <div className="footer-status-indicator">
              <span className="live-status-dot"></span>
              <span>All Microservices Operational</span>
            </div>
          </div>

          {/* Col 2: Platform Architecture */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">
              <Server size={16} color="var(--primary)" /> Microservices
            </h4>
            <ul className="footer-links-list">
              <li>
                <a href="#gateway" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('arch'); }}>
                  API Gateway (Port 8080)
                </a>
              </li>
              <li>
                <a href="#eureka" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('arch'); }}>
                  Eureka Discovery (Port 8761)
                </a>
              </li>
              <li>
                <a href="#users" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('arch'); }}>
                  User Service (Port 8081)
                </a>
              </li>
              <li>
                <a href="#products" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('arch'); }}>
                  Product Service (Port 8082)
                </a>
              </li>
              <li>
                <a href="#orders" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('arch'); }}>
                  Order Service (Port 8083)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation & Studio */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">
              <Layers size={16} color="var(--primary)" /> Quick Links
            </h4>
            <ul className="footer-links-list">
              <li>
                <a href="#store" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('storefront'); }}>
                  Storefront Catalog
                </a>
              </li>
              <li>
                <a href="#orders" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('orders'); }}>
                  Customer Orders Pipeline
                </a>
              </li>
              <li>
                <a href="#admin" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('admin'); }}>
                  Admin Management Studio
                </a>
              </li>
              <li>
                <a href="#arch" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('arch'); }}>
                  Live Health & Topology
                </a>
              </li>
              <li>
                <a href="https://quickmart-gateway.onrender.com" target="_blank" rel="noreferrer">
                  REST API Endpoints <ExternalLink size={12} style={{ display: 'inline', marginLeft: 3 }} />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Tech */}
          <div className="footer-newsletter-col">
            <h4 className="footer-col-title">
              <Database size={16} color="var(--primary)" /> Stay Connected
            </h4>
            <p className="footer-newsletter-desc">
              Subscribe to receive latest microservices architecture updates, product releases, and platform enhancements.
            </p>

            <form onSubmit={handleSubscribe} className="footer-subscribe-form">
              <div className="newsletter-input-group">
                <input 
                  type="email" 
                  placeholder="Enter your work email..." 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-submit-btn" title="Subscribe">
                  <Send size={16} />
                </button>
              </div>
            </form>
            
            {isSubscribed && (
              <div className="newsletter-success">
                <CheckCircle2 size={14} color="#10B981" />
                <span>You're on the list! Thank you.</span>
              </div>
            )}

            <div className="tech-badge-container">
              <span className="tech-badge">Spring Boot 3</span>
              <span className="tech-badge">PostgreSQL 18</span>
              <span className="tech-badge">Docker</span>
              <span className="tech-badge">React 19</span>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © 2026 <strong>QuickMart Microservices Platform</strong>. All rights reserved.
          </div>

          <div className="footer-legal-links">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <span className="footer-bullet">•</span>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <span className="footer-bullet">•</span>
            <a href="#security" onClick={(e) => e.preventDefault()}>Security & Compliance</a>
            <span className="footer-bullet">•</span>
            <span className="footer-built-with">
              Crafted with <Heart size={13} fill="#EC4899" color="#EC4899" style={{ margin: '0 3px' }} /> for Cloud Engineers
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
