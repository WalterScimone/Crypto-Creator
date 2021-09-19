//Necessary dependencies...
import inquirer from 'inquirer';
import questions from "./createCrypto.js";
//import queryCrypto from "./queryCrypto.js"
import dotenv from 'dotenv';
dotenv.config();

//Hedera sdk...
import {
    Client,
    TokenCreateTransaction,
    AccountId,
    TokenType,
    PrivateKey,
    TokenSupplyType,
    TokenAssociateTransaction,
    AccountBalanceQuery
} from '@hashgraph/sdk';

const treasuryId = AccountId.fromString(process.env.ACCOUNT_ID);
const treasuryKey = PrivateKey.fromString(process.env.PRIVATE_KEY);
const account2Id = AccountId.fromString(process.env.ACCOUNT_ID2);
const account2Key = PrivateKey.fromString(process.env.PRIVATE_KEY2);

// defining client for TESTNET...
let client = Client.forTestnet();

// use specific account info to operate...
client.setOperator(treasuryId, treasuryKey);


//.env credentials required for client...
//const client = (() => {
// try {
// return Client.forTestnet()
//  .setOperator(
//     process.env.ACCOUNT_ID,
//     process.env.PRIVATE_KEY
//  )
/// } catch {
//   throw new Error(
//  '.env ACCOUNT_ID and PRIVATE_KEY required.'
// );
//  }
//})();


//Create token with inquirer...
async function createToken() {
    inquirer.prompt(questions).then(async function(answers) {
        const tx = await new TokenCreateTransaction();

        try {
            tx.setTokenName(answers.tokenName);
            tx.setTokenType(TokenType.FungibleCommon);
            tx.setInitialSupply(answers.initialSupply);
            tx.setSupplyType(TokenSupplyType.Finite);
            tx.setMaxSupply(answers.maxSupply);
            tx.setSupplyKey(PrivateKey.fromString(process.env.PRIVATE_KEY));
            tx.setTokenSymbol(answers.tokenSymbol);
            tx.setDecimals(0);
            tx.setTreasuryAccountId(AccountId.fromString(process.env.ACCOUNT_ID));
            tx.freezeWith(client);

            await tx.signWithOperator(client);

            const response = await tx.execute(client);
            const txReceipt = await response.getReceipt(client);

            let tokenNumber = txReceipt.tokenId;
            console.log("Congratulations! You just created a cryptocurrency powered by Hedera Hashgraph.");
            console.log("token ID is: ", "0.0.", tokenNumber.num.toNumber());
            console.log("token name is: ", answers.tokenName);
            console.log("token symbol is: ", answers.tokenSymbol);
            console.log("Token initial supply is: ", answers.initialSupply);
            console.log("Token total supply is: ", answers.maxSupply);
            console.log("To check the tokenCreate transaction, please visit https://testnet.dragonglass.me ")
        } catch (error) {
            console.log(error);
        }
    })
}

createToken();