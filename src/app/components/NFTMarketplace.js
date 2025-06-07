import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import useWeb3Wallet from './useWeb3Wallet';
import { ethers, parseEther, formatEther, isAddress } from 'ethers';
import { } from './contractDebugHelper';

// CoffyMemories NFT contract information
const NFT_CONTRACT_ADDRESS = "0x7191402b257f0E66Dff1B761AD9E9B0b4C44C82c";
const NFT_CONTRACT_ABI =[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "baseURI",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_royaltyReceiver",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
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
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
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
		"name": "ERC721InvalidReceiver",
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
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
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
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
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
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "newBaseURI",
				"type": "string"
			}
		],
		"name": "BaseURIUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "gameContract",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "authorized",
				"type": "bool"
			}
		],
		"name": "GameAuthorized",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "enum CoffyMemories.Tier",
				"name": "tier",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			}
		],
		"name": "mintSpecificTier",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"name": "MintStatusChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum CoffyMemories.Tier",
				"name": "tier",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "bonusPercentage",
				"type": "uint256"
			}
		],
		"name": "NFTMinted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "recoverToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
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
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
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
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "gameContract",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "authorized",
				"type": "bool"
			}
		],
		"name": "setAuthorizedGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "newBaseURI",
				"type": "string"
			}
		],
		"name": "setBaseURI",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"name": "setMintActive",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newPrice",
				"type": "uint256"
			}
		],
		"name": "setMintPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "percentage",
				"type": "uint256"
			}
		],
		"name": "setRoyaltyInfo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
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
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
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
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
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
		"name": "authorizedGames",
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
				"name": "owner",
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
		"inputs": [],
		"name": "BRONZE_BONUS",
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
		"name": "BRONZE_SUPPLY",
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
		"name": "bronzeMinted",
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
				"name": "player",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "baseReward",
				"type": "uint256"
			}
		],
		"name": "calculateBonusReward",
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
		"name": "coffyCoinContract",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractURI",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
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
		"name": "getContractInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "maxSupply",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "currentSupply",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "coffyToken",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "getPlayerMaxBonus",
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
				"name": "player",
				"type": "address"
			}
		],
		"name": "getPlayerNFTInfo",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "tokenIds",
				"type": "uint256[]"
			},
			{
				"internalType": "enum CoffyMemories.Tier[]",
				"name": "tiers",
				"type": "uint8[]"
			},
			{
				"internalType": "uint256[]",
				"name": "bonuses",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "tierNames",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTierSupplyInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "bronzeTotal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bronzeRemaining",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "silverTotal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "silverRemaining",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "goldTotal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "goldRemaining",
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
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getTokenInfo",
		"outputs": [
			{
				"internalType": "enum CoffyMemories.Tier",
				"name": "tier",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "bonusPercentage",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "tierName",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "GOLD_BONUS",
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
		"name": "GOLD_SUPPLY",
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
		"name": "goldMinted",
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
				"name": "player",
				"type": "address"
			}
		],
		"name": "hasNFTBonus",
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
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
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
		"name": "MAX_SUPPLY",
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
		"name": "mintActive",
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
		"name": "mintPrice",
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
		"name": "owner",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "salePrice",
				"type": "uint256"
			}
		],
		"name": "royaltyInfo",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
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
		"name": "royaltyPercentage",
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
		"name": "royaltyReceiver",
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
		"name": "SILVER_BONUS",
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
		"name": "SILVER_SUPPLY",
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
		"name": "silverMinted",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "tokensOfOwner",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
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
		"name": "tokenTier",
		"outputs": [
			{
				"internalType": "enum CoffyMemories.Tier",
				"name": "tier",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "bonusPercentage",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "tierName",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
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
	}
];

// Convert IPFS urls to HTTP gateway
function ipfsToHttp(url) {
	if (!url) return '';
	if (url.startsWith('ipfs://')) {
		return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
	}
	return url;
}

