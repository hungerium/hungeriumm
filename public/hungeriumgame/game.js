const PLAYER_RADIUS = 40;
const FLOWER_RADIUS = 25;
const SMILE_DURATION = 30;
const INITIAL_FLOWER_SPAWN_RATE = 700;
const INITIAL_WILDBEE_SPAWN_RATE = 500;
const FLOWERS_PER_LEVEL = 5;
const PARTICLE_COUNT = { FLOWER: 15, LEVEL_UP: 20, BREAK: 5 };
const MAX_FLOWERS = 20;
const MAX_WILDBEES = 15;
const MAX_PARTICLES = 50;
const TOKEN_ADDRESS = '0x8Cb90a43C744187e412cFfd7C5b34cd66879314a';
const BASE_CHAIN_ID = '0x2105';

const characters = [
    { id: 0, name: "Worker Bee", key: "worker-bee", price: 0 },
    { id: 1, name: "Soldier Bee", key: "soldier-bee", price: 20000 },
    { id: 2, name: "Honey Maker", key: "honey-maker", price: 40000 },
    { id: 3, name: "Scout Bee", key: "scout-bee", price: 70000 },
    { id: 4, name: "Guard Bee", key: "guard-bee", price: 100000 },
    { id: 5, name: "Queen's Guard", key: "queens-guard", price: 400000 }
];

const characterImageMap = {
    'worker-bee': 'worker',
    'soldier-bee': 'soldier',
    'honey-maker': 'honey',
    'scout-bee': 'scout',
    'guard-bee': 'guard',
    'queens-guard': 'queen'
};

const HNG_ABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "_treasury", "type": "address"},
            {"internalType": "address", "name": "_liquidityPool", "type": "address"},
            {"internalType": "address", "name": "_marketing", "type": "address"},
            {"internalType": "address", "name": "_team", "type": "address"}
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {"inputs": [], "name": "AccessControlBadConfirmation", "type": "error"},
    {"inputs": [{"internalType": "address", "name": "account", "type": "address"}, {"internalType": "bytes32", "name": "neededRole", "type": "bytes32"}], "name": "AccessControlUnauthorizedAccount", "type": "error"},
    {"inputs": [], "name": "CharacterNotFound", "type": "error"},
    {"inputs": [], "name": "DailyRewardLimitExceeded", "type": "error"},
    {"inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {"internalType": "uint256", "name": "allowance", "type": "uint256"}, {"internalType": "uint256", "name": "needed", "type": "uint256"}], "name": "ERC20InsufficientAllowance", "type": "error"},
    {"inputs": [{"internalType": "address", "name": "sender", "type": "address"}, {"internalType": "uint256", "name": "balance", "type": "uint256"}, {"internalType": "uint256", "name": "needed", "type": "uint256"}], "name": "ERC20InsufficientBalance", "type": "error"},
    {"inputs": [{"internalType": "address", "name": "approver", "type": "address"}], "name": "ERC20InvalidApprover", "type": "error"},
    {"inputs": [{"internalType": "address", "name": "receiver", "type": "address"}], "name": "ERC20InvalidReceiver", "type": "error"},
    {"inputs": [{"internalType": "address", "name": "sender", "type": "address"}], "name": "ERC20InvalidSender", "type": "error"},
    {"inputs": [{"internalType": "address", "name": "spender", "type": "address"}], "name": "ERC20InvalidSpender", "type": "error"},
    {"inputs": [], "name": "InsufficientBalance", "type": "error"},
    {"inputs": [], "name": "InvalidAddress", "type": "error"},
    {"inputs": [], "name": "NotDAOMember", "type": "error"},
    {"inputs": [], "name": "ZeroAmount", "type": "error"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "owner", "type": "address"}, {"indexed": true, "internalType": "address", "name": "spender", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}], "name": "Approval", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "buyer", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "characterId", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "price", "type": "uint256"}], "name": "CharacterBought", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "GameRewardsClaimed", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": false, "internalType": "address", "name": "verifier", "type": "address"}], "name": "GameVerifierAdded", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": false, "internalType": "address", "name": "verifier", "type": "address"}], "name": "GameVerifierRemoved", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}], "name": "InflationMinted", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": false, "internalType": "address", "name": "account", "type": "address"}], "name": "Paused", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "uint32", "name": "proposalId", "type": "uint32"}, {"indexed": false, "internalType": "string", "name": "description", "type": "string"}, {"indexed": false, "internalType": "address", "name": "creator", "type": "address"}, {"indexed": false, "internalType": "enum Hungerium.ProposalType", "name": "proposalType", "type": "uint8"}], "name": "ProposalCreated", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "uint32", "name": "proposalId", "type": "uint32"}, {"indexed": false, "internalType": "address", "name": "executor", "type": "address"}], "name": "ProposalExecuted", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32"}, {"indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32"}, {"indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32"}], "name": "RoleAdminChanged", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32"}, {"indexed": true, "internalType": "address", "name": "account", "type": "address"}, {"indexed": true, "internalType": "address", "name": "sender", "type": "address"}], "name": "RoleGranted", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32"}, {"indexed": true, "internalType": "address", "name": "account", "type": "address"}, {"indexed": true, "internalType": "address", "name": "sender", "type": "address"}], "name": "RoleRevoked", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "Staked", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "StakingRewardClaimed", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": false, "internalType": "address", "name": "burner", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "TokensBurned", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "from", "type": "address"}, {"indexed": true, "internalType": "address", "name": "to", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}], "name": "Transfer", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": false, "internalType": "address", "name": "account", "type": "address"}], "name": "Unpaused", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "Unstaked", "type": "event"},
    {"anonymous": false, "inputs": [{"indexed": true, "internalType": "uint32", "name": "proposalId", "type": "uint32"}, {"indexed": false, "internalType": "address", "name": "voter", "type": "address"}, {"indexed": false, "internalType": "uint32", "name": "voteCount", "type": "uint32"}], "name": "VoteCast", "type": "event"},
    {"inputs": [], "name": "ANNUAL_INFLATION_RATE", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "ANNUAL_STAKING_RATE", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "APIARY_DRAGONLORD_PRICE", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "BLOCKS_PER_DAY", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "BUMBLEBEE_BATTLER_PRICE", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "DAO_EXECUTOR_ROLE", "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "GAME_VERIFIER_ROLE", "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "HONEYCOMB_HEXER_PRICE", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "LIQUIDITY_AMOUNT", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "MARKETING_AMOUNT", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "MAX_DAILY_REWARD", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "MINIMUM_STAKE_TIME", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "MIN_TREASURY_RESERVE", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "POLLEN_PALADIN_PRICE", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "SECONDS_IN_YEAR", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "STINGER_SCOUT_PRICE", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "TEAM_AMOUNT", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "TREASURY_AMOUNT", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "from", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "adminBurn", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {"internalType": "address", "name": "spender", "type": "address"}], "name": "allowance", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {"internalType": "uint256", "name": "value", "type": "uint256"}], "name": "approve", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "account", "type": "address"}], "name": "balanceOf", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "uint256", "name": "characterId", "type": "uint256"}], "name": "buyCharacter", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "name": "characters", "outputs": [{"internalType": "string", "name": "name", "type": "string"}, {"internalType": "uint256", "name": "price", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "claimGameRewards", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "string", "name": "description", "type": "string"}, {"internalType": "enum Hungerium.ProposalType", "name": "proposalType", "type": "uint8"}, {"internalType": "bytes", "name": "callData", "type": "bytes"}, {"internalType": "address", "name": "targetContract", "type": "address"}], "name": "createProposal", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "", "type": "address"}], "name": "dailyClaims", "outputs": [{"internalType": "uint48", "name": "lastClaimTime", "type": "uint48"}, {"internalType": "uint208", "name": "claimedToday", "type": "uint208"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "daoMemberCount", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "", "type": "address"}], "name": "daoMembership", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "decimals", "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "uint32", "name": "proposalId", "type": "uint32"}], "name": "executeProposal", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}], "name": "getRoleAdmin", "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}, {"internalType": "address", "name": "account", "type": "address"}], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}, {"internalType": "address", "name": "account", "type": "address"}], "name": "hasRole", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "lastInflationTime", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "name", "outputs": [{"internalType": "string", "name": "", "type": "string"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [], "name": "paused", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "proposalCount", "outputs": [{"internalType": "uint32", "name": "", "type": "uint32"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "proposalExecutionDelay", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "uint32", "name": "", "type": "uint32"}], "name": "proposals", "outputs": [{"internalType": "uint32", "name": "id", "type": "uint32"}, {"internalType": "string", "name": "description", "type": "string"}, {"internalType": "address", "name": "proposer", "type": "address"}, {"internalType": "uint32", "name": "voteCount", "type": "uint32"}, {"internalType": "uint32", "name": "votesNeeded", "type": "uint32"}, {"internalType": "uint48", "name": "startTime", "type": "uint48"}, {"internalType": "uint48", "name": "endTime", "type": "uint48"}, {"internalType": "bool", "name": "executed", "type": "bool"}, {"internalType": "enum Hungerium.ProposalType", "name": "proposalType", "type": "uint8"}, {"internalType": "bytes", "name": "callData", "type": "bytes"}, {"internalType": "address", "name": "targetContract", "type": "address"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "quorumPercentage", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}, {"internalType": "address", "name": "callerConfirmation", "type": "address"}], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}, {"internalType": "address", "name": "account", "type": "address"}], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "", "type": "address"}], "name": "stakes", "outputs": [{"internalType": "uint208", "name": "amount", "type": "uint208"}, {"internalType": "uint48", "name": "startTime", "type": "uint48"}, {"internalType": "uint48", "name": "lastRewardClaim", "type": "uint48"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "bytes4", "name": "interfaceId", "type": "bytes4"}], "name": "supportsInterface", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "symbol", "outputs": [{"internalType": "string", "name": "", "type": "string"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "totalStaked", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "totalSupply", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "value", "type": "uint256"}], "name": "transfer", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "address", "name": "from", "type": "address"}, {"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "value", "type": "uint256"}], "name": "transferFrom", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [], "name": "treasury", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"},
    {"inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [{"internalType": "uint32", "name": "proposalId", "type": "uint32"}], "name": "vote", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"inputs": [], "name": "votingPeriod", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}
];

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const loadingScreen = document.getElementById('loading-screen');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const pauseScreen = document.getElementById('pause-screen');
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
const flowerCountElement = document.getElementById('flower-count');
const inventoryCountElement = document.getElementById('inventory-count');
const tokenCountElement = document.getElementById('token-count');
const walletAddressElement = document.getElementById('wallet-address');
const hudElement = document.getElementById('hud');
const backgroundMusic = document.getElementById('background-music');
const collectSound = document.getElementById('collect-sound');
const levelUpSound = document.getElementById('levelup-sound');
const IMAGE_CACHE = {};
const POWERUP_TYPES = { SHIELD: 'shield', SPEED: 'speed', MAGNET: 'magnet' };
const SKILL_TREE = {
    speed: { level: 0, maxLevel: 3, cost: 20, increment: 1 },
    range: { level: 0, maxLevel: 3, cost: 25, increment: 10 }
};

