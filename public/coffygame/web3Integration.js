import * as Const from './constants.js';
import * as Utils from './utils.js';
const { showNotification, checkClaimRateLimit, recordClaim } = Utils; // Import the specific functions

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
        gameState.tokenContract = new ethers.Contract(Const.TOKEN_ADDRESS, Const.COFFY_ABI, gameState.signer);
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

    if (!gameState.walletConnected) {
        showNotification("Please connect your wallet first.", 'warning');
        return;
    }
    if (gameState.pendingRewards <= 0) {
        showNotification("No rewards to claim.", 'info');
        return;
    }

    // Check IP-based rate limiting
    const rateLimit = checkClaimRateLimit();
    if (!rateLimit.canClaim) {
        showNotification(rateLimit.message, 'warning');
        return;
    }

    const rewardsToClaim = gameState.pendingRewards;
    // Replace confirm with a notification and proceed
    showNotification(`Attempting to claim ${rewardsToClaim.toFixed(2)} COFFY...`, 'info');
    // if (!confirmClaim) return; // Removed confirm

    claimTotalRewardButton.disabled = true;
    claimTotalRewardButton.textContent = "Claiming...";

    try {
        const weiAmount = ethers.utils.parseUnits(rewardsToClaim.toString(), 18);

        let gasLimitEstimate;
        try {
            gasLimitEstimate = await gameState.tokenContract.estimateGas.claimGameRewards(weiAmount);
        } catch (gasError) {
            console.warn("Gas estimation failed, using default limit:", gasError);
            gasLimitEstimate = ethers.BigNumber.from("300000");
        }
        const gasLimitWithBuffer = gasLimitEstimate.mul(120).div(100);

        const tx = await gameState.tokenContract.claimGameRewards(weiAmount, { gasLimit: gasLimitWithBuffer });
        showNotification("Claim transaction sent! Waiting for confirmation...", 'info', 5000); // Longer duration
        await tx.wait();

        // Record successful claim for rate limiting
        recordClaim();

        gameState.pendingRewards = 0;
        Utils.savePendingRewards(gameState);

        totalRewardElement.textContent = gameState.pendingRewards.toFixed(2);
        totalRewardsHudElement.textContent = gameState.pendingRewards.toFixed(2);

        try {
            const balance = await gameState.tokenContract.balanceOf(gameState.walletAddress);
            gameState.tokenCount = ethers.utils.formatUnits(balance, 18);
            tokenCountElement.textContent = parseFloat(gameState.tokenCount).toFixed(2);
        } catch (balanceError) {
            console.error("Failed to update token balance after claim:", balanceError);
        }

        showNotification("Rewards claimed successfully!", 'success');

    } catch (error) {
        console.error("Reward claim failed:", error);
        let errorMessage = "Reward claim failed.";
        if (error.code === 'ACTION_REJECTED') {
            errorMessage = "Transaction rejected by user.";
        } else if (error.message?.includes("DailyRewardLimitExceeded")) {
              errorMessage = "Daily reward limit exceeded.";
         } else if (error.message) {
              errorMessage += ` Error: ${error.message.substring(0, 100)}...`; // Truncate long messages
         }
        showNotification(errorMessage, 'error');
    } finally {
        claimTotalRewardButton.disabled = false;
        claimTotalRewardButton.textContent = "CLAIM REWARDS";
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
 * Web3 entegrasyonu için yardımcı sınıf
 * Bu dosya, cüzdan bağlantısı ve token işlemleri için fonksiyonlar içerir
 */
class Web3Manager {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.tokenContract = null;
        this.tokenAddress = '0x04CD0E3b1009E8ffd9527d0591C7952D92988D0f'; // COFFY Token addresi
        this.connected = false;
        this.chainId = '0x38'; // BSC Chain ID
        this.account = null;
        this.listeners = {};
    }
    
    /**
     * MetaMask veya başka bir Web3 cüzdanına bağlanır
     */
    async connect() {
        try {
            // Tarayıcıda ethereum nesnesi var mı kontrol et
            if (window.ethereum) {
                console.log("MetaMask bulundu, bağlanmaya çalışılıyor...");
                
                // Provider oluştur
                this.provider = new ethers.providers.Web3Provider(window.ethereum);
                
                // Kullanıcı cüzdanını bağlamak için istek gönder
                const accounts = await this.provider.send("eth_requestAccounts", []);
                this.account = accounts[0];
                
                // Signer oluştur
                this.signer = this.provider.getSigner();
                
                // Doğru ağda olup olmadığımızı kontrol et
                await this.checkNetwork();
                
                // Token sözleşmesini oluştur
                this.tokenContract = new ethers.Contract(
                    this.tokenAddress,
                    window.COFFY_ABI, // Global değişken olarak tanımlanmış ABI
                    this.signer
                );
                
                this.connected = true;
                
                // Bağlantı olayını tetikle
                this.triggerEvent('connected', { account: this.account });
                
                // Hesap değişikliklerini dinle
                window.ethereum.on('accountsChanged', (accounts) => {
                    this.account = accounts[0];
                    this.triggerEvent('accountChanged', { account: this.account });
                });
                
                // Ağ değişikliklerini dinle
                window.ethereum.on('chainChanged', (chainId) => {
                    window.location.reload();
                });
                
                console.log("Web3 bağlantısı başarılı:", this.account);
                return true;
                
            } else {
                console.error("Web3 cüzdanı bulunamadı. Lütfen MetaMask veya benzer bir cüzdan yükleyin.");
                this.triggerEvent('error', { 
                    message: "Web3 cüzdanı bulunamadı. Lütfen MetaMask veya benzer bir cüzdan yükleyin."
                });
                return false;
            }
        } catch (error) {
            console.error("Web3 bağlantısı sırasında hata:", error);
            this.triggerEvent('error', { message: "Bağlantı hatası: " + error.message });
            return false;
        }
    }
    
    /**
     * Doğru blokzincirine bağlı olup olmadığını kontrol eder
     */
    async checkNetwork() {
        const chainId = await this.provider.send('eth_chainId', []);
        
        if (chainId !== this.chainId) {
            try {
                // BSC ağına geçiş yap
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: this.chainId }]
                });
            } catch (error) {
                // Ağ bulunamazsa, eklenmesini iste
                if (error.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: this.chainId,
                            chainName: 'Binance Smart Chain',
                            nativeCurrency: {
                                name: 'BNB',
                                symbol: 'BNB',
                                decimals: 18
                            },
                            rpcUrls: ['https://bsc-dataseed.binance.org/'],
                            blockExplorerUrls: ['https://bscscan.com/']
                        }]
                    });
                }
            }
        }
    }
    
    /**
     * Kullanıcının token bakiyesini getirir
     */
    async getTokenBalance() {
        try {
            if (!this.connected || !this.tokenContract) {
                console.error("Web3 bağlantısı yok veya token sözleşmesi oluşturulmadı");
                return 0;
            }
            
            const balance = await this.tokenContract.balanceOf(this.account);
            return ethers.utils.formatUnits(balance, 18);
        } catch (error) {
            console.error("Token bakiyesi alınırken hata:", error);
            return 0;
        }
    }
    
    /**
     * Oyun ödüllerini talep et
     */
    async claimGameRewards(amount) {
        try {
            if (!this.connected || !this.tokenContract) {
                console.error("Web3 bağlantısı yok veya token sözleşmesi oluşturulmadı");
                return false;
            }
            
            // Miktar ondalık basamak için formatla
            const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);
            
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
            console.error("Ödüller talep edilirken hata:", error);
            this.triggerEvent('error', { message: "Ödül talep hatası: " + error.message });
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
            this.triggerEvent('characterBought', { 
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
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    
    /**
     * Olayı tetikle
     */
    triggerEvent(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
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
        this.connected = false;
        this.account = null;
        this.triggerEvent('disconnected', {});
    }
    
    /**
     * Bağlantı durumunu kontrol et
     */
    isConnected() {
        return this.connected && this.account !== null;
    }
}

export default Web3Manager;
