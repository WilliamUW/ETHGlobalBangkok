We are leveraging Zircuit's low fees, high security, and scalability to potentially store and manage millions of records for Hydrofy. This allows us to efficiently scale across hundreds of cities while ensuring seamless transactions and decentralized ownership of public amenity data.

https://explorer.testnet.zircuit.com/address/0x632e69488E25F1beC16A11cF1AA7B2261f2B94ef?activeTab=3

Braga was helping me with verifying my smart contract. Unfortunately the testnet explorer UI and foundry was not allowing me to verify the smart contract, and Braga said to not "waste time debugging it for now, we will check it out on our end"

Otherwise deployment was very straight forward!

forge verify-contract --verifier-url https://explorer.testnet.zircuit.com/api/contractVerifyHardhat 0x632e69488E25F1beC16A11cF1AA7B2261f2B94ef contracts/contract.sol:RecordTracker --root . --etherscan-api-key 91C25FD8AB4BE403C5B4C97ECDACAB25EF