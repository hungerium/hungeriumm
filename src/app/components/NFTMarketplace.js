import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import useWeb3Wallet from './useWeb3Wallet';
import { ethers, parseEther, formatEther, isAddress } from 'ethers';
import { } from './contractDebugHelper';
import { showNotification } from '../utils/revealOnScroll';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';



// Batch çağrı fonksiyonu
async function batchCall(promises, batchSize = 10) {
	const results = [];
	for (let i = 0; i < promises.length; i += batchSize) {
		const batch = promises.slice(i, i + batchSize);
		const batchResults = await Promise.all(batch);
		results.push(...batchResults);
		// Gerekirse kısa bir bekleme eklenebilir
		// await new Promise(res => setTimeout(res, 50));
	}
	return results;
}

// Admin adresini belirle (gerekirse dışarıdan al veya sabit tanımla)
const ADMIN_ADDRESS = "0xD45024E3fC67DFAA456e111204950D510Bd44B9B"; // örnek admin/owner adresi

// 5 karakterin örnek bilgileri (ID, isim, açıklama, multiplier, fiyat)
const characterNFTs = [
  {
    id: 1,
    name: 'Genesis',
    description: 'The base character. Standard reward multiplier.',
    multiplier: '1x',
    price: 1000000,
    priceLabel: '1,000,000 COFFY',
    image: '/coffygame/assets/coffee_cup.png',
    gradient: 'from-[#BFA181] to-[#6F4E37]',
  },
  {
    id: 2,
    name: 'Mocha Knight',
    description: 'Earn 50% more rewards with Mocha Knight.',
    multiplier: '1.5x',
    price: 3000000,
    priceLabel: '3,000,000 COFFY',
    image: '/coffygame/assets/player_mocha.png',
    gradient: 'from-[#A77B06] to-[#3A2A1E]',
  },
  {
    id: 3,
    name: 'Arabica Archmage',
    description: 'Earn 100% more rewards with Arabica Archmage.',
    multiplier: '2x',
    price: 5000000,
    priceLabel: '5,000,000 COFFY',
    image: '/coffygame/assets/player_arabica.png',
    gradient: 'from-[#FFD700] to-[#D4A017]',
  },
  {
    id: 4,
    name: 'Robusta Shadowblade',
    description: 'Earn 200% more rewards with Robusta Shadowblade.',
    multiplier: '3x',
    price: 7000000,
    priceLabel: '7,000,000 COFFY',
    image: '/coffygame/assets/player_robusta.png',
    gradient: 'from-[#8B6F4E] to-[#3A2A1E]',
  },
  {
    id: 5,
    name: 'Legendary Dragon',
    description: 'Earn 400% more rewards and DAO membership with Legendary Dragon.',
    multiplier: '5x',
    price: 10000000,
    priceLabel: '10,000,000 COFFY',
    image: '/coffygame/assets/player_espresso.png',
    gradient: 'from-[#D4A017] to-[#A77B06]',
  },
];