const flowerPool = Array(MAX_FLOWERS).fill().map(() => ({
    x: 0, y: 0, radius: FLOWER_RADIUS, dx: 0, dy: 0, rotation: 0, rotationSpeed: 0, active: false
}));
const wildBeePool = Array(MAX_WILDBEES).fill().map(() => ({
    x: 0, y: 0, radius: FLOWER_RADIUS, dx: 0, dy: 0, rotation: 0, rotationSpeed: 0, active: false
}));
const particlePool = Array(MAX_PARTICLES).fill().map(() => ({
    x: 0, y: 0, radius: 0, dx: 0, dy: 0, alpha: 0, color: '', life: 0, active: false
}));

const gameState = {
    width: 0,
    height: 0,
    isPaused: false,
    isStarted: false,
    isOver: false,
    isLoading: true,
    score: 0,
    level: 1,
    flowerCount: 0,
    inventory: 0,
    tokenCount: 0,
    pendingRewards: 0,
    highScore: decryptLocalStorage('beeAdventureHighScore') || 0,
    backgroundOffset: 0,
    lastFrameTime: 0,
    lastFlowerTime: 0,
    lastWildBeeTime: 0,
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
    currentCharacter: 'worker-bee',
    ownedCharacters: ['worker-bee'],
    touchSensitivity: 0.1
};

const gameObjects = {
    player: { x: 0, y: 0, radius: PLAYER_RADIUS, speed: 8, collectRange: PLAYER_RADIUS, smileTimer: 0, currentImage: null },
    flowers: [],
    wildBees: [],
    powerUps: [],
    particles: [],
    queenBee: { x: 0, y: 0, radius: 50, smileTimer: 0, animationOffset: 0 }
};

