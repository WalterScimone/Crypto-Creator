// inquirer...
var questions = [{
        type: "input",
        name: "tokenName",
        message: "What would you like to call your cryptocurrency?",
    },
    {
        type: "input",
        name: "tokenSymbol",
        message: "What would you like as symbol?",
    },
    {
        type: "number",
        name: "initialSupply",
        message: "What is the initial supply you would like to create?",
    },
    {
        type: "number",
        name: "maxSupply",
        message: "What is the max supply you would like to create?",
    }

];

export default questions;