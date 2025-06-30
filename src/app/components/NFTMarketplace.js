import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Confetti from 'react-confetti';
import useWeb3Wallet from './useWeb3Wallet';
import useAppStore from '../stores/useAppStore';
import { toast } from 'react-hot-toast';

// Coffy karakter kartları
const characterNFTs = [
  {
    id: 2,
    name: 'Mocha Knight',
    description: 'Earn 50% more rewards with Mocha Knight.',
    multiplier: '1.5x',
    price: 3000000,
    priceLabel: '3,000,000 COFFY',
    image: '/coffygame/assets/player_mocha.png',
    gradient: 'from-[#A77B06] to-[#3A2A1E]',
    rarity: 'Common'
  },
  {
    id: 3,
    name: 'Arabica Archmage',
    description: 'Double your rewards with Arabica Archmage.',
    multiplier: '2x',
    price: 5000000,
    priceLabel: '5,000,000 COFFY',
    image: '/coffygame/assets/player_arabica.png',
    gradient: 'from-[#7B3F00] to-[#C9B18A]',
    rarity: 'Rare'
  },
  {
    id: 4,
    name: 'Robusta Shadowblade',
    description: '2.5x rewards with Robusta Shadowblade.',
    multiplier: '2.5x',
    price: 8000000,
    priceLabel: '8,000,000 COFFY',
    image: '/coffygame/assets/player_robusta.png',
    gradient: 'from-[#3E2723] to-[#A1887F]',
    rarity: 'Epic'
  },
  {
    id: 5,
    name: 'Legendary Dragon',
    description: '5x rewards and DAO membership with Legendary Dragon.',
    multiplier: '5x',
    price: 10000000,
    priceLabel: '10,000,000 COFFY',
    image: '/coffygame/assets/player_espresso.png',
    gradient: 'from-[#4B2E05] to-[#FFD700]',
    rarity: 'Legendary'
  },
];