const SVG_URLS = {
    playerNormal_worker: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 20 Q70 30 80 50 Q80 70 50 80 Q20 70 20 50 Q30 30 50 20" fill="#FFD700" stroke="black" stroke-width="2"/><path d="M30 40 H70" stroke="black" stroke-width="2" fill="none"/><path d="M20 30 C10 20, 15 10, 25 15" fill="#87CEEB" stroke="black" stroke-width="1"/><path d="M80 30 C90 20, 85 10, 75 15" fill="#87CEEB" stroke="black" stroke-width="1"/><circle cx="40" cy="50" r="3" fill="black"/><circle cx="60" cy="50" r="3" fill="black"/><path d="M45 20 L40 10" stroke="black" stroke-width="2"/><path d="M55 20 L60 10" stroke="black" stroke-width="2"/><path d="M35 70 H65" stroke="#FFD700" stroke-width="2" fill="none"/><path d="M40 75 Q50 80 60 75" stroke="#FFD700" stroke-width="2" fill="none"/></svg>'),
    playerSmiling_worker: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 20 Q70 30 80 50 Q80 70 50 80 Q20 70 20 50 Q30 30 50 20" fill="#FFD700" stroke="black" stroke-width="2"/><path d="M30 40 H70" stroke="black" stroke-width="2" fill="none"/><path d="M20 30 C10 20, 15 10, 25 15" fill="#87CEEB" stroke="black" stroke-width="1"/><path d="M80 30 C90 20, 85 10, 75 15" fill="#87CEEB" stroke="black" stroke-width="1"/><circle cx="40" cy="50" r="3" fill="black"/><circle cx="60" cy="50" r="3" fill="black"/><path d="M45 20 L40 10" stroke="black" stroke-width="2"/><path d="M55 20 L60 10" stroke="black" stroke-width="2"/><path d="M40 65 Q50 75 60 65" stroke="black" stroke-width="2" fill="none"/><path d="M35 70 H65" stroke="#FFD700" stroke-width="2" fill="none"/><path d="M40 75 Q50 80 60 75" stroke="#FFD700" stroke-width="2" fill="none"/></svg>'),
    playerNormal_soldier: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 20 Q70 30 80 50 Q80 70 50 80 Q20 70 20 50 Q30 30 50 20" fill="#FFD700" stroke="black" stroke-width="2"/><path d="M30 40 H70" stroke="black" stroke-width="2" fill="none"/><path d="M20 30 C10 20, 15 10, 25 15" fill="#87CEEB" stroke="black" stroke-width="1"/><path d="M80 30 C90 20, 85 10, 75 15" fill="#87CEEB" stroke="black" stroke-width="1"/><circle cx="40" cy="50" r="3" fill="black"/><circle cx="60" cy="50" r="3" fill="black"/><path d="M45 20 L40 10" stroke="black" stroke-width="2"/><path d="M55 20 L60 10" stroke="black" stroke-width="2"/><path d="M50 20 L60 30" stroke="red" stroke-width="3" fill="none"/><path d="M35 70 H65" stroke="#FFD700" stroke-width="2" fill="none"/><path d="M40 75 Q50 80 60 75" stroke="#FFD700" stroke-width="2" fill="none"/></svg>'),
    playerSmiling_soldier: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 20 Q70 30 80 50 Q80 70 50 80 Q20 70 20 50 Q30 30 50 20" fill="#FFD700" stroke="black" stroke-width="2"/><path d="M30 40 H70" stroke="black" stroke-width="2" fill="none"/><path d="M20 30 C10 20, 15 10, 25 15" fill="#87CEEB" stroke="black" stroke-width="1"/><path d="M80 30 C90 20, 85 10, 75 15" fill="#87CEEB" stroke="black" stroke-width="1"/><circle cx="40" cy="50" r="3" fill="black"/><circle cx="60" cy="50" r="3" fill="black"/><path d="M45 20 L40 10" stroke="black" stroke-width="2"/><path d="M55 20 L60 10" stroke="black" stroke-width="2"/><path d="M50 20 L60 30" stroke="red" stroke-width="3" fill="none"/><path d="M40 65 Q50 75 60 65" stroke="black" stroke-width="2" fill="none"/><path d="M35 70 H65" stroke="#FFD700" stroke-width="2" fill="none"/><path d="M40 75 Q50 80 60 75" stroke="#FFD700" stroke-width="2" fill="none"/></svg>'),
    playerNormal_honey: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 20 Q70 30 80 50 Q80 70 50 80 Q20 70 20 50 Q30 30 50 20" fill="#FFD700" stroke="black" stroke-width="2"/><path d="M30 40 H70" stroke="black" stroke-width="2" fill="none"/><path d="M20 30 C10 20, 15 10, 25 15" fill="#87CEEB" stroke="black" stroke-width="1"/><path d="M80 30 C90 20, 85 10, 75 15" fill="#87CEEB" stroke="black" stroke-width="1"/><circle cx="40" cy="50" r="3" fill="black"/><circle cx="60" cy="50" r="3" fill="black"/><path d="M45 20 L40 10" stroke="black" stroke-width="2"/><path d="M55 20 L60 10" stroke="black" stroke-width="2"/><path d="M50 70 Q55 80 50 85 Q45 80 50 70" fill="#FFA500" stroke="black" stroke-width="1"/><path d="M35 70 H65" stroke="#FFD700" stroke-width="2" fill="none"/><path d="M40 75 Q50 80 60 75" stroke="#FFD700" stroke-width="2" fill="none"/></svg>'),
    playerSmiling_honey: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 20 Q70 30 80 50 Q80 70 50 80 Q20 70 20 50 Q30 30 50 20" fill="#FFD700" stroke="black" stroke-width="2"/><path d="M30 40 H70" stroke="black" stroke-width="2" fill="none"/><path d="M20 30 C10 20, 15 10, 25 15" fill="#87CEEB" stroke="black" stroke-width="1"/><path d="M80 30 C90 20, 85 10, 75 15" fill="#87CEEB" stroke="black" stroke-width="1"/><circle cx="40" cy="50" r="3" fill="black"/><circle cx="60" cy="50" r="3" fill="black"/><path d="M45 20 L40 10" stroke="black" stroke-width="2"/><path d="M55 20 L60 10" stroke="black" stroke-width="2"/><path d="M50 70 Q55 80 50 85 Q45 80 50 70" fill="#FFA500" stroke="black" stroke-width="1"/><path d="M40 65 Q50 75 60 65" stroke="black" stroke-width="2" fill="none"/><path d="M35 70 H65" stroke="#FFD700" stroke-width="2" fill="none"/><path d="M40 75 Q50 80 60 75" stroke="#FFD700" stroke-width="2" fill="none"/></svg>'),
    playerNormal_scout: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 20 Q70 30 80 50 Q80 70 50 80 Q20 70 20 50 Q30 30 50 20" fill="#FFD700" stroke="black" stroke-width="2"/><path d="M30 40 H70" stroke="black" stroke-width="2" fill="none"/><path d="M20 30 C10 20, 15 10, 25 15" fill="#87CEEB" stroke="black" stroke-width="1"/><path d="M80 30 C90 20, 85 10, 75 15" fill="#87CEEB" stroke="black" stroke-width="1"/><circle cx="40" cy="50" r="3" fill="black"/><circle cx="60" cy="50" r="3" fill="black"/><path d="M45 20 L40 10" stroke="black" stroke-width="2"/><path d="M55 20 L60 10" stroke="black" stroke-width="2"/><path d="M40 20 Q50 10 60 20" stroke="blue" stroke-width="3" fill="none"/><path d="M35 70 H65" stroke="#FFD700" stroke-width="2" fill="none"/><path d="M40 75 Q50 80 60 75" stroke="#FFD700" stroke-width="2" fill="none"/></svg>'),
    playerSmiling_scout: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 20 Q70 30 80 50 Q80 70 50 80 Q20 70 20 50 Q30 30 50 20" fill="#FFD700" stroke="black" stroke-width="2"/><path d="M30 40 H70" stroke="black" stroke-width="2" fill="none"/><path d="M20 30 C10 20, 15 10, 25 15" fill="#87CEEB" stroke="black" stroke-width="1"/><path d="M80 30 C90 20, 85 10, 75 15" fill="#87CEEB" stroke="black" stroke-width="1"/><circle cx="40" cy="50" r="3" fill="black"/><circle cx="60" cy="50" r="3" fill="black"/><path d="M45 20 L40 10" stroke="black" stroke-width="2"/><path d="M55 20 L60 10" stroke="black" stroke-width="2"/><path d="M40 20 Q50 10 60 20" stroke="blue" stroke-width="3" fill="none"/><path d="M40 65 Q50 75 60 65" stroke="black" stroke-width="2" fill="none"/><path d="M35 70 H65" stroke="#FFD700" stroke-width="2" fill="none"/><path d="M40 75 Q50 80 60 75" stroke="#FFD700" stroke-width="2" fill="none"/></svg>'),
    playerNormal_guard: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 20 Q70 30 80 50 Q80 70 50 80 Q20 70 20 50 Q30 30 50 20" fill="#FFD700" stroke="black" stroke-width="2"/><path d="M30 40 H70" stroke="black" stroke-width="2" fill="none"/><path d="M20 30 C10 20, 15 10, 25 15" fill="#87CEEB" stroke="black" stroke-width="1"/><path d="M80 30 C90 20, 85 10, 75 15" fill="#87CEEB" stroke="black" stroke-width="1"/><circle cx="40" cy="50" r="3" fill="black"/><circle cx="60" cy="50" r="3" fill="black"/><path d="M45 20 L40 10" stroke="black" stroke-width="2"/><path d="M55 20 L60 10" stroke="black" stroke-width="2"/><rect x="45" y="15" width="10" height="15" fill="grey" stroke="black" stroke-width="1"/><path d="M35 70 H65" stroke="#FFD700" stroke-width="2" fill="none"/><path d="M40 75 Q50 80 60 75" stroke="#FFD700" stroke-width="2" fill="none"/></svg>'),
    playerSmiling_guard: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 20 Q70 30 80 50 Q80 70 50 80 Q20 70 20 50 Q30 30 50 20" fill="#FFD700" stroke="black" stroke-width="2"/><path d="M30 40 H70" stroke="black" stroke-width="2" fill="none"/><path d="M20 30 C10 20, 15 10, 25 15" fill="#87CEEB" stroke="black" stroke-width="1"/><path d="M80 30 C90 20, 85 10, 75 15" fill="#87CEEB" stroke="black" stroke-width="1"/><circle cx="40" cy="50" r="3" fill="black"/><circle cx="60" cy="50" r="3" fill="black"/><path d="M45 20 L40 10" stroke="black" stroke-width="2"/><path d="M55 20 L60 10" stroke="black" stroke-width="2"/><rect x="45" y="15" width="10" height="15" fill="grey" stroke="black" stroke-width="1"/><path d="M40 65 Q50 75 60 65" stroke="black" stroke-width="2" fill="none"/><path d="M35 70 H65" stroke="#FFD700" stroke-width="2" fill="none"/><path d="M40 75 Q50 80 60 75" stroke="#FFD700" stroke-width="2" fill="none"/></svg>'),
    playerNormal_queen: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 20 Q70 30 80 50 Q80 70 50 80 Q20 70 20 50 Q30 30 50 20" fill="#FFD700" stroke="black" stroke-width="2"/><path d="M30 40 H70" stroke="black" stroke-width="2" fill="none"/><path d="M20 30 C10 20, 15 10, 25 15" fill="#87CEEB" stroke="black" stroke-width="1"/><path d="M80 30 C90 20, 85 10, 75 15" fill="#87CEEB" stroke="black" stroke-width="1"/><circle cx="40" cy="50" r="3" fill="black"/><circle cx="60" cy="50" r="3" fill="black"/><path d="M45 20 L40 10" stroke="black" stroke-width="2"/><path d="M55 20 L60 10" stroke="black" stroke-width="2"/><path d="M50 20 L60 30 L50 40 L40 30 Z" fill="purple" stroke="black" stroke-width="1"/><path d="M35 70 H65" stroke="#FFD700" stroke-width="2" fill="none"/><path d="M40 75 Q50 80 60 75" stroke="#FFD700" stroke-width="2" fill="none"/></svg>'),
    playerSmiling_queen: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 20 Q70 30 80 50 Q80 70 50 80 Q20 70 20 50 Q30 30 50 20" fill="#FFD700" stroke="black" stroke-width="2"/><path d="M30 40 H70" stroke="black" stroke-width="2" fill="none"/><path d="M20 30 C10 20, 15 10, 25 15" fill="#87CEEB" stroke="black" stroke-width="1"/><path d="M80 30 C90 20, 85 10, 75 15" fill="#87CEEB" stroke="black" stroke-width="1"/><circle cx="40" cy="50" r="3" fill="black"/><circle cx="60" cy="50" r="3" fill="black"/><path d="M45 20 L40 10" stroke="black" stroke-width="2"/><path d="M55 20 L60 10" stroke="black" stroke-width="2"/><path d="M50 20 L60 30 L50 40 L40 30 Z" fill="purple" stroke="black" stroke-width="1"/><path d="M40 65 Q50 75 60 65" stroke="black" stroke-width="2" fill="none"/><path d="M35 70 H65" stroke="#FFD700" stroke-width="2" fill="none"/><path d="M40 75 Q50 80 60 75" stroke="#FFD700" stroke-width="2" fill="none"/></svg>'),
    flower: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 50 Q55 35 60 50 Q65 65 50 70 Q35 65 40 50 Q45 35 50 50" fill="#FFFFFF" stroke="#D3D3D3" stroke-width="1"/><path d="M50 50 Q65 45 70 50 Q75 55 60 60 Q45 55 50 50" fill="#FFFFFF" stroke="#D3D3D3" stroke-width="1"/><path d="M50 50 Q35 45 30 50 Q25 55 40 60 Q55 55 50 50" fill="#FFFFFF" stroke="#D3D3D3" stroke-width="1"/><path d="M50 50 Q55 65 50 70 Q45 75 40 60 Q45 45 50 50" fill="#FFFFFF" stroke="#D3D3D3" stroke-width="1"/><circle cx="50" cy="50" r="10" fill="#FFD700" stroke="black" stroke-width="1"/></svg>'),
    wildBee: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 20 Q70 30 80 50 Q80 70 50 80 Q20 70 20 50 Q30 30 50 20" fill="#FF4500" stroke="black" stroke-width="2"/><path d="M30 40 H70" stroke="black" stroke-width="2" fill="none"/><path d="M20 30 C10 20, 15 10, 25 15" fill="#FFA07A" stroke="black" stroke-width="1"/><path d="M80 30 C90 20, 85 10, 75 15" fill="#FFA07A" stroke="black" stroke-width="1"/><circle cx="40" cy="50" r="4" fill="black"/><circle cx="60" cy="50" r="4" fill="black"/><path d="M45 20 L40 10" stroke="black" stroke-width="2"/><path d="M55 20 L60 10" stroke="black" stroke-width="2"/><path d="M35 70 H65" stroke="#FF4500" stroke-width="2" fill="none"/><path d="M40 75 Q50 80 60 75" stroke="#FF4500" stroke-width="2" fill="none"/><path d="M45 55 Q50 60 55 55" stroke="black" stroke-width="1" fill="none"/></svg>'),
    queenBee: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 15 Q80 25 90 50 Q90 75 50 85 Q10 75 10 50 Q20 25 50 15" fill="#FFD700" stroke="black" stroke-width="2"/><path d="M30 40 H70" stroke="black" stroke-width="2" fill="none"/><path d="M20 30 C10 20, 15 10, 25 15 Q30 20 25 25" fill="#87CEEB80" stroke="black" stroke-width="1"/><path d="M80 30 C90 20, 85 10, 75 15 Q70 20 75 25" fill="#87CEEB80" stroke="black" stroke-width="1"/><circle cx="40" cy="50" r="4" fill="black"/><circle cx="60" cy="50" r="4" fill="black"/><path d="M45 15 L40 5" stroke="black" stroke-width="2"/><path d="M55 15 L60 5" stroke="black" stroke-width="2"/><path d="M50 15 L60 25 L50 35 L40 25 Z" fill="purple" stroke="black" stroke-width="1"/><path d="M50 85 L55 95 L45 95 Z" fill="black" stroke="black" stroke-width="1"/><path d="M35 70 H65" stroke="#FFD700" stroke-width="2" fill="none"/><path d="M40 75 Q50 80 60 75" stroke="#FFD700" stroke-width="2" fill="none"/></svg>'),
    queenBeeSmiling: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 15 Q80 25 90 50 Q90 75 50 85 Q10 75 10 50 Q20 25 50 15" fill="#FFD700" stroke="black" stroke-width="2"/><path d="M30 40 H70" stroke="black" stroke-width="2" fill="none"/><path d="M20 30 C10 20, 15 10, 25 15 Q30 20 25 25" fill="#87CEEB80" stroke="black" stroke-width="1"/><path d="M80 30 C90 20, 85 10, 75 15 Q70 20 75 25" fill="#87CEEB80" stroke="black" stroke-width="1"/><circle cx="40" cy="50" r="4" fill="black"/><circle cx="60" cy="50" r="4" fill="black"/><path d="M45 15 L40 5" stroke="black" stroke-width="2"/><path d="M55 15 L60 5" stroke="black" stroke-width="2"/><path d="M50 15 L60 25 L50 35 L40 25 Z" fill="purple" stroke="black" stroke-width="1"/><path d="M50 85 L55 95 L45 95 Z" fill="black" stroke="black" stroke-width="1"/><path d="M40 65 Q50 75 60 65" stroke="black" stroke-width="2" fill="none"/><path d="M35 70 H65" stroke="#FFD700" stroke-width="2" fill="none"/><path d="M40 75 Q50 80 60 75" stroke="#FFD700" stroke-width="2" fill="none"/></svg>'),
    shieldCoin: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#FFD700" stroke="#DAA520" stroke-width="2" /><text x="50" y="60" font-size="40" fill="#000" text-anchor="middle" font-family="Arial">S</text></svg>'),
    speedBoost: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#00FF00" stroke="#00CC00" stroke-width="2" /><path d="M30 50 H70 M50 30 V70" stroke="#000" stroke-width="4"/></svg>'),
    magnet: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#FF00FF" stroke="#CC00CC" stroke-width="2" /><path d="M30 30 Q50 50 70 30 M30 70 Q50 50 70 70" stroke="#000" stroke-width="3" fill="none"/></svg>')
};

