import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, X } from 'lucide-react';

export default function ServerWarmupBanner({ isGatewayOnline }) {
  const [isVisible, setIsVisible] = useState(true);
  const [hasWokenUp, setHasWokenUp] = useState(false);

  useEffect(() => {
    if (isGatewayOnline) {
      setHasWokenUp(true);
      // Auto-dismiss 4 seconds after waking up
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isGatewayOnline]);

  if (!isVisible) return null;

  return (
    <div className={`server-warmup-card ${hasWokenUp ? 'online' : 'waking'}`}>
      <div className="warmup-icon-wrapper">
        {hasWokenUp ? (
          <CheckCircle2 size={22} color="#10B981" />
        ) : (
          <Loader2 size={22} className="spin-animate" color="#6366F1" />
        )}
      </div>

      <div className="warmup-content">
        <h4 className="warmup-title">
          {hasWokenUp ? 'Server is awake & online!' : 'Waking up the server...'}
        </h4>
        <p className="warmup-desc">
          {hasWokenUp
            ? 'All microservices are connected to PostgreSQL database.'
            : 'This is a free-tier demo! The first load can take up to a minute.'}
        </p>
      </div>

      <button 
        className="warmup-close-btn" 
        onClick={() => setIsVisible(false)}
        title="Dismiss notice"
      >
        <X size={15} />
      </button>
    </div>
  );
}
