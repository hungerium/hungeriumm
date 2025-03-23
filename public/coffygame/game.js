// Constants
const PLAYER_RADIUS = 32; // 40'tan 32'ye düşürüldü
const CUP_RADIUS = 25;
const SMILE_DURATION = 30;
const INITIAL_COFFEE_SPAWN_RATE = 900;
const INITIAL_TEA_SPAWN_RATE = 800;
const COFFEES_PER_LEVEL = 5;
const PARTICLE_COUNT = { COFFEE: 15, LEVEL_UP: 20, BREAK: 5 };
const MAX_COFFEE_CUPS = 20;
const MAX_TEA_CUPS = 15;
const MAX_PARTICLES = 50;
const TOKEN_ADDRESS = '0x04CD0E3b1009E8ffd9527d0591C7952D92988D0f';
const SUPPORTED_WALLETS = ['MetaMask', 'Trust Wallet', 'Binance Wallet'];
const BSC_CHAIN_ID = '0x38';

const SUPERPOWER_COOLDOWN = 20000; // 20 seconds
const SUPERPOWER_DURATION = 3000;  // 3 seconds

const SUPERPOWERS = {
    'basic-barista': {
        name: 'Coffee Shield',
        description: 'Creates a protective shield and doubles coin rewards',
        effect: (player) => {
            gameState.shieldActive = true;
            gameState.rewardMultiplier = 2;
            // Kalkan efekti
            const shieldInterval = setInterval(() => {
                if (!gameState.shieldActive) {
                    clearInterval(shieldInterval);
                    return;
                }
                createShieldEffect(player);
            }, 200);
        },
        reset: (player) => {
            gameState.shieldActive = false;
            gameState.rewardMultiplier = 1;
        }
    },
    'mocha-knight': {
        name: 'Coffee Storm',
        description: 'Creates a vortex that pulls and collects all coffee cups',
        effect: (player) => {
            gameState.coffeeStormActive = true;
            player.collectRange *= 4;
            // Kahve fırtınası efekti
            const stormInterval = setInterval(() => {
                if (!gameState.coffeeStormActive) {
                    clearInterval(stormInterval);
                    return;
                }
                createCoffeeVortex(player);
                // Tüm kahve kupalarını oyuncuya doğru çek
                gameObjects.coffeeCups.forEach(cup => {
                    if (!cup.active) return;
                    const dx = player.x - cup.x;
                    const dy = player.y - cup.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    cup.dx += (dx / dist) * 0.5;
                    cup.dy += (dy / dist) * 0.5;
                });
            }, 100);
        },
        reset: (player) => {
            gameState.coffeeStormActive = false;
            player.collectRange /= 4;
        }
    },
    'arabica-archmage': {
        name: 'Time Freeze',
        description: 'Freezes all tea cups and creates magical coffee portals',
        effect: (player) => {
            gameState.timeStopActive = true;
            // Çay kupalarını dondur
            gameObjects.teaCups.forEach(cup => {
                cup.originalDx = cup.dx;
                cup.originalDy = cup.dy;
                cup.dx = 0;
                cup.dy = 0;
            });
            // Portal efekti ve ekstra kahve spawn
            const portalInterval = setInterval(() => {
                if (!gameState.timeStopActive) {
                    clearInterval(portalInterval);
                    return;
                }
                createMagicPortals(player);
                // Rastgele konumlarda kahve oluştur
                if (Math.random() < 0.3) {
                    const coffee = getCoffeeFromPool();
                    if (coffee) {
                        coffee.x = random(player.radius, gameState.width - player.radius);
                        coffee.y = random(player.radius, gameState.height - player.radius);
                        coffee.dx = 0;
                        coffee.dy = 0;
                        coffee.active = true;
                        gameObjects.coffeeCups.push(coffee);
                    }
                }
            }, 500);
        },
        reset: (player) => {
            gameState.timeStopActive = false;
            gameObjects.teaCups.forEach(cup => {
                if (cup.originalDx !== undefined) {
                    cup.dx = cup.originalDx;
                    cup.dy = cup.originalDy;
                }
            });
        }
    },
    'robusta-shadowblade': {
        name: 'Shadow Clones',
        description: 'Creates 4 shadow clones that collect coffee independently',
        effect: (player) => {
            gameState.shadowClonesActive = true;
            const clonePositions = [
                { x: -1, y: -1 }, { x: 1, y: -1 },
                { x: -1, y: 1 }, { x: 1, y: 1 }
            ];
            
            const clones = clonePositions.map(pos => ({
                x: player.x + pos.x * 50,
                y: player.y + pos.y * 50,
                radius: player.radius * 0.8,
                collectRange: player.collectRange
            }));
            
            const cloneInterval = setInterval(() => {
                if (!gameState.shadowClonesActive) {
                    clearInterval(cloneInterval);
                    return;
                }
                
                clones.forEach((clone, i) => {
                    // Klonları oyuncuyu takip ettir
                    clone.x = player.x + clonePositions[i].x * 50;
                    clone.y = player.y + clonePositions[i].y * 50;
                    createShadowTrail(clone);
                    
                    // Klonların kahve toplamasını sağla
                    gameObjects.coffeeCups.forEach((cup, j) => {
                        if (!cup.active) return;
                        const dx = clone.x - cup.x;
                        const dy = clone.y - cup.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < clone.collectRange) {
                            resetCoffeeCup(cup);
                            gameObjects.coffeeCups.splice(j, 1);
                            gameState.score += 5 * gameState.level;
                            gameState.coffeeCount++;
                            createParticles(clone.x, clone.y, '#4A2C2A', 5);
                            scoreElement.textContent = gameState.score;
                            coffeeCountElement.textContent = gameState.coffeeCount;
                        }
                    });
                });
            }, 50);
        },
        reset: (player) => {
            gameState.shadowClonesActive = false;
        }
    },
    'cappuccino-templar': {
        name: 'Divine Conversion',
        description: 'Converts all tea cups into coffee and creates sacred barriers',
        effect: (player) => {
            gameState.divineConversionActive = true;
            convertTeaToCoffee();
            const barrierInterval = setInterval(() => {
                if (!gameState.divineConversionActive) {
                    clearInterval(barrierInterval);
                    return;
                }
                createSacredBarriers(player);
                // Yeni gelen çay kupalarını da kahveye çevir
                convertTeaToCoffee();
            }, 500);
        },
        reset: (player) => {
            gameState.divineConversionActive = false;
        }
    },
    'espresso-dragonlord': {
        name: 'Dragon Ascension',
        description: 'Transform into an invincible coffee dragon with massive collection range',
        effect: (player) => {
            gameState.dragonFormActive = true;
            gameState.shieldActive = true;
            player.originalRadius = player.radius;
            player.originalCollectRange = player.collectRange;
            player.radius *= 1.5;
            player.collectRange *= 5;
            
            const dragonInterval = setInterval(() => {
                if (!gameState.dragonFormActive) {
                    clearInterval(dragonInterval);
                    return;
                }
                createDragonEffects(player);
                // Otomatik kahve toplama
                gameObjects.coffeeCups.forEach((cup, i) => {
                    if (!cup.active) return;
                    const dx = player.x - cup.x;
                    const dy = player.y - cup.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < player.collectRange) {
                        resetCoffeeCup(cup);
                        gameObjects.coffeeCups.splice(i, 1);
                        gameState.score += 10 * gameState.level; // Ejderha formu bonus puan
                        gameState.coffeeCount++;
                        createParticles(player.x, player.y, '#FFD700', 5);
                        scoreElement.textContent = gameState.score;
                        coffeeCountElement.textContent = gameState.coffeeCount;
                    }
                });
            }, 100);
        },
        reset: (player) => {
            gameState.dragonFormActive = false;
            gameState.shieldActive = false;
            player.radius = player.originalRadius;
            player.collectRange = player.originalCollectRange;
        }
    }
};

// Storage Keys
const STORAGE_KEYS = {
    OWNED_CHARACTERS: 'ownedCharacters',
    PENDING_REWARDS: 'pendingRewards',
    SOUND_ENABLED: 'soundEnabled',
    HIGH_SCORE: 'coffeeAdventureHighScore'
};

// Add new visual effect functions
function createShieldEffect(player) {
    const radius = player.radius * 1.5;
    const particles = 12;
    for (let i = 0; i < particles; i++) {
        const angle = (i / particles) * Math.PI * 2;
        createParticles(
            player.x + Math.cos(angle) * radius,
            player.y + Math.sin(angle) * radius,
            '#FFD700',
            1,
            0.5
        );
    }
}

function createCoffeeVortex(player) {
    const vortexRadius = player.collectRange * 2;
    const particles = 24;
    for (let i = 0; i < particles; i++) {
        const angle = (i / particles) * Math.PI * 2;
        const x = player.x + Math.cos(angle) * vortexRadius;
        const y = player.y + Math.sin(angle) * vortexRadius;
        createParticles(x, y, '#4A2C2A', 1, 3);
    }
}

function createMagicPortals(player) {
    const portalCount = 3;
    const radius = player.collectRange * 2;
    for (let i = 0; i < portalCount; i++) {
        const angle = (i / portalCount) * Math.PI * 2;
        const x = player.x + Math.cos(angle) * radius;
        const y = player.y + Math.sin(angle) * radius;
        createPortalEffect(x, y);
    }
}

function createPortalEffect(x, y) {
    const particles = 8;
    for (let i = 0; i < particles; i++) {
        const angle = (i / particles) * Math.PI * 2;
        createParticles(
            x + Math.cos(angle) * 20,
            y + Math.sin(angle) * 20,
            '#9370DB',
            1,
            2
        );
    }
}

function createShadowClones(player) {
    const clonePositions = [
        { x: -1, y: -1 }, { x: 1, y: -1 },
        { x: -1, y: 1 }, { x: 1, y: 1 }
    ];
    
    clonePositions.forEach(pos => {
        const distance = 50;
        createParticles(
            player.x + pos.x * distance,
            player.y + pos.y * distance,
            '#000000',
            5,
            1,
            true
        );
    });
}

function createSacredBarriers(player) {
    const barrierCount = 6;
    const radius = player.collectRange * 1.5;
    for (let i = 0; i < barrierCount; i++) {
        const angle = (i / barrierCount) * Math.PI * 2;
        createParticles(
            player.x + Math.cos(angle) * radius,
            player.y + Math.sin(angle) * radius,
            '#FFF8DC',
            3,
            0.5
        );
    }
}

function createDragonTransformation(player) {
    // Create dragon wing effects
    const wingParticles = 20;
    for (let i = 0; i < wingParticles; i++) {
        const angleLeft = Math.PI + (i / wingParticles) * Math.PI / 2;
        const angleRight = Math.PI * 1.5 - (i / wingParticles) * Math.PI / 2;
        const radius = player.radius * 3;
        
        // Left wing
        createParticles(
            player.x + Math.cos(angleLeft) * radius,
            player.y + Math.sin(angleLeft) * radius,
            '#FFD700',
            1,
            2
        );
        
        // Right wing
        createParticles(
            player.x + Math.cos(angleRight) * radius,
            player.y + Math.sin(angleRight) * radius,
            '#FFD700',
            1,
            2
        );
    }
}

// Boss Constants
const BOSS_TYPES = {
    COFFEE: 'coffee-boss',
    TEA: 'tea-boss'
};

const BOSS_PROPERTIES = {
    [BOSS_TYPES.COFFEE]: {
        health: 100,
        radius: 60,
        speed: 1.5,
        bulletCount: 8,
        bulletSpeed: 2,  // Mermi hızını azalttık
        reward: 1000,
        attackInterval: 3000,
        vulnerableTime: 1000,
        maxAttacks: 2    // Level 10'dan önce varsayılan saldırı sayısı
    },
    [BOSS_TYPES.TEA]: {
        health: 80,
        radius: 50,
        speed: 2,
        bulletSpeed: 2.5,
        spreadAngle: Math.PI / 4,
        reward: 800,
        attackInterval: 2500,
        vulnerableTime: 1000,
        maxAttacks: 2    // Level 10'dan önce varsayılan saldırı sayısı
    }
};

const BOSS_SPAWN_INTERVAL = 25000; // 25 seconds

