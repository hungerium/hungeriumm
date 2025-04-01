/**
 * Sound management utilities for the game
 */

// Sound configuration with paths and default settings
const SOUNDS = {
  click: {
    src: '/sounds/click.mp3',
    volume: 0.5,
    preload: true
  },
  gameOver: {
    src: '/sounds/game-over.mp3',
    volume: 0.7,
    preload: false
  },
  background: {
    src: '/sounds/background-music.mp3',
    volume: 0.3,
    loop: true,
    preload: true
  }
};

// Cache for loaded sounds
let soundCache = {};
let musicPlaying = false;
let soundEnabled = true;
let audioContext = null;

// Initialize Web Audio API context
const getAudioContext = () => {
  if (audioContext) return audioContext;
  
  if (typeof window !== 'undefined' && 
      (window.AudioContext || window.webkitAudioContext)) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      return audioContext;
    } catch (e) {
      console.warn('Could not create AudioContext:', e);
    }
  }
  return null;
};

// Create a beep sound using Web Audio API
const createBeepSound = (freq = 800, duration = 100, vol = 0.2) => {
  const ctx = getAudioContext();
  if (!ctx) return null;
  
  return {
    play: () => {
      try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = freq;
        gainNode.gain.value = vol;
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration/1000);
        
        return new Promise(resolve => {
          setTimeout(resolve, duration);
        });
      } catch (e) {
        console.warn('Error creating beep sound:', e);
        return Promise.resolve();
      }
    },
    isBeep: true
  };
};

// Create ambient background sound using Web Audio API
const createAmbientSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return null;
  
  let oscillators = [];
  let isPlaying = false;
  
  return {
    play: () => {
      if (isPlaying) return Promise.resolve();
      
      try {
        // Base drone
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = 65;
        
        const gainNode1 = ctx.createGain();
        gainNode1.gain.value = 0.1;
        
        osc1.connect(gainNode1);
        gainNode1.connect(ctx.destination);
        
        // Higher soft pad
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 196;
        osc2.detune.value = 5;
        
        const gainNode2 = ctx.createGain();
        gainNode2.gain.value = 0.03;
        
        osc2.connect(gainNode2);
        gainNode2.connect(ctx.destination);
        
        // Start sounds
        osc1.start();
        osc2.start();
        
        oscillators = [osc1, osc2];
        isPlaying = true;
        
        return Promise.resolve();
      } catch (e) {
        console.warn('Error creating ambient sound:', e);
        return Promise.resolve();
      }
    },
    stop: () => {
      if (!isPlaying) return;
      
      oscillators.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Ignore errors on stop
        }
      });
      
      oscillators = [];
      isPlaying = false;
    },
    isBeep: false,
    isAmbient: true
  };
};

// Initialize the audio system
export const initSounds = () => {
  if (typeof window === 'undefined') return;
  
  console.log('Initializing sound system...');
  
  // Get user preference for sound from localStorage
  const savedSoundPreference = localStorage.getItem('coffylapse_sound_enabled');
  if (savedSoundPreference !== null) {
    soundEnabled = savedSoundPreference === 'true';
  }
  
  // Preload important sounds
  loadSound('click');
  loadSound('gameOver');
  
  // Check if background music should be playing
  const musicEnabled = localStorage.getItem('coffylapse_music_enabled') === 'true';
  if (musicEnabled && soundEnabled) {
    // Delay music start until after user interaction
    document.addEventListener('click', () => {
      if (soundEnabled && !musicPlaying) {
        toggleBackgroundMusic(true);
      }
    }, { once: true });
  }
  
  // Try to resume audio context if it exists and is suspended
  if (audioContext && audioContext.state === 'suspended') {
    const resumeOnInteraction = () => {
      audioContext.resume().then(() => {
        console.log('AudioContext resumed successfully');
      }).catch(error => {
        console.warn('Failed to resume AudioContext:', error);
      });
      
      document.removeEventListener('click', resumeOnInteraction);
      document.removeEventListener('touchstart', resumeOnInteraction);
      document.removeEventListener('keydown', resumeOnInteraction);
    };
    
    document.addEventListener('click', resumeOnInteraction, { once: true });
    document.addEventListener('touchstart', resumeOnInteraction, { once: true });
    document.addEventListener('keydown', resumeOnInteraction, { once: true });
  }
};

