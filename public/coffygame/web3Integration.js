import * as Const from './constants.js';
import * as Utils from './utils.js';
const { showNotification, checkClaimRateLimit, recordClaim } = Utils; // Import the specific functions

// YENİ KONTRAT ADRESLERİ VE ABI
const NEW_TOKEN_ADDRESS = "0x33AA3dbCB3c4fF066279AD33099Ce154936D8b88";
const MODULE_CONTRACT_ADDRESS = '0xd872848e29121bC29aa9a1c06Eb96f18B16e9d1B';

// YENİ TOKEN ABI - Sadece gerekli fonksiyonlar
const NEW_TOKEN_ABI = [{"inputs":[{"internalType":"address","name":"_treasury","type":"address"},{"internalType":"address","name":"_liquidity","type":"address"},{"internalType":"address","name":"_community","type":"address"},{"internalType":"address","name":"_team","type":"address"},{"internalType":"address","name":"_marketing","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AccessControlBadConfirmation","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"neededRole","type":"bytes32"}],"name":"AccessControlUnauthorizedAccount","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"BridgeModuleSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"characterId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"CharacterPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"CrossChainEnabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"CrossChainModuleSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"penalty","type":"uint256"}],"name":"EarlyUnstakePenalty","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"GameRewardsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBurnedThisYear","type":"uint256"}],"name":"GlobalModuleBurn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalMintedThisYear","type":"uint256"}],"name":"GlobalModuleMint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"InflationMinted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"moduleType","type":"string"}],"name":"ModuleEnabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"moduleType","type":"string"},{"indexed":false,"internalType":"address","name":"module","type":"address"}],"name":"ModuleSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"rewardType","type":"string"}],"name":"PendingRewardAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"totalAmount","type":"uint256"}],"name":"PendingRewardsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[],"name":"TradingEnabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Unstaked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"wallet","type":"address"},{"indexed":false,"internalType":"string","name":"profileId","type":"string"}],"name":"UserProfileLinked","type":"event"},{"inputs":[],"name":"ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ANNUAL_RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"COMMUNITY_ALLOCATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DAO_MEMBERSHIP_THRESHOLD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEX_TAX","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EARLY_UNSTAKE_PENALTY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FIXED_CHARACTERS_COUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LEGENDARY_CHARACTER_ID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LIQUIDITY_ALLOCATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MARKETING_ALLOCATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_WEEKLY_CLAIM","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_ACTIVITY_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_BALANCE_FOR_ACCUMULATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_CLAIM_BALANCE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_WALLET_AGE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MODULE_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PENDING_REWARD_EXPIRY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SEMIANNUAL_INFLATION_RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TEAM_ALLOCATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TIMELOCK_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TIMELOCK_DELAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOTAL_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TREASURY_ALLOCATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"authorizedModules","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"characterNames","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"baseAmount","type":"uint256"}],"name":"claimGameRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimPendingRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"claimedThisWeek","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"community","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"daoEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"daoModule","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"emergencyUnstake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"enableDAO","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"enableNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"enableSocial","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"enableTrading","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"module","type":"address"}],"name":"executeModuleDeauthorization","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"gameStats","outputs":[{"internalType":"uint256","name":"totalGamesPlayed","type":"uint256"},{"internalType":"uint256","name":"totalRewardsClaimed","type":"uint256"},{"internalType":"uint256","name":"lastGameTimestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getActivityStatus","outputs":[{"internalType":"uint256","name":"gameStartTime","type":"uint256"},{"internalType":"uint256","name":"stepStartTime","type":"uint256"},{"internalType":"bool","name":"canClaimGame","type":"bool"},{"internalType":"bool","name":"canClaimStep","type":"bool"},{"internalType":"uint256","name":"remainingGameTime","type":"uint256"},{"internalType":"uint256","name":"remainingStepTime","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_characterId","type":"uint256"}],"name":"getCharacter","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"totalSupply","type":"uint256"},{"internalType":"uint256","name":"maxSupply","type":"uint256"},{"internalType":"uint256","name":"multiplier","type":"uint256"},{"internalType":"uint256","name":"claimMultiplier","type":"uint256"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"string","name":"metadataURI","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getCharacterMultiplier","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getGameStats","outputs":[{"internalType":"uint256","name":"totalGamesPlayed","type":"uint256"},{"internalType":"uint256","name":"totalRewardsClaimed","type":"uint256"},{"internalType":"uint256","name":"lastGameTimestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getGlobalModuleLimits","outputs":[{"internalType":"uint256","name":"maxAnnualMint","type":"uint256"},{"internalType":"uint256","name":"maxAnnualBurn","type":"uint256"},{"internalType":"uint256","name":"mintedThisYear","type":"uint256"},{"internalType":"uint256","name":"burnedThisYear","type":"uint256"},{"internalType":"uint256","name":"remainingMint","type":"uint256"},{"internalType":"uint256","name":"remainingBurn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getInflationInfo","outputs":[{"internalType":"uint256","name":"lastTime","type":"uint256"},{"internalType":"uint256","name":"nextTime","type":"uint256"},{"internalType":"bool","name":"canTrigger","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getModuleStates","outputs":[{"internalType":"address","name":"dao","type":"address"},{"internalType":"bool","name":"daoActive","type":"bool"},{"internalType":"address","name":"nft","type":"address"},{"internalType":"bool","name":"nftActive","type":"bool"},{"internalType":"address","name":"social","type":"address"},{"internalType":"bool","name":"socialActive","type":"bool"},{"internalType":"address","name":"crossChain","type":"address"},{"internalType":"bool","name":"crossChainActive","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getPendingRewardsStatus","outputs":[{"internalType":"uint256","name":"totalPending","type":"uint256"},{"internalType":"uint256","name":"gameRewards","type":"uint256"},{"internalType":"uint256","name":"stepRewards","type":"uint256"},{"internalType":"uint256","name":"snapRewards","type":"uint256"},{"internalType":"bool","name":"canClaim","type":"bool"},{"internalType":"bool","name":"hasExpired","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getRemainingDailyLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getStakeInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"pendingReward","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStakingAPY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUnstakePenalty","outputs":[{"internalType":"uint256","name":"penalty","type":"uint256"},{"internalType":"bool","name":"hasPenalty","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_characterId","type":"uint256"}],"name":"getUserCharacterBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserCharacterMultiplier","outputs":[{"internalType":"uint256","name":"multiplier","type":"uint256"},{"internalType":"string","name":"eligibleCharacter","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"wallet","type":"address"}],"name":"getUserProfile","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"profileId","type":"string"}],"name":"getWalletByProfile","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"callerConfirmation","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"module","type":"address"}],"name":"scheduleModuleDeauthorization","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_module","type":"address"}],"name":"setCoffeeShopModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_module","type":"address"}],"name":"setDAOModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_backend","type":"address"}],"name":"setMobileBackend","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_module","type":"address"}],"name":"setNFTModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_module","type":"address"}],"name":"setSocialModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"socialEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"socialModule","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"stakes","outputs":[{"internalType":"uint128","name":"amount","type":"uint128"},{"internalType":"uint64","name":"startTime","type":"uint64"},{"internalType":"uint64","name":"lastClaim","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"startGame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startGameSession","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startStep","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"team","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStaked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferForModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"treasury","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"triggerInflation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unstake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userCharacters","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userProfiles","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"walletCreatedAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"weeklyRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

