import { useState } from 'react';
import Link from 'next/link';

export default function DebugLinks() {
  const [expanded, setExpanded] = useState(false);
  
  if (!expanded) {
    return (
      <button
        className="fixed left-2 bottom-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-30 hover:opacity-100 z-50"
        onClick={() => setExpanded(true)}
      >
        Debug
      </button>
    );
  }
  
  return (
    <div className="fixed left-2 bottom-2 bg-gray-800 text-white p-2 rounded z-50 text-xs">
      <div className="flex justify-between mb-2">
        <span className="font-bold">Debug Pages</span>
        <button 
          className="text-gray-400 hover:text-white ml-4"
          onClick={() => setExpanded(false)}
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        <Link href="/debug-claim" className="block px-2 py-1 hover:bg-gray-700 rounded">
          Token Claim Debug
        </Link>
        <Link href="/debug-wallet" className="block px-2 py-1 hover:bg-gray-700 rounded">
          Wallet Debug
        </Link>
        <Link href="/token-test" className="block px-2 py-1 hover:bg-gray-700 rounded">
          Token Test
        </Link>
        <Link href="/token-analysis" className="block px-2 py-1 hover:bg-gray-700 rounded">
          Token Analysis
        </Link>
        <Link href="/coffy-debug" className="block px-2 py-1 hover:bg-gray-700 rounded">
          COFFY Debug
        </Link>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-700">
        <button 
          className="w-full text-center px-2 py-1 bg-amber-600 hover:bg-amber-500 rounded"
          onClick={() => {
            // Fix common issues by running standard repairs
            try {
              // Fix coffyBalance type
              if (window.useGameStore) {
                const balance = window.useGameStore.getState().coffyBalance;
                if (typeof balance !== 'number') {
                  window.useGameStore.setState({ 
                    coffyBalance: parseFloat(balance || 0) 
                  });
                  alert("Fixed coffyBalance type issue");
                } else {
                  alert("No type issues found with coffyBalance");
                }
              } else {
                alert("GameStore not found in window");
              }
            } catch (error) {
              alert("Error fixing issues: " + error.message);
            }
          }}
        >
          Quick Fix
        </button>
      </div>
    </div>
  );
}