// Load a sound into cache
const loadSound = (soundId) => {
  if (typeof window === 'undefined' || !SOUNDS[soundId]) return null;
  
  // If already in cache, return it
  if (soundCache[soundId]) return soundCache[soundId];
  
  const config = SOUNDS[soundId];
  
  try {
    // First try the actual sound file
    const audio = new Audio();
    
    // For the background music, also create a fallback
    if (soundId === 'background') {
      const ambientFallback = createAmbientSound();
      
      // Set up the audio
      audio.src = config.src;
      audio.volume = config.volume;
      audio.loop = !!config.loop;
      
      // Handle loading error
      audio.onerror = () => {
        console.warn(`Could not load sound ${soundId}, using fallback`);
        soundCache[soundId] = ambientFallback;
      };
      
      // Store in cache
      soundCache[soundId] = audio;
      
      // Start loading
      audio.load();
      
      return audio;
    }
    
    // For non-background sounds, create a fallback based on type
    let fallback;
    if (soundId === 'click') {
      fallback = createBeepSound(800, 100, 0.2);
    } else if (soundId === 'gameOver') {
      fallback = createBeepSound(300, 500, 0.3);
    } else {
      fallback = createBeepSound(440, 200, 0.2);
    }
    
    // Set up the audio
    audio.src = config.src;
    audio.volume = config.volume;
    audio.loop = !!config.loop;
    
    // Handle loading error
    audio.onerror = () => {
      console.warn(`Could not load sound ${soundId}, using fallback`);
      soundCache[soundId] = fallback;
    };
    
    // Store in cache
    soundCache[soundId] = audio;
    
    // Start loading
    audio.load();
    
    return audio;
  } catch (error) {
    console.error(`Failed to load sound: ${soundId}`, error);
    
    // Create fallback sound
    if (soundId === 'background') {
      soundCache[soundId] = createAmbientSound();
    } else if (soundId === 'click') {
      soundCache[soundId] = createBeepSound(800, 100, 0.2);
    } else if (soundId === 'gameOver') {
      soundCache[soundId] = createBeepSound(300, 500, 0.3);
    } else {
      soundCache[soundId] = createBeepSound(440, 200, 0.2);
    }
    
    return soundCache[soundId];
  }
};

// Play a sound effect
export const playSound = (soundId) => {
  // Skip if sound is disabled or we're on the server
  if (typeof window === 'undefined' || !soundEnabled) return;
  
  // Make sure the sound exists
  if (!soundCache[soundId]) {
    loadSound(soundId);
  }
  
  // Get the sound from cache
  const sound = soundCache[soundId];
  if (!sound) return;
  
  try {
    if (sound instanceof HTMLAudioElement) {
      // Reset playback position for effect sounds
      if (soundId !== 'background') {
        sound.currentTime = 0;
      }
      
      // Play with error handling
      sound.play().catch(error => {
        console.warn(`Could not play sound ${soundId}:`, error);
        
        // Try to use a Web Audio API fallback
        if (soundId === 'click') {
          createBeepSound(800, 100, 0.2).play();
        } else if (soundId === 'gameOver') {
          createBeepSound(300, 500, 0.3).play();
        }
      });
    } 
    // Handle our fallback sound objects
    else if (sound.play && typeof sound.play === 'function') {
      sound.play().catch(err => {
        console.warn(`Fallback sound error for ${soundId}:`, err);
      });
    }
  } catch (error) {
    console.error(`Error playing sound ${soundId}:`, error);
  }
};

// Toggle background music on/off
export const toggleBackgroundMusic = (forceState) => {
  const newState = forceState !== undefined ? forceState : !musicPlaying;
  
  try {
    if (newState) {
      // Start playing music
      if (!soundCache['background']) {
        loadSound('background');
      }
      
      const bgMusic = soundCache['background'];
      
      if (soundEnabled && bgMusic) {
        if (bgMusic instanceof HTMLAudioElement) {
          bgMusic.volume = SOUNDS.background.volume;
          bgMusic.loop = true;
          
          // Try to play, handle errors
          bgMusic.play().catch(error => {
            console.warn('Failed to play background music, trying alternative:', error);
            
            // Try with Web Audio API
            const ambient = createAmbientSound();
            if (ambient) {
              ambient.play();
              soundCache['background'] = ambient;
            }
          });
        } 
        // Handle fallback sound objects
        else if (bgMusic.play && typeof bgMusic.play === 'function') {
          bgMusic.play();
        }
      }
      
      musicPlaying = true;
      localStorage.setItem('coffylapse_music_enabled', 'true');
    } else {
      // Stop music
      if (soundCache['background']) {
        const bgMusic = soundCache['background'];
        
        if (bgMusic instanceof HTMLAudioElement) {
          bgMusic.pause();
          bgMusic.currentTime = 0;
        } 
        // Handle fallback ambient sound
        else if (bgMusic.stop && typeof bgMusic.stop === 'function') {
          bgMusic.stop();
        }
      }
      
      musicPlaying = false;
      localStorage.setItem('coffylapse_music_enabled', 'false');
    }
  } catch (error) {
    console.error('Error toggling background music:', error);
  }
  
  return musicPlaying;
};

// Toggle all sounds on/off
export const toggleSound = (forceState) => {
  soundEnabled = forceState !== undefined ? forceState : !soundEnabled;
  
  // Save preference
  localStorage.setItem('coffylapse_sound_enabled', soundEnabled.toString());
  
  // If turning off sound, stop background music
  if (!soundEnabled) {
    toggleBackgroundMusic(false);
  }
  
  // If turning on sound and music was enabled, restart it
  else if (soundEnabled && localStorage.getItem('coffylapse_music_enabled') === 'true') {
    toggleBackgroundMusic(true);
  }
  
  return soundEnabled;
};

// Get current sound states
export const isSoundEnabled = () => soundEnabled;
export const isMusicPlaying = () => musicPlaying;

// Cleanup all audio resources
export const cleanupSounds = () => {
  Object.values(soundCache).forEach(sound => {
    try {
      if (sound instanceof HTMLAudioElement) {
        sound.pause();
        sound.src = '';
      } else if (sound.stop && typeof sound.stop === 'function') {
        sound.stop();
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  });
  
  soundCache = {};
  musicPlaying = false;
};

export default {
  initSounds,
  playSound,
  toggleBackgroundMusic,
  toggleSound,
  isSoundEnabled,
  isMusicPlaying,
  cleanupSounds
};
