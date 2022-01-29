const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
    let instance = await StarNotary.deployed();
    // 1. create a Star with different tokenId
    let userAccount= accounts[0];
    let starId = 6;
    await instance.createStar('yay star 0', starId, {from: userAccount});
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    let name = await instance.name.call();
    let symbol = await instance.symbol.call();
    assert.equal(name, 'Vaystoken');
    assert.equal(symbol, 'VYT');
});

it('lets 2 users exchange stars', async() => {
    let instance = await StarNotary.deployed();
    // 1. create 2 Stars with different tokenId
    let userAccount1 = accounts[0];
    let userAccount2 =  accounts[1];
    let starId1 = 7;
    let starId2 = 8;
    await instance.createStar('yay star 2', starId1, {from: userAccount1});
    await instance.createStar('yay star 3', starId2, {from: userAccount2});
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    await instance.exchangeStars(starId1, starId2, {from: userAccount1});
    // 3. Verify that the owners changed
    assert.equal(await instance.ownerOf.call(starId1), userAccount2);
    assert.equal(await instance.ownerOf.call(starId2), userAccount1);
});

it('lets a user transfer a star', async() => {
    let instance = await StarNotary.deployed();
    // 1. create a Star with different tokenId
    let userAccount1 = accounts[1];
    let userAccount2 = accounts[2];
    let starId = 9;
    await instance.createStar('awesome star', starId, {from: userAccount1});
    // 2. use the transferStar function implemented in the Smart Contract
    await instance.transferStar(userAccount2, starId, {from: userAccount1});
    // 3. Verify the star owner changed.
    assert.equal(await instance.ownerOf.call(starId), userAccount2);

});

it('lookUptokenIdToStarInfo test', async() => {
    let instance = await StarNotary.deployed();
    // 1. create a Star with different tokenId
    let userAccount1 = accounts[0];
    let starId = 10;
    await instance.createStar('yay star 5', starId, {from: userAccount1});
    // 2. Call your method lookUptokenIdToStarInfo
    let starName = await instance.lookUptokenIdToStarInfo.call(starId);
    // 3. Verify if you Star name is the same
    assert.equal(starName, 'yay star 5');
});