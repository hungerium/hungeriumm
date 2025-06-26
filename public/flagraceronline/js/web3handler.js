class Web3Handler {
    constructor() {
        // YENİ KONTRAT ADRESİ
        this.tokenAddress = '0x7071271057e4b116e7a650F7011FFE2De7C3d14b';
        
        // YENİ ABI - Sadece gerekli fonksiyonlar
        this.tokenABI = [
            {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimGameRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},
            {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
            {"inputs":[],"name":"migrateTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
            {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"canUserMigrate","outputs":[{"internalType":"bool","name":"canMigrate","type":"bool"},{"internalType":"uint256","name":"oldBalance","type":"uint256"}],"stateMutability":"view","type":"function"},
            {"inputs":[],"name":"getMigrationInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bool","name":"","type":"bool"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
            {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}
        ];
        
        // Web3 instance
        this.web3 = null;
        this.tokenContract = null;
        this.accounts = [];
        this.currentAccount = null;
        this.balance = "0.00";
        
        // Connection status
        this.connectionStatus = 'disconnected'; // 'disconnected', 'connecting', 'connected', 'error'
        
        // Game token storage
        this.gameTokens = 0;
        this.totalEarnedTokens = this.loadEarnedTokens();
        
        // Maximum number of claims allowed per day (IP based)
        this.maxClaimsPerDay = 2;
        
        // Migration durumu
        this.migrationInfo = {
            enabled: false,
            deadline: 0,
            oldBalance: 0,
            canMigrate: false
        };
        
        // Initialize if Web3 is available
        this.initialize();
    }
    
    initialize() {
        // Check if Web3 is already available
        if (window.ethereum) {
            this.web3 = new Web3(window.ethereum);
            console.log("Web3 detected in browser");
            
            // Listen for account changes
            window.ethereum.on('accountsChanged', async (accounts) => {
                console.log("Accounts changed:", accounts);
                if (accounts.length > 0) {
                    this.currentAccount = accounts[0];
                    await this.fetchTokenBalance();
                    this.notifyBalanceUpdate();
                } else {
                    this.currentAccount = null;
                    this.balance = "0.00";
                    this.connectionStatus = 'disconnected';
                    this.notifyBalanceUpdate();
                }
            });
            
            window.ethereum.on('chainChanged', async (chainId) => {
                console.log("Chain changed:", chainId);
                if (this.currentAccount) {
                    await this.fetchTokenBalance();
                    this.notifyBalanceUpdate();
                }
            });
            
            // Check if already connected
            window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => {
                    if (accounts.length > 0) {
                        this.currentAccount = accounts[0];
                        this.connectionStatus = 'connected';
                        this.fetchTokenBalance();
                    }
                })
                .catch(error => console.error("Error checking accounts:", error));
        } else if (window.web3) {
            this.web3 = new Web3(window.web3.currentProvider);
            console.log("Legacy Web3 detected");
        } else {
            console.log("No Web3 detected. Please install MetaMask or another Web3 provider.");
        }
        
        // Create contract instance if Web3 is available
        if (this.web3) {
            try {
                this.tokenContract = new this.web3.eth.Contract(
                    this.tokenABI,
                    this.tokenAddress
                );
                console.log("Token contract initialized");
            } catch (error) {
                console.error("Failed to initialize token contract:", error);
            }
        }
    }
    
    async connectWallet() {
        try {
            console.log("Attempting to connect wallet...");
            
            if (typeof window.ethereum === 'undefined') {
                this.showNotification("MetaMask is not installed. Please install MetaMask to continue.", "error");
                return false;
            }

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            if (accounts.length === 0) {
                this.showNotification("No accounts found. Please check your wallet.", "warning");
                return false;
            }
            
            this.currentAccount = accounts[0];
            console.log("Connected account:", this.currentAccount);
            
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            console.log("Current chain ID:", chainId);

            if (chainId !== '0x38') {
                this.showNotification("Please switch to Binance Smart Chain (BSC)", "warning");
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x38' }],
                    });
                } catch (switchError) {
                    console.error("Failed to switch chain:", switchError);
                        return false;
                }
            }
            
            this.web3 = new Web3(window.ethereum);
            this.tokenContract = new this.web3.eth.Contract(this.tokenABI, this.tokenAddress);

            await this.fetchTokenBalance();
            
            // Migration durumunu kontrol et
            await this.checkMigrationStatus();

            this.showNotification("Wallet connected successfully!", "success");
            return true;

        } catch (error) {
            console.error("Error connecting wallet:", error);
            this.showNotification("Failed to connect wallet: " + error.message, "error");
            return false;
        }
    }
    
    // Helper method to get friendly error messages
    getErrorMessage(error) {
        if (error.message) {
            // Trim the message if it's too long
            let message = error.message;
            if (message.length > 50) {
                message = message.substring(0, 47) + '...';
            }
            return message;
        }
        return 'Unknown error';
    }
    
    async fetchTokenBalance() {
        if (!this.currentAccount || !this.tokenContract) {
            this.balance = "0.00";
            return "0.00";
        }
        
        try {
            const balance = await this.tokenContract.methods.balanceOf(this.currentAccount).call();
            const decimals = await this.tokenContract.methods.decimals().call();
            
            // Convert from wei to token amount - handle BigInt properly
            const balanceNumber = Number(balance) / Math.pow(10, Number(decimals));
            const formattedBalance = balanceNumber.toFixed(2);
            this.balance = formattedBalance;
            return formattedBalance;
        } catch (error) {
            console.error("Error fetching balance:", error);
            this.balance = "Error";
            return "Error";
        }
    }
    
    notifyBalanceUpdate() {
        // Dispatch a custom event that can be listened to
        const event = new CustomEvent('walletBalanceUpdated', {
            detail: {
                connected: this.connectionStatus === 'connected',
                address: this.currentAccount,
                balance: this.getDisplayBalance()
            }
        });
        document.dispatchEvent(event);
        
        // Also trigger wallet update for other components
        this.triggerWalletUpdate();
    }
    
    getDisplayBalance() {
        return this.balance;
    }
    
    async claimRewards(tokensToClaimFromGame = null) {
        try {
            console.log("Attempting to claim rewards...");
            
            // Check if wallet is connected first
            if (!this.currentAccount) {
                await this.connectWallet();
                if (!this.currentAccount) {
                    this.showNotification("Please connect your wallet first", "warning");
                    return false;
                }
            }
            
            // Check claim rate limit
            const rateLimit = this.checkClaimRateLimit();
            if (!rateLimit.canClaim) {
                this.showNotification(rateLimit.message, "warning");
                return false;
            }

            // Get tokens to claim - either from parameter or localStorage
            let earnedTokens;
            if (tokensToClaimFromGame !== null) {
                earnedTokens = parseInt(tokensToClaimFromGame);
            } else {
                const totalEarned = localStorage.getItem('coffyTokens') || "0";
                earnedTokens = parseInt(totalEarned);
            }
            
            if (earnedTokens <= 0) {
                this.showNotification("No tokens to claim", "warning");
                return false;
            }

            // Apply daily maximum limit of 5000 tokens (YENİ LİMİT)
            const MAX_DAILY_CLAIM = 5000;
            const actualClaimAmount = Math.min(earnedTokens, MAX_DAILY_CLAIM);
            
            if (actualClaimAmount < earnedTokens) {
                console.log(`Limiting claim amount: ${earnedTokens} -> ${actualClaimAmount} (daily max: ${MAX_DAILY_CLAIM})`);
            }

            console.log(`Claiming ${actualClaimAmount} tokens (available: ${earnedTokens})`);
            
            // Check if the method exists first
            if (!this.tokenContract.methods.claimGameRewards) {
                console.warn("claimGameRewards method not found in contract, using demo mode");
                
                // Demo mode - process claim with actual amount and update localStorage correctly
                if (tokensToClaimFromGame === null) {
                    const remainingTokens = earnedTokens - actualClaimAmount;
                    localStorage.setItem('coffyTokens', remainingTokens.toString());
                }
                this.totalEarnedTokens = Math.max(0, this.totalEarnedTokens - actualClaimAmount);
                
                // Record the claim for rate limiting
                this.recordClaim();
                
                this.showNotification(`Demo: Successfully claimed ${actualClaimAmount} COFFY tokens!`, "success");
                
                // Update wallet balance and notify all components
                await this.fetchTokenBalance();
                this.notifyBalanceUpdate();
                
                // Trigger coffy display update in game
                if (window.game && window.game.updateCoffyDisplay) {
                    window.game.updateCoffyDisplay();
                }
                
                return true;
            }
            
            let result;
            try {
                // Token decimals'ı çek
                console.log("Fetching token decimals...");
                const decimals = await this.tokenContract.methods.decimals().call();
                console.log(`Token decimals: ${decimals}`);
                
                // Miktarı en küçük birime çevir (actualClaimAmount kullan)
                const amount = BigInt(actualClaimAmount) * (10n ** BigInt(decimals));
                console.log(`Amount to claim: ${amount.toString()} (${actualClaimAmount} tokens)`);

                // Call the contract method (BigInt'i string'e çevir)
                console.log("Calling claimGameRewards contract method...");
                result = await this.tokenContract.methods.claimGameRewards(amount.toString()).send({
                    from: this.currentAccount
                });
                console.log("Contract call result:", result);
            } catch (contractError) {
                console.error("Contract interaction error:", contractError);
                throw contractError;
            }
            
            if (result) {
                // Success - update localStorage by subtracting only the actually claimed amount
                const coffyTokens = localStorage.getItem('coffyTokens') || "0";
                const currentTokens = parseInt(coffyTokens);
                const remainingTokens = Math.max(0, currentTokens - actualClaimAmount);
                localStorage.setItem('coffyTokens', remainingTokens.toString());
                console.log(`Updated localStorage: ${currentTokens} - ${actualClaimAmount} = ${remainingTokens} remaining`);
                
                this.totalEarnedTokens = Math.max(0, this.totalEarnedTokens - actualClaimAmount);
                
                // Record the claim for rate limiting
                this.recordClaim();
                
                // Show appropriate success message
                let successMessage = `Successfully claimed ${actualClaimAmount} COFFY tokens!`;
                if (actualClaimAmount < earnedTokens) {
                    successMessage += ` (${remainingTokens} tokens remaining for tomorrow)`;
                }
                this.showNotification(successMessage, "success");
                
                // Update wallet balance and notify all components
                await this.fetchTokenBalance();
                this.notifyBalanceUpdate();
                
                // Trigger coffy display update in game
                if (window.game && window.game.updateCoffyDisplay) {
                    window.game.updateCoffyDisplay();
                }
                
                return true;
            } else {
                this.showNotification("Transaction failed", "error");
                return false;
            }
        } catch (error) {
            console.error("Error claiming rewards:", error);
            
            // Show user-friendly error message
            let errorMsg = "Failed to claim rewards";
            
            if (error.message) {
                if (error.message.includes("Daily reward limit exceeded")) {
                    errorMsg = "Günlük ödül limiti aşıldı. Yarın tekrar deneyin.";
                } else if (error.message.includes("Sybil protection")) {
                    errorMsg = "Anti-Sybil koruması: Minimum 50,000 COFFY balance gerekli.";
                } else if (error.message.includes("Claim cooldown")) {
                    errorMsg = "Claim cooldown aktif. Biraz bekleyin.";
                } else if (error.message.includes("toBigInt")) {
                    errorMsg = "Web3 version compatibility issue. Please try again.";
                } else if (error.message.includes("User denied")) {
                    errorMsg = "Transaction rejected by user";
                } else if (error.message.includes("insufficient funds")) {
                    errorMsg = "Insufficient funds for transaction";
                } else {
                    errorMsg = this.getErrorMessage(error);
                }
            }
            
            this.showNotification(errorMsg, "error");
            return false;
        }
    }
    
    // IP rate limiting methods
    checkClaimRateLimit() {
        try {
            // Get current timestamp
            const currentTime = Date.now();
            
            // Get stored claim data from localStorage
            const claimData = JSON.parse(localStorage.getItem('flagracerClaimData') || '{"claims":[]}');
            
            // Filter claims from today (last 24 hours)
            const oneDayAgo = currentTime - (24 * 60 * 60 * 1000);
            const todayClaims = claimData.claims.filter(claim => claim > oneDayAgo);
            
            if (todayClaims.length >= this.maxClaimsPerDay) {
                // Too many claims already
                const oldestClaim = Math.max(...todayClaims);
                const nextClaimTime = oldestClaim + (24 * 60 * 60 * 1000);
                const remainingTime = nextClaimTime - currentTime;
                
                const hoursRemaining = Math.floor(remainingTime / 3600000);
                const minutesRemaining = Math.floor((remainingTime % 3600000) / 60000);
                
                return {
                    canClaim: false,
                    message: `Daily limit reached (${this.maxClaimsPerDay}/day). You can claim again in ${hoursRemaining}h ${minutesRemaining}m.`,
                    timeRemaining: remainingTime
                };
            }
            
            // Can claim
            return {
                canClaim: true,
                message: "You can claim your rewards now."
            };
        } catch (error) {
            console.error("Error checking claim rate limit:", error);
            
            // In case of error, return true to avoid blocking legitimate claims
            return {
                canClaim: true,
                message: "Error checking claim status. Allowing claim."
            };
        }
    }
    
    recordClaim() {
        try {
            // Get current data
            const claimData = JSON.parse(localStorage.getItem('flagracerClaimData') || '{"claims":[]}');
            
            // Add current timestamp
            claimData.claims.push(Date.now());
            
            // Limit array size to avoid memory issues (keep last 20 claims)
            if (claimData.claims.length > 20) {
                claimData.claims = claimData.claims.slice(-20);
            }
            
            // Save back to localStorage
            localStorage.setItem('flagracerClaimData', JSON.stringify(claimData));
            
            return true;
        } catch (error) {
            console.error("Error recording claim:", error);
            return false;
        }
    }
    
    getClaimCountToday() {
        try {
            const claimData = JSON.parse(localStorage.getItem('flagracerClaimData') || '{"claims":[]}');
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            const todayClaims = claimData.claims.filter(claim => claim > oneDayAgo);
            return todayClaims.length;
        } catch (error) {
            console.error("Error getting claim count:", error);
            return 0;
        }
    }
    
    getNextClaimTime() {
        try {
            const claimData = JSON.parse(localStorage.getItem('flagracerClaimData') || '{"claims":[]}');
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            const todayClaims = claimData.claims.filter(claim => claim > oneDayAgo);
            
            if (todayClaims.length >= this.maxClaimsPerDay && todayClaims.length > 0) {
                // Sort claims by timestamp
                todayClaims.sort((a, b) => a - b);
                // Get oldest claim and add 24 hours
                return todayClaims[0] + (24 * 60 * 60 * 1000);
            }
            
            return Date.now(); // Can claim now
        } catch (error) {
            console.error("Error getting next claim time:", error);
            return Date.now(); // Default to now on error
        }
    }
    
    clearClaimData() {
        try {
            localStorage.removeItem('flagracerClaimData');
            return true;
        } catch (error) {
            console.error("Error clearing claim data:", error);
            return false;
        }
    }
    
    // Add tokens earned during gameplay
    addGameTokens(amount) {
        // Add tokens earned through gameplay
        if (typeof amount === 'number' && !isNaN(amount)) {
            this.totalEarnedTokens += amount;
            this.triggerWalletUpdate();
        }
    }
    
    // Set game tokens directly
    setGameTokens(amount) {
        // Set total directly to avoid accumulation errors
        // Make sure amount is treated as a number
        this.totalEarnedTokens = parseFloat(amount) || 0;
        
        // Trigger a wallet update event
        this.triggerWalletUpdate();
    }
    
    // Method to trigger wallet update events
    triggerWalletUpdate() {
        // Dispatch an event that wallet status has updated
        const walletEvent = new CustomEvent('wallet-update', {
            detail: {
                connected: this.currentAccount !== null,
                balance: this.getDisplayBalance(),
                earned: this.totalEarnedTokens
            }
        });
        
        document.dispatchEvent(walletEvent);
    }
    
    // Save earned tokens to localStorage
    saveEarnedTokens(amount) {
        try {
            localStorage.setItem('coffyEarnedTokens', amount.toString());
        } catch (error) {
            console.error("Error saving earned tokens:", error);
        }
    }
    
    // Load earned tokens from localStorage
    loadEarnedTokens() {
        try {
            const saved = localStorage.getItem('coffyEarnedTokens');
            return saved ? parseFloat(saved) : 0;
        } catch (error) {
            console.error("Error loading earned tokens:", error);
            return 0;
        }
    }
    
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.className = type;
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 5000);
        } else {
            console.log(`Notification (${type}): ${message}`);
        }
    }

    /**
     * Migration durumunu kontrol et
     */
    async checkMigrationStatus() {
        if (!this.tokenContract || !this.currentAccount) return;
        
        try {
            // Migration bilgilerini al
            const migrationInfo = await this.tokenContract.methods.getMigrationInfo().call();
            this.migrationInfo.enabled = migrationInfo[1];
            this.migrationInfo.deadline = migrationInfo[2];
            
            // Kullanıcının migration yapıp yapamayacağını kontrol et
            const canMigrate = await this.tokenContract.methods.canUserMigrate(this.currentAccount).call();
            this.migrationInfo.canMigrate = canMigrate.canMigrate;
            this.migrationInfo.oldBalance = this.web3.utils.fromWei(canMigrate.oldBalance, 'ether');
            
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
            this.showNotification("Migration yapılamaz", "error");
            return false;
        }

        try {
            this.showNotification("Migration işlemi başlatılıyor...", "info");
            
            const result = await this.tokenContract.methods.migrateTokens().send({
                from: this.currentAccount
            });
            
            this.showNotification(`${this.migrationInfo.oldBalance} COFFY başarıyla migrate edildi!`, "success");
            
            // Migration durumunu güncelle
            await this.checkMigrationStatus();
            await this.fetchTokenBalance();
            
            return true;
            
        } catch (error) {
            console.error("Migration hatası:", error);
            this.showNotification("Migration işlemi başarısız: " + error.message, "error");
            return false;
        }
    }

    /**
     * Migration UI'ını güncelle
     */
    updateMigrationUI() {
        // Migration düğmesini göster/gizle
        const migrationSection = document.getElementById('migration-section');
        
        if (migrationSection) {
            if (this.migrationInfo.canMigrate && this.migrationInfo.oldBalance > 0) {
                migrationSection.style.display = 'block';
                
                const migrationInfo = document.getElementById('migration-info');
                if (migrationInfo) {
                    migrationInfo.textContent = `Eski kontratınızda ${this.migrationInfo.oldBalance} COFFY var. Yeni kontraata migrate edebilirsiniz.`;
                }
            } else {
                migrationSection.style.display = 'none';
            }
        }
    }
}
