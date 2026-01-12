'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ApiStatusProps {
  className?: string;
}

interface HealthStatus {
  status: string;
  database: string;
  productCount: number;
  timestamp: string;
}

export default function ApiStatus({ className = '' }: ApiStatusProps) {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/health`);
        if (response.ok) {
          const data = await response.json();
          setHealth(data);
          setError(null);
        } else {
          setError('API not responding');
        }
      } catch (err) {
        setError('Connection failed');
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Checking API status...</span>
      </div>
    );
  }

  if (error || !health) {
    return (
      <div className={`flex items-center space-x-2 text-sm text-red-600 ${className}`}>
        <XCircle className="h-4 w-4" />
        <span>API Offline</span>
      </div>
    );
  }

  const isHealthy = health.status === 'ok';
  const isDatabaseConnected = health.database !== 'disconnected';
  const hasData = health.productCount > 0;

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      {isHealthy ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <AlertCircle className="h-4 w-4 text-yellow-600" />
      )}
      <span className={isHealthy ? 'text-green-600' : 'text-yellow-600'}>
        API: {health.status}
      </span>
      <span className="text-gray-400">|</span>
      <span className={isDatabaseConnected ? 'text-green-600' : 'text-red-600'}>
        DB: {health.database}
      </span>
      <span className="text-gray-400">|</span>
      <span className={hasData ? 'text-green-600' : 'text-gray-600'}>
        Products: {health.productCount}
      </span>
    </div>
  );
}