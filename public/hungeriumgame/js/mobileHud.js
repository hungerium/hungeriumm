(function() {
    if (window.mobileHud) return;
    const MOBILE_HUD_ID = 'mobile-hud';
    const MOBILE_CONTROLS_ID = 'mobile-controls';
    let hud, controls, joystick, fireBtn, jumpBtn;
    let joystickManager = null;
    let lastDir = { x: 0, y: 0 };
    let updateInterval = null;

    function createHud() {
        hud = document.getElementById(MOBILE_HUD_ID);
        if (!hud) {
            hud = document.createElement('div');
            hud.id = MOBILE_HUD_ID;
            hud.innerHTML = `
                <div class="hud-row" style="width:100vw;display:flex;align-items:center;justify-content:center;gap:3px;padding:1px 2px;">
                    <span class="hud-item" id="mobile-level" style="font-size:11px;padding:1px 4px;min-width:unset;background:none;color:#ffd700;">Lv. 1</span>
                    <span class="hud-item" id="mobile-coffy" style="font-size:11px;padding:1px 4px;min-width:unset;background:none;color:#ffd700;">☕ 0</span>
                    <span class="hud-item" id="mobile-rescuees" style="font-size:11px;padding:1px 4px;min-width:unset;background:none;color:#aaddff;">👤 0/0</span>
                    <span class="hud-item" id="mobile-hostage-dir" style="font-size:11px;padding:1px 4px;min-width:unset;background:none;color:#ffd700;">Hostage: 0m</span>
                    <span class="hud-item" id="mobile-police-dir" style="font-size:11px;padding:1px 4px;min-width:unset;background:none;color:#aaddff;">Police: 0m</span>
                    <span class="hud-item" id="mobile-time" style="font-size:10px;padding:1px 2px;min-width:38px;max-width:54px;text-align:center;background:none;color:#fffbe8;">Time: 00:00</span>
                    <span class="hud-item" id="mobile-health" style="font-size:11px;padding:1px 4px;min-width:unset;background:none;color:#ff4d4d;">Health: 100</span>
                </div>
            `;
            document.body.appendChild(hud);
        }
    }

    function createControls() {
        controls = document.getElementById(MOBILE_CONTROLS_ID);
        if (!controls) {
            controls = document.createElement('div');
            controls.id = MOBILE_CONTROLS_ID;
            controls.innerHTML = `
                <div id="mobile-joystick"></div>
                <div id="mobile-buttons">
                    <button class="mobile-btn" id="mobile-missile" title="Missile">&#128165;</button>
                    <div id="mobile-fire-jump-row" style="display:flex;flex-direction:row;gap:8px;">
                        <button class="mobile-btn" id="mobile-fire" title="Fire">&#128293;</button>
                        <button class="mobile-btn" id="mobile-jump" title="Brake">&#11014;</button>
                    </div>
                </div>
                <div id="mobile-respawn-container">
                    <button class="mobile-btn" id="mobile-camera" title="Camera">&#128247;</button>
                    <button class="mobile-btn" id="mobile-respawn" title="Respawn">&#8635;</button>
                </div>
            `;
            document.body.appendChild(controls);
        }
        fireBtn = document.getElementById('mobile-fire');
        jumpBtn = document.getElementById('mobile-jump');
        const missileBtn = document.getElementById('mobile-missile');
        if (missileBtn) {
            missileBtn.ontouchstart = missileBtn.onclick = function(e) {
                e.preventDefault();
                if (window.game && window.game.vehicle && typeof window.game.vehicle.fireMissile === 'function') {
                    window.game.vehicle.fireMissile();
                }
            };
        }
        const cameraBtn = document.getElementById('mobile-camera');
        if (cameraBtn) {
            cameraBtn.ontouchstart = cameraBtn.onclick = function(e) {
                e.preventDefault();
                if (window.game && typeof window.game.toggleCameraMode !== 'function') {
                    window.game.toggleCameraMode = function() {
                        if (!window.game || !window.game.cameraMode) return;
                        const modes = ['follow', 'cockpit', 'orbit', 'cinematic', 'overhead'];
                        const currentIndex = modes.indexOf(window.game.cameraMode);
                        window.game.cameraMode = modes[(currentIndex + 1) % modes.length];
                        if (window.game.orbitControls) {
                            window.game.orbitControls.enabled = (window.game.cameraMode === 'orbit');
                        }
                        if (typeof window.game.updateCamera === 'function') {
                            window.game.updateCamera();
                        }
                    };
                }
                if (window.game && typeof window.game.toggleCameraMode === 'function') {
                    window.game.toggleCameraMode();
                } else {
                    alert('Camera mode function not found!');
                }
            };
        }
        const respawnBtn = document.getElementById('mobile-respawn');
        if (respawnBtn) {
            respawnBtn.ontouchstart = respawnBtn.onclick = function(e) {
                e.preventDefault();
                if (window.game && window.game.vehicle && typeof window.game.vehicle.respawn === 'function') {
                    window.game.vehicle.respawn();
                }
            };
        }
    }

    function setupJoystick() {
        if (joystickManager) return;
        const joystickZone = document.getElementById('mobile-joystick');
        if (!joystickZone || !window.nipplejs) return;
        joystickManager = window.nipplejs.create({
            zone: joystickZone,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: '#ffd700',
            size: 100,
            restOpacity: 0.5
        });
        joystickManager.on('move', function(evt, data) {
            if (!data || !data.vector) return;
            lastDir.x = data.vector.x;
            lastDir.y = data.vector.y;
        });
        joystickManager.on('end', function() {
            lastDir.x = 0;
            lastDir.y = 0;
        });
    }

    function mapJoystickToControls() {
        if (!window.game || !window.game.vehicle) return;
        const v = window.game.vehicle;
        v.controls.forward = v.controls.backward = v.controls.left = v.controls.right = false;
        if (lastDir.y > 0.2) v.controls.forward = true;
        if (lastDir.y < -0.2) v.controls.backward = true;
        if (lastDir.x < -0.2) v.controls.left = true;
        if (lastDir.x > 0.2) v.controls.right = true;
    }

    function setupButtons() {
        if (!fireBtn || !jumpBtn) return;
        fireBtn.ontouchstart = fireBtn.onclick = function(e) {
            e.preventDefault();
            if (window.game && window.game.vehicle && typeof window.game.vehicle.fireBullet === 'function') {
                window.game.vehicle.fireBullet();
            }
        };
        jumpBtn.ontouchstart = jumpBtn.onclick = function(e) {
            e.preventDefault();
            if (window.game && window.game.vehicle) {
                window.game.vehicle.controls.brake = true;
                if (window.game.vehicle.particleSystem && typeof window.game.vehicle.particleSystem.createJumpEffect === 'function') {
                    const pos = window.game.vehicle.body && window.game.vehicle.body.position;
                    if (pos) window.game.vehicle.particleSystem.createJumpEffect(pos.x, pos.y, pos.z, 1.2);
                }
                setTimeout(() => { window.game.vehicle.controls.brake = false; }, 200);
            }
        };
    }

    function getDirectionArrow(targetPos, vehicle) {
        if (!vehicle || !vehicle.body || !vehicle.body.position || !vehicle.body.quaternion) return {arrow: '-', dist: 0};
        const dx = targetPos.x - vehicle.body.position.x;
        const dz = targetPos.z - vehicle.body.position.z;
        const dist = Math.sqrt(dx*dx + dz*dz);
        const forward = new window.THREE.Vector3(0, 0, 1);
        const quat = vehicle.body.quaternion;
        if (typeof quat === 'object' && typeof quat.x === 'number') {
            const q = new window.THREE.Quaternion(quat.x, quat.y, quat.z, quat.w);
            forward.applyQuaternion(q);
        }
        const targetDir = new window.THREE.Vector3(dx, 0, dz).normalize();
        const angle = Math.atan2(
            forward.x * targetDir.z - forward.z * targetDir.x,
            forward.x * targetDir.x + forward.z * targetDir.z
        );
        let arrow = '↑';
        if (angle > Math.PI/8 && angle < 3*Math.PI/8) arrow = '↗';
        else if (angle >= 3*Math.PI/8 && angle < 5*Math.PI/8) arrow = '→';
        else if (angle >= 5*Math.PI/8 && angle < 7*Math.PI/8) arrow = '↘';
        else if (angle > -3*Math.PI/8 && angle < -Math.PI/8) arrow = '↖';
        else if (angle <= -3*Math.PI/8 && angle > -5*Math.PI/8) arrow = '←';
        else if (angle <= -5*Math.PI/8 && angle > -7*Math.PI/8) arrow = '↙';
        else if (Math.abs(angle) >= 7*Math.PI/8) arrow = '↓';
        return { arrow, dist: Math.round(dist) };
    }

    function getHostageDirectionAndDistance() {
        if (!window.game || !window.game.vehicle || !window.game.objects || !window.game.objects.rescuees) return null;
        const vehicle = window.game.vehicle;
        const rescuees = window.game.objects.rescuees;
        let closest = null;
        let minDist = Infinity;
        for (const r of rescuees) {
            if (r.isCollected || r.isRescued) continue;
            const dx = r.position.x - vehicle.body.position.x;
            const dz = r.position.z - vehicle.body.position.z;
            const dist = Math.sqrt(dx*dx + dz*dz);
            if (dist < minDist) {
                minDist = dist;
                closest = r;
            }
        }
        if (!closest) return null;
        return getDirectionArrow(closest.position, vehicle);
    }

    function getPoliceDirectionAndDistance() {
        if (!window.game || !window.game.vehicle || !window.game.objects || !window.game.objects.policeStationPosition) return null;
        const vehicle = window.game.vehicle;
        const policePos = window.game.objects.policeStationPosition;
        return getDirectionArrow(policePos, vehicle);
    }

    function updateHud() {
        if (!window.game) return;
        const level = window.game.vehicle && window.game.vehicle.level ? window.game.vehicle.level : 1;
        document.getElementById('mobile-level').textContent = 'Lv. ' + level;
        let coffy = 0;
        if (window.game.coinManager && typeof window.game.coinManager.getTotalCoffyValue === 'function') {
            coffy = window.game.coinManager.getTotalCoffyValue();
        }
        document.getElementById('mobile-coffy').textContent = '☕ ' + coffy;
        let rescued = 0, total = 0;
        if (window.game.vehicle && window.game.vehicle.rescuedCount !== undefined) rescued = window.game.vehicle.rescuedCount;
        if (window.game.objects && window.game.objects.rescuees) total = window.game.objects.rescuees.length;
        document.getElementById('mobile-rescuees').textContent = `👤 ${rescued}/${total}`;
        const dirObj = getHostageDirectionAndDistance();
        if (dirObj) {
            document.getElementById('mobile-hostage-dir').textContent = `Hostage: ${dirObj.dist}m`;
        } else {
            document.getElementById('mobile-hostage-dir').textContent = 'Hostage: -';
        }
        const policeObj = getPoliceDirectionAndDistance();
        if (policeObj) {
            document.getElementById('mobile-police-dir').textContent = `Police: ${policeObj.dist}m`;
        } else {
            document.getElementById('mobile-police-dir').textContent = 'Police: -';
        }
        let time = 0;
        if (window.game.vehicle && typeof window.game.vehicle.timeRemaining !== 'undefined') {
            time = window.game.vehicle.timeRemaining;
        } else if (window.game.vehicle && typeof window.game.vehicle.timeElapsed !== 'undefined') {
            time = window.game.vehicle.timeElapsed;
        }
        time = Math.max(0, Math.floor(time));
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        document.getElementById('mobile-time').textContent = `Time: ${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
        let health = 100;
        if (window.game.vehicle && typeof window.game.vehicle.health !== 'undefined') health = Math.round(window.game.vehicle.health);
        document.getElementById('mobile-health').textContent = `Health: ${health}`;
    }

    function enable() {
        if (document.getElementById(MOBILE_HUD_ID)) return;
        createHud();
        createControls();
        setupJoystick();
        setupButtons();
        document.body.classList.add('mobile-mode');
        updateInterval = setInterval(function() {
            mapJoystickToControls();
            updateHud();
        }, 50);
    }

    function disable() {
        if (hud) hud.remove();
        if (controls) controls.remove();
        if (updateInterval) clearInterval(updateInterval);
        document.body.classList.remove('mobile-mode');
    }

    if (typeof window !== 'undefined') {
        const style = document.createElement('style');
        style.innerHTML = `
        #mobile-joystick {
            background: rgba(166, 124, 82, 0.5) !important;
            border-radius: 50%;
            box-shadow: 0 2px 8px #a67c52aa;
            opacity: 0.5 !important;
        }
        .mobile-btn {
            background: linear-gradient(135deg, #a67c52 60%, #ffd7a0 100%) !important;
            color: #3a2614 !important;
            opacity: 0.5 !important;
            border: 2px solid #ffd70055 !important;
            width: 40px !important;
            height: 40px !important;
            font-size: 16px !important;
            margin: 0 6px 0 0 !important;
        }
        .mobile-btn:active {
            background: #ffd7a0 !important;
        }
        #mobile-buttons {
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            align-items: flex-end !important;
            justify-content: flex-end !important;
            position: fixed;
            right: 18px;
            bottom: 40px;
            z-index: 4100;
            pointer-events: auto;
        }
        #mobile-missile {
            margin-bottom: 0 !important;
            width: 43px !important;
            height: 43px !important;
            font-size: 22px !important;
        }
        #mobile-fire-jump-row {
            display: flex !important;
            flex-direction: row !important;
            gap: 8px !important;
        }
        #mobile-fire, #mobile-jump {
            width: 43px !important;
            height: 43px !important;
            font-size: 22px !important;
            margin: 0 !important;
        }
        #mobile-respawn-container {
            position: fixed;
            left: 18px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 4100;
            pointer-events: auto;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        #mobile-camera {
            margin-bottom: 10px !important;
            width: 32px !important;
            height: 32px !important;
            font-size: 16px !important;
            opacity: 0.7 !important;
            background: linear-gradient(135deg, #a67c52 60%, #ffd7a0 100%) !important;
            color: #3a2614 !important;
            border: 2px solid #ffd70055 !important;
            border-radius: 50% !important;
        }
        #mobile-respawn {
            width: 32px !important;
            height: 32px !important;
            font-size: 16px !important;
            opacity: 0.7 !important;
            background: linear-gradient(135deg, #a67c52 60%, #ffd7a0 100%) !important;
            color: #3a2614 !important;
            border: 2px solid #ffd70055 !important;
            border-radius: 50% !important;
        }
        #mobile-hud .hud-row {
            width: 100vw;
            display: flex;
            justify-content: center;
            gap: 3px;
            margin-top: 4px;
            padding: 2px 2px;
        }
        #mobile-hud .hud-item {
            background: rgba(30,30,40,0.85);
            color: #ffd700;
            font-size: 11px;
            font-weight: 500;
            border-radius: 8px;
            padding: 2px 6px;
            margin: 0 2px;
            box-shadow: 0 1px 4px #00000022;
            text-align: center;
            min-width: 36px;
            pointer-events: auto;
        }
        #mobile-time {
            font-size: 10px !important;
            padding: 1px 2px !important;
            min-width: 38px !important;
            max-width: 54px !important;
            text-align: center !important;
        }
        #mobile-hud .hud-item.health {
            color: #ff4d4d;
        }
        #mobile-hud .hud-item.rescued {
            color: #aaddff;
        }
        `
        document.head.appendChild(style);
    }

    window.mobileHud = { enable, disable };
})();