// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract NeonSecrecyFarm is SepoliaConfig {
    using FHE for *;
    
    struct FarmingPool {
        euint32 poolId;
        euint32 totalLiquidity;
        euint32 rewardRate;
        euint32 totalStaked;
        euint32 participantCount;
        bool isActive;
        bool isVerified;
        string name;
        string description;
        address creator;
        uint256 startTime;
        uint256 endTime;
        address tokenAddress;
        uint256 publicRewardPool; // Public reward pool for transparency
    }
    
    struct Stake {
        euint32 stakeId;
        euint32 amount;
        euint32 rewardAccumulated;
        address staker;
        uint256 timestamp;
        uint256 lastClaimTime;
        bool isActive;
    }
    
    struct RewardClaim {
        euint32 claimId;
        euint32 amount;
        address claimer;
        uint256 timestamp;
    }
    
    mapping(uint256 => FarmingPool) public pools;
    mapping(uint256 => Stake) public stakes;
    mapping(uint256 => RewardClaim) public rewardClaims;
    mapping(address => euint32) public userReputation;
    mapping(address => euint32) public totalStakedByUser;
    mapping(address => uint256) public userStakeCount;
    
    uint256 public poolCounter;
    uint256 public stakeCounter;
    uint256 public claimCounter;
    
    address public owner;
    address public verifier;
    uint256 public constant MIN_STAKE_AMOUNT = 1000; // Minimum stake amount in wei
    
    event PoolCreated(uint256 indexed poolId, address indexed creator, string name);
    event StakeDeposited(uint256 indexed stakeId, uint256 indexed poolId, address indexed staker, uint32 amount);
    event RewardClaimed(uint256 indexed claimId, uint256 indexed stakeId, address indexed claimer, uint32 amount);
    event PoolVerified(uint256 indexed poolId, bool isVerified);
    event ReputationUpdated(address indexed user, uint32 reputation);
    event LiquidityAdded(uint256 indexed poolId, uint256 amount);
    event StakeWithdrawn(uint256 indexed stakeId, address indexed staker);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyVerifier() {
        require(msg.sender == verifier, "Only verifier can call this function");
        _;
    }
    
    function createPool(
        string memory _name,
        string memory _description,
        uint256 _rewardRate,
        uint256 _duration,
        address _tokenAddress
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Pool name cannot be empty");
        require(_duration > 0, "Duration must be positive");
        require(_tokenAddress != address(0), "Invalid token address");
        
        uint256 poolId = poolCounter++;
        
        pools[poolId] = FarmingPool({
            poolId: FHE.asEuint32(0),
            totalLiquidity: FHE.asEuint32(0),
            rewardRate: FHE.asEuint32(0),
            totalStaked: FHE.asEuint32(0),
            participantCount: FHE.asEuint32(0),
            isActive: true,
            isVerified: false,
            name: _name,
            description: _description,
            creator: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            tokenAddress: _tokenAddress,
            publicRewardPool: 0
        });
        
        emit PoolCreated(poolId, msg.sender, _name);
        return poolId;
    }
    
    function stakeTokens(
        uint256 poolId,
        uint256 amount,
        externalEuint32 encryptedAmount,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(pools[poolId].creator != address(0), "Pool does not exist");
        require(pools[poolId].isActive, "Pool is not active");
        require(block.timestamp <= pools[poolId].endTime, "Pool has ended");
        require(amount >= MIN_STAKE_AMOUNT, "Stake amount too small");
        
        // Transfer tokens from user to contract (not direct transfer, but through contract interaction)
        IERC20 token = IERC20(pools[poolId].tokenAddress);
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
        uint256 stakeId = stakeCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(encryptedAmount, inputProof);
        
        stakes[stakeId] = Stake({
            stakeId: FHE.asEuint32(0),
            amount: internalAmount,
            rewardAccumulated: FHE.asEuint32(0),
            staker: msg.sender,
            timestamp: block.timestamp,
            lastClaimTime: block.timestamp,
            isActive: true
        });
        
        // Update pool totals
        pools[poolId].totalStaked = FHE.add(pools[poolId].totalStaked, internalAmount);
        pools[poolId].participantCount = FHE.add(pools[poolId].participantCount, FHE.asEuint32(1));
        
        // Update user's total staked amount
        totalStakedByUser[msg.sender] = FHE.add(totalStakedByUser[msg.sender], internalAmount);
        userStakeCount[msg.sender]++;
        
        emit StakeDeposited(stakeId, poolId, msg.sender, 0);
        return stakeId;
    }
    
    function claimRewards(
        uint256 stakeId,
        externalEuint32 rewardAmount,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(stakes[stakeId].staker == msg.sender, "Only staker can claim rewards");
        require(stakes[stakeId].isActive, "Stake is not active");
        require(stakes[stakeId].staker != address(0), "Stake does not exist");
        
        uint256 claimId = claimCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalRewardAmount = FHE.fromExternal(rewardAmount, inputProof);
        
        rewardClaims[claimId] = RewardClaim({
            claimId: FHE.asEuint32(0),
            amount: internalRewardAmount,
            claimer: msg.sender,
            timestamp: block.timestamp
        });
        
        // Update stake's accumulated rewards
        stakes[stakeId].rewardAccumulated = FHE.add(stakes[stakeId].rewardAccumulated, internalRewardAmount);
        stakes[stakeId].lastClaimTime = block.timestamp;
        
        emit RewardClaimed(claimId, stakeId, msg.sender, 0);
        return claimId;
    }
    
    function addLiquidityToPool(
        uint256 poolId,
        uint256 amount
    ) public {
        require(pools[poolId].creator == msg.sender, "Only pool creator can add liquidity");
        require(pools[poolId].isActive, "Pool must be active");
        require(amount > 0, "Amount must be positive");
        
        // Transfer tokens from creator to contract
        IERC20 token = IERC20(pools[poolId].tokenAddress);
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
        // Update public reward pool (transparent)
        pools[poolId].publicRewardPool += amount;
        
        emit LiquidityAdded(poolId, amount);
    }
    
    function withdrawStake(uint256 stakeId) public {
        require(stakes[stakeId].staker == msg.sender, "Only staker can withdraw");
        require(stakes[stakeId].isActive, "Stake is not active");
        require(block.timestamp > pools[0].endTime, "Pool must be ended");
        
        // Mark stake as inactive
        stakes[stakeId].isActive = false;
        
        // Update user's total staked amount (will be decrypted off-chain)
        totalStakedByUser[msg.sender] = FHE.sub(totalStakedByUser[msg.sender], stakes[stakeId].amount);
        userStakeCount[msg.sender]--;
        
        // Transfer tokens back to user (through contract interaction)
        // Note: In production, this would transfer the actual staked amount
        // For now, we'll transfer a placeholder amount to avoid direct transfer issues
        IERC20 token = IERC20(pools[0].tokenAddress);
        uint256 withdrawAmount = MIN_STAKE_AMOUNT; // Placeholder amount
        require(token.transfer(msg.sender, withdrawAmount), "Withdrawal failed");
        
        emit StakeWithdrawn(stakeId, msg.sender);
    }
    
    function verifyPool(uint256 poolId, bool isVerified) public onlyVerifier {
        require(pools[poolId].creator != address(0), "Pool does not exist");
        pools[poolId].isVerified = isVerified;
        emit PoolVerified(poolId, isVerified);
    }
    
    function updateReputation(address user, euint32 reputation) public onlyVerifier {
        require(user != address(0), "Invalid user address");
        userReputation[user] = reputation;
        emit ReputationUpdated(user, 0);
    }
    
    function getPoolInfo(uint256 poolId) public view returns (
        string memory name,
        string memory description,
        uint8 totalLiquidity,
        uint8 rewardRate,
        uint8 totalStaked,
        uint8 participantCount,
        bool isActive,
        bool isVerified,
        address creator,
        uint256 startTime,
        uint256 endTime,
        address tokenAddress,
        uint256 publicRewardPool
    ) {
        FarmingPool storage pool = pools[poolId];
        return (
            pool.name,
            pool.description,
            0, // FHE.decrypt(pool.totalLiquidity)
            0, // FHE.decrypt(pool.rewardRate)
            0, // FHE.decrypt(pool.totalStaked)
            0, // FHE.decrypt(pool.participantCount)
            pool.isActive,
            pool.isVerified,
            pool.creator,
            pool.startTime,
            pool.endTime,
            pool.tokenAddress,
            pool.publicRewardPool
        );
    }
    
    function getStakeInfo(uint256 stakeId) public view returns (
        uint8 amount,
        uint8 rewardAccumulated,
        address staker,
        uint256 timestamp,
        uint256 lastClaimTime,
        bool isActive
    ) {
        Stake storage stake = stakes[stakeId];
        return (
            0, // FHE.decrypt(stake.amount)
            0, // FHE.decrypt(stake.rewardAccumulated)
            stake.staker,
            stake.timestamp,
            stake.lastClaimTime,
            stake.isActive
        );
    }
    
    function getUserStakeCount(address user) public view returns (uint256) {
        return userStakeCount[user];
    }
    
    function getPoolPublicRewardPool(uint256 poolId) public view returns (uint256) {
        return pools[poolId].publicRewardPool;
    }
    
    // Emergency functions for owner
    function emergencyWithdraw(uint256 poolId, uint256 amount) public onlyOwner {
        require(pools[poolId].creator != address(0), "Pool does not exist");
        IERC20 token = IERC20(pools[poolId].tokenAddress);
        require(token.transfer(owner, amount), "Emergency withdrawal failed");
    }
    
    function setVerifier(address _verifier) public onlyOwner {
        verifier = _verifier;
    }
}