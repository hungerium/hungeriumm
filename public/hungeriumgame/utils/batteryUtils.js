/**
 * Battery status monitoring and power-saving optimizations
 */

const LOW_BATTERY_THRESHOLD = 0.20; // 20% battery level

// Check if we're in a low battery state
export const checkLowBatteryStatus = async () => {
  // Battery API is only available in secure contexts
  if (typeof navigator === 'undefined' || !navigator.getBattery) {
    return { isLowBattery: false, batteryLevel: null };
  }
  
  try {
    const battery = await navigator.getBattery();
    
    // Calculate if we're in a low battery state
    const isLowBattery = !battery.charging && battery.level <= LOW_BATTERY_THRESHOLD;
    
    return {
      isLowBattery,
      batteryLevel: battery.level,
      isCharging: battery.charging
    };
  } catch (error) {
    console.error("Error accessing battery status:", error);
    return { isLowBattery: false, batteryLevel: null };
  }
};

// Toggle power-saving features
export const enablePowerSaving = (enabled = true) => {
  if (typeof window === 'undefined') return;
  
  // Store user preference
  localStorage.setItem('coffylapse_power_saving', enabled ? 'true' : 'false');
  
  if (enabled) {
    // Reduce animation complexity
    document.documentElement.classList.add('power-saving');
    
    // Reduce background effects
    const backgroundEffects = document.querySelectorAll('.bg-effect, .parallax-effect');
    backgroundEffects.forEach(el => {
      el.style.display = 'none';
    });
    
    // Reduce rendering quality
    document.documentElement.style.setProperty('--rendering-quality', 'low');
  } else {
    // Restore normal features
    document.documentElement.classList.remove('power-saving');
    
    // Restore background effects
    const backgroundEffects = document.querySelectorAll('.bg-effect, .parallax-effect');
    backgroundEffects.forEach(el => {
      el.style.display = 'block';
    });
    
    // Restore rendering quality
    document.documentElement.style.setProperty('--rendering-quality', 'high');
  }
  
  return enabled;
};

// Check and apply power-saving mode based on battery status
export const initBatteryMonitoring = async () => {
  // Check user preference first
  const userPreference = localStorage.getItem('coffylapse_power_saving');
  
  if (userPreference === 'true') {
    // User has explicitly enabled power saving
    enablePowerSaving(true);
    return true;
  } else if (userPreference === 'false') {
    // User has explicitly disabled power saving
    enablePowerSaving(false);
    return false;
  }
  
  // No explicit preference, check battery status
  const { isLowBattery } = await checkLowBatteryStatus();
  
  if (isLowBattery) {
    enablePowerSaving(true);
    return true;
  }
  
  return false;
};

export default {
  checkLowBatteryStatus,
  enablePowerSaving,
  initBatteryMonitoring
};