// ESKİ TOKEN ABI - Sadece balanceOf
const OLD_TOKEN_ABI = [
    "function balanceOf(address account) view returns (uint256)"
];

// Function to wait for ethers.js to be available
async function waitForEthers(maxWaitTime = 8000) {
    console.log("Waiting for ethers.js to be available...");
    
    // Check if it's already available via the global flag or window.ethers
    if (window.ethersLoaded || typeof window.ethers !== 'undefined') {
        console.log("✅ Ethers.js is already available");
        window.ethersLoaded = true;
        return window.ethers;
    }

    // Try loading it directly first before waiting
    try {
        await loadEthersDirectly();
        if (typeof window.ethers !== 'undefined') {
            console.log("✅ Ethers.js loaded directly");
            window.ethersLoaded = true;
            return window.ethers;
        }
    } catch (directError) {
        console.log("Direct ethers loading failed, will try waiting:", directError);
    }
    
    // Setup a timeout for the maximum wait time
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Ethers.js loading timeout")), maxWaitTime);
    });

    // Setup a promise that resolves when ethers is available
    const ethersPromise = new Promise(resolve => {
        // First check if it's already available
        if (window.ethersLoaded || typeof window.ethers !== 'undefined') {
            window.ethersLoaded = true;
            resolve(window.ethers);
            return;
        }
        
        // If not, set up a listener for the custom event
        window.addEventListener('ethersLoaded', () => {
            resolve(window.ethers);
        }, { once: true });
        
        // Also set up periodic checks
        const checkInterval = setInterval(() => {
            if (window.ethersLoaded || typeof window.ethers !== 'undefined') {
                clearInterval(checkInterval);
                window.ethersLoaded = true;
                resolve(window.ethers);
            }
        }, 200);
        
        // Clear the interval after maxWaitTime
        setTimeout(() => clearInterval(checkInterval), maxWaitTime);
    });

    // Race between the timeout and ethers becoming available
    try {
        return await Promise.race([ethersPromise, timeout]);
    } catch (error) {
        console.error("❌ Ethers.js loading failed:", error);
        
        // Last attempt to load it directly
        try {
            await loadEthersDirectly();
            
            // Wait a moment for the script to initialize
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (typeof window.ethers !== 'undefined') {
                console.log("✅ Ethers.js loaded in final attempt");
                window.ethersLoaded = true;
                return window.ethers;
            }
        } catch (finalError) {
            console.error("Final loading attempt failed:", finalError);
        }
        
        throw new Error("Failed to load ethers.js after multiple attempts");
    }
}

