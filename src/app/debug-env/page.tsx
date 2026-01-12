'use client';

export default function DebugEnvPage() {
  const envVars = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Environment Debug</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
        <pre className="text-sm">
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Expected Values</h2>
        <ul className="text-sm space-y-1">
          <li><strong>NEXT_PUBLIC_API_URL:</strong> https://product-explorer-backend-nestjs-production.up.railway.app/api</li>
          <li><strong>NODE_ENV:</strong> production</li>
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Test API Call</h2>
        <button 
          onClick={() => {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?page=1&limit=5`)
              .then(res => res.json())
              .then(data => console.log('API Response:', data))
              .catch(err => console.error('API Error:', err));
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test API Call (Check Console)
        </button>
      </div>
    </div>
  );
}