import { useEffect, useState } from 'react';
import { 
  initSounds, toggleSound, toggleBackgroundMusic, 
  isSoundEnabled, isMusicPlaying, playSound 
} from '../utils/soundUtils';

export default function SoundController() {
  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  // Initialize the sound system
  useEffect(() => {
    // Initialize sound system
    if (!initialized) {
      initSounds();
      setSoundOn(isSoundEnabled());
      setMusicOn(localStorage.getItem('coffylapse_music_enabled') === 'true');
      setInitialized(true);
    }
    
    // Set up a one-time interaction handler to enable sound
    const enableAudioOnInteraction = () => {
      // Play a silent sound to unlock audio on iOS/Safari
      const enableAudio = new Audio();
      enableAudio.volume = 0.01;
      enableAudio.src = '/sounds/click.mp3';
      enableAudio.play().catch(() => {
        console.log('Initial audio play failed, this is normal');
      });
      
      // Try to play a test sound after a short delay
      setTimeout(() => {
        playSound('click');
      }, 500);
      
      // If music should be on, try to start it
      if (localStorage.getItem('coffylapse_music_enabled') === 'true') {
        toggleBackgroundMusic(true);
      }
    };
    
    // Add event listeners for interaction
    document.addEventListener('click', enableAudioOnInteraction, { once: true });
    document.addEventListener('touchstart', enableAudioOnInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', enableAudioOnInteraction);
      document.removeEventListener('touchstart', enableAudioOnInteraction);
    };
  }, [initialized]);
  
  // Update button states to reflect system state
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const soundState = isSoundEnabled();
      const musicState = isMusicPlaying();
      
      if (soundOn !== soundState) {
        setSoundOn(soundState);
      }
      
      if (musicOn !== musicState) {
        setMusicOn(musicState);
      }
    }, 1000);
    
    return () => clearInterval(checkInterval);
  }, [soundOn, musicOn]);
  
  // Toggle sound effects
  const handleToggleSound = () => {
    try {
      // Try to play a sound effect first if turning ON
      if (!soundOn) {
        // Play with direct Audio API to ensure it works
        const clickSound = new Audio('/sounds/click.mp3');
        clickSound.volume = 0.5;
        clickSound.play().catch(() => {
          console.log('Could not play sound directly');
        });
      } else {
        // If turning OFF, just play via usual system
        playSound('click');
      }
      
      // Toggle the sound state
      const newState = toggleSound();
      setSoundOn(newState);
      
      // If turning off sound, also turn off music
      if (!newState && musicOn) {
        setMusicOn(false);
      }
    } catch (err) {
      console.error('Error toggling sound:', err);
    }
  };
  
  // Toggle background music
  const handleToggleMusic = () => {
    try {
      // Play click sound
      playSound('click');
      
      // Toggle music
      const newMusicState = !musicOn;
      setMusicOn(newMusicState);
      
      // Toggle actual music playback
      toggleBackgroundMusic(newMusicState);
      
      // If turning on music but sound is off, enable sound first
      if (newMusicState && !soundOn) {
        const newSoundState = toggleSound(true);
        setSoundOn(newSoundState);
      }
    } catch (err) {
      console.error('Error toggling music:', err);
    }
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-40 flex gap-2">
      {/* Sound effects toggle */}
      <button
        onClick={handleToggleSound}
        className="w-10 h-10 bg-coffee-dark bg-opacity-70 hover:bg-opacity-90 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300"
        aria-label={soundOn ? "Mute sound effects" : "Unmute sound effects"}
      >
        {soundOn ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      {/* Background music toggle */}
      <button
        onClick={handleToggleMusic}
        className={`w-10 h-10 bg-coffee-dark bg-opacity-70 hover:bg-opacity-90 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${!soundOn ? 'opacity-50 cursor-not-allowed' : ''} ${musicOn ? 'animate-pulse' : ''}`}
        aria-label={musicOn ? "Turn off music" : "Turn on music"}
        disabled={!soundOn}
      >
        {musicOn ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            <path d="M4.5 12.5l12-12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
