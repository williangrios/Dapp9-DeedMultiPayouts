// const DeedMultiPayouts = artifacts.require("DeedMultiPayouts");
// module.exports = function (deployer, _network, accounts){
//     deployer.deploy(DeedMultiPayouts, accounts[0], accounts[1], 1, {value: 100});
// }


const DeedMultiPayouts = artifacts.require("DeedMultiPayouts");

module.exports = function(deployer){
    const law = "0xB37886973b3bbb4d9a2CcAb2a9Ab0914a46F3b60";
    const ben = "0x16cC187AF3bc8fce7AEF43007f4d5Daf93E022BD";
    deployer.deploy(DeedMultiPayouts, law, ben, 5000, {value: 100000});
}