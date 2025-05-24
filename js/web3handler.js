class Web3Handler {
    constructor() {
        // Token contract address and ABI
        this.tokenAddress = '0x04CD0E3b1009E8ffd9527d0591C7952D92988D0f';
        this.tokenABI = [{"inputs":[{"internalType":"address","name":"_treasury","type":"address"},{"internalType":"address","name":"_liquidityPool","type":"address"},{"internalType":"address","name":"_marketing","type":"address"},{"internalType":"address","name":"_team","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AccessControlBadConfirmation","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"neededRole","type":"bytes32"}],"name":"AccessControlUnauthorizedAccount","type":"error"},{"inputs":[],"name":"AlreadyVoted","type":"error"},{"inputs":[],"name":"CharacterNotFound","type":"error"},{"inputs":[],"name":"DailyRewardLimitExceeded","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[],"name":"InsufficientBalance","type":"error"},{"inputs":[],"name":"InvalidAddress","type":"error"},{"inputs":[],"name":"NotDAOMember","type":"error"},{"inputs":[],"name":"NotInflationTime","type":"error"},{"inputs":[],"name":"NothingStaked","type":"error"},{"inputs":[],"name":"ProposalNotFound","type":"error"},{"inputs":[],"name":"StakingPeriodNotMet","type":"error"},{"inputs":[],"name":"ZeroAmount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"characterId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"CharacterBought","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"GameRewardsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"InflationMinted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint32","name":"proposalId","type":"uint32"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"address","name":"creator","type":"address"}],"name":"ProposalCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"StakingRewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"burner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensBurned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Unstaked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint32","name":"proposalId","type":"uint32"},{"indexed":false,"internalType":"address","name":"voter","type":"address"}],"name":"VoteCast","type":"event"},{"inputs":[],"name":"ANNUAL_INFLATION_RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ANNUAL_STAKING_RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"BLOCKS_PER_DAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ESPRESSO_MAGE_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LATTE_WARRIOR_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LEGENDARY_DRAGON_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LIQUIDITY_AMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MARKETING_AMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_DAILY_REWARD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINIMUM_STAKE_TIME","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_TREASURY_RESERVE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PALADIN_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ROGUE_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SECONDS_IN_YEAR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TEAM_AMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TREASURY_AMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"adminBurn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"characterId","type":"uint256"}],"name":"buyCharacter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"calculatePendingReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"canTriggerInflation","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"characters","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimGameRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimStakingReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"description","type":"string"}],"name":"createProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"dailyClaims","outputs":[{"internalType":"uint48","name":"lastClaimTime","type":"uint48"},{"internalType":"uint208","name":"claimedToday","type":"uint208"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"characterId","type":"uint256"}],"name":"getCharacter","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getDailyRewardLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getInflationRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getMinimumStakeTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getProposalCount","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"proposalId","type":"uint32"}],"name":"getProposalInfo","outputs":[{"internalType":"string","name":"description","type":"string"},{"internalType":"uint32","name":"voteCount","type":"uint32"},{"internalType":"bool","name":"executed","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"proposalId","type":"uint32"}],"name":"getProposalVotes","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getStakeInfo","outputs":[{"internalType":"uint256","name":"stakedAmount","type":"uint256"},{"internalType":"uint256","name":"pendingReward","type":"uint256"},{"internalType":"uint256","name":"stakingDuration","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStakingAPY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getTotalStaked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasBoughtLegendaryDragon","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"proposalId","type":"uint32"},{"internalType":"address","name":"user","type":"address"}],"name":"hasVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"isDAOMember","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastInflationTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proposalCount","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"","type":"uint32"}],"name":"proposals","outputs":[{"internalType":"uint32","name":"id","type":"uint32"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint32","name":"voteCount","type":"uint32"},{"internalType":"bool","name":"executed","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"callerConfirmation","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"stakes","outputs":[{"internalType":"uint208","name":"amount","type":"uint208"},{"internalType":"uint48","name":"startTime","type":"uint48"},{"internalType":"uint48","name":"lastRewardClaim","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStaked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"treasury","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"triggerInflation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"unstake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint32","name":"proposalId","type":"uint32"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"}];
        
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
        if (!this.web3) {
            this.showNotification("Please install MetaMask to connect your wallet", "error");
            return false;
        }
        
        this.connectionStatus = 'connecting';
        this.showNotification("Connecting wallet... Please check your browser extension", "info");
        
        try {
            // Clear any previous accounts to ensure we get a fresh approval dialog
            this.currentAccount = null;
            this.accounts = [];
            
            // Give the user time to see the notification before the wallet popup appears
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Force wallet popup by using a specific approach - first check if wallet is locked
            // This improves user experience by ensuring they see the approval dialog
            const isLocked = !(await window.ethereum._metamask?.isUnlocked?.());
            console.log("Wallet locked status:", isLocked);
            
            // Request accounts - This should ALWAYS trigger the wallet approval dialog now
            console.log("Requesting wallet approval...");
            try {
                // Clear any cached permissions first
                if (window.ethereum.request?.({method: 'wallet_requestPermissions'})) {
                    await window.ethereum.request({
                        method: 'wallet_requestPermissions',
                        params: [{ eth_accounts: {} }]
                    });
                }
                
                // Now request accounts (this should always show the popup)
                this.accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts',
                    params: [{ eth_accounts: {} }]
                });
                
                console.log("Accounts after request:", this.accounts);
            } catch (permError) {
                console.log("Permission request error:", permError);
                // Try alternative approach if the above fails
                this.accounts = await window.ethereum.enable();
            }
            
            // Check if user approved and we have accounts
            if (!this.accounts || this.accounts.length === 0) {
                this.connectionStatus = 'error';
                this.showNotification("No accounts found or access denied", "error");
                return false;
            }
            
            this.currentAccount = this.accounts[0];
            console.log("Connected account:", this.currentAccount);
            
            // Check if we're on BSC network
            const chainId = await this.web3.eth.getChainId();
            
            if (chainId !== 56 && chainId !== 97) { // BSC Mainnet and Testnet IDs
                this.showNotification("Your wallet needs to connect to Binance Smart Chain", "info");
                
                // Prompt to switch to BSC - this will show another wallet approval
                try {
                    this.showNotification("Please approve network switch in your wallet", "info");
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x38' }], // BSC Mainnet
                    });
                    this.showNotification("Successfully switched to BSC network", "success");
                } catch (switchError) {
                    // If BSC isn't added yet, prompt to add it
                    if (switchError.code === 4902) {
                        try {
                            this.showNotification("Please approve adding BSC network to your wallet", "info");
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: '0x38',
                                    chainName: 'Binance Smart Chain',
                                    nativeCurrency: {
                                        name: 'BNB',
                                        symbol: 'BNB',
                                        decimals: 18
                                    },
                                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                                    blockExplorerUrls: ['https://bscscan.com/']
                            }],
                        });
                        this.showNotification("BSC network added successfully", "success");
                        } catch (addError) {
                            this.connectionStatus = 'error';
                            this.showNotification("Failed to add BSC network: " + this.getErrorMessage(addError), "error");
                            console.error("Failed to add BSC network:", addError);
                            return false;
                        }
                    } else {
                        this.connectionStatus = 'error';
                        this.showNotification("Failed to switch to BSC network: " + this.getErrorMessage(switchError), "error");
                        console.error("Failed to switch to BSC network:", switchError);
                        return false;
                    }
                }
            }
            
            // Fetch token balance
            await this.fetchTokenBalance();
            
            this.connectionStatus = 'connected';
            this.showNotification("Wallet connected successfully!", "success");
            
            // Notify any listeners that the balance has been updated
            this.notifyBalanceUpdate();
            
            return true;
        } catch (error) {
            console.error("Error connecting wallet:", error);
            this.connectionStatus = 'error';
            
            if (error.code === 4001) {
                // User rejected the connection
                this.showNotification("Connection rejected by user", "error");
            } else {
                this.showNotification("Failed to connect wallet: " + this.getErrorMessage(error), "error");
            }
            
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
        const event = new CustomEvent('wallet-update', {
            detail: {
                connected: this.connectionStatus === 'connected',
                account: this.currentAccount,
                balance: this.balance
            }
        });
        document.dispatchEvent(event);
    }
    
    getDisplayBalance() {
        return this.balance;
    }
    
    async claimRewards() {
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

            // Get tokens from localStorage
            const totalEarned = localStorage.getItem('coffyTokens') || "0";
            const earnedTokens = parseInt(totalEarned);
            
            if (earnedTokens <= 0) {
                this.showNotification("No tokens to claim", "warning");
                return false;
            }

            console.log(`Claiming ${earnedTokens} tokens`);
            
            // Since claimRewards doesn't exist in the contract, use claimGameRewards instead
            // Check if the method exists first
            if (!this.tokenContract.methods.claimGameRewards) {
                this.showNotification("Game rewards claiming not supported by contract", "error");
                return false;
            }
            
            // Token decimals'ı çek
            const decimals = await this.tokenContract.methods.decimals().call();
            // Miktarı en küçük birime çevir
            const amount = this.web3.utils.toBigInt(earnedTokens) * (10n ** BigInt(decimals));

            // Call the contract method
            const result = await this.tokenContract.methods.claimGameRewards(amount).send({
                from: this.currentAccount
            });
            
            if (result) {
                // Success - clear localStorage
                localStorage.setItem('coffyTokens', "0");
                this.totalEarnedTokens = 0;
                this.showNotification(`Successfully claimed ${earnedTokens} COFFY tokens!`, "success");
                
                // Update wallet balance
                await this.fetchTokenBalance();
                
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
                errorMsg = this.getErrorMessage(error);
            }
            
            this.showNotification(errorMsg, "error");
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
}
