'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#1A0F0A]/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-16 h-16 border-4 border-[#D4A017] border-t-transparent rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image 
            src="/images/coffy-logo.png" 
            alt="Coffy Logo" 
            width={32} 
            height={32}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
