class AudioManager {
    constructor() {
        // Audio elements - only using local sound files
        this.sounds = {
            engine: null,
            siren: null,
            collision: null,
            crash: null,
            gunshot: null,
            missile: null,
            backgroundMusic: null,
            atmosphere: {
                clear: null,
                rain: null,
                snow: null
            }
        };
        
        // Audio state
        this.isInitialized = false;
        this.userInteracted = false; // Track user interaction status
        this.pendingSounds = []; // Sounds that need to be played once interaction happens
        this.playing = {
            engine: false,
            siren: false,
            backgroundMusic: false,
            atmosphere: false
        };
        
        // Audio notifications
        this.notificationElement = null;
        this.setupNotifications();
        
        // Initialize audio on page load
        this.initialize();
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => this.cleanup());
        
        // User interaction to enable audio (browser autoplay policy)
        const interactionHandler = () => {
            this.userInteracted = true;
            this.resumeAudio();
            
            // Play any pending sounds that were requested before interaction
            this.playPendingSounds();
        };
        
        document.addEventListener('click', interactionHandler, { once: true });
        document.addEventListener('touchstart', interactionHandler, { once: true });
        document.addEventListener('keydown', interactionHandler, { once: true });
        
        // Check if any UI click targets exist (for mobile)
        setTimeout(() => {
            const mobileButtons = document.querySelectorAll('.mobile-btn, #mobile-joystick');
            if (mobileButtons.length > 0) {
                mobileButtons.forEach(btn => {
                    btn.addEventListener('touchstart', interactionHandler, { once: true });
                });
            }
        }, 2000);
    }
    
    initialize() {
        if (this.isInitialized) return;
        
        try {
            // Preload audio assets - no external libraries
            this.preloadAudioAssets();
            
            this.isInitialized = true;
            console.log("Audio system initialized - using only local sound files");
            
            return true;
        } catch (error) {
            console.error("Failed to initialize audio:", error);
            this.showNotification("Audio initialization failed", "error");
            return false;
        }
    }
    
    preloadAudioAssets() {
        // Create engine sound
        this.sounds.engine = document.createElement('audio');
        this.sounds.engine.src = 'assets/sounds/engine.mp3';
        this.sounds.engine.loop = true;
        this.sounds.engine.volume = 0.0;
        this.sounds.engine.load();
        
        // Create siren sound
        this.sounds.siren = document.createElement('audio');
        this.sounds.siren.src = 'assets/sounds/siren.mp3';
        this.sounds.siren.loop = true;
        this.sounds.siren.volume = 0.0;
        this.sounds.siren.load();
        
        // Create atmosphere sounds for different weather
        // Clear weather ambient sound
        this.sounds.atmosphere.clear = document.createElement('audio');
        this.sounds.atmosphere.clear.src = 'assets/sounds/ambient_city.mp3';
        this.sounds.atmosphere.clear.loop = true;
        this.sounds.atmosphere.clear.volume = 0.25;
        this.sounds.atmosphere.clear.load();
        
        // Rain sound
        this.sounds.atmosphere.rain = document.createElement('audio');
        this.sounds.atmosphere.rain.src = 'assets/sounds/rain.mp3';
        this.sounds.atmosphere.rain.loop = true;
        this.sounds.atmosphere.rain.volume = 0.3;
        this.sounds.atmosphere.rain.load();
        
        // Snow/wind sound
        this.sounds.atmosphere.snow = document.createElement('audio');
        this.sounds.atmosphere.snow.src = 'assets/sounds/wind.mp3';
        this.sounds.atmosphere.snow.loop = true;
        this.sounds.atmosphere.snow.volume = 0.2;
        this.sounds.atmosphere.snow.load();
        
        // Gunshot sound
        this.sounds.gunshot = document.createElement('audio');
        this.sounds.gunshot.src = 'assets/sounds/gunshot.mp3';
        this.sounds.gunshot.volume = 0.5;
        this.sounds.gunshot.load();
        
        // Missile launch sound
        this.sounds.missile = document.createElement('audio');
        this.sounds.missile.src = 'assets/sounds/missile.mp3';
        this.sounds.missile.volume = 0.9;
        this.sounds.missile.load();
        
        // Background music
        this.sounds.backgroundMusic = document.createElement('audio');
        this.sounds.backgroundMusic.src = 'assets/sounds/background_music.mp3';
        this.sounds.backgroundMusic.loop = true;
        this.sounds.backgroundMusic.volume = 0.7;
        this.sounds.backgroundMusic.load();
        
        // Add loading error handlers to all sounds
        for (const key in this.sounds) {
            if (this.sounds[key] instanceof HTMLAudioElement) {
                this.sounds[key].onerror = () => {
                    console.error(`Failed to load sound: ${key}`);
                    this.showNotification(`Failed to load sound: ${key}`, "error");
                };
            } else if (key === 'atmosphere') {
                for (const weatherType in this.sounds.atmosphere) {
                    this.sounds.atmosphere[weatherType].onerror = () => {
                        console.error(`Failed to load sound: atmosphere.${weatherType}`);
                        this.showNotification(`Failed to load sound: atmosphere.${weatherType}`, "error");
                    };
                }
            }
        }
    }
    
    resumeAudio() {
        // Resume any suspended audio elements
        try {
            for (const type in this.sounds) {
                if (typeof this.sounds[type] === 'object' && this.sounds[type] !== null) {
                    if (this.sounds[type] instanceof HTMLAudioElement) {
                        const playPromise = this.sounds[type].play();
                        if (playPromise !== undefined) {
                            playPromise.then(() => {
                                this.sounds[type].pause(); // Pause immediately after resuming
                            }).catch(error => {
                                // Auto-play was prevented
                                console.log("Audio auto-play prevented:", error);
                            });
                        }
                    } else if (type === 'atmosphere') {
                        for (const weather in this.sounds.atmosphere) {
                            if (this.sounds.atmosphere[weather] instanceof HTMLAudioElement) {
                                const playPromise = this.sounds.atmosphere[weather].play();
                                if (playPromise !== undefined) {
                                    playPromise.then(() => {
                                        this.sounds.atmosphere[weather].pause();
                                    }).catch(error => {
                                        console.log(`Atmosphere ${weather} auto-play prevented:`, error);
                                    });
                                }
                            }
                        }
                    }
                }
            }
            
            this.showNotification("Audio enabled", "success");
        } catch (error) {
            console.error("Failed to resume audio:", error);
        }
    }
    
    setupNotifications() {
        // Create notification element if it doesn't exist
        if (!document.getElementById('audioNotification')) {
            this.notificationElement = document.createElement('div');
            this.notificationElement.id = 'audioNotification';
            this.notificationElement.style.position = 'absolute';
            this.notificationElement.style.top = '20px';
            this.notificationElement.style.right = '20px';
            this.notificationElement.style.padding = '10px 20px';
            this.notificationElement.style.borderRadius = '5px';
            this.notificationElement.style.backgroundColor = 'rgba(0,0,0,0.7)';
            this.notificationElement.style.color = 'white';
            this.notificationElement.style.fontFamily = 'Arial, sans-serif';
            this.notificationElement.style.zIndex = '1000';
            this.notificationElement.style.transition = 'opacity 0.5s ease-in-out';
            this.notificationElement.style.opacity = '0';
            this.notificationElement.style.pointerEvents = 'none';
            document.body.appendChild(this.notificationElement);
        } else {
            this.notificationElement = document.getElementById('audioNotification');
        }
    }
    
    showNotification(message, type) {
        if (!this.notificationElement) return;
        
        // Set notification style based on type
        if (type === 'error') {
            this.notificationElement.style.backgroundColor = 'rgba(220,53,69,0.8)';
        } else if (type === 'success') {
            this.notificationElement.style.backgroundColor = 'rgba(40,167,69,0.8)';
        } else {
            this.notificationElement.style.backgroundColor = 'rgba(0,0,0,0.7)';
        }
        
        // Show notification
        this.notificationElement.textContent = message;
        this.notificationElement.style.opacity = '1';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.notificationElement.style.opacity = '0';
        }, 3000);
    }
    
    // Add method to queue and play pending sounds
    playPendingSounds() {
        if (!this.userInteracted || this.pendingSounds.length === 0) return;
        
        console.log(`Playing ${this.pendingSounds.length} pending sounds`);
        
        while (this.pendingSounds.length > 0) {
            const soundInfo = this.pendingSounds.shift();
            switch (soundInfo.type) {
                case 'engine':
                    this.playEngineSound(true); // Force play
                    break;
                case 'siren':
                    this.playSirenSound(true); // Force play
                    break;
                case 'atmosphere':
                    this.playAtmosphereSound(soundInfo.weatherType, true); // Force play
                    break;
                case 'backgroundMusic':
                    this.playBackgroundMusic(true); // Force play
                    break;
                case 'gunshot':
                    this.playGunshotSound();
                    break;
                case 'missile':
                    this.playMissileSound();
                    break;
                case 'crash':
                    this.playCrashSound(soundInfo.volume);
                    break;
                case 'collision':
                    this.playCollisionSound(soundInfo.volume);
                    break;
            }
        }
    }
    
    // ENGINE SOUND METHODS
    playEngineSound(force = false) {
        if (!this.sounds.engine) return false;
        
        try {
            if (!this.playing.engine) {
                this.sounds.engine.volume = 0.4;
                this.sounds.engine.currentTime = 0;
                
                // If user hasn't interacted and not forcing, queue for later
                if (!this.userInteracted && !force) {
                    this.pendingSounds.push({ type: 'engine' });
                    return false;
                }
                
                const playPromise = this.sounds.engine.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.playing.engine = true;
                    }).catch(error => {
                        console.error("Engine sound playback failed:", error);
                        
                        // If rejected due to no interaction, queue for later
                        if (!this.userInteracted) {
                            this.pendingSounds.push({ type: 'engine' });
                        }
                    });
                }
            }
            return true;
        } catch (error) {
            console.error("Error playing engine sound:", error);
            return false;
        }
    }
    
    updateEngineSound(rpm, load) {
        if (!this.sounds.engine) {
            this.playEngineSound();
            return;
        }
        
        try {
            if (!this.playing.engine) {
                this.playEngineSound();
            }
            
            // Adjust volume based on RPM and load
            const volume = Math.min(0.2 + (load * 0.4), 0.6);
            
            // Adjust playback rate (pitch) based on RPM
            // Map rpm range (800-7000) to playback rate range (0.6-2.0)
            const minRPM = 800;
            const maxRPM = 7000;
            const minRate = 0.6;
            const maxRate = 2.0;
            
            const normalizedRPM = Math.min(Math.max(rpm, minRPM), maxRPM);
            const rpmRatio = (normalizedRPM - minRPM) / (maxRPM - minRPM);
            const playbackRate = minRate + (rpmRatio * (maxRate - minRate));
            
            // Apply smoothly
            if (this.sounds.engine.volume !== volume) {
                this.sounds.engine.volume = volume;
            }
            
            if (this.sounds.engine.playbackRate !== playbackRate) {
                this.sounds.engine.playbackRate = playbackRate;
            }
        } catch (error) {
            console.error("Error updating engine sound:", error);
        }
    }
    
    stopEngineSound() {
        if (!this.sounds.engine || !this.playing.engine) return;
        
        try {
            this.sounds.engine.pause();
            this.playing.engine = false;
        } catch (error) {
            console.error("Error stopping engine sound:", error);
        }
    }
    
    // SIREN SOUND METHODS
    playSirenSound(force = false) {
        if (!this.sounds.siren) return false;
        
        try {
            if (!this.playing.siren) {
                this.sounds.siren.volume = 0.3;
                this.sounds.siren.currentTime = 0;
                
                // If user hasn't interacted and not forcing, queue for later
                if (!this.userInteracted && !force) {
                    this.pendingSounds.push({ type: 'siren' });
                    return false;
                }
                
                const playPromise = this.sounds.siren.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.playing.siren = true;
                    }).catch(error => {
                        console.error("Siren sound playback failed:", error);
                        
                        // If rejected due to no interaction, queue for later
                        if (!this.userInteracted) {
                            this.pendingSounds.push({ type: 'siren' });
                        }
                    });
                }
            }
            return true;
        } catch (error) {
            console.error("Error playing siren sound:", error);
            return false;
        }
    }
    
    stopSirenSound() {
        if (!this.sounds.siren || !this.playing.siren) return;
        
        try {
            this.sounds.siren.pause();
            this.playing.siren = false;
        } catch (error) {
            console.error("Error stopping siren sound:", error);
        }
    }
    
    // ATMOSPHERE SOUND METHODS
    playAtmosphereSound(type = 'clear', force = false) {
        if (!this.sounds.atmosphere || !this.sounds.atmosphere[type]) return false;
        
        const sound = this.sounds.atmosphere[type];
        
        try {
            if (!this.playing.atmosphere) {
                // If user hasn't interacted and not forcing, queue for later
                if (!this.userInteracted && !force) {
                    this.pendingSounds.push({ type: 'atmosphere', weatherType: type });
                    return false;
                }
                
                // Stop any other playing atmosphere sound
                for (const key in this.sounds.atmosphere) {
                    if (key !== type && this.sounds.atmosphere[key]) {
                        this.sounds.atmosphere[key].pause();
                    }
                }
                
                sound.volume = 0.3;
                sound.currentTime = 0;
                const playPromise = sound.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.playing.atmosphere = true;
                    }).catch(error => {
                        console.error(`Atmosphere ${type} sound playback failed:`, error);
                        
                        // If rejected due to no interaction, queue for later
                        if (!this.userInteracted) {
                            this.pendingSounds.push({ type: 'atmosphere', weatherType: type });
                        }
                    });
                }
            }
            return true;
        } catch (error) {
            console.error(`Error playing atmosphere ${type} sound:`, error);
            return false;
        }
    }
    
    stopAtmosphereSound() {
        if (!this.sounds.atmosphere) return;
        
        try {
            // Stop all atmosphere sound types
            for (const type in this.sounds.atmosphere) {
                if (this.sounds.atmosphere[type]) {
                    this.sounds.atmosphere[type].pause();
                }
            }
            this.playing.atmosphere = false;
        } catch (error) {
            console.error("Error stopping atmosphere sound:", error);
        }
    }
    
    // Gunshot sound
    playGunshotSound() {
        if (!this.sounds.gunshot) return false;
        
        try {
            // If user hasn't interacted, queue for later
            if (!this.userInteracted) {
                this.pendingSounds.push({ type: 'gunshot' });
                return false;
            }
            
            // Clone the audio element to allow overlapping sounds
            const sound = this.sounds.gunshot.cloneNode();
            sound.volume = 0.5;
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Gunshot sound playback failed:", error);
                });
            }
            
            return true;
        } catch (error) {
            console.error("Error playing gunshot sound:", error);
            return false;
        }
    }
    
    // Missile launch sound
    playMissileSound() {
        if (!this.sounds.missile) {
            console.error("Missile sound not loaded properly!");
            // Create on-demand if not available
            try {
                const tempMissile = new Audio('assets/sounds/missile.mp3');
                tempMissile.volume = 0.9;
                tempMissile.play().catch(e => console.error("Failed to play emergency missile sound:", e));
                return;
            } catch (e) {
                console.error("Emergency missile sound creation failed:", e);
                return;
            }
        }
        
        try {
            // If user hasn't interacted, queue for later
            if (!this.userInteracted) {
                this.pendingSounds.push({ type: 'missile' });
                return false;
            }
            
            // Clone the audio element to allow overlapping sounds
            const sound = this.sounds.missile.cloneNode();
            sound.volume = 0.7;
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Missile sound playback failed:", error);
                });
            }
            
            return true;
        } catch (error) {
            console.error("Error playing missile sound:", error);
            return false;
        }
    }
    
    // Completely new implementation for coin sound playback
    playCoinSound() {
        // Use a different sound or silence for coin collection
        // If you have a coin sound, use it here. Otherwise, do nothing.
        // Example: if (this.sounds.coin) { ... } else { return; }
        return; // No sound
    }
    
    // Background music
    playBackgroundMusic(force = false) {
        if (!this.sounds.backgroundMusic) return false;
        
        try {
            if (!this.playing.backgroundMusic) {
                this.sounds.backgroundMusic.volume = 0.3;
                this.sounds.backgroundMusic.currentTime = 0;
                
                // If user hasn't interacted and not forcing, queue for later
                if (!this.userInteracted && !force) {
                    this.pendingSounds.push({ type: 'backgroundMusic' });
                    return false;
                }
                
                const playPromise = this.sounds.backgroundMusic.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.playing.backgroundMusic = true;
                    }).catch(error => {
                        console.error("Background music playback failed:", error);
                        
                        // If rejected due to no interaction, queue for later
                        if (!this.userInteracted) {
                            this.pendingSounds.push({ type: 'backgroundMusic' });
                        }
                    });
                }
            }
            return true;
        } catch (error) {
            console.error("Error playing background music:", error);
            return false;
        }
    }
    
    stopBackgroundMusic() {
        if (!this.sounds.backgroundMusic || !this.playing.backgroundMusic) return;
        
        try {
            this.sounds.backgroundMusic.pause();
            this.playing.backgroundMusic = false;
        } catch (error) {
            console.error("Error stopping background music:", error);
        }
    }
    
    // Set background music volume (0.0 to 1.0)
    setBackgroundMusicVolume(volume) {
        if (!this.sounds.backgroundMusic) return;
        
        try {
            this.sounds.backgroundMusic.volume = Math.min(Math.max(volume, 0), 1);
        } catch (error) {
            console.error("Error setting background music volume:", error);
        }
    }
    
    // Add method to play crash sound
    playCrashSound(volume = 0.8) {
        if (!this.sounds.crash) return false;
        
        try {
            // If user hasn't interacted, queue for later
            if (!this.userInteracted) {
                this.pendingSounds.push({ type: 'crash', volume });
                return false;
            }
            
            // Clone the audio element to allow overlapping sounds
            const sound = this.sounds.crash.cloneNode();
            sound.volume = volume;
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Crash sound playback failed:", error);
                });
            }
            
            return true;
        } catch (error) {
            console.error("Error playing crash sound:", error);
            return false;
        }
    }
    
    // Çarpışma sesi çalmak için fonksiyon ekle
    playCollisionSound(volume = 0.7) {
        if (!this.sounds.collision) return false;
        
        try {
            // If user hasn't interacted, queue for later
            if (!this.userInteracted) {
                this.pendingSounds.push({ type: 'collision', volume });
                return false;
            }
            
            // Clone the audio element to allow overlapping sounds
            const sound = this.sounds.collision.cloneNode();
            sound.volume = volume;
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Collision sound playback failed:", error);
                });
            }
            
            return true;
        } catch (error) {
            console.error("Error playing collision sound:", error);
            return false;
        }
    }
    
    // Clean up all audio resources
    cleanup() {
        try {
            // Stop all sounds
            this.stopEngineSound();
            this.stopSirenSound();
            this.stopAtmosphereSound();
            this.stopBackgroundMusic();
            
            // Remove audio elements
            for (const type in this.sounds) {
                if (typeof this.sounds[type] === 'object' && this.sounds[type] !== null) {
                    if (this.sounds[type] instanceof HTMLAudioElement) {
                        this.sounds[type].src = '';
                        this.sounds[type] = null;
                    } else if (type === 'atmosphere') {
                        for (const weather in this.sounds.atmosphere) {
                            if (this.sounds.atmosphere[weather]) {
                                this.sounds.atmosphere[weather].src = '';
                                this.sounds.atmosphere[weather] = null;
                            }
                        }
                        this.sounds.atmosphere = null;
                    }
                }
            }
            
            this.sounds = {};
            this.isInitialized = false;
        } catch (error) {
            console.error("Error cleaning up audio resources:", error);
        }
    }
}

// Create a global instance
window.audioManager = new AudioManager(); 