// Character Definitions
const characters = [
    { id: 0, name: "Basic Barista", key: "basic-barista", price: 0 },
    { id: 1, name: "Mocha Knight", key: "mocha-knight", price: 20000 },
    { id: 2, name: "Arabica Archmage", key: "arabica-archmage", price: 40000 },
    { id: 3, name: "Robusta Shadowblade", key: "robusta-shadowblade", price: 70000 },
    { id: 4, name: "Cappuccino Templar", key: "cappuccino-templar", price: 100000 },
    { id: 5, name: "Espresso Dragonlord", key: "espresso-dragonlord", price: 400000 }
];

// Karakter-Görsel Eşleştirmesi
const characterImageMap = {
    'basic-barista': 'basic',
    'mocha-knight': 'mocha',
    'arabica-archmage': 'arabica',
    'robusta-shadowblade': 'robusta',
    'cappuccino-templar': 'cappuccino',
    'espresso-dragonlord': 'espresso'
};

// Seviye bazlı arka plan renkleri
const LEVEL_COLORS = [
    { top: '#0f172a', middle: '#1e293b', bottom: '#0f172a' }, // Level 1
    { top: '#1a2a0f', middle: '#2b3b1e', bottom: '#1a2a0f' }, // Level 2
    { top: '#2a0f1a', middle: '#3b1e2b', bottom: '#2a0f1a' }, // Level 3
    { top: '#0f2a2a', middle: '#1e3b3b', bottom: '#0f2a2a' }, // Level 4
    { top: '#2a1a0f', middle: '#3b2b1e', bottom: '#2a1a0f' }  // Level 5
];