const COLORS = {
    background: {
        top: '#87CEEB',
        middle: '#4682B4',
        bottom: '#1E90FF'
    },
    speedBoost: '#00FF00',
    magnet: '#FF00FF'
};

function encryptData(data) { return btoa(JSON.stringify(data)); }
function decryptData(data) { try { return JSON.parse(atob(data)); } catch { return null; } }
function encryptLocalStorage(key, value) { localStorage.setItem(key, encryptData(value)); }
function decryptLocalStorage(key) { const value = localStorage.getItem(key); return value ? decryptData(value) : null; }
function random(min, max) { return Math.random() * (max - min) + min; }
function distanceSquared(obj1, obj2) { const dx = obj1.x - obj2.x; const dy = obj1.y - obj2.y; return dx * dx + dy * dy; }
function checkCollision(obj1, obj2) { return distanceSquared(obj1, obj2) < (obj1.radius + obj2.radius) * (obj1.radius + obj2.radius); }
function isOutOfBounds(obj, padding = 100) { return (obj.x < -padding || obj.x > gameState.width + padding || obj.y < -padding || obj.y > gameState.height + padding); }

function loadOwnedCharacters() {
    const owned = decryptLocalStorage('ownedCharacters');
    if (owned) gameState.ownedCharacters = owned;
}