// 1. Add marketplace contract address and ABI
const MARKETPLACE_CONTRACT_ADDRESS = "0x2763b96c094806Acca1763dDcc551f0F65Ae5B01";
const MARKETPLACE_CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_feeRecipient",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_coffyMemoriesContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_coffyCoinContract",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "listingId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "priceBNB",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "priceCoffyCoin",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "acceptsBNB",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "acceptsCoffyCoin",
				"type": "bool"
			}
		],
		"name": "ItemListed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "listingId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "paidInBNB",
				"type": "bool"
			}
		],
		"name": "ItemSold",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "listingId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			}
		],
		"name": "ListingCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "offerId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "paidInBNB",
				"type": "bool"
			}
		],
		"name": "OfferAccepted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "offerId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			}
		],
		"name": "OfferCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "offerId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "offerInBNB",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "expiresAt",
				"type": "uint256"
			}
		],
		"name": "OfferMade",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "listingId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newPriceBNB",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newPriceCoffyCoin",
				"type": "uint256"
			}
		],
		"name": "PriceUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "offerIndex",
				"type": "uint256"
			}
		],
		"name": "acceptOffer",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"name": "activeListings",
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
				"name": "listingId",
				"type": "uint256"
			}
		],
		"name": "buyWithBNB",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "listingId",
				"type": "uint256"
			}
		],
		"name": "buyWithCoffyCoin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "listingId",
				"type": "uint256"
			}
		],
		"name": "cancelListing",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "offerIndex",
				"type": "uint256"
			}
		],
		"name": "cancelOffer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "cleanExpiredOffers",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "coffyCoinContract",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "coffyMemoriesContract",
		"outputs": [
			{
				"internalType": "contract IERC721",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "emergencyWithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feePercentage",
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
		"name": "feeRecipient",
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
		"name": "getActiveListings",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "listingId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "priceBNB",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "priceCoffyCoin",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "acceptsBNB",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "acceptsCoffyCoin",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "listedAt",
						"type": "uint256"
					}
				],
				"internalType": "struct CoffyNFTMarketplace.Listing[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "seller",
				"type": "address"
			}
		],
		"name": "getListingsBySeller",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "listingId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "priceBNB",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "priceCoffyCoin",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "acceptsBNB",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "acceptsCoffyCoin",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "listedAt",
						"type": "uint256"
					}
				],
				"internalType": "struct CoffyNFTMarketplace.Listing[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMarketplaceStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "activeListingsCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "feePercentage_",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "feeRecipient_",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "totalListings",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalOffers",
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
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getTokenOffers",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "offerId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "buyer",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "priceBNB",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "priceCoffyCoin",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "offerInBNB",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "expiresAt",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					}
				],
				"internalType": "struct CoffyNFTMarketplace.Offer[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "priceBNB",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "priceCoffyCoin",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "acceptsBNB",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "acceptsCoffyCoin",
				"type": "bool"
			}
		],
		"name": "listItem",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"name": "listingIndexInActive",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "listings",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "listingId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "priceBNB",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "priceCoffyCoin",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "acceptsBNB",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "acceptsCoffyCoin",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "listedAt",
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
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "offerInBNB",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "durationInDays",
				"type": "uint256"
			}
		],
		"name": "makeOffer",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
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
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newFeePercentage",
				"type": "uint256"
			}
		],
		"name": "setFeePercentage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newFeeRecipient",
				"type": "address"
			}
		],
		"name": "setFeeRecipient",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tokenOffers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "offerId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "priceBNB",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "priceCoffyCoin",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "offerInBNB",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "expiresAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tokenToListing",
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
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newCoffyMemories",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "newCoffyCoin",
				"type": "address"
			}
		],
		"name": "updateContracts",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "listingId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newPriceBNB",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newPriceCoffyCoin",
				"type": "uint256"
			}
		],
		"name": "updatePrice",
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userListings",
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
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userOffers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export default function NFTMarketplace() {
	const { userAddress, provider, signer } = useWeb3Wallet();
	const [nfts, setNfts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [status, setStatus] = useState('');
	const [selectedNFT, setSelectedNFT] = useState(null);
	const [transferAddress, setTransferAddress] = useState('');
	const [showTransferModal, setShowTransferModal] = useState(false);
	const [showListingModal, setShowListingModal] = useState(false);
	const [listingPrice, setListingPrice] = useState('');

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
				let items = [];
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
				for (let i = 1; i <= total; i++) {
					try {
						const owner = await contract.ownerOf(i);
						ownersSet.add(owner.toLowerCase());
						let uri = await contract.tokenURI(i);
						uri = ipfsToHttp(uri);
						let meta = {};
						try {
							meta = await fetch(uri).then(res => res.json());
						} catch {}
						const info = await contract.getTokenInfo(i);
						let displayBonus = 10;
						let tierName = info.tierName;
						// TierName'ı id'ye göre zorunlu olarak düzelt
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
						// Marketplace listing info
						let forSale = false;
						let price = "0";
						let listingId = null;
						if (listingMap[i]) {
							forSale = true;
							price = formatEther(listingMap[i].priceBNB);
							listingId = Number(listingMap[i].listingId);
						}
						items.push({
							id: i,
							owner,
							image: ipfsToHttp(meta.image) || '',
							name: meta.name || `Coffy NFT #${i}`,
							description: meta.description || '',
							tier: info.tier,
							bonus: displayBonus,
							tierName: tierName,
							forSale,
							price,
							listingId,
						});
					} catch {}
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
			setStatus('Please enter a valid price');
			return;
		}
		setIsLoading(true);
		setStatus('Listing NFT for sale...');
		try {
			const nftContract = getNFTContract();
			const marketplaceContract = getMarketplaceContract();
			// 1. Approve marketplace to transfer NFT (if not already approved)
			const approvedAddress = await nftContract.getApproved(selectedNFT.id);
			if (approvedAddress.toLowerCase() !== MARKETPLACE_CONTRACT_ADDRESS.toLowerCase()) {
				setStatus('Approving marketplace to transfer NFT...');
				const approveTx = await nftContract.approve(MARKETPLACE_CONTRACT_ADDRESS, selectedNFT.id);
				await approveTx.wait();
			} else {
				setStatus('NFT already approved for marketplace, listing directly...');
			}
			// 2. List item on marketplace
			const priceInWei = parseEther(listingPrice);
			const tx = await marketplaceContract.listItem(selectedNFT.id, priceInWei, 0, true, false);
			setStatus('Transaction sent...');
			await tx.wait();
			setStatus('NFT successfully listed for sale!');
			setShowListingModal(false);
			setListingPrice('');
			setSelectedNFT(null);
			setTimeout(() => window.location.reload(), 2000);
		} catch (err) {
			console.error('Listing error:', err);
			if (err.code === 4001) {
				setStatus('Transaction rejected by user');
			} else {
				setStatus('Listing failed: ' + (err.reason || err.message || 'Unknown error'));
			}
		} finally {
			setIsLoading(false);
		}
	};
	
	// 5. Buying NFT from marketplace
	const handlePurchase = async (nft) => {
		try {
			// 1. Network kontrolü
			const network = await provider.getNetwork();
			if (network.chainId !== 56n) {
				alert('Please switch to BSC Mainnet');
				return;
			}

			// 2. Balance kontrolü
			const hasEnoughBNB = await checkGasRequirement();
			if (!hasEnoughBNB) return;

			// 3. Debug listing
			await debugListing(nft.listingId);

			// 4. Static call test
			const priceInWei = parseEther(nft.price);
			const canPurchase = await testPurchaseCall(nft.listingId, priceInWei);
			if (!canPurchase) {
				alert('Purchase would fail. Check console for details.');
				return;
			}

			// 5. Actual purchase (ethers v6: getGasPrice yok, getFeeData var)
			// İsterseniz gasPrice'ı elle verebilirsiniz, ama çoğu durumda gerek yoktur.
			// const feeData = await provider.getFeeData();
			// const gasPrice = feeData.gasPrice;
			const tx = await getMarketplaceContract().buyWithBNB(nft.listingId, {
				value: priceInWei,
				gasLimit: 250000
				// gasPrice: gasPrice // Eğer elle vermek isterseniz yukarıdaki satırları açın
			});

			await tx.wait();
			setStatus('NFT successfully purchased!');
			setTimeout(() => window.location.reload(), 2000);

		} catch (error) {
			console.error('Purchase failed:', error);
			setStatus('Purchase failed: ' + (error.reason || error.message || 'Unknown error'));
		}
	};
	
	// Handle removing NFT from sale
	const handleRemoveFromSale = async (nftId) => {
		setIsLoading(true);
		setStatus('Removing NFT from sale...');
		
		try {
			const contract = getNFTContract();
			
			// Check if contract supports this function
			if (typeof contract.removeFromSale === 'function') {
				const tx = await contract.removeFromSale(nftId);
				setStatus('Transaction sent...');
				await tx.wait();
				setStatus('NFT removed from sale!');
				
				// Reload NFTs
				setTimeout(() => window.location.reload(), 2000);
			} else {
				setStatus('Marketplace functionality not supported by this contract');
			}
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

	// Hızlı test için yardımcı fonksiyonlar
	async function checkGasRequirement() {
		const balance = await provider.getBalance(userAddress);
		if (balance <= 0n) {
			alert('Insufficient BNB balance');
			return false;
		}
		return true;
	}

	async function debugListing(listingId) {
		const listing = await getMarketplaceContract().listings(listingId);
		console.log('Listing debug:', listing);
	}

	async function testPurchaseCall(listingId, priceInWei) {
		try {
			await getMarketplaceContract().buyWithBNB.staticCall(listingId, { value: priceInWei });
			return true;
		} catch (err) {
			console.error('Static call (test purchase) failed:', err);
			return false;
		}
	}

	// EMERGENCY DEBUG TOOLS
	useEffect(() => {
		const emergencyDebug = async () => {
			console.log('=== EMERGENCY DEBUG ===');
			// 1. Real network
			const network = await provider.getNetwork();
			console.log('Network chainId:', network.chainId);
			// 2. Contract verification
			const code = await provider.getCode(MARKETPLACE_CONTRACT_ADDRESS);
			console.log('Marketplace contract code exists:', code !== '0x');
			// 3. Function selector check
			const iface = new ethers.Interface(MARKETPLACE_CONTRACT_ABI);
			const selector = iface.getFunction('buyWithBNB').selector;
			console.log('buyWithBNB selector:', selector);
			// 4. Test with correct provider
			const network2 = await provider.getNetwork();
			console.log('Provider network (again):', network2.chainId);
			console.log('=== DEBUG COMPLETE ===');
		};
		if (provider) emergencyDebug();
	}, [provider]);

	return (
		<section className="py-20 bg-[#1A0F0A] relative overflow-hidden" id="nft-marketplace">
			<div className="absolute inset-0">
				<motion.div
					className="absolute inset-0"
					
					animate={{
						background: [
							'radial-gradient(circle at 0% 0%, rgba(212,160,23,0.15) 0%, transparent 70%)',
							'radial-gradient(circle at 100% 100%, rgba(212,160,23,0.15) 0%, transparent 70%)',
							'radial-gradient(circle at 0% 0%, rgba(212,160,23,0.15) 0%, transparent 70%)'
						]
					}}
					transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
				/>
				<div className="absolute inset-0 bg-[url('/images/coffee-beans-pattern.png')] opacity-[0.08] animate-slide"></div>
				<div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0A]/50 via-transparent to-[#1A0F0A]/50"></div>
			</div>
			<div className="container mx-auto px-6 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] to-[#A77B06]">
						NFT Marketplace
					</h2>
					<div className="w-24 h-1 bg-[#D4A017] mx-auto"></div>
					<p className="text-[#E8D5B5]/80 mt-4 text-lg max-w-2xl mx-auto">Explore the Coffy Memories NFT collection, transfer NFTs or purchase rare digital assets with exclusive benefits — only 50 ever minted! </p>
				</motion.div>

				{/* NFT Tier Information */}
				<div className="mb-8">
					<div className="flex flex-wrap justify-center gap-4">
						{nftTiers.map((tier, index) => (
							<motion.div 
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
								className={`bg-gradient-to-r ${tier.color} px-5 py-3 rounded-xl shadow-lg w-full max-w-xs`}
							>
								<div className="text-white font-bold text-xl mb-1">{tier.name} NFT</div>
								<div className="flex flex-col gap-1 items-start">
									<span className="font-bold text-lg text-white">+{tier.bonus}% Game Bonus</span>
									<span className="font-bold text-sm text-[#FFD700]">1 Year Free Coffee at Partner Cafes ☕</span>
								</div>
								<div className="text-white/80 text-xs mt-1">
									<span className="font-semibold"></span> 
								</div>
							</motion.div>
						))}
					</div>
				</div>

				<div className="flex justify-center mb-8">
					{!userAddress && (
						<div className="text-[#D4A017] text-center font-medium">Connect your wallet to interact with NFTs</div>
					)}
					{userAddress && (
						<span className="text-[#D4A017] font-medium">Wallet: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
					)}
				</div>

				{/* Collection Stats and View Mode Button */}
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
					<div className="flex gap-8 text-[#D4A017] text-sm font-semibold bg-[#2A1B13] px-4 py-2 rounded-full w-full justify-center text-center">
						<span>Total: {collectionStats.total} / Max: 50</span>
						<span>Unique Owners: {collectionStats.owners}</span>
					</div>
					<button
						className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4A017] to-[#A77B06] text-white text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
						onClick={() => setViewMode(viewMode === 'carousel' ? 'grid' : 'carousel')}
					>
						{viewMode === 'carousel' ? 'View All NFTs' : 'Compact View'}
					</button>
				</div>
				{status && <div className="text-center text-[#D4A017] mb-6 p-2 bg-[#2A1B13]/50 rounded-lg">{status}</div>}
				
				{/* NFT Carousel or Grid */}
				{isLoading ? (
					<div className="text-center text-[#D4A017] p-10">
						<div className="inline-block w-8 h-8 border-2 border-[#D4A017] border-t-transparent rounded-full animate-spin mr-2"></div>
						Loading NFTs...
					</div>
				) : sortedNFTs.length === 0 ? (
					<div className="text-center text-[#D4A017] p-10 bg-[#2A1B13]/30 rounded-lg">
						{nfts.length === 0 ? "No NFTs found in collection." : "No NFTs match your filters."}
					</div>
				) : viewMode === 'carousel' ? (
					<div className="w-full max-w-5xl mx-auto">
						{/* Carousel NFT cards */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
							{sortedNFTs.slice(carouselIndex * 4, carouselIndex * 4 + 4).map((nft) => (
								<motion.div
									key={nft.id}
									className={`bg-gradient-to-b from-[#3A2A1E] to-[#2A1B13] rounded-xl border ${
										nft.tierName?.toLowerCase().includes('gold') ? 'border-yellow-500/60' : 
										nft.tierName?.toLowerCase().includes('silver') ? 'border-gray-300/60' : 
										'border-amber-700/60'
									} p-3 flex flex-col items-center cursor-pointer min-h-[200px] h-full shadow-lg hover:shadow-[#D4A017]/20 hover:border-[#D4A017]/60 transition-all duration-300`}
									whileHover={{ scale: 1.05, y: -5 }}
									onClick={() => openPreview(nft)}
								>
									<div className="relative w-full mb-3">
										{nft.forSale && (
											<div className="absolute top-2 right-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded-full z-10 shadow-md">
												For Sale
											</div>
										)}
										{nft.forSale && (
											<div className="absolute top-2 left-2 bg-[#D4A017]/80 text-white text-xs px-2 py-1 rounded-full z-10 shadow-md">
												{parseFloat(nft.price).toFixed(3)} BNB
											</div>
										)}
										<div className={`absolute inset-0 bg-gradient-to-br ${
											nft.tierName?.toLowerCase().includes('gold') ? 'from-yellow-500/30' : 
											nft.tierName?.toLowerCase().includes('silver') ? 'from-gray-300/30' : 
											'from-amber-700/30'
										} to-transparent rounded-lg opacity-70`}></div>
										<img
											src={ipfsToHttp(nft.image) || '/images/nft-placeholder.png'}
											alt={nft.name}
											className="w-full h-24 object-cover rounded-lg border border-[#D4A017]/20 bg-[#1A0F0A]"
											loading="lazy"
											style={{ background: '#222', minHeight: 96 }}
										/>
									</div>
									<div className="text-sm font-bold text-[#D4A017] truncate w-full text-center mb-1">{nft.name}</div>
									<div className={`text-xs font-medium px-2 py-1 rounded-full mb-2 ${
										nft.tierName?.toLowerCase().includes('gold') ? 'bg-yellow-500/20 text-yellow-400' : 
										nft.tierName?.toLowerCase().includes('silver') ? 'bg-gray-300/20 text-gray-300' : 
										'bg-amber-700/20 text-amber-600'
									}`}>
										{nft.tierName}
									</div>
								</motion.div>
							))}
						</div>
						{/* Carousel Navigation */}
						<div className="flex items-center justify-between mt-4">
							<button 
								onClick={handlePrev} 
								className="w-10 h-10 rounded-full bg-[#D4A017]/80 text-white font-bold hover:bg-[#A77B06] flex items-center justify-center shadow-lg transition-all"
							>
								&lt;
							</button>
							<div className="flex gap-2">
								{Array.from({ length: Math.max(1, Math.ceil(sortedNFTs.length / 4)) }).map((_, i) => (
									<button
										key={i}
										className={`w-3 h-3 rounded-full transition-all ${carouselIndex === i ? 'bg-[#D4A017] scale-110' : 'bg-[#E8D5B5]/30'}`}
										onClick={() => handleDot(i)}
										disabled={sortedNFTs.length === 0}
									/>
								))}
							</div>
							<button 
								onClick={handleNext} 
								className="w-10 h-10 rounded-full bg-[#D4A017]/80 text-white font-bold hover:bg-[#A77B06] flex items-center justify-center shadow-lg transition-all"
							>
								&gt;
							</button>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{sortedNFTs.map((nft) => (
							<motion.div
								key={nft.id}
								className={`bg-gradient-to-b from-[#3A2A1E] to-[#2A1B13] rounded-xl border ${
									nft.tierName?.toLowerCase().includes('gold') ? 'border-yellow-500/60' : 
									nft.tierName?.toLowerCase().includes('silver') ? 'border-gray-300/60' : 
									'border-amber-700/60'
								} p-3 flex flex-col items-center cursor-pointer min-h-[200px] h-full shadow-lg hover:shadow-[#D4A017]/20 hover:border-[#D4A017]/60 transition-all duration-300`}
								whileHover={{ scale: 1.05, y: -5 }}
								onClick={() => openPreview(nft)}
							>
								<div className="relative w-full mb-3">
									{nft.forSale && (
										<div className="absolute top-2 right-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded-full z-10 shadow-md">
											For Sale
										</div>
									)}
									{nft.forSale && (
										<div className="absolute top-2 left-2 bg-[#D4A017]/80 text-white text-xs px-2 py-1 rounded-full z-10 shadow-md">
											{parseFloat(nft.price).toFixed(3)} BNB
										</div>
									)}
									<div className={`absolute inset-0 bg-gradient-to-br ${
										nft.tierName?.toLowerCase().includes('gold') ? 'from-yellow-500/30' : 
										nft.tierName?.toLowerCase().includes('silver') ? 'from-gray-300/30' : 
										'from-amber-700/30'
									} to-transparent rounded-lg opacity-70`}></div>
									<img
										src={ipfsToHttp(nft.image) || '/images/nft-placeholder.png'}
										alt={nft.name}
										className="w-full h-24 object-cover rounded-lg border border-[#D4A017]/20 bg-[#1A0F0A]"
										loading="lazy"
										style={{ background: '#222', minHeight: 96 }}
									/>
								</div>
								<div className="text-sm font-bold text-[#D4A017] truncate w-full text-center mb-1">{nft.name}</div>
								<div className={`text-xs font-medium px-2 py-1 rounded-full mb-2 ${
									nft.tierName?.toLowerCase().includes('gold') ? 'bg-yellow-500/20 text-yellow-400' : 
									nft.tierName?.toLowerCase().includes('silver') ? 'bg-gray-300/20 text-gray-300' : 
									'bg-amber-700/20 text-amber-600'
								}`}>
									{nft.tierName}
								</div>
							</motion.div>
						))}
					</div>
				)}
			</div>

			{/* Modals rendered here, as siblings to main content, but inside NFTMarketplace */}
			{(previewNFT || showTransferModal || showListingModal) && (
				<div className="absolute inset-0 z-50 pointer-events-auto flex items-center justify-center" style={{background: 'rgba(0,0,0,0.7)'}}>
					{/* Only render the relevant modal */}
					{previewNFT && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							className={`bg-gradient-to-b from-[#3A2A1E] to-[#2A1B13] p-5 sm:p-6 md:p-7 rounded-2xl border ${
								previewNFT.tierName?.toLowerCase().includes('gold') ? 'border-yellow-500/60' : 
								previewNFT.tierName?.toLowerCase().includes('silver') ? 'border-gray-300/60' : 
								'border-amber-700/60'
							} w-full max-w-sm md:max-w-md relative shadow-2xl max-h-[90vh] overflow-y-auto`}
							style={{ minWidth: '0', width: '100%' }}
							onClick={(e) => e.stopPropagation()}
						>
							<button 
								className="absolute top-2 right-2 text-[#D4A017] w-7 h-7 rounded-full bg-[#1A0F0A]/50 flex items-center justify-center hover:bg-[#1A0F0A] transition-all text-lg" 
								onClick={closePreview}
							>
								&times;
							</button>
							{/* Küçük görsel */}
							<div className="relative mb-4">
								<div className={`absolute -inset-1 bg-gradient-to-r ${
									previewNFT.tierName?.toLowerCase().includes('gold') ? 'from-yellow-500 to-yellow-700' : 
									previewNFT.tierName?.toLowerCase().includes('silver') ? 'from-gray-300 to-gray-500' : 
									'from-amber-700 to-amber-900'
								} rounded-xl blur opacity-30`}></div>
								<img
									src={ipfsToHttp(previewNFT.image) || '/images/nft-placeholder.png'}
									alt={previewNFT.name}
									className="w-full h-32 sm:h-36 md:h-40 object-cover rounded-lg border border-[#D4A017]/30 mx-auto bg-[#1A0F0A] relative"
									loading="lazy"
									style={{ background: '#222', minHeight: 80 }}
								/>
							</div>
							<div className="text-lg font-bold text-[#D4A017] mb-2 text-center break-words">{previewNFT.name}</div>
							<div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
								<div className={`text-xs font-medium px-2 py-1 rounded-full ${
									previewNFT.tierName?.toLowerCase().includes('gold') ? 'bg-yellow-500/20 text-yellow-400' : 
									previewNFT.tierName?.toLowerCase().includes('silver') ? 'bg-gray-300/20 text-gray-300' : 
									'bg-amber-700/20 text-amber-600'
								}`}>
									{previewNFT.tierName}
								</div>
							</div>
							<div className="text-[#E8D5B5]/70 text-xs mb-2 text-center truncate">
								Owner: {previewNFT.owner.slice(0, 6)}...{previewNFT.owner.slice(-4)}
							</div>
							<div className="text-[#E8D5B5] text-xs mb-3 text-center p-2 bg-[#1A0F0A]/50 rounded-lg max-h-16 overflow-y-auto leading-relaxed">
								{previewNFT.description || "This exclusive NFT grants special benefits in the Coffy ecosystem."}
							</div>
							<div className="bg-[#1A0F0A]/50 p-2 rounded-lg mb-3">
								<h4 className="text-[#D4A017] font-medium mb-1 text-center text-xs">NFT Benefits</h4>
								<p className="text-[#E8D5B5] text-xs text-center leading-relaxed">
									This NFT provides a <span className="font-bold text-[#D4A017]">{previewNFT.bonus}% bonus</span> to all in-game rewards and earnings.
									<span className="mx-2 text-[#D4A017] font-bold">|</span>
									<span className="font-bold text-[#FFD700]">1 year free coffee at partner cafes</span>
								</p>
							</div>
							<div className="flex gap-2 mt-2 flex-col sm:flex-row">
								<button
									className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#D4A017] to-[#A77B06] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs"
									onClick={() => { 
										if (previewNFT.forSale) {
											handlePurchase(previewNFT);
										} else {
											setSelectedNFT(previewNFT); 
											setShowTransferModal(true); 
											closePreview(); 
										}
									}}
								>
									{previewNFT.forSale ? `Buy for ${previewNFT.price} BNB` : "Transfer"}
								</button>
								{userAddress && previewNFT.owner.toLowerCase() === userAddress.toLowerCase() && (
									<button
										className="flex-1 py-2 rounded-lg border border-[#D4A017]/50 text-[#D4A017] font-semibold hover:bg-[#D4A017]/10 transition-all duration-300 text-xs"
										onClick={() => { 
											if (previewNFT.forSale) {
												handleRemoveFromSale(previewNFT.id);
											} else {
												setSelectedNFT(previewNFT); 
												setShowListingModal(true); 
												closePreview(); 
											}
										}}
									>
										{previewNFT.forSale ? "Remove from sale" : "List for sale"}
									</button>
								)}
								{!userAddress && (
									<button
										className="flex-1 py-2 rounded-lg border border-[#D4A017]/50 text-[#D4A017] font-semibold hover:bg-[#D4A017]/10 transition-all duration-300 text-xs"
										disabled
									>
										Connect wallet
									</button>
								)}
							</div>
						</motion.div>
					)}
					{showTransferModal && selectedNFT && (
						<div 
							className="bg-gradient-to-b from-[#3A2A1E] to-[#2A1B13] p-8 rounded-2xl border border-[#D4A017]/50 w-full max-w-md relative shadow-2xl max-h-[90vh] overflow-y-auto"
							onClick={(e) => e.stopPropagation()}
						>
							<button 
								className="absolute top-3 right-3 text-[#D4A017] w-8 h-8 rounded-full bg-[#1A0F0A]/50 flex items-center justify-center hover:bg-[#1A0F0A] transition-all" 
								onClick={() => setShowTransferModal(false)}
							>
								&times;
							</button>
							<h3 className="text-2xl font-bold text-[#D4A017] mb-6">Transfer NFT</h3>
							<div className="mb-4 text-[#E8D5B5]">NFT: <span className="font-semibold">{selectedNFT.name}</span></div>
							<input
								type="text"
								placeholder="Recipient wallet address"
								value={transferAddress}
								onChange={e => setTransferAddress(e.target.value)}
								className="w-full p-4 mb-6 rounded-lg bg-[#1A0F0A] text-[#E8D5B5] border border-[#D4A017]/30 focus:border-[#D4A017] focus:outline-none transition-all"
							/>
							<button
								className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4A017] to-[#A77B06] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
								onClick={handleTransfer}
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
										Processing...
									</>
								) : "Complete Transfer"}
							</button>
						</div>
					)}
					{showListingModal && selectedNFT && (
						<div 
							className="bg-gradient-to-b from-[#3A2A1E] to-[#2A1B13] p-8 rounded-2xl border border-[#D4A017]/50 w-full max-w-md relative shadow-2xl max-h-[90vh] overflow-y-auto"
							onClick={(e) => e.stopPropagation()}
						>
							<button 
								className="absolute top-3 right-3 text-[#D4A017] w-8 h-8 rounded-full bg-[#1A0F0A]/50 flex items-center justify-center hover:bg-[#1A0F0A] transition-all" 
								onClick={() => setShowListingModal(false)}
							>
								&times;
							</button>
							<h3 className="text-2xl font-bold text-[#D4A017] mb-6">List NFT for Sale</h3>
							<div className="mb-4 text-[#E8D5B5]">NFT: <span className="font-semibold">{selectedNFT.name}</span></div>
							
							<div className="mb-4">
								<label className="block text-[#E8D5B5] text-sm mb-2">Price (BNB)</label>
								<div className="relative">
									<input
										type="number"
										step="0.001"
										min="0"
										placeholder="0.00"
										value={listingPrice}
										onChange={e => setListingPrice(e.target.value)}
										className="w-full p-4 rounded-lg bg-[#1A0F0A] text-[#E8D5B5] border border-[#D4A017]/30 focus:border-[#D4A017] focus:outline-none transition-all"
									/>
									<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#D4A017]">BNB</span>
								</div>
							</div>
							
							<button
								className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4A017] to-[#A77B06] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
								onClick={handleListForSale}
								disabled={isLoading || !listingPrice}
							>
								{isLoading ? (
									<>
										<span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
										Processing...
									</>
								) : "List for Sale"}
							</button>
						</div>
					)}
				</div>
			)}
		</section>
	);
} 