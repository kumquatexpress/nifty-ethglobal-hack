const MintConfig = artifacts.require("./MintConfig.sol");

let configInstance;

contract("MintConfig", (accounts) => {
  beforeEach(async () => {
    configInstance = await MintConfig.new(
      Math.floor(Number(Date.now() / 1000) + 5000),
      accounts[0]
    );
  });

  it("...stores things", async () => {
    let storedData = await configInstance.getAll();
    console.log("stored", storedData);
    await configInstance.addBatch(["asdf"], { from: accounts[0] });

    // Get stored value
    storedData = await configInstance.getAll();

    console.log("stored", storedData);
  });

  it("...pops things", async () => {
    await configInstance.addBatch(["asdf", "asdf2"], { from: accounts[0] });

    let val = await configInstance.popOne({ from: accounts[0] });

    console.log("val", val);

    val = await configInstance.popOne({ from: accounts[0] });
    console.log("val", val);
  });
});