// Yeni kontratın tam ABI’sı
const COFFY_ABI = [
    {
        "inputs": [
            {
				"internalType": "address",
				"name": "_treasury",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_liquidityPool",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_marketing",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_team",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "AccessControlBadConfirmation",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "neededRole",
				"type": "bytes32"
			}
		],
		"name": "AccessControlUnauthorizedAccount",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "AlreadyVoted",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "CharacterNotFound",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "DailyRewardLimitExceeded",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidAddress",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotDAOMember",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotInflationTime",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NothingStaked",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "ProposalNotFound",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "StakingPeriodNotMet",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "ZeroAmount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "characterId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "CharacterBought",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "GameRewardsClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "InflationMinted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Paused",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint32",
				"name": "proposalId",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			}
		],
		"name": "ProposalCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "previousAdminRole",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "newAdminRole",
				"type": "bytes32"
			}
		],
		"name": "RoleAdminChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Staked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "StakingRewardClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "burner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TokensBurned",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Unpaused",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint32",
				"name": "proposalId",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			}
		],
		"name": "VoteCast",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "ANNUAL_INFLATION_RATE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ANNUAL_STAKING_RATE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "BLOCKS_PER_DAY",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DEFAULT_ADMIN_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ESPRESSO_MAGE_PRICE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "LATTE_WARRIOR_PRICE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "LEGENDARY_DRAGON_PRICE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "LIQUIDITY_AMOUNT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MARKETING_AMOUNT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAX_DAILY_REWARD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MINIMUM_STAKE_TIME",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MIN_TREASURY_RESERVE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "PALADIN_PRICE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ROGUE_PRICE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "SECONDS_IN_YEAR",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "TEAM_AMOUNT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "TREASURY_AMOUNT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "adminBurn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "characterId",
				"type": "uint256"
			}
		],
		"name": "buyCharacter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "calculatePendingReward",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "canTriggerInflation",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "characters",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "claimGameRewards",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimStakingReward",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"name": "createProposal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "dailyClaims",
		"outputs": [
			{
				"internalType": "uint48",
				"name": "lastClaimTime",
				"type": "uint48"
			},
			{
				"internalType": "uint208",
				"name": "claimedToday",
				"type": "uint208"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "characterId",
				"type": "uint256"
			}
		],
		"name": "getCharacter",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getDailyRewardLimit",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getInflationRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMinimumStakeTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getProposalCount",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "proposalId",
				"type": "uint32"
			}
		],
		"name": "getProposalInfo",
		"outputs": [
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint32",
				"name": "voteCount",
				"type": "uint32"
			},
			{
				"internalType": "bool",
				"name": "executed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "proposalId",
				"type": "uint32"
			}
		],
		"name": "getProposalVotes",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			}
		],
		"name": "getRoleAdmin",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getStakeInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "stakedAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pendingReward",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakingDuration",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getStakingAPY",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalStaked",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "grantRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasBoughtLegendaryDragon",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "hasRole",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "proposalId",
				"type": "uint32"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "isDAOMember",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastInflationTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "proposalCount",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"name": "proposals",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "id",
				"type": "uint32"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint32",
				"name": "voteCount",
				"type": "uint32"
			},
			{
				"internalType": "bool",
				"name": "executed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "callerConfirmation",
				"type": "address"
			}
		],
		"name": "renounceRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "revokeRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "stake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "stakes",
		"outputs": [
			{
				"internalType": "uint208",
				"name": "amount",
				"type": "uint208"
			},
			{
				"internalType": "uint48",
				"name": "startTime",
				"type": "uint48"
			},
			{
				"internalType": "uint48",
				"name": "lastRewardClaim",
				"type": "uint48"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalStaked",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "treasury",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "triggerInflation",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unpause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "unstake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "proposalId",
				"type": "uint32"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

// DOM Elemanları
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const loadingScreen = document.getElementById('loading-screen');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const pauseScreen = document.getElementById('pause-screen');
const bossHealthBar = document.getElementById('boss-health-bar');
const bossHealthFill = document.getElementById('boss-health-fill');
const bossNameDisplay = document.getElementById('boss-name');
const connectWalletButton = document.getElementById('connect-wallet');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const resumeButton = document.getElementById('resume-button');
const claimTotalRewardButton = document.getElementById('claim-total-reward');
const mainMenuRewardButton = document.getElementById('main-menu-reward-button');
const finalScoreElement = document.getElementById('final-score');
const highScoreElement = document.getElementById('high-score');
const rewardElement = document.getElementById('reward');
const totalRewardElement = document.getElementById('total-reward');
const totalRewardsHudElement = document.getElementById('total-rewards-hud');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const coffeeCountElement = document.getElementById('coffee-count');
const tokenCountElement = document.getElementById('token-count');
const walletAddressElement = document.getElementById('wallet-address');
const hudElement = document.getElementById('hud');
const backgroundMusic = document.getElementById('background-music');
const collectSound = document.getElementById('collect-sound');
const levelUpSound = document.getElementById('levelup-sound');
const gameOverSound = document.getElementById('gameover-sound');

const IMAGE_CACHE = {};
const POWERUP_TYPES = { SHIELD: 'shield', SPEED: 'speed', MAGNET: 'magnet' };
const SKILL_TREE = {
    speed: { level: 0, maxLevel: 3, cost: 20, increment: 1 },
    range: { level: 0, maxLevel: 3, cost: 25, increment: 10 }
};

// Object Pools
const coffeePool = Array(MAX_COFFEE_CUPS).fill().map(() => ({
    x: 0, y: 0, radius: CUP_RADIUS, dx: 0, dy: 0, rotation: 0, rotationSpeed: 0, active: false
}));
const teaPool = Array(MAX_TEA_CUPS).fill().map(() => ({
    x: 0, y: 0, radius: CUP_RADIUS, dx: 0, dy: 0, rotation: 0, rotationSpeed: 0, active: false
}));
const particlePool = Array(MAX_PARTICLES).fill().map(() => ({
    x: 0, y: 0, radius: 0, dx: 0, dy: 0, alpha: 0, color: '', life: 0, active: false
}));

// Game State
const gameState = {
    width: 0,
    height: 0,
    isPaused: false,
    isStarted: false,
    isOver: false,
    isLoading: true,
    score: 0,
    level: 1,
    coffeeCount: 0,
    tokenCount: 0,
    pendingRewards: 0,
    highScore: decryptLocalStorage('coffeeAdventureHighScore') || 0,
    backgroundOffset: 0,
    lastFrameTime: 0,
    lastCoffeeTime: 0,
    lastTeaTime: 0,
    lastShieldTime: 0,
    keysPressed: {},
    walletConnected: false,
    walletAddress: null,
    provider: null,
    signer: null,
    tokenContract: null,
    musicEnabled: true,
    shieldActive: false,
    shieldTimer: 0,
    speedBoostActive: false,
    speedBoostTimer: 0,
    magnetActive: false,
    magnetTimer: 0,
    comboCount: 0,
    currentCharacter: 'basic-barista',
    ownedCharacters: ['basic-barista'],
    touchSensitivity: 0.1,
    lastBossTime: 0,
    activeBoss: null,
    lastSuperpowerTime: 0,
    superpowerActive: false,
    soundEnabled: localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED) !== 'false',
};

// Game Objects
const gameObjects = {
    player: { x: 0, y: 0, radius: PLAYER_RADIUS, speed: 8, collectRange: PLAYER_RADIUS, smileTimer: 0, currentImage: null },
    coffeeCups: [],
    teaCups: [],
    powerUps: [],
    particles: [],
    bossBullets: []
};

// SVG Görseller (Sad emojiler eklendi)
const SVG_URLS = {
    playerNormal_basic: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradBasic" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#F5F5F5;stop-opacity:1" /><stop offset="100%" style="stop-color:#A9A9A9;stop-opacity:1" /></radialGradient><filter id="shadowBasic"><feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.5"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradBasic)" stroke="#777" stroke-width="3" filter="url(#shadowBasic)" /><path d="M35 35 H65" stroke="#333" stroke-width="4" /><circle cx="40" cy="50" r="5" fill="#333" /><circle cx="60" cy="50" r="5" fill="#333" /><path d="M45 70 H55" stroke="#333" stroke-width="4" /><path d="M40 20 L60 30" stroke="#FFD700" stroke-width="2" fill="none" /></svg>'),
    playerSmiling_basic: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradBasicSmile" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#F5F5F5;stop-opacity:1" /><stop offset="100%" style="stop-color:#A9A9A9;stop-opacity:1" /></radialGradient><filter id="shadowBasicSmile"><feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.5"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradBasicSmile)" stroke="#777" stroke-width="3" filter="url(#shadowBasicSmile)" /><path d="M35 35 Q50 30 65 35" stroke="#333" stroke-width="4" fill="none" /><circle cx="40" cy="50" r="5" fill="#333" /><circle cx="60" cy="50" r="5" fill="#333" /><path d="M40 70 Q50 80 60 70" stroke="#333" stroke-width="5" fill="none" /><path d="M40 20 L60 30" stroke="#FFD700" stroke-width="2" fill="none" /></svg>'),
    playerSad_basic: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradBasicSad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#F5F5F5;stop-opacity:1" /><stop offset="100%" style="stop-color:#A9A9A9;stop-opacity:1" /></radialGradient><filter id="shadowBasicSad"><feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.5"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradBasicSad)" stroke="#777" stroke-width="3" filter="url(#shadowBasicSad)" /><path d="M35 45 Q50 50 65 45" stroke="#333" stroke-width="4" fill="none" /><circle cx="40" cy="50" r="5" fill="#333" /><circle cx="60" cy="50" r="5" fill="#333" /><path d="M45 70 H55" stroke="#333" stroke-width="4" /><path d="M40 20 L60 30" stroke="#FFD700" stroke-width="2" fill="none" /></svg>'),
    playerNormal_mocha: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradMocha" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#A0522D;stop-opacity:1" /><stop offset="100%" style="stop-color:#5C2F1A;stop-opacity:1" /></radialGradient><filter id="shadowMocha"><feDropShadow dx="3" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.6"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradMocha)" stroke="#3C1F12" stroke-width="3" filter="url(#shadowMocha)" /><path d="M35 35 H65" stroke="#000" stroke-width="4" /><rect x="35" y="45" width="10" height="6" fill="#000" /><rect x="55" y="45" width="10" height="6" fill="#000" /><path d="M45 70 H55" stroke="#000" stroke-width="4" /><path d="M30 20 L40 35 M70 20 L60 35" stroke="#FFD700" stroke-width="3" /><path d="M40 15 Q50 10 60 15" stroke="#FFD700" stroke-width="2" fill="none" /></svg>'),
    playerSmiling_mocha: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradMochaSmile" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#A0522D;stop-opacity:1" /><stop offset="100%" style="stop-color:#5C2F1A;stop-opacity:1" /></radialGradient><filter id="shadowMochaSmile"><feDropShadow dx="3" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.6"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradMochaSmile)" stroke="#3C1F12" stroke-width="3" filter="url(#shadowMochaSmile)" /><path d="M35 35 Q50 30 65 35" stroke="#000" stroke-width="4" fill="none" /><rect x="35" y="45" width="10" height="6" fill="#000" /><rect x="55" y="45" width="10" height="6" fill="#000" /><path d="M40 70 Q50 80 60 70" stroke="#000" stroke-width="5" fill="none" /><path d="M30 20 L40 35 M70 20 L60 35" stroke="#FFD700" stroke-width="3" /><path d="M40 15 Q50 10 60 15" stroke="#FFD700" stroke-width="2" fill="none" /></svg>'),
    playerSad_mocha: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradMochaSad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#A0522D;stop-opacity:1" /><stop offset="100%" style="stop-color:#5C2F1A;stop-opacity:1" /></radialGradient><filter id="shadowMochaSad"><feDropShadow dx="3" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.6"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradMochaSad)" stroke="#3C1F12" stroke-width="3" filter="url(#shadowMochaSad)" /><path d="M35 45 Q50 50 65 45" stroke="#000" stroke-width="4" fill="none" /><rect x="35" y="45" width="10" height="6" fill="#000" /><rect x="55" y="45" width="10" height="6" fill="#000" /><path d="M45 70 H55" stroke="#000" stroke-width="4" /><path d="M30 20 L40 35 M70 20 L60 35" stroke="#FFD700" stroke-width="3" /><path d="M40 15 Q50 10 60 15" stroke="#FFD700" stroke-width="2" fill="none" /></svg>'),
    playerNormal_arabica: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradArabica" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#D2B48C;stop-opacity:1" /><stop offset="100%" style="stop-color:#8B5A2B;stop-opacity:1" /></radialGradient><filter id="shadowArabica"><feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.5"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradArabica)" stroke="#5C3A1C" stroke-width="3" filter="url(#shadowArabica)" /><path d="M35 35 H65" stroke="#000" stroke-width="4" /><rect x="35" y="45" width="10" height="6" fill="#000" /><rect x="55" y="45" width="10" height="6" fill="#000" /><path d="M45 70 H55" stroke="#000" stroke-width="4" /><path d="M40 20 Q50 10 60 20" stroke="#FFD700" stroke-width="3" fill="none" /><circle cx="50" cy="15" r="5" fill="#FFD700" /></svg>'),
    playerSmiling_arabica: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradArabicaSmile" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#D2B48C;stop-opacity:1" /><stop offset="100%" style="stop-color:#8B5A2B;stop-opacity:1" /></radialGradient><filter id="shadowArabicaSmile"><feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.5"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradArabicaSmile)" stroke="#5C3A1C" stroke-width="3" filter="url(#shadowArabicaSmile)" /><path d="M35 35 Q50 30 65 35" stroke="#000" stroke-width="4" fill="none" /><rect x="35" y="45" width="10" height="6" fill="#000" /><rect x="55" y="45" width="10" height="6" fill="#000" /><path d="M40 70 Q50 80 60 70" stroke="#000" stroke-width="5" fill="none" /><path d="M40 20 Q50 10 60 20" stroke="#FFD700" stroke-width="3" fill="none" /><circle cx="50" cy="15" r="5" fill="#FFD700" /></svg>'),
    playerSad_arabica: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradArabicaSad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#D2B48C;stop-opacity:1" /><stop offset="100%" style="stop-color:#8B5A2B;stop-opacity:1" /></radialGradient><filter id="shadowArabicaSad"><feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.5"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradArabicaSad)" stroke="#5C3A1C" stroke-width="3" filter="url(#shadowArabicaSad)" /><path d="M35 45 Q50 50 65 45" stroke="#000" stroke-width="4" fill="none" /><rect x="35" y="45" width="10" height="6" fill="#000" /><rect x="55" y="45" width="10" height="6" fill="#000" /><path d="M45 70 H55" stroke="#000" stroke-width="4" /><path d="M40 20 Q50 10 60 20" stroke="#FFD700" stroke-width="3" fill="none" /><circle cx="50" cy="15" r="5" fill="#FFD700" /></svg>'),
    playerNormal_robusta: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradRobusta" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#5C4033;stop-opacity:1" /><stop offset="100%" style="stop-color:#2F1F1A;stop-opacity:1" /></radialGradient><filter id="shadowRobusta"><feDropShadow dx="3" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.6"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradRobusta)" stroke="#1F1512" stroke-width="3" filter="url(#shadowRobusta)" /><path d="M35 35 H65" stroke="#FFF" stroke-width="4" /><circle cx="40" cy="50" r="5" fill="#FFF" /><circle cx="60" cy="50" r="5" fill="#FFF" /><path d="M45 70 H55" stroke="#FFF" stroke-width="4" /><path d="M30 25 L40 40 M70 25 L60 40" stroke="#FFD700" stroke-width="3" /><path d="M35 15 L65 25" stroke="#FFD700" stroke-width="2" fill="none" /></svg>'),
    playerSmiling_robusta: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradRobustaSmile" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#5C4033;stop-opacity:1" /><stop offset="100%" style="stop-color:#2F1F1A;stop-opacity:1" /></radialGradient><filter id="shadowRobustaSmile"><feDropShadow dx="3" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.6"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradRobustaSmile)" stroke="#1F1512" stroke-width="3" filter="url(#shadowRobustaSmile)" /><path d="M35 35 Q50 30 65 35" stroke="#FFF" stroke-width="4" fill="none" /><circle cx="40" cy="50" r="5" fill="#FFF" /><circle cx="60" cy="50" r="5" fill="#FFF" /><path d="M40 70 Q50 80 60 70" stroke="#FFF" stroke-width="5" fill="none" /><path d="M30 25 L40 40 M70 25 L60 40" stroke="#FFD700" stroke-width="3" /><path d="M35 15 L65 25" stroke="#FFD700" stroke-width="2" fill="none" /></svg>'),
    playerSad_robusta: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradRobustaSad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#5C4033;stop-opacity:1" /><stop offset="100%" style="stop-color:#2F1F1A;stop-opacity:1" /></radialGradient><filter id="shadowRobustaSad"><feDropShadow dx="3" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.6"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradRobustaSad)" stroke="#1F1512" stroke-width="3" filter="url(#shadowRobustaSad)" /><path d="M35 45 Q50 50 65 45" stroke="#FFF" stroke-width="4" fill="none" /><circle cx="40" cy="50" r="5" fill="#FFF" /><circle cx="60" cy="50" r="5" fill="#FFF" /><path d="M45 70 H55" stroke="#FFF" stroke-width="4" /><path d="M30 25 L40 40 M70 25 L60 40" stroke="#FFD700" stroke-width="3" /><path d="M35 15 L65 25" stroke="#FFD700" stroke-width="2" fill="none" /></svg>'),
    playerNormal_cappuccino: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradCappuccino" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#FFFACD;stop-opacity:1" /><stop offset="100%" style="stop-color:#DAA520;stop-opacity:1" /></radialGradient><filter id="shadowCappuccino"><feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.5"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradCappuccino)" stroke="#B8860B" stroke-width="3" filter="url(#shadowCappuccino)" /><path d="M35 35 H65" stroke="#000" stroke-width="4" /><polygon points="40,45 44,53 36,49 44,49 40,53" fill="#FFD700" /><polygon points="60,45 64,53 56,49 64,49 60,53" fill="#FFD700" /><path d="M45 70 H55" stroke="#000" stroke-width="4" /><path d="M45 20 Q50 10 55 20" stroke="#FFD700" stroke-width="3" fill="none" /><circle cx="50" cy="15" r="4" fill="#FFD700" /></svg>'),
    playerSmiling_cappuccino: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradCappuccinoSmile" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#FFFACD;stop-opacity:1" /><stop offset="100%" style="stop-color:#DAA520;stop-opacity:1" /></radialGradient><filter id="shadowCappuccinoSmile"><feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.5"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradCappuccinoSmile)" stroke="#B8860B" stroke-width="3" filter="url(#shadowCappuccinoSmile)" /><path d="M35 35 Q50 30 65 35" stroke="#000" stroke-width="4" fill="none" /><polygon points="40,45 44,53 36,49 44,49 40,53" fill="#FFD700" /><polygon points="60,45 64,53 56,49 64,49 60,53" fill="#FFD700" /><path d="M40 70 Q50 80 60 70" stroke="#000" stroke-width="5" fill="none" /><path d="M45 20 Q50 10 55 20" stroke="#FFD700" stroke-width="3" fill="none" /><circle cx="50" cy="15" r="4" fill="#FFD700" /></svg>'),
    playerSad_cappuccino: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradCappuccinoSad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#FFFACD;stop-opacity:1" /><stop offset="100%" style="stop-color:#DAA520;stop-opacity:1" /></radialGradient><filter id="shadowCappuccinoSad"><feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.5"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradCappuccinoSad)" stroke="#B8860B" stroke-width="3" filter="url(#shadowCappuccinoSad)" /><path d="M35 45 Q50 50 65 45" stroke="#000" stroke-width="4" fill="none" /><polygon points="40,45 44,53 36,49 44,49 40,53" fill="#FFD700" /><polygon points="60,45 64,53 56,49 64,49 60,53" fill="#FFD700" /><path d="M45 70 H55" stroke="#000" stroke-width="4" /><path d="M45 20 Q50 10 55 20" stroke="#FFD700" stroke-width="3" fill="none" /><circle cx="50" cy="15" r="4" fill="#FFD700" /></svg>'),
    playerNormal_espresso: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradEspresso" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#4A2C2A;stop-opacity:1" /><stop offset="100%" style="stop-color:#1F1211;stop-opacity:1" /></radialGradient><filter id="shadowEspresso"><feDropShadow dx="3" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.7"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradEspresso)" stroke="#1F1211" stroke-width="4" filter="url(#shadowEspresso)" /><path d="M35 35 H65" stroke="#FFD700" stroke-width="4" /><circle cx="40" cy="50" r="6" fill="#FFD700" /><circle cx="60" cy="50" r="6" fill="#FFD700" /><path d="M45 70 H55" stroke="#FFD700" stroke-width="4" /><path d="M20 20 L30 35 M80 20 L70 35" stroke="#FFD700" stroke-width="5" /><path d="M30 10 Q50 0 70 10" stroke="#FFD700" stroke-width="3" fill="none" /><path d="M25 15 L35 25 M75 15 L65 25" stroke="#FFD700" stroke-width="2" fill="none" /></svg>'),
    playerSmiling_espresso: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradEspressoSmile" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#4A2C2A;stop-opacity:1" /><stop offset="100%" style="stop-color:#1F1211;stop-opacity:1" /></radialGradient><filter id="shadowEspressoSmile"><feDropShadow dx="3" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.7"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradEspressoSmile)" stroke="#1F1211" stroke-width="4" filter="url(#shadowEspressoSmile)" /><path d="M35 35 Q50 30 65 35" stroke="#FFD700" stroke-width="4" fill="none" /><circle cx="40" cy="50" r="6" fill="#FFD700" /><circle cx="60" cy="50" r="6" fill="#FFD700" /><path d="M40 70 Q50 80 60 70" stroke="#FFD700" stroke-width="5" fill="none" /><path d="M20 20 L30 35 M80 20 L70 35" stroke="#FFD700" stroke-width="5" /><path d="M30 10 Q50 0 70 10" stroke="#FFD700" stroke-width="3" fill="none" /><path d="M25 15 L35 25 M75 15 L65 25" stroke="#FFD700" stroke-width="2" fill="none" /></svg>'),
    playerSad_espresso: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradEspressoSad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style="stop-color:#4A2C2A;stop-opacity:1" /><stop offset="100%" style="stop-color:#1F1211;stop-opacity:1" /></radialGradient><filter id="shadowEspressoSad"><feDropShadow dx="3" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.7"/></filter></defs><circle cx="50" cy="50" r="40" fill="url(#gradEspressoSad)" stroke="#1F1211" stroke-width="4" filter="url(#shadowEspressoSad)" /><path d="M35 45 Q50 50 65 45" stroke="#FFD700" stroke-width="4" fill="none" /><circle cx="40" cy="50" r="6" fill="#FFD700" /><circle cx="60" cy="50" r="6" fill="#FFD700" /><path d="M45 70 H55" stroke="#FFD700" stroke-width="4" /><path d="M20 20 L30 35 M80 20 L70 35" stroke="#FFD700" stroke-width="5" /><path d="M30 10 Q50 0 70 10" stroke="#FFD700" stroke-width="3" fill="none" /><path d="M25 15 L35 25 M75 15 L65 25" stroke="#FFD700" stroke-width="2" fill="none" /></svg>'),
    coffeeCup: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="40" width="40" height="40" fill="#F5F5F5" rx="5" stroke="#AAA" stroke-width="1" /><ellipse cx="50" cy="40" rx="20" ry="5" fill="#4A2C2A" /><path d="M70 50 C80 50 85 60 80 70" stroke="#000" stroke-width="2" fill="none" /><path d="M45 50 Q50 65 55 50" stroke="#4A2C2A" stroke-width="3" fill="none" /></svg>'),
    teaCup: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="40" width="40" height="40" fill="#DAA520" rx="5" stroke="#AA8500" stroke-width="1" /><ellipse cx="50" cy="40" rx="20" ry="5" fill="#8B4513" /><path d="M70 50 C80 50 85 60 80 70" stroke="#000" stroke-width="2" fill="none" /><path d="M45 50 Q50 65 55 50" stroke="#8B4513" stroke-width="3" fill="none" /></svg>'),
    shieldCoin: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#FFD700" stroke="#DAA520" stroke-width="2" /><text x="50" y="60" font-size="40" fill="#000" text-anchor="middle" font-family="Arial">C</text></svg>'),
    speedBoost: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#00FF00" stroke="#00CC00" stroke-width="2" /><path d="M30 50 H70 M50 30 V70" stroke="#000" stroke-width="4"/></svg>'),
    magnet: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#FF00FF" stroke="#CC00CC" stroke-width="2" /><path d="M30 30 Q50 50 70 30 M30 70 Q50 50 70 70" stroke="#000" stroke-width="3" fill="none"/></svg>'),
    coffeeBoss: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="coffeeBossGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#8B4513"/>
                    <stop offset="100%" style="stop-color:#4A2C2A"/>
                </radialGradient>
                <filter id="bossGlow">
                    <feGaussianBlur stdDeviation="2" result="glow"/>
                    <feMerge>
                        <feMergeNode in="glow"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <!-- Ana gövde -->
            <path d="M50,100 C50,50 150,50 150,100 C150,150 50,150 50,100" 
                  fill="url(#coffeeBossGrad)" stroke="#2C1810" stroke-width="5"/>
            <!-- Kafa tacı -->
            <path d="M60,50 L100,30 L140,50 L130,60 L100,45 L70,60 Z" 
                  fill="#FFD700" stroke="#DAA520" stroke-width="3" filter="url(#bossGlow)"/>
            <!-- Gözler -->
            <ellipse cx="80" cy="90" rx="12" ry="15" fill="#FFD700"/>
            <ellipse cx="120" cy="90" rx="12" ry="15" fill="#FFD700"/>
            <circle cx="80" cy="90" r="6" fill="#2C1810"/>
            <circle cx="120" cy="90" r="6" fill="#2C1810"/>
            <!-- Ağız -->
            <path d="M70,120 Q100,140 130,120" stroke="#FFD700" stroke-width="6" fill="none"/>
            <!-- Dekoratif detaylar -->
            <path d="M40,80 L60,70 M160,80 L140,70" stroke="#FFD700" stroke-width="3"/>
            <circle cx="100" cy="70" r="5" fill="#FFD700"/>
        </svg>
    `),
    
    teaBoss: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="teaBossGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#DAA520"/>
                    <stop offset="100%" style="stop-color:#8B4513"/>
                </radialGradient>
                <filter id="teaGlow">
                    <feGaussianBlur stdDeviation="2" result="glow"/>
                    <feMerge>
                        <feMergeNode in="glow"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <!-- Ana gövde -->
            <path d="M40,100 C40,40 160,40 160,100 C160,160 40,160 40,100" 
                  fill="url(#teaBossGrad)" stroke="#654321" stroke-width="5"/>
            <!-- Çay yaprağı şeklinde taç -->
            <path d="M80,40 Q100,20 120,40 Q140,30 130,50 Q100,35 70,50 Q60,30 80,40" 
                  fill="#228B22" stroke="#006400" stroke-width="3" filter="url(#teaGlow)"/>
            <!-- Gözler -->
            <path d="M70,85 Q80,80 90,85 Q80,95 70,85" fill="#2C1810"/>
            <path d="M110,85 Q120,80 130,85 Q120,95 110,85" fill="#2C1810"/>
            <!-- Ağız -->
            <path d="M80,120 Q100,140 120,120 Q100,130 80,120" 
                  fill="#2C1810" stroke="#654321" stroke-width="2"/>
            <!-- Dekoratif detaylar -->
            <path d="M50,70 S65,60 80,70" stroke="#228B22" stroke-width="3" fill="none"/>
            <path d="M120,70 S135,60 150,70" stroke="#228B22" stroke-width="3" fill="none"/>
        </svg>
    `)
};
// Yardımcı Fonksiyonlar
function encryptData(data) { return btoa(JSON.stringify(data)); }
function decryptData(data) { try { return JSON.parse(atob(data)); } catch { return null; } }
function encryptLocalStorage(key, value) { localStorage.setItem(key, encryptData(value)); }
function decryptLocalStorage(key) { const value = localStorage.getItem(key); return value ? decryptData(value) : null; }
function random(min, max) { return Math.random() * (max - min) + min; }
function distanceSquared(obj1, obj2) { const dx = obj1.x - obj2.x; const dy = obj1.y - obj2.y; return dx * dx + dy * dy; }
function checkCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Çarpışma toleransını ayarla
    const collisionTolerance = 0.8; // 0.8 = %80 hassasiyet
    const effectiveRadius = (obj1.radius + obj2.radius) * collisionTolerance;
    
    return distance < effectiveRadius;
}
function isOutOfBounds(obj, padding = 100) { return (obj.x < -padding || obj.x > gameState.width + padding || obj.y < -padding || obj.y > gameState.height + padding); }

