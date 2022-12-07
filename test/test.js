

const DeedMultiPayouts = artifacts.require("DeedMultiPayouts");


contract("DeedMultiPayouts", (accounts) => {
    let deedMultiPayouts = null;
    before(async() => {
        deedMultiPayouts = await DeedMultiPayouts.deployed();
    });

    it('Should withdraw for all payouts (1)', async() =>{

        for (let i = 0 ; i< 4; i++){
            const balanceBefore = web3.utils.toBN( await web3.eth.getBalance(accounts[1]));
            await new Promisse(resolve = setTimeout(resolve, 1000));
            await deedMultiPayouts.withdraw({from: accounts[0]});
            const balanceAfter = web3.utils.toBN( await web3.eth.getBalance(accounts[1]));

            assert(balanceAfter.sub(balanceBefore).toNumber() == 25);
        }

    });

    it('Should withdraw for all payouts (2)', async() =>{

        const deedMultiPayouts = await DeedMultiPayouts.new(accounts[0], accounts[1], 1, {value: 100});

        before(async() => {
            deedMultiPayouts = await DeedMultiPayouts.deployed();
        });
    
        

        for (let i = 0 ; i< 2; i++){
            const balanceBefore = web3.utils.toBN( await web3.eth.getBalance(accounts[1]));
            await new Promisse(resolve = setTimeout(resolve, 2000));
            await deedMultiPayouts.withdraw({from: accounts[0]});
            const balanceAfter = web3.utils.toBN( await web3.eth.getBalance(accounts[1]));

            assert(balanceAfter.sub(balanceBefore).toNumber() == 50);
        }

    });

    it('Should NOT withdraw - too early', async() =>{
        //mesmos valores do migrations
        const deed = await Deed.new(accounts[0], accounts[1], 5, {value:100});
        try {
            await deed.withdraw({from: accounts[0]});    
        } catch (error) {
            assert(e.message.includes("Too early"));
            return;
        }
        assert(false);

    })

    it('Should NOT withdraw - Is not lawyer', async() =>{
        await new Promise(resolve => setTimeout(resolve, 5000));
        try {
            await deed.withdraw({from: accounts[3]});    
        } catch (error) {
            assert(e.message.includes("Lawyer Only can do it"));
            return;
        }
        assert(false);
    })
})