function saveOwnedCharacters() {
    encryptLocalStorage('ownedCharacters', gameState.ownedCharacters);
}

function saveHighScore(score) {
    const currentHighScore = decryptLocalStorage('beeAdventureHighScore') || 0;
    if (score > currentHighScore) {
        encryptLocalStorage('beeAdventureHighScore', score);
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
    gameObjects.queenBee.x = gameState.width / 2;
    gameObjects.queenBee.y = gameState.height / 2;
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
            img.onerror = () => resolve();
            img.src = url;
        });
    }
    for (const [key, url] of Object.entries(SVG_URLS)) {
        imagePromises.push(loadImage(key, url));
    }
    return Promise.all(imagePromises);
}

function updateCharacterButtons() {
    characters.forEach(character => {
        const button = document.getElementById(`character-${character.id}`);
        if (!button) return;
        if (character.key === 'worker-bee' || gameState.ownedCharacters.includes(character.key)) {
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
        if (network.chainId !== parseInt(BASE_CHAIN_ID, 16)) {
            await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BASE_CHAIN_ID }] });
            gameState.provider = new ethers.providers.Web3Provider(window.ethereum);
        }
        gameState.signer = gameState.provider.getSigner();
        gameState.walletAddress = await gameState.signer.getAddress();
        gameState.tokenContract = new ethers.Contract(TOKEN_ADDRESS, HNG_ABI, gameState.signer);
        gameState.walletConnected = true;
        walletAddressElement.textContent = `${gameState.walletAddress.slice(0, 6)}...${gameState.walletAddress.slice(-4)}`;
        connectWalletButton.style.display = 'none';
        const balance = await gameState.tokenContract.balanceOf(gameState.walletAddress);
        gameState.tokenCount = ethers.utils.formatUnits(balance, 18);
        tokenCountElement.textContent = parseFloat(gameState.tokenCount).toFixed(2);
        totalRewardElement.textContent = gameState.pendingRewards.toFixed(2);
        totalRewardsHudElement.textContent = gameState.pendingRewards.toFixed(2);
        alert("Wallet connected!");
    } catch (error) {
        console.error("Wallet connection error:", error);
        alert(`Error: ${error.message}`);
    }
}

