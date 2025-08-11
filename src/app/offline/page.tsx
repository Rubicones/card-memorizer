"use client";

import { WifiOff, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OfflinePage() {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <WifiOff className="w-24 h-24 mx-auto mb-6 text-gray-400" />
        <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
        <p className="text-gray-400 mb-8">
          It looks like you've lost your internet connection. 
          Don't worry, you can still review your previously loaded cards.
        </p>
        
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors mx-auto"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
        
        <p className="text-sm text-gray-500 mt-6">
          Tip: Enable offline mode in your browser settings for better experience
        </p>
      </div>
    </div>
  );
}