function loadOwnedCharacters() {
    try {
        const owned = localStorage.getItem(STORAGE_KEYS.OWNED_CHARACTERS);
        if (owned) {
            const parsed = JSON.parse(owned);
            if (Array.isArray(parsed)) {
                gameState.ownedCharacters = parsed;
            } else {
                gameState.ownedCharacters = ['basic-barista'];
                saveOwnedCharacters();
            }
        } else {
            gameState.ownedCharacters = ['basic-barista'];
            saveOwnedCharacters();
        }

        const savedRewards = localStorage.getItem(STORAGE_KEYS.PENDING_REWARDS);
        if (savedRewards) {
            const rewards = parseFloat(savedRewards);
            if (!isNaN(rewards)) {
                gameState.pendingRewards = rewards;
                totalRewardElement.textContent = rewards.toFixed(2);
                totalRewardsHudElement.textContent = rewards.toFixed(2);
            }
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
        gameState.ownedCharacters = ['basic-barista'];
        gameState.pendingRewards = 0;
        saveOwnedCharacters();
    }
}

function saveOwnedCharacters() {
    try {
        localStorage.setItem(STORAGE_KEYS.OWNED_CHARACTERS, JSON.stringify(gameState.ownedCharacters));
    } catch (error) {
        console.error('Error saving characters:', error);
    }
}

function savePendingRewards() {
    try {
        localStorage.setItem(STORAGE_KEYS.PENDING_REWARDS, gameState.pendingRewards.toString());
    } catch (error) {
        console.error('Error saving rewards:', error);
    }
}

function saveHighScore(score) {
    const currentHighScore = decryptLocalStorage('coffeeAdventureHighScore') || 0;
    if (score > currentHighScore) {
        encryptLocalStorage('coffeeAdventureHighScore', score);
        gameState.highScore = score;
        return true;
    }
    gameState.highScore = currentHighScore;
    return false;
}

function resizeCanvas() {
    gameState.width = window.innerWidth;
    gameState.height = window.innerHeight;
    canvas.width = gameState.width;
    canvas.height = gameState.height;
    if (!gameState.isStarted || gameState.isOver) {
        gameObjects.player.x = gameState.width / 2;
        gameObjects.player.y = gameState.height - 100;
    }
    constrainPlayerPosition();
}

function constrainPlayerPosition() {
    const player = gameObjects.player;
    player.x = Math.max(player.radius, Math.min(gameState.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(gameState.height - player.radius, player.y));
}

function preloadImages() {
    const imagePromises = [];
    function loadImage(key, url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => { IMAGE_CACHE[key] = img; resolve(); };
            img.onerror = () => { console.error(`Image failed to load: ${key}`); resolve(); };
            img.src = url;
        });
    }
    for (const [key, url] of Object.entries(SVG_URLS)) {
        imagePromises.push(loadImage(key, url));
    }
    return Promise.all(imagePromises);
}

async function checkOwnedCharacters() {
    try {
        if (!gameState.walletConnected || !gameState.tokenContract) return;
        const filter = gameState.tokenContract.filters.CharacterBought(gameState.walletAddress, null);
        const events = await gameState.tokenContract.queryFilter(filter);
        events.forEach(event => {
            const characterId = event.args.characterId.toNumber();
            const character = characters.find(c => c.id === characterId);
            if (character && !gameState.ownedCharacters.includes(character.key) && character.key !== 'basic-barista') {
                gameState.ownedCharacters.push(character.key);
                saveOwnedCharacters();
            }
        });
        updateCharacterButtons();
    } catch (error) {
        console.error("checkOwnedCharacters error:", error);
    }
}

function updateCharacterButtons() {
    characters.forEach(character => {
        const button = document.getElementById(`character-${character.id}`);
        if (!button) return;
        if (character.key === 'basic-barista' || gameState.ownedCharacters.includes(character.key)) {
            button.textContent = gameState.currentCharacter === character.key ? "Selected" : "Select";
            button.disabled = gameState.currentCharacter === character.key;
        } else {
            button.textContent = "Buy";
            button.disabled = false;
        }
    });
}

async function connectWallet() {
    try {
        if (!window.ethereum) throw new Error('No Web3 wallet found.');
        gameState.provider = new ethers.providers.Web3Provider(window.ethereum);
        await gameState.provider.send("eth_requestAccounts", []);
        const network = await gameState.provider.getNetwork();
        if (network.chainId !== parseInt(BSC_CHAIN_ID, 16)) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: BSC_CHAIN_ID }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: BSC_CHAIN_ID,
                            chainName: 'Binance Smart Chain Mainnet',
                            nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                            rpcUrls: ['https://bsc-dataseed.binance.org/'],
                            blockExplorerUrls: ['https://bscscan.com']
                        }],
                    });
                } else throw switchError;
            }
            gameState.provider = new ethers.providers.Web3Provider(window.ethereum);
        }
        gameState.signer = gameState.provider.getSigner();
        gameState.walletAddress = await gameState.signer.getAddress();
        gameState.tokenContract = new ethers.Contract(TOKEN_ADDRESS, COFFY_ABI, gameState.signer);
        gameState.walletConnected = true;
        walletAddressElement.textContent = `${gameState.walletAddress.slice(0, 6)}...${gameState.walletAddress.slice(-4)}`;
        connectWalletButton.style.display = 'none';
        const balance = await gameState.tokenContract.balanceOf(gameState.walletAddress);
        gameState.tokenCount = ethers.utils.formatUnits(balance, 18);
        tokenCountElement.textContent = parseFloat(gameState.tokenCount).toFixed(2);
        totalRewardElement.textContent = gameState.pendingRewards.toFixed(2);
        totalRewardsHudElement.textContent = gameState.pendingRewards.toFixed(2);
        await checkOwnedCharacters();
        alert("Wallet connected successfully!");
    } catch (error) {
        console.error("Wallet connection error:", error);
        alert(`Error: ${error.message || "Unknown error"}`);
        gameState.walletConnected = false;
    }
}