async function claimTotalReward() {
    try {
        if (!gameState.walletConnected || gameState.pendingRewards === 0) throw new Error("No rewards or wallet not connected");
        const weiAmount = ethers.utils.parseUnits(gameState.pendingRewards.toString(), 18);
        const tx = await gameState.tokenContract.claimGameRewards(weiAmount);
        await tx.wait();
        gameState.pendingRewards = 0;
        totalRewardElement.textContent = gameState.pendingRewards.toFixed(2);
        totalRewardsHudElement.textContent = gameState.pendingRewards.toFixed(2);
        alert("Rewards claimed!");
    } catch (error) {
        console.error("Reward claim error:", error);
        alert(`Error: ${error.message}`);
    }
}

function getFlowerFromPool() {
    for (let i = 0; i < flowerPool.length; i++) {
        if (!flowerPool[i].active) {
            flowerPool[i].active = true;
            return flowerPool[i];
        }
    }
    const newFlower = { x: 0, y: 0, radius: FLOWER_RADIUS, dx: 0, dy: 0, rotation: 0, rotationSpeed: 0, active: true };
    flowerPool.push(newFlower);
    return newFlower;
}

function resetFlower(flower) {
    flower.active = false;
    flower.x = 0;
    flower.y = 0;
    flower.dx = 0;
    flower.dy = 0;
    flower.rotation = 0;
}

function getWildBeeFromPool() {
    for (let i = 0; i < wildBeePool.length; i++) {
        if (!wildBeePool[i].active) {
            wildBeePool[i].active = true;
            return wildBeePool[i];
        }
    }
    const newBee = { x: 0, y: 0, radius: FLOWER_RADIUS, dx: 0, dy: 0, rotation: 0, rotationSpeed: 0, active: true };
    wildBeePool.push(newBee);
    return newBee;
}

function resetWildBee(bee) {
    bee.active = false;
    bee.x = 0;
    bee.y = 0;
    bee.dx = 0;
    bee.dy = 0;
    bee.rotation = 0;
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
}