// Function to handle skill upgrades
export async function upgradeSkill(skillKey, gameState, player, uiCallbacks) {
    const { updateSkillTreeUI, applySkills, saveSkillTree, tokenCountElement } = uiCallbacks;
    const { skillTree, tokenContract, walletAddress } = gameState;

    if (!skillTree.hasOwnProperty(skillKey)) {
        showNotification(`Unknown skill: ${skillKey}`, 'error');
        return;
    }

    const skill = skillTree[skillKey];

    if (skill.level >= skill.maxLevel) {
        showNotification(`${skillKey.charAt(0).toUpperCase() + skillKey.slice(1)} skill is already at max level!`, 'info');
        return;
    }

    const cost = skill.cost * Math.pow(2, skill.level);

    if (!walletAddress || !tokenContract) {
        showNotification('Please connect your wallet first.', 'warning');
        return;
    }

    try {
        const balance = await tokenContract.balanceOf(walletAddress);
        const requiredAmount = ethers.utils.parseUnits(cost.toString(), 18); // Assuming 18 decimals

        if (balance.lt(requiredAmount)) {
            showNotification(`Insufficient COFFY balance. Need ${cost} COFFY.`, 'error');
            return;
        }

        showNotification(`Upgrading ${skillKey}... Please confirm the transaction.`, 'info');

        // --- Placeholder for actual token spending ---
        // In a real scenario, you would call a contract function here
        // to spend/burn the tokens or transfer them to a specific address.
        // Example (replace with actual contract interaction):
        // const tx = await tokenContract.spendTokensForSkill(requiredAmount);
        // await tx.wait();
        // For now, we'll just simulate the balance decrease locally.
        console.log(`Simulating spending ${cost} COFFY for ${skillKey} upgrade.`);
        // Update local token count for UI feedback (fetch real balance later)
        gameState.tokenCount = parseFloat(ethers.utils.formatUnits(balance.sub(requiredAmount), 18));
        if (tokenCountElement) tokenCountElement.textContent = gameState.tokenCount.toFixed(2);
        // --- End Placeholder ---


        // Upgrade successful
        skill.level++;
        showNotification(`${skillKey.charAt(0).toUpperCase() + skillKey.slice(1)} upgraded to level ${skill.level}!`, 'success');

        // Save the new skill tree state
        saveSkillTree(skillTree);

        // Apply the updated skills to the player
        applySkills(player, skillTree);

        // Update the UI
        updateSkillTreeUI(skillTree);

        // Refresh token balance from chain after simulated spend
        await updateTokenBalance(gameState, { tokenCountElement });


    } catch (error) {
        console.error(`Error upgrading ${skillKey}:`, error);
        showNotification(`Failed to upgrade ${skillKey}. ${error.message || ''}`, 'error');
    }
}

// Helper function to load ethers.js directly
async function loadEthersDirectly() {
    return new Promise((resolve, reject) => {
        // Check if it's already loaded
        if (window.ethersLoaded || typeof window.ethers !== 'undefined') {
            window.ethersLoaded = true;
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = "libs/ethers-5.7.2.min.js"; // Use local copy for reliability
        script.async = false;
        script.onload = function() {
            console.log("✅ Ethers.js loaded via direct script injection");
            window.ethersLoaded = true;
            resolve();
        };
        script.onerror = function(err) {
            reject(new Error("Failed to load ethers.js via direct script"));
        };
        document.head.appendChild(script);
    });
}

// Function to update UI elements related to wallet and balance
function updateWalletUI(gameState, tokenCountElement, walletAddressElement, connectWalletButton, totalRewardElement, totalRewardsHudElement) {
    if (gameState.walletConnected) {
        walletAddressElement.textContent = `${gameState.walletAddress.slice(0, 6)}...${gameState.walletAddress.slice(-4)}`;
        connectWalletButton.style.display = 'none';
        tokenCountElement.textContent = parseFloat(gameState.tokenCount).toFixed(2);
        totalRewardElement.textContent = gameState.pendingRewards.toFixed(2);
        totalRewardsHudElement.textContent = gameState.pendingRewards.toFixed(2);
    } else {
        walletAddressElement.textContent = "Not Connected";
        connectWalletButton.style.display = 'block';
        tokenCountElement.textContent = '0';
    }
}

export async function connectWallet(gameState, uiElements) {
    const { tokenCountElement, walletAddressElement, connectWalletButton, totalRewardElement, totalRewardsHudElement } = uiElements;
    try {
        // First, ensure ethers.js is available
        console.log("Starting wallet connection process...");
        
        try {
            await waitForEthers(10000); // Increased timeout to 10 seconds
            console.log("✅ Ethers.js ready for wallet connection");
            
            // Double check that ethers is actually available
            if (typeof window.ethers === 'undefined') {
             throw new Error("Ethers object is still undefined after loading");
            }
        } catch (ethersError) {
            console.error("❌ Failed to load ethers.js:", ethersError);
            showNotification("Could not load Web3 library. Please check connection or refresh.", 'error');
            throw new Error("Failed to load Web3 library");
        }

        // Add a small delay to allow wallet provider injection
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay

        // Check if ethereum provider is available *after* the delay
        if (!window.ethereum) {
            console.error("window.ethereum not found after delay.");
            showNotification("Web3 wallet (like MetaMask) not detected. Please install and unlock it.", 'error');
            showWalletGuidance(); // Show guidance if wallet is missing
            throw new Error('No Web3 wallet found.');
        }

        // Create provider - use a try/catch here too
        try {
            gameState.provider = new window.ethers.providers.Web3Provider(window.ethereum, "any");
            await gameState.provider.send("eth_requestAccounts", []);
        } catch (providerError) {
            console.error("Failed to create provider:", providerError);
            showNotification("Failed to connect wallet. Check browser permissions.", 'error');
            throw providerError;
        }

        const network = await gameState.provider.getNetwork();
        if (network.chainId !== parseInt(Const.BSC_CHAIN_ID, 16)) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: Const.BSC_CHAIN_ID }],
                });
                gameState.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            } catch (switchError) {
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: Const.BSC_CHAIN_ID,
                                chainName: 'Binance Smart Chain Mainnet',
                                nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                                blockExplorerUrls: ['https://bscscan.com']
                            }],
                        });
                        gameState.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
                    } catch (addError) {
                        console.error("Failed to add BSC network:", addError);
                        showNotification("Failed to add BSC network. Please add it manually in MetaMask.", 'error');
                        throw addError;
                    }
                } else {
                    console.error("Failed to switch network:", switchError);
                    showNotification(`Failed to switch network: ${switchError.message}`, 'error');
                    throw switchError;
                }
            }
        }

        gameState.signer = gameState.provider.getSigner();
        gameState.walletAddress = await gameState.signer.getAddress();
        gameState.tokenContract = new ethers.Contract(NEW_TOKEN_ADDRESS, NEW_TOKEN_ABI, gameState.signer);
        gameState.walletConnected = true;

        try {
            const balance = await gameState.tokenContract.balanceOf(gameState.walletAddress);
            gameState.tokenCount = ethers.utils.formatUnits(balance, 18);
        } catch (balanceError) {
            console.error("Failed to fetch token balance:", balanceError);
            gameState.tokenCount = "0"; // Set to 0 on error
        }

        updateWalletUI(gameState, tokenCountElement, walletAddressElement, connectWalletButton, totalRewardElement, totalRewardsHudElement);
        await Utils.checkOwnedCharactersOnChain(gameState, () => Utils.updateCharacterButtons(gameState)); // Pass update callback

        showNotification("Wallet connected successfully!", 'success');

        // Setup listeners after successful connection
        window.ethereum.removeAllListeners('accountsChanged'); // Remove previous listeners if any
        window.ethereum.on('accountsChanged', (accounts) => {
            console.log('Wallet account changed:', accounts);
            window.location.reload();
        });

        window.ethereum.removeAllListeners('chainChanged');
        window.ethereum.on('chainChanged', (chainId) => {
            console.log('Wallet network changed:', chainId);
            window.location.reload();
        });

        // --- EKLENDİ: Web3Manager'ı güncelle ve kontratları başlat ---
        if (window.web3Manager) {
            window.web3Manager.provider = gameState.provider;
            window.web3Manager.signer = gameState.signer;
            window.web3Manager.walletAddress = gameState.walletAddress;
            window.web3Manager.connected = true;
            await window.web3Manager.initContracts();
        }

    } catch (error) {
        console.error("❌ Wallet connection failed:", error);
        showNotification(`Wallet connection failed: ${error.message || 'Unknown error'}`, 'error');
        gameState.walletConnected = false;
        gameState.walletAddress = null;
        gameState.provider = null;
        gameState.signer = null;
        gameState.tokenContract = null;
        gameState.tokenCount = "0";
        updateWalletUI(gameState, tokenCountElement, walletAddressElement, connectWalletButton, totalRewardElement, totalRewardsHudElement);
    }
}

