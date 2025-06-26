'use client';

import { useState } from 'react';

const GamesSection = () => {
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  const games = [
    {
      id: 'coffy-adventure',
      title: 'Coffy Adventure',
      image: '/images/game-previews/coffy-adventure-preview.jpg',
      purpose: 'Collect coffee beans, defeat tea enemies, and compete for the highest score.',
      path: '/coffygame/game.html',
      gradient: 'from-[#BFA181] to-[#6F4E37]',
      rewards: 'Max 5,000 COFFY/day',
      difficulty: 'Easy'
    },
    {
      id: 'flagracer-online',
      title: 'FlagRacer Online',
      image: '/images/game-previews/flagracer-preview.jpg',
      purpose: 'Race against players, earn COFFY tokens, and master unique tracks.',
      path: '/flagraceronline/index.html',
      gradient: 'from-[#A77B06] to-[#3A2A1E]',
      rewards: 'Max 5,000 COFFY/day',
      difficulty: 'Medium'
    },
    {
      id: 'coffy-in-maze',
      title: 'Coffy in Maze',
      image: '/images/game-previews/coffy-maze-preview.jpg',
      purpose: 'Solve 3D mazes, collect rewards, and avoid traps in a puzzle adventure.',
      path: '/coffyinmaze/index.html',
      gradient: 'from-[#8B6F4E] to-[#3A2A1E]',
      rewards: 'Max 5,000 COFFY/day',
      difficulty: 'Hard'
    },
    {
      id: 'coffyverse-city3d',
      title: 'Coffyverse City3D',
      image: '/images/game-previews/hungerium-preview.jpg',
      purpose: 'Rescue hostages and save the city from a robot invasion.',
      path: '/hungeriumgame/index.html',
      gradient: 'from-[#D4A017] to-[#A77B06]',
      rewards: 'Max 5,000 COFFY/day',
      difficulty: 'Expert'
    }
  ];

  const handleGameClick = (gamePath) => {
    window.open(gamePath, '_blank');
  };

  return (
    <section id="games" className="py-16 bg-gradient-to-b from-[#1A0F0A] to-[#2A1810]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] via-[#F4C430] to-[#D4A017] mb-4">
            Play to Earn Games
          </h2>
          <p className="text-lg text-[#E8D5B5] max-w-3xl mx-auto mb-6">
            Explore our exciting game collection and earn COFFY tokens while having fun
          </p>
          

        </div>

        {/* Bigger Game Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameClick(game.path)}
              className={`group relative bg-gradient-to-br ${game.gradient} rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20 backdrop-blur-sm min-h-[400px]`}
            >
              {/* Game Image */}
              <div className="relative h-48 mb-2 rounded-xl overflow-hidden">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = '/images/game-placeholder.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                
                {/* Play Button */}
                <div className="absolute top-3 left-3 z-20">
                  <button className="flex items-center gap-1 font-extrabold text-white text-base drop-shadow-lg hover:scale-105 transition-all duration-150">
                    <i className="fas fa-play text-white text-lg"></i>
                    Play Now
                  </button>
                </div>
              </div>

              {/* Game Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-200 transition-colors">
                  {game.title}
                </h3>
                
                <p className="text-sm text-white/90 leading-relaxed line-clamp-4 min-h-[4rem]">
                  {game.purpose}
                </p>
                
                {/* Rewards Info */}
                <div className="bg-black/30 rounded-lg p-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/80">Daily Rewards</span>
                    <span className="text-sm font-bold text-[#A77B06]">{game.rewards}</span>
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </div>
          ))}
        </div>

        {/* Anti-Sybil Security Information - Compact Version */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-[#3A2A1E]/30 to-[#BFA181]/20 border border-[#A77B06]/30 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <i className="fas fa-shield-alt text-[#A77B06] text-lg"></i>
              <h3 className="text-lg font-bold text-[#A77B06]">Anti-Sybil Protection</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-black/20 rounded-lg p-3 text-center border border-[#A77B06]/30">
                <i className="fas fa-wallet text-[#A77B06] text-sm mb-1"></i>
                <p className="text-[#A77B06] text-xs font-semibold">Min Balance</p>
                <p className="text-white text-sm font-bold">50K COFFY</p>
              </div>
              
              <div className="bg-black/20 rounded-lg p-3 text-center border border-[#BFA181]/30">
                <i className="fas fa-coins text-[#BFA181] text-sm mb-1"></i>
                <p className="text-[#BFA181] text-xs font-semibold">Max Claim</p>
                <p className="text-white text-sm font-bold">5K/day</p>
              </div>
              
              <div className="bg-black/20 rounded-lg p-3 text-center border border-[#D4A017]/30">
                <i className="fas fa-clock text-[#D4A017] text-sm mb-1"></i>
                <p className="text-[#D4A017] text-xs font-semibold">Cooldown</p>
                <p className="text-white text-sm font-bold">30 Min</p>
              </div>
              
              <div className="bg-black/20 rounded-lg p-3 text-center border border-[#6F4E37]/30">
                <i className="fas fa-gamepad text-[#6F4E37] text-sm mb-1"></i>
                <p className="text-[#6F4E37] text-xs font-semibold">PvP Limit</p>
                <p className="text-white text-sm font-bold">5/day</p>
              </div>
            </div>
            
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-400">
                V2 contract security against bot attacks
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-8 bg-[#2A1810]/60 backdrop-blur-sm rounded-2xl px-8 py-6 border border-[#D4A017]/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D4A017]">4</div>
              <div className="text-sm text-[#E8D5B5]">Games Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D4A017]">30,000+</div>
              <div className="text-sm text-[#E8D5B5]">Daily COFFY Pool</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D4A017]">12.8K+</div>
              <div className="text-sm text-[#E8D5B5]">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D4A017]">24/7</div>
              <div className="text-sm text-[#E8D5B5]">Always Online</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
