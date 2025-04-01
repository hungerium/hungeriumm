import { useState, useRef, useEffect } from 'react';
import { motion } from '../utils/animationUtils';
import ImageWithFallback from './ImageWithFallback';
import useSwipe from '../hooks/useSwipe';
import { isMobileDevice } from '../utils/mobileUtils';
import randomEvents from '../utils/randomEvents';
import { getFixedImagePath } from '../utils/imageDebugger';
import CharacterAvatar from './CharacterAvatar';  // Import the new component

export default function ScenarioContainer({ 
  character, 
  scenario, 
  onChoice, 
  shopLevel = 1, 
  money = 0,
  isMobile = false
}) {
  const [hoveredChoice, setHoveredChoice] = useState(null);
  const [isChoosing, setIsChoosing] = useState(false);
  const [textVisible, setTextVisible] = useState(true);
  
  // References for swipe functionality
  const choiceContainerRef = useRef(null);
  
  // Improved swipe detection - more sensitivity for mobile
  const handleSwipe = (direction) => {
    if (isChoosing) return;
    
    if (direction === 'left' && scenario?.choiceB) {
      handleSelect('choiceB');
    } else if (direction === 'right' && scenario?.choiceA) {
      handleSelect('choiceA');
    }
  };
  
  // Set up swipe handlers with enhanced sensitivity for mobile
  useSwipe(choiceContainerRef, handleSwipe, {
    threshold: isMobile ? 30 : 50, // Lower threshold for mobile
    timeout: 0, // No delay on mobile
    trackTouch: true, // Track touch events
    trackMouse: !isMobile // Only track mouse on desktop
  });
  
  // Add haptic feedback for mobile devices
  const triggerHapticFeedback = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40); // Short vibration
    }
  };
  
  // Enhanced handler for choice selection
  const handleSelect = (choice) => {
    if (isChoosing) return;
    setIsChoosing(true);
    setHoveredChoice(choice);
    
    // Provide haptic feedback on mobile
    if (isMobile) {
      triggerHapticFeedback();
    }
    
    // Quick flash animation when selecting
    setTimeout(() => {
      onChoice(choice);
      // Reset states for next question
      setTimeout(() => {
        setIsChoosing(false);
        setHoveredChoice(null);
      }, 300);
    }, 300);
  };
  
  // Text animation effect - create typing effect
  useEffect(() => {
    if (scenario) {
      setTextVisible(false);
      setTimeout(() => {
        setTextVisible(true);
      }, 300);
    }
  }, [scenario]);
  
  // Check if this is a random event
  const isRandomEvent = scenario && randomEvents.some(event => event.id === scenario.id);
  
  // Add useEffect to check image when character changes
  useEffect(() => {
    // Debug image paths in development
    if (process.env.NODE_ENV === 'development' && character?.image) {
      console.log(`Loading character image: ${character.image}`);
    }
  }, [character]);

  if (!scenario) {
    return (
      <div className="bg-coffee-dark/80 backdrop-blur-sm rounded-xl shadow-md p-4 text-center text-coffee-light">
        <p>Loading next scenario...</p>
      </div>
    );
  }
  
  return (
    <motion.div 
      className={`bg-coffee-dark/80 backdrop-blur-sm rounded-xl shadow-lg text-coffee-light overflow-hidden ${
        isRandomEvent ? 'border-2 border-amber-500' : ''
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Character and situation */}
      <div className={`relative ${
        isRandomEvent ? 'bg-gradient-to-r from-amber-800 to-amber-900' : 'bg-gradient-to-r from-coffee-dark to-coffee-darker'
      } p-3 border-b border-coffee-medium/20`}>
        
        {/* Random event indicator */}
        {isRandomEvent && (
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-bl">
            Random Event
          </div>
        )}
        
        <div className="flex items-center">
          {character && (
            <div className="mr-3">
              <CharacterAvatar 
                character={character} 
                size={40} 
                priority={true}
              />
            </div>
          )}
          
          <div>
            <motion.h3 
              className="font-medium text-coffee-light text-sm"
              key={`title-${scenario.id}`}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {scenario.title}
            </motion.h3>
            <motion.p 
              className="text-xs text-coffee-light/70"
              key={`character-${scenario.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {character?.name || "Character"}
            </motion.p>
          </div>
        </div>
      </div>
      
      {/* Scenario text with new animation */}
      <div className="p-3 border-b border-coffee-medium/20 min-h-[80px] flex items-center">
        <motion.p 
          className="text-sm"
          key={`text-${scenario.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: textVisible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {textVisible && (
            <TypeWriter text={scenario.text} speed={20} />
          )}
        </motion.p>
      </div>
      
      {/* Choices - With enhanced touch/swipe effects */}
      <motion.div 
        ref={choiceContainerRef} 
        className="p-3 flex flex-row space-x-2 scrollable-area"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 10 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        {/* Choice A */}
        <motion.div
          className={`flex-1 p-2 rounded-lg cursor-pointer relative overflow-hidden ${
            hoveredChoice === 'choiceA' 
              ? 'border-2 border-coffee-light/70 bg-coffee-medium/30' 
              : 'border border-coffee-medium/30 hover:border-coffee-light/50'
          } ${isChoosing && hoveredChoice !== 'choiceA' ? 'opacity-50' : ''}`}
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSelect('choiceA')}
        >
          {/* Animated glow effect on hover */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-coffee-light/0 via-coffee-light/20 to-coffee-light/0" 
            initial={{ x: '-100%' }}
            animate={{ 
              x: hoveredChoice === 'choiceA' ? ['100%', '100%', '-100%'] : '-100%'
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
          
          {/* Choice content */}
          <div className="text-sm font-medium flex items-center relative z-10">
            <span className={`mr-2 flex items-center justify-center w-5 h-5 rounded-full ${
              hoveredChoice === 'choiceA' ? 'bg-coffee-light/70 text-coffee-dark' : 'bg-coffee-medium/30'
            } text-xs transition-colors duration-300`}>
              {isMobile ? "←" : "A"}
            </span>
            <span>{scenario.choiceA.text}</span>
          </div>
        </motion.div>

        {/* Choice B */}
        <motion.div
          className={`flex-1 p-2 rounded-lg cursor-pointer relative overflow-hidden ${
            hoveredChoice === 'choiceB' 
              ? 'border-2 border-coffee-light/70 bg-coffee-medium/30' 
              : 'border border-coffee-medium/30 hover:border-coffee-light/50'
          } ${isChoosing && hoveredChoice !== 'choiceB' ? 'opacity-50' : ''}`}
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSelect('choiceB')}
        >
          {/* Animated glow effect on hover */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-coffee-light/0 via-coffee-light/20 to-coffee-light/0" 
            initial={{ x: '-100%' }}
            animate={{ 
              x: hoveredChoice === 'choiceB' ? ['100%', '100%', '-100%'] : '-100%'
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
          
          {/* Choice content */}
          <div className="text-sm font-medium flex items-center relative z-10">
            <span className={`mr-2 flex items-center justify-center w-5 h-5 rounded-full ${
              hoveredChoice === 'choiceB' ? 'bg-coffee-light/70 text-coffee-dark' : 'bg-coffee-medium/30'
            } text-xs transition-colors duration-300`}>
              {isMobile ? "→" : "B"}
            </span>
            <span>{scenario.choiceB.text}</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Typewriter effect component
function TypeWriter({ text, speed = 30 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setIndex(0);
  }, [text]);
  
  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text.charAt(index));
        setIndex(index + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);
  
  return (
    <>
      {displayedText}
      {index < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </>
  );
}
