// Import Three.js ve modüllerini ES modül formatında kullan
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { Water } from 'three/addons/objects/Water.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { CopyShader } from 'three/addons/shaders/CopyShader.js';
import { LuminosityHighPassShader } from 'three/addons/shaders/LuminosityHighPassShader.js';

// SimplexNoise ve CANNON için script yükleme
const simplexNoiseScript = document.createElement('script');
simplexNoiseScript.src = 'https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.js';
document.head.appendChild(simplexNoiseScript);

const cannonScript = document.createElement('script');
cannonScript.src = 'https://cdn.jsdelivr.net/npm/cannon@0.6.2/build/cannon.min.js';
document.head.appendChild(cannonScript);

// Global THREE nesnesi oluştur
window.THREE = THREE;

// THREE'ye ek bileşenleri ekle
window.THREE.OrbitControls = OrbitControls;
window.THREE.GLTFLoader = GLTFLoader;
window.THREE.Sky = Sky;
window.THREE.Water = Water;
window.THREE.EffectComposer = EffectComposer;
window.THREE.RenderPass = RenderPass;
window.THREE.ShaderPass = ShaderPass;
window.THREE.UnrealBloomPass = UnrealBloomPass;
window.THREE.FXAAShader = FXAAShader;
window.THREE.CopyShader = CopyShader;
window.THREE.LuminosityHighPassShader = LuminosityHighPassShader;

// Script yükleme yardımcısı
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
};

// Tüm scriptleri sırayla yükle
async function loadGameScripts() {
    try {
        // SimplexNoise ve CANNON yüklenene kadar bekle
        await Promise.all([
            new Promise(resolve => {
                if (window.SimplexNoise) resolve();
                else simplexNoiseScript.onload = resolve;
            }),
            new Promise(resolve => {
                if (window.CANNON) resolve();
                else cannonScript.onload = resolve;
            })
        ]);
        
        console.log("Libraries loaded:", {
            THREE: typeof window.THREE,
            CANNON: typeof window.CANNON,
            SimplexNoise: typeof window.SimplexNoise
        });
        
        // Oyun scriptlerini yükle
        await loadScript('js/web3handler.js');
        await loadScript('js/physics.js');
        await loadScript('js/particles.js');
        await loadScript('js/environment.js');
        await loadScript('js/terrain.js');
        await loadScript('js/objects.js');
        await loadScript('js/coins.js');
        await loadScript('js/vehicle.js');
        await loadScript('js/vehicles/police.js');
        await loadScript('js/vehicles/thief.js');
        await loadScript('js/vehicles/courier.js');
        
        // Son olarak ana oyun scriptini yükle
        await loadScript('js/game.js');
        
        console.log('Tüm oyun scriptleri başarıyla yüklendi');
    } catch (error) {
        console.error('Script yükleme hatası:', error);
        document.getElementById('loadingScreen').innerHTML = 
            `Yükleme hatası: ${error.message}<br>Lütfen sayfayı yenileyin.`;
    }
}

// Scriptleri yüklemeye başla
loadGameScripts();

// Initialize Web Audio API on user interaction
document.addEventListener('click', function initAudio() {
    try {
        // Create temporary audio context to initialize audio
        const tempContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Resume audio context if in suspended state
        if (tempContext.state === 'suspended') {
            tempContext.resume().then(() => {
                console.log('Audio context successfully resumed on user interaction');
            });
        }
        
        // Log audio initialization
        console.log('Audio context initialized on user interaction');
        
        // Remove listener after first click
        document.removeEventListener('click', initAudio);
        
        // Show notification using the helper function
        if (window.showNotification) {
            window.showNotification('Ses sistemi hazır', 2000);
        }
        
        // Close context after 1 second - it served its purpose to initialize audio
        setTimeout(() => {
            tempContext.close().then(() => {
                console.log('Temporary audio context closed');
            }).catch(err => {
                console.log('Error closing temporary audio context:', err);
            });
        }, 1000);
    } catch (e) {
        console.error('Error initializing audio:', e);
    }
}, { once: true });

// Mobil cihaz algılaması ve mobil moda otomatik geçiş
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function enableMobileMode() {
    if (!window.isMobileMode) {
        window.isMobileMode = true;
        document.body.classList.add('mobile-mode'); // body'ye class ekle
        var mobileStyle = document.getElementById('mobile-style');
        if (mobileStyle) mobileStyle.media = 'all';
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
        if (window.mobileHud && typeof window.mobileHud.enable === 'function') {
            window.mobileHud.enable();
        }
    }
}

window.addEventListener('DOMContentLoaded', function() {
    if (isMobileDevice()) {
        enableMobileMode();
    }
});

// F12 ile manuel tetikleme (varsa koru)
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12') {
        enableMobileMode();
    }
});