async function claimTotalReward() {
    try {
        if (!gameState.walletConnected || gameState.pendingRewards === 0) throw new Error("No rewards or wallet not connected");
        const confirmClaim = confirm(`Do you want to claim ${gameState.pendingRewards} COFFY?`);
        if (!confirmClaim) return;
        claimTotalRewardButton.disabled = true;
        const weiAmount = ethers.utils.parseUnits(gameState.pendingRewards.toString(), 18);
        const gasEstimate = await gameState.tokenContract.estimateGas.claimGameRewards(weiAmount).catch(() => ethers.BigNumber.from("300000"));
        const tx = await gameState.tokenContract.claimGameRewards(weiAmount, { gasLimit: gasEstimate.mul(120).div(100) });
        await tx.wait();
        gameState.pendingRewards = 0;
        savePendingRewards();
        totalRewardElement.textContent = gameState.pendingRewards.toFixed(2);
        totalRewardsHudElement.textContent = gameState.pendingRewards.toFixed(2);
        alert("Rewards claimed successfully!");
    } catch (error) {
        console.error("Reward claim error:", error);
        alert(`Error: ${error.message || "Unknown error"}`);
    } finally {
        claimTotalRewardButton.disabled = false;
    }
}

// Object Pool Functions
function getCoffeeFromPool() {
    for (let i = 0; i < coffeePool.length; i++) {
        if (!coffeePool[i].active) {
            coffeePool[i].active = true;
            return coffeePool[i];
        }
    }
    const newCup = { x: 0, y: 0, radius: CUP_RADIUS, dx: 0, dy: 0, rotation: 0, rotationSpeed: 0, active: true };
    coffeePool.push(newCup);
    return newCup;
}

function resetCoffeeCup(cup) {
    cup.active = false;
    cup.x = 0;
    cup.y = 0;
    cup.dx = 0;
    cup.dy = 0;
    cup.rotation = 0;
}

function getTeaFromPool() {
    for (let i = 0; i < teaPool.length; i++) {
        if (!teaPool[i].active) {
            teaPool[i].active = true;
            return teaPool[i];
        }
    }
    const newCup = { x: 0, y: 0, radius: CUP_RADIUS, dx: 0, dy: 0, rotation: 0, rotationSpeed: 0, active: true };
    teaPool.push(newCup);
    return newCup;
}

function resetTeaCup(cup) {
    cup.active = false;
    cup.x = 0;
    cup.y = 0;
    cup.dx = 0;
    cup.dy = 0;
    cup.rotation = 0;
}

function getParticleFromPool() {
    for (let i = 0; i < particlePool.length; i++) {
        if (!particlePool[i].active) {
            particlePool[i].active = true;
            return particlePool[i];
        }
    }
    const newParticle = { x: 0, y: 0, radius: 0, dx: 0, dy: 0, alpha: 0, color: '', life: 0, active: true };
    particlePool.push(newParticle);
    return newParticle;
}

function resetParticle(particle) {
    particle.active = false;
    particle.x = 0;
    particle.y = 0;
    particle.dx = 0;
    particle.dy = 0;
    particle.alpha = 0;
    particle.life = 0;
}

// Input Controls
function setupMouseControls() {
    document.addEventListener('mousemove', (event) => {
        if (gameState.isStarted && !gameState.isOver && !gameState.isPaused) {
            gameObjects.player.x = event.clientX;
            gameObjects.player.y = event.clientY;
            constrainPlayerPosition();
        }
    });
}

