'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';

// Constants
const COFFEE_BEAN_IMAGE = '/images/coffee-beans-pattern.png';
const FALLBACK_IMAGE = '/images/game-placeholder.jpg';

const DIFFICULTY_COLORS = {
  Easy: 'text-green-400 bg-green-400/10',
  Medium: 'text-yellow-400 bg-yellow-400/10',
  Hard: 'text-orange-400 bg-orange-400/10',
  Expert: 'text-red-400 bg-red-400/10',
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
  hover: {
    scale: 1.05,
    y: -8,
    boxShadow: '0 20px 40px rgba(212, 160, 23, 0.2)',
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 300,
    },
  },
};

const GamesSection = ({ id }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [isLoading, setIsLoading] = useState({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Game data - could be moved to external config or API
  const games = useMemo(() => [
    {
      id: 'coffy-adventure',
      title: 'Coffy Adventure',
      image: '/images/game-previews/coffy-adventure-preview.jpg',
      purpose: 'Embark on an epic journey collecting coffee beans while battling tea enemies in this action-packed adventure. Master combat mechanics, unlock new abilities, and compete for global leaderboard dominance. Discover hidden secrets, power-ups, and face unique bosses as you progress through increasingly challenging levels.',
      path: '/coffygame/game.html',
      gradient: 'from-[#BFA181] to-[#6F4E37]',
      rewards: 'Max 5,000 COFFY/day',
      difficulty: 'Easy',
      category: 'Action'
    },
    {
      id: 'flagracer-online',
      title: 'FlagRacer Online',
      image: '/images/game-previews/flagracer-preview.jpg',
      purpose: 'Experience high-speed multiplayer racing across dynamically generated tracks. Compete in real-time tournaments, master precision driving, and customize your vehicles. Earn COFFY tokens by winning races, completing daily challenges, and participating in seasonal events. Climb the ranks and unlock exclusive rewards.',
      path: '/flagraceronline/index.html',
      gradient: 'from-[#A77B06] to-[#3A2A1E]',
      rewards: 'Max 5,000 COFFY/day',
      difficulty: 'Medium',
      category: 'Racing'
    },
    {
      id: 'coffy-in-maze',
      title: 'Coffy in Maze',
      image: '/images/game-previews/coffy-maze-preview.jpg',
      purpose: 'Navigate through complex 3D mazes filled with challenging puzzles, hidden traps, and collectible rewards. Use strategic thinking and quick reflexes to unlock new areas, discover shortcuts, and maximize your COFFY earnings. Each maze offers unique layouts and increasing difficulty for endless replayability.',
      path: '/coffyinmaze/index.html',
      gradient: 'from-[#8B6F4E] to-[#3A2A1E]',
      rewards: 'Max 5,000 COFFY/day',
      difficulty: 'Hard',
      category: 'Puzzle'
    },
    {
      id: 'coffyverse-city3d',
      title: 'Coffyverse City3D',
      image: '/images/game-previews/hungerium-preview.jpg',
      purpose: 'Lead tactical rescue missions in a futuristic city under siege. Deploy advanced strategies to save hostages, defend against the robot invasion, and restore peace. Upgrade your equipment, unlock new characters, and collaborate with other players in co-op missions for greater rewards.',
      path: '/hungeriumgame/index.html',
      gradient: 'from-[#D4A017] to-[#A77B06]',
      rewards: 'Max 5,000 COFFY/day',
      difficulty: 'Expert',
      category: 'Strategy'
    }
  ], []);

  const securityMetrics = useMemo(() => [
    {
      icon: 'fas fa-wallet',
      label: 'Min Balance',
      value: '50K COFFY',
      color: 'text-[#A77B06] border-[#A77B06]/30',
      description: 'Minimum wallet balance required'
    },
    {
      icon: 'fas fa-coins',
      label: 'Max Claim',
      value: '5K/day',
      color: 'text-[#BFA181] border-[#BFA181]/30',
      description: 'Daily earning limit per game'
    },
    {
      icon: 'fas fa-clock',
      label: 'Cooldown',
      value: '30 Min',
      color: 'text-[#D4A017] border-[#D4A017]/30',
      description: 'Time between reward claims'
    },
    {
      icon: 'fas fa-hourglass-half',
      label: 'Min. Play Time',
      value: '2 minutes',
      color: 'text-[#6F4E37] border-[#6F4E37]/30',
      description: 'Minimum session duration'
    },
    {
      icon: 'fas fa-user-check',
      label: 'Wallet Age',
      value: '7 days',
      color: 'text-[#F4C430] border-[#F4C430]/30',
      description: 'Wallet must be at least 7 days old (human proof required)'
    }
  ], []);

  // Filter games by difficulty
  const filteredGames = useMemo(() => {
    if (selectedDifficulty === 'All') return games;
    return games.filter(game => game.difficulty === selectedDifficulty);
  }, [games, selectedDifficulty]);

  const difficulties = useMemo(() => ['All', 'Easy', 'Medium', 'Hard', 'Expert'], []);

  // Handlers
  const handleGameClick = useCallback(async (gameId, gamePath) => {
    setIsLoading(prev => ({ ...prev, [gameId]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate loading
      window.open(gamePath, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open game:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, [gameId]: false }));
    }
  }, []);

  const handleImageError = useCallback((event) => {
    event.target.src = FALLBACK_IMAGE;
  }, []);

  return (
    <section id={id || "games"} className="py-20 bg-gradient-to-b from-[#1A0F0A] via-[#2A1810] to-[#1A0F0A] scroll-mt-24" aria-label="Play to Earn Games Section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] via-[#F4C430] to-[#D4A017] mb-4 tracking-tight">
            Play to Earn Games
          </h2>
          <p className="text-lg text-[#E8D5B5] max-w-3xl mx-auto mb-6 leading-relaxed">
            Dive into our immersive gaming ecosystem and earn COFFY tokens while experiencing 
            cutting-edge gameplay mechanics
          </p>
          {/* Difficulty Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                  selectedDifficulty === difficulty
                    ? 'bg-gradient-to-r from-[#D4A017] to-[#A77B06] text-white shadow-lg scale-105'
                    : 'bg-[#3A2A1E] text-[#BFA181] hover:bg-[#4A3A2E] border border-[#BFA181]/30'
                }`}
                aria-pressed={selectedDifficulty === difficulty}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Anti-Sybil Security Section (compact, animated cards) */}
        <motion.div 
          className="max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-gradient-to-br from-[#3A2A1E]/60 via-[#2A1F15]/80 to-[#3A2A1E]/60 border border-[#A77B06]/30 rounded-lg p-2 md:p-3 shadow-md backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-1 bg-[#A77B06]/20 rounded-full">
                <i className="fas fa-shield-alt text-[#A77B06] text-lg" />
              </div>
              <h3 className="text-base font-bold text-[#A77B06] whitespace-nowrap">Anti-Sybil Protection</h3>
              <span className="text-xs text-[#E8D5B5]/80 ml-2 whitespace-nowrap">Advanced security measures ensure fair play</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {securityMetrics.map((metric, index) => (
                <motion.article
                  key={metric.label + '-' + index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  className={`group relative bg-gradient-to-br from-[#2A1F15] to-[#3A2A1E] border border-[#BFA181]/20 rounded-xl overflow-hidden shadow-md min-h-[120px] flex flex-col items-center justify-center p-2 transition-all duration-300 ${metric.color}`}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {/* Particle Effect on Hover (like game cards) */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-6 h-6 relative overflow-hidden rounded-full">
                      {isClient && [...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-0.5 h-0.5 bg-gradient-to-br from-[#D4A017] to-[#A77B06] rounded-full animate-bounce"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${1 + Math.random() * 2}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="p-1 bg-current/10 rounded-lg mb-1">
                      <i className={`${metric.icon} text-base`} />
                    </div>
                    <p className="font-semibold text-xs mb-0.5 opacity-80">{metric.label}</p>
                    {/* Make Min. Play Time value gold like others */}
                    {metric.label === 'Min. Play Time' ? (
                      <p className="text-[#F4C430] text-sm font-bold mb-0.5">{metric.value}</p>
                    ) : (
                      <p className="text-white text-sm font-bold mb-0.5">{metric.value}</p>
                    )}
                    <p className="text-[10px] text-gray-400 leading-tight text-center">{metric.description}</p>
                  </div>
                </motion.article>
              ))}
            </div>
            <div className="mt-2 text-center">
              <div className="inline-flex items-center gap-1 bg-black/20 rounded-full px-2 py-1 border border-[#D4A017]/20">
                <i className="fas fa-info-circle text-[#D4A017] text-xs" />
                <span className="text-xs text-gray-300">
                  V2 modular smart contract with advanced sybil protection & 7-day wallet age verification
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Game Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredGames.map((game) => (
            <motion.article
              key={game.id}
              variants={cardVariants}
              whileHover="hover"
              className="group relative bg-gradient-to-br from-[#3A2A1E] to-[#2A1F15] border border-[#BFA181]/20 rounded-2xl overflow-hidden cursor-pointer shadow-xl backdrop-blur-sm min-h-[480px] flex flex-col"
              onClick={() => handleGameClick(game.id, game.path)}
              role="button"
              tabIndex={0}
              aria-label={`Play ${game.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleGameClick(game.id, game.path);
                }
              }}
            >
              {/* Game Image Container */}
              <div className="relative" style={{ aspectRatio: '16/12' }}>
                <img
                  src={game.image}
                  alt={`${game.title} game preview`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={handleImageError}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Particle Effect on Hover */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 relative overflow-hidden rounded-full">
                    {/* Simple CSS coffee particles */}
                    {isClient && [...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-gradient-to-br from-[#D4A017] to-[#A77B06] rounded-full animate-bounce"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${1 + Math.random() * 2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Play Button */}
                <div className="absolute top-4 left-4">
                  <motion.button 
                    className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 text-white font-bold text-sm hover:bg-black/60 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading[game.id]}
                  >
                    {isLoading[game.id] ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <i className="fas fa-play" />
                    )}
                    {isLoading[game.id] ? 'Loading...' : 'Play Now'}
                  </motion.button>
                </div>
                
                {/* Difficulty Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${DIFFICULTY_COLORS[game.difficulty]}`}>
                    {game.difficulty}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-3 flex-1 flex flex-col min-h-[140px]">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#F4C430] transition-colors line-clamp-1">
                    {game.title}
                  </h3>
                  
                  {game.category && (
                    <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium text-[#BFA181] bg-[#BFA181]/10 rounded mb-2">
                      {game.category}
                    </span>
                  )}
                  
                  <p className="text-xs text-[#E8D5B5]/90 leading-snug line-clamp-4 mb-1 min-h-[3.5em]">
                    {game.purpose}
                  </p>
                </div>
                
                {/* Rewards Section */}
                <div className="bg-gradient-to-r from-black/20 to-black/10 rounded-lg p-2 border border-[#A77B06]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-coins text-[#A77B06]" />
                      <span className="text-[10px] text-[#E8D5B5]/80 font-medium">Daily Rewards</span>
                    </div>
                    <span className="text-xs font-bold text-[#F4C430]">{game.rewards}</span>
                  </div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D4A017]/5 to-[#A77B06]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GamesSection;