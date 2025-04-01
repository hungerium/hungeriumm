/**
 * This is a simple fallback for zustand to ensure application can load
 * even if zustand dependency fails to resolve.
 */

let zustand;
let createImpl;
let persistImpl;

try {
  zustand = require('zustand');
  createImpl = zustand.create;
  
  try {
    const middleware = require('zustand/middleware');
    persistImpl = middleware.persist;
  } catch (e) {
    console.warn('Failed to load zustand/middleware, using dummy implementation');
    persistImpl = (config) => (set, get, api) => config(set, get, api);
  }
} catch (e) {
  console.warn('Failed to load zustand, using dummy implementation');
  
  // Simple dummy implementation that works enough for basic state
  createImpl = (initializer) => {
    let state = {};
    const subscribers = new Set();
    
    const setState = (partial, replace) => {
      const nextState = typeof partial === 'function' 
        ? partial(state)
        : partial;
      
      state = replace ? nextState : { ...state, ...nextState };
      
      subscribers.forEach(callback => callback(state));
    };
    
    const getState = () => state;
    
    const subscribe = (callback) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    };
    
    const api = { setState, getState, subscribe };
    state = initializer(setState, getState, api);
    
    return (selector, equalityFn) => {
      if (selector) {
        throw new Error("Selector not supported in fallback implementation");
      }
      return state;
    };
  };
  
  persistImpl = (config) => (set, get, api) => config(set, get, api);
}

export const create = createImpl;
export const persist = persistImpl;