// Mobil mod kontrol ve etkinleştirme fonksiyonu
function checkAndEnableMobileMode() {
    if (isMobileDevice()) {
        // Mobil HUD'u etkinleştir
        if (window.mobileHud && typeof window.mobileHud.enable === 'function') {
            window.mobileHud.enable();
        } else {
            setTimeout(function() {
                if (window.mobileHud && typeof window.mobileHud.enable === 'function') {
                    window.mobileHud.enable();
                }
            }, 1200);
        }
        // Tam ekranı tetikle
        const docElm = document.documentElement;
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.webkitRequestFullscreen) {
            docElm.webkitRequestFullscreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
        // Uyku engelleme (NoSleep alternatifi)
        let wakeLock = null;
        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen').then(lock => { wakeLock = lock; });
        }
        // Kısa dokunmatik kontrol rehberi göster
        if (!document.getElementById('mobile-touch-guide')) {
            const guide = document.createElement('div');
            guide.id = 'mobile-touch-guide';
            guide.style.position = 'fixed';
            guide.style.top = '0';
            guide.style.left = '0';
            guide.style.width = '100vw';
            guide.style.height = '100vh';
            guide.style.background = 'rgba(30,30,40,0.92)';
            guide.style.color = '#ffd700';
            guide.style.display = 'flex';
            guide.style.flexDirection = 'column';
            guide.style.alignItems = 'center';
            guide.style.justifyContent = 'center';
            guide.style.zIndex = '99999';
            guide.style.fontSize = '20px';
            guide.style.fontFamily = 'Arial, sans-serif';
            guide.innerHTML = '<div style="max-width:90vw;text-align:center;line-height:1.5;">☝️ <b>Mobil Kontroller</b><br><br>Sol alttaki joystick ile aracı yönlendir.<br>Sağ alttaki butonlarla ateş et ve fren yap.<br>Oyun sırasında ekranın uykuya geçmemesi için dokunmaya devam et.<br><br><span style="font-size:15px;color:#fffbe8;">Başlamak için ekrana dokun</span></div>';
            guide.addEventListener('touchstart', function() {
                guide.remove();
            }, { once: true });
            guide.addEventListener('click', function() {
                guide.remove();
            }, { once: true });
            document.body.appendChild(guide);
        }
    } else {
        // Masaüstüne dönülürse mobil HUD'u kapat
        if (window.mobileHud && typeof window.mobileHud.disable === 'function') {
            window.mobileHud.disable();
        }
    }
}

window.addEventListener('DOMContentLoaded', function() {
    checkAndEnableMobileMode();
    // F12 hard refresh sonrası mobil simülasyon için gecikmeli tekrar kontrol
    setTimeout(checkAndEnableMobileMode, 300);
});
window.addEventListener('resize', checkAndEnableMobileMode);

// Mobilde scroll/zoom engelleme
if (typeof window !== 'undefined') {
    document.addEventListener('touchmove', function(e) {
        if (isMobileDevice()) e.preventDefault();
    }, { passive: false });
    document.addEventListener('gesturestart', function(e) {
        if (isMobileDevice()) e.preventDefault();
    }, { passive: false });
    document.addEventListener('gesturechange', function(e) {
        if (isMobileDevice()) e.preventDefault();
    }, { passive: false });
    document.addEventListener('gestureend', function(e) {
        if (isMobileDevice()) e.preventDefault();
    }, { passive: false });
}

// Mobilde ses başlatılamazsa kullanıcıya uyarı
function tryPlayAudioWithWarning(audioElement) {
    if (!audioElement) return;
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            if (window.showNotification) {
                window.showNotification('Ses başlatılamadı. Lütfen ekrana dokunun.', 3000);
            } else {
                alert('Ses başlatılamadı. Lütfen ekrana dokunun.');
            }
        });
    }
}

// Mobilde Web3 cüzdan deep link desteği
function openWalletDeepLink() {
    if (!isMobileDevice()) return false;
    // MetaMask örneği
    const metamaskDeepLink = 'https://metamask.app.link/dapp/' + window.location.host + window.location.pathname;
    window.location.href = metamaskDeepLink;
    return true;
}

// Connect/Claim butonlarına deep link ekle
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const connectBtn = document.getElementById('connect-wallet-btn');
        if (connectBtn) {
            connectBtn.addEventListener('click', function() {
                if (isMobileDevice()) openWalletDeepLink();
            });
        }
        const claimBtn = document.getElementById('claim-reward-btn');
        if (claimBtn) {
            claimBtn.addEventListener('click', function() {
                if (isMobileDevice()) openWalletDeepLink();
            });
        }
    }, 2000);
});

// Mobilde düşük performans algılama ve grafik seviyesi düşürme
window.lowGraphicsMode = false;
(function monitorMobilePerformance() {
    if (!isMobileDevice()) return;
    let lastTime = performance.now();
    let frameCount = 0;
    function checkFPS() {
        frameCount++;
        const now = performance.now();
        if (now - lastTime > 2000) { // 2 saniyede bir kontrol
            const fps = frameCount / ((now - lastTime) / 1000);
            if (fps < 30) {
                window.lowGraphicsMode = true;
                if (window.showNotification) window.showNotification('Düşük grafik modu etkin!', 2000);
            }
            lastTime = now;
            frameCount = 0;
        }
        requestAnimationFrame(checkFPS);
    }
    requestAnimationFrame(checkFPS);
})();

window.game.toggleCameraMode = function() {
    if (!window.game || !window.game.cameraMode) return;
    const modes = ['follow', 'cockpit', 'orbit', 'cinematic', 'overhead'];
    const currentIndex = modes.indexOf(window.game.cameraMode);
    window.game.cameraMode = modes[(currentIndex + 1) % modes.length];
    if (window.game.orbitControls) {
        window.game.orbitControls.enabled = (window.game.cameraMode === 'orbit');
    }
    // Kamerayı hemen güncelle
    if (typeof window.game.updateCamera === 'function') {
        window.game.updateCamera();
    }
}; 