function setupTouchControls() {
    let touchStartX = 0, touchStartY = 0;
    document.addEventListener('touchstart', (event) => {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, { passive: false });

    document.addEventListener('touchmove', (event) => {
        if (gameState.isStarted && !gameState.isOver && !gameState.isPaused) {
            const touch = event.touches[0];
            const deltaX = (touch.clientX - touchStartX) * gameState.touchSensitivity;
            const deltaY = (touch.clientY - touchStartY) * gameState.touchSensitivity;
            const speed = gameState.speedBoostActive ? gameObjects.player.speed * 1.3 : gameObjects.player.speed;
            gameObjects.player.x += deltaX * speed;
            gameObjects.player.y += deltaY * speed;
            constrainPlayerPosition();
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            event.preventDefault();
        }
    }, { passive: false });

    let doubleTapTimer = null;
    document.addEventListener('touchstart', (event) => {
        if (doubleTapTimer === null) {
            doubleTapTimer = setTimeout(() => {
                doubleTapTimer = null;
            }, 300);
        } else {
            clearTimeout(doubleTapTimer);
            doubleTapTimer = null;
            activateSuperpower();
        }
    });
}

function setupKeyboardControls() {
    document.addEventListener('keydown', (event) => {
        gameState.keysPressed[event.key] = true;
        if (event.key === 'p' || event.key === 'P') togglePause();
        if (event.key === 'Escape' && gameState.isStarted && !gameState.isOver) { endGame(); showScreen(startScreen); }
        if (event.key === ' ') { // Spacebar
            activateSuperpower();
        }
    });
    document.addEventListener('keyup', (event) => { gameState.keysPressed[event.key] = false; });
}

function handleKeyboardInput() {
    if (!gameState.isStarted || gameState.isOver || gameState.isPaused) return;
    const player = gameObjects.player;
    const speed = gameState.speedBoostActive ? player.speed * 1.3 : player.speed;
    if (gameState.keysPressed['w'] || gameState.keysPressed['ArrowUp']) player.y -= speed;
    if (gameState.keysPressed['s'] || gameState.keysPressed['ArrowDown']) player.y += speed;
    if (gameState.keysPressed['a'] || gameState.keysPressed['ArrowLeft']) player.x -= speed;
    if (gameState.keysPressed['d'] || gameState.keysPressed['ArrowRight']) player.x += speed;
    constrainPlayerPosition();
}

function togglePause() {
    if (!gameState.isStarted || gameState.isOver) return;
    gameState.isPaused = !gameState.isPaused;
    if (gameState.isPaused) {
        pauseScreen.style.display = 'flex';
        if (backgroundMusic && gameState.musicEnabled) backgroundMusic.pause();
    } else {
        pauseScreen.style.display = 'none';
        gameState.lastFrameTime = performance.now();
        if (backgroundMusic && gameState.musicEnabled) backgroundMusic.play();
    }
}

// Game Logic
function createCoffeeCup() {
    if (gameObjects.coffeeCups.length >= MAX_COFFEE_CUPS) return;
    const directions = [
        { dx: 0, dy: 0.96 }, { dx: 0.96, dy: 0 }, { dx: -0.96, dy: 0 },
        { dx: 0.64, dy: 0.64 }, { dx: -0.64, dy: 0.64 },
        { dx: 0.64, dy: -0.64 }, { dx: -0.64, dy: -0.64 }
    ];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    let x, y;
    if (dir.dy > 0) { x = random(0, gameState.width); y = -CUP_RADIUS; }
    else if (dir.dy < 0) { x = random(0, gameState.width); y = gameState.height + CUP_RADIUS; }
    else if (dir.dx > 0) { x = -CUP_RADIUS; y = random(0, gameState.height); }
    else { x = gameState.width + CUP_RADIUS; y = random(0, gameState.height); }

    const cup = getCoffeeFromPool();
    if (cup) {
        cup.x = x;
        cup.y = y;
        cup.dx = dir.dx;
        cup.dy = dir.dy;
        cup.rotation = 0;
        cup.rotationSpeed = random(-0.02, 0.02);
        gameObjects.coffeeCups.push(cup);
    }
}

function createTeaCup() {
    if (gameObjects.teaCups.length >= MAX_TEA_CUPS) return;
    const directions = [
        { dx: 0, dy: 1.28 }, { dx: 1.28, dy: 0 }, { dx: -1.28, dy: 0 },
        { dx: 0.96, dy: 0.96 }, { dx: -0.96, dy: 0.96 },
        { dx: 0.96, dy: -0.96 }, { dx: -0.96, dy: -0.96 }
    ];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    let x, y;
    if (dir.dy > 0) { x = random(0, gameState.width); y = -CUP_RADIUS; }
    else if (dir.dy < 0) { x = random(0, gameState.width); y = gameState.height + CUP_RADIUS; }
    else if (dir.dx > 0) { x = -CUP_RADIUS; y = random(0, gameState.height); }
    else { x = gameState.width + CUP_RADIUS; y = random(0, gameState.height); }

    const cup = getTeaFromPool();
    if (cup) {
        cup.x = x;
        cup.y = y;
        cup.dx = dir.dx;
        cup.dy = dir.dy;
        cup.rotation = 0;
        cup.rotationSpeed = random(-0.03, 0.03);
        cup.active = true;
        gameObjects.teaCups.push(cup);
    }
}

function createPowerUp(type) {
    const x = random(0, gameState.width);
    const y = -CUP_RADIUS;
    gameObjects.powerUps.push({ x, y, radius: CUP_RADIUS, dy: 0.8, type });
}

function createParticles(x, y, color, count, speed = 7) {
    let added = 0;
    for (let i = 0; i < count && added < MAX_PARTICLES - gameObjects.particles.length; i++) {
        const particle = getParticleFromPool();
        if (particle) {
            const angle = random(0, Math.PI * 2);
            const particleSpeed = random(2, speed);
            particle.x = x;
            particle.y = y;
            particle.radius = random(3, 7);
            particle.dx = Math.cos(angle) * particleSpeed;
            particle.dy = Math.sin(angle) * particleSpeed;
            particle.alpha = 1;
            particle.color = color;
            particle.life = random(20, 40);
            gameObjects.particles.push(particle);
            added++;
        }
    }
}

function drawBackground() {
    // Seviyeye göre renk seçimi (döngüsel olarak tekrar eder)
    const colorIndex = (gameState.level - 1) % LEVEL_COLORS.length;
    const currentColors = LEVEL_COLORS[colorIndex];

    // Gradient oluştur
    const gradient = ctx.createLinearGradient(0, 0, 0, gameState.height);
    gradient.addColorStop(0, currentColors.top);
    gradient.addColorStop(0.4, currentColors.middle);
    gradient.addColorStop(1, currentColors.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, gameState.width, gameState.height);

    // Arka plan animasyonu
    gameState.backgroundOffset = (gameState.backgroundOffset + 0.5) % 50;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const spacing = 50;
    const circleRadius = 10;
    for (let x = -spacing; x < gameState.width + spacing; x += spacing) {
        for (let y = -spacing; y < gameState.height + spacing; y += spacing) {
            ctx.beginPath();
            ctx.arc(x + gameState.backgroundOffset, y + gameState.backgroundOffset, circleRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    // "Coffy Coin" yazısı
    ctx.font = 'bold 60px Helvetica, Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText('Coffy Coin', gameState.width / 2, gameState.height / 2);
    ctx.shadowColor = 'transparent';
}

function drawPlayer() {
    const { player } = gameObjects;
    const imageSuffix = characterImageMap[gameState.currentCharacter] || 'basic';
    let imageKey;
    if (gameState.isOver) {
        imageKey = `playerSad_${imageSuffix}`;
    } else if (player.smileTimer > 0) {
        imageKey = `playerSmiling_${imageSuffix}`;
    } else {
        imageKey = `playerNormal_${imageSuffix}`;
    }
    player.currentImage = IMAGE_CACHE[imageKey];
    if (player.smileTimer > 0) player.smileTimer--;
    if (player.currentImage) {
        const size = player.radius * 2;
        // Karakteri %20 küçült
        const drawSize = size * 0.8;
        const posX = player.x - (drawSize / 2);
        const posY = player.y - (drawSize / 2);
        ctx.drawImage(player.currentImage, posX, posY, drawSize, drawSize);
    } else {
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Güç-up göstergeleri için de boyutu ayarla
    if (gameState.shieldActive) {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius * 0.85, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (gameState.speedBoostActive) {
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius * 0.9, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (gameState.magnetActive) {
        ctx.strokeStyle = '#FF00FF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.collectRange * 0.8, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function drawCoffeeCups() {
    for (const cup of gameObjects.coffeeCups) {
        if (!cup.active) continue;
        ctx.save();
        ctx.translate(cup.x, cup.y);
        ctx.rotate(cup.rotation);
        if (IMAGE_CACHE.coffeeCup) ctx.drawImage(IMAGE_CACHE.coffeeCup, -cup.radius, -cup.radius, cup.radius * 2, cup.radius * 2);
        else {
            ctx.fillStyle = '#4A2C2A';
            ctx.beginPath();
            ctx.arc(0, 0, cup.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

function drawTeaCups() {
    for (const cup of gameObjects.teaCups) {
        if (!cup.active) continue;
        ctx.save();
        ctx.translate(cup.x, cup.y);
        ctx.rotate(cup.rotation);
        if (IMAGE_CACHE.teaCup) ctx.drawImage(IMAGE_CACHE.teaCup, -cup.radius, -cup.radius, cup.radius * 2, cup.radius * 2);
        else {
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.arc(0, 0, cup.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

function drawPowerUps() {
    for (const powerUp of gameObjects.powerUps) {
        ctx.save();
        ctx.translate(powerUp.x, powerUp.y);
        if (powerUp.type === POWERUP_TYPES.SHIELD && IMAGE_CACHE.shieldCoin) {
            ctx.drawImage(IMAGE_CACHE.shieldCoin, -powerUp.radius, -powerUp.radius, powerUp.radius * 2, powerUp.radius * 2);
        } else if (powerUp.type === POWERUP_TYPES.SPEED && IMAGE_CACHE.speedBoost) {
            ctx.drawImage(IMAGE_CACHE.speedBoost, -powerUp.radius, -powerUp.radius, powerUp.radius * 2, powerUp.radius * 2);
        } else if (powerUp.type === POWERUP_TYPES.MAGNET && IMAGE_CACHE.magnet) {
            ctx.drawImage(IMAGE_CACHE.magnet, -powerUp.radius, -powerUp.radius, powerUp.radius * 2, powerUp.radius * 2);
        } else {
            ctx.fillStyle = powerUp.type === POWERUP_TYPES.SHIELD ? '#FFD700' : powerUp.type === POWERUP_TYPES.SPEED ? '#00FF00' : '#FF00FF';
            ctx.beginPath();
            ctx.arc(0, 0, powerUp.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

function drawParticles() {
    ctx.globalAlpha = 1;
    for (const particle of gameObjects.particles) {
        if (!particle.active) continue;
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function updateCups(deltaTime) {
    const player = gameObjects.player;

    if (gameState.shieldActive && gameState.shieldTimer > 0) {
        gameState.shieldTimer -= deltaTime / 1000;
        if (gameState.shieldTimer <= 0) gameState.shieldActive = false;
    }
    if (gameState.speedBoostActive && gameState.speedBoostTimer > 0) {
        gameState.speedBoostTimer -= deltaTime / 1000;
        if (gameState.speedBoostTimer <= 0) gameState.speedBoostActive = false;
    }
    if (gameState.magnetActive && gameState.magnetTimer > 0) {
        gameState.magnetTimer -= deltaTime / 1000;
        if (gameState.magnetTimer <= 0) gameState.magnetActive = false;
    }

    for (let i = gameObjects.coffeeCups.length - 1; i >= 0; i--) {
        const cup = gameObjects.coffeeCups[i];
        if (!cup.active) continue;
        cup.x += cup.dx;
        cup.y += cup.dy;
        cup.rotation += cup.rotationSpeed;
        if (isOutOfBounds(cup)) {
            resetCoffeeCup(cup);
            gameObjects.coffeeCups.splice(i, 1);
            continue;
        }

        const dist = distanceSquared(player, cup);
        if (gameState.magnetActive && dist < player.collectRange * player.collectRange * 9) {
            const angle = Math.atan2(player.y - cup.y, player.x - cup.x);
            cup.dx += Math.cos(angle) * 1.5;
            cup.dy += Math.sin(angle) * 1.5;
        }

        if (checkCollision(player, cup) || (gameState.magnetActive && dist < player.collectRange * player.collectRange)) {
            resetCoffeeCup(cup);
            gameObjects.coffeeCups.splice(i, 1);
            gameState.score += 5 * gameState.level;
            gameState.coffeeCount++;
            let reward = 5 * gameState.level;
            if (gameState.pendingRewards + reward > 9999) reward = 9999 - gameState.pendingRewards;
            gameState.pendingRewards += reward;
            if (gameState.pendingRewards > 9999) gameState.pendingRewards = 9999;
            gameState.comboCount++;
            totalRewardElement.textContent = gameState.pendingRewards.toFixed(2);
            totalRewardsHudElement.textContent = gameState.pendingRewards.toFixed(2);
            savePendingRewards();
            createParticles(player.x, player.y, '#4A2C2A', PARTICLE_COUNT.COFFEE);
            gameObjects.player.smileTimer = SMILE_DURATION;
            scoreElement.textContent = gameState.score;
            coffeeCountElement.textContent = gameState.coffeeCount;
            if (collectSound) {
                collectSound.currentTime = 0;
                collectSound.play().catch(error => console.warn("Collect sound playback failed:", error));
            }
            if (gameState.coffeeCount >= COFFEES_PER_LEVEL * gameState.level) levelUp();
        }
    }

    for (let i = gameObjects.teaCups.length - 1; i >= 0; i--) {
        const cup = gameObjects.teaCups[i];
        if (!cup.active) continue;
        
        cup.x += cup.dx;
        cup.y += cup.dy;
        cup.rotation += cup.rotationSpeed;
        
        if (isOutOfBounds(cup)) {
            resetTeaCup(cup);
            gameObjects.teaCups.splice(i, 1);
            continue;
        }

        // Gelişmiş çarpışma kontrolü
        if (checkCollision(player, cup)) {
            // İlave bir mesafe kontrolü ekle
            const dx = player.x - cup.x;
            const dy = player.y - cup.y;
            const exactDistance = Math.sqrt(dx * dx + dy * dy);
            
            // Çarpışma daha kesin bir şekilde kontrol edilir
            if (exactDistance < (player.radius + cup.radius) * 0.7) {
                if (!gameState.shieldActive) {
                    gameOver();
                    break;
                } else {
                    resetTeaCup(cup);
                    gameObjects.teaCups.splice(i, 1);
                    createParticles(cup.x, cup.y, '#8B4513', PARTICLE_COUNT.BREAK);
                }
            }
        }
    }

    for (let i = gameObjects.powerUps.length - 1; i >= 0; i--) {
        const powerUp = gameObjects.powerUps[i];
        powerUp.y += powerUp.dy;
        if (isOutOfBounds(powerUp)) {
            gameObjects.powerUps.splice(i, 1);
            continue;
        }
        if (checkCollision(player, powerUp)) {
            switch (powerUp.type) {
                case POWERUP_TYPES.SHIELD:
                    gameState.shieldActive = true;
                    gameState.shieldTimer = 5;
                    break;
                case POWERUP_TYPES.SPEED:
                    gameState.speedBoostActive = true;
                    gameState.speedBoostTimer = 8;
                    break;
                case POWERUP_TYPES.MAGNET:
                    gameState.magnetActive = true;
                    gameState.magnetTimer = 10;
                    break;
            }
            gameObjects.powerUps.splice(i, 1);
            createParticles(powerUp.x, powerUp.y, powerUp.type === POWERUP_TYPES.SHIELD ? '#FFD700' : powerUp.type === POWERUP_TYPES.SPEED ? '#00FF00' : '#FF00FF', PARTICLE_COUNT.COFFEE);
        }
    }
}

function updateParticles() {
    for (let i = gameObjects.particles.length - 1; i >= 0; i--) {
        const particle = gameObjects.particles[i];
        if (!particle.active) continue;
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.alpha -= 0.02;
        particle.life--;
        if (particle.life <= 0 || particle.alpha <= 0) {
            resetParticle(particle);
            gameObjects.particles.splice(i, 1);
        }
    }
}

function levelUp() {
    gameState.level++;
    levelElement.textContent = gameState.level;
    createParticles(gameState.width / 2, gameState.height / 2, '#FFD700', PARTICLE_COUNT.LEVEL_UP);
    gameState.comboCount = 0;
    if (levelUpSound) {
        levelUpSound.currentTime = 0;
        levelUpSound.play().catch(error => console.warn("Level up sound failed:", error));
    }
}

function spawnCups(currentTime) {
    const difficultyFactor = Math.log(gameState.level + 1);
    const coffeeSpawnRate = INITIAL_COFFEE_SPAWN_RATE / difficultyFactor;
    if (currentTime - gameState.lastCoffeeTime > coffeeSpawnRate) {
        createCoffeeCup();
        gameState.lastCoffeeTime = currentTime;
    }
    const teaSpawnRate = INITIAL_TEA_SPAWN_RATE / difficultyFactor;
    if (currentTime - gameState.lastTeaTime > teaSpawnRate) {
        createTeaCup();
        gameState.lastTeaTime = currentTime;
    }
    const powerUpSpawnRate = 10000;
    if (currentTime - gameState.lastShieldTime > powerUpSpawnRate && Math.random() < 0.3) {
        const type = Math.random() < 0.5 ? POWERUP_TYPES.SHIELD : Math.random() < 0.5 ? POWERUP_TYPES.SPEED : POWERUP_TYPES.MAGNET;
        createPowerUp(type);
        gameState.lastShieldTime = currentTime;
    }
}

class Boss {
    constructor(type) {
        const props = BOSS_PROPERTIES[type];
        this.type = type;
        this.health = props.health;
        this.maxHealth = props.health;
        this.radius = props.radius;
        this.speed = props.speed;
        this.x = gameState.width / 2;
        this.y = -this.radius;
        this.active = true;
        this.lastAttackTime = 0;
        this.attackInterval = 2000;
        this.phase = 1;
        this.lastDamageTime = 0;
        this.isVulnerable = true;
        this.currentImage = new Image();
        this.currentImage.src = SVG_URLS[type === BOSS_TYPES.COFFEE ? 'coffeeBoss' : 'teaBoss'];
        this.attackCount = 0;  // Saldırı sayacı ekle
        this.minDistance = 300; // Minimum mesafeyi artır
        this.maxAttacks = gameState.level >= 10 ? 3 : BOSS_PROPERTIES[type].maxAttacks;
        this.exitingScreen = false;
    }

    update(player, deltaTime) {
        const currentTime = performance.now();
        if (!this.isVulnerable && currentTime - this.lastDamageTime > BOSS_PROPERTIES[this.type].vulnerableTime) {
            this.isVulnerable = true;
        }

        // Eğer son saldırı yapıldıysa ekrandan çık
        if (this.attackCount >= this.maxAttacks && !this.exitingScreen) {
            this.exitingScreen = true;
            // Ekranın dışına çıkış yönünü belirle
            this.exitDirection = {
                x: this.x > gameState.width / 2 ? 1 : -1,
                y: this.y > gameState.height / 2 ? 1 : -1
            };
        }

        if (this.exitingScreen) {
            // Ekranın dışına doğru hareket et
            this.x += this.exitDirection.x * this.speed * 2;
            this.y += this.exitDirection.y * this.speed * 2;
            
            // Ekranın tamamen dışına çıktığında deaktif et
            if (Math.abs(this.x - gameState.width/2) > gameState.width || 
                Math.abs(this.y - gameState.height/2) > gameState.height) {
                this.active = false;
                gameState.activeBoss = null;
            }
            return;
        }

        // Normal hareket ve saldırı mantığı
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > this.minDistance) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }

        if (currentTime - this.lastAttackTime > this.attackInterval && this.attackCount < this.maxAttacks) {
            this.attack(player);
            this.attackCount++;
            this.lastAttackTime = currentTime;
        }
    }

    attack(player) {
        if (this.type === BOSS_TYPES.COFFEE) {
            this.coffeeAttack();
        } else {
            this.teaAttack(player);
        }
    }

    coffeeAttack() {
        const props = BOSS_PROPERTIES[BOSS_TYPES.COFFEE];
        for (let i = 0; i < props.bulletCount; i++) {
            const angle = (i / props.bulletCount) * Math.PI * 2;
            gameObjects.bossBullets.push({
                x: this.x,
                y: this.y,
                radius: CUP_RADIUS * 0.7,
                dx: Math.cos(angle) * props.bulletSpeed,
                dy: Math.sin(angle) * props.bulletSpeed,
                type: 'coffee'
            });
        }
    }

    teaAttack(player) {
        const props = BOSS_PROPERTIES[BOSS_TYPES.TEA];
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        for (let i = -2; i <= 2; i++) {
            const spreadAngle = angle + (i * props.spreadAngle / 2);
            gameObjects.bossBullets.push({
                x: this.x,
                y: this.y,
                radius: CUP_RADIUS * 0.7,
                dx: Math.cos(spreadAngle) * props.bulletSpeed,
                dy: Math.sin(spreadAngle) * props.bulletSpeed,
                type: 'tea'
            });
        }
    }

    damage(amount) {
        if (!this.isVulnerable) return false;
        
        this.health -= amount;
        this.isVulnerable = false;
        this.lastDamageTime = performance.now();
        
        createParticles(this.x, this.y, 
            this.type === BOSS_TYPES.COFFEE ? '#4A2C2A' : '#8B4513', 
            5, 8);

        if (this.health <= this.maxHealth / 2 && this.phase === 1) {
            this.phase = 2;
            this.attackInterval *= 0.7;
            this.speed *= 1.2;
        }

        return this.health <= 0;
    }
}

function drawBoss() {
    if (!gameState.activeBoss) return;

    const boss = gameState.activeBoss;
    if (boss.currentImage && boss.currentImage.complete) {
        ctx.save();
        ctx.translate(boss.x, boss.y);
        ctx.drawImage(boss.currentImage, 
            -boss.radius, -boss.radius, 
            boss.radius * 2, boss.radius * 2
        );
        ctx.restore();
    }

    // Can barı
    const healthBarWidth = boss.radius * 2;
    const healthBarHeight = 10;
    const healthPercentage = boss.health / boss.maxHealth;
    
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(boss.x - healthBarWidth/2, boss.y - boss.radius - 20, 
                 healthBarWidth, healthBarHeight);
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(boss.x - healthBarWidth/2, boss.y - boss.radius - 20, 
                 healthBarWidth * healthPercentage, healthBarHeight);
}

function drawBossBullets() {
    for (const bullet of gameObjects.bossBullets) {
        ctx.save();
        ctx.translate(bullet.x, bullet.y);
        ctx.rotate(Math.atan2(bullet.dy, bullet.dx));
        
        // Çay objesi çizimi
        if (IMAGE_CACHE.teaCup) {
            ctx.drawImage(
                IMAGE_CACHE.teaCup, 
                -bullet.radius, 
                -bullet.radius, 
                bullet.radius * 2, 
                bullet.radius * 2
            );
        } else {
            // Yedek basit çizim
            ctx.fillStyle = bullet.type === 'coffee' ? '#4A2C2A' : '#8B4513';
            ctx.fillRect(-bullet.radius, -bullet.radius, bullet.radius * 2, bullet.radius * 2);
        }
        
        ctx.restore();
    }
}

function updateBoss(deltaTime) {
    const currentTime = performance.now();
    
    if (!gameState.activeBoss && currentTime - gameState.lastBossTime > BOSS_SPAWN_INTERVAL) {
        gameState.activeBoss = new Boss(
            Math.random() < 0.5 ? BOSS_TYPES.COFFEE : BOSS_TYPES.TEA
        );
        gameState.lastBossTime = currentTime;
    }

    if (gameState.activeBoss && gameState.activeBoss.active) {
        gameState.activeBoss.update(gameObjects.player, deltaTime);
    }

    // Boss mermilerini güncelle
    for (let i = gameObjects.bossBullets.length - 1; i >= 0; i--) {
        const bullet = gameObjects.bossBullets[i];
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
        bullet.rotation = Math.atan2(bullet.dy, bullet.dx);

        if (checkCollision(bullet, gameObjects.player)) {
            if (!gameState.shieldActive) {
                gameOver();
                return;
            }
            gameObjects.bossBullets.splice(i, 1);
            continue;
        }

        if (isOutOfBounds(bullet)) {
            gameObjects.bossBullets.splice(i, 1);
        }
    }
}

function activateSuperpower() {
    if (gameState.superpowerActive || !gameState.isStarted || gameState.isOver || gameState.isPaused) return;
    
    const currentTime = performance.now();
    if (currentTime - gameState.lastSuperpowerTime < SUPERPOWER_COOLDOWN) return;
    
    const superpower = SUPERPOWERS[gameState.currentCharacter];
    if (!superpower) return;
    
    gameState.superpowerActive = true;
    gameState.lastSuperpowerTime = currentTime;
    
    // Superpower efektini uygula
    superpower.effect(gameObjects.player);
    
    // Bildirim metnini güncelle
    const notification = document.getElementById('superpower-notification');
    document.getElementById('superpower-text').textContent = 'Superpower Active!';
    notification.classList.add('show');
    
    // Süre sonunda reset
    setTimeout(() => {
        superpower.reset(gameObjects.player);
        gameState.superpowerActive = false;
        notification.classList.remove('show');
    }, SUPERPOWER_DURATION);
}

// Süpergüç bildirim fonksiyonunu güncelle
function updateSuperpowerNotification() {
    const currentTime = performance.now();
    const notification = document.getElementById('superpower-notification');
    
    if (!gameState.isStarted || gameState.isOver || gameState.isPaused) {
        notification.classList.remove('show');
        return;
    }

    const timeSinceLastUse = currentTime - gameState.lastSuperpowerTime;
    
    if (timeSinceLastUse >= SUPERPOWER_COOLDOWN && !gameState.superpowerActive) {
        notification.classList.add('show');
        document.getElementById('superpower-text').textContent = 'Superpower Ready! (Press SPACE)';
    } else if (gameState.superpowerActive) {
        notification.classList.add('show');
        document.getElementById('superpower-text').textContent = 'Superpower Active!';
    } else {
        notification.classList.remove('show');
    }
}

function createCoffeeStorm(player) {
    const stormParticles = 12;
    for (let i = 0; i < stormParticles; i++) {
        const angle = (i / stormParticles) * Math.PI * 2;
        const radius = 50;
        createParticles(
            player.x + Math.cos(angle) * radius,
            player.y + Math.sin(angle) * radius,
            '#4A2C2A',
            1,
            3
        );
    }
}

function createShadowTrail(player) {
    createParticles(player.x, player.y, '#000000', 5, 2);
}

function convertTeaToCoffee() {
    gameObjects.teaCups.forEach(tea => {
        if (tea.active) {
            const coffee = getCoffeeFromPool();
            if (coffee) {
                coffee.x = tea.x;
                coffee.y = tea.y;
                coffee.dx = tea.dx;
                coffee.dy = tea.dy;
                coffee.active = true;
                gameObjects.coffeeCups.push(coffee);
            }
            resetTeaCup(tea);
        }
    });
    gameObjects.teaCups = [];
}

function createDragonEffects(player) {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        createParticles(
            player.x,
            player.y,
            '#FFD700',
            1,
            10
        );
    }
}

function gameLoop(timestamp) {
    if (!gameState.isStarted || gameState.isOver) return;
    const currentTime = performance.now();
    const deltaTime = Math.min(currentTime - gameState.lastFrameTime, 100);
    if (!gameState.isPaused) {
        ctx.clearRect(0, 0, gameState.width, gameState.height);
        drawBackground();
        spawnCups(currentTime);
        handleKeyboardInput();
        updateCups(deltaTime);
        updateBoss(deltaTime);
        updateParticles();
        drawCoffeeCups();
        drawTeaCups();
        drawPowerUps();
        drawPlayer();
        drawBoss();
        drawBossBullets();
        drawParticles();
        
        // Süpergüç bildirimini güncelle
        updateSuperpowerNotification();
        
        gameState.lastFrameTime = currentTime;

        if (gameState.comboCount > 0 && currentTime - gameState.lastCoffeeTime > 2000) {
            gameState.comboCount = 0;
        }
    }
    requestAnimationFrame(gameLoop);
}

function startGame() {
    gameState.isStarted = true;
    gameState.isOver = false;
    gameState.isPaused = false;
    gameState.score = 0;
    gameState.level = 1;
    gameState.coffeeCount = 0;
    gameState.comboCount = 0;
    gameState.lastFrameTime = performance.now();
    gameState.lastCoffeeTime = performance.now();
    gameState.lastTeaTime = performance.now();
    gameState.lastShieldTime = performance.now();
    gameState.lastBossTime = performance.now();
    gameState.activeBoss = null;
    gameObjects.coffeeCups = [];
    gameObjects.teaCups = [];
    gameObjects.powerUps = [];
    gameObjects.particles = [];
    gameObjects.bossBullets = [];
    gameObjects.player.smileTimer = 0;
    gameObjects.player.x = gameState.width / 2;
    gameObjects.player.y = gameState.height - 100;
    applySkills();
    scoreElement.textContent = gameState.score;
    levelElement.textContent = gameState.level;
    coffeeCountElement.textContent = gameState.coffeeCount;
    totalRewardsHudElement.textContent = gameState.pendingRewards.toFixed(2);
    hudElement.classList.add('visible');
    hideAllScreens();
    bossHealthBar.style.display = 'none';
    bossNameDisplay.style.display = 'none';
    if (backgroundMusic && gameState.musicEnabled) {
        backgroundMusic.play().catch(error => console.warn("Background music playback failed:", error));
    }
    requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameState.isOver = true;
    const isNewHighScore = saveHighScore(gameState.score);
    finalScoreElement.textContent = `Score: ${gameState.score}`;
    highScoreElement.textContent = `High Score: ${gameState.highScore}`;
    rewardElement.textContent = `Total Reward: ${gameState.pendingRewards} COFFY`;
    if (isNewHighScore) highScoreElement.textContent += ' (New Record!)';
    if (backgroundMusic) backgroundMusic.pause();
    if (gameOverSound) {
        gameOverSound.currentTime = 0;
        gameOverSound.play().catch(error => console.warn("Game over sound playback failed:", error));
    }
    showScreen(gameOverScreen);
    hudElement.classList.remove('visible');
}

function endGame() {
    gameState.isStarted = false;
    gameState.isOver = false;
    gameState.isPaused = false;
    gameObjects.coffeeCups = [];
    gameObjects.teaCups = [];
    gameObjects.powerUps = [];
    gameObjects.particles = [];
    hudElement.classList.remove('visible');
    if (backgroundMusic) backgroundMusic.pause();
}

function hideAllScreens() {
    const screens = [startScreen, gameOverScreen, pauseScreen, loadingScreen];
    screens.forEach(screen => {
        screen.classList.remove('visible');
        screen.style.display = 'none';
    });
}

function showScreen(screen) {
    hideAllScreens();
    screen.style.display = 'flex';
    setTimeout(() => screen.classList.add('visible'), 10);
}

function applySkills() {
    gameObjects.player.speed = 8 + SKILL_TREE.speed.level * SKILL_TREE.speed.increment;
    gameObjects.player.collectRange = PLAYER_RADIUS + SKILL_TREE.range.level * SKILL_TREE.range.increment;
}

async function buyCharacter(characterId) {
    try {
        if (!gameState.walletConnected) throw new Error("Wallet not connected");
        const character = characters.find(c => c.id === characterId);
        const price = character.price;
        const balance = await gameState.tokenContract.balanceOf(gameState.walletAddress);
        if (balance.lt(ethers.utils.parseUnits(price.toString(), 18))) {
            alert("Insufficient balance!");
            return;
        }
        const confirmPurchase = confirm(`Do you want to buy ${character.name} for ${price} COFFY?`);
        if (!confirmPurchase) return;
        const tx = await gameState.tokenContract.buyCharacter(characterId);
        await tx.wait();
        gameState.ownedCharacters.push(character.key);
        saveOwnedCharacters();
        gameState.currentCharacter = character.key;
        updateCharacterButtons();
        alert(`${character.name} purchased and selected!`);
    } catch (error) {
        console.error("Purchase error:", error);
        alert("Purchase failed!");
    }
}

const InputManager = {
    keys: new Set(),
    mouse: { x: 0, y: 0, pressed: false },
    touches: new Map(),

    init() {
        window.addEventListener('keydown', e => this.keys.add(e.key));
        window.addEventListener('keyup', e => this.keys.delete(e.key));
        
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('touchstart', e => {
            Array.from(e.touches).forEach(touch => {
                this.touches.set(touch.identifier, {
                    x: touch.clientX,
                    y: touch.clientY
                });
            });
        });
        
        window.addEventListener('touchmove', e => {
            Array.from(e.touches).forEach(touch => {
                this.touches.set(touch.identifier, {
                    x: touch.clientX,
                    y: touch.clientY
                });
            });
        });
        
        window.addEventListener('touchend', e => {
            Array.from(e.changedTouches).forEach(touch => {
                this.touches.delete(touch.identifier);
            });
        });
    },

    isKeyPressed(key) {
        return this.keys.has(key);
    },

    getMousePosition() {
        return { ...this.mouse };
    },

    getTouchPositions() {
        return Array.from(this.touches.values());
    }
};

const ObjectPool = {
    pools: new Map(),

    createPool(type, factory, size) {
        const pool = Array(size).fill().map(() => ({
            ...factory(),
            active: false
        }));
        this.pools.set(type, pool);
        return pool;
    },

    get(type) {
        const pool = this.pools.get(type);
        if (!pool) return null;
        return pool.find(obj => !obj.active) || null;
    },

    reset(obj) {
        obj.active = false;
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'number') obj[key] = 0;
        });
    }
};

class GameError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = 'GameError';
    }
}

const ErrorHandler = {
    handle(error) {
        if (error instanceof GameError) {
            console.error(`[Game Error ${error.code}]: ${error.message}`);
            this.showErrorMessage(error.message);
        } else {
            console.error('[Unexpected Error]:', error);
            this.showErrorMessage('An unexpected error occurred');
        }
    },

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }
};

const SecurityManager = {
    validateTransaction(tx) {
        if (!tx || !tx.hash) {
            throw new GameError('TX_001', 'Invalid transaction');
        }
        return tx;
    },

    sanitizeInput(input) {
        return input.replace(/[<>]/g, '');
    },

    validateScore(score) {
        if (score < 0 || score > 1000000) {
            throw new GameError('SCORE_001', 'Invalid score value');
        }
        return score;
    },

    encryptData(data) {
        return btoa(JSON.stringify(data));
    },

    decryptData(data) {
        try {
            return JSON.parse(atob(data));
        } catch {
            throw new GameError('CRYPT_001', 'Invalid encrypted data');
        }
    }
};

const AudioManager = {
    sounds: new Map(),
    context: null,
    masterGain: null,

    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
        } catch (error) {
            ErrorHandler.handle(new GameError('AUDIO_001', 'Audio initialization failed'));
        }
    },

    async loadSound(id, url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.sounds.set(id, audioBuffer);
        } catch (error) {
            ErrorHandler.handle(new GameError('AUDIO_002', `Failed to load sound: ${id}`));
        }
    },

    play(id, options = {}) {
        try {
            const sound = this.sounds.get(id);
            if (!sound) return;

            const source = this.context.createBufferSource();
            source.buffer = sound;
            
            const gainNode = this.context.createGain();
            gainNode.gain.value = options.volume || 1;
            
            source.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            source.start(0);
            return source;
        } catch (error) {
            ErrorHandler.handle(new GameError('AUDIO_003', `Failed to play sound: ${id}`));
        }
    },

    setVolume(value) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, value));
        }
    },

    toggleMute() {
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterGain.gain.value > 0 ? 0 : 1;
        }
    }
};

function throttledGameLoop(timestamp) {
    if (timestamp - gameState.lastFrameTime < 1000 / 60) {
        requestAnimationFrame(throttledGameLoop);
        return;
    }
    gameLoop(timestamp);
}

function init() {
    // Mobil HUD CSS dosyasını yükle
    const mobileCss = document.createElement('link');
    mobileCss.rel = 'stylesheet';
    mobileCss.href = 'mobile-hud.css';
    document.head.appendChild(mobileCss);

    // HUD elementlerini düzenle
    const hudElements = ['score-container', 'level-container', 'coffee-container', 
                        'token-container', 'total-rewards-container'];
    
    hudElements.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            // Label ve value elementlerini oluştur
            const label = container.querySelector('.hud-label');
            const value = container.querySelector('.hud-value');
            
            if (!label || !value) {
                const text = container.textContent;
                container.innerHTML = '';
                
                if (!label) {
                    const labelSpan = document.createElement('span');
                    labelSpan.className = 'hud-label';
                    labelSpan.textContent = text.split(':')[0] + ':';
                    container.appendChild(labelSpan);
                }
                
                if (!value) {
                    const valueSpan = document.createElement('span');
                    valueSpan.className = 'hud-value';
                    valueSpan.textContent = text.split(':')[1] || '0';
                    container.appendChild(valueSpan);
                }
            }
        }
    });

    // HUD elementlerini mobil için optimize et
    const hudContainer = document.getElementById('hud');
    if (hudContainer) {
        hudContainer.style.display = 'flex';
        hudContainer.style.flexDirection = 'row';
        hudContainer.style.flexWrap = 'wrap';
        hudContainer.style.justifyContent = 'center'; // Changed to center
        hudContainer.style.alignItems = 'center';
        hudContainer.style.width = 'auto'; // Changed from 80% to auto
        hudContainer.style.position = 'absolute';
        hudContainer.style.top = '0';
        hudContainer.style.left = '50%'; // Added for centering
        hudContainer.style.transform = 'translateX(-50%)'; // Added for centering
        hudContainer.style.padding = '1px'; // Reduced padding
        hudContainer.style.gap = '2px'; // Reduced gap between elements
        hudContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        hudContainer.style.fontSize = '12px';
        hudContainer.style.zIndex = '1000';
        hudContainer.style.whiteSpace = 'nowrap'; // Added to prevent wrapping
        hudContainer.style.maxWidth = 'fit-content'; // Added to contain width to content

        // Update individual HUD elements
        hudElements.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.style.margin = '0 1px';
                container.style.padding = '1px 2px';
                container.style.minWidth = '45px'; // Slightly reduced
                container.style.display = 'inline-block'; // Added to maintain single line
            }
        });
    }

    // Mobile device specific adjustments
    if (window.innerWidth <= 768) { // Mobil cihaz tespiti
        hudContainer.style.fontSize = '12px';
        hudElements.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.style.minWidth = '60px';
                container.style.margin = '1px 3px';
            }
        });
    }

    resizeCanvas();
    setupMouseControls();
    setupTouchControls();
    setupKeyboardControls();

    SKILL_TREE.speed.level = decryptLocalStorage('skill_speed') || 0;
    SKILL_TREE.range.level = decryptLocalStorage('skill_range') || 0;
    applySkills();

    loadOwnedCharacters();

    characters.forEach(character => {
        const button = document.getElementById(`character-${character.id}`);
        if (!button) return;
        button.addEventListener('click', async () => {
            if (character.key === 'basic-barista' || gameState.ownedCharacters.includes(character.key)) {
                gameState.currentCharacter = character.key;
                updateCharacterButtons();
            } else {
                await buyCharacter(character.id);
            }
        });
    });

    preloadImages()
        .then(() => {
            gameState.isLoading = false;
            showScreen(startScreen);
            gameObjects.player.currentImage = IMAGE_CACHE[`playerNormal_${characterImageMap[gameState.currentCharacter] || 'basic'}`];
            totalRewardElement.textContent = gameState.pendingRewards.toFixed(2);
            totalRewardsHudElement.textContent = gameState.pendingRewards.toFixed(2);
            updateCharacterButtons();
        })
        .catch(error => {
            console.error('Image loading failed:', error);
            gameState.isLoading = false;
            showScreen(startScreen);
        });

    setTimeout(() => {
        if (gameState.isLoading) {
            gameState.isLoading = false;
            showScreen(startScreen);
        }
    }, 5000);

    connectWalletButton.addEventListener("click", connectWallet);
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    resumeButton.addEventListener('click', togglePause);
    claimTotalRewardButton.addEventListener('click', claimTotalReward);
    mainMenuRewardButton.addEventListener('click', () => {
        endGame();
        showScreen(startScreen);
    });

    window.addEventListener('resize', resizeCanvas);

    // Yeni eklenen fonksiyonları başlat
    AudioManager.init();
    InputManager.init();
    requestAnimationFrame(throttledGameLoop);
}

