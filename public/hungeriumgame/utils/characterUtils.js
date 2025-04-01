/**
 * Utility functions for character management
 */
import { characters } from '../data/characters';

// Find a character by id
export const getCharacterById = (id) => {
  return characters.find(character => character.id === id) || null;
};

// Get a random character based on a role (for event-based scenarios)
export const getRandomCharacterByRole = (role) => {
  const matchingCharacters = characters.filter(character => 
    character.role === role || character.role?.includes(role)
  );
  
  if (matchingCharacters.length === 0) {
    return getRandomCharacter();
  }
  
  const randomIndex = Math.floor(Math.random() * matchingCharacters.length);
  return matchingCharacters[randomIndex];
};

// Get any random character
export const getRandomCharacter = () => {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
};

// Get character for a specific event type
export const getCharacterForEvent = (eventType) => {
  // Map event types to character roles
  const eventToRoleMap = {
    'weather': 'Weather',
    'economic': 'Marketing',
    'social': ['Marketing', 'Social Media'],
    'staff': 'Customer Service',
    'equipment': ['Equipment', 'Maintenance'],
    'supplyChain': ['Operations', 'Supply Chain'],
    'competition': 'Marketing',
    'regulations': ['Regulations', 'Government']
  };
  
  const role = eventToRoleMap[eventType];
  
  if (Array.isArray(role)) {
    // Try to find characters matching any of the roles
    for (const r of role) {
      const character = getRandomCharacterByRole(r);
      if (character) return character;
    }
    return getRandomCharacter();
  }
  else if (role) {
    return getRandomCharacterByRole(role);
  }
  
  return getRandomCharacter();
};

export default {
  getCharacterById,
  getRandomCharacterByRole,
  getRandomCharacter,
  getCharacterForEvent
};
