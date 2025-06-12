'use client';

import { useEffect, useRef, useState } from 'react';

export default function FlagRacerPage() {
  const gameRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playerCount, setPlayerCount] = useState(0);
  const [gameStatus, setGameStatus] = useState('Connecting...');

  useEffect(() => {
    // For local development - simulate connection
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        setGameStatus('Connected (Local Demo)');
        setPlayerCount(Math.floor(Math.random() * 5) + 1);
        initializeGame({ environmentSeed: 123456 });
      }, 2000);
      return;
    }

    // For production - use real Socket.IO
    const { io } = require('socket.io-client');
    const socket = io('https://flagrace-1.onrender.com', {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      setGameStatus('Connected');
      console.log('Connected to game server');
      
      socket.emit('join-game', {
        name: 'Player_' + Math.floor(Math.random() * 1000),
        team: Math.random() > 0.5 ? 'police' : 'thief'
      });
    });

    socket.on('game-joined', (data) => {
      console.log('Game joined:', data);
      setPlayerCount(data.players.length);
      setGameStatus('In Game');
      initializeGame(data);
    });

    socket.on('player-joined', (player) => {
      console.log('New player joined:', player);
      setPlayerCount(prev => prev + 1);
    });

    socket.on('player-left', (playerId) => {
      console.log('Player left:', playerId);
      setPlayerCount(prev => Math.max(0, prev - 1));
    });

    socket.on('disconnect', () => {
      setGameStatus('Disconnected');
      console.log('Disconnected from server');
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const initializeGame = (gameData) => {
    setIsLoading(false);
    
    console.log('Initializing game with data:', gameData);
    
    if (gameRef.current) {
      gameRef.current.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #1e3c72, #2a5298);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: Arial, sans-serif;
        ">
          <div style="text-align: center;">
            <h1 style="margin: 0 0 20px 0; font-size: 3em;">🏁 FlagRacer Online</h1>
            <p style="margin: 0 0 10px 0; font-size: 1.2em;">Multiplayer Race Game</p>
            <p style="margin: 0 0 20px 0;">Players Online: ${playerCount}</p>
            <div style="
              padding: 20px;
              background: rgba(255,255,255,0.1);
              border-radius: 10px;
              margin: 20px 0;
            ">
              <h3>🎮 How to Play:</h3>
              <p>• Choose your team: Police 👮 or Thief 🏃</p>
              <p>• Race around the city in real-time</p>
              <p>• Capture flags and complete objectives</p>
              <p>• Work with your team to win!</p>
            </div>
            <div style="
              padding: 15px;
              background: rgba(255,255,255,0.2);
              border-radius: 8px;
              margin: 20px 0;
            ">
              <p style="margin: 0; color: #ffff00;">
                ${process.env.NODE_ENV === 'development' ? 
                  '🔧 Local Demo Mode - Deploy to Vercel for full multiplayer!' : 
                  '🚧 Game Loading... Full 3D experience coming soon!'
                }
              </p>
            </div>
            <div style="
              padding: 10px;
              background: rgba(0,255,0,0.2);
              border-radius: 5px;
              margin: 10px 0;
              border: 1px solid rgba(0,255,0,0.5);
            ">
              <p style="margin: 0; font-size: 14px;">
                ✅ Socket.IO Integration Ready<br/>
                ✅ Vercel Deployment Compatible<br/>
                ✅ Real-time Multiplayer Support
              </p>
            </div>
          </div>
        </div>
      `;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">🏁 Loading FlagRacer Online</h2>
          <p className="text-lg">{gameStatus}</p>
          <p className="text-sm opacity-75 mt-2">Players Online: {playerCount}</p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-yellow-300 mt-4">
              🔧 Local Development Mode - Simulating connection...
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Game HUD */}
      <div className="absolute top-4 left-4 z-50 bg-black/50 text-white p-3 rounded-lg">
        <div className="text-sm">
          <div>Status: <span className="text-green-400">{gameStatus}</span></div>
          <div>Players: <span className="text-blue-400">{playerCount}</span></div>
          {process.env.NODE_ENV === 'development' && (
            <div className="text-yellow-300 text-xs mt-1">Local Demo</div>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={() => window.history.back()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          ← Back to Home
        </button>
      </div>

      {/* Game Container */}
      <div 
        ref={gameRef}
        className="w-full h-full"
        style={{ cursor: 'crosshair' }}
      />
    </div>
  );
} 