init();

// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
let score = 0;

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Player character
class Player {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 20;
        this.speed = 5;
        this.velocityY = 0;
        this.jumpStrength = -15;
        this.gravity = 0.5;
        this.isJumping = false;
        this.color = '#5D4037'; // Coffee color
    }

    draw() {
        // Draw the player (a coffee cup)
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw cup handle
        ctx.beginPath();
        ctx.arc(this.x, this.y + this.height/2, 10, 0, Math.PI * 2);
        ctx.arc(this.x, this.y + this.height/2, 5, 0, Math.PI * 2, true);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Draw steam
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/4, this.y);
        ctx.bezierCurveTo(
            this.x + this.width/4, this.y - 20,
            this.x + this.width/2, this.y - 30,
            this.x + this.width/2, this.y - 10
        );
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    update() {
        // Apply gravity and update position
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        
        // Prevent falling through the floor
        if (this.y > canvas.height - this.height - 20) {
            this.y = canvas.height - this.height - 20;
            this.velocityY = 0;
            this.isJumping = false;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpStrength;
            this.isJumping = true;
        }
    }

    moveLeft() {
        this.x -= this.speed;
        if (this.x < 0) this.x = 0;
    }

    moveRight() {
        this.x += this.speed;
        if (this.x > canvas.width - this.width) this.x = canvas.width - this.width;
    }
}

