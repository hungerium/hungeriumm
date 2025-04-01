import { motion } from '../utils/animationUtils';

export default function TokenTransferStatus({ status, txHash }) {
  if (!status) return null;
  
  const { success, message, isProcessing } = status;
  
  // Determine styling based on status
  const bgColor = success === true ? 'bg-green-50' :
                 success === false ? 'bg-red-50' :
                 'bg-blue-50';
  
  const textColor = success === true ? 'text-green-800' :
                   success === false ? 'text-red-800' :
                   'text-blue-800';
  
  const borderColor = success === true ? 'border-green-200' :
                     success === false ? 'border-red-200' :
                     'border-blue-200';
                     
  // Animation props for processing state
  const processingAnimation = isProcessing ? {
    animate: {
      opacity: [0.7, 1, 0.7]
    },
    transition: {
      duration: 1.5,
      repeat: Infinity
    }
  } : {};
  
  return (
    <motion.div 
      className={`p-4 rounded-lg border ${bgColor} ${textColor} ${borderColor}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      {...processingAnimation}
    >
      <div className="flex items-start">
        {/* Status icon */}
        <div className="mr-3 mt-0.5">
          {success === true && (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {success === false && (
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {success === null && (
            <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </div>
        
        {/* Message */}
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          
          {/* Transaction hash */}
          {txHash && (
            <div className="mt-2">
              <p className="text-xs font-medium mb-1">Transaction Code:</p>
              <div className="bg-white bg-opacity-50 p-2 rounded text-xs font-mono break-all">
                {txHash}
              </div>
              {txHash.startsWith("0x") && (
                <a 
                  href={`https://bscscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs mt-1 inline-block text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View on BSCScan →
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