// Helper function to show wallet installation guidance
function showWalletGuidance() {
    // IMPORTANT CHANGE: If MetaMask is already installed, we should automatically try to connect
    if (window.ethereum) {
        console.log("MetaMask already installed, attempting direct connection...");
        // We don't need to show any dialog - just directly request connection
        try {
            // This will trigger the MetaMask connection popup
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(accounts => {
                    console.log("MetaMask connected directly:", accounts);
                    // The main connectWallet function will continue from here
                })
                .catch(err => {
                    console.error("MetaMask connection rejected:", err);
                    showNotification("Please approve the connection in MetaMask.", 'warning');
                });
            return; // Exit early - no need to show the guidance
        } catch (err) {
            console.error("Failed to connect directly to MetaMask:", err);
            // Continue to show guidance on error
        }
    }
    
    // Only show installation guidance if MetaMask isn't detected
    const modalOverlay = document.createElement('div');
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.75);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: linear-gradient(135deg, #6F4E37, #3D2C1E);
        color: #fff;
        border-radius: 12px;
        padding: 24px;
        max-width: 90%;
        width: 400px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        text-align: center;
    `;
    
    modal.innerHTML = `
        <h2 style="margin-top:0;">Web3 Wallet Required</h2>
        <p style="margin:16px 0;">To connect your wallet and earn COFFY rewards, you need a Web3 wallet like MetaMask.</p>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:24px;">
            <button id="install-metamask-btn" style="background:#F6851B;color:white;border:none;padding:12px;border-radius:8px;cursor:pointer;font-weight:bold;">Install MetaMask</button>
            <button id="close-modal-btn" style="background:rgba(255,255,255,0.2);color:white;border:none;padding:12px;border-radius:8px;cursor:pointer;">Continue Without Wallet</button>
            <p style="font-size:12px;margin-top:12px;">You can still play the game without connecting a wallet!</p>
        </div>
    `;
    
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
    
    // Add event listeners
    document.getElementById('install-metamask-btn').addEventListener('click', () => {
        window.open("https://metamask.io/download/", "_blank");
        document.body.removeChild(modalOverlay);
    });
    
    document.getElementById('close-modal-btn').addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
    });
}

export async function claimTotalReward(gameState, uiElements) {
    const { claimTotalRewardButton, totalRewardElement, totalRewardsHudElement, tokenCountElement } = uiElements;
    
    // Doğrulama kontrolü (7 gün bekleme)
    const verificationTs = localStorage.getItem('coffy_human_verification_ts');
    const now = Date.now();
    const oneWeekMs = 3 * 24 * 60 * 60 * 1000;
    if (!verificationTs || now - Number(verificationTs) < oneWeekMs) {
        showNotification('Please verify your wallet first by playing the game, then wait 3 days to claim rewards!', 'warning', 4000);
        return;
    }

    // 2 dakika oynama kontrolü
    const gameStartTime = localStorage.getItem('coffy_game_session_start');
    if (!gameStartTime) {
        showNotification('You need to play the game for at least 2 minutes before claiming rewards! 🎮', 'warning', 4000);
        return;
    }
    
    const sessionDuration = (Date.now() - Number(gameStartTime)) / 1000 / 60; // dakika cinsinden
    if (sessionDuration < 2) {
        const remainingMinutes = (2 - sessionDuration).toFixed(1);
        showNotification(`⏰ Play for ${remainingMinutes} more minutes to claim rewards! Keep collecting coffee! ☕`, 'info', 4000);
        return;
    }

    if (!gameState.walletConnected) {
        showNotification("Please connect your wallet first", "warning");
        return;
    }

    if (gameState.pendingRewards <= 0) {
        showNotification("No rewards to claim", "warning");
        return;
    }

    // Apply daily maximum limit of 5000 tokens (YENİ LİMİT - Coffy Adventure)
    const MAX_DAILY_CLAIM = 5000;
    const actualClaimAmount = Math.min(gameState.pendingRewards, MAX_DAILY_CLAIM);
    
    if (actualClaimAmount < gameState.pendingRewards) {
        console.log(`Limiting claim amount: ${gameState.pendingRewards} -> ${actualClaimAmount} (daily max: ${MAX_DAILY_CLAIM})`);
    }

    console.log(`Claiming ${actualClaimAmount} tokens (available: ${gameState.pendingRewards})`);

    try {
        // Check IP rate limit first
        const rateLimit = Utils.checkClaimRateLimit();
        if (!rateLimit.canClaim) {
            showNotification(rateLimit.message, 'warning');
            return;
        }

        // Disable claim button
        claimTotalRewardButton.disabled = true;
        claimTotalRewardButton.textContent = "CLAIMING...";
        
        console.log("Attempting to claim total reward...");
        
        // Check if tokenContract is available first
        if (!gameState.tokenContract) {
            showNotification("Smart contract not available. Please refresh and try again.", 'error');
            claimTotalRewardButton.disabled = false;
            claimTotalRewardButton.textContent = "CLAIM REWARDS";
            return;
        }
        
        // Try to get decimals
        const decimals = await gameState.tokenContract.decimals();
        const rewardAmount = ethers.utils.parseUnits(actualClaimAmount.toString(), decimals);
        
        showNotification("Claim transaction sent! Waiting for confirmation...", 'info', 5000);
        
        // Call the smart contract claim function with actual claim amount
        const tx = await gameState.tokenContract.claimGameRewards(rewardAmount);
        
        // Wait for transaction to be confirmed
        await tx.wait();
        
        // Record the claim for rate limiting
        Utils.recordClaim();
        
        // Reduce pending rewards by claimed amount only
        gameState.pendingRewards = Math.max(0, gameState.pendingRewards - actualClaimAmount);
        
        // Update UI elements with new pending rewards
        if (totalRewardElement) totalRewardElement.textContent = gameState.pendingRewards.toFixed(2);
        if (totalRewardsHudElement) totalRewardsHudElement.textContent = gameState.pendingRewards.toFixed(2);

        try {
            const balance = await gameState.tokenContract.balanceOf(gameState.walletAddress);
            gameState.tokenCount = ethers.utils.formatUnits(balance, 18);
            tokenCountElement.textContent = parseFloat(gameState.tokenCount).toFixed(2);
        } catch (balanceError) {
            console.error("Failed to update token balance after claim:", balanceError);
        }

        // Show appropriate success message
        let successMessage = `Successfully claimed ${actualClaimAmount} COFFY tokens!`;
        if (actualClaimAmount < gameState.pendingRewards + actualClaimAmount) {
            const remainingTokens = gameState.pendingRewards;
            successMessage += ` (${remainingTokens} tokens remaining for tomorrow)`;
        }
        showNotification(successMessage, 'success');

    } catch (error) {
        console.error("Error claiming rewards:", error);
        
        let errorMsg = "Failed to claim rewards";
        if (error.message) {
            if (error.message.includes("Daily reward limit exceeded")) {
                errorMsg = "Günlük ödül limiti aşıldı. Yarın tekrar deneyin.";
            } else if (error.message.includes("Sybil protection")) {
                errorMsg = "Anti-Sybil koruması: Minimum 50,000 COFFY balance gerekli.";
            } else if (error.message.includes("Claim cooldown")) {
                errorMsg = "Claim cooldown aktif. Biraz bekleyin.";
            } else if (error.message.includes("user rejected")) {
                errorMsg = "Transaction rejected by user";
            } else if (error.message.includes("insufficient funds")) {
                errorMsg = "Insufficient funds for gas";
            } else {
                errorMsg = error.message;
            }
        }
        
        showNotification(errorMsg, 'error');
    }
}

export async function buyCharacter(characterId, gameState, uiElements) {
     const { tokenCountElement } = uiElements; // Assuming tokenCountElement is passed

    if (!gameState.walletConnected) {
        showNotification("Please connect your wallet first.", 'warning');
        return;
    }

    const character = Const.characters.find(c => c.id === characterId);
    if (!character) {
        showNotification("Invalid character selected.", 'error');
        return;
    }
    if (character.price <= 0) {
        // This case should ideally be handled by disabling the button via updateCharacterButtons
        console.warn("Attempted to buy free/invalid character:", character.name);
        return;
    }

    const price = character.price;
    const button = document.getElementById(`character-${character.id}`); // Find button in DOM

    try {
        const balanceWei = await gameState.tokenContract.balanceOf(gameState.walletAddress);
        const priceWei = ethers.utils.parseUnits(price.toString(), 18);

        if (balanceWei.lt(priceWei)) {
            showNotification(`Insufficient COFFY balance! You need ${price} COFFY.`, 'warning');
            return;
        }

        // Replace confirm with notification
        showNotification(`Attempting to buy ${character.name} for ${price} COFFY...`, 'info');
        // if (!confirmPurchase) return; // Removed confirm

        if (button) {
            button.disabled = true;
            button.textContent = "Buying...";
        }

        let gasLimitEstimate;
        try {
            gasLimitEstimate = await gameState.tokenContract.estimateGas.buyCharacter(characterId);
        } catch (gasError) {
            console.warn("Gas estimation failed for buyCharacter, using default:", gasError);
            gasLimitEstimate = ethers.BigNumber.from("400000");
        }
        const gasLimitWithBuffer = gasLimitEstimate.mul(120).div(100);

        const tx = await gameState.tokenContract.buyCharacter(characterId, { gasLimit: gasLimitWithBuffer });
        showNotification("Purchase transaction sent! Waiting for confirmation...", 'info', 5000); // Longer duration
        await tx.wait();

        // Update state and UI on success
        if (!gameState.ownedCharacters.includes(character.key)) {
             gameState.ownedCharacters.push(character.key);
             Utils.saveOwnedCharacters(gameState);
        }
        gameState.currentCharacter = character.key;
        Utils.updateCharacterButtons(gameState); // Update all buttons

        try {
            const newBalance = await gameState.tokenContract.balanceOf(gameState.walletAddress);
            gameState.tokenCount = ethers.utils.formatUnits(newBalance, 18);
            tokenCountElement.textContent = parseFloat(gameState.tokenCount).toFixed(2);
        } catch (balanceError) {
            console.error("Failed to update token balance after purchase:", balanceError);
        }

        showNotification(`${character.name} purchased and selected successfully!`, 'success');

    } catch (error) {
        console.error("Character purchase failed:", error);
        let errorMessage = "Character purchase failed.";
         if (error.code === 'ACTION_REJECTED') {
            errorMessage = "Transaction rejected by user.";
         } else if (error.message) {
              errorMessage += ` Error: ${error.message.substring(0,100)}...`;
         }
        showNotification(errorMessage, 'error');
    } finally {
         // Reset button state regardless of success/failure by re-running update
         if (button) {
             Utils.updateCharacterButtons(gameState);
         }
    }
}

/**
 * Web3 yönetimi için ana sınıf
 */
class Web3Manager {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.connected = false;
        this.walletAddress = null;
        this.tokenContract = null;
        this.oldTokenContract = null;
        this.tokenAddress = NEW_TOKEN_ADDRESS; // YENİ ADRES
        this.chainId = '0x38'; // BSC
        this.eventListeners = {};
        
        // Migration bilgileri
        this.migrationInfo = {
            enabled: false,
            deadline: 0,
            oldBalance: 0,
            canMigrate: false
        };
    }
    
    /**
     * Kontratları başlat
     */
    async initContracts() {
        if (!this.signer) {
            console.error("Signer bulunamadı");
            return;
        }

        try {
            // Yeni token kontratı
            this.tokenContract = new ethers.Contract(
                NEW_TOKEN_ADDRESS,
                NEW_TOKEN_ABI,
                this.signer
            );

            // Eski token kontratı (migration için)
            // this.oldTokenContract = new ethers.Contract(
            //     OLD_TOKEN_ADDRESS,
            //     OLD_TOKEN_ABI,
            //     this.provider
            // );

            console.log("Kontratlar başarıyla başlatıldı");
            
            // Migration bilgilerini kontrol et
            // await this.checkMigrationStatus();
            
        } catch (error) {
            console.error("Kontrat başlatma hatası:", error);
        }
    }

    /**
     * Migration durumunu kontrol et
     */
    async checkMigrationStatus() {
        if (!this.tokenContract || !this.walletAddress) return;
        
        try {
            // Migration bilgilerini al
            const migrationInfo = await this.tokenContract.getMigrationInfo();
            this.migrationInfo.enabled = migrationInfo[1];
            this.migrationInfo.deadline = migrationInfo[2];
            
            // Kullanıcının migration yapıp yapamayacağını kontrol et
            const canMigrate = await this.tokenContract.canUserMigrate(this.walletAddress);
            this.migrationInfo.canMigrate = canMigrate[0];
            this.migrationInfo.oldBalance = ethers.utils.formatEther(canMigrate[1]);
            
            console.log("Migration durumu:", this.migrationInfo);
            
            // Migration UI'ını güncelle
            this.updateMigrationUI();
            
        } catch (error) {
            console.error("Migration durumu kontrol hatası:", error);
        }
    }

    /**
     * Migration işlemini gerçekleştir
     */
    async migrateTokens() {
        if (!this.tokenContract || !this.migrationInfo.canMigrate) {
            console.error("Migration yapılamaz");
            return false;
        }

        try {
            showNotification("Migration işlemi başlatılıyor...", 'info');
            
            const tx = await this.tokenContract.migrateTokens();
            showNotification("Migration transaction gönderildi! Onay bekleniyor...", 'info', 5000);
            
            await tx.wait();
            
            showNotification(`${this.migrationInfo.oldBalance} COFFY başarıyla migrate edildi!`, 'success');
            
            // Migration durumunu güncelle
            await this.checkMigrationStatus();
            
            return true;
            
        } catch (error) {
            console.error("Migration hatası:", error);
            showNotification("Migration işlemi başarısız: " + error.message, 'error');
            return false;
        }
    }

    /**
     * Migration UI'ını güncelle
     */
    updateMigrationUI() {
        // Migration düğmesini göster/gizle
        const migrationButton = document.getElementById('migration-button');
        const migrationInfo = document.getElementById('migration-info');
        
        if (migrationButton && migrationInfo) {
            if (this.migrationInfo.canMigrate && this.migrationInfo.oldBalance > 0) {
                migrationButton.style.display = 'block';
                migrationInfo.textContent = `Eski kontratınızda ${this.migrationInfo.oldBalance} COFFY var. Yeni kontraata migrate edebilirsiniz.`;
                migrationInfo.style.display = 'block';
            } else {
                migrationButton.style.display = 'none';
                migrationInfo.style.display = 'none';
            }
        }
    }

    /**
     * Oyun ödüllerini talep et - YENİ FONKSİYON
     */
    async claimGameRewards(amount) {
        try {
            if (!this.connected || !this.tokenContract) {
                console.error("Web3 bağlantısı yok veya token sözleşmesi oluşturulmadı");
                return false;
            }
            if (!amount || isNaN(amount) || Number(amount) <= 0) {
                showNotification("No rewards to claim or invalid amount.", "warning");
                console.warn("claimGameRewards: Invalid amount:", amount);
                return false;
            }
            console.log("claimGameRewards: amount=", amount, typeof amount);
            const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);
            console.log("claimGameRewards: formattedAmount=", formattedAmount.toString());
            // Ödülleri talep et
            const tx = await this.tokenContract.claimGameRewards(formattedAmount);
            const receipt = await tx.wait();
            console.log("Ödüller başarıyla talep edildi:", receipt.transactionHash);
            this.triggerEvent('rewardsClaimed', { 
                amount: amount,
                txHash: receipt.transactionHash
            });
            return true;
        } catch (error) {
            // Modern İngilizce uyarı
            if (error && error.message && error.message.includes("Wallet too young")) {
                showNotification("Your wallet is too new to claim rewards. You must wait 7 days after your first interaction with the contract.", "warning");
            } else {
                showNotification("Claim failed: " + (error.message || error), "error");
            }
            this.triggerEvent('error', { message: "Reward claim error: " + error.message });
            return false;
        }
    }

    /**
     * Token stake etme fonksiyonu
     */
    async stakeTokens(amount) {
        try {
            if (!this.connected || !this.tokenContract) {
                console.error("Web3 bağlantısı yok veya token sözleşmesi oluşturulmadı");
                return false;
            }
            
            const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);
            showNotification("Staking transaction başlatılıyor...", 'info');
            
            const tx = await this.tokenContract.stake(formattedAmount);
            showNotification("Stake transaction gönderildi! Onay bekleniyor...", 'info', 5000);
            
            await tx.wait();
            showNotification(`${amount} COFFY başarıyla stake edildi!`, 'success');
            
            this.triggerEvent('tokensStaked', { 
                amount: amount,
                txHash: tx.hash
            });
            
            return true;
        } catch (error) {
            console.error("Stake hatası:", error);
            let errorMsg = "Staking failed";
            if (error.message) {
                if (error.message.includes("user rejected")) {
                    errorMsg = "Transaction rejected by user";
                } else if (error.message.includes("insufficient funds")) {
                    errorMsg = "Insufficient funds for gas";
                } else {
                    errorMsg = error.message;
                }
            }
            showNotification(errorMsg, 'error');
            this.triggerEvent('error', { message: "Stake error: " + error.message });
            return false;
        }
    }

    /**
     * Token unstake etme fonksiyonu
     */
    async unstakeTokens(amount) {
        try {
            if (!this.connected || !this.tokenContract) {
                console.error("Web3 bağlantısı yok veya token sözleşmesi oluşturulmadı");
                return false;
            }
            
            const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);
            showNotification("Unstaking transaction başlatılıyor...", 'info');
            
            const tx = await this.tokenContract.unstake(formattedAmount);
            showNotification("Unstake transaction gönderildi! Onay bekleniyor...", 'info', 5000);
            
            await tx.wait();
            showNotification(`${amount} COFFY başarıyla unstake edildi!`, 'success');
            
            this.triggerEvent('tokensUnstaked', { 
                amount: amount,
                txHash: tx.hash
            });
            
            return true;
        } catch (error) {
            console.error("Unstake hatası:", error);
            let errorMsg = "Unstaking failed";
            if (error.message) {
                if (error.message.includes("user rejected")) {
                    errorMsg = "Transaction rejected by user";
                } else if (error.message.includes("insufficient funds")) {
                    errorMsg = "Insufficient funds for gas";
                } else if (error.message.includes("lock period")) {
                    errorMsg = "Tokens are still locked. Wait for the lock period to end.";
                } else {
                    errorMsg = error.message;
                }
            }
            showNotification(errorMsg, 'error');
            this.triggerEvent('error', { message: "Unstake error: " + error.message });
            return false;
        }
    }

    /**
     * Stake ödüllerini talep etme fonksiyonu
     */
    async claimStakeRewards() {
        try {
            if (!this.connected || !this.tokenContract) {
                console.error("Web3 bağlantısı yok veya token sözleşmesi oluşturulmadı");
                return false;
            }
            
            showNotification("Stake rewards claim başlatılıyor...", 'info');
            
            // Önce pending rewards'ı kontrol et
            const stakeInfo = await this.tokenContract.getStakeInfo(this.walletAddress);
            const pendingReward = stakeInfo.pendingReward || stakeInfo[2] || 0;
            
            if (pendingReward === 0 || pendingReward.toString() === '0') {
                showNotification("No stake rewards to claim", 'warning');
                return false;
            }
            
            const tx = await this.tokenContract.claimPendingRewards(pendingReward);
            showNotification("Claim transaction gönderildi! Onay bekleniyor...", 'info', 5000);
            
            await tx.wait();
            const rewardAmount = ethers.utils.formatEther(pendingReward);
            showNotification(`${rewardAmount} COFFY stake rewards claimed successfully!`, 'success');
            
            this.triggerEvent('stakeRewardsClaimed', { 
                amount: rewardAmount,
                txHash: tx.hash
            });
            
            return true;
        } catch (error) {
            console.error("Stake rewards claim hatası:", error);
            let errorMsg = "Claiming stake rewards failed";
            if (error.message) {
                if (error.message.includes("user rejected")) {
                    errorMsg = "Transaction rejected by user";
                } else if (error.message.includes("No rewards")) {
                    errorMsg = "No rewards to claim";
                } else {
                    errorMsg = error.message;
                }
            }
            showNotification(errorMsg, 'error');
            this.triggerEvent('error', { message: "Stake rewards claim error: " + error.message });
            return false;
        }
    }

    /**
     * Oyun başlatma fonksiyonu - Kontrat üzerinde lastGameStart'ı set eder
     */
    async startGameOnContract() {
        try {
            if (!this.connected || !this.tokenContract) {
                console.log("Web3 bağlantısı yok, kontrat startGame çağrılmayacak");
                return false;
            }
            console.log("Kontrat üzerinde startGame çağrılıyor...");
            // Kontrat üzerinde startGame fonksiyonunu çağır
            const tx = await this.tokenContract.startGame();
            await tx.wait();
            console.log("✅ Kontrat startGame başarıyla çağrıldı");
            // Doğrulama timestamp'ini kaydet
            localStorage.setItem('coffy_human_verification_ts', Date.now().toString());
            // Oyun session başlangıç zamanını kaydet (KALDIRILDI)
            // localStorage.setItem('coffy_game_session_start', Date.now().toString());
            this.triggerEvent('gameStarted', { txHash: tx.hash });
            return true;
        } catch (error) {
            console.error("Kontrat startGame hatası:", error);
            // Bu hata kritik değil, oyun yine de başlayabilir
            return false;
        }
    }

    /**
     * Karakteri satın al
     */
    async buyCharacter(characterId) {
        try {
            if (!this.connected || !this.tokenContract) {
                console.error("Web3 bağlantısı yok veya token sözleşmesi oluşturulmadı");
                return false;
            }
            
            // Karakteri satın al
            const tx = await this.tokenContract.buyCharacter(characterId);
            const receipt = await tx.wait();
            
            console.log("Karakter başarıyla satın alındı:", receipt.transactionHash);
            this.triggerEvent('characterPurchased', { 
                characterId: characterId,
                txHash: receipt.transactionHash
            });
            
            return true;
        } catch (error) {
            console.error("Karakter satın alınırken hata:", error);
            this.triggerEvent('error', { message: "Satın alma hatası: " + error.message });
            return false;
        }
    }
    
    /**
     * Olay dinleyici ekle
     */
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }
    
    /**
     * Olayı tetikle
     */
    triggerEvent(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                callback(data);
            });
        }
    }
    
    /**
     * İşlem durumunu kontrol et
     */
    async checkTransactionStatus(txHash) {
        try {
            if (!this.provider) {
                console.error("Provider bulunamadı");
                return null;
            }
            
            const tx = await this.provider.getTransactionReceipt(txHash);
            return tx ? (tx.status === 1) : null;
        } catch (error) {
            console.error("İşlem durumu kontrol edilirken hata:", error);
            return null;
        }
    }
    
    /**
     * Cüzdan bağlantısını kapat
     */
    disconnect() {
        this.provider = null;
        this.signer = null;
        this.tokenContract = null;
        this.oldTokenContract = null;
        this.connected = false;
        this.walletAddress = null;
        this.triggerEvent('disconnected', {});
    }
    
    /**
     * Bağlantı durumunu kontrol et
     */
    isConnected() {
        return this.connected && this.walletAddress !== null;
    }
}

/**
 * Oyun session timer'ını başlat (wallet bağlı olmasa bile)
 */
export function startGameSession() {
    const currentTime = Date.now().toString();
    localStorage.setItem('coffy_game_session_start', currentTime);
    console.log("🎮 Game session started:", new Date(Number(currentTime)).toLocaleTimeString());
}

// Global olarak erişilebilir hale getir
window.startGameSession = startGameSession;

/**
 * Oyun session süresini kontrol et
 */
export function checkGameSessionDuration() {
    const gameStartTime = localStorage.getItem('coffy_game_session_start');
    if (!gameStartTime) {
        return { hasStarted: false, duration: 0, canClaim: false };
    }
    
    const sessionDuration = (Date.now() - Number(gameStartTime)) / 1000 / 60; // dakika cinsinden
    return {
        hasStarted: true,
        duration: sessionDuration,
        canClaim: sessionDuration >= 2
    };
}

// Global olarak erişilebilir hale getir
window.checkGameSessionDuration = checkGameSessionDuration;

// --- EKLENDİ: Web3Manager'ı globalde oluştur ---
window.web3Manager = new Web3Manager();

// Web3Manager'ı globalde erişilebilir yap (her zaman güncel olsun)
if (!window.web3Manager || !(window.web3Manager instanceof Web3Manager)) {
    window.web3Manager = new Web3Manager();
    console.log('window.web3Manager initialized');
} else {
    console.log('window.web3Manager already exists');
}

export default Web3Manager;
