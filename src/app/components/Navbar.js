"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, 
  Wallet, 
  Gamepad2, 
  Coins, 
  Store, 
  Info, 
  Menu, 
  X, 
  Shield,
  Clock,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { BrowserProvider, Contract } from "ethers";

const COFFY_CONTRACT_ADDRESS = "0x54e3ffFD370E936323EC75551297b3bA5Fa63330";
const COFFY_ABI = [{"inputs":[{"internalType":"address","name":"_treasury","type":"address"},{"internalType":"address","name":"_liquidity","type":"address"},{"internalType":"address","name":"_community","type":"address"},{"internalType":"address","name":"_team","type":"address"},{"internalType":"address","name":"_marketing","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AccessControlBadConfirmation","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"neededRole","type":"bytes32"}],"name":"AccessControlUnauthorizedAccount","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"BridgeModuleSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"characterId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"CharacterPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"CrossChainEnabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"CrossChainModuleSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"penalty","type":"uint256"}],"name":"EarlyUnstakePenalty","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"GameRewardsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBurnedThisYear","type":"uint256"}],"name":"GlobalModuleBurn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalMintedThisYear","type":"uint256"}],"name":"GlobalModuleMint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"InflationMinted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"moduleType","type":"string"}],"name":"ModuleEnabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"moduleType","type":"string"},{"indexed":false,"internalType":"address","name":"module","type":"address"}],"name":"ModuleSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"rewardType","type":"string"}],"name":"PendingRewardAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"totalAmount","type":"uint256"}],"name":"PendingRewardsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[],"name":"TradingEnabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Unstaked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"wallet","type":"address"},{"indexed":false,"internalType":"string","name":"profileId","type":"string"}],"name":"UserProfileLinked","type":"event"},{"inputs":[],"name":"ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ANNUAL_RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"COMMUNITY_ALLOCATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DAO_MEMBERSHIP_THRESHOLD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEX_TAX","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EARLY_UNSTAKE_PENALTY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FIXED_CHARACTERS_COUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LEGENDARY_CHARACTER_ID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LIQUIDITY_ALLOCATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MARKETING_ALLOCATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_WEEKLY_CLAIM","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_ACTIVITY_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_BALANCE_FOR_ACCUMULATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_CLAIM_BALANCE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_WALLET_AGE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MODULE_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PENDING_REWARD_EXPIRY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SEMIANNUAL_INFLATION_RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TEAM_ALLOCATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TIMELOCK_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TIMELOCK_DELAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOTAL_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TREASURY_ALLOCATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"authorizedModules","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"characterNames","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"characters","outputs":[{"internalType":"uint128","name":"price","type":"uint128"},{"internalType":"uint128","name":"totalSupply","type":"uint128"},{"internalType":"uint128","name":"maxSupply","type":"uint128"},{"internalType":"uint16","name":"multiplier","type":"uint16"},{"internalType":"uint16","name":"claimMultiplier","type":"uint16"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"string","name":"metadataURI","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"baseAmount","type":"uint256"}],"name":"claimGameRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimPendingRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"claimedThisWeek","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"community","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"daoEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"daoModule","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"emergencyUnstake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"enableDAO","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"enableNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"enableSocial","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"enableTrading","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"module","type":"address"}],"name":"executeModuleDeauthorization","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"gameStats","outputs":[{"internalType":"uint256","name":"totalGamesPlayed","type":"uint256"},{"internalType":"uint256","name":"totalRewardsClaimed","type":"uint256"},{"internalType":"uint256","name":"lastGameTimestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getActivityStatus","outputs":[{"internalType":"uint256","name":"gameStartTime","type":"uint256"},{"internalType":"uint256","name":"stepStartTime","type":"uint256"},{"internalType":"bool","name":"canClaimGame","type":"bool"},{"internalType":"bool","name":"canClaimStep","type":"bool"},{"internalType":"uint256","name":"remainingGameTime","type":"uint256"},{"internalType":"uint256","name":"remainingStepTime","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_characterId","type":"uint256"}],"name":"getCharacter","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"totalSupply","type":"uint256"},{"internalType":"uint256","name":"maxSupply","type":"uint256"},{"internalType":"uint256","name":"multiplier","type":"uint256"},{"internalType":"uint256","name":"claimMultiplier","type":"uint256"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"string","name":"metadataURI","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getCharacterMultiplier","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getGameStats","outputs":[{"internalType":"uint256","name":"totalGamesPlayed","type":"uint256"},{"internalType":"uint256","name":"totalRewardsClaimed","type":"uint256"},{"internalType":"uint256","name":"lastGameTimestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getGlobalModuleLimits","outputs":[{"internalType":"uint256","name":"maxAnnualMint","type":"uint256"},{"internalType":"uint256","name":"maxAnnualBurn","type":"uint256"},{"internalType":"uint256","name":"mintedThisYear","type":"uint256"},{"internalType":"uint256","name":"burnedThisYear","type":"uint256"},{"internalType":"uint256","name":"remainingMint","type":"uint256"},{"internalType":"uint256","name":"remainingBurn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getInflationInfo","outputs":[{"internalType":"uint256","name":"lastTime","type":"uint256"},{"internalType":"uint256","name":"nextTime","type":"uint256"},{"internalType":"bool","name":"canTrigger","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getModuleStates","outputs":[{"internalType":"address","name":"dao","type":"address"},{"internalType":"bool","name":"daoActive","type":"bool"},{"internalType":"address","name":"nft","type":"address"},{"internalType":"bool","name":"nftActive","type":"bool"},{"internalType":"address","name":"social","type":"address"},{"internalType":"bool","name":"socialActive","type":"bool"},{"internalType":"address","name":"crossChain","type":"address"},{"internalType":"bool","name":"crossChainActive","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getPendingRewardsStatus","outputs":[{"internalType":"uint256","name":"totalPending","type":"uint256"},{"internalType":"uint256","name":"gameRewards","type":"uint256"},{"internalType":"uint256","name":"stepRewards","type":"uint256"},{"internalType":"uint256","name":"snapRewards","type":"uint256"},{"internalType":"bool","name":"canClaim","type":"bool"},{"internalType":"bool","name":"hasExpired","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getRemainingDailyLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getStakeInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"pendingReward","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStakingAPY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUnstakePenalty","outputs":[{"internalType":"uint256","name":"penalty","type":"uint256"},{"internalType":"bool","name":"hasPenalty","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_characterId","type":"uint256"}],"name":"getUserCharacterBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserCharacterMultiplier","outputs":[{"internalType":"uint256","name":"multiplier","type":"uint256"},{"internalType":"string","name":"eligibleCharacter","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"wallet","type":"address"}],"name":"getUserProfile","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"profileId","type":"string"}],"name":"getWalletByProfile","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isConstWallet","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isDAOMember","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isDEXPair","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastClaimWeek","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastGameStart","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastInflationTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastPendingUpdate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastRewardWeek","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastStepStart","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"profileId","type":"string"}],"name":"linkUserProfile","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"liquidity","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"marketing","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_characterId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"migrateToNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mobileAppBackend","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextCharacterId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nftEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nftModule","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"pendingGameRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"pendingSnapRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"pendingStepRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"processSocialReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"profileToWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_characterId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"purchaseCharacter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"callerConfirmation","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"module","type":"address"}],"name":"scheduleModuleDeauthorization","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_module","type":"address"}],"name":"setCoffeeShopModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_module","type":"address"}],"name":"setDAOModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_backend","type":"address"}],"name":"setMobileBackend","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_module","type":"address"}],"name":"setNFTModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_module","type":"address"}],"name":"setSocialModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"socialEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"socialModule","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"stakes","outputs":[{"internalType":"uint128","name":"amount","type":"uint128"},{"internalType":"uint64","name":"startTime","type":"uint64"},{"internalType":"uint64","name":"lastClaim","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"startGame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startGameSession","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startStep","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"team","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStaked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferForModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"treasury","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"triggerInflation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userCharacters","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userProfiles","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"walletCreatedAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"weeklyRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Wallet states
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  
  // Verification states
  const [verificationTimestamp, setVerificationTimestamp] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Timer management
  useEffect(() => {
    localStorage.removeItem('coffy_human_verification_ts');
    setVerificationTimestamp(null);
  }, []);

  useEffect(() => {
    if (!verificationTimestamp) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = verificationTimestamp + 7 * 24 * 60 * 60 * 1000 - now;
      setTimer(diff > 0 ? diff : 0);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [verificationTimestamp]);

  const formatTimer = (ms) => {
    if (ms <= 0) return null;
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  // Wallet connection
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setIsConnected(true);
        setUserAddress(accounts[0]);
      } catch (error) {
        console.error('Wallet connection failed:', error);
      }
    }
  };

  // Human verification
  const handleHumanVerification = async () => {
    setIsVerifying(true);
    try {
      let address = userAddress;
      if (!isConnected) {
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          setIsConnected(true);
          setUserAddress(accounts[0]);
          address = accounts[0];
        }
      }
      // Ethers v6 ile kontrata linkUserProfile çağrısı gönder
      if (window.ethereum && address) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(COFFY_CONTRACT_ADDRESS, COFFY_ABI, signer);
        const profileId = address.slice(2, 10);
        const tx = await contract.linkUserProfile(profileId);
        await tx.wait();
        console.log("✅ linkUserProfile kontrata gönderildi ve onaylandı");
      }

      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const now = Date.now();
      setVerificationTimestamp(now);
      localStorage.setItem('coffy_human_verification_ts', now.toString());
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNavigation = (sectionId) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        // Get navbar height dynamically
        const navbar = document.querySelector('nav');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight - 8;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        if (isMobileMenuOpen) {
          setTimeout(() => setIsMobileMenuOpen(false), 300);
        }
      }
    }, 50); // Wait for DOM to be ready
  };

  // Add a separate handler for logo click
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (isMobileMenuOpen) {
      setTimeout(() => setIsMobileMenuOpen(false), 300);
    }
  };

  // Navigation items
  const navItems = [
    { id: 'games', label: 'Games', icon: Gamepad2, subtitle: 'Earn COFFY' },
    { id: 'about', label: 'About Coffy', icon: Info, subtitle: 'Learn More' },
    { id: 'staking', label: 'Staking', icon: Coins, subtitle: 'Earn Rewards' },
    { id: 'coffy-marketplace', label: 'Coffy Marketplace', icon: Store, subtitle: 'Trade Assets' }
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-amber-950/95 backdrop-blur-xl shadow-2xl border-b border-amber-800/20' 
          : 'bg-transparent'
      }`}
    >
      {/* Scroll Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600"
        style={{ width: `${scrollProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
      />

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <motion.div 
            className="flex items-center cursor-pointer" 
            whileHover={{ scale: 1.08, rotate: 2 }} 
            whileTap={{ scale: 0.95 }}
            onClick={handleLogoClick}
          >
            <Image 
              src="/images/coffy-logo.png" 
              alt="Coffy Logo" 
              width={45} 
              height={45} 
              priority 
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 animate-float shadow-lg" 
            />
            <span className="ml-2 text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] to-[#A77B06]">
              COFFY
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            
            {/* Main Navigation */}
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className="group relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-amber-900/30"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-5 h-5 text-amber-300 group-hover:text-amber-200 transition-colors duration-300" />
                  <span className="text-sm font-medium text-amber-100 group-hover:text-white transition-colors duration-300">
                    {item.label}
                  </span>
                  <span className="text-xs text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.subtitle}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              ))}
            </div>

            {/* Human Verification */}
            <div className="relative">
              <motion.button
                onClick={timer > 0 || isVerifying ? undefined : handleHumanVerification}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                disabled={timer > 0 || isVerifying}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  timer > 0 
                    ? 'bg-emerald-900/50 text-emerald-300 cursor-default' 
                    : isVerifying
                    ? 'bg-amber-900/50 text-amber-300 cursor-wait'
                    : 'bg-amber-800/50 text-amber-200 hover:bg-amber-700/50 hover:text-amber-100 hover:scale-105'
                }`}
                whileHover={timer > 0 || isVerifying ? {} : { scale: 1.05 }}
                whileTap={timer > 0 || isVerifying ? {} : { scale: 0.95 }}
              >
                {timer > 0 ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Verified</span>
                    <span className="text-xs text-amber-200 ml-2">{formatTimer(timer)} left</span>
                  </>
                ) : isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Verifying...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Verify Human</span>
                  </>
                )}
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute left-1/2 top-full mt-2 -translate-x-1/2 px-4 py-2 rounded-lg bg-amber-950/95 text-amber-100 text-xs shadow-lg border border-amber-800/30 z-50"
                  >
                    {timer > 0 
                      ? `Verification expires in ${formatTimer(timer)}`
                      : 'Verify to prevent bots and earn rewards'
                    }
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-950 border-l border-t border-amber-800/30 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wallet Connection */}
            <motion.button
              onClick={connectWallet}
              className="relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Wallet className="w-5 h-5" />
              <div className="flex flex-col items-start">
                <span className="text-sm leading-none">
                  {isConnected ? `${userAddress?.slice(0, 6)}...` : 'Connect'}
                </span>
                <span className="text-xs opacity-90 leading-none">
                  {isConnected ? 'Wallet' : 'Get Started'}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/20 to-amber-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 text-amber-300 hover:text-amber-200 transition-colors duration-300 rounded-xl hover:bg-amber-900/30 active:scale-95 touch-manipulation"
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle mobile menu"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden absolute left-0 right-0 top-full bg-amber-950/98 backdrop-blur-xl border-t border-amber-800/30 shadow-2xl z-40"
            >
              <div className="py-6 px-4 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleNavigation(item.id)}
                    className="w-full flex items-center gap-4 px-6 py-4 text-left text-amber-200 hover:text-white hover:bg-amber-900/40 rounded-xl transition-all duration-300 active:scale-95 touch-manipulation"
                  >
                    <item.icon className="w-6 h-6 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium text-base">{item.label}</span>
                      <span className="text-sm text-amber-500">{item.subtitle}</span>
                    </div>
                  </motion.button>
                ))}
                
                <div className="pt-4 border-t border-amber-800/30 space-y-3">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={timer > 0 || isVerifying ? undefined : handleHumanVerification}
                    disabled={timer > 0 || isVerifying}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 touch-manipulation ${
                      timer > 0 
                        ? 'bg-emerald-900/40 text-emerald-300' 
                        : 'bg-amber-800/40 text-amber-200 hover:bg-amber-700/40 active:scale-95'
                    }`}
                  >
                    {timer > 0 ? (
                      <>
                        <CheckCircle className="w-6 h-6 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-medium text-base">Verified Human</span>
                          <span className="text-sm text-emerald-400">{formatTimer(timer)} left</span>
                        </div>
                      </>
                    ) : isVerifying ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin flex-shrink-0" />
                        <span className="font-medium text-base">Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-6 h-6 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-medium text-base">Verify Human</span>
                          <span className="text-sm text-amber-500">Anti-Bot Protection</span>
                        </div>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={connectWallet}
                    className="w-full flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all duration-300 active:scale-95 touch-manipulation shadow-lg"
                  >
                    <Wallet className="w-6 h-6 flex-shrink-0" />
                    <div className="flex flex-col items-start">
                      <span className="text-base">{isConnected ? `${userAddress?.slice(0, 6)}...${userAddress?.slice(-4)}` : 'Connect Wallet'}</span>
                      <span className="text-sm opacity-90">{isConnected ? 'Connected' : 'Get Started'}</span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}