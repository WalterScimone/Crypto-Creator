// setting up client connection...
require("dotenv").config();

const { Client, AccountId, PrivateKey, TokenCreateTransaction, TokenAssociateTransaction, TransferTransaction, AccountBalanceQuery } = require("@hashgraph/sdk");

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

    // grab info of 2nd account from dotenv...
    const account2Id = AccountId.fromString(process.env.ACCOUNT_ID_2);
    const account2Key = PrivateKey.fromString(process.env.PRIVATE_KEY_2);

    // associate new account with new token...
    var associateTransaction = await new TokenAssociateTransaction()
        .setAccountId(account2Id)
        .setTokenIds([newTokenId])
        .freezeWith(client)
        .sign(account2Key)

    var submitAssociateTransaction = await associateTransaction.execute(client);
    var associateReceipt = await submitAssociateTransaction.getReceipt(client);

    console.log("associate tx receipt ", associateReceipt);

    // transfer tokens from treasury (operator account) into second account...
    var transferTransaction = await new TransferTransaction()
        .addTokenTransfer(newTokenId, operatorId, -10) // deduct 10 tokens from treasury...
        .addTokenTransfer(newTokenId, account2Id, 10) // increase 10 tokens to second account...
        .execute(client);

    var transferReceipt = await transferTransaction.getReceipt(client);

    console.log("transfer tx receipt: ", transferReceipt);

    // check balance of treasury account...
    var treasuryBalance = await new AccountBalanceQuery()
        .setAccountId(operatorId)
        .execute(client);
    console.log("treasury balance is: ", treasuryBalance.tokens.toString());

    // check balance for second account...
    var secondBalance = await new AccountBalanceQuery()
        .setAccountId(account2Id)
        .execute(client);
    console.log("second account balance is: ", secondBalance.tokens.toString());

}

main();