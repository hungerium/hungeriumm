import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { motion } from '../utils/animationUtils';

export default function ClaimSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const { amount, txHash } = router.query;
  
  // Redirect to game after countdown
  useEffect(() => {
    if (countdown <= 0) {
      router.push('/');
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, router]);
  
  // Format hash for display
  const formatHash = (hash) => {
    if (!hash) return "";
    if (hash.length <= 14) return hash;
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 8)}`;
  };
  
  return (
    <Layout title="Claim Successful - CoffyLapse">
      <div className="min-h-screen flex items-center justify-center p-4 bg-coffee-darker coffee-dark-texture">
        <motion.div 
          className="max-w-md w-full bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <motion.div
              className="inline-block text-5xl mb-4"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20 
              }}
            >
              ✅
            </motion.div>
            <h1 className="text-2xl font-bold text-green-700">Transaction Successful!</h1>
          </div>
          
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
            <div className="text-center">
              <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold mb-2">
                {amount} COFFY
              </span>
              <p className="text-green-800">
                COFFY tokens have been successfully transferred to your wallet!
              </p>
            </div>
            
            {txHash && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-600 mb-1">Transaction Hash:</p>
                <div className="bg-white p-2 rounded text-xs font-mono break-all">
                  {txHash}
                </div>
                {txHash.startsWith("0x") && (
                  <a 
                    href={`https://bscscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    View on BSCScan
                  </a>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center">
            <Link href="/" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium">
              Return to Game
            </Link>
            
            <p className="text-sm text-gray-500 mt-4">
              Redirecting to game in {countdown} seconds...
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