export default function NFTMarketplace({ id }) {
	const { userAddress, tokenContract, isLoading: walletLoading } = useWeb3Wallet();
	const [buyingId, setBuyingId] = useState(null);
	const [checkingOwnership, setCheckingOwnership] = useState(false);
	
	// Zustand store integration
	const { 
		portfolio, 
		ui,
		updateOwnedCharacters, 
		addNotification, 
		triggerConfetti, 
		stopConfetti,
		updatePortfolio 
	} = useAppStore();

	// Get owned characters from store
	const ownedCharacters = new Set(portfolio.ownedCharacters);

	// Modern intersection observer
	const { ref, inView } = useInView({
		threshold: 0.1,
		triggerOnce: true
	});

	// Check ownership for a specific character
	const checkCharacterOwnership = async (charId, userAddr) => {
		if (!userAddr || !window.ethereum) return false;
		try {
			const { ethers } = await import('ethers');
			const provider = new ethers.BrowserProvider(window.ethereum);
			const contractABI = [
				"function getUserCharacterBalance(address,uint256) view returns (uint256)",
				"function userCharacters(address,uint256) view returns (uint128)"
			];
			const contract = new ethers.Contract(
				'0x50eD280D06fAbfC97709E3435c7dfD1Fa17Bbd78',
				contractABI,
				provider
			);
			// Try getUserCharacterBalance first
			try {
				const balance = await contract.getUserCharacterBalance(userAddr, charId);
				return balance > 0;
			} catch (err1) {
				// Fallback to userCharacters if needed
				try {
					const balance = await contract.userCharacters(userAddr, charId);
					return balance > 0;
				} catch (err2) {
					console.error('All ownership methods failed for character', charId, err2);
					return false;
				}
			}
		} catch (err) {
			console.error('Ownership check failed for character', charId, err);
			return false;
		}
	};

	// Check all characters ownership on load
	useEffect(() => {
		const checkAllOwnerships = async () => {
			if (!userAddress) {
				updateOwnedCharacters([]);
				return;
			}

			setCheckingOwnership(true);
			const owned = [];

			for (const char of characterNFTs) {
				const isOwned = await checkCharacterOwnership(char.id, userAddress);
				if (isOwned) {
					owned.push(char.id);
				}
			}

			updateOwnedCharacters(owned);
			setCheckingOwnership(false);
		};

		checkAllOwnerships();
	}, [userAddress, updateOwnedCharacters]);

	// Character buy function with enhanced state management
	const handleBuy = async (char) => {
		console.log('Purchasing character:', char.name);
		if (!userAddress) {
			toast.error('Please connect your wallet first.');
			addNotification({
				type: 'error',
				title: 'Wallet Required',
				message: 'Please connect your wallet to purchase characters'
			});
			return;
		}
		if (!window.ethereum) {
			toast.error('Web3 wallet not found.');
			return;
		}
		setBuyingId(char.id);
		try {
			const { ethers } = await import('ethers');
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			
			// Updated ABI with more standard ERC20/NFT functions
			const contractABI = [
				"function balanceOf(address) view returns (uint256)",
				"function purchaseCharacter(uint256,uint256) payable",
				"function characterOwnership(address,uint256) view returns (bool)",
				"function ownerOf(uint256) view returns (address)",
				"function allowance(address,address) view returns (uint256)",
				"function approve(address,uint256) returns (bool)"
			];
			
			const contract = new ethers.Contract(
				'0x50eD280D06fAbfC97709E3435c7dfD1Fa17Bbd78',
				contractABI,
				signer
			);

			// Check character ownership
			const isOwned = await checkCharacterOwnership(char.id, userAddress);
			if (isOwned) {
				toast('You already own this character!');
				setBuyingId(null);
				return;
			}

			// Check balance
			const balance = await contract.balanceOf(userAddress);
			const priceWei = BigInt(char.price) * 10n ** 18n;
			
			console.log('User balance:', ethers.formatEther(balance), 'COFFY');
			console.log('Required:', ethers.formatEther(priceWei), 'COFFY');
			
			if (balance < priceWei) {
				toast.error(`Insufficient COFFY balance! You need ${ethers.formatEther(priceWei)} COFFY`);
				setBuyingId(null);
				return;
			}

			console.log('Starting purchase transaction:', char.id);
			toast('Sending transaction to contract...');
			
			// Purchase character
			const tx = await contract.purchaseCharacter(char.id, 1);
			toast.success('Transaction sent. Please confirm in your wallet...');
			
			const receipt = await tx.wait();
			console.log('Transaction confirmed:', receipt);
			
			// Update owned characters in store
			const newOwnedCharacters = [...portfolio.ownedCharacters, char.id];
			updateOwnedCharacters(newOwnedCharacters);
			
			// Update portfolio stats
			updatePortfolio({
				nftCount: portfolio.nftCount + 1
			});
			
			// Success notification and celebration
			addNotification({
				type: 'success',
				title: `${char.name} Acquired!`,
				message: `You now own the ${char.rarity} character with ${char.multiplier} reward multiplier!`
			});
			
			// Trigger confetti celebration
			triggerConfetti();
			setTimeout(() => stopConfetti(), 5000);
			
			toast.success(`${char.name} purchased successfully!`);
			
		} catch (err) {
			console.error('Purchase error:', err);
			
			// Better error messages
			let errorMessage = 'Purchase failed: ';
			if (err.message.includes('insufficient funds')) {
				errorMessage += 'Insufficient funds for gas fees';
			} else if (err.message.includes('user rejected')) {
				errorMessage += 'Transaction was rejected';
			} else if (err.message.includes('execution reverted')) {
				errorMessage += 'Contract execution failed. Check if you have enough COFFY tokens or if the character is still available.';
			} else if (err.reason) {
				errorMessage += err.reason;
			} else if (err.message) {
				errorMessage += err.message;
			} else {
				errorMessage += 'Unknown error occurred';
			}
			
			toast.error(errorMessage);
			addNotification({
				type: 'error',
				title: 'Purchase Failed',
				message: errorMessage
			});
		} finally {
			setBuyingId(null);
		}
	};

	// Get rarity color
	const getRarityColor = (rarity) => {
		const colors = {
			'Common': 'from-gray-400 to-gray-600',
			'Rare': 'from-blue-400 to-blue-600',
			'Epic': 'from-purple-400 to-purple-600',
			'Legendary': 'from-yellow-400 to-orange-500'
		};
		return colors[rarity] || colors['Common'];
	};

	return (
		<section id={id} className="relative py-20 bg-gradient-to-b from-[#1A0F0A] to-[#3A2A1E] min-h-[60vh] scroll-mt-24">
			{/* Confetti celebration */}
			{ui.confetti && (
				<Confetti
					width={typeof window !== 'undefined' ? window.innerWidth : 300}
					height={typeof window !== 'undefined' ? window.innerHeight : 200}
					recycle={false}
					numberOfPieces={200}
					colors={['#D4A017', '#A77B06', '#F4C430', '#8B6914']}
				/>
			)}
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<motion.div 
					className="text-center mb-12"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.8 }}
				>
					<h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] via-[#F4C430] to-[#D4A017] mb-4">
						Coffy Character Collection
					</h2>
					<p className="text-lg text-[#E8D5B5] max-w-3xl mx-auto mb-6">
						Discover and purchase unique Coffy characters. Each character boosts your in-game rewards.<br/>
						More NFT items and in-game assets <span className="text-[#D4A017] font-semibold">coming soon</span>.
					</p>
					<motion.div
						className="w-24 h-1 bg-gradient-to-r from-[#D4A017] to-[#A77B06] mx-auto"
						initial={{ width: 0 }}
						animate={inView ? { width: '6rem' } : { width: 0 }}
						transition={{ duration: 1, delay: 0.3 }}
					/>
				</motion.div>

				{/* Character cards grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
					{characterNFTs.map((char, index) => {
						const isOwned = ownedCharacters.has(char.id);
						const isProcessing = buyingId === char.id;
						
						return (
							<motion.div
								key={char.id}
								initial={{ opacity: 0, y: 50, scale: 0.9 }}
								animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
								transition={{ 
									duration: 0.6, 
									delay: index * 0.1,
									type: "spring",
									stiffness: 100
								}}
								whileHover={{ 
									scale: 1.03, 
									y: -8,
									boxShadow: '0 20px 40px rgba(212,160,23,0.25)' 
								}}
								className={`group relative bg-gradient-to-br ${char.gradient} rounded-2xl p-4 sm:p-6 transition-all duration-500 border border-white/20 backdrop-blur-sm min-h-[400px] flex flex-col cursor-pointer max-w-xs mx-auto overflow-hidden`}
							>
								{/* Rarity badge */}
								<div className="absolute top-3 left-3 z-30">
									<span className={`bg-gradient-to-r ${getRarityColor(char.rarity)} text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg`}>
										{char.rarity}
									</span>
								</div>

								{/* Character Image */}
								<div className="relative h-48 w-full mb-4 rounded-xl overflow-hidden flex items-center justify-center bg-black/10">
									<motion.img
										src={char.image}
										alt={char.name}
										className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-xl"
										onError={(e) => {
											e.target.src = '/images/game-placeholder.jpg';
										}}
										whileHover={{ scale: 1.1 }}
										transition={{ duration: 0.3 }}
									/>
									<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 rounded-xl"></div>
									
									{/* Price/Owned Badge */}
									<div className="absolute top-3 right-3 z-20">
										<span className={`text-white text-xs px-3 py-1 rounded-full font-bold shadow ${
											isOwned ? 'bg-green-600/90' : 'bg-[#D4A017]/90'
										}`}>
											{isOwned ? 'OWNED' : char.priceLabel}
										</span>
									</div>
									
									{/* Multiplier Badge */}
									<div className="absolute bottom-3 right-3 z-20">
										<span className="bg-[#222]/80 text-[#D4A017] text-xs px-2 py-1 rounded-full font-bold shadow border border-[#D4A017]/40">
											{char.multiplier}
										</span>
									</div>

									{/* Owned overlay effect */}
									{isOwned && (
										<motion.div
											className="absolute inset-0 bg-green-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.3 }}
										>
											<div className="text-4xl">✅</div>
										</motion.div>
									)}
								</div>

								{/* Character Info */}
								<div className="space-y-2 flex-1 flex flex-col relative z-10">
									<h3 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-200 transition-colors">
										{char.name}
									</h3>
									<p className="text-sm text-white/90 leading-relaxed line-clamp-2 min-h-[2.5rem] flex-grow">
										{char.description}
									</p>
									
									<motion.button
										className={`w-full mt-4 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 text-base ${
											!userAddress
												? 'bg-gray-600 text-gray-300 cursor-not-allowed'
												: isOwned
												? 'bg-green-600 text-white cursor-default'
												: isProcessing
												? 'bg-gradient-to-r from-[#A77B06] to-[#7A5E05] text-white cursor-wait'
												: 'bg-gradient-to-r from-[#D4A017] to-[#A77B06] text-white hover:shadow-xl hover:scale-105'
										}`}
										onClick={() => !isOwned && handleBuy(char)}
										disabled={!userAddress || isProcessing || isOwned}
										whileHover={!isOwned && !isProcessing ? { scale: 1.05 } : {}}
										whileTap={!isOwned && !isProcessing ? { scale: 0.95 } : {}}
									>
										{!userAddress
											? 'Connect Wallet'
											: isOwned
											? 'Owned ✓'
											: isProcessing
											? 'Processing...'
											: checkingOwnership
											? 'Checking...'
											: 'Buy Character'
										}
									</motion.button>
								</div>

								{/* Hover Overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
							</motion.div>
						);
					})}
				</div>
				
				<motion.div 
					className="mt-10 text-[#E8D5B5]/60 text-sm text-center"
					initial={{ opacity: 0 }}
					animate={inView ? { opacity: 1 } : { opacity: 0 }}
					transition={{ duration: 0.8, delay: 1 }}
				>
					<span className="inline-block bg-[#D4A017]/10 text-[#D4A017] px-4 py-2 rounded-lg font-semibold">
						More NFT items and in-game assets coming in Q4!
					</span>
				</motion.div>
			</div>
		</section>
	);
}