function setupKeyboardControls() {
    document.addEventListener('keydown', (event) => {
        gameState.keysPressed[event.key] = true;
        if (event.key === 'p' || event.key === 'P') togglePause();
        if (event.key === 'Escape' && gameState.isStarted && !gameState.isOver) { endGame(); showScreen(startScreen); }
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

function createFlower() {
    if (gameObjects.flowers.length >= MAX_FLOWERS) return;
    const directions = [
        { dx: 0, dy: 0.96 }, { dx: 0.96, dy: 0 }, { dx: -0.96, dy: 0 },
        { dx: 0.64, dy: 0.64 }, { dx: -0.64, dy: 0.64 },
        { dx: 0.64, dy: -0.64 }, { dx: -0.64, dy: -0.64 }
    ];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    let x, y;
    if (dir.dy > 0) { x = random(0, gameState.width); y = -FLOWER_RADIUS; }
    else if (dir.dy < 0) { x = random(0, gameState.width); y = gameState.height + FLOWER_RADIUS; }
    else if (dir.dx > 0) { x = -FLOWER_RADIUS; y = random(0, gameState.height); }
    else { x = gameState.width + FLOWER_RADIUS; y = random(0, gameState.height); }
    const flower = getFlowerFromPool();
    if (flower) {
        flower.x = x;
        flower.y = y;
        flower.dx = dir.dx;
        flower.dy = dir.dy;
        flower.rotation = 0;
        flower.rotationSpeed = random(-0.02, 0.02);
        gameObjects.flowers.push(flower);
    }
}

function createWildBee() {
    if (gameObjects.wildBees.length >= MAX_WILDBEES) return;
    const directions = [
        { dx: 0, dy: 1.28 }, { dx: 1.28, dy: 0 }, { dx: -1.28, dy: 0 },
        { dx: 0.96, dy: 0.96 }, { dx: -0.96, dy: 0.96 },
        { dx: 0.96, dy: -0.96 }, { dx: -0.96, dy: -0.96 }
    ];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    let x, y;
    if (dir.dy > 0) { x = random(0, gameState.width); y = -FLOWER_RADIUS; }
    else if (dir.dy < 0) { x = random(0, gameState.width); y = gameState.height + FLOWER_RADIUS; }
    else if (dir.dx > 0) { x = -FLOWER_RADIUS; y = random(0, gameState.height); }
    else { x = gameState.width + FLOWER_RADIUS; y = random(0, gameState.height); }
    const bee = getWildBeeFromPool();
    if (bee) {
        bee.x = x;
        bee.y = y;
        bee.dx = dir.dx;
        bee.dy = dir.dy;
        bee.rotation = 0;
        bee.rotationSpeed = random(-0.03, 0.03);
        gameObjects.wildBees.push(bee);
    }
}

function createPowerUp(type) {
    const x = random(0, gameState.width);
    const y = -FLOWER_RADIUS;
    gameObjects.powerUps.push({ x, y, radius: FLOWER_RADIUS, dy: 0.8, type });
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
    const gradient = ctx.createLinearGradient(0, 0, 0, gameState.height);
    gradient.addColorStop(0, COLORS.background.top);
    gradient.addColorStop(0.4, COLORS.background.middle);
    gradient.addColorStop(1, COLORS.background.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, gameState.width, gameState.height);
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
    ctx.font = 'bold 40px Helvetica, Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText('Bee Adventure', gameObjects.queenBee.x, gameObjects.queenBee.y - 60);
    ctx.shadowColor = 'transparent';
}

function drawPlayer() {
    const { player } = gameObjects;
    const imageSuffix = characterImageMap[gameState.currentCharacter] || 'worker';
    const isSmiling = player.smileTimer > 0;
    const imageKey = isSmiling ? `playerSmiling_${imageSuffix}` : `playerNormal_${imageSuffix}`;
    player.currentImage = IMAGE_CACHE[imageKey];
    if (isSmiling) player.smileTimer--;
    if (player.currentImage) {
        const size = player.radius * 2;
        const posX = player.x - player.radius;
        const posY = player.y - player.radius;
        ctx.drawImage(player.currentImage, posX, posY, size, size);
    }
    if (gameState.shieldActive) {
        ctx.strokeStyle = '#87CEEB';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 5, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (gameState.speedBoostActive) {
        ctx.strokeStyle = COLORS.speedBoost;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 8, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (gameState.magnetActive) {
        ctx.strokeStyle = COLORS.magnet;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.collectRange, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function drawFlowers() {
    for (const flower of gameObjects.flowers) {
        if (!flower.active) continue;
        ctx.save();
        ctx.translate(flower.x, flower.y);
        ctx.rotate(flower.rotation);
        if (IMAGE_CACHE.flower) ctx.drawImage(IMAGE_CACHE.flower, -flower.radius, -flower.radius, flower.radius * 2, flower.radius * 2);
        ctx.restore();
    }
}

function drawWildBees() {
    for (const bee of gameObjects.wildBees) {
        if (!bee.active) continue;
        ctx.save();
        ctx.translate(bee.x, bee.y);
        ctx.rotate(bee.rotation);
        if (IMAGE_CACHE.wildBee) ctx.drawImage(IMAGE_CACHE.wildBee, -bee.radius, -bee.radius, bee.radius * 2, bee.radius * 2);
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
        }
        ctx.restore();
    }
}

function drawQueenBee() {
    const { queenBee } = gameObjects;
    const isSmiling = queenBee.smileTimer > 0;
    const imageKey = isSmiling ? 'queenBeeSmiling' : 'queenBee';
    const image = IMAGE_CACHE[imageKey];
    if (isSmiling) {
        queenBee.smileTimer--;
        queenBee.animationOffset = Math.sin(Date.now() * 0.01) * 5;
    } else {
        queenBee.animationOffset = 0;
    }
    if (image) {
        const size = queenBee.radius * 2;
        const posX = queenBee.x - queenBee.radius;
        const posY = queenBee.y - queenBee.radius + queenBee.animationOffset;
        ctx.drawImage(image, posX, posY, size, size);
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

function updateObjects(deltaTime) {
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
    for (let i = gameObjects.flowers.length - 1; i >= 0; i--) {
        const flower = gameObjects.flowers[i];
        if (!flower.active) continue;
        flower.x += flower.dx;
        flower.y += flower.dy;
        flower.rotation += flower.rotationSpeed;
        if (isOutOfBounds(flower)) {
            resetFlower(flower);
            gameObjects.flowers.splice(i, 1);
            continue;
        }
        const dist = distanceSquared(player, flower);
        if (gameState.magnetActive && dist < player.collectRange * player.collectRange * 9) {
            const angle = Math.atan2(player.y - flower.y, player.x - flower.x);
            flower.dx += Math.cos(angle) * 1.5;
            flower.dy += Math.sin(angle) * 1.5;
        }
        if (checkCollision(player, flower) || (gameState.magnetActive && dist < player.collectRange * player.collectRange)) {
            resetFlower(flower);
            gameObjects.flowers.splice(i, 1);
            gameState.inventory++;
            inventoryCountElement.textContent = gameState.inventory;
            createParticles(player.x, player.y, '#FF69B4', PARTICLE_COUNT.FLOWER);
            gameObjects.player.smileTimer = SMILE_DURATION;
        }
    }
    if (checkCollision(player, gameObjects.queenBee)) {
        if (gameState.inventory > 0) {
            gameState.score += gameState.inventory * 5 * gameState.level;
            gameState.pendingRewards += gameState.inventory * 5 * gameState.level;
            if (gameState.pendingRewards > 9999) gameState.pendingRewards = 9999;
            gameState.flowerCount += gameState.inventory;
            gameState.inventory = 0;
            gameObjects.queenBee.smileTimer = SMILE_DURATION;
            scoreElement.textContent = gameState.score;
            totalRewardElement.textContent = gameState.pendingRewards.toFixed(2);
            totalRewardsHudElement.textContent = gameState.pendingRewards.toFixed(2);
            inventoryCountElement.textContent = gameState.inventory;
            if (gameState.flowerCount >= FLOWERS_PER_LEVEL * gameState.level) levelUp();
            if (collectSound) collectSound.play().catch(error => console.warn("Sound error:", error));
        }
    }
    for (let i = gameObjects.wildBees.length - 1; i >= 0; i--) {
        const bee = gameObjects.wildBees[i];
        if (!bee.active) continue;
        bee.x += bee.dx;
        bee.y += bee.dy;
        bee.rotation += bee.rotationSpeed;
        if (isOutOfBounds(bee)) {
            resetWildBee(bee);
            gameObjects.wildBees.splice(i, 1);
            continue;
        }
        if (checkCollision(player, bee)) {
            if (!gameState.shieldActive) {
                gameOver();
                break;
            } else {
                resetWildBee(bee);
                gameObjects.wildBees.splice(i, 1);
                createParticles(bee.x, bee.y, '#FFA500', PARTICLE_COUNT.BREAK);
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
                case POWERUP_TYPES.SHIELD: gameState.shieldActive = true; gameState.shieldTimer = 5; break;
                case POWERUP_TYPES.SPEED: gameState.speedBoostActive = true; gameState.speedBoostTimer = 8; break;
                case POWERUP_TYPES.MAGNET: gameState.magnetActive = true; gameState.magnetTimer = 10; break;
            }
            gameObjects.powerUps.splice(i, 1);
            createParticles(powerUp.x, powerUp.y, COLORS[powerUp.type] || '#87CEEB', PARTICLE_COUNT.FLOWER);
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
    createParticles(gameState.width / 2, gameState.height / 2, '#87CEEB', PARTICLE_COUNT.LEVEL_UP);
    if (levelUpSound) levelUpSound.play().catch(error => console.warn("Level up sound error:", error));
}

function spawnObjects(currentTime) {
    const difficultyFactor = Math.log(gameState.level + 1);
    const flowerSpawnRate = INITIAL_FLOWER_SPAWN_RATE / difficultyFactor;
    if (currentTime - gameState.lastFlowerTime > flowerSpawnRate) {
        createFlower();
        gameState.lastFlowerTime = currentTime;
    }
    const wildBeeSpawnRate = INITIAL_WILDBEE_SPAWN_RATE / difficultyFactor;
    if (currentTime - gameState.lastWildBeeTime > wildBeeSpawnRate) {
        createWildBee();
        gameState.lastWildBeeTime = currentTime;
    }
    const powerUpSpawnRate = 10000;
    if (currentTime - gameState.lastShieldTime > powerUpSpawnRate && Math.random() < 0.3) {
        const type = Math.random() < 0.5 ? POWERUP_TYPES.SHIELD : Math.random() < 0.5 ? POWERUP_TYPES.SPEED : POWERUP_TYPES.MAGNET;
        createPowerUp(type);
        gameState.lastShieldTime = currentTime;
    }
}

function gameLoop(timestamp) {
    if (!gameState.isStarted || gameState.isOver) return;
    const currentTime = performance.now();
    const deltaTime = Math.min(currentTime - gameState.lastFrameTime, 100);
    if (!gameState.isPaused) {
        ctx.clearRect(0, 0, gameState.width, gameState.height);
        drawBackground();
        spawnObjects(currentTime);
        handleKeyboardInput();
        updateObjects(deltaTime);
        updateParticles();
        drawFlowers();
        drawWildBees();
        drawPowerUps();
        drawPlayer();
        drawQueenBee();
        drawParticles();
        gameState.lastFrameTime = currentTime;
    }
    requestAnimationFrame(gameLoop);
}

function startGame() {
    gameState.isStarted = true;
    gameState.isOver = false;
    gameState.isPaused = false;
    gameState.score = 0;
    gameState.level = 1;
    gameState.flowerCount = 0;
    gameState.inventory = 0;
    gameState.lastFrameTime = performance.now();
    gameState.lastFlowerTime = performance.now();
    gameState.lastWildBeeTime = performance.now();
    gameState.lastShieldTime = performance.now();
    gameObjects.flowers = [];
    gameObjects.wildBees = [];
    gameObjects.powerUps = [];
    gameObjects.particles = [];
    gameObjects.player.smileTimer = 0;
    gameObjects.queenBee.smileTimer = 0;
    gameObjects.player.x = gameState.width / 2;
    gameObjects.player.y = gameState.height - 100;
    gameObjects.queenBee.x = gameState.width / 2;
    gameObjects.queenBee.y = gameState.height / 2;
    applySkills();
    scoreElement.textContent = gameState.score;
    levelElement.textContent = gameState.level;
    flowerCountElement.textContent = gameState.flowerCount;
    inventoryCountElement.textContent = gameState.inventory;
    totalRewardsHudElement.textContent = gameState.pendingRewards.toFixed(2);
    hudElement.classList.add('visible');
    hideAllScreens();
    if (backgroundMusic && gameState.musicEnabled) backgroundMusic.play().catch(error => console.warn("Music error:", error));
    requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameState.isOver = true;
    const isNewHighScore = saveHighScore(gameState.score);
    finalScoreElement.textContent = `Score: ${gameState.score}`;
    highScoreElement.textContent = `High Score: ${gameState.highScore}`;
    rewardElement.textContent = `Total Reward: ${gameState.pendingRewards} HNG`;
    if (isNewHighScore) highScoreElement.textContent += ' (New Record!)';
    if (backgroundMusic) backgroundMusic.pause();
    showScreen(gameOverScreen);
    hudElement.classList.remove('visible');
}

function endGame() {
    gameState.isStarted = false;
    gameState.isOver = false;
    gameState.isPaused = false;
    gameObjects.flowers = [];
    gameObjects.wildBees = [];
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
        const tx = await gameState.tokenContract.buyCharacter(characterId);
        await tx.wait();
        gameState.ownedCharacters.push(character.key);
        saveOwnedCharacters();
        gameState.currentCharacter = character.key;
        updateCharacterButtons();
        alert(`${character.name} purchased!`);
    } catch (error) {
        console.error("Purchase error:", error);
        alert("Purchase failed!");
    }
}

function init() {
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
            if (character.key === 'worker-bee' || gameState.ownedCharacters.includes(character.key)) {
                gameState.currentCharacter = character.key;
                updateCharacterButtons();
            } else {
                await buyCharacter(character.id);
            }
        });
    });
    preloadImages().then(() => {
        gameState.isLoading = false;
        showScreen(startScreen);
        gameObjects.player.currentImage = IMAGE_CACHE[`playerNormal_${characterImageMap[gameState.currentCharacter] || 'worker'}`];
        totalRewardElement.textContent = gameState.pendingRewards.toFixed(2);
        totalRewardsHudElement.textContent = gameState.pendingRewards.toFixed(2);
        updateCharacterButtons();
    }).catch(error => {
        console.error('Image loading error:', error);
        gameState.isLoading = false;
        showScreen(startScreen);
    });
    connectWalletButton.addEventListener('click', connectWallet);
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    resumeButton.addEventListener('click', togglePause);
    claimTotalRewardButton.addEventListener('click', claimTotalReward);
    mainMenuRewardButton.addEventListener('click', () => {
        endGame();
        showScreen(startScreen);
    });
    window.addEventListener('resize', resizeCanvas);
}

init();