export default function NFTMarketplace() {
	const { userAddress, provider, signer, isLoading: walletLoading, tokenContract } = useWeb3Wallet();
	const [nfts, setNfts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [status, setStatus] = useState('');
	const [selectedNFT, setSelectedNFT] = useState(null);
	const [transferAddress, setTransferAddress] = useState('');
	const [showTransferModal, setShowTransferModal] = useState(false);
	const [showListingModal, setShowListingModal] = useState(false);
	const [listingPrice, setListingPrice] = useState('');
	const [buyingId, setBuyingId] = useState(null);
	const [modalChar, setModalChar] = useState(null);

	// View mode ("carousel" or "grid")
	const [viewMode, setViewMode] = useState('carousel');
	// Carousel index (which group is shown)
	const [carouselIndex, setCarouselIndex] = useState(0);
	// Modal preview state
	const [previewNFT, setPreviewNFT] = useState(null);
	// Collection statistics
	const [collectionStats, setCollectionStats] = useState({ total: 0, owners: 0 });
	
	// NFT tier details
	const nftTiers = [
		{ name: "Gold", bonus: 30, color: "from-yellow-500 to-yellow-700" },
		{ name: "Silver", bonus: 20, color: "from-gray-300 to-gray-500" },
		{ name: "Bronze", bonus: 10, color: "from-amber-700 to-amber-900" }
	];
	
	// Instead, sort NFTs so forSale NFTs come first
	const sortedNFTs = useMemo(() => {
		function tierOrderById(nft) {
			if (nft.id >= 1 && nft.id <= 10) return 1; // Gold
			if (nft.id >= 11 && nft.id <= 30) return 2; // Silver
			if (nft.id >= 31 && nft.id <= 50) return 3; // Bronze
			return 4;
		}
		return [...nfts].sort((a, b) => {
			// Önce satışta olanlar
			if (a.forSale !== b.forSale) return a.forSale ? -1 : 1;
			// Sonra tier/id sırası
			const tierA = tierOrderById(a);
			const tierB = tierOrderById(b);
			if (tierA !== tierB) return tierA - tierB;
			// Aynı tier ise id'ye göre sırala
			return a.id - b.id;
		});
	}, [nfts]);
	
	// Create NFT contract
	const getNFTContract = () => {
		if (!provider) return null;
		return new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer || provider);
	};

	// 3. Fetch active listings from marketplace and merge with NFT data
	useEffect(() => {
		const loadNFTs = async () => {
			setIsLoading(true);
			setStatus('');
			try {
				const contract = getNFTContract();
				const marketplace = getMarketplaceContract();
				if (!contract || !marketplace) {
					console.error('Contract or marketplace instance is null', { contract, marketplace });
					return;
				}
				const total = await contract.totalSupply();
				let ownersSet = new Set();

				// Fetch all active listings from marketplace
				let activeListings = [];
				try {
					activeListings = await marketplace.getActiveListings();
				} catch {}
				// Map tokenId to listing
				const listingMap = {};
				for (const listing of activeListings) {
					if (listing.active) {
						listingMap[Number(listing.tokenId)] = listing;
					}
				}

				// TokenId dizisi oluştur
				const tokenIds = Array.from({ length: Number(total) }, (_, i) => i + 1);

				// ownerOf, tokenURI, getTokenInfo çağrılarını batchCall ile parça parça yap
				const ownerPromises = tokenIds.map(id => contract.ownerOf(id).catch(() => null));
				const tokenURIPromises = tokenIds.map(id => contract.tokenURI(id).catch(() => null));
				const tokenInfoPromises = tokenIds.map(id => contract.getTokenInfo(id).catch(() => null));

				const owners = await batchCall(ownerPromises, 10);
				const uris = await batchCall(tokenURIPromises, 10);
				const infos = await batchCall(tokenInfoPromises, 10);

				let items = [];
				for (let idx = 0; idx < tokenIds.length; idx++) {
					const i = tokenIds[idx];
					const owner = owners[idx];
					if (!owner) continue;
					ownersSet.add(owner.toLowerCase());

					let displayBonus = 10;
					let tierName = 'Bronze';
					let nftImage = '/images/coffy-logo.png';
					let nftName = `Coffy Memories #${i}`;
					let nftDescription = '';

					const uri = uris[idx];

					if (i >= 1 && i <= 10) {
						tierName = 'Gold';
						displayBonus = 30;
					} else if (i >= 11 && i <= 30) {
						tierName = 'Silver';
						displayBonus = 20;
					} else if (i >= 31 && i <= 50) {
						tierName = 'Bronze';
						displayBonus = 10;
					}

					const info = infos[idx];
					if (info && info.tierName && info.tierName !== '') {
						tierName = info.tierName;
					}
					if (info && info.bonusPercentage && Number(info.bonusPercentage) > 0) {
						displayBonus = Number(info.bonusPercentage);
					}

					if (!nftDescription) {
						nftDescription = `This exclusive ${tierName} NFT grants ${displayBonus}% bonus to all in-game rewards and provides 1 year free coffee at partner cafes.`;
					}

					let forSale = false;
					let price = "0";
					let listingId = null;
					let seller = null;
					if (listingMap[i]) {
						forSale = true;
						price = formatEther(listingMap[i].priceBNB);
						listingId = Number(listingMap[i].listingId);
						seller = listingMap[i].seller;
					}

					items.push({
						id: i,
						owner,
						image: nftImage,
						name: nftName,
						description: nftDescription,
						tier: tierName === 'Gold' ? 2 : tierName === 'Silver' ? 1 : 0,
						bonus: displayBonus,
						tierName: tierName,
						forSale,
						price,
						listingId,
						seller
					});
				}
				setNfts(items);
				setCollectionStats({ total, owners: ownersSet.size });
			} catch (err) {
				console.error('NFT load error:', err);
				setStatus('Failed to load NFTs.');
			} finally {
				setIsLoading(false);
			}
		};
		if (provider) loadNFTs();
	}, [provider]);

	// Carousel navigation
	const handlePrev = () => {
		setCarouselIndex(idx => (idx - 1 + Math.ceil(sortedNFTs.length / 4)) % Math.ceil(sortedNFTs.length / 4));
	};
	const handleNext = () => {
		setCarouselIndex(idx => (idx + 1) % Math.ceil(sortedNFTs.length / 4));
	};
	const handleDot = (i) => setCarouselIndex(i);

	// Reset carousel index when filters change
	useEffect(() => {
		setCarouselIndex(0);
	}, []);

	// Open/close modal preview
	const openPreview = (nft) => setPreviewNFT(nft);
	const closePreview = () => setPreviewNFT(null);

	// Add new NFT marketplace functionality
	
	// 4. Listing NFT for sale (with approve)
	const handleListForSale = async () => {
		if (!selectedNFT) {
			setStatus('No NFT selected');
			return;
		}
		if (!listingPrice || isNaN(parseFloat(listingPrice)) || parseFloat(listingPrice) <= 0) {
			setStatus('Please enter a valid price greater than 0');
			return;
		}

		setIsLoading(true);
		setStatus('Preparing to list NFT for sale...');
		
		try {
			const nftContract = getNFTContract();
			const marketplaceContract = getMarketplaceContract();

			if (!nftContract || !marketplaceContract) {
				setStatus('Failed to connect to contracts');
				setIsLoading(false);
				return;
			}

			// 1. Verify user owns the NFT
			setStatus('Verifying ownership...');
			const owner = await nftContract.ownerOf(selectedNFT.id);
			if (owner.toLowerCase() !== userAddress.toLowerCase()) {
				setStatus('You do not own this NFT');
				setIsLoading(false);
				return;
			}

			// 2. Check if NFT is already listed
			setStatus('Checking existing listings...');
			try {
				const existingListingId = await marketplaceContract.tokenToListing(selectedNFT.id);
				if (existingListingId > 0) {
					const existingListing = await marketplaceContract.listings(existingListingId);
					if (existingListing.active) {
						setStatus('This NFT is already listed for sale. Cancel the existing listing first.');
						setIsLoading(false);
						return;
					}
				}
			} catch (error) {
				// tokenToListing might not exist or return 0, which is fine
				console.log('No existing listing found or error checking:', error);
			}

			// 3. Check and handle approval
			const approvedAddress = await nftContract.getApproved(selectedNFT.id);
			const isApprovedForAll = await nftContract.isApprovedForAll(userAddress, MARKETPLACE_CONTRACT_ADDRESS);
			
			if (approvedAddress.toLowerCase() !== MARKETPLACE_CONTRACT_ADDRESS.toLowerCase() && !isApprovedForAll) {
				setStatus('Approving marketplace to transfer NFT...');
				const approveTx = await nftContract.approve(MARKETPLACE_CONTRACT_ADDRESS, selectedNFT.id);
				setStatus('Approval transaction sent. Waiting for confirmation...');
				await approveTx.wait();
				setStatus('NFT approved for marketplace');
			} else {
				setStatus('NFT already approved for marketplace');
			}

			// 4. List item on marketplace
			setStatus('Listing NFT on marketplace...');
			const priceInWei = parseEther(listingPrice);
			const tx = await marketplaceContract.listItem(
				selectedNFT.id, 
				priceInWei, 
				0, // CoffyCoin price (0 = not accepted)
				true, // accepts BNB
				false // accepts CoffyCoin
			);
			
			setStatus('Listing transaction sent. Waiting for confirmation...');
			const receipt = await tx.wait();
			
			console.log('Listing successful:', receipt);
			setStatus('NFT successfully listed for sale! 🎉');
			
			// Close modal and reset
			setShowListingModal(false);
			setListingPrice('');
			setSelectedNFT(null);
			
			// Reload page after 3 seconds
			setTimeout(() => {
				window.location.reload();
			}, 3000);

		} catch (err) {
			console.error('Listing error:', err);
			let errorMessage = 'Listing failed: ';
			
			if (err.code === 4001) {
				errorMessage += 'Transaction was rejected by user';
			} else if (err.code === -32603) {
				errorMessage += 'Internal error occurred';
			} else if (err.message?.includes('insufficient funds')) {
				errorMessage += 'Insufficient funds for transaction';
			} else if (err.message?.includes('execution reverted')) {
				errorMessage += 'Transaction was reverted by contract';
			} else if (err.message?.includes('Marketplace not approved')) {
				errorMessage += 'Please approve the marketplace to transfer your NFT';
			} else {
				errorMessage += err.reason || err.message || 'Unknown error occurred';
			}
			
			setStatus(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};
	
	// 5. Buying NFT from marketplace
	const handlePurchase = async (nft) => {
		if (!nft || !nft.listingId) {
			setStatus('Invalid NFT or listing information');
			return;
		}

		setIsLoading(true);
		setStatus('Preparing purchase...');

		console.log('=== PURCHASE DEBUG INFO ===');
		console.log('NFT:', nft);
		console.log('User address:', userAddress);
		console.log('Listing ID:', nft.listingId);
		console.log('Price:', nft.price, 'BNB');

		try {
			// Check if marketplace is connected to correct NFT contract
			const marketplaceContractCheck = getMarketplaceContract();
			if (marketplaceContractCheck) {
				try {
					const connectedNFTContract = await marketplaceContractCheck.coffyMemoriesContract();
					if (connectedNFTContract.toLowerCase() !== NFT_CONTRACT_ADDRESS.toLowerCase()) {
						setStatus('⚠️ Marketplace contract incompatibility detected. This NFT may not be purchasable through the current marketplace.');
						console.error('Marketplace NFT contract mismatch:', {
							expected: NFT_CONTRACT_ADDRESS,
							found: connectedNFTContract
						});
						setIsLoading(false);
						return;
					}
				} catch (checkError) {
					console.warn('Could not verify marketplace contract compatibility:', checkError);
				}
			}
			// 1. Network kontrolü
			const network = await provider.getNetwork();
			console.log('Network chainId:', network.chainId);
			if (network.chainId !== 56n) {
				setStatus('Please switch to BSC Mainnet (Chain ID: 56)');
				setIsLoading(false);
				return;
			}

			// 2. Balance kontrolü
			const balance = await provider.getBalance(userAddress);
			const priceInWei = parseEther(nft.price);
			const requiredAmount = priceInWei + parseEther('0.001'); // Extra for gas

			if (balance < requiredAmount) {
				setStatus(`Insufficient BNB balance. Required: ${formatEther(requiredAmount)} BNB`);
				setIsLoading(false);
				return;
			}

			// 3. Marketplace contract check
			const marketplaceContractMain = getMarketplaceContract();
			if (!marketplaceContractMain) {
				setStatus('Failed to connect to marketplace contract');
				setIsLoading(false);
				return;
			}
			
			console.log('Marketplace contract address:', MARKETPLACE_CONTRACT_ADDRESS);
			console.log('Marketplace contract connected:', !!marketplaceContractMain);

			// 4. Verify listing exists and is active
			setStatus('Verifying listing...');
			let listing;
			try {
				listing = await marketplaceContractMain.listings(nft.listingId);
				console.log('Listing details:', {
					listingId: nft.listingId,
					tokenId: listing.tokenId?.toString(),
					seller: listing.seller,
					priceBNB: listing.priceBNB?.toString(),
					priceCoffyCoin: listing.priceCoffyCoin?.toString(),
					acceptsBNB: listing.acceptsBNB,
					acceptsCoffyCoin: listing.acceptsCoffyCoin,
					active: listing.active,
					listedAt: listing.listedAt?.toString()
				});
				
				if (!listing.active) {
					setStatus('This NFT is no longer available for sale');
					setIsLoading(false);
					return;
				}
			} catch (error) {
				console.error('Failed to fetch listing:', error);
				setStatus('Failed to verify listing. It may no longer exist.');
				setIsLoading(false);
				return;
			}

			// 5. Check listing acceptsBNB flag
			setStatus('Checking payment method...');
			if (!listing.acceptsBNB) {
				setStatus('This seller does not accept BNB payments. Only CoffyCoin accepted.');
				setIsLoading(false);
				return;
			}

			// 6. Check if user is trying to buy their own NFT
			if (listing.seller.toLowerCase() === userAddress.toLowerCase()) {
				setStatus('You cannot buy your own NFT');
				setIsLoading(false);
				return;
			}

			// 7. Verify price matches
			const expectedPrice = listing.priceBNB;
			if (priceInWei.toString() !== expectedPrice.toString()) {
				setStatus(`Price mismatch. Expected: ${formatEther(expectedPrice)} BNB`);
				setIsLoading(false);
				return;
			}

			// 8. Static call test to check if purchase would succeed
			setStatus('Verifying transaction...');
			console.log('Static call params:', {
				listingId: nft.listingId,
				value: priceInWei.toString(),
				from: userAddress
			});
			
			try {
				await marketplaceContractMain.buyWithBNB.staticCall(nft.listingId, { 
					value: priceInWei,
					from: userAddress 
				});
				console.log('✅ Static call successful');
			} catch (staticError) {
				console.error('❌ Static call failed:', staticError);
				console.error('Error details:', {
					code: staticError.code,
					reason: staticError.reason,
					message: staticError.message
				});
				
				let errorMsg = 'Transaction verification failed: ';
				if (staticError.message?.includes('BNB not accepted')) {
					errorMsg += 'BNB payments not accepted for this item';
				} else if (staticError.message?.includes('Insufficient BNB')) {
					errorMsg += 'Insufficient BNB amount sent';
				} else if (staticError.message?.includes('Cannot buy own item')) {
					errorMsg += 'Cannot purchase your own NFT';
				} else if (staticError.message?.includes('Listing not active')) {
					errorMsg += 'This listing is no longer active';
				} else if (staticError.message?.includes('revert')) {
					errorMsg += 'Contract rejected transaction - check marketplace settings';
				} else if (staticError.data) {
					errorMsg += `Contract error: ${staticError.data}`;
				} else {
					errorMsg += staticError.reason || staticError.message || 'Unknown error';
				}
				setStatus(errorMsg);
				setIsLoading(false);
				return;
			}

			// 9. Execute the actual purchase
			setStatus('Processing purchase...');
			console.log('Executing buyWithBNB transaction...');
			
			const tx = await marketplaceContractMain.buyWithBNB(nft.listingId, {
				value: priceInWei,
				gasLimit: 350000 // Increased gas limit
			});

			console.log('Transaction hash:', tx.hash);
			setStatus('Transaction sent. Waiting for confirmation...');
			const receipt = await tx.wait();
			
			console.log('✅ Purchase successful:', receipt);
			setStatus('NFT successfully purchased! 🎉');
			
			// Reload page after 3 seconds
			setTimeout(() => {
				window.location.reload();
			}, 3000);

		} catch (error) {
			console.error('Purchase failed:', error);
			let errorMessage = 'Purchase failed: ';
			
			if (error.code === 4001) {
				errorMessage += 'Transaction was rejected by user';
			} else if (error.code === -32603) {
				errorMessage += 'Internal error occurred';
			} else if (error.message?.includes('insufficient funds')) {
				errorMessage += 'Insufficient funds for transaction';
			} else if (error.message?.includes('execution reverted')) {
				errorMessage += 'Transaction was reverted by contract';
			} else {
				errorMessage += error.reason || error.message || 'Unknown error occurred';
			}
			
			setStatus(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};
	
	// Handle removing NFT from sale
	const handleRemoveFromSale = async (nft) => {
		setIsLoading(true);
		setStatus('Removing NFT from sale...');
		try {
			const marketplace = getMarketplaceContract();
			const listingId = nft.listingId; // veya await marketplace.tokenToListing(nft.id);
			if (!listingId) {
				setStatus('Listing ID bulunamadı.');
				setIsLoading(false);
				return;
			}
			// Sadece seller veya admin ise işlemi yap
			if (
				userAddress.toLowerCase() !== (nft.seller?.toLowerCase() || '') &&
				userAddress.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()
			) {
				setStatus('Sadece NFT sahibi veya admin kaldırabilir.');
				setIsLoading(false);
				return;
			}
			const tx = await marketplace.cancelListing(listingId);
			setStatus('Transaction sent...');
			await tx.wait();
			setStatus('NFT removed from sale!');
			setTimeout(() => window.location.reload(), 2000);
		} catch (err) {
			console.error('Remove from sale error:', err);
			if (err.code === 4001) {
				setStatus('Transaction rejected by user');
			} else {
				setStatus('Failed to remove from sale: ' + (err.reason || err.message || 'Unknown error'));
			}
		} finally {
			setIsLoading(false);
		}
	};
	
	// Validate address utility function
	const isValidAddress = (address) => {
		try {
			return isAddress(address);
		} catch {
			return false;
		}
	};
	
	// NFT transfer (purchase)
	const handleTransfer = async () => {
		if (!selectedNFT || !transferAddress) {
			setStatus('Please fill in all fields');
			return;
		}
		
		// Validate the address
		try {
			if (!isValidAddress(transferAddress)) {
				setStatus('Invalid wallet address');
				return;
			}
			
			// Check if user is trying to transfer to themselves
			if (transferAddress.toLowerCase() === selectedNFT.owner.toLowerCase()) {
				setStatus('Cannot transfer to the same address');
				return;
			}
		} catch {
			setStatus('Invalid address format');
			return;
		}
		
		setIsLoading(true);
		setStatus('Initiating transfer...');
		try {
			const contract = getNFTContract();
			const tx = await contract["safeTransferFrom"](selectedNFT.owner, transferAddress, selectedNFT.id);
			setStatus('Transfer transaction sent.');
			await tx.wait();
			setStatus('Transfer successful!');
			setShowTransferModal(false);
			setTransferAddress('');
			setSelectedNFT(null);
			// Reload
			setTimeout(() => window.location.reload(), 2000);
		} catch (err) {
			console.error('Transfer error:', err);
			// More user-friendly error messages
			if (err.code === 4001) {
				setStatus('Transaction rejected by user');
			} else if (err.code === -32603) {
				setStatus('Transaction failed. Make sure you have enough balance.');
			} else if (err.message?.includes('insufficient funds')) {
				setStatus('Insufficient funds for this transaction');
			} else {
				setStatus('Transfer failed: ' + (err.reason || err.message || 'Unknown error'));
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Move getMarketplaceContract here so it can access provider and signer
	const getMarketplaceContract = () => {
		if (!provider) return null;
		return new ethers.Contract(MARKETPLACE_CONTRACT_ADDRESS, MARKETPLACE_CONTRACT_ABI, signer || provider);
	};

	// Contract verification and debug (only run once)
	useEffect(() => {
		const verifyContracts = async () => {
			if (!provider) return;
			
			try {
				console.log('=== CONTRACT VERIFICATION ===');
				
				// 1. Network check
				const network = await provider.getNetwork();
				console.log('Connected to network:', network.chainId);
				
				// 2. NFT Contract verification
				const nftCode = await provider.getCode(NFT_CONTRACT_ADDRESS);
				console.log('NFT contract exists:', nftCode !== '0x');
				
				// 3. Marketplace Contract verification
				const marketplaceCode = await provider.getCode(MARKETPLACE_CONTRACT_ADDRESS);
				console.log('Marketplace contract exists:', marketplaceCode !== '0x');
				
				// 4. Test marketplace connection
				if (marketplaceCode !== '0x') {
					const marketplace = getMarketplaceContract();
					try {
						// Check marketplace basic info
						const feePercentage = await marketplace.feePercentage();
						const feeRecipient = await marketplace.feeRecipient();
						const coffyMemoriesContract = await marketplace.coffyMemoriesContract();
						
						console.log('Marketplace info:', {
							feePercentage: feePercentage.toString(),
							feeRecipient,
							coffyMemoriesContract,
							expectedNFTContract: NFT_CONTRACT_ADDRESS
						});
						
						// Check if marketplace is connected to the correct NFT contract
						if (coffyMemoriesContract.toLowerCase() !== NFT_CONTRACT_ADDRESS.toLowerCase()) {
							console.error('❌ MARKETPLACE ERROR: Connected to wrong NFT contract!');
							console.error('Expected:', NFT_CONTRACT_ADDRESS);
							console.error('Found:', coffyMemoriesContract);
						} else {
							console.log('✅ Marketplace correctly connected to NFT contract');
						}
						
						// Try to get active listings
						try {
							const activeListings = await marketplace.getActiveListings();
							console.log('Active listings count:', activeListings.length);
						} catch (listingsErr) {
							console.error('Failed to get active listings:', listingsErr);
						}
						
					} catch (err) {
						console.error('Failed to get marketplace info:', err);
					}
				}
				
				console.log('=== VERIFICATION COMPLETE ===');
			} catch (error) {
				console.error('Contract verification failed:', error);
			}
		};
		
		verifyContracts();
	}, [provider]);

	// Aktif ve sahipliği doğrulanmış NFT'leri filtrele
	const filteredNFTs = useMemo(() => {
		return sortedNFTs.filter(nft => {
			if (!nft.forSale) return true; // Satışta değilse zaten göster
			// Satışta ise, NFT'nin owner'ı ile listing seller aynı mı?
			return nft.owner && nft.seller && nft.owner.toLowerCase() === nft.seller.toLowerCase();
		});
	}, [sortedNFTs]);

	// Karakter satın alma fonksiyonu (tokenContract üzerinden)
	const handleBuy = async (char) => {
		console.log('userAddress:', userAddress);
		console.log('tokenContract:', tokenContract);
		console.log('char.id:', char.id);
		if (!userAddress) {
			alert('Please connect your wallet first.');
			return;
		}
		if (!tokenContract) {
			alert('Smart contract not loaded. Please refresh the page.');
			return;
		}
		setBuyingId(char.id);
		try {
			// Doğru fonksiyon ve parametreler
			const tx = await tokenContract.purchaseCharacter(char.id, 1);
			alert('Purchase transaction sent. Waiting for confirmation...');
			await tx.wait();
			alert(`${char.name} purchased successfully!`);
			setModalChar(char);
		} catch (err) {
			alert('Purchase failed');
			if (err?.reason || err?.message) {
				alert(err.reason || err.message);
			}
		} finally {
			setBuyingId(null);
		}
	};

	return (
		<section id="coffy-marketplace" className="py-16 bg-gradient-to-b from-[#1A0F0A] to-[#2A1B13]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] via-[#F4C430] to-[#D4A017] mb-4">
						Coffy Character Collection
					</h2>
					<p className="text-lg text-[#E8D5B5] max-w-3xl mx-auto mb-6">
						Discover and purchase unique Coffy characters. Each character boosts your in-game rewards.<br/>
						More NFT items and in-game assets <span className="text-[#D4A017] font-semibold">coming soon</span>.
					</p>
								</div>
				<KeenSliderCarousel characterNFTs={characterNFTs} handleBuy={handleBuy} userAddress={userAddress} buyingId={buyingId} walletLoading={walletLoading} />
				<div className="mt-10 text-[#E8D5B5]/60 text-sm text-center">
					<span className="inline-block bg-[#D4A017]/10 text-[#D4A017] px-4 py-2 rounded-lg font-semibold">More NFT items and in-game assets coming in Q4!</span>
								</div>
					</div>
			</section>
	);
}

// Keen Slider Carousel Component
function KeenSliderCarousel({ characterNFTs, handleBuy, userAddress, buyingId, walletLoading }) {
	const [sliderRef] = useKeenSlider({
		loop: true,
		mode: 'free-snap',
		slides: { perView: 2.2, spacing: 24 },
		breakpoints: {
			'max-width: 640px': { slides: { perView: 1.1, spacing: 12 } },
			'min-width: 1024px': { slides: { perView: 3.2, spacing: 32 } },
		},
	});
	return (
		<div ref={sliderRef} className="keen-slider py-8">
			{characterNFTs.map((char, idx) => {
				// isOwned ve isProcessing state'leri eklenmeli, örnek olarak sadece id'ye göre false/true atanıyor
				const isOwned = false; // Gerçek sahiplik kontrolü eklenmeli
				const isProcessing = buyingId === char.id;
				return (
					<div className="keen-slider__slide flex justify-center" key={char.id}>
						<motion.div
							whileHover={{ scale: 1.06, boxShadow: '0 8px 32px rgba(212,160,23,0.18)' }}
							transition={{ type: 'spring', stiffness: 300, damping: 20 }}
							className={`group relative bg-gradient-to-br ${char.gradient} rounded-xl p-4 sm:p-6 transition-all duration-300 border border-white/20 backdrop-blur-sm min-h-[340px] flex flex-col cursor-pointer max-w-xs mx-auto`}
						>
							{/* Character Image */}
							<div className="relative h-48 mb-1 rounded-xl overflow-hidden flex items-center justify-center bg-black/10">
								<img
									src={char.image}
									alt={char.name}
									className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
									onError={(e) => {
										e.target.src = '/images/game-placeholder.jpg';
									}}
								/>
								<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
								{/* Price Badge */}
								<div className="absolute top-3 left-3 z-20">
									<span className="bg-[#D4A017]/90 text-white text-xs px-3 py-1 rounded-full font-bold shadow">
										{char.priceLabel}
									</span>
								</div>
								{/* Multiplier Badge */}
								<div className="absolute top-3 right-3 z-20">
									<span className="bg-[#222]/80 text-[#D4A017] text-xs px-2 py-1 rounded-full font-bold shadow border border-[#D4A017]/40">
										{char.multiplier}
									</span>
								</div>
							</div>
							{/* Character Info */}
							<div className="space-y-1 flex-1 flex flex-col">
								<h3 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-200 transition-colors">
									{char.name}
								</h3>
								<p className="text-sm text-white/90 leading-relaxed line-clamp-1 min-h-[1.5rem]">
									{char.description}
								</p>
								<div className="flex-1" />
								<motion.button
									className={`w-full mt-4 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 text-base
									${!userAddress
										? 'bg-gray-600 text-gray-300 cursor-not-allowed'
										: isOwned
										? 'bg-green-600 text-white cursor-default'
										: isProcessing
										? 'bg-gradient-to-r from-[#A77B06] to-[#7A5E05] text-white cursor-wait'
										: 'bg-gradient-to-r from-[#D4A017] to-[#A77B06] text-white hover:shadow-xl hover:scale-105'
									}`}
									onClick={() => !isOwned && !isProcessing && handleBuy(char)}
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
										: 'Buy Character'}
								</motion.button>
							</div>
							{/* Hover Overlay */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
						</motion.div>
					</div>
				);
			})}
		</div>
	);
}