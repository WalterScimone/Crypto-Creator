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

    // create a new HTS token...
    var createTokenTransaction = await new TokenCreateTransaction()
        .setTokenName("Portage Lakes Token")
        .setTokenSymbol("PLX")
        .setDecimals(0)
        .setInitialSupply(10000)
        .setTreasuryAccountId(operatorId)
        .execute(client);

    // get receipt of transaction to retrieve the specific token ID...
    var createReceipt = await createTokenTransaction.getReceipt(client);
    var newTokenId = createReceipt.tokenId;

    // print the token id to string...
    console.log("the new token ID is:", newTokenId.toString());
}

main();