// setting up client connection...
require("dotenv").config();

const { Client, AccountId, PrivateKey, TokenCreateTransaction } = require("@hashgraph/sdk");

async function main() {

// dotenv configuration for personal TESTNET account (id, private key)...
const operatorKey = PrivateKey.fromString(process.env.PRIVATE_KEY);
const operatorId = AccountId.fromString(process.env.ACCOUNT_ID);

// defining client for TESTNET...
let client = Client.forTestnet();

// use specific account info to operate...
client.setOperator(operatorId, operatorKey);



}