// Coffee bean class (collectibles)
class CoffeeBean {
    constructor() {
        this.width = 30;
        this.height = 20;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
        this.speed = 2 + Math.random() * 3;
        this.color = '#795548';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width/2, 
            this.y + this.height/2, 
            this.width/2, 
            this.height/2, 
            0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Draw the line in the middle of the bean
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, this.y);
        ctx.lineTo(this.x + this.width/2, this.y + this.height);
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    update() {
        this.y += this.speed;
    }
}

// Obstacle class (to avoid)
class Obstacle {
    constructor() {
        this.width = 40;
        this.height = 40;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
        this.speed = 3 + Math.random() * 2;
        this.color = '#FF5252';
    }

    draw() {
        // Draw a hot water cup (danger to coffee!)
        ctx.fillStyle = '#E0F7FA';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw waves on top (water)
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 10);
        ctx.bezierCurveTo(
            this.x + this.width/4, this.y + 5,
            this.x + this.width/2, this.y + 15,
            this.x + this.width, this.y + 10
        );
        ctx.strokeStyle = '#29B6F6';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    update() {
        this.y += this.speed;
    }
}

// Game objects
const player = new Player();
let coffeeBeans = [];
let obstacles = [];
let animationId;
let frameCount = 0;

// Controls
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Handle player movement
    if (keys['ArrowLeft'] || keys['a']) {
        player.moveLeft();
    }
    if (keys['ArrowRight'] || keys['d']) {
        player.moveRight();
    }
    if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && !player.isJumping) {
        player.jump();
    }
    
    // Update and draw player
    player.update();
    player.draw();
    
    // Generate new coffee beans and obstacles
    frameCount++;
    if (frameCount % 60 === 0) { // Every second (60 frames)
        coffeeBeans.push(new CoffeeBean());
    }
    
    if (frameCount % 120 === 0) { // Every two seconds
        obstacles.push(new Obstacle());
    }
    
    // Update and draw coffee beans
    for (let i = coffeeBeans.length - 1; i >= 0; i--) {
        coffeeBeans[i].update();
        coffeeBeans[i].draw();
        
        // Check for collision with player (collect)
        if (
            player.x < coffeeBeans[i].x + coffeeBeans[i].width &&
            player.x + player.width > coffeeBeans[i].x &&
            player.y < coffeeBeans[i].y + coffeeBeans[i].height &&
            player.y + player.height > coffeeBeans[i].y
        ) {
            coffeeBeans.splice(i, 1);
            score += 10;
            scoreElement.textContent = score;
            continue;
        }
        
        // Remove beans that fall off screen
        if (coffeeBeans[i].y > canvas.height) {
            coffeeBeans.splice(i, 1);
        }
    }
    
    // Update and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update();
        obstacles[i].draw();
        
        // Check for collision with player (game over)
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y
        ) {
            gameOver();
            return;
        }
        
        // Remove obstacles that fall off screen
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
        }
    }
    
    // Draw ground
    ctx.fillStyle = '#8D6E63';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    
    // Continue the game loop
    animationId = requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    score = 0;
    scoreElement.textContent = score;
    coffeeBeans = [];
    obstacles = [];
    cancelAnimationFrame(animationId);
    gameLoop();
}

// Game over 
function gameOver() {
    cancelAnimationFrame(animationId);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 50);
    
    ctx.font = '24px Arial';
    ctx.fillText(`Your score: ${score}`, canvas.width / 2, canvas.height / 2);
    
    ctx.font = '18px Arial';
    ctx.fillText('Press Space to play again', canvas.width / 2, canvas.height / 2 + 50);
    
    // Listen for space key to restart
    const restartListener = (e) => {
        if (e.key === ' ') {
            window.removeEventListener('keydown', restartListener);
            startGame();
        }
    };
    
    window.addEventListener('keydown', restartListener);
}

// Start the game
window.onload = startGame;