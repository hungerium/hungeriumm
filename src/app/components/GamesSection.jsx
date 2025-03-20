'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

const GamesSection = () => {
  const games = [
    {
      id: 'coffy-adventure',
      title: 'Coffy Adventure',
      description: 'Coffy ile engelleri aşıp kahve çekirdeklerini topla!',
      link: '/games/coffy',  
      image: '/images/coffy-game.png',
      color: 'from-amber-600 to-amber-800'
    },
    {
      id: 'coffy-adventure-3d',
      title: 'Coffy Adventure 3D',
      description: '3 boyutlu dünyada kahve çekirdeklerini topla ve maceraya atıl!',
      link: '/games/coffy-3d',  
      image: '/images/coffy-3d-game.png',
      color: 'from-amber-600 to-amber-800',
      beta: true
    },
    {
      id: 'bee-adventure',
      title: 'Bee Adventure',
      description: 'Arı ile bal topla ve çiçekleri tozlaştır!',
      link: '/games/hungerium',  
      image: '/images/bee-game.png',
      color: 'from-blue-600 to-blue-800'
    }
  ];

  return (
    <section id="games" className="py-16 bg-[#1A0F0A]/90">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] to-[#A77B06]">Oyna ve Kazan</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <motion.div
                key={game.id}
                className="bg-[#3A2A1E] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-[#D4A017]/20 relative group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {game.beta && (
                  <div className="absolute top-2 right-2 bg-[#D4A017] text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                    BETA
                  </div>
                )}
                
                <div className={`relative h-60 w-full bg-gradient-to-b ${game.color} flex items-center justify-center`}>
                  {game.image ? (
                    <Image 
                      src={game.image} 
                      alt={game.title}
                      fill
                      style={{objectFit: 'cover'}}
                      className="opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  ) : (
                    <h3 className="text-2xl font-bold text-white text-center p-4">{game.title}</h3>
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-2xl font-bold text-white text-center p-4">{game.title}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-[#E8D5B5] mb-4">{game.description}</p>
                  <Link href={game.link}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#D4A017] hover:bg-[#A77B06] text-white py-2 px-6 rounded-full font-medium transition-colors duration-300"
                    >
                      Şimdi Oyna
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